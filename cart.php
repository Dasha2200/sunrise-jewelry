<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'] ?? '';
    $phone = $_POST['phone'] ?? '';
    $email = $_POST['email'] ?? '';
    $address = $_POST['address'] ?? '';
    $comment = $_POST['comment'] ?? '';
    $order_items = $_POST['order_items'] ?? '';
    $total = $_POST['total'] ?? '';
    $cart_items_json = $_POST['cart_items'] ?? '[]';
    $cart_items = json_decode($cart_items_json, true);
    
    try {
        // Сохраняем заказ
        $stmt = $pdo->prepare("INSERT INTO orders (name, phone, email, address, comment, order_items, total, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())");
        $stmt->execute([$name, $phone, $email, $address, $comment, $order_items, $total]);
        $order_id = $pdo->lastInsertId();
        
        // Сохраняем детали и списываем товары
        foreach ($cart_items as $item) {
            // Детали заказа
            $stmt = $pdo->prepare("INSERT INTO order_items (order_id, product_id, product_name, price, quantity) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$order_id, $item['id'], $item['name'], $item['price'], $item['quantity']]);
            
            // Списываем товар со склада
            $stmt = $pdo->prepare("UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?");
            $stmt->execute([$item['quantity'], $item['id'], $item['quantity']]);
        }
    } catch(PDOException $e) {
        error_log("Ошибка сохранения заказа: " . $e->getMessage());
    }
    
    // Отправка email
    $to = 'sunrise-jewelry@yandex.ru';
    $subject = 'Новый заказ с Sunrise Jewelry!';
    $message = "Имя: $name\nТелефон: $phone\nEmail: $email\nАдрес: $address\nКомментарий: $comment\n\nСостав заказа:\n$order_items\n\nИтого: $total";
    $headers = 'Content-Type: text/plain; charset=utf-8';
    mail($to, $subject, $message, $headers);
    
    header('Location: thank-you.html');
    exit;
}
?>