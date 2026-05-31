<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$host = 'localhost';
$dbname = 'sunrise_db';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(['error' => 'Ошибка подключения: ' . $e->getMessage()]);
    exit;
}

// Получаем параметры фильтрации
$category = isset($_GET['category']) ? $_GET['category'] : null;
$sale = isset($_GET['sale']) && $_GET['sale'] === 'true';

// Базовый запрос
$sql = "SELECT * FROM products WHERE 1=1";
$params = [];

if ($category && $category !== 'all') {
    $sql .= " AND category = ?";
    $params[] = $category;
}

if ($sale) {
    $sql .= " AND old_price IS NOT NULL AND old_price > 0";
}

$sql .= " ORDER BY id";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$products = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($products);
?>