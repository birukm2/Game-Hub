document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const showPasswordToggle = document.getElementById('showPassword');
    const passwordInput = document.getElementById('password');
    
    // Check if already logged in
    if (localStorage.getItem('user') || localStorage.getItem('nf_token')) {
        // Redirect to home if already logged in
        window.location.href = 'index.html';
        return;
    }
    
    // Show/hide password
    if (showPasswordToggle && passwordInput) {
        showPasswordToggle.addEventListener('change', function() {
            passwordInput.type = this.checked ? 'text' : 'password';
        });
    }
    
    // Form submission - HYBRID APPROACH
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const rememberMe = document.getElementById('remember').checked;
        
        
        if (!username || !password) {
            alert('Please fill in all fields');
            return;
        }
        
        // Show loading
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<span class="btn-text">Logging in...</span>';
        
        // Convert username to email if needed
        const email = username.includes('@') ? username : `${username}@gamehub.com`;
        
        // Try Netlify Identity API first
        if (window.netlifyIdentity) {
            try {
                console.log('Attempting Netlify Identity login...');
                
                // Method 1: Direct API call
                const response = await fetch('/.netlify/identity/token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        grant_type: 'password',
                        username: email,
                        password: password
                    })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    console.log('Netlify login successful');
                    
                    // Store token
                    localStorage.setItem('nf_token', data.access_token);
                    
                    // Get user info
                    const userResponse = await fetch('/.netlify/identity/user', {
                        headers: {
                            'Authorization': `Bearer ${data.access_token}`
                        }
                    });
                    
                    if (userResponse.ok) {
                        const userData = await userResponse.json();
                        localStorage.setItem('user', JSON.stringify({
                            email: userData.email,
                            name: userData.user_metadata?.full_name || userData.email.split('@')[0],
                            source: 'netlify'
                        }));
                    }
                    
                    // Redirect
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1000);
                    return;
                }
            } catch (error) {
                console.log('Netlify login failed, using local auth:', error);
            }
        }
        
        // Fallback: Local authentication
        console.log('Using local authentication');
        
        // Demo validation (accepts any credentials)
        const userData = {
            id: Date.now(),
            email: email,
            name: username.includes('@') ? username.split('@')[0] : username,
            username: username,
            source: 'local',
            joined: new Date().toISOString()
        };
        
        // Store user
        localStorage.setItem('user', JSON.stringify(userData));
        
        if (rememberMe) {
            localStorage.setItem('remember_login', 'true');
        }
        
        // Update button
        loginBtn.innerHTML = '<span class="btn-text">Login Successful!</span>';
        
        // Show success message
        setTimeout(() => {
            alert(`Welcome back, ${userData.name}!`);
            window.location.href = 'index.html';
        }, 1000);
    });
    
    // Signup button - Offer both options
    if (signupBtn) {
        signupBtn.addEventListener('click', function() {
            const useNetlify = confirm('Use Netlify Identity for secure signup?\n\nOK = Netlify (secure)\nCancel = Local signup (demo)');
            
            if (useNetlify && window.netlifyIdentity) {
                // Open Netlify Identity signup modal
                window.netlifyIdentity.open('signup');
            } else {
                // Go to local signup page
                window.location.href = 'signup.html';
            }
        });
    }
    
    // Auto-fill demo credentials for testing
    setTimeout(() => {
        if (!document.getElementById('username').value) {
            document.getElementById('username').value = 'player1';
            document.getElementById('password').value = 'password123';
        }
    }, 500);
    
    // Auto-focus username field
    document.getElementById('username').focus();
});