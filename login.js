document.addEventListener('DOMContentLoaded', function() {
    // Form submission
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const showPasswordToggle = document.getElementById('showPassword');
    const passwordInput = document.getElementById('password');
    
    // Show/hide password
    showPasswordToggle.addEventListener('change', function() {
        passwordInput.type = this.checked ? 'text' : 'password';
    });
    
    // Form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const rememberMe = document.getElementById('remember').checked;
        
        // Simple validation
        if (!username || !password) {
            alert('Please fill in all fields');
            return;
        }
        
        // Show loading state
        loginBtn.innerHTML = '<span class="btn-text">Logging in...</span>';
        loginBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Demo authentication (replace with real authentication)
            if ((username === 'player1' && password === 'password123') || 
                (username === 'demo' && password === 'demo123')) {
                
                // Store login state
                localStorage.setItem('userLoggedIn', 'true');
                localStorage.setItem('username', username);
                
                if (rememberMe) {
                    localStorage.setItem('rememberMe', 'true');
                }
                
                // Check for redirect URL from popup
                const redirectUrl = localStorage.getItem('redirectAfterLogin') || 'index.html';
                
                // Clear redirect storage
                localStorage.removeItem('redirectAfterLogin');
                
                // Redirect
                window.location.href = redirectUrl;
            } else {
                // Reset button
                loginBtn.innerHTML = '<span class="btn-text">Login</span><span class="btn-icon">→</span>';
                loginBtn.disabled = false;
                
                // Show error
                alert('Invalid username or password. Try: player1 / password123');
            }
        }, 1000);
    });
    
    // Signup button
    signupBtn.addEventListener('click', function() {
        window.location.href = 'signup.html';
    });
    
    // Auto-focus username field
    document.getElementById('username').focus();
    
    // Check if there's a game to play after login
    const gameToPlay = localStorage.getItem('gameToPlayAfterLogin');
    if (gameToPlay) {
        console.log(`After login, user wants to play: ${gameToPlay}`);
        // You can display this message if you want
        // document.querySelector('.login-subtitle').textContent += ` Play ${gameToPlay} after login!`;
    }
});