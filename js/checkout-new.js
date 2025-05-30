/**
 * Checkout functionality - Optimized Version
 * Manages the checkout process and order confirmation
 * with improved validation, accessibility and user experience
 */
document.addEventListener('DOMContentLoaded', function() {
    // Elementi del checkout
    const checkoutItemsContainer = document.getElementById('checkoutItems');
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    const discountRow = document.getElementById('discountRow');
    const discountElement = document.getElementById('discount');
    const checkoutForm = document.getElementById('checkoutForm');
    
    // Progress steps
    const progressSteps = document.querySelectorAll('.progress-step');
    const progressConnectors = document.querySelectorAll('.progress-connector');
    
    // Step navigation
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');
    const nextToStep2 = document.getElementById('nextToStep2');
    const backToStep1 = document.getElementById('backToStep1');
    const nextToStep3 = document.getElementById('nextToStep3');
    const backToStep2 = document.getElementById('backToStep2');
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    
    // Modal di conferma ordine
    const orderConfirmationModal = document.getElementById('orderConfirmationModal');
    let orderConfirmationModalInstance = null;
    if (orderConfirmationModal) {
        orderConfirmationModalInstance = new bootstrap.Modal(orderConfirmationModal, {
            keyboard: false,
            backdrop: 'static'
        });
    }
    
    // Metodi di pagamento
    const paymentMethodCards = document.querySelectorAll('.payment-method-card');
    const creditCardForm = document.getElementById('creditCardForm');
    
    // Inizializzazione
    initializeCheckout();
    
    // Funzione di inizializzazione
    function initializeCheckout() {
        // Carica gli articoli dal carrello
        if (checkoutItemsContainer) {
            loadCheckoutItems();
        }
        
        // Gestione dei metodi di pagamento
        if (paymentMethodCards.length > 0) {
            paymentMethodCards.forEach(card => {
                card.addEventListener('click', function() {
                    // Rimuovi la classe selected da tutte le carte
                    paymentMethodCards.forEach(c => c.classList.remove('selected'));
                    
                    // Aggiungi la classe selected alla carta cliccata
                    this.classList.add('selected');
                    
                    // Mostra/nascondi il form della carta di credito
                    if (creditCardForm) {
                        if (this.getAttribute('data-payment') === 'creditCard') {
                            creditCardForm.style.display = 'block';
                        } else {
                            creditCardForm.style.display = 'none';
                        }
                    }
                });
            });
        }
        
        // Gestione del codice promozionale
        const promoCodeInput = document.getElementById('promoCode');
        const applyPromoBtn = document.getElementById('applyPromoBtn');
        
        if (promoCodeInput && applyPromoBtn) {
            applyPromoBtn.addEventListener('click', function() {
                const promoCode = promoCodeInput.value.trim().toUpperCase();
                
                if (promoCode === 'CLOUD10') {
                    // Applica uno sconto del 10%
                    applyDiscount(0.1);
                    showToast('Codice promozionale applicato: 10% di sconto!', 'success');
                    promoCodeInput.disabled = true;
                    applyPromoBtn.disabled = true;
                } else if (promoCode === 'NOVA20') {
                    // Applica uno sconto del 20%
                    applyDiscount(0.2);
                    showToast('Codice promozionale applicato: 20% di sconto!', 'success');
                    promoCodeInput.disabled = true;
                    applyPromoBtn.disabled = true;
                } else {
                    showToast('Codice promozionale non valido', 'error');
                    promoCodeInput.classList.add('is-invalid');
                    setTimeout(() => {
                        promoCodeInput.classList.remove('is-invalid');
                    }, 3000);
                }
            });
            
            // Validazione in tempo reale del codice promo
            promoCodeInput.addEventListener('input', function() {
                this.value = this.value.replace(/[^A-Za-z0-9]/g, '');
                if (this.classList.contains('is-invalid')) {
                    this.classList.remove('is-invalid');
                }
            });
        }
        
        // Gestione della navigazione tra gli step
        setupStepNavigation();
        
        // Gestione del pulsante di completamento ordine
        if (placeOrderBtn) {
            placeOrderBtn.addEventListener('click', function() {
                if (validateStep3()) {
                    // Genera un numero d'ordine casuale
                    const orderNumber = 'CN-' + Math.floor(100000 + Math.random() * 900000);
                    
                    // Aggiorna il numero d'ordine nel modal
                    const orderNumberElement = document.getElementById('orderNumber');
                    if (orderNumberElement) {
                        orderNumberElement.textContent = orderNumber;
                    }
                    
                    // Imposta la data dell'ordine
                    const today = new Date();
                    const formattedDate = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
                    const orderDateElement = document.getElementById('orderDate');
                    if (orderDateElement) {
                        orderDateElement.textContent = formattedDate;
                    }
                    
                    // Mostra il modal di conferma
                    if (orderConfirmationModalInstance) {
                        orderConfirmationModalInstance.show();
                    }
                    
                    // Svuota il carrello
                    if (window.clearCart) {
                        window.clearCart();
                    }
                }
            });
        }
        
        // Inizializza la validazione in tempo reale
        setupRealTimeValidation();
        
        // Inizializza il rilevamento automatico del tipo di carta
        setupCreditCardDetection();
    }
    
    // Configurazione della navigazione tra gli step
    function setupStepNavigation() {
        if (nextToStep2) {
            nextToStep2.addEventListener('click', function() {
                if (validateStep1()) {
                    goToStep(2);
                }
            });
        }
        
        if (backToStep1) {
            backToStep1.addEventListener('click', function() {
                goToStep(1);
            });
        }
        
        if (nextToStep3) {
            nextToStep3.addEventListener('click', function() {
                if (validateStep2()) {
                    goToStep(3);
                }
            });
        }
        
        if (backToStep2) {
            backToStep2.addEventListener('click', function() {
                goToStep(2);
            });
        }
    }
    
    // Funzione per navigare tra gli step
    function goToStep(stepNumber) {
        // Nascondi tutti gli step
        [step1, step2, step3].forEach(step => {
            if (step) step.classList.remove('active');
        });
        
        // Mostra lo step corrente
        const currentStep = document.getElementById('step' + stepNumber);
        if (currentStep) {
            currentStep.classList.add('active');
            currentStep.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        // Aggiorna gli indicatori di progresso
        updateProgressIndicators(stepNumber);
        
        // Annuncia il cambio di step per screen reader
        announceStepChange(stepNumber);
    }
    
    // Aggiorna gli indicatori di progresso
    function updateProgressIndicators(currentStep) {
        // Aggiorna i progress step
        progressSteps.forEach(step => {
            const stepNumber = parseInt(step.getAttribute('data-step'));
            
            step.classList.remove('active', 'completed');
            
            if (stepNumber < currentStep) {
                step.classList.add('completed');
            } else if (stepNumber === currentStep) {
                step.classList.add('active');
            }
        });
        
        // Aggiorna i connettori
        progressConnectors.forEach(connector => {
            const connectorData = connector.getAttribute('data-connector').split('-');
            const fromStep = parseInt(connectorData[0]);
            const toStep = parseInt(connectorData[1]);
            
            connector.classList.remove('active', 'completed');
            
            if (fromStep < currentStep && toStep <= currentStep) {
                connector.classList.add('completed');
            } else if (fromStep < currentStep && toStep > currentStep) {
                connector.classList.add('active');
            }
        });
    }
    
    // Annuncia il cambio di step per screen reader
    function announceStepChange(stepNumber) {
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', 'polite');
        announcer.classList.add('sr-only');
        
        let stepName = '';
        switch(stepNumber) {
            case 1: stepName = 'Informazioni Personali'; break;
            case 2: stepName = 'Indirizzo di Fatturazione'; break;
            case 3: stepName = 'Metodo di Pagamento'; break;
            case 4: stepName = 'Conferma Ordine'; break;
        }
        
        announcer.textContent = `Passaggio ${stepNumber}: ${stepName}`;
        document.body.appendChild(announcer);
        
        setTimeout(() => {
            document.body.removeChild(announcer);
        }, 1000);
    }
    
    // Configurazione della validazione in tempo reale
    function setupRealTimeValidation() {
        // Validazione in tempo reale per i campi di input
        const formInputs = document.querySelectorAll('input, select, textarea');
        
        formInputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateInput(this);
            });
            
            input.addEventListener('input', function() {
                // Rimuovi la classe is-invalid quando l'utente inizia a digitare
                if (this.classList.contains('is-invalid')) {
                    this.classList.remove('is-invalid');
                }
            });
        });
        
        // Validazione speciale per campi specifici
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.addEventListener('blur', function() {
                if (this.value && !isValidEmail(this.value)) {
                    this.classList.add('is-invalid');
                }
            });
        }
        
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function() {
                // Formatta automaticamente il numero di telefono
                this.value = formatPhoneNumber(this.value);
            });
        }
        
        const zipCodeInput = document.getElementById('zipCode');
        if (zipCodeInput) {
            zipCodeInput.addEventListener('blur', function() {
                if (this.value && !isValidZipCode(this.value)) {
                    this.classList.add('is-invalid');
                }
            });
        }
    }
    
    // Configurazione del rilevamento automatico del tipo di carta
    function setupCreditCardDetection() {
        const cardNumberInput = document.getElementById('cardNumber');
        const cardTypeIcon = document.querySelector('.card-type-icon i');
        
        if (cardNumberInput && cardTypeIcon) {
            cardNumberInput.addEventListener('input', function() {
                // Formatta automaticamente il numero della carta
                this.value = formatCreditCardNumber(this.value);
                
                // Rileva il tipo di carta
                const cardType = detectCreditCardType(this.value);
                
                // Aggiorna l'icona
                cardTypeIcon.className = ''; // Rimuovi tutte le classi
                
                switch(cardType) {
                    case 'visa':
                        cardTypeIcon.className = 'fab fa-cc-visa';
                        break;
                    case 'mastercard':
                        cardTypeIcon.className = 'fab fa-cc-mastercard';
                        break;
                    case 'amex':
                        cardTypeIcon.className = 'fab fa-cc-amex';
                        break;
                    case 'discover':
                        cardTypeIcon.className = 'fab fa-cc-discover';
                        break;
                    default:
                        cardTypeIcon.className = 'fab fa-cc-visa';
                }
            });
        }
        
        // Formattazione automatica della data di scadenza
        const cardExpiryInput = document.getElementById('cardExpiry');
        if (cardExpiryInput) {
            cardExpiryInput.addEventListener('input', function() {
                this.value = formatExpiryDate(this.value);
            });
        }
        
        // Limitazione del CVV a soli numeri
        const cardCvvInput = document.getElementById('cardCvv');
        if (cardCvvInput) {
            cardCvvInput.addEventListener('input', function() {
                this.value = this.value.replace(/\D/g, '').substring(0, 4);
            });
        }
    }
    
    // Funzione per caricare gli articoli dal carrello nella pagina di checkout
    function loadCheckoutItems() {
        // Ottieni gli articoli dal carrello
        const cart = window.getCartItems ? window.getCartItems() : [];
        
        if (!checkoutItemsContainer) return;
        
        if (cart.length === 0) {
            checkoutItemsContainer.innerHTML = `
                <div class="text-center py-4">
                    <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                    <p>Il tuo carrello è vuoto</p>
                    <a href="offerte.html" class="btn btn-outline-primary mt-2">Scopri le nostre offerte</a>
                </div>
            `;
            updateOrderSummary(0);
            return;
        }
        
        let checkoutHTML = '';
        let subtotal = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            checkoutHTML += `
                <div class="checkout-item">
                    <img src="${item.img || 'img/placeholder.jpg'}" alt="${item.name}" class="checkout-item-img me-3">
                    <div class="flex-grow-1">
                        <h6 class="mb-1">${item.name}</h6>
                        <div class="d-flex justify-content-between">
                            <span class="text-muted small">Quantità: ${item.quantity}</span>
                            <span class="fw-bold">€${itemTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            `;
        });
        
        checkoutItemsContainer.innerHTML = checkoutHTML;
        updateOrderSummary(subtotal);
    }
    
    // Funzione per aggiornare il riepilogo dell'ordine
    function updateOrderSummary(subtotal, discountRate = 0) {
        const taxRate = 0.22; // 22% IVA
        
        // Calcola lo sconto se applicabile
        const discountAmount = subtotal * discountRate;
        const subtotalAfterDiscount = subtotal - discountAmount;
        
        // Calcola l'IVA e il totale
        const tax = subtotalAfterDiscount * taxRate;
        const total = subtotalAfterDiscount + tax;
        
        if (subtotalElement) {
            subtotalElement.textContent = '€' + subtotal.toFixed(2);
            subtotalElement.classList.add('highlight-change');
            setTimeout(() => {
                subtotalElement.classList.remove('highlight-change');
            }, 1000);
        }
        
        if (taxElement) {
            taxElement.textContent = '€' + tax.toFixed(2);
            taxElement.classList.add('highlight-change');
            setTimeout(() => {
                taxElement.classList.remove('highlight-change');
            }, 1000);
        }
        
        if (totalElement) {
            totalElement.textContent = '€' + total.toFixed(2);
            totalElement.classList.add('highlight-change');
            setTimeout(() => {
                totalElement.classList.remove('highlight-change');
            }, 1000);
        }
        
        // Mostra/nascondi la riga dello sconto
        if (discountRow && discountElement) {
            if (discountRate > 0) {
                discountRow.style.display = 'flex';
                discountElement.textContent = '-€' + discountAmount.toFixed(2);
                discountElement.classList.add('highlight-change');
                setTimeout(() => {
                    discountElement.classList.remove('highlight-change');
                }, 1000);
            } else {
                discountRow.style.display = 'none';
            }
        }
    }
    
    // Funzione per applicare uno sconto
    function applyDiscount(rate) {
        // Ottieni gli articoli dal carrello
        const cart = window.getCartItems ? window.getCartItems() : [];
        
        // Calcola il subtotale
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        
        // Aggiorna il riepilogo dell'ordine con lo sconto
        updateOrderSummary(subtotal, rate);
    }
    
    // Funzione per validare lo step 1
    function validateStep1() {
        const firstName = document.getElementById('firstName');
        const lastName = document.getElementById('lastName');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        
        let isValid = true;
        
        // Validazione nome
        if (!validateInput(firstName)) {
            isValid = false;
        }
        
        // Validazione cognome
        if (!validateInput(lastName)) {
            isValid = false;
        }
        
        // Validazione email
        if (!validateInput(email) || (email.value && !isValidEmail(email.value))) {
            showInputError(email, 'Inserisci un indirizzo email valido');
            isValid = false;
        }
        
        // Validazione telefono
        if (!validateInput(phone)) {
            isValid = false;
        }
        
        return isValid;
    }
    
    // Funzione per validare lo step 2
    function validateStep2() {
        const address = document.getElementById('address');
        const city = document.getElementById('city');
        const province = document.getElementById('province');
        const zipCode = document.getElementById('zipCode');
        const country = document.getElementById('country');
        
        let isValid = true;
        
        // Validazione indirizzo
        if (!validateInput(address)) {
            isValid = false;
        }
        
        // Validazione città
        if (!validateInput(city)) {
            isValid = false;
        }
        
        // Validazione provincia
        if (!validateInput(province)) {
            isValid = false;
        }
        
        // Validazione CAP
        if (!validateInput(zipCode) || (zipCode.value && !isValidZipCode(zipCode.value))) {
            showInputError(zipCode, 'Inserisci un CAP valido');
            isValid = false;
        }
        
        // Validazione paese
        if (!validateInput(country)) {
            isValid = false;
        }
        
        return isValid;
    }
    
    // Funzione per validare lo step 3
    function validateStep3() {
        const termsCheck = document.getElementById('termsCheck');
        
        let isValid = true;
        
        // Verifica se è selezionato un metodo di pagamento
        const selectedPaymentMethod = document.querySelector('.payment-method-card.selected');
        if (!selectedPaymentMethod) {
            showToast('Seleziona un metodo di pagamento', 'error');
            isValid = false;
        }
        
        // Se è selezionata la carta di credito, valida i campi della carta
        if (selectedPaymentMethod && selectedPaymentMethod.getAttribute('data-payment') === 'creditCard') {
            const cardNumber = document.getElementById('cardNumber');
            const cardName = document.getElementById('cardName');
            const cardExpiry = document.getElementById('cardExpiry');
            const cardCvv = document.getElementById('cardCvv');
            
            // Validazione numero carta
            if (!validateInput(cardNumber) || (cardNumber.value && !isValidCreditCard(cardNumber.value))) {
                showInputError(cardNumber, 'Numero carta non valido');
                isValid = false;
            }
            
            // Validazione nome sulla carta
            if (!validateInput(cardName)) {
                isValid = false;
            }
            
            // Validazione data di scadenza
            if (!validateInput(cardExpiry) || (cardExpiry.value && !isValidExpiry(cardExpiry.value))) {
                showInputError(cardExpiry, 'Data di scadenza non valida (MM/AA)');
                isValid = false;
            }
            
            // Validazione CVV
            if (!validateInput(cardCvv) || (cardCvv.value && !isValidCVV(cardCvv.value))) {
                showInputError(cardCvv, 'CVV non valido (3-4 cifre)');
                isValid = false;
            }
        }
        
        // Validazione termini e condizioni
        if (!termsCheck.checked) {
            termsCheck.classList.add('is-invalid');
            showToast('Devi accettare i Termini e Condizioni', 'error');
            isValid = false;
        } else {
            termsCheck.classList.remove('is-invalid');
        }
        
        return isValid;
    }
    
    // Funzione per validare un input generico
    function validateInput(inputElement) {
        if (!inputElement) return false;
        
        const isRequired = inputElement.hasAttribute('required');
        
        if (isRequired && !inputElement.value.trim()) {
            showInputError(inputElement);
            return false;
        } else {
            clearInputError(inputElement);
            return true;
        }
    }
    
    // Funzione per mostrare un errore di input
    function showInputError(inputElement, customMessage) {
        inputElement.classList.add('is-invalid');
        
        // Se esiste un messaggio di errore personalizzato, aggiornalo
        const feedbackElement = inputElement.nextElementSibling;
        if (feedbackElement && feedbackElement.classList.contains('invalid-feedback') && customMessage) {
            feedbackElement.textContent = customMessage;
        }
        
        // Focus sull'elemento con errore
        inputElement.focus();
    }
    
    // Funzione per rimuovere un errore di input
    function clearInputError(inputElement) {
        inputElement.classList.remove('is-invalid');
    }
    
    // Funzione per verificare se un'email è valida
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Funzione per verificare se un CAP è valido
    function isValidZipCode(zipCode) {
        // Per l'Italia, il CAP è composto da 5 cifre
        const zipRegex = /^\d{5}$/;
        return zipRegex.test(zipCode);
    }
    
    // Funzione per verificare se un numero di carta di credito è valido
    function isValidCreditCard(cardNumber) {
        // Rimuovi spazi e trattini
        const cleanedNumber = cardNumber.replace(/[\s-]/g, '');
        
        // Verifica che contenga solo cifre e abbia una lunghezza valida
        if (!/^\d+$/.test(cleanedNumber) || cleanedNumber.length < 13 || cleanedNumber.length > 19) {
            return false;
        }
        
        // Algoritmo di Luhn (checksum)
        let sum = 0;
        let doubleUp = false;
        
        for (let i = cleanedNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cleanedNumber.charAt(i));
            
            if (doubleUp) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            
            sum += digit;
            doubleUp = !doubleUp;
        }
        
        return sum % 10 === 0;
    }
    
    // Funzione per verificare se una data di scadenza è valida
    function isValidExpiry(expiry) {
        // Formato MM/AA o MM/AAAA
        const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2}|[0-9]{4})$/;
        
        if (!expiryRegex.test(expiry)) {
            return false;
        }
        
        const parts = expiry.split('/');
        const month = parseInt(parts[0]);
        let year = parseInt(parts[1]);
        
        // Se l'anno è a 2 cifre, aggiungi 2000
        if (year < 100) {
            year += 2000;
        }
        
        // Crea una data con l'ultimo giorno del mese di scadenza
        const now = new Date();
        const expiryDate = new Date(year, month, 0); // L'ultimo giorno del mese
        
        // La carta è valida se la data di scadenza è nel futuro
        return expiryDate > now;
    }
    
    // Funzione per verificare se un CVV è valido
    function isValidCVV(cvv) {
        // Il CVV è composto da 3 o 4 cifre
        const cvvRegex = /^\d{3,4}$/;
        return cvvRegex.test(cvv);
    }
    
    // Funzione per formattare un numero di telefono
    function formatPhoneNumber(phone) {
        // Rimuovi tutti i caratteri non numerici
        const cleaned = phone.replace(/\D/g, '');
        
        // Formatta il numero in base alla lunghezza
        if (cleaned.length <= 3) {
            return cleaned;
        } else if (cleaned.length <= 6) {
            return cleaned.slice(0, 3) + ' ' + cleaned.slice(3);
        } else if (cleaned.length <= 9) {
            return cleaned.slice(0, 3) + ' ' + cleaned.slice(3, 6) + ' ' + cleaned.slice(6);
        } else {
            return cleaned.slice(0, 3) + ' ' + cleaned.slice(3, 6) + ' ' + cleaned.slice(6, 9) + ' ' + cleaned.slice(9);
        }
    }
    
    // Funzione per formattare un numero di carta di credito
    function formatCreditCardNumber(cardNumber) {
        // Rimuovi tutti i caratteri non numerici
        const cleaned = cardNumber.replace(/\D/g, '');
        
        // Limita a 19 cifre (lunghezza massima di una carta di credito)
        const limited = cleaned.substring(0, 19);
        
        // Formatta con spazi ogni 4 cifre
        const formatted = limited.replace(/(\d{4})(?=\d)/g, '$1 ');
        
        return formatted;
    }
    
    // Funzione per formattare una data di scadenza
    function formatExpiryDate(expiry) {
        // Rimuovi tutti i caratteri non numerici
        const cleaned = expiry.replace(/\D/g, '');
        
        // Limita a 4 cifre (MM/AA)
        const limited = cleaned.substring(0, 4);
        
        // Formatta come MM/AA
        if (limited.length > 2) {
            return limited.substring(0, 2) + '/' + limited.substring(2);
        } else {
            return limited;
        }
    }
    
    // Funzione per rilevare il tipo di carta di credito
    function detectCreditCardType(cardNumber) {
        // Rimuovi spazi e trattini
        const cleaned = cardNumber.replace(/[\s-]/g, '');
        
        // Visa: inizia con 4
        if (/^4/.test(cleaned)) {
            return 'visa';
        }
        
        // Mastercard: inizia con 51-55 o 2221-2720
        if (/^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[0-1]|2720)/.test(cleaned)) {
            return 'mastercard';
        }
        
        // American Express: inizia con 34 o 37
        if (/^3[47]/.test(cleaned)) {
            return 'amex';
        }
        
        // Discover: inizia con 6011, 622126-622925, 644-649 o 65
        if (/^(6011|622(12[6-9]|1[3-9]|[2-8]|9[0-1][0-9]|92[0-5])|64[4-9]|65)/.test(cleaned)) {
            return 'discover';
        }
        
        // Default
        return 'unknown';
    }
    
    // Funzione per mostrare un toast
    function showToast(message, type = 'info') {
        if (window.showToast) {
            window.showToast(message, type);
        } else {
            // Implementazione di fallback
            alert(message);
        }
    }
});
