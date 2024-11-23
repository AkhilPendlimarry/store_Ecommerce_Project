import { fetchProductById, generateProductCards } from "./product.js";


document.addEventListener("DOMContentLoaded", function(){
    const productContainer = document.querySelector('.productContainer');
    const categorySection = document.getElementById('category-section');
    const productsTab = document.querySelector('.navbar ul li:nth-child(2) a'); // selects 2nd anchor tag in the nav-list.
    const heroSection = document.getElementById('hero-section');
    const productsSection = document.getElementById('products-section');
    const latestProductSection = document.getElementById('latest-section');
    const cartButton = document.getElementById('cart-button');
    const cartSection = document.getElementById('cart-section');
    const productDetailsSection = document.getElementById('product-details-section');
    const cartCount = document.getElementById('cart-count');
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
                
                  <div class="product-details-container">
                     <img src="${product.image}" alt="${product.title}" class="product-image">
                     <div class="product-content">
                        <h1>${product.title}</h1>
                        <p>${product.description}</p>
                        <p class="product-price">Price: $${product.price}</p>
                       <div class="button-group">
                        <button class="add-to-cart" data-product-id="${product.id}">Add to Cart</button>
                        <button  id="go-to-cart">Go to Cart</button>
                       </div>
                     </div>
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
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotalItems = document.getElementById('cart-total-items');
        const shippingChargesEl = document.getElementById('shipping-charges');
        const totalWithShippingEl = document.getElementById('totalWithShipping');
        const orderSummary = document.getElementById('order-summary');
        const emptyCartMsg = document.getElementById('empty-msg');
        const cartSection = document.getElementById('cart-section');
         
        cartItemsContainer.innerHTML = ''; //  clears existing items if any
       
        let total = 0;
        const shippingCharges = 30;

        if (cart.length === 0) {
            emptyCartMsg.classList.remove('hidden');  // shows empty cart message
            cartSection.classList.add('hidden');  // hides cart section 
            orderSummary.classList.add('hidden');
        } else {
            emptyCartMsg.classList.add('hidden'); // hides empty cart message
            cartSection.classList.remove('hidden'); // shows cart section
            orderSummary.classList.remove('hidden');
           
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;  // calculates the total for the item.
                total += itemTotal;

                const row = document.createElement('tr');
    
                row.innerHTML = `
                    <td class="cartImage">
                        <img src="${item.image}" alt="${item.title}" class='checkoutImage' style="width: 80px; height: 50px;">
                        ${item.title}
                    </td>
                    <td>
                        <button class="decrease" data-product-id="${item.id}">-</button>
                        ${item.quantity}
                        <button class="increase" data-product-id="${item.id}">+</button>
                    </td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td class='itemTotal'>$${itemTotal.toFixed(2)}</td>
                `;
               
                cartItemsContainer.appendChild(row);

            });
            console.log(cartItemsContainer.innerHTML)
            

            const totalWithShipping = total + shippingCharges;  // calc. total with shipping charges.
        

            // updating the total amount.
            cartTotalItems.textContent = cart.length; // updates item count
            shippingChargesEl.textContent = `Shipping: $${shippingCharges.toFixed(2)}`; // updates shipping value
            totalWithShippingEl.textContent = `$${totalWithShipping.toFixed(2)}`; // updates total + shipping value
            orderSummary.classList.remove('hidden');  // shows order summary
        }
        handleQuantityChanges();
    }

    function handleQuantityChanges(){
        const decreaseButton = document.querySelectorAll('.decrease');
        const increaseButton = document.querySelectorAll('.increase');

        decreaseButton.forEach(button=>{
            button.addEventListener('click', function(){
                const productId = parseInt(this.getAttribute('data-product-id'));
                const product =  cart.find(item=> item.id === productId);

                if(product){
                    product.quantity -= 1;
                    if(product.quantity === 0){
                        cart = cart.filter(item=> item.id !== productId);
                    }
                    updateCartStorage();
                    renderCartItems();
                }
            });

        });

        increaseButton.forEach(button=>{
            button.addEventListener('click', function(){
                const productId = parseInt(this.getAttribute('data-product-id'));
                const product =  cart.find(item=> item.id === productId);

                if(product){
                    product.quantity += 1;
                    updateCartStorage();
                    renderCartItems();
                }
            });

        });
    }

    function updateCartStorage(){
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
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
        if(!heroSection.classList.contains('hidden')){
            heroSection.classList.remove('hidden');
        };
    });

updateCartDisplay();
});


