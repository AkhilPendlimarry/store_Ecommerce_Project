import { generateProductCards, displayProductDetails } from "./product.js";


document.addEventListener("DOMContentLoaded", function(){
    const productContainer = document.querySelector('.productContainer');
    const categorySection = document.getElementById('category-section');
    const productsTab = document.querySelector('.navbar ul li:nth-child(2) a'); // selects 2nd anchor tag in the nav-list.
    const heroSection = document.getElementById('hero-section');
    const productsSection = document.getElementById('products-section');
    const latestProductSection = document.getElementById('latest-section');
    const HR = document.getElementById('hr');
    const text = document.querySelector('h3');
   // const cartButton = document.getElementById('cart-button');
    const cartCount = document.getElementById('cart-button');
    let cart = JSON.parse(localStorage.getItem('cart')) || []; // gets cart data from local storage.
    //console.log(cartButton);

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
            <button id="add-to-cart" data-product-id="${product.id}">Add to Cart</button>
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
                heroSection.style.display = 'none';
                latestProductSection.style.display = 'none';
                HR.style.display = 'none';
                categorySection.style.display = 'none';
                text.style.display = 'block';

               displayProductDetails(productId);
               generateProductCards();
               }
            if (e.target.id === 'add-to-cart'){
                const productId = parseInt(e.target.getAttribute('data-product-id'));
                addToCart(productId);
            }
    });    
        
    // function to add a product to the cart
    function addToCart(productId){
        const product = allProducts.find(item => item.id === productId);
        const existingProduct = cart.find(item => item.id === productId);

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
         const totalItems = cart.reduce((acc, product) => acc + product.quantity, 0);
         //cartCount.textContent = totalItems;
          cartCount.innerHTML = `cart(${totalItems})`; //`<i class="cart-button"></i>Cart(${totalItems})`;

    }
      document.querySelectorAll('.add-to-cart').forEach(button =>
      {
        button.addEventListener('click', function(){
            const productId = parseInt(this.getAttribute('data-product-id'));
            addToCart(productId);
        });
      }
      );

     updateCartDisplay();
});
