document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    const signupBtn = document.getElementById('signupBtn');
    const loginBtnAlt = document.getElementById('loginBtnAlt');
    
    // If already logged in, redirect
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
    
    // Form submission - HYBRID
    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
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
        if (!username) errors.push('Username is required');
        if (!password) errors.push('Password is required');
        if (!confirmPassword) errors.push('Please confirm password');
        if (!terms) errors.push('You must agree to the Terms of Service');
        
        if (email && !email.includes('@')) errors.push('Please enter a valid email');
        if (password && password.length < 6) errors.push('Password must be at least 6 characters');
        if (password && confirmPassword && password !== confirmPassword) errors.push('Passwords do not match');
        
        if (errors.length > 0) {
            alert('Please fix the following:\n\n' + errors.join('\n'));
            return;
        }
        
        // Show loading
        signupBtn.disabled = true;
        signupBtn.innerHTML = '<span class="btn-text">Creating Account...</span>';
        
        // Ask user which method to use
        const useNetlify = window.netlifyIdentity && 
                          confirm('Create account with Netlify Identity?\n\nOK = Secure account (Netlify)\nCancel = Demo account (Local)');
        
        if (useNetlify && window.netlifyIdentity) {
            // Use Netlify Identity API
            try {
                console.log('Creating Netlify Identity account...');
                
                const response = await fetch('/.netlify/identity/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password,
                        user_metadata: {
                            full_name: fullName,
                            username: username,
                            newsletter: newsletter
                        }
                    })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    console.log('Netlify signup successful:', data);
                    
                    // Auto-login after signup
                    const loginResponse = await fetch('/.netlify/identity/token', {
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
                    
                    if (loginResponse.ok) {
                        const tokenData = await loginResponse.json();
                        localStorage.setItem('nf_token', tokenData.access_token);
                        localStorage.setItem('user', JSON.stringify({
                            email: email,
                            name: fullName,
                            username: username,
                            source: 'netlify',
                            joined: new Date().toISOString()
                        }));
                        
                        signupBtn.innerHTML = '<span class="btn-text">Account Created!</span>';
                        
                        setTimeout(() => {
                            alert(`Welcome to GameHub, ${fullName}! Your secure account is ready.`);
                            window.location.href = 'index.html';
                        }, 1500);
                        return;
                    }
                } else {
                    const error = await response.json();
                    throw new Error(error.message || 'Netlify signup failed');
                }
            } catch (error) {
                console.log('Netlify signup failed, using local:', error);
                // Fall through to local signup
            }
        }
        
        // Local signup (fallback or user choice)
        console.log('Creating local account...');
        
        const userData = {
            id: Date.now(),
            fullName: fullName,
            email: email,
            username: username,
            source: 'local',
            newsletter: newsletter,
            joined: new Date().toISOString()
        };
        
        // Store locally
        localStorage.setItem('user', JSON.stringify(userData));
        
        signupBtn.innerHTML = '<span class="btn-text">Account Created!</span>';
        
        setTimeout(() => {
            alert(`Welcome to GameHub, ${fullName}! Your demo account is ready.`);
            window.location.href = 'index.html';
        }, 1500);
    });
    
    // Password strength indicator
    const passwordInput = document.getElementById('password');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    
    if (passwordInput && strengthBar && strengthText) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            let strength = 0;
            
            if (password.length >= 8) strength += 1;
            if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1;
            if (/\d/.test(password)) strength += 1;
            if (/[^a-zA-Z\d]/.test(password)) strength += 1;
            
            const width = strength * 25;
            strengthBar.style.width = width + '%';
            
            if (strength === 0) {
                strengthBar.style.backgroundColor = '#ff4757';
                strengthText.textContent = 'Password strength: very weak';
            } else if (strength === 1) {
                strengthBar.style.backgroundColor = '#ff6b6b';
                strengthText.textContent = 'Password strength: weak';
            } else if (strength === 2) {
                strengthBar.style.backgroundColor = '#ffa726';
                strengthText.textContent = 'Password strength: fair';
            } else if (strength === 3) {
                strengthBar.style.backgroundColor = '#4CAF50';
                strengthText.textContent = 'Password strength: good';
            } else if (strength === 4) {
                strengthBar.style.backgroundColor = '#2ecc71';
                strengthText.textContent = 'Password strength: strong!';
            }
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
    
    // Auto-fill demo data for testing
    setTimeout(() => {
        if (!document.getElementById('fullName').value) {
            document.getElementById('fullName').value = 'Demo Player';
            document.getElementById('email').value = 'demo@gamehub.com';
            document.getElementById('username').value = 'demo_player';
            document.getElementById('password').value = 'Password123!';
            document.getElementById('confirmPassword').value = 'Password123!';
            document.getElementById('terms').checked = true;
        }
    }, 500);
});