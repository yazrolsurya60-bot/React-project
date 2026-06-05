<?php
// ============================================================
// ORDERS (CHECKOUT, HISTORY & DASHBOARD STATS) ENDPOINT
// ============================================================
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($method) {
    case 'GET':
        if ($action === 'get_stats') {
            try {
                // 1. Total Revenue
                $stmt = $conn->query("SELECT SUM(total) as total_revenue FROM orders");
                $revenue = floatval($stmt->fetch()['total_revenue'] ?? 0);

                // 2. Total Transactions
                $stmt = $conn->query("SELECT COUNT(*) as total_transactions FROM orders");
                $transactions = intval($stmt->fetch()['total_transactions'] ?? 0);

                // 3. Bestselling Menu
                $stmt = $conn->query("
                    SELECT m.name, SUM(oi.quantity) as sold 
                    FROM order_items oi 
                    JOIN menus m ON oi.menu_id = m.id 
                    GROUP BY oi.menu_id 
                    ORDER BY sold DESC 
                    LIMIT 1
                ");
                $bestseller = $stmt->fetch();
                $bestseller_name = $bestseller ? $bestseller['name'] : 'Belum ada';
                $bestseller_qty = $bestseller ? intval($bestseller['sold']) : 0;

                // 4. Chart Data (Last 7 Days)
                // Using a list of default last 7 days to ensure we have nodes even if 0 sales
                $days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
                $chartData = [];
                
                for ($i = 6; $i >= 0; $i--) {
                    $date = date('Y-m-d', strtotime("-$i days"));
                    $dayName = $days[date('w', strtotime($date))];
                    
                    $stmt = $conn->prepare("SELECT SUM(total) as daily_total FROM orders WHERE DATE(created_at) = :date");
                    $stmt->execute(['date' => $date]);
                    $total = floatval($stmt->fetch()['daily_total'] ?? 0);
                    
                    $chartData[] = [
                        'name' => $dayName,
                        'total' => $total
                    ];
                }

                echo json_encode([
                    "success" => true,
                    "stats" => [
                        "total_revenue" => $revenue,
                        "total_transactions" => $transactions,
                        "bestseller" => [
                            "name" => $bestseller_name,
                            "sold" => $bestseller_qty
                        ],
                        "chart_data" => $chartData
                    ]
                ]);
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(["success" => false, "message" => $e->getMessage()]);
            }
        } else {
            // Get Order History
            try {
                $stmt = $conn->query("SELECT id, customer_name, cashier_name, subtotal, discount, total, created_at as date FROM orders ORDER BY created_at DESC");
                $orders = $stmt->fetchAll();

                // Format order items for each order
                $formattedOrders = [];
                foreach ($orders as $order) {
                    // Check order status based on kitchen items status
                    $stmtItems = $conn->prepare("
                        SELECT oi.id, oi.menu_id, oi.quantity, oi.notes, oi.customization, oi.status, m.name, m.price, m.category
                        FROM order_items oi
                        JOIN menus m ON oi.menu_id = m.id
                        WHERE oi.order_id = :order_id
                    ");
                    $stmtItems->execute(['order_id' => $order['id']]);
                    $items = $stmtItems->fetchAll();

                    // Parse JSON customization and count status
                    $todoCount = 0;
                    $progressCount = 0;
                    $doneCount = 0;
                    $parsedItems = [];

                    foreach ($items as $item) {
                        $parsedItem = [
                            'id' => intval($item['menu_id']),
                            'cartId' => $item['id'],
                            'name' => $item['name'],
                            'price' => floatval($item['price']),
                            'quantity' => intval($item['quantity']),
                            'notes' => $item['notes'],
                            'category' => $item['category'],
                            'customization' => json_decode($item['customization'], true),
                            'status' => $item['status']
                        ];
                        $parsedItems[] = $parsedItem;

                        if ($item['status'] === 'todo') $todoCount++;
                        elseif ($item['status'] === 'progress') $progressCount++;
                        elseif ($item['status'] === 'done') $doneCount++;
                    }

                    // Dynamically compute order status
                    // If no items at all, default to done. If all items done -> Selesai. Else -> Diproses.
                    $orderStatus = 'Selesai';
                    if (count($items) > 0) {
                        if ($doneCount < count($items)) {
                            $orderStatus = 'Diproses';
                        }
                    }

                    $formattedOrders[] = [
                        'id' => $order['id'],
                        'customerName' => $order['customer_name'],
                        'cashierName' => $order['cashier_name'],
                        'subtotal' => floatval($order['subtotal']),
                        'discount' => floatval($order['discount']),
                        'total' => floatval($order['total']),
                        'totalQty' => array_sum(array_column($parsedItems, 'quantity')),
                        'date' => $order['date'],
                        'status' => $orderStatus,
                        'items' => $parsedItems
                    ];
                }

                echo json_encode(["success" => true, "data" => $formattedOrders]);
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(["success" => false, "message" => $e->getMessage()]);
            }
        }
        break;

    case 'POST':
        $input = json_decode(file_get_contents("php://input"), true);
        if (empty($input['id']) || !isset($input['total'])) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Order ID and Total are required"]);
            exit();
        }

        try {
            $conn->beginTransaction();

            // 1. Insert into orders
            $stmt = $conn->prepare("
                INSERT INTO orders (id, customer_name, cashier_name, subtotal, discount, voucher_code, total) 
                VALUES (:id, :customer_name, :cashier_name, :subtotal, :discount, :voucher_code, :total)
            ");
            $stmt->execute([
                'id' => $input['id'],
                'customer_name' => isset($input['customerName']) ? $input['customerName'] : 'Tanpa Nama',
                'cashier_name' => isset($input['cashierName']) ? $input['cashierName'] : 'Kasir',
                'subtotal' => floatval($input['subtotal']),
                'discount' => floatval($input['discount']),
                'voucher_code' => !empty($input['voucherCode']) ? $input['voucherCode'] : null,
                'total' => floatval($input['total'])
            ]);

            // 2. Insert order items & subtract stock
            $stmtItem = $conn->prepare("
                INSERT INTO order_items (order_id, menu_id, quantity, notes, customization, status) 
                VALUES (:order_id, :menu_id, :quantity, :notes, :customization, 'todo')
            ");

            $stmtGetRecipe = $conn->prepare("SELECT inventory_id, quantity_needed FROM menu_recipes WHERE menu_id = :menu_id");
            $stmtDeductStock = $conn->prepare("UPDATE inventory SET current = GREATEST(0, current - :amount) WHERE id = :inventory_id");

            foreach ($input['items'] as $item) {
                $menuId = intval($item['id']);
                $qty = intval($item['quantity']);
                
                $stmtItem->execute([
                    'order_id' => $input['id'],
                    'menu_id' => $menuId,
                    'quantity' => $qty,
                    'notes' => isset($item['notes']) ? $item['notes'] : '',
                    'customization' => isset($item['customization']) ? json_encode($item['customization']) : null
                ]);

                // Subtract stock based on recipe
                $stmtGetRecipe->execute(['menu_id' => $menuId]);
                $recipes = $stmtGetRecipe->fetchAll();

                foreach ($recipes as $recipe) {
                    $deductAmount = floatval($recipe['quantity_needed']) * $qty;
                    $stmtDeductStock->execute([
                        'amount' => $deductAmount,
                        'inventory_id' => intval($recipe['inventory_id'])
                    ]);
                }
            }

            // 3. Auto-disable menus that have run out of stock
            $conn->query("
                UPDATE menus m
                SET m.is_available = 0
                WHERE m.is_available = 1
                  AND m.id IN (
                      SELECT DISTINCT mr.menu_id 
                      FROM menu_recipes mr
                      JOIN inventory i ON mr.inventory_id = i.id
                      WHERE i.current < mr.quantity_needed
                  )
            ");

            $conn->commit();
            echo json_encode(["success" => true, "message" => "Checkout successful, inventory updated"]);
        } catch (PDOException $e) {
            $conn->rollBack();
            http_response_code(500);
            echo json_encode(["success" => false, "message" => $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Method not allowed"]);
        break;
}
?>
