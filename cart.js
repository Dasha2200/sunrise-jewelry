// Данные товаров (загружаются из БД)
let productsData = [];

// Загрузка товаров из базы данных
async function loadProductsFromDB() {
    try {
        const response = await fetch('api_products.php');
        const data = await response.json();
        console.log('Загружено товаров:', data.length);
        
        if (data.error) {
            console.error('Ошибка:', data.error);
            return [];
        }
        
        productsData = data.map(p => ({
            id: p.id,
            name: p.name,
            price: parseFloat(p.price),
            image: p.image,
            stock: p.stock
        }));
        
        return productsData;
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        return [];
    }
}

function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function getProductById(id) {
    return productsData.find(p => p.id === id);
}

async function renderCartItems() {
    const container = document.getElementById('cart-items-container');
    if (!container) return;
    
    await loadProductsFromDB();
    const cart = getCart();
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-bag"></i>
                <h3>Ваша корзина пуста</h3>
                <p>Добавьте украшения из каталога</p>
                <a href="catalog.html" class="btn-hero" style="display: inline-block; margin-top: 1rem;">Перейти в каталог</a>
            </div>
        `;
        document.getElementById('subtotal').textContent = '0';
        document.getElementById('total').textContent = '300';
        return;
    }
    
    // Группируем товары
    const cartMap = {};
    cart.forEach(id => { cartMap[id] = (cartMap[id] || 0) + 1; });
    
    let html = '';
    let subtotal = 0;
    let orderText = '';
    let cartItemsForJSON = [];
    
    for (const [id, quantity] of Object.entries(cartMap)) {
        const product = getProductById(parseInt(id));
        if (product) {
            const itemTotal = product.price * quantity;
            subtotal += itemTotal;
            orderText += `${product.name} x${quantity} — ${product.price} ₽ = ${itemTotal} ₽\n`;
            cartItemsForJSON.push({ id: product.id, name: product.name, price: product.price, quantity: quantity });
            
            html += `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-title">${product.name}</div>
                        <div class="cart-item-price">${product.price.toLocaleString()} ₽</div>
                        <div class="cart-item-quantity">Количество: ${quantity}</div>
                    </div>
                    <button class="cart-item-remove" onclick="removeFromCart(${product.id})">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;
        }
    }
    
    container.innerHTML = html;
    document.getElementById('subtotal').textContent = subtotal.toLocaleString();
    document.getElementById('total').textContent = (subtotal + 300).toLocaleString();
    
    // Заполняем скрытые поля формы
    const totalWithDelivery = subtotal + 300;
    const orderHidden = document.getElementById('order-items-hidden');
    const totalHidden = document.getElementById('total-hidden');
    const cartItemsJson = document.getElementById('cart-items-json');
    
    if (orderHidden) orderHidden.value = orderText;
    if (totalHidden) totalHidden.value = totalWithDelivery.toLocaleString() + ' ₽ (включая доставку 300 ₽)';
    if (cartItemsJson) cartItemsJson.value = JSON.stringify(cartItemsForJSON);
}

// ===== ИСПРАВЛЕННАЯ ФУНКЦИЯ removeFromCart (возвращает остаток в БД) =====
async function removeFromCart(productId) {
    let cart = getCart();
    const index = cart.indexOf(productId);
    if (index !== -1) {
        cart.splice(index, 1);
        saveCart(cart);
        
        // Возвращаем остаток в базу данных (увеличиваем на 1)
        try {
            const response = await fetch('api_update_stock.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: productId, action: 'increase', quantity: 1 })
            });
            const result = await response.json();
            if (result.success) {
                console.log('Остаток возвращён для товара ID:', productId);
            } else {
                console.error('Ошибка возврата остатка:', result.error);
            }
        } catch(e) { 
            console.error('Ошибка запроса:', e); 
        }
        
        renderCartItems();
    }
}

function updateCartCount() {
    const cart = getCart();
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) cartCountElement.textContent = cart.length;
}

// Модальное окно
const modal = document.getElementById('order-modal');
const checkoutBtn = document.getElementById('checkout-btn');
const closeModal = document.querySelector('.close-modal');

if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        const cart = getCart();
        if (cart.length === 0) {
            alert('Ваша корзина пуста!');
            return;
        }
        renderCartItems();
        modal.style.display = 'flex';
    });
}

if (closeModal) {
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Очистка корзины после успешной отправки
function clearCartAfterSubmit() {
    localStorage.setItem('cart', '[]');
    updateCartCount();
    renderCartItems();
}

// Перехватываем отправку формы
const orderForm = document.querySelector('#order-modal form');
if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
        setTimeout(() => {
            clearCartAfterSubmit();
            modal.style.display = 'none';
        }, 500);
    });
}

// Инициализация
document.addEventListener('DOMContentLoaded', async () => {
    await loadProductsFromDB();
    renderCartItems();
    updateCartCount();
});