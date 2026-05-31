<?php
require_once 'config.php';

// Добавление товара
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'add') {
    $stmt = $pdo->prepare("INSERT INTO products (name, category, price, old_price, stock, description, image) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $_POST['name'],
        $_POST['category'],
        $_POST['price'],
        $_POST['old_price'] ?: null,
        $_POST['stock'],
        $_POST['description'],
        $_POST['image']
    ]);
    header('Location: admin.php');
    exit;
}

// Удаление товара
if (isset($_GET['delete'])) {
    $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
    $stmt->execute([$_GET['delete']]);
    header('Location: admin.php');
    exit;
}

$products = $pdo->query("SELECT * FROM products ORDER BY id")->fetchAll();
?>

<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Админ-панель - Sunrise Jewelry</title>
    <link rel="stylesheet" href="style.css">
    <style>
        .admin-container { max-width: 1200px; margin: 2rem auto; padding: 0 20px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .form-group { margin-bottom: 1rem; }
        .form-group input, .form-group textarea, .form-group select { width: 100%; padding: 8px; }
        .btn { background: var(--accent); color: white; padding: 10px 20px; border: none; cursor: pointer; }
    </style>
</head>
<body>
    <div class="admin-container">
        <h1>Админ-панель Sunrise Jewelry</h1>
        
        <h2>Добавить украшение</h2>
        <form method="POST">
            <input type="hidden" name="action" value="add">
            <div class="form-group"><input type="text" name="name" placeholder="Название" required></div>
            <div class="form-group">
                <select name="category">
                    <option value="rings">Кольца</option>
                    <option value="earrings">Серьги</option>
                    <option value="bracelets">Браслеты</option>
                    <option value="necklaces">Колье</option>
                </select>
            </div>
            <div class="form-group"><input type="number" step="0.01" name="price" placeholder="Цена" required></div>
            <div class="form-group"><input type="number" step="0.01" name="old_price" placeholder="Старая цена (необязательно)"></div>
            <div class="form-group"><input type="number" name="stock" placeholder="Количество" value="1" required></div>
            <div class="form-group"><textarea name="description" placeholder="Описание"></textarea></div>
            <div class="form-group"><input type="text" name="image" placeholder="Путь к фото (img/название.jpg)" required></div>
            <button type="submit" class="btn">Добавить товар</button>
        </form>
        
        <h2>Список товаров</h2>
        <table>
            <tr><th>ID</th><th>Название</th><th>Цена</th><th>Остаток</th><th>Действия</th></tr>
            <?php foreach ($products as $p): ?>
            <tr>
                <tr><?= $p['id'] ?></td>
                <td><?= htmlspecialchars($p['name']) ?></td>
                <td><?= $p['price'] ?> ₽</td>
                <td><?= $p['stock'] ?> </td>
                <td><a href="?delete=<?= $p['id'] ?>" onclick="return confirm('Удалить товар?')">Удалить</a></td>
            </tr>
            <?php endforeach; ?>
        </table>
    </div>
</body>
</html>