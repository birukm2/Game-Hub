// netlify-auth.js - SIMPLIFIED VERSION
const NetlifyAuth = {
    init() {
        // Only load if not already loaded
        if (typeof netlifyIdentity === 'undefined') {
            // Load Netlify Identity script
            const script = document.createElement('script');
            script.src = 'https://identity.netlify.com/v1/netlify-identity-widget.js';
            script.onload = () => {
                this.setup();
            };
            document.head.appendChild(script);
        } else {
            this.setup();
        }
    },
    
    setup() {
        // Initialize with minimal settings
        window.netlifyIdentity.init();
        
        // Listen for login
        window.netlifyIdentity.on('login', user => {
            console.log('Netlify login:', user.email);
            
            // Store user data
            localStorage.setItem('user', JSON.stringify({
                email: user.email,
                name: user.user_metadata?.full_name || user.email.split('@')[0],
                source: 'netlify'
            }));
            
            // Store token if available
            if (user.token?.access_token) {
                localStorage.setItem('nf_token', user.token.access_token);
            }
            
            // Check for pending game
            const pendingGame = localStorage.getItem('pendingGame');
            if (pendingGame) {
                try {
                    const game = JSON.parse(pendingGame);
                    window.open(game.url, '_blank');
                } catch (e) {
                    console.error('Error with pending game:', e);
                }
                localStorage.removeItem('pendingGame');
            }
            
            // Update UI and reload
            window.location.href = 'index.html';
        });
        
        // Listen for logout
        window.netlifyIdentity.on('logout', () => {
            localStorage.removeItem('user');
            localStorage.removeItem('nf_token');
            window.location.href = 'index.html';
        });
    },
    
    openLogin() {
        if (window.netlifyIdentity) {
            window.netlifyIdentity.open('login');
        } else {
            window.location.href = 'login.html';
        }
    },
    
    openSignup() {
        if (window.netlifyIdentity) {
            window.netlifyIdentity.open('signup');
        } else {
            window.location.href = 'signup.html';
        }
    }
};

// Initialize after DOM loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => NetlifyAuth.init());
} else {
    NetlifyAuth.init();
}
