/**
 * Cart functionality
 * Manages shopping cart operations including add, remove, update quantity
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart from localStorage or create empty cart
    let cart = JSON.parse(localStorage.getItem('cloudnovaCart')) || [];
    
    // Update cart count badge
    updateCartCount();
    
    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            const img = this.getAttribute('data-img');
            
            // Check if item already exists in cart
            const existingItemIndex = cart.findIndex(item => item.id === id);
            
            if (existingItemIndex > -1) {
                // Item exists, increment quantity
                cart[existingItemIndex].quantity += 1;
            } else {
                // Add new item to cart
                cart.push({
                    id: id,
                    name: name,
                    price: price,
                    img: img,
                    quantity: 1
                });
            }
            
            // Save cart to localStorage
            saveCart();
            
            // Update UI
            updateCartCount();
            
            // Show success message
            showToast(`${name} aggiunto al carrello`);
        });
    });
    
    // Cart button click - show modal
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            updateCartModal();
            const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
            cartModal.show();
        });
    }
    
    // Helper Functions
    
    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('cloudnovaCart', JSON.stringify(cart));
    }
    
    // Update cart count badge
    function updateCartCount() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
        
        cartCountElements.forEach(element => {
            element.textContent = itemCount;
        });
        
        // Enable/disable checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            if (itemCount > 0) {
                checkoutBtn.removeAttribute('disabled');
            } else {
                checkoutBtn.setAttribute('disabled', 'disabled');
            }
        }
    }
    
    // Update cart modal content
    function updateCartModal() {
        const cartItemsContainer = document.getElementById('cartItems');
        
        if (!cartItemsContainer) return;
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-center">Il tuo carrello è vuoto</p>';
            return;
        }
        
        let cartHTML = '';
        let total = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            cartHTML += `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-details">
                        <h5>${item.name}</h5>
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="cart-item-price">€${item.price.toFixed(2)}</div>
                            <div class="cart-item-quantity">
                                <button class="quantity-decrease">-</button>
                                <span>${item.quantity}</span>
                                <button class="quantity-increase">+</button>
                            </div>
                            <div class="cart-item-total">€${itemTotal.toFixed(2)}</div>
                            <div class="cart-item-remove"><i class="fas fa-trash"></i></div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        cartHTML += `
            <div class="d-flex justify-content-between align-items-center mt-4">
                <h5>Totale</h5>
                <div class="cart-total">€${total.toFixed(2)}</div>
            </div>
        `;
        
        cartItemsContainer.innerHTML = cartHTML;
        
        // Add event listeners for quantity buttons and remove buttons
        const quantityDecreaseButtons = cartItemsContainer.querySelectorAll('.quantity-decrease');
        const quantityIncreaseButtons = cartItemsContainer.querySelectorAll('.quantity-increase');
        const removeButtons = cartItemsContainer.querySelectorAll('.cart-item-remove');
        
        quantityDecreaseButtons.forEach(button => {
            button.addEventListener('click', function() {
                const cartItem = this.closest('.cart-item');
                const id = cartItem.getAttribute('data-id');
                decreaseQuantity(id);
            });
        });
        
        quantityIncreaseButtons.forEach(button => {
            button.addEventListener('click', function() {
                const cartItem = this.closest('.cart-item');
                const id = cartItem.getAttribute('data-id');
                increaseQuantity(id);
            });
        });
        
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const cartItem = this.closest('.cart-item');
                const id = cartItem.getAttribute('data-id');
                removeFromCart(id);
            });
        });
    }
    
    // Decrease item quantity
    function decreaseQuantity(id) {
        const itemIndex = cart.findIndex(item => item.id === id);
        
        if (itemIndex > -1) {
            if (cart[itemIndex].quantity > 1) {
                cart[itemIndex].quantity -= 1;
            } else {
                cart.splice(itemIndex, 1);
            }
            
            saveCart();
            updateCartCount();
            updateCartModal();
        }
    }
    
    // Increase item quantity
    function increaseQuantity(id) {
        const itemIndex = cart.findIndex(item => item.id === id);
        
        if (itemIndex > -1) {
            cart[itemIndex].quantity += 1;
            
            saveCart();
            updateCartCount();
            updateCartModal();
        }
    }
    
    // Remove item from cart
    function removeFromCart(id) {
        const itemIndex = cart.findIndex(item => item.id === id);
        
        if (itemIndex > -1) {
            const itemName = cart[itemIndex].name;
            cart.splice(itemIndex, 1);
            
            saveCart();
            updateCartCount();
            updateCartModal();
            
            showToast(`${itemName} rimosso dal carrello`);
        }
    }
    
    // Show toast notification
    function showToast(message) {
        // Check if toast container exists, if not create it
        let toastContainer = document.querySelector('.toast-container');
        
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
            document.body.appendChild(toastContainer);
        }
        
        // Create toast element
        const toastId = 'toast-' + Date.now();
        const toastHTML = `
            <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header">
                    <strong class="me-auto">CloudNova</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                    ${message}
                </div>
            </div>
        `;
        
        toastContainer.insertAdjacentHTML('beforeend', toastHTML);
        
        // Initialize and show toast
        const toastElement = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastElement, { autohide: true, delay: 3000 });
        toast.show();
        
        // Remove toast after it's hidden
        toastElement.addEventListener('hidden.bs.toast', function() {
            toastElement.remove();
        });
    }

    // Esporre funzioni globali per l'integrazione con checkout.js
    window.getCartItems = function() {
        return cart;
    };
    
    window.clearCart = function() {
        cart = [];
        saveCart();
        updateCartCount();
    };
});
