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
        image: "img/6.jpg"
    },
    {
        id: 2,
        name: "Серьги «Морская волна»",
        category: "earrings",
        price: 4800,
        oldPrice: 5900,
        material: ["silver"],
        description: "Серьги с аквамарином",
        image: "img/7.jpg"
    },
    {
        id: 3,
        name: "Браслет «Роза ветров»",
        category: "bracelets",
        price: 2900,
        oldPrice: null,
        material: ["silver"],
        description: "Плетёный браслет",
        image: "img/8.jpg"
    },
    {
        id: 4,
        name: "Колье «Северное сияние»",
        category: "necklaces",
        price: 12500,
        oldPrice: 15000,
        material: ["silver", "stone"],
        description: "Колье с аметистами",
        image: "img/9.jpg"
    },
{
    id: 5,                           // номер товара (новый, уникальный)
    name: "Кольцо с пионом",          // название
    category: "rings",               // категория: rings, earrings, bracelets, necklaces
    price: 2900,                     // цена
    oldPrice: null,                  // старая цена (если есть скидка, иначе null)
    material: ["polymer clay","silver"],     // материалы: silver, gold, stone, beads
    description: "Цветы созданы из запекаемой полимерной глины, размер кольца регулируется",   // краткое описание
    image: "img/5.jpg"   // путь к фото в папке img
},
    {
    id: 6,                           // номер товара (новый, уникальный)
    name: "Серги с пионом",          // название
    category: "earrings",               // категория: rings, earrings, bracelets, necklaces
    price: 4900,                     // цена
    oldPrice: null,                  // старая цена (если есть скидка, иначе null)
    material: ["polymer clay", "gold"],   // материалы: silver, gold, stone, beads
    description: "Цветы созданы из запекаемой полимерной глины ",   // краткое описание
    image: "img/3.jpg"   // путь к фото в папке img
},
{
    id: 7,                           // номер товара (новый, уникальный)
    name: "Браслет с пионом",          // название
    category: "bracelets",               // категория: rings, earrings, bracelets, necklaces
    price: 4900,                     // цена
    oldPrice: null,                  // старая цена (если есть скидка, иначе null)
    material: ["polymer clay", "gold"],   // материалы: silver, gold, stone, beads
    description: "Цветы созданы из запекаемой полимерной глины",   // краткое описание
    image: "img/2.jpg"   // путь к фото в папке img
},
{
    id: 8,                           // номер товара (новый, уникальный)
    name: "Подвеска с пионом",          // название
    category: "necklaces",               // категория: rings, earrings, bracelets, necklaces
    price: 2900,                     // цена
    oldPrice: null,                  // старая цена (если есть скидка, иначе null)
    material: ["polymer clay","silver"],   // материалы: silver, gold, stone, beads
    description: "Цветы созданы из запекаемой полимерной глины",   // краткое описание
    image: "img/4.jpg"   // путь к фото в папке img
},
{
    id: 9,                           // номер товара (новый, уникальный)
    name: "Звёздный круг",          // название
    category: "necklaces",               // категория: rings, earrings, bracelets, necklaces
    price: 3750,                     // цена
    oldPrice: 5000,                  // старая цена (если есть скидка, иначе null)
    material: ["silver", "beads"],   // материалы: silver, gold, stone, beads
    description: "Комплект из трёх подвесок с круглыми камнями",   // краткое описание
    image: "img/11.jpg"   // путь к фото в папке img
},
{
    id: 10,                           // номер товара (новый, уникальный)
    name: "Золотая нить",          // название
    category: "rings",               // категория: rings, earrings, bracelets, necklaces
    price: 5000,                     // цена
    oldPrice: 6500,                  // старая цена (если есть скидка, иначе null)
    material: ["gold", "stone"],   // материалы: silver, gold, stone, beads
    description: "Золотое кольцо",   // краткое описание
    image: "img/10.jpg"   // путь к фото в папке img
},
{
    id: 11,                           // номер товара (новый, уникальный)
    name: "Жемчужная классика",          // название
    category: "necklaces",               // категория: rings, earrings, bracelets, necklaces
    price: 2500,                     // цена
    oldPrice: 4000,                  // старая цена (если есть скидка, иначе null)
    material: ["silver", "stone"],   // материалы: silver, gold, stone, beads
    description: "Классический жемчуг",   // краткое описание
    image: "img/12.jpg"   // путь к фото в папке img
},
{
    id: 12,                           // номер товара (новый, уникальный)
    name: "Небесная гармония",          // название
    category: "necklaces",               // категория: rings, earrings, bracelets, necklaces
    price: 2500,                     // цена
    oldPrice: 4000,                  // старая цена (если есть скидка, иначе null)
    material: ["silver","stone"],   // материалы: silver, gold, stone, beads
    description: "Колье из лазурита",   // краткое описание
    image: "img/13.jpg"   // путь к фото в папке img
}
];

