// netlify-auth.js - FIXED VERSION
const NetlifyAuth = {
    init() {
        // Wait for Netlify Identity to load
        if (typeof netlifyIdentity !== 'undefined') {
            this.setupNetlifyIdentity();
        } else {
            // If not loaded after 3 seconds, show warning
            setTimeout(() => {
                if (typeof netlifyIdentity === 'undefined') {
                    console.warn('Netlify Identity not loaded. Check your Netlify settings.');
                    this.setupLocalAuth();
                }
            }, 3000);
        }
    },
    
    setupNetlifyIdentity() {
        window.netlifyIdentity.on('init', user => {
            console.log('Netlify Identity initialized');
            this.updateUI();
            
            // Auto-redirect after login
            if (user) {
                netlifyIdentity.on('login', () => {
                    document.location.href = '/';
                });
            }
        });
        
        window.netlifyIdentity.on('login', user => {
            console.log('User logged in:', user.email);
            this.onLoginSuccess(user);
            this.updateUI();
        });
        
        window.netlifyIdentity.on('logout', () => {
            console.log('User logged out');
            this.onLogout();
            this.updateUI();
        });
        
        window.netlifyIdentity.on('error', err => {
            console.error('Netlify Identity error:', err);
            // Fallback to local auth on error
            this.setupLocalAuth();
        });
        
        // Initialize
        window.netlifyIdentity.init();
    },
    
    setupLocalAuth() {
        console.log('Using local authentication fallback');
        // Local storage fallback for testing
        document.addEventListener('DOMContentLoaded', () => {
            this.updateUI();
        });
    },
    
    isLoggedIn() {
        if (window.netlifyIdentity && window.netlifyIdentity.currentUser) {
            return window.netlifyIdentity.currentUser() !== null;
        }
        // Fallback to localStorage
        return localStorage.getItem('userLoggedIn') === 'true';
    },
    
    getCurrentUser() {
        if (window.netlifyIdentity && window.netlifyIdentity.currentUser) {
            return window.netlifyIdentity.currentUser();
        }
        // Fallback
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    },
    
    openLogin() {
        if (window.netlifyIdentity && window.netlifyIdentity.open) {
            window.netlifyIdentity.open('login');
        } else {
            // Fallback
            window.location.href = '/login.html';
        }
    },
    
    openSignup() {
        if (window.netlifyIdentity && window.netlifyIdentity.open) {
            window.netlifyIdentity.open('signup');
        } else {
            window.location.href = '/signup.html';
        }
    },
    
    logout() {
        if (window.netlifyIdentity && window.netlifyIdentity.logout) {
            window.netlifyIdentity.logout();
        } else {
            localStorage.removeItem('userLoggedIn');
            localStorage.removeItem('userData');
            window.location.href = '/';
        }
    },
    
    onLoginSuccess(user) {
        const userData = {
            email: user.email,
            name: user.user_metadata?.full_name || user.email.split('@')[0]
        };
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('userLoggedIn', 'true');
        
        // Handle pending game
        const pendingGame = localStorage.getItem('pendingGame');
        if (pendingGame) {
            try {
                const game = JSON.parse(pendingGame);
                if (game.url) {
                    window.open(game.url, '_blank');
                }
            } catch (e) {
                console.error('Error parsing pending game:', e);
            }
            localStorage.removeItem('pendingGame');
        }
    },
    
    onLogout() {
        localStorage.removeItem('userData');
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('pendingGame');
    },
    
    updateUI() {
        const authBtn = document.getElementById('user-auth');
        if (!authBtn) return;
        
        if (this.isLoggedIn()) {
            const user = this.getCurrentUser();
            let username = 'User';
            
            if (user) {
                if (user.user_metadata?.full_name) {
                    username = user.user_metadata.full_name;
                } else if (user.email) {
                    username = user.email.split('@')[0];
                } else if (user.name) {
                    username = user.name;
                }
            }
            
            authBtn.innerHTML = `👤 ${username}`;
            authBtn.style.color = '#4CAF50';
            authBtn.title = 'Click to logout';
        } else {
            authBtn.innerHTML = 'Log in';
            authBtn.style.color = '';
            authBtn.title = 'Click to login';
        }
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        NetlifyAuth.init();
    });
} else {
    NetlifyAuth.init();
}

window.NetlifyAuth = NetlifyAuth;
