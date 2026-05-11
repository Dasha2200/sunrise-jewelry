// index.js - для главной страницы
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(el => {
        if (el) el.textContent = cart.length;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
});