// netlify-auth.js - Netlify Identity integration
const NetlifyAuth = {
    init() {
        if (window.netlifyIdentity) {
            window.netlifyIdentity.on("init", user => {
                console.log("Auth initialized", user ? "User logged in" : "No user");
            });
            
            window.netlifyIdentity.on("login", user => {
                console.log("User logged in:", user.email);
                this.onLoginSuccess(user);
                window.netlifyIdentity.close();
            });
            
            window.netlifyIdentity.on("logout", () => {
                console.log("User logged out");
                this.onLogout();
            });
            
            window.netlifyIdentity.init();
        }
    },
    
    isLoggedIn() {
        return window.netlifyIdentity && window.netlifyIdentity.currentUser() !== null;
    },
    
    getCurrentUser() {
        return window.netlifyIdentity ? window.netlifyIdentity.currentUser() : null;
    },
    
    openLogin() {
        if (window.netlifyIdentity) {
            window.netlifyIdentity.open("login");
        }
    },
    
    openSignup() {
        if (window.netlifyIdentity) {
            window.netlifyIdentity.open("signup");
        }
    },
    
    logout() {
        if (window.netlifyIdentity) {
            window.netlifyIdentity.logout();
        }
    },
    
    onLoginSuccess(user) {
        // Store user info
        localStorage.setItem('netlifyUser', JSON.stringify(user));
        
        // Check if there's a pending game
        const pendingGame = localStorage.getItem('pendingGame');
        if (pendingGame) {
            console.log("Playing pending game after login");
            // The game will be played by updateAuthButton in index.js
        }
        
        // Redirect if needed
        if (window.location.pathname.includes('login.html') || 
            window.location.pathname.includes('signup.html')) {
            window.location.href = 'index.html';
        }
    },
    
    onLogout() {
        localStorage.removeItem('netlifyUser');
        localStorage.removeItem('pendingGame');
        
        if (!window.location.pathname.includes('index.html')) {
            window.location.href = 'index.html';
        }
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    NetlifyAuth.init();
});

window.NetlifyAuth = NetlifyAuth;