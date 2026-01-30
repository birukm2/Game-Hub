// login.js - SIMPLE WORKING VERSION
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const showPasswordToggle = document.getElementById('showPassword');
    const passwordInput = document.getElementById('password');
    
    // Check if already logged in
    if (localStorage.getItem('user')) {
        window.location.href = 'index.html';
        return;
    }
    
    // // Auto-fill demo credentials for easy testing
    // setTimeout(() => {
    //     document.getElementById('username').value = 'demo';
    //     document.getElementById('password').value = 'demo123';
    // }, 100);
    
    // Show/hide password
    if (showPasswordToggle && passwordInput) {
        showPasswordToggle.addEventListener('change', function() {
            passwordInput.type = this.checked ? 'text' : 'password';
        });
    }
    
    // Login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const rememberMe = document.getElementById('remember').checked;
        
        // Basic validation
        if (!username || !password) {
            alert('Please enter both username and password');
            return;
        }
        
        // Show loading
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<span class="btn-text">Logging in...</span>';
        
        // // Create user data (accepts any credentials for demo)
        // const userData = {
        //     id: Date.now(),
        //     username: username,
        //     name: username,
        //     email: username.includes('@') ? username : username + '@gamehub.com',
        //     source: 'local',
        //     joined: new Date().toISOString()
        // };
        
        // Store user in localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        
        if (rememberMe) {
            localStorage.setItem('remember_login', 'true');
        }
        
        // Show success and redirect
        setTimeout(() => {
            loginBtn.innerHTML = '<span class="btn-text">Login Successful!</span>';
            
            setTimeout(() => {
                alert(`Welcome back, ${username}!`);
                window.location.href = 'index.html';
            }, 500);
        }, 1000);
    });
    
    // Signup button - go to signup page
    if (signupBtn) {
        signupBtn.addEventListener('click', function() {
            window.location.href = 'signup.html';
        });
    }
    
    // Auto-focus username field
    document.getElementById('username').focus();
    
    // Simple forgot password
    const forgotPassword = document.querySelector('.forgot-password');
    if (forgotPassword) {
        forgotPassword.addEventListener('click', function(e) {
            e.preventDefault();
            alert('For demo purposes, just use:\nUsername: demo\nPassword: demo123');
        });
    }
});