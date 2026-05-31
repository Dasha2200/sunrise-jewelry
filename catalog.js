// ===== ДАННЫЕ ТОВАРОВ (загружаются из БД) =====
let productsData = [];

// Загрузка товаров из базы данных
async function loadProductsFromDB() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        const sale = urlParams.get('sale') === 'true';
        
        let url = 'api_products.php';
        let params = [];
        if (category && category !== 'all') params.push(`category=${category}`);
        if (sale) params.push(`sale=true`);
        if (params.length) url += '?' + params.join('&');
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.error) {
            console.error('Ошибка:', data.error);
            return [];
        }
        
        productsData = data;
        return productsData;
    } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
        return [];
    }
}

// Состояние фильтров и сортировки
let filters = {
    priceMin: 0,
    priceMax: 20000,
    materials: []
};
let currentSort = "default";

function getCategoryFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('category');
}

function getSaleFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('sale') === 'true';
}

function applyPriceFilter(products) {
    return products.filter(product => product.price >= filters.priceMin && product.price <= filters.priceMax);
}

function applyMaterialFilter(products) {
    if (filters.materials.length === 0) return products;
    return products.filter(product => product.material && product.material.some(m => filters.materials.includes(m)));
}

function applySort(products) {
    const sorted = [...products];
    switch(currentSort) {
        case "price-asc": return sorted.sort((a, b) => a.price - b.price);
        case "price-desc": return sorted.sort((a, b) => b.price - a.price);
        case "name-asc": return sorted.sort((a, b) => a.name.localeCompare(b.name));
        default: return sorted;
    }
}

async function renderProducts() {
    const container = document.getElementById("catalog-products");
    const countSpan = document.getElementById("products-count");
    
    if (!container) return;
    
    const allProducts = await loadProductsFromDB();
    const categoryFilter = getCategoryFromURL();
    const saleFilter = getSaleFromURL();
    
    let filteredProducts = [...allProducts];
    if (categoryFilter && categoryFilter !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === categoryFilter);
    }
    if (saleFilter) {
        filteredProducts = filteredProducts.filter(p => p.oldPrice !== null && p.oldPrice > 0);
    }
    filteredProducts = applyPriceFilter(filteredProducts);
    filteredProducts = applyMaterialFilter(filteredProducts);
    filteredProducts = applySort(filteredProducts);
    
    if (filteredProducts.length === 0) {
        container.innerHTML = '<div class="empty-products"><i class="fas fa-search"></i><h3>Товары не найдены</h3></div>';
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
                <div class="product-stock">
                    ${product.stock > 0 ? `✅ В наличии: ${product.stock} шт.` : '❌ Нет в наличии'}
                </div>
                <div class="product-meta">
                    <div class="product-price">
                        ${product.price.toLocaleString()} ₽
                        ${product.oldPrice ? `<span class="product-original-price">${product.oldPrice.toLocaleString()} ₽</span>` : ''}
                    </div>
                    <button class="btn-cart" onclick="addToCart(${product.id})" ${product.stock <= 0 ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>
                        <i class="fas fa-shopping-bag"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = productsHTML;
    if (countSpan) countSpan.textContent = `Показано: ${filteredProducts.length} из ${allProducts.length} товаров`;
    updateFilterUI(categoryFilter);
}

function getCategoryName(category) {
    const names = { rings: "Кольца", earrings: "Серьги", bracelets: "Браслеты", necklaces: "Колье" };
    return names[category] || category;
}

function updateFilterUI(category) {
    if (category && category !== 'all') {
        const allCheckbox = document.getElementById('filter-all');
        if (allCheckbox) allCheckbox.checked = false;
        const categoryCheckbox = document.querySelector(`.category-filter[value="${category}"]`);
        if (categoryCheckbox) categoryCheckbox.checked = true;
    }
}

async function addToCart(productId) {
    try {
        const response = await fetch(`api_product.php?id=${productId}`);
        const product = await response.json();
        
        if (product.error) {
            alert('Ошибка при проверке товара');
            return;
        }
        
        if (product.stock <= 0) {
            alert('Этого товара нет в наличии!');
            return;
        }
        
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cart.push(productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        
        const updateResponse = await fetch('api_update_stock.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: productId, action: 'decrease', quantity: 1 })
        });
        
        const result = await updateResponse.json();
        if (result.success) {
            alert('Товар добавлен в корзину!');
            updateCartCount();
            renderProducts();
        } else {
            alert('Ошибка при обновлении остатка');
            let newCart = JSON.parse(localStorage.getItem('cart') || '[]');
            const index = newCart.indexOf(productId);
            if (index !== -1) newCart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(newCart));
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка при добавлении в корзину');
    }
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) cartCountElement.textContent = cart.length;
}

function setupPriceFilter() {
    const minSlider = document.getElementById('price-min');
    const maxSlider = document.getElementById('price-max');
    const minVal = document.getElementById('min-price-val');
    const maxVal = document.getElementById('max-price-val');
    if (!minSlider || !maxSlider) return;
    function updatePriceRange() {
        filters.priceMin = parseInt(minSlider.value);
        filters.priceMax = parseInt(maxSlider.value);
        if (minVal) minVal.textContent = filters.priceMin;
        if (maxVal) maxVal.textContent = filters.priceMax;
        renderProducts();
    }
    minSlider.addEventListener('input', updatePriceRange);
    maxSlider.addEventListener('input', updatePriceRange);
}

function setupMaterialFilter() {
    document.querySelectorAll('.material-filter').forEach(cb => {
        cb.addEventListener('change', (e) => {
            const value = e.target.value;
            if (e.target.checked) filters.materials.push(value);
            else filters.materials = filters.materials.filter(m => m !== value);
            renderProducts();
        });
    });
}

function setupSorting() {
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            renderProducts();
        });
    }
}

function setupFilters() {
    document.querySelectorAll('.category-filter').forEach(cb => {
        cb.addEventListener('change', (e) => {
            const value = e.target.value;
            if (value === 'all') {
                if (e.target.checked) window.location.href = 'catalog.html';
            } else {
                if (e.target.checked) window.location.href = `catalog.html?category=${value}`;
                else window.location.href = 'catalog.html';
            }
        });
    });
    const resetBtn = document.getElementById('reset-filters');
    if (resetBtn) resetBtn.addEventListener('click', () => window.location.href = 'catalog.html');
}

document.addEventListener('DOMContentLoaded', () => {
    setupPriceFilter();
    setupMaterialFilter();
    setupSorting();
    renderProducts();
    updateCartCount();
    setupFilters();
}); 