/**
 * FoodSaver Main JavaScript
 * Global functionality and utilities
 */

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

/**
 * Initialize the application
 */
function initializeApp() {
    // Add fade-in animation to main content
    addFadeInAnimation();
    
    // Initialize tooltips if Bootstrap is available
    initializeTooltips();
    
    // Add smooth scrolling to anchor links
    addSmoothScrolling();
    
    // Initialize form validation
    initializeFormValidation();
    
    // Add loading states to buttons
    initializeLoadingStates();
    
    console.log('FoodSaver app initialized successfully');
}

/**
 * Add fade-in animation to main content
 */
function addFadeInAnimation() {
    const mainContent = document.querySelector('main');
    if (mainContent) {
        mainContent.classList.add('fade-in');
    }
}

/**
 * Initialize Bootstrap tooltips if available
 */
function initializeTooltips() {
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function(tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
}

/**
 * Add smooth scrolling to anchor links
 */
function addSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Initialize form validation
 */
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!form.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
                
                // Add visual feedback for invalid fields
                const invalidFields = form.querySelectorAll(':invalid');
                invalidFields.forEach(field => {
                    field.classList.add('is-invalid');
                    
                    // Remove invalid class when field is corrected
                    field.addEventListener('input', function() {
                        if (this.checkValidity()) {
                            this.classList.remove('is-invalid');
                        }
                    });
                });
            }
            
            form.classList.add('was-validated');
        });
    });
}

/**
 * Initialize loading states for buttons
 */
function initializeLoadingStates() {
    const buttons = document.querySelectorAll('button[type="submit"]');
    buttons.forEach(button => {
        const originalText = button.innerHTML;
        
        button.addEventListener('click', function() {
            // Don't add loading state if form is invalid
            const form = this.closest('form');
            if (form && !form.checkValidity()) {
                return;
            }
            
            // Add loading state
            this.disabled = true;
            this.innerHTML = `
                <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Loading...
            `;
            
            // Reset button after 5 seconds (fallback)
            setTimeout(() => {
                this.disabled = false;
                this.innerHTML = originalText;
            }, 5000);
        });
    });
}

/**
 * Utility function to show toast notifications
 */
function showToast(message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toastId = 'toast-' + Date.now();
    const toastHTML = `
        <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
                <i class="bi bi-${getToastIcon(type)} me-2 text-${type}"></i>
                <strong class="me-auto">FoodSaver</strong>
                <small>Just now</small>
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
    if (typeof bootstrap !== 'undefined' && bootstrap.Toast) {
        const toast = new bootstrap.Toast(toastElement, {
            autohide: true,
            delay: 5000
        });
        toast.show();
        
        // Remove toast element after it's hidden
        toastElement.addEventListener('hidden.bs.toast', function() {
            this.remove();
        });
    } else {
        // Fallback for when Bootstrap is not available
        setTimeout(() => {
            toastElement.remove();
        }, 5000);
    }
}

/**
 * Get appropriate icon for toast type
 */
function getToastIcon(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'x-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || icons['info'];
}

/**
 * Utility function to format numbers
 */
function formatNumber(num) {
    if (num >= 1e9) {
        return (num / 1e9).toFixed(1) + 'B';
    } else if (num >= 1e6) {
        return (num / 1e6).toFixed(1) + 'M';
    } else if (num >= 1e3) {
        return (num / 1e3).toFixed(1) + 'K';
    }
    return num.toString();
}

/**
 * Utility function to debounce function calls
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Utility function to check if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Add intersection observer for scroll animations
 */
function addScrollAnimations() {
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Observe all cards and sections
        const animatedElements = document.querySelectorAll('.card, section');
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }
}

/**
 * Handle network errors gracefully
 */
function handleNetworkError(error) {
    console.error('Network error:', error);
    
    if (!navigator.onLine) {
        showToast('You appear to be offline. Please check your connection.', 'warning');
    } else {
        showToast('Network error occurred. Please try again.', 'error');
    }
}

/**
 * Local storage utilities
 */
const Storage = {
    set: function(key, value) {
        try {
            localStorage.setItem('foodsaver_' + key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.warn('Could not save to localStorage:', e);
            return false;
        }
    },
    
    get: function(key, defaultValue = null) {
        try {
            const item = localStorage.getItem('foodsaver_' + key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.warn('Could not read from localStorage:', e);
            return defaultValue;
        }
    },
    
    remove: function(key) {
        try {
            localStorage.removeItem('foodsaver_' + key);
            return true;
        } catch (e) {
            console.warn('Could not remove from localStorage:', e);
            return false;
        }
    }
};

/**
 * Initialize scroll animations when page loads
 */
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(addScrollAnimations, 100);
});

/**
 * Handle online/offline status
 */
window.addEventListener('online', function() {
    showToast('Connection restored!', 'success');
});

window.addEventListener('offline', function() {
    showToast('You are now offline. Some features may not work.', 'warning');
});

/**
 * Global error handler
 */
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    // Only show user-friendly errors in production
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('Development mode - showing detailed error');
    }
});

/**
 * Export utilities for use in other scripts
 */
window.FoodSaver = {
    showToast,
    formatNumber,
    debounce,
    isInViewport,
    handleNetworkError,
    Storage
};