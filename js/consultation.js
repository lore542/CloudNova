/**
 * Consultation functionality
 * Manages the consultation booking process
 */
document.addEventListener('DOMContentLoaded', function() {
    // Get consultation option buttons
    const consultationSelectButtons = document.querySelectorAll('.consultation-select');
    const bookingSection = document.getElementById('booking-section');
    const consultationTypeTitle = document.getElementById('consultation-type-title');
    const consultationOptions = document.querySelectorAll('.consultation-option');
    const consultationForm = document.getElementById('consultationForm');
    const confirmationSection = document.getElementById('confirmation-section');
    
    // Add event listeners to consultation option buttons
    if (consultationSelectButtons.length > 0) {
        consultationSelectButtons.forEach(button => {
            button.addEventListener('click', function() {
                const consultationType = this.getAttribute('data-type');
                
                // Update consultation type title
                if (consultationTypeTitle) {
                    consultationTypeTitle.textContent = consultationType === 'live' ? 'dal Vivo' : 'Online';
                }
                
                // Remove selected class from all options
                consultationOptions.forEach(option => {
                    option.classList.remove('selected');
                });
                
                // Add selected class to current option
                const selectedOption = document.getElementById(`option-${consultationType}`);
                if (selectedOption) {
                    selectedOption.classList.add('selected');
                }
                
                // Show booking section
                if (bookingSection) {
                    bookingSection.classList.remove('d-none');
                    
                    // Smooth scroll to booking section
                    bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }
    
    // Form validation and submission
    if (consultationForm) {
        consultationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Check form validity
            if (!this.checkValidity()) {
                e.stopPropagation();
                this.classList.add('was-validated');
                return;
            }
            
            // Hide booking section and show confirmation
            bookingSection.classList.add('d-none');
            if (confirmationSection) {
                confirmationSection.classList.remove('d-none');
                confirmationSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            
            // Reset form
            this.reset();
            this.classList.remove('was-validated');
            
            // In a real application, you would send the form data to the server here
        });
    }
});
