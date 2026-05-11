// ===== ДАННЫЕ ТОВАРОВ =====
const productsData = [
    {
        id: 1,
        name: "Кольцо «Лунный свет»",
        category: "rings",
        price: 3500,
        oldPrice: null,
        material: ["silver"],
        description: "Серебряное кольцо с лунным камнем",
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 2,
        name: "Серьги «Морская волна»",
        category: "earrings",
        price: 4800,
        oldPrice: 5900,
        material: ["silver"],
        description: "Серьги с аквамарином",
        image: "https://images.unsplash.com/photo-1598300056393-4aac492f4344?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 3,
        name: "Браслет «Роза ветров»",
        category: "bracelets",
        price: 2900,
        oldPrice: null,
        material: ["silver"],
        description: "Плетёный браслет",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 4,
        name: "Колье «Северное сияние»",
        category: "necklaces",
        price: 12500,
        oldPrice: 15000,
        material: ["silver", "stone"],
        description: "Колье с аметистами",
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    }
];

// Функция для получения параметра из URL
function getCategoryFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('category');
}

// Функция отрисовки товаров
function renderProducts() {
    const container = document.getElementById("catalog-products");
    const countSpan = document.getElementById("products-count");
    
    if (!container) {
        console.log("Контейнер не найден!");
        return;
    }
    
    // Получаем категорию из URL
    const categoryFilter = getCategoryFromURL();
    
    // Фильтруем товары
    let filteredProducts = [...productsData];
    if (categoryFilter && categoryFilter !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === categoryFilter);
    }
    
    if (filteredProducts.length === 0) {
        container.innerHTML = '<div class="empty-products"><i class="fas fa-search"></i><h3>Товары не найдены</h3><p>В этой категории пока нет товаров</p></div>';
        if (countSpan) countSpan.textContent = "Показано: 0 товаров";
        return;
    }
    
    const productsHTML = filteredProducts.map(product => `
        <div class="product-card">
            ${product.oldPrice ? `<div class="product-badge">Скидка</div>` : ''}
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <div class="product-category">${getCategoryName(product.category)}</div>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-meta">
                    <div class="product-price">
                        ${product.price.toLocaleString()} ₽
                        ${product.oldPrice ? `<span class="product-original-price">${product.oldPrice.toLocaleString()} ₽</span>` : ''}
                    </div>
                    <button class="btn-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-bag"></i>
                    </button>
                </div>
                <button class="btn-details" onclick="viewDetails(${product.id})">Подробнее</button>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = productsHTML;
    if (countSpan) countSpan.textContent = `Показано: ${filteredProducts.length} из ${productsData.length} товаров`;
    
    // Обновляем заголовок и чекбоксы в соответствии с фильтром
    updateFilterUI(categoryFilter);
}

function getCategoryName(category) {
    const names = {
        rings: "Кольца",
        earrings: "Серьги",
        bracelets: "Браслеты",
        necklaces: "Колье"
    };
    return names[category] || category;
}

function updateFilterUI(category) {
    if (category && category !== 'all') {
        // Обновляем чекбоксы
        const allCheckbox = document.getElementById('filter-all');
        if (allCheckbox) allCheckbox.checked = false;
        
        const categoryCheckbox = document.querySelector(`.category-filter[value="${category}"]`);
        if (categoryCheckbox) categoryCheckbox.checked = true;
    }
}

function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push(productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert("Товар добавлен в корзину!");
    updateCartCount();
}

function viewDetails(productId) {
    alert(`Страница товара №${productId} будет здесь`);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) cartCountElement.textContent = cart.length;
}

// Обработчики фильтров
function setupFilters() {
    // Фильтр по категориям
    const categoryFilters = document.querySelectorAll('.category-filter');
    categoryFilters.forEach(cb => {
        cb.addEventListener('change', (e) => {
            const value = e.target.value;
            if (value === 'all') {
                if (e.target.checked) {
                    window.location.href = 'catalog.html';
                }
            } else {
                if (e.target.checked) {
                    window.location.href = `catalog.html?category=${value}`;
                } else {
                    window.location.href = 'catalog.html';
                }
            }
        });
    });
    
    // Кнопка сброса
    const resetBtn = document.getElementById('reset-filters');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            window.location.href = 'catalog.html';
        });
    }
}

// Запуск
document.addEventListener('DOMContentLoaded', () => {
    console.log("Страница каталога загружена");
    renderProducts();
    updateCartCount();
    setupFilters();
});