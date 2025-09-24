// Office Pantry Management System - Login Script

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const loginForm = document.getElementById('loginForm');
    const passwordToggle = document.getElementById('passwordToggle');
    const passwordInput = document.getElementById('password');
    const forgotPasswordLink = document.getElementById('forgotPassword');
    const forgotPasswordModal = document.getElementById('forgotPasswordModal');
    const closeModal = document.getElementById('closeModal');
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    const roleSelect = document.getElementById('role');

    // Password toggle functionality
    passwordToggle.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        const icon = passwordToggle.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });

    // Role selection enhancement
    roleSelect.addEventListener('change', function() {
        const selectedRole = this.value;
        const loginBtn = document.querySelector('.login-btn');
        
        // Update button text based on role
        if (selectedRole) {
            const roleText = selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1);
            loginBtn.innerHTML = `<i class="fas fa-sign-in-alt"></i>Sign In as ${roleText}`;
        } else {
            loginBtn.innerHTML = `<i class="fas fa-sign-in-alt"></i>Sign In`;
        }
    });

    // Form validation
    function validateForm() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;
        
        let isValid = true;
        let errorMessage = '';

        // Email validation
        if (!email) {
            errorMessage += 'Email is required.\n';
            isValid = false;
        } else if (!isValidEmail(email)) {
            errorMessage += 'Please enter a valid email address.\n';
            isValid = false;
        }

        // Password validation
        if (!password) {
            errorMessage += 'Password is required.\n';
            isValid = false;
        } else if (password.length < 6) {
            errorMessage += 'Password must be at least 6 characters long.\n';
            isValid = false;
        }

        // Role validation
        if (!role) {
            errorMessage += 'Please select a role.\n';
            isValid = false;
        }

        if (!isValid) {
            showNotification(errorMessage, 'error');
        }

        return isValid;
    }

    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        // Show loading state
        showLoadingState(true);

        // Simulate login process
        setTimeout(() => {
            const email = document.getElementById('email').value;
            const role = document.getElementById('role').value;
            
            // Simulate successful login
            showNotification(`Welcome! Logging in as ${role}...`, 'success');
            
            // Redirect based on role (simulation)
            setTimeout(() => {
                redirectToDashboard(role);
            }, 1500);
            
            showLoadingState(false);
        }, 2000);
    });

    // Forgot password modal functionality
    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        forgotPasswordModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });

    closeModal.addEventListener('click', function() {
        forgotPasswordModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === forgotPasswordModal) {
            forgotPasswordModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Reset password form submission
    resetPasswordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const resetEmail = document.getElementById('resetEmail').value;
        
        if (!resetEmail) {
            showNotification('Please enter your email address.', 'error');
            return;
        }
        
        if (!isValidEmail(resetEmail)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }

        // Simulate password reset
        showNotification('Password reset link sent to your email!', 'success');
        
        setTimeout(() => {
            forgotPasswordModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            resetPasswordForm.reset();
        }, 2000);
    });

    // Show loading state
    function showLoadingState(show) {
        const loginCard = document.querySelector('.login-card');
        const loginBtn = document.querySelector('.login-btn');
        
        if (show) {
            loginCard.classList.add('loading');
            loginBtn.disabled = true;
        } else {
            loginCard.classList.remove('loading');
            loginBtn.disabled = false;
        }
    }

    // Show notification
    function showNotification(message, type) {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 400px;
        `;

        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
        `;
        document.head.appendChild(style);

        // Add to page
        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideInRight 0.3s ease reverse';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        }, 5000);
    }

    // Redirect to dashboard (simulation)
    function redirectToDashboard(role) {
        // In a real application, this would redirect to the appropriate dashboard
        const dashboards = {
            'admin': 'admin-dashboard.html',
            'manager': 'manager-dashboard.html',
            'employee': 'employee-dashboard.html',
            'guest': 'guest-dashboard.html'
        };
        
        showNotification(`Redirecting to ${role} dashboard...`, 'success');
        
        // For demo purposes, we'll just show a message
        setTimeout(() => {
            alert(`Welcome! You would be redirected to the ${role} dashboard.\n\nIn a real application, this would navigate to: ${dashboards[role] || 'dashboard.html'}`);
        }, 1000);
    }

    // Add input focus effects
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });

    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Close modal with Escape key
        if (e.key === 'Escape' && forgotPasswordModal.style.display === 'block') {
            forgotPasswordModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        
        // Submit form with Enter key
        if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
            const form = e.target.closest('form');
            if (form && form.id === 'loginForm') {
                form.dispatchEvent(new Event('submit'));
            }
        }
    });

    // Add form field animations
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach((group, index) => {
        group.style.opacity = '0';
        group.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            group.style.transition = 'all 0.5s ease';
            group.style.opacity = '1';
            group.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // Add logo animation
    const logo = document.querySelector('.logo');
    setTimeout(() => {
        logo.style.animation = 'pulse 2s ease-in-out infinite';
    }, 500);

    // Add pulse animation
    const pulseStyle = document.createElement('style');
    pulseStyle.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(pulseStyle);

    console.log('Office Pantry Management System - Login page loaded successfully!');
});

