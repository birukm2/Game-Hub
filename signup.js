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
    
    // Form submission
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const terms = document.getElementById('terms').checked;
        
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