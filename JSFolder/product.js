function fetchProductById(id) {
    return fetch(`https://fakestoreapi.com/products/${id}`)
        .then(response => {
            if (response.ok) {
                return response.json(); // parse & returns JSON data
            } else {
                return {}; // returns empty object/default value
            }
        })
        .catch(error => {
            console.error('Failed to fetch product details:', error);
            return {};
        });
}


async function displayProductDetails(productId) {
    const product = await fetchProductById(productId); 
    
    if (product) {                                   // if the product is retrieved successfully into the Product variable, perform this operation
        const productData = `                               
            <div class="productDetails">
                <h2>${product.category}</h2>
                <h1>${product.title}</h1>
                <img src="${product.image}" alt="${product.title}">
                <p>$${product.price.toFixed(2)}</p>
                <p>${product.rating.rate}</p>
                <p>${product.description}</p>
                <button id="add-to-cart">Add to Cart</button>
                <button id="go-to-cart">Go to Cart</button>
            </div>
        `;
        
        const productContainer = document.querySelector('.productContainer');
        productContainer.innerHTML = productData;
    } else {
        const productContainer = document.querySelector('.productContainer');
        productContainer.innerHTML = '<p>Product not found.</p>';
    }
}

export { displayProductDetails };
