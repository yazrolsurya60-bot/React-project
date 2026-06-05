<?php
// ============================================================
// KITCHEN KANBAN QUEUE MANAGEMENT ENDPOINT
// ============================================================
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($method) {
    case 'GET':
        try {
            $stmt = $conn->query("
                SELECT 
                    oi.id as kitchenItemId, 
                    oi.menu_id as id,
                    oi.order_id as orderReference, 
                    oi.quantity, 
                    oi.notes, 
                    oi.customization, 
                    oi.status, 
                    oi.start_time as startTime, 
                    m.name, 
                    m.category,
                    o.customer_name as customerName 
                FROM order_items oi 
                JOIN menus m ON oi.menu_id = m.id 
                JOIN orders o ON oi.order_id = o.id 
                ORDER BY oi.id ASC
            ");
            $items = $stmt->fetchAll();

            $formatted = array_map(function($item) {
                // Convert start_time timestamp to milliseconds epoch
                $startEpoch = $item['startTime'] ? strtotime($item['startTime']) * 1000 : time() * 1000;
                return [
                    'id' => intval($item['id']),
                    'kitchenItemId' => strval($item['kitchenItemId']),
                    'orderReference' => $item['orderReference'],
                    'name' => $item['name'],
                    'category' => $item['category'],
                    'quantity' => intval($item['quantity']),
                    'notes' => $item['notes'],
                    'customerName' => $item['customerName'],
                    'status' => $item['status'],
                    'startTime' => $startEpoch,
                    'customization' => json_decode($item['customization'], true)
                ];
            }, $items);

            echo json_encode(["success" => true, "data" => $formatted]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => $e->getMessage()]);
        }
        break;

    case 'POST':
        $input = json_decode(file_get_contents("php://input"), true);
        
        if ($action === 'update_status') {
            $kitchenItemId = isset($input['kitchenItemId']) ? intval($input['kitchenItemId']) : 0;
            $status = isset($input['status']) ? $input['status'] : ''; // 'todo', 'progress', 'done'

            if ($kitchenItemId <= 0 || !in_array($status, ['todo', 'progress', 'done'])) {
                http_response_code(400);
                echo json_encode(["success" => false, "message" => "Invalid ID or status"]);
                exit();
            }

            try {
                if ($status === 'progress') {
                    // Update status and set start_time if it's currently NULL
                    $stmt = $conn->prepare("
                        UPDATE order_items 
                        SET status = :status, start_time = COALESCE(start_time, CURRENT_TIMESTAMP) 
                        WHERE id = :id
                    ");
                } else {
                    $stmt = $conn->prepare("UPDATE order_items SET status = :status WHERE id = :id");
                }
                
                $stmt->execute(['status' => $status, 'id' => $kitchenItemId]);
                echo json_encode(["success" => true, "message" => "Kitchen item status updated to " . $status]);
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(["success" => false, "message" => $e->getMessage()]);
            }
        } elseif ($action === 'cancel_item') {
            $kitchenItemId = isset($input['kitchenItemId']) ? intval($input['kitchenItemId']) : 0;
            if ($kitchenItemId <= 0) {
                http_response_code(400);
                echo json_encode(["success" => false, "message" => "Invalid ID"]);
                exit();
            }

            try {
                // Delete or set to deleted. In the mock we just delete from active kitchenItems.
                $stmt = $conn->prepare("DELETE FROM order_items WHERE id = :id");
                $stmt->execute(['id' => $kitchenItemId]);
                echo json_encode(["success" => true, "message" => "Kitchen item cancelled"]);
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(["success" => false, "message" => $e->getMessage()]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Invalid action"]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Method not allowed"]);
        break;
}
?>
