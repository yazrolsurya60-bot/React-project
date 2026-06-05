<?php
// ============================================================
// USERS CRUD ENDPOINT
// ============================================================
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        try {
            $stmt = $conn->query("SELECT id, name, username, password, role FROM users ORDER BY id DESC");
            $users = $stmt->fetchAll();
            echo json_encode(["success" => true, "data" => $users]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => $e->getMessage()]);
        }
        break;

    case 'POST':
        $input = json_decode(file_get_contents("php://input"), true);
        if (empty($input['name']) || empty($input['username']) || empty($input['password'])) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Name, username, and password are required"]);
            exit();
        }

        try {
            $stmt = $conn->prepare("INSERT INTO users (name, username, password, role) VALUES (:name, :username, :password, :role)");
            $stmt->execute([
                'name' => $input['name'],
                'username' => $input['username'],
                'password' => $input['password'],
                'role' => isset($input['role']) ? $input['role'] : 'Kasir'
            ]);
            echo json_encode(["success" => true, "id" => $conn->lastInsertId(), "message" => "User added successfully"]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Gagal menambahkan user. Kemungkinan username sudah terpakai."]);
        }
        break;

    case 'PUT':
        $input = json_decode(file_get_contents("php://input"), true);
        if (empty($input['id']) || empty($input['name']) || empty($input['username'])) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "ID, name, and username are required"]);
            exit();
        }

        try {
            $stmt = $conn->prepare("UPDATE users SET name = :name, username = :username, password = :password, role = :role WHERE id = :id");
            $stmt->execute([
                'id' => $input['id'],
                'name' => $input['name'],
                'username' => $input['username'],
                'password' => $input['password'],
                'role' => $input['role']
            ]);
            echo json_encode(["success" => true, "message" => "User updated successfully"]);
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
            $stmt = $conn->prepare("DELETE FROM users WHERE id = :id");
            $stmt->execute(['id' => $id]);
            echo json_encode(["success" => true, "message" => "User deleted successfully"]);
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
