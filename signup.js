// signup.js - Simple working version
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    const signupBtn = document.getElementById('signupBtn');
    const loginBtnAlt = document.getElementById('loginBtnAlt');
    
    // If already logged in, redirect to home
    if (localStorage.getItem('user')) {
        window.location.href = 'index.html';
        return;
    }
    
    // Login alternative button
    if (loginBtnAlt) {
        loginBtnAlt.addEventListener('click', function() {
            window.location.href = 'login.html';
        });
    }
    
    // // Auto-fill demo data for easy testing
    // setTimeout(() => {
    //     document.getElementById('fullName').value = 'Demo Player';
    //     document.getElementById('email').value = 'demo@gamehub.com';
    //     document.getElementById('username').value = 'demo_player';
    //     document.getElementById('password').value = 'Demo123!';
    //     document.getElementById('confirmPassword').value = 'Demo123!';
    //     document.getElementById('terms').checked = true;
        
    //     // Trigger password strength update
    //     document.getElementById('password').dispatchEvent(new Event('input'));
    //     document.getElementById('confirmPassword').dispatchEvent(new Event('input'));
    // }, 100);
    
    // Password strength indicator
    const passwordInput = document.getElementById('password');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    
    if (passwordInput && strengthBar && strengthText) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            let strength = 0;
            
            // Length check
            if (password.length >= 8) strength += 1;
            // Mixed case check
            if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1;
            // Number check
            if (/\d/.test(password)) strength += 1;
            // Special char check
            if (/[^a-zA-Z\d]/.test(password)) strength += 1;
            
            const width = strength * 25;
            strengthBar.style.width = width + '%';
            
            // Update strength text and color
            const messages = [
                'Password strength: very weak',
                'Password strength: weak',
                'Password strength: fair',
                'Password strength: good',
                'Password strength: strong!'
            ];
            
            const colors = ['#ff4757', '#ff6b6b', '#ffa726', '#4CAF50', '#2ecc71'];
            
            strengthText.textContent = messages[strength];
            strengthBar.style.backgroundColor = colors[strength];
        });
    }
    
    // Password match checker
    const confirmInput = document.getElementById('confirmPassword');
    const matchText = document.querySelector('.password-match');
    
    if (confirmInput && matchText) {
        confirmInput.addEventListener('input', function() {
            const password = passwordInput.value;
            const confirm = this.value;
            
            if (!confirm) {
                matchText.textContent = '';
                matchText.className = 'password-match';
            } else if (password === confirm) {
                matchText.textContent = '✓ Passwords match';
                matchText.className = 'password-match match';
            } else {
                matchText.textContent = '✗ Passwords do not match';
                matchText.className = 'password-match no-match';
            }
        });
    }
    
    // Terms links
    const termsLinks = document.querySelectorAll('.terms-link');
    termsLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Terms of Service and Privacy Policy page would open here.');
        });
    });
    
    // Social buttons
    const socialBtns = document.querySelectorAll('.social-btn');
    socialBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const platform = this.querySelector('span:last-child').textContent;
            alert(`${platform} integration would be implemented here.`);
        });
    });
    
    // Form submission
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const terms = document.getElementById('terms').checked;
        const newsletter = document.getElementById('newsletter').checked;
        
        // Validation
        let errors = [];
        
        if (!fullName) errors.push('Full name is required');
        if (!email) errors.push('Email is required');
        if (!email.includes('@')) errors.push('Please enter a valid email');
        if (!username) errors.push('Username is required');
        if (username.length < 3) errors.push('Username must be at least 3 characters');
        if (!password) errors.push('Password is required');
        if (password.length < 6) errors.push('Password must be at least 6 characters');
        if (password !== confirmPassword) errors.push('Passwords do not match');
        if (!terms) errors.push('You must agree to the Terms of Service');
        
        // Show errors if any
        if (errors.length > 0) {
            alert('Please fix the following:\n\n• ' + errors.join('\n• '));
            return;
        }
        
        // Disable button and show loading
        signupBtn.disabled = true;
        signupBtn.innerHTML = '<span class="btn-text">Creating Account...</span>';
        
        // Create user data
        const userData = {
            id: Date.now(),
            fullName: fullName,
            email: email,
            username: username,
            name: fullName,
            source: 'local',
            newsletter: newsletter,
            joined: new Date().toISOString()
        };
        
        // Store in localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Show success message
        setTimeout(() => {
            signupBtn.innerHTML = '<span class="btn-text">Account Created!</span>';
            
            setTimeout(() => {
                alert(`Welcome to GameHub, ${fullName}! Your account is ready.`);
                window.location.href = 'index.html';
            }, 1000);
        }, 1500);
    });
    
    // Auto-focus first field
    document.getElementById('fullName').focus();
});