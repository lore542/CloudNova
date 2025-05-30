/**
 * Cart functionality - Optimized Version
 * Manages shopping cart operations including add, remove, update quantity
 * with improved error handling and user feedback
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
            const img = this.getAttribute('data-img') || 'img/placeholder.jpg';
            
            // Check if item already exists in cart
            const existingItemIndex = cart.findIndex(item => item.id === id);
            
            if (existingItemIndex > -1) {
                // Item exists, increment quantity
                cart[existingItemIndex].quantity += 1;
                showToast(`Quantità di ${name} aumentata a ${cart[existingItemIndex].quantity}`, 'success');
            } else {
                // Add new item to cart
                cart.push({
                    id: id,
                    name: name,
                    price: price,
                    img: img,
                    quantity: 1
                });
                showToast(`${name} aggiunto al carrello`, 'success');
            }
            
            // Save cart to localStorage
            saveCart();
            
            // Update UI
            updateCartCount();
            
            // Animate cart icon
            animateCartIcon();
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
        try {
            localStorage.setItem('cloudnovaCart', JSON.stringify(cart));
        } catch (e) {
            console.error('Error saving cart to localStorage:', e);
            showToast('Errore nel salvare il carrello. Verifica le impostazioni del browser.', 'error');
        }
    }
    
    // Update cart count badge
    function updateCartCount() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
        
        cartCountElements.forEach(element => {
            element.textContent = itemCount;
            
            // Add animation class and then remove it
            element.classList.add('highlight-change');
            setTimeout(() => {
                element.classList.remove('highlight-change');
            }, 1000);
        });
        
        // Enable/disable checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            if (itemCount > 0) {
                checkoutBtn.removeAttribute('disabled');
                checkoutBtn.classList.add('btn-primary');
                checkoutBtn.classList.remove('btn-secondary');
            } else {
                checkoutBtn.setAttribute('disabled', 'disabled');
                checkoutBtn.classList.add('btn-secondary');
                checkoutBtn.classList.remove('btn-primary');
            }
        }
    }
    
    // Animate cart icon
    function animateCartIcon() {
        const cartIcon = cartBtn.querySelector('i');
        if (cartIcon) {
            cartIcon.classList.add('fa-bounce');
            setTimeout(() => {
                cartIcon.classList.remove('fa-bounce');
            }, 1000);
        }
    }
    
    // Update cart modal content
    function updateCartModal() {
        const cartItemsContainer = document.getElementById('cartItems');
        
        if (!cartItemsContainer) return;
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="text-center py-4">
                    <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                    <p>Il tuo carrello è vuoto</p>
                    <a href="offerte.html" class="btn btn-outline-primary mt-2">Scopri le nostre offerte</a>
                </div>
            `;
            return;
        }
        
        let cartHTML = '';
        let total = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            cartHTML += `
                <div class="cart-item mb-3 pb-3 border-bottom" data-id="${item.id}">
                    <div class="d-flex">
                        <img src="${item.img}" alt="${item.name}" class="me-3 rounded" style="width: 70px; height: 70px; object-fit: cover;">
                        <div class="flex-grow-1">
                            <h5 class="mb-1">${item.name}</h5>
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="d-flex align-items-center">
                                    <button class="btn btn-sm btn-outline-secondary quantity-decrease me-2" aria-label="Diminuisci quantità">
                                        <i class="fas fa-minus"></i>
                                    </button>
                                    <span class="mx-2">${item.quantity}</span>
                                    <button class="btn btn-sm btn-outline-secondary quantity-increase ms-2" aria-label="Aumenta quantità">
                                        <i class="fas fa-plus"></i>
                                    </button>
                                </div>
                                <div class="d-flex align-items-center">
                                    <div class="me-3 fw-bold">€${itemTotal.toFixed(2)}</div>
                                    <button class="btn btn-sm btn-outline-danger cart-item-remove" aria-label="Rimuovi dal carrello">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        cartHTML += `
            <div class="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                <h5 class="mb-0">Totale</h5>
                <div class="fw-bold fs-5">€${total.toFixed(2)}</div>
            </div>
            <div class="d-flex justify-content-between mt-3">
                <button class="btn btn-outline-danger btn-sm" id="clearCartBtn">
                    <i class="fas fa-trash me-1"></i> Svuota carrello
                </button>
                <button class="btn btn-outline-primary btn-sm" id="saveCartBtn">
                    <i class="fas fa-save me-1"></i> Salva carrello
                </button>
            </div>
        `;
        
        cartItemsContainer.innerHTML = cartHTML;
        
        // Add event listeners for quantity buttons and remove buttons
        const quantityDecreaseButtons = cartItemsContainer.querySelectorAll('.quantity-decrease');
        const quantityIncreaseButtons = cartItemsContainer.querySelectorAll('.quantity-increase');
        const removeButtons = cartItemsContainer.querySelectorAll('.cart-item-remove');
        const clearCartBtn = document.getElementById('clearCartBtn');
        const saveCartBtn = document.getElementById('saveCartBtn');
        
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
        
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', function() {
                if (confirm('Sei sicuro di voler svuotare il carrello?')) {
                    clearCart();
                    updateCartModal();
                    showToast('Carrello svuotato', 'info');
                }
            });
        }
        
        if (saveCartBtn) {
            saveCartBtn.addEventListener('click', function() {
                // Generate a unique cart ID
                const cartId = 'cart_' + Date.now();
                
                // Save cart with ID
                try {
                    localStorage.setItem('savedCart_' + cartId, JSON.stringify(cart));
                    showToast('Carrello salvato con successo', 'success');
                } catch (e) {
                    console.error('Error saving cart:', e);
                    showToast('Errore nel salvare il carrello', 'error');
                }
            });
        }
    }
    
    // Decrease item quantity
    function decreaseQuantity(id) {
        const itemIndex = cart.findIndex(item => item.id === id);
        
        if (itemIndex > -1) {
            const itemName = cart[itemIndex].name;
            
            if (cart[itemIndex].quantity > 1) {
                cart[itemIndex].quantity -= 1;
                showToast(`Quantità di ${itemName} diminuita a ${cart[itemIndex].quantity}`, 'info');
            } else {
                // Ask for confirmation before removing the last item
                if (confirm(`Rimuovere ${itemName} dal carrello?`)) {
                    cart.splice(itemIndex, 1);
                    showToast(`${itemName} rimosso dal carrello`, 'info');
                } else {
                    return; // User canceled, do nothing
                }
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
            
            showToast(`Quantità di ${cart[itemIndex].name} aumentata a ${cart[itemIndex].quantity}`, 'success');
        }
    }
    
    // Remove item from cart
    function removeFromCart(id) {
        const itemIndex = cart.findIndex(item => item.id === id);
        
        if (itemIndex > -1) {
            const itemName = cart[itemIndex].name;
            
            // Ask for confirmation
            if (confirm(`Sei sicuro di voler rimuovere ${itemName} dal carrello?`)) {
                cart.splice(itemIndex, 1);
                
                saveCart();
                updateCartCount();
                updateCartModal();
                
                showToast(`${itemName} rimosso dal carrello`, 'info');
            }
        }
    }
    
    // Clear cart
    function clearCart() {
        cart = [];
        saveCart();
        updateCartCount();
    }
    
    // Show toast notification
    function showToast(message, type = 'info') {
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
            <div id="${toastId}" class="toast ${type}" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header">
                    <strong class="me-auto">CloudNova</strong>
                    <small>${type === 'error' ? 'Errore' : type === 'success' ? 'Successo' : 'Info'}</small>
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
        clearCart();
        return true;
    };
    
    window.updateCartCount = function() {
        updateCartCount();
    };
    
    window.showToast = function(message, type) {
        showToast(message, type);
    };
});
