export async function fetchProductById(id) {
    try {
        const response = await fetch(`https://fakestoreapi.com/products/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
        
    } catch (error) {
        console.error('Failed to fetch product details:', error);
        return null;  // Return null if the fetch fails
    }
}


// function to generate product cards for scrolling.
export async function generateProductCards() {
    const productIds = [5, 8, 13, 16, 20]; // random IDs were taken. we can replace these with specific product IDs
    const container = document.querySelector('product-cards');
    //console.log(container);
    for (let id of productIds) {
        const product = await fetchProductById(id);

        if (Object.keys(product).length) {
            const card = document.createElement('div');
            card.classList.add('card', 'product-card');

            card.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
             <div class="cardContent">
                <h2>${product.title}</h2>
                <button class="details-btn">Details</button>
                <button class="cart-btn">Add to Cart</button>
             </div>
                `;
            container.append(card);
        } else {
            console.error(`Product with ID ${id} not found.`);
        }
    }
    enableScrolling(container);

function enableScrolling(container){
    const productCards = document.querySelector(' product-cards');

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
}
// funtion to display product Detailed View.
export async function displayProductDetails(productId) {
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

// export {fetchProductById, generateProductCards, displayProductDetails };