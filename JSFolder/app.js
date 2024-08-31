import { fetchProductById, generateProductCards, displayProductDetails } from "./product.js";


document.addEventListener("DOMContentLoaded", function(){
    const productContainer = document.querySelector('.productContainer');
    const categorySection = document.getElementById('category-section');
    const productsTab = document.querySelector('.navbar ul li:nth-child(2) a'); // selects 2nd anchor tag in the nav-list.
    const heroSection = document.getElementById('hero-section');
    const productsSection = document.getElementById('products-section');
    const latestProductSection = document.getElementById('latest-section');
    const HR = document.getElementById('hr');
    const text = document.querySelector('h3');
    const cartButton = document.getElementById('cart-button');
    const cartSection = document.getElementById('cart-section');
    const productDetailsSection = document.getElementById('product-details-section');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const orderSummary = document.getElementById('order-summary');
    const emptyCartMsg = document.getElementById('empty-msg');
    const backToProductsBtn = document.getElementById('back-to-products');
    

    let cart = JSON.parse(localStorage.getItem('cart')) || []; // gets cart data from local storage.

    let allProducts = []; // fetched products will be stored into an empty array.

    // fetching products from the API
    fetch('https://fakestoreapi.com/products')
    .then(response=> response.json())
    .then(products => {
        allProducts = products; // stores fetched products
        renderProducts(allProducts); // initial rendering all products into teh page.
    })
    .catch(error => console.error('Error Fetching Products:', error));

    // function to create a product card
    function createProductCard(product){
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>${product.description}</p>
            <hr>
            <p class="price">$${product.price}</p>
            <hr>
            <button class="detailsBtn" data-product-id="${product.id}">Details</button>
            <button class="add-to-cart" data-product-id="${product.id}">Add to Cart</button>
            `;
     
            return productCard;
        }

   
        // function to render products into the product card.
        function renderProducts(products){
            productContainer.innerHTML = ''; 
            // using map to create an array of cards.
            const productCards = products.map(product=> createProductCard(product));
            // using forEach to append each card item to the container.
            productCards.forEach(productCard => {
                productContainer.appendChild(productCard);
                //console.log(productCard);
            });
        }

    
        // filtering based on category
        categorySection.addEventListener('click', function(e){
            const selectedCategory = e.target.getAttribute('data-category');
            if(selectedCategory === 'All'){
                renderProducts(allProducts); // this will show all products if All is selected.
            }else{
                const filteredProducts = allProducts.filter(product => {
                    return product.category.toLowerCase() === selectedCategory.toLowerCase();
            
                });
                renderProducts(filteredProducts); // this can render products by filtering categories.
            }
            
        });

        // adding event listener to teh products tab
        productsTab.addEventListener('click', function(e){
            e.preventDefault();
            heroSection.style.display = 'none'; // hides hero section
            productsSection.style.display = 'block'; // show products section
        });    

        //adding event listener to the Details button, add to cart button.
        productContainer.addEventListener('click', function(e){
            if(e.target.classList.contains('detailsBtn')){
                const productId = parseInt(e.target.getAttribute('data-product-id'));
                displayProductDetails(productId);
            } if(e.target.classList.contains('add-to-cart')){
                const productId = e.target.getAttribute('data-product-id');
                addToCart(productId);
            }
        });
           
      

    // display product details
    function displayProductDetails(productId) {
        fetchProductById(productId).then(product => {
            productDetailsSection.innerHTML = `
                <div class="productDetails">
                    <img src="${product.image}" alt="${product.title}">
                    <h1>${product.title}</h1>
                    <p>${product.description}</p>
                    <p>$${product.price}</p>
                    <button class="add-to-cart" data-product-id="${product.id}">Add to Cart</button>
                    <button id="go-to-cart">Go to Cart</button>
                </div>
            `;
            productDetailsSection.classList.remove('hidden');
            productsSection.classList.add('hidden');
            heroSection.classList.add('hidden');
            cartSection.classList.add('hidden');
        });
    }
        
    // function to add a product to the cart
    function addToCart(productId){
        const product = allProducts.find(item => item.id === parseInt(productId));
        const existingProduct = cart.find(item => item.id === parseInt(productId));

        if(existingProduct){
            existingProduct.quantity += 1;
        } else {
            cart.push({...product, quantity:1});
        }
        localStorage.setItem('cart', JSON.stringify(cart));  // sets the cart data into local storage.
        updateCartDisplay();
    }

    // function to update cart display 
    function updateCartDisplay() {
         cartCount.textContent = `(${cart.reduce((acc, product) => acc + product.quantity, 0)})`;
         renderCartItems();
        }

    // render cart items
    function renderCartItems(){
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotalItems = document.getElementById('cart-total-items');
        const cartTotalAmount = document.getElementById('totalWithShipping');
        const orderSummary = document.getElementById('order-summary');
        const emptyCartMsg = document.getElementById('empty-cart-msg');
        cartItemsContainer.innerHTML = ''; 
        const tableBody = document.getElementById('cart-items');
        const table = document.getElementById('cart-table');
        tableBody.innerHTML = "";
        let total = 0;
        const shippingCharges = 30;
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            emptyCartMsg.classList.remove('hidden');
            cartItemsContainer.classList.add('hidden');
            orderSummary.classList.add('hidden');
        } else {
            emptyCartMsg.classList.add('hidden');
            cartItemsContainer.classList.remove('hidden');
            orderSummary.classList.remove('hidden');
           
            cart.forEach(item => {
                if (item.title && item.image && item.price) {
                    const itemTotal = item.price * item.quantity;
                    total += itemTotal;

                const row = document.createElement('tr');
    
                row.innerHTML = `
                    <td><img src="${item.image}" alt="${item.title}" class='checkoutImage'></td>
                    <td>${item.title}</td>
                    <td>
                        <i class="fa-solid fa-minus" data-product-id="${item.id}"></i>
                        ${item.quantity}
                        <i class="fa-solid fa-plus" data-product-id="${item.id}"></i>
                    </td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td class='itemTotal'>$${itemTotal.toFixed(2)}</td>
                `;
                tableBody.appendChild(row);
                total += product.price * product.quantity + shippingCharges;
                }
            table.appendChild(tableBody);
            cartItemsContainer.appendChild(row);
            })
        

            // updating the total amount.
            document.getElementById('cart-total-items').textContent = cart.length;
            document.getElementById('cart-total-amount').textContent = total.toFixed(2);
            document.getElementById('shipping-charges').textContent = `$${shippingCharges.toFixed(2)}`;
            document.getElementById('totalWithShipping').textContent = `$${totalWithShipping.toFixed(2)}`;
        }
    }

        
    
    // shows cart button on click      
    cartButton.addEventListener('click', function(){
        heroSection.classList.add('hidden');
        productsSection.classList.add('hidden');  
        productDetailsSection.classList.add('hidden');
        cartSection.classList.remove('hidden');
        renderCartItems();       
    });
    //on click to handle back
    backToProductsBtn.addEventListener('click', () => {
        productDetailsSection.classList.add('hidden');
        cartSection.classList.add('hidden');
        productsSection.classList.remove('hidden');
        heroSection.classList.add('hidden');
    });

updateCartDisplay();
});
generateProductCards();
fetchProductById();
