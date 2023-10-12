async function fetchAndDisplayProducts() {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const products = await response.json();

        localStorage.setItem('products', JSON.stringify(products));
        console.log(products)
        displayProducts(products);
    } catch (error) {
        console.error(error);
    }
}

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

            card.innerHTML = `
                <div class="card" data-product-id="${product.id}">
                    <div class="image-container">
                        <img src="${product.image}" class="card-img-top" alt="${product.title}">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${product.title}</h5>
                        <p class="card-text">Rating: ${product.rating.rate} (${product.rating.count} reviews)</p>
                        <p class="card-text" id="price">Price: $${product.price}</p>
                        <button class="btn btn-primary add-to-cart" data-product-id="${product.id}">Add to Cart</button>
                    </div>
                </div>
            `;

            productCardsContainer.appendChild(card);
        }
    });
}

function isValidProduct(product) {
    return (
        typeof product === 'object' &&
        product !== null &&
        typeof product.id === 'number' &&
        typeof product.title === 'string' &&
        typeof product.image === 'string' &&
        typeof product.rating === 'object' &&
        typeof product.rating.rate === 'number' &&
        typeof product.rating.count === 'number' &&
        typeof product.price === 'number' &&
        !isNaN(product.price)
    );
}

fetchAndDisplayProducts();