<?php
// ============================================================
// MENUS & RECIPES CRUD ENDPOINT
// ============================================================
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($method) {
    case 'GET':
        if ($action === 'get_recipes') {
            $menu_id = isset($_GET['menu_id']) ? intval($_GET['menu_id']) : 0;
            try {
                $stmt = $conn->prepare("
                    SELECT mr.id, mr.inventory_id, mr.quantity_needed, i.name as inventory_name, i.unit 
                    FROM menu_recipes mr 
                    JOIN inventory i ON mr.inventory_id = i.id 
                    WHERE mr.menu_id = :menu_id
                ");
                $stmt->execute(['menu_id' => $menu_id]);
                echo json_encode(["success" => true, "data" => $stmt->fetchAll()]);
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(["success" => false, "message" => $e->getMessage()]);
            }
        } else {
            try {
                $stmt = $conn->query("SELECT * FROM menus ORDER BY id ASC");
                $dbMenus = $stmt->fetchAll();
                
                // Format to match React frontend naming conventions
                $formattedMenus = array_map(function($item) {
                    return [
                        'id' => intval($item['id']),
                        'name' => $item['name'],
                        'description' => $item['description'],
                        'category' => $item['category'],
                        'price' => floatval($item['price']),
                        'image' => $item['image'],
                        'isAvailable' => (bool)$item['is_available'],
                        'hasCustomizer' => (bool)$item['has_customizer'],
                        'tags' => json_decode($item['tags']) ?: []
                    ];
                }, $dbMenus);
                
                echo json_encode(["success" => true, "data" => $formattedMenus]);
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(["success" => false, "message" => $e->getMessage()]);
            }
        }
        break;

    case 'POST':
        if ($action === 'save_recipe') {
            $input = json_decode(file_get_contents("php://input"), true);
            $menu_id = isset($input['menu_id']) ? intval($input['menu_id']) : 0;
            $ingredients = isset($input['ingredients']) ? $input['ingredients'] : []; // Array of {inventory_id, quantity_needed}

            if ($menu_id <= 0) {
                http_response_code(400);
                echo json_encode(["success" => false, "message" => "Menu ID is required"]);
                exit();
            }

            try {
                $conn->beginTransaction();
                // Clear existing recipes for this menu
                $stmt = $conn->prepare("DELETE FROM menu_recipes WHERE menu_id = :menu_id");
                $stmt->execute(['menu_id' => $menu_id]);

                // Insert new recipes
                $insertStmt = $conn->prepare("INSERT INTO menu_recipes (menu_id, inventory_id, quantity_needed) VALUES (:menu_id, :inventory_id, :quantity_needed)");
                foreach ($ingredients as $ing) {
                    $insertStmt->execute([
                        'menu_id' => $menu_id,
                        'inventory_id' => intval($ing['inventory_id']),
                        'quantity_needed' => floatval($ing['quantity_needed'])
                    ]);
                }
                $conn->commit();
                echo json_encode(["success" => true, "message" => "Recipe saved successfully"]);
            } catch (PDOException $e) {
                $conn->rollBack();
                http_response_code(500);
                echo json_encode(["success" => false, "message" => $e->getMessage()]);
            }
        } else {
            $input = json_decode(file_get_contents("php://input"), true);
            if (empty($input['name']) || !isset($input['price'])) {
                http_response_code(400);
                echo json_encode(["success" => false, "message" => "Name and Price are required"]);
                exit();
            }

            try {
                $stmt = $conn->prepare("
                    INSERT INTO menus (name, description, category, price, image, is_available, has_customizer, tags) 
                    VALUES (:name, :description, :category, :price, :image, :is_available, :has_customizer, :tags)
                ");
                $stmt->execute([
                    'name' => $input['name'],
                    'description' => isset($input['description']) ? $input['description'] : '',
                    'category' => $input['category'],
                    'price' => floatval($input['price']),
                    'image' => isset($input['image']) ? $input['image'] : 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&q=80',
                    'is_available' => isset($input['isAvailable']) ? intval($input['isAvailable']) : 1,
                    'has_customizer' => isset($input['hasCustomizer']) ? intval($input['hasCustomizer']) : 0,
                    'tags' => json_encode(isset($input['tags']) ? $input['tags'] : [])
                ]);
                echo json_encode(["success" => true, "id" => $conn->lastInsertId(), "message" => "Menu added successfully"]);
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(["success" => false, "message" => $e->getMessage()]);
            }
        }
        break;

    case 'PUT':
        $input = json_decode(file_get_contents("php://input"), true);
        if (empty($input['id']) || empty($input['name'])) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "ID and name are required"]);
            exit();
        }

        try {
            $stmt = $conn->prepare("
                UPDATE menus 
                SET name = :name, description = :description, category = :category, 
                    price = :price, image = :image, is_available = :is_available, 
                    has_customizer = :has_customizer, tags = :tags 
                WHERE id = :id
            ");
            $stmt->execute([
                'id' => intval($input['id']),
                'name' => $input['name'],
                'description' => isset($input['description']) ? $input['description'] : '',
                'category' => $input['category'],
                'price' => floatval($input['price']),
                'image' => $input['image'],
                'is_available' => isset($input['isAvailable']) ? intval($input['isAvailable']) : 1,
                'has_customizer' => isset($input['hasCustomizer']) ? intval($input['hasCustomizer']) : 0,
                'tags' => json_encode(isset($input['tags']) ? $input['tags'] : [])
            ]);
            echo json_encode(["success" => true, "message" => "Menu updated successfully"]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => $e->getMessage()]);
        }
        break;

    case 'DELETE':
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        if ($id <= 0) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Invalid ID"]);
            exit();
        }

        try {
            $stmt = $conn->prepare("DELETE FROM menus WHERE id = :id");
            $stmt->execute(['id' => $id]);
            echo json_encode(["success" => true, "message" => "Menu deleted successfully"]);
        } catch (PDOException $e) {
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
