document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const signupForm = document.getElementById('signupForm');
    const signupBtn = document.getElementById('signupBtn');
    const loginBtnAlt = document.getElementById('loginBtnAlt');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const usernameInput = document.getElementById('username');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    const passwordMatch = document.querySelector('.password-match');
    const usernameAvailability = document.querySelector('.username-availability');
    
    // Taken usernames (demo only)
    const takenUsernames = ['player1', 'gamer', 'admin', 'test', 'demo'];
    
    // Check password strength
    function checkPasswordStrength(password) {
        let strength = 0;
        
        // Check criteria
        if (password.length >= 8) strength += 1;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1;
        if (/\d/.test(password)) strength += 1;
        if (/[^a-zA-Z\d]/.test(password)) strength += 1;
        
        // Update UI
        const width = strength * 25;
        strengthBar.style.width = width + '%';
        
        // Update based on strength
        if (strength === 0) {
            strengthBar.style.backgroundColor = '#ff4757';
            strengthText.textContent = "Password strength: very weak";
        } else if (strength === 1) {
            strengthBar.style.backgroundColor = '#ff6b6b';
            strengthText.textContent = "Password strength: weak";
        } else if (strength === 2) {
            strengthBar.style.backgroundColor = '#ffa726';
            strengthText.textContent = "Password strength: fair";
        } else if (strength === 3) {
            strengthBar.style.backgroundColor = '#4CAF50';
            strengthText.textContent = "Password strength: good";
        } else if (strength === 4) {
            strengthBar.style.backgroundColor = '#2ecc71';
            strengthText.textContent = "Password strength: strong!";
        }
        
        return strength;
    }
    
    // Check password match
    function checkPasswordMatch() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        if (!confirmPassword) {
            passwordMatch.textContent = '';
            passwordMatch.className = 'password-match';
            return false;
        }
        
        if (password === confirmPassword) {
            passwordMatch.textContent = '✓ Passwords match';
            passwordMatch.className = 'password-match match';
            return true;
        } else {
            passwordMatch.textContent = '✗ Passwords do not match';
            passwordMatch.className = 'password-match no-match';
            return false;
        }
    }
    
    // Check username
    function checkUsername() {
        const username = usernameInput.value.trim();
        
        if (!username) {
            usernameAvailability.textContent = '';
            return;
        }
        
        if (username.length < 3) {
            usernameAvailability.textContent = 'Username must be at least 3 characters';
            usernameAvailability.className = 'username-availability taken';
            return;
        }
        
        // Simulate availability check
        setTimeout(() => {
            if (takenUsernames.includes(username.toLowerCase())) {
                usernameAvailability.textContent = '✗ Username is taken';
                usernameAvailability.className = 'username-availability taken';
            } else {
                usernameAvailability.textContent = '✓ Username is available';
                usernameAvailability.className = 'username-availability available';
            }
        }, 300);
    }
    
    // Validate age (13+)
    function validateAge(birthdate) {
        const birthDate = new Date(birthdate);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age >= 13;
    }
    
    // Validate email
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Event Listeners for real-time validation
    passwordInput.addEventListener('input', function() {
        checkPasswordStrength(this.value);
        checkPasswordMatch();
    });
    
    confirmPasswordInput.addEventListener('input', checkPasswordMatch);
    usernameInput.addEventListener('input', checkUsername);
    
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
        
        // Validation
        let errors = [];
        
        if (!fullName) errors.push('Full name is required');
        if (!email) errors.push('Email is required');
        if (!username) errors.push('Username is required');
        if (!password) errors.push('Password is required');
        if (!confirmPassword) errors.push('Please confirm your password');
        if (!terms) errors.push('You must agree to the Terms of Service');
        
        if (email && !validateEmail(email)) errors.push('Please enter a valid email');
        if (password && checkPasswordStrength(password) < 2) errors.push('Password is too weak');
        if (password && confirmPassword && password !== confirmPassword) errors.push('Passwords do not match');
        if (username && username.length < 3) errors.push('Username must be at least 3 characters');
        
        // Check if username is taken
        if (username && takenUsernames.includes(username.toLowerCase())) {
            errors.push('Username is already taken');
        }
        
        // Show errors if any
        if (errors.length > 0) {
            alert('Please fix the following errors:\n\n' + errors.join('\n'));
            return;
        }
        
        // Disable button and show loading
        signupBtn.disabled = true;
        signupBtn.innerHTML = '<span class="btn-text">Creating Account...</span>';
        
        // Simulate API call
        setTimeout(() => {
            // Store user data (demo only - in real app, send to backend)
            const userData = {
                fullName: fullName,
                email: email,
                username: username,
                password: password, // Note: In real app, hash this!
                joined: new Date().toISOString(),
                newsletter: document.getElementById('newsletter').checked
            };
            
            // Save to localStorage for demo
            localStorage.setItem('user_' + username, JSON.stringify(userData));
            localStorage.setItem('currentUser', username);
            localStorage.setItem('isLoggedIn', 'true');
            
            // Success
            alert(`Welcome to GameHub, ${username}! Your account has been created.`);
            
            // Redirect to home page
            window.location.href = 'index.html';
        }, 1500);
    });
    
    // Login button
    loginBtnAlt.addEventListener('click', function() {
        window.location.href = 'login.html';
    });
    
    // Social buttons
    document.querySelectorAll('.social-btn').forEach(button => {
        button.addEventListener('click', function() {
            const platform = this.querySelector('span:last-child').textContent;
            alert(`${platform} sign up would be implemented here.`);
        });
    });
});