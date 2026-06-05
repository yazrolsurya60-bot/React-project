<?php
// ============================================================
// AUTHENTICATION ENDPOINT
// ============================================================
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

// Get POST data
$input = json_decode(file_get_contents("php://input"), true);
$username = isset($input['username']) ? trim($input['username']) : '';
$password = isset($input['password']) ? trim($input['password']) : '';

if (empty($username) || empty($password)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Username and password are required"]);
    exit();
}

try {
    // Query the database
    $stmt = $conn->prepare("SELECT id, name, username, password, role FROM users WHERE username = :username LIMIT 1");
    $stmt->execute(['username' => $username]);
    $user = $stmt->fetch();

    // Verify credentials (in production, use password_verify with hash)
    if ($user && $user['password'] === $password) {
        unset($user['password']); // Don't return password in response
        echo json_encode([
            "success" => true,
            "user" => $user
        ]);
    } else {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Username atau password salah."]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
}
?>
