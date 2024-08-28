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

// function to generate product cards for scrolling.
async function generateProductCards() {
    const productIds = [5, 8, 13, 16, 20]; // random IDs were taken. we can replace these with specific product IDs
    const container = document.querySelector('.product-cards');

    for (let id of productIds) {
        const product = await fetchProductById(id);

        if (Object.keys(product).length) {
            const card = document.createElement('div');
            card.classList.add('card', 'product-card');

            card.innerHTML = `
                <img src="${product.image}" alt="${product.title}">
                <h2>${product.title}</h2>
                <button class="details-btn">Details</button>
                <button class="cart-btn">Add to Cart</button>
            `;

            container.appendChild(card);
        } else {
            console.error(`Product with ID ${id} not found.`);
        }
    }
    enableScrolling(container);
}
function enableScrolling(container){
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card =>{
        const clone=card.cloneNode(true);
        container.appendChild(clone);
    });
    container.addEventListener('scroll', function(){
        
        if(container.scrollLeft >= (container.scrollWidth / 2)){
            container.scrollLeft = 0;
        }
    });
}

// funtion to display product Detailed View.
async function displayProductDetails(productId) {
    const product = await fetchProductById(productId); 
    
    if (product) {                                   // if the product is retrieved successfully into the Product variable, perform this operation
        const productData = `                               
            <div class="productDetails">
                <div class="image-container">
                     <img src="${product.image}" alt="${product.title}">
                </div>
                <div class="contentBox">
                    <h2>${product.category}</h2>
                    <h1>${product.title}</h1>
                    <p>$${product.price.toFixed(2)}</p>
                    <p>${product.rating.rate}<i class="fa-solid fa-star"></i></p>
                    <p>${product.description}</p>
                    <button id="add-to-cart">Add to Cart</button>
                    <button id="go-to-cart">Go to Cart</button>
                </div>
            </div>
        `;
        
        const productContainer = document.querySelector('.productContainer');
        productContainer.innerHTML = productData;
    } else {
        const productContainer = document.querySelector('.productContainer');
        productContainer.innerHTML = '<p>Product not found.</p>';
    }
}

export { generateProductCards, displayProductDetails };
