
document.addEventListener('DOMContentLoaded', function() {
    const authButton = document.getElementById('user-auth');
    if (!authButton) return;
    
    // Update UI based on login status
    function updateAuthUI() {
        const user = localStorage.getItem('user');
        
        if (user) {
            try {
                const userData = JSON.parse(user);
                const username = userData.name || userData.username || 'Player';
                authButton.textContent = `👤 ${username}`;
                authButton.style.color = '#4CAF50';
                
                // Set logout handler
                authButton.onclick = function() {
                    if (confirm(`Logout ${username}?`)) {
                        localStorage.removeItem('user');
                        localStorage.removeItem('gameHistory');
                        window.location.reload();
                    }
                };
            } catch (e) {
                console.error('Error:', e);
            }
        } else {
            authButton.textContent = 'Log in';
            authButton.style.color = '';
            
            // Set login handler
            authButton.onclick = function() {
                window.location.href = 'login.html';
            };
        }
    }
    
    // Initial update
    updateAuthUI();
    
    // Listen for storage changes
    window.addEventListener('storage', updateAuthUI);
});