// Данные товаров
const productsData = [
    { id: 1, name: "Кольцо «Лунный свет»", price: 3500, image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200" },
    { id: 2, name: "Серьги «Морская волна»", price: 4800, image: "https://images.unsplash.com/photo-1598300056393-4aac492f4344?w=200" },
    { id: 3, name: "Браслет «Роза ветров»", price: 2900, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200" },
    { id: 4, name: "Колье «Северное сияние»", price: 12500, image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200" }
];

// Сохраняем товары в localStorage
localStorage.setItem('products', JSON.stringify(productsData));

// Функции корзины
function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cart = getCart();
    document.querySelectorAll('.cart-count').forEach(el => {
        if (el) el.textContent = cart.length;
    });
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(id => id !== productId);
    saveCart(cart);
    renderCartItems();
}

function getProductById(id) {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    return products.find(p => p.id === id);
}

function renderCartItems() {
    const container = document.getElementById('cart-items-container');
    if (!container) return;
    
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
        updateSummary(0);
        return;
    }
    
    // Группируем товары
    const cartMap = {};
    cart.forEach(id => { cartMap[id] = (cartMap[id] || 0) + 1; });
    
    let html = '';
    let subtotal = 0;
    let orderText = '';
    
    for (const [id, quantity] of Object.entries(cartMap)) {
        const product = getProductById(parseInt(id));
        if (product) {
            const itemTotal = product.price * quantity;
            subtotal += itemTotal;
            orderText += `${product.name} x${quantity} — ${product.price} ₽ = ${itemTotal} ₽\n`;
            
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
    updateSummary(subtotal);
    
    // Заполняем скрытые поля формы
    const totalWithDelivery = subtotal + 300;
    const orderHidden = document.getElementById('order-items-hidden');
    const totalHidden = document.getElementById('total-hidden');
    if (orderHidden) orderHidden.value = orderText;
    if (totalHidden) totalHidden.value = totalWithDelivery.toLocaleString() + ' ₽ (включая доставку 300 ₽)';
}

function updateSummary(subtotal) {
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');
    if (subtotalEl) subtotalEl.textContent = (subtotal || 0).toLocaleString();
    if (totalEl) totalEl.textContent = ((subtotal || 0) + 300).toLocaleString();
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
        // Обновляем скрытые поля перед открытием
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

// Перехватываем отправку формы, чтобы очистить корзину
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
document.addEventListener('DOMContentLoaded', () => {
    renderCartItems();
    updateCartCount();
});