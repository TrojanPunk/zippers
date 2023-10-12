function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cart = getCartFromLocalStorage();
    const cartStatus = document.getElementById('empty-cart');

    if (cart && cart.length > 0) {
        cart.forEach((cartItem) => {
            if (cartItem.quantity < 1) {
                cartStatus.style.padding = "20px";
                const updatedCart = cart.filter(item => item.id !== cartItem.id);
                saveCartToLocalStorage(updatedCart);
                return;
            }

            const cartItemElement = createCartItemElement(cartItem);
            cartItemsContainer.appendChild(cartItemElement);
        });
    } else {
        document.getElementById('summary-table').innerHTML = ``;
        document.getElementById('proceed-to-checkout').innerHTML = ``;
        cartStatus.innerHTML = "The cart is empty";
        cartStatus.style.padding = "2rem";
        cartStatus.style.textAlign = "center"

    }
}

document.addEventListener("DOMContentLoaded", () => {
    displayCartItems();
    calculateTotalPrice();
    grandPrice();
    seasonalOffer();
});

document.getElementById("productCards")!.addEventListener("click", (event) => {
    let target = event.target as HTMLElement;
    if (target.classList.contains("add-to-cart")) {
        const productId = target.getAttribute("data-product-id");
        if (productId) {
            const products = JSON.parse(localStorage.getItem("products")!);
            const product = getProductById(productId);
            if (product) {
                addToCart(product);
            }
        }
    }
});


function createCartItemElement(cartItem) {
    const cartItemElement = document.createElement('div');
    cartItemElement.classList.add('cart-item');

    cartItemElement.innerHTML = `
        <div class="cart-list d-flex align-items-center justify-content-between">
            <div class="cart-item-image d-flex align-items-center">
                <img id="cart-img" class="card-img-top" src="${cartItem.image}" alt="${cartItem.title}">
                <p class="card-title" id="cart-title">${cartItem.title}</p>
            </div>
            
            <div class="cart-item-details d-flex" style="color: white;">
                <div class="denomination d-flex flex-column justify-content-center">
                    <p id="price-${cartItem.id}" class="cart-list-price">$${(cartItem.currentPrice).toFixed(2)}</p>
                    <div class="quantity-controls">
                        <button onclick=decreaseQuantity(${cartItem.id}) id="decrease" class="btn btn-primary decrease-quantity" data-product-id="${cartItem.id}">-</button>
                        <span class="quantity-amount" id="quantity-${cartItem.id}">${cartItem.quantity}</span>
                        <button onclick=increaseQuantity(${cartItem.id}) id="increase" class="btn btn-primary increase-quantity" data-product-id="${cartItem.id}">+</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    return cartItemElement;
}

function calculateTotalPrice() {
    const cart = getCartFromLocalStorage();
    const totalPriceContainer = document.getElementById('total-price');

    if (cart && cart.length > 0) {
        const totalPrice = cart.reduce((total, cartItem) => {
            return total + (cartItem.price * cartItem.quantity);
        }, 0);
        totalPriceContainer.innerHTML = `$${totalPrice.toFixed(2)}`;
    } else {
        totalPriceContainer.innerHTML = '';
    }
}

function seasonalOffer() {
    const offerValue = document.getElementById('offer');
    const totalPrice = document.getElementById('total-price');
    console.log(offerValue.innerHTML,)

    if (totalPrice) {
        offerValue.innerHTML = ((parseInt(totalPrice.innerText.replace('$', '')) * 0.20).toFixed(2)).toString();
    } else {
        offerValue.innerHTML = 'N/A'; // set default value for offerValue
    }
}

function grandPrice() {
    const deliveryPriceFetch = document.getElementById('delivery');
    const offerPriceFetch = document.getElementById('offer');

    let totalPrice = document.getElementById('total-price');
    let grandPrice: HTMLElement | null = document.getElementById('grand')
    let deliveryPrice = 0;
    let offerPrice = 0;
    if (deliveryPriceFetch) {
        deliveryPrice += parseFloat(deliveryPriceFetch.innerText)
    }

    if (offerPriceFetch) {
        offerPrice += parseFloat(offerPriceFetch.innerText)
    }

    if (grandPrice && totalPrice)
        grandPrice.innerHTML = ((parseFloat(totalPrice.innerText.replace('$', '')) - offerPrice + deliveryPrice).toFixed(2)).toString()
}

function getCartFromLocalStorage() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}

function saveCartToLocalStorage(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

document.getElementById('cart-items').addEventListener('click', (event) => {
    const target = event.target as HTMLElement;

    if (target.classList.contains('decrease-quantity')) {
        const productId = target.getAttribute('data-product-id');
        if (productId) {
            decreaseQuantity(productId);
        }
    } else if (target.classList.contains('increase-quantity')) {
        const productId = target.getAttribute('data-product-id');
        if (productId) {
            increaseQuantity(productId);
        }
    }
});

function decreaseQuantity(productId) {
    const cart = getCartFromLocalStorage();
    let updatedCart = cart.map((cartItem) => {
        if (cartItem.id === productId) {
            if (cartItem.quantity > 1) {
                cartItem.quantity--;
                cartItem.currentPrice -= cartItem.price;
                document.getElementById("price-" + cartItem.id).innerText = '$' + cartItem.currentPrice.toFixed(2);
                document.getElementById("quantity-" + cartItem.id).innerText = cartItem.quantity;
            } else {
                return null;
            }
        }
        return cartItem;
    });

    updatedCart = updatedCart.filter((item) => item !== null);

    saveCartToLocalStorage(updatedCart);
    calculateTotalPrice();
    grandPrice();
}


function increaseQuantity(productId) {
    const cart = getCartFromLocalStorage();
    let updatedCart = cart.map((cartItem) => {
        if (cartItem.id === productId) {

            console.error(cartItem.quantity);
            cartItem.quantity++;
            console.error(cartItem.quantity);
            cartItem.currentPrice = cartItem.price * cartItem.quantity;
            console.log(cartItem, cartItem.currentPrice, cartItem.quantity);
            document.getElementById("price-" + (cartItem.id).toString()).innerText = '$' + cartItem.currentPrice.toFixed(2);
            document.getElementById("quantity-" + (cartItem.id).toString()).innerText = cartItem.quantity;
        }
        return cartItem;
    });

    saveCartToLocalStorage(updatedCart);
    calculateTotalPrice();
    grandPrice();
}

