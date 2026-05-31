<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

require_once 'config.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = isset($data['id']) ? (int)$data['id'] : 0;
$action = isset($data['action']) ? $data['action'] : '';
$quantity = isset($data['quantity']) ? (int)$data['quantity'] : 1;

if ($id <= 0 || !in_array($action, ['decrease', 'increase'])) {
    echo json_encode(['success' => false, 'error' => 'Неверные параметры']);
    exit;
}

if ($action === 'decrease') {
    $stmt = $pdo->prepare("UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?");
    $stmt->execute([$quantity, $id, $quantity]);
} else {
    $stmt = $pdo->prepare("UPDATE products SET stock = stock + ? WHERE id = ?");
    $stmt->execute([$quantity, $id]);
}

if ($stmt->rowCount() > 0) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Ошибка обновления остатка или недостаточно товара']);
}
?>