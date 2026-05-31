<?php
require_once 'config.php';

// Получаем параметры фильтрации
$category = isset($_GET['category']) ? $_GET['category'] : null;
$sale = isset($_GET['sale']) && $_GET['sale'] === 'true';

// Базовый запрос
$sql = "SELECT * FROM products WHERE 1=1";
$params = [];

// Фильтр по категории
if ($category && $category !== 'all') {
    $sql .= " AND category = ?";
    $params[] = $category;
}

// Фильтр по акции (товары со скидкой)
if ($sale) {
    $sql .= " AND old_price IS NOT NULL AND old_price > 0";
}

$sql .= " ORDER BY id";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$products = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Преобразуем данные для совместимости с frontend
foreach ($products as &$product) {
    // Преобразуем строку материала в массив (если хранится как JSON)
    if (isset($product['material']) && is_string($product['material'])) {
        $product['material'] = json_decode($product['material'], true);
        if (!$product['material']) $product['material'] = [];
    }
    // Убедимся, что поле oldPrice существует
    $product['oldPrice'] = $product['old_price'];
    unset($product['old_price']);
}

echo json_encode($products);
?>