// Состояние фильтров и сортировки
let filters = {
    priceMin: 0,
    priceMax: 20000,
    materials: []
};
let currentSort = "default";

// Функция для получения параметра из URL
function getCategoryFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('category');
}

// Функция для получения параметра sale из URL (для акции)
function getSaleFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('sale') === 'true';
}

// Применение фильтра по цене
function applyPriceFilter(products) {
    return products.filter(product => 
        product.price >= filters.priceMin && product.price <= filters.priceMax
    );
}

// Применение фильтра по материалам
function applyMaterialFilter(products) {
    if (filters.materials.length === 0) return products;
    
    return products.filter(product => 
        product.material.some(m => filters.materials.includes(m))
    );
}

// Сортировка товаров
function applySort(products) {
    const sorted = [...products];
    switch(currentSort) {
        case "price-asc":
            return sorted.sort((a, b) => a.price - b.price);
        case "price-desc":
            return sorted.sort((a, b) => b.price - a.price);
        case "name-asc":
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        default:
            return sorted.sort((a, b) => a.id - b.id);
    }
}

// Функция отрисовки товаров
function renderProducts() {
    const container = document.getElementById("catalog-products");
    const countSpan = document.getElementById("products-count");
    
    if (!container) {
        console.log("Контейнер не найден!");
        return;
    }
    
    // Получаем параметры из URL
    const categoryFilter = getCategoryFromURL();
    const saleFilter = getSaleFromURL();
    
    // Фильтруем по категории
    let filteredProducts = [...productsData];
    if (categoryFilter && categoryFilter !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === categoryFilter);
    }
    
    // Фильтруем по акции (показываем только товары со скидкой)
    if (saleFilter) {
        filteredProducts = filteredProducts.filter(p => p.oldPrice !== null);
    }
    
    // Фильтруем по цене
    filteredProducts = applyPriceFilter(filteredProducts);
    
    // Фильтруем по материалам
    filteredProducts = applyMaterialFilter(filteredProducts);
    
    // Сортируем
    filteredProducts = applySort(filteredProducts);
    
    if (filteredProducts.length === 0) {
        let message = '';
        if (saleFilter) {
            message = '<div class="empty-products"><i class="fas fa-tag"></i><h3>Акционных товаров нет</h3><p>В ближайшее время появятся новые скидки!</p></div>';
        } else {
            message = '<div class="empty-products"><i class="fas fa-search"></i><h3>Товары не найдены</h3><p>Попробуйте изменить параметры фильтрации</p></div>';
        }
        container.innerHTML = message;
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

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) cartCountElement.textContent = cart.length;
}

// Настройка фильтра по цене
function setupPriceFilter() {
    const minSlider = document.getElementById('price-min');
    const maxSlider = document.getElementById('price-max');
    const minVal = document.getElementById('min-price-val');
    const maxVal = document.getElementById('max-price-val');
    
    if (!minSlider || !maxSlider) return;
    
    function updatePriceRange() {
        const minPrice = parseInt(minSlider.value);
        const maxPrice = parseInt(maxSlider.value);
        
        if (minVal) minVal.textContent = minPrice;
        if (maxVal) maxVal.textContent = maxPrice;
        
        filters.priceMin = minPrice;
        filters.priceMax = maxPrice;
        renderProducts();
    }
    
    minSlider.addEventListener('input', updatePriceRange);
    maxSlider.addEventListener('input', updatePriceRange);
}

// Настройка фильтра по материалам
function setupMaterialFilter() {
    const materialCheckboxes = document.querySelectorAll('.material-filter');
    
    materialCheckboxes.forEach(cb => {
        cb.addEventListener('change', (e) => {
            const value = e.target.value;
            if (e.target.checked) {
                filters.materials.push(value);
            } else {
                filters.materials = filters.materials.filter(m => m !== value);
            }
            renderProducts();
        });
    });
}

// Настройка сортировки
function setupSorting() {
    const sortSelect = document.getElementById('sort-select');
    if (!sortSelect) return;
    
    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderProducts();
    });
}

// Обработчики фильтров категорий
function setupFilters() {
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
    setupPriceFilter();
    setupMaterialFilter();
    setupSorting();
    renderProducts();
    updateCartCount();
    setupFilters();
});