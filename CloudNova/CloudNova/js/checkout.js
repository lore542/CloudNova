/**
 * Checkout functionality
 * Manages the checkout process and order confirmation
 */
document.addEventListener('DOMContentLoaded', function() {
    // Elementi del checkout
    const orderItemsContainer = document.getElementById('orderItems');
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    const orderConfirmationModal = new bootstrap.Modal(document.getElementById('orderConfirmationModal'), {
        keyboard: false,
        backdrop: 'static'
    });
    
    // Metodi di pagamento
    const creditCardRadio = document.getElementById('creditCard');
    const paypalRadio = document.getElementById('paypal');
    const bankTransferRadio = document.getElementById('bankTransfer');
    const creditCardForm = document.getElementById('creditCardForm');
    const paypalForm = document.getElementById('paypalForm');
    const bankTransferForm = document.getElementById('bankTransferForm');
    
    // Gestione dei metodi di pagamento
    if (creditCardRadio && paypalRadio && bankTransferRadio) {
        creditCardRadio.addEventListener('change', updatePaymentForms);
        paypalRadio.addEventListener('change', updatePaymentForms);
        bankTransferRadio.addEventListener('change', updatePaymentForms);
        
        function updatePaymentForms() {
            if (creditCardRadio.checked) {
                creditCardForm.classList.remove('d-none');
                paypalForm.classList.add('d-none');
                bankTransferForm.classList.add('d-none');
            } else if (paypalRadio.checked) {
                creditCardForm.classList.add('d-none');
                paypalForm.classList.remove('d-none');
                bankTransferForm.classList.add('d-none');
            } else if (bankTransferRadio.checked) {
                creditCardForm.classList.add('d-none');
                paypalForm.classList.add('d-none');
                bankTransferForm.classList.remove('d-none');
            }
        }
    }
    
    // Carica gli articoli dal carrello
    if (orderItemsContainer) {
        loadOrderItems();
    }
    
    // Event listener per il pulsante di conferma ordine
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', function() {
            // Validazione del form
            if (validateCheckoutForm()) {
                // Genera un numero d'ordine casuale
                const orderNumber = 'CN-' + Math.floor(100000 + Math.random() * 900000);
                document.getElementById('orderNumber').textContent = orderNumber;
                
                // Imposta la data dell'ordine
                const today = new Date();
                const formattedDate = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
                document.getElementById('orderDate').textContent = formattedDate;
                
                // Mostra il modal di conferma
                orderConfirmationModal.show();
                
                // Svuota il carrello
                window.clearCart();
            }
        });
    }
    
    // Funzione per caricare gli articoli dal carrello
    function loadOrderItems() {
        // Ottieni gli articoli dal carrello
        const cart = window.getCartItems ? window.getCartItems() : [];
        
        if (cart.length === 0) {
            orderItemsContainer.innerHTML = '<p class="text-center">Il tuo carrello è vuoto</p>';
            updateOrderSummary(0);
            return;
        }
        
        let orderHTML = '';
        let subtotal = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            orderHTML += `
                <div class="d-flex mb-3">
                    <div class="flex-shrink-0">
                        <img src="${item.img || 'img/placeholder.jpg'}" alt="${item.name}" width="60" height="60" class="rounded">
                    </div>
                    <div class="flex-grow-1 ms-3">
                        <h6 class="mb-0">${item.name}</h6>
                        <p class="text-muted small mb-0">Quantità: ${item.quantity}</p>
                        <p class="mb-0">€${itemTotal.toFixed(2)}</p>
                    </div>
                </div>
            `;
        });
        
        orderItemsContainer.innerHTML = orderHTML;
        updateOrderSummary(subtotal);
    }
    
    // Funzione per aggiornare il riepilogo dell'ordine
    function updateOrderSummary(subtotal) {
        const taxRate = 0.22; // 22% IVA
        const tax = subtotal * taxRate;
        const total = subtotal + tax;
        
        if (subtotalElement) subtotalElement.textContent = '€' + subtotal.toFixed(2);
        if (taxElement) taxElement.textContent = '€' + tax.toFixed(2);
        if (totalElement) totalElement.textContent = '€' + total.toFixed(2);
        
        // Disabilita il pulsante di conferma se il carrello è vuoto
        if (placeOrderBtn) {
            if (subtotal === 0) {
                placeOrderBtn.setAttribute('disabled', 'disabled');
            } else {
                placeOrderBtn.removeAttribute('disabled');
            }
        }
    }
    
    // Funzione per validare il form di checkout
    function validateCheckoutForm() {
        // Ottieni tutti i form
        const checkoutForm = document.getElementById('checkoutForm');
        const billingForm = document.getElementById('billingForm');
        const paymentForm = document.getElementById('paymentForm');
        const notesForm = document.getElementById('notesForm');
        
        // Verifica se i form esistono
        if (!checkoutForm || !billingForm || !paymentForm || !notesForm) {
            return false;
        }
        
        // Aggiungi la classe was-validated per mostrare i messaggi di errore
        checkoutForm.classList.add('was-validated');
        billingForm.classList.add('was-validated');
        paymentForm.classList.add('was-validated');
        notesForm.classList.add('was-validated');
        
        // Verifica la validità dei form
        const isCheckoutValid = checkoutForm.checkValidity();
        const isBillingValid = billingForm.checkValidity();
        const isPaymentValid = paymentForm.checkValidity();
        const isNotesValid = notesForm.checkValidity();
        
        // Verifica se tutti i form sono validi
        return isCheckoutValid && isBillingValid && isPaymentValid && isNotesValid;
    }
});
