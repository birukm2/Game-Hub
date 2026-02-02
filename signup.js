
document.addEventListener('DOMContentLoaded', function() {
   
    const signupForm = document.getElementById('signupForm');
    const signupBtn = document.getElementById('signupBtn');
    const loginBtnAlt = document.getElementById('loginBtnAlt');
    
    
    if (localStorage.getItem('user')) {
        window.location.href = 'index.html';
        return;
    }

    if (loginBtnAlt) {
        loginBtnAlt.addEventListener('click', function() {
            window.location.href = 'login.html';
        });
    }

 
    const passwordInput = document.getElementById('password');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');

    passwordInput.addEventListener('input', function() {
        const password = this.value;
        
        if (password.length < 1) {
            strengthBar.style.width = '0%';
            strengthText.textContent = 'Enter a password';
        }
        else if (password.length < 6) {
            strengthBar.style.width = '25%';
            strengthBar.style.background = '#ff4757'; 
            strengthText.textContent = 'Password strength: weak';
        }
        else if (password.length < 8) {
            strengthBar.style.width = '60%';
            strengthBar.style.background = '#ffa502'; 
            strengthText.textContent = 'Password strength: medium';
        }
        else {
            strengthBar.style.width = '100%';
            strengthBar.style.background = '#2ed573'; 
            strengthText.textContent = 'Password strength: strong';
        }
    });

    // TERMS POPUP \
    const termsLink = document.querySelector('.terms-link');
    const popup = document.getElementById('terms-popup');
    const closeBtn = document.querySelector('.popup-close');

    if (termsLink) {
        termsLink.addEventListener('click', function(e) {
            e.preventDefault();
            popup.style.display = 'flex';
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            popup.style.display = 'none';
        });
    }

    if (popup) {
        popup.addEventListener('click', function(e) {
            if (e.target === popup) {
                popup.style.display = 'none';
            }
        });
    }

    // Close Escape 
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && popup.style.display === 'flex') {
            popup.style.display = 'none';
        }
    });

 
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const terms = document.getElementById('terms').checked;
        const newsletter = document.getElementById('newsletter').checked; 
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
        

        if (errors.length > 0) {
            alert('Please fix the following:\n\n• ' + errors.join('\n• '));
            return;
        }
       
        signupBtn.disabled = true;
        signupBtn.innerHTML = '<span class="btn-text">Creating Account...</span>';
        

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
        

        localStorage.setItem('user', JSON.stringify(userData));
     
        setTimeout(() => {
            signupBtn.innerHTML = '<span class="btn-text">Account Created!</span>';
            
            setTimeout(() => {
                alert(`Welcome to GameHub, ${fullName}! Your account is ready.`);
                window.location.href = 'index.html';
            }, 1000);
        }, 1500);
    });
    

    document.getElementById('fullName').focus();
});