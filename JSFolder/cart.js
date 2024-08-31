document.addEventListener("DOMContentLoaded", function() {
    const cartBtn = document.getElementById('cart-button');
    const homeBtn = document.getElementById('home-tab');
    const heroSection = document.getElementById('hero-section');
    const cartSection = document.getElementById('cart-view');
    

    cartBtn.addEventListener('click', () => {
        heroSection.style.display = 'none';
        cartSection.style.display = 'block';
        renderCartItems();
    });

    homeBtn.addEventListener('click', () => {
        heroSection.style.display = 'block';
        cartSection.style.display = 'none';
    });

    function renderCartItems() {
        cartSection.innerHTML = ''; // Clear previous content

        if (cartItems.length === 0) {
            const cartView = document.createElement('div');
            cartView.id = 'cartView';

            const cartTitle = document.createElement('h2');
            cartTitle.textContent = 'Cart';

            const hr = document.createElement('hr');

            const emptyCartMessage = document.createElement('p');
            emptyCartMessage.textContent = 'Your cart is Empty';

            const shoppingBtn = document.createElement('button');
            shoppingBtn.id = 'shoppingBtn';

            const arrowIcon = document.createElement('i');
            arrowIcon.className = 'fa-solid fa-arrow-left';
            shoppingBtn.appendChild(arrowIcon);

            shoppingBtn.appendChild(document.createTextNode(' Continue shopping'));

            cartView.appendChild(cartTitle);
            cartView.appendChild(hr);
            cartView.appendChild(emptyCartMessage);
            cartView.appendChild(shoppingBtn);

            shoppingBtn.addEventListener('click', () => {
                heroSection.style.display = 'block';
                cartSection.style.display = 'none';
            });

            cartSection.appendChild(cartView);
        } else {
            const cartTable = document.createElement('table');
            cartTable.id = 'cart-table';

            const thead = document.createElement('thead');
            const tr = document.createElement('tr');

            const thImage = document.createElement('th');
            thImage.textContent = 'Image';

            const thTitle = document.createElement('th');
            thTitle.textContent = 'Title';

            const thQuantity = document.createElement('th');
            thQuantity.textContent = 'Quantity';

            const thTotalPrice = document.createElement('th');
            thTotalPrice.textContent = 'Total Price';

            tr.appendChild(thImage);
            tr.appendChild(thTitle);
            tr.appendChild(thQuantity);
            tr.appendChild(thTotalPrice);

            thead.appendChild(tr);
            cartTable.appendChild(thead);

            const tbody = document.createElement('tbody');
            tbody.id = 'cart-items';

            cartItems.forEach((item, index) => {
                const tr = document.createElement('tr');

                const tdImage = document.createElement('td');
                const img = document.createElement('img');
                img.src = item.image;
                img.alt = item.title;
                img.style.width = '450px';
                tdImage.appendChild(img);

                const tdTitle = document.createElement('td');
                tdTitle.textContent = item.title;

                const tdQuantity = document.createElement('td');
                const decreaseBtn = document.createElement('button');
                decreaseBtn.textContent = '-';
                decreaseBtn.addEventListener('click', () => {
                    updateQuantity(index, -1);
                });

                const quantitySpan = document.createElement('span');
                quantitySpan.textContent = item.quantity;

                const increaseBtn = document.createElement('button');
                increaseBtn.textContent = '+';
                increaseBtn.addEventListener('click', () => {
                    updateQuantity(index, 1);
                });

                tdQuantity.appendChild(decreaseBtn);
                tdQuantity.appendChild(quantitySpan);
                tdQuantity.appendChild(increaseBtn);

                const tdTotalPrice = document.createElement('td');
                tdTotalPrice.textContent = `$${item.quantity * item.price}`;

                tr.appendChild(tdImage);
                tr.appendChild(tdTitle);
                tr.appendChild(tdQuantity);
                tr.appendChild(tdTotalPrice);

                tbody.appendChild(tr);
            });

            cartTable.appendChild(tbody);
            cartSection.appendChild(cartTable);

            // Cart Summary
            const cartSummary = document.createElement('div');
            cartSummary.id = 'cart-summary';

            const totalProductPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
            const shippingCharges = 30; // Fixed shipping charge
            const totalPrice = totalProductPrice + shippingCharges;

            cartSummary.innerHTML = `
                <h3>Total Product Price: $${totalProductPrice.toFixed(2)}</h3>
                <h3>Shipping Charges: $${shippingCharges.toFixed(2)}</h3>
                <h3>Total Price: $${totalPrice.toFixed(2)}</h3>
            `;

            cartSection.appendChild(cartSummary);
        }
    }

    function updateQuantity(index, change) {
        cartItems[index].quantity += change;
        if (cartItems[index].quantity <= 0) {
            cartItems.splice(index, 1);
        }
        renderCartItems();
    }

});
