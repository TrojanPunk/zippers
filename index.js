var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('categoryAll').addEventListener('click', () => {
        localStorage.removeItem('selectedCategory');
        displayProducts(JSON.parse(localStorage.getItem('products')));
    });
    document.getElementById('categoryMens').addEventListener('click', () => {
        localStorage.setItem('selectedCategory', 'men\'s clothing');
        displayProducts(JSON.parse(localStorage.getItem('products')));
    });
    document.getElementById('categoryWomens').addEventListener('click', () => {
        localStorage.setItem('selectedCategory', 'women\'s clothing');
        displayProducts(JSON.parse(localStorage.getItem('products')));
    });
    document.getElementById('categoryHardware').addEventListener('click', () => {
        localStorage.setItem('selectedCategory', 'electronics');
        displayProducts(JSON.parse(localStorage.getItem('products')));
    });
    document.querySelector('.material-symbols-outlined').addEventListener('click', () => {
        window.location.href = 'cart.html';
    });
    document.getElementById("productCards").addEventListener("click", (event) => {
        const target = event.target;
        if (target.classList.contains("add-to-cart")) {
            const productId = target.getAttribute("data-product-id");
            if (productId) {
                // Get the product details
                const product = getProductById(productId);
                // Add the product to the cart
                addToCart(product.id);
                // Redirect to the cart page
                window.location.href = 'cart.html';
            }
        }
    });
    document.querySelector('.navbar-brand').addEventListener('click', () => {
        localStorage.removeItem('selectedCategory');
        window.location.href = 'index.html';
    });
});
// Function to get a product by its ID
function getProductById(productId) {
    const products = JSON.parse(localStorage.getItem("products"));
    return products.find((product) => product.id === parseInt(productId));
}
function getCartItemsFromLocalStorage() {
    const cartJson = localStorage.getItem("cart");
    return cartJson ? JSON.parse(cartJson) : [];
}
function saveCartToLocalStorage(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}
function addToCart(prod) {
    console.warn(prod);
    const product = getProductById(JSON.parse(prod));
    console.log(product);
    const cart = getCartItemsFromLocalStorage();
    const existingCartItem = cart.find((cartItem) => cartItem.id === product.id);
    if (existingCartItem) {
        console.log(existingCartItem);
        existingCartItem.quantity++;
    }
    else {
        console.log(existingCartItem);
        cart.push({
            id: product.id,
            title: product.title,
            image: product.image,
            price: product.price,
            quantity: 1,
            currentPrice: product.price,
        });
    }
    saveCartToLocalStorage(cart);
}
function fetchAndDisplayProducts() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('https://fakestoreapi.com/products');
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const products = yield response.json();
            localStorage.setItem('products', JSON.stringify(products));
            console.log(products);
            displayProducts(products);
        }
        catch (error) {
            console.error(error);
        }
    });
}
// Displaying the products using the local storage
function displayProducts(products) {
    const productCardsContainer = document.getElementById('productCards');
    const selectedCategory = localStorage.getItem('selectedCategory');
    const filteredProducts = selectedCategory
        ? products.filter(product => product.category === selectedCategory)
        : products;
    productCardsContainer.innerHTML = '';
    filteredProducts.forEach((product) => {
        if (isValidProduct(product)) {
            const card = document.createElement('div');
            card.classList.add('col-md-4', 'mb-4', 'col-lg-3');
            const prod = JSON.stringify(product);
            card.innerHTML = `
            <div class="card" data-product-id="${product.id}">
                <div class="image-container">
                    <img src="${product.image}" class="card-img-top" alt="${product.title}">
                </div>
                <div class="card-body">
                    <h5 class="card-title">${product.title}</h5>
                    <div class="card-details-button d-flex justify-content-center flex-column align-items-center">
                        <div class="prod-details d-flex justify-content-center flex-column align-items-center">
                            <p class="card-text" id="ratings">Rating: ${product.rating.rate} <span class="rating-count">(${product.rating.count} reviews)</span></p>
                            <p class="card-text" id="price">$${product.price}</p>
                        </div>
                        <button id="add-cart-button" class="btn btn-primary add-to-cart d-flex justify-content-center align-items-center rounded-circle p-20" onclick="addToCart(${product.id})" data-product-id="${product.id}">
                            <span href="cart.html" class="material-symbols-rounded">
                                add_shopping_cart
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        `;
            productCardsContainer.appendChild(card);
        }
    });
}
// Checking the data type and validity for the object product
function isValidProduct(product) {
    return (typeof product === 'object' &&
        product !== null &&
        typeof product.id === 'number' &&
        typeof product.title === 'string' &&
        typeof product.image === 'string' &&
        typeof product.rating === 'object' &&
        typeof product.rating.rate === 'number' &&
        typeof product.rating.count === 'number' &&
        typeof product.price === 'number' &&
        !isNaN(product.price));
}
fetchAndDisplayProducts();
