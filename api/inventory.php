<?php
// ============================================================
// INVENTORY CRUD & AUTO-RE-ENABLE MENUS
// ============================================================
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        try {
            $stmt = $conn->query("SELECT id, name, current, unit, `limit` FROM inventory ORDER BY id ASC");
            $data = $stmt->fetchAll();
            
            // Format floats and ints
            $formatted = array_map(function($item) {
                return [
                    'id' => intval($item['id']),
                    'name' => $item['name'],
                    'current' => floatval($item['current']),
                    'unit' => $item['unit'],
                    'limit' => floatval($item['limit'])
                ];
            }, $data);
            
            echo json_encode(["success" => true, "data" => $formatted]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => $e->getMessage()]);
        }
        break;

    case 'POST':
        $input = json_decode(file_get_contents("php://input"), true);
        $action = isset($_GET['action']) ? $_GET['action'] : '';

        if ($action === 'adjust_stock') {
            $id = isset($input['id']) ? intval($input['id']) : 0;
            $amount = isset($input['amount']) ? floatval($input['amount']) : 0;
            $mode = isset($input['mode']) ? $input['mode'] : 'restock'; // 'restock' or 'adjust'

            if ($id <= 0) {
                http_response_code(400);
                echo json_encode(["success" => false, "message" => "ID is required"]);
                exit();
            }

            try {
                $conn->beginTransaction();

                if ($mode === 'restock') {
                    $stmt = $conn->prepare("UPDATE inventory SET current = current + :amount WHERE id = :id");
                } else {
                    $stmt = $conn->prepare("UPDATE inventory SET current = :amount WHERE id = :id");
                }

                $stmt->execute(['id' => $id, 'amount' => $amount]);

                // ── Auto Re-enable Menus ──
                // Check if any unavailable menu now has sufficient ingredients
                $conn->query("
                    UPDATE menus m
                    SET m.is_available = 1
                    WHERE m.is_available = 0
                      AND m.id IN (SELECT DISTINCT menu_id FROM menu_recipes)
                      AND NOT EXISTS (
                          SELECT 1 FROM menu_recipes mr
                          JOIN inventory i ON mr.inventory_id = i.id
                          WHERE mr.menu_id = m.id AND i.current < mr.quantity_needed
                      )
                ");

                $conn->commit();
                echo json_encode(["success" => true, "message" => "Stock adjusted successfully and menus re-evaluated"]);
            } catch (PDOException $e) {
                $conn->rollBack();
                http_response_code(500);
                echo json_encode(["success" => false, "message" => $e->getMessage()]);
            }
        } else {
            // Create new inventory item
            if (empty($input['name']) || empty($input['unit'])) {
                http_response_code(400);
                echo json_encode(["success" => false, "message" => "Name and Unit are required"]);
                exit();
            }

            try {
                $stmt = $conn->prepare("INSERT INTO inventory (name, current, unit, `limit`) VALUES (:name, :current, :unit, :limit)");
                $stmt->execute([
                    'name' => $input['name'],
                    'current' => isset($input['current']) ? floatval($input['current']) : 0,
                    'unit' => $input['unit'],
                    'limit' => isset($input['limit']) ? floatval($input['limit']) : 0
                ]);
                echo json_encode(["success" => true, "id" => $conn->lastInsertId(), "message" => "Inventory item created successfully"]);
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(["success" => false, "message" => $e->getMessage()]);
            }
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Method not allowed"]);
        break;
}
?>
