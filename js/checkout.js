document.addEventListener('DOMContentLoaded', function() {
    const checkoutItemsContainer = document.getElementById('checkoutItems');
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    const checkoutForm = document.getElementById('checkoutForm');
    
    const orderConfirmationModal = document.getElementById('orderConfirmationModal');
    let orderConfirmationModalInstance = null;
    if (orderConfirmationModal) {
        orderConfirmationModalInstance = new bootstrap.Modal(orderConfirmationModal, {
            keyboard: false,
            backdrop: 'static'
        });
    }

    // Metodi di pagamento
    const creditCardRadio = document.getElementById('creditCard');
    const paypalRadio = document.getElementById('paypal');
    const bankTransferRadio = document.getElementById('bankTransfer');
    const creditCardForm = document.getElementById('creditCardForm');
    const paypalForm = document.getElementById('paypalForm');
    const bankTransferForm = document.getElementById('bankTransferForm');

    function updatePaymentForms() {
        if (creditCardForm) {
            creditCardForm.classList.toggle('d-none', !creditCardRadio.checked);
        }
        if (paypalForm) {
            paypalForm.classList.toggle('d-none', !paypalRadio.checked);
        }
        if (bankTransferForm) {
            bankTransferForm.classList.toggle('d-none', !bankTransferRadio.checked);
        }
    }

    if (creditCardRadio && paypalRadio && bankTransferRadio) {
        creditCardRadio.addEventListener('change', updatePaymentForms);
        paypalRadio.addEventListener('change', updatePaymentForms);
        bankTransferRadio.addEventListener('change', updatePaymentForms);
        updatePaymentForms(); // inizializza
    }

    if (checkoutItemsContainer) {
        loadCheckoutItems();
    }

    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();

            if (this.checkValidity()) {
                const orderNumber = 'CN-' + Math.floor(100000 + Math.random() * 900000);
                const orderNumberElement = document.getElementById('orderNumber');
                if (orderNumberElement) orderNumberElement.textContent = orderNumber;

                const today = new Date();
                const formattedDate = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
                const orderDateElement = document.getElementById('orderDate');
                if (orderDateElement) orderDateElement.textContent = formattedDate;

                if (orderConfirmationModalInstance) orderConfirmationModalInstance.show();
                if (window.clearCart) window.clearCart();
            } else {
                this.classList.add('was-validated');
            }
        });
    }

    function loadCheckoutItems() {
        const cart = window.getCartItems ? window.getCartItems() : [];
        if (!checkoutItemsContainer) return;

        if (cart.length === 0) {
            checkoutItemsContainer.innerHTML = '<p class="text-center">Il tuo carrello è vuoto</p>';
            updateOrderSummary(0);
            return;
        }

        let checkoutHTML = '';
        let subtotal = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            checkoutHTML += `
                <div class="d-flex mb-3 justify-content-end" style="max-width: 500px; margin-left: auto;">
                    <div class="flex-shrink-0">
                        <img src="${item.img || 'img/placeholder.jpg'}" alt="${item.name}" width="60" height="60" class="rounded">
                    </div>
                    <div class="flex-grow-1 ms-3 text-end">
                        <h6 class="mb-0">${item.name}</h6>
                        <p class="text-muted small mb-0">Quantità: ${item.quantity}</p>
                        <p class="mb-0">€${itemTotal.toFixed(2)}</p>
                    </div>
                </div>
            `;
        });

        checkoutItemsContainer.innerHTML = checkoutHTML;
        updateOrderSummary(subtotal);
    }

    function updateOrderSummary(subtotal) {
        const taxRate = 0.22;
        const tax = subtotal * taxRate;
        const total = subtotal + tax;

        if (subtotalElement) subtotalElement.textContent = '€' + subtotal.toFixed(2);
        if (taxElement) taxElement.textContent = '€' + tax.toFixed(2);
        if (totalElement) totalElement.textContent = '€' + total.toFixed(2);
    }
});
