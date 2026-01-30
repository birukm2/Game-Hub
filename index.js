// index.js - Main JavaScript with game data
document.addEventListener('DOMContentLoaded', () => {
    // ===== GAME DATABASE =====
    const games = [
        {
            id: 1,
            title: "Chess",
            category: "strategy",
            description: "Instant chess vs computer - just move pieces!",
            image: "assets/games/chess.jpg",
            url: "https://www.chess.com/play/computer", 
            featured: true,
            rating: 4.8
        },
        {
            id: 2,
            title: "2048",
            category: "puzzle",
            description: "Slide tiles with arrow keys - game starts immediately!",
            image: "assets/games/2048.jpg",
            url: "https://play2048.co/", 
            featured: true,
            rating: 4.5
        },
        {
            id: 3,
            title: "Tic Tac Toe",
            category: "strategy", 
            description: "Click squares to play vs AI - no setup needed!",
            image: "assets/games/tictactoe.jpg",
            url: "https://playtictactoe.org/", 
            featured: true,
            rating: 4.0
        },
        {
            id: 4,
            title: "Snake",
            category: "arcade",
            description: "Press space to start - arrow keys to move!",
            image: "assets/games/snake.jpg",
            url: "https://playsnake.org/", 
            featured: false,
            rating: 4.3
        },
        {
            id: 5,
            title: "Checkers",
            category: "strategy",
            description: "Click pieces to move - play against AI!",
            image: "assets/games/checkers.jpg",
            url: "https://cardgames.io/checkers/", 
            featured: false,
            rating: 4.2
        },
        {
            id: 6,
            title: "Solitaire",
            category: "puzzle",
            description: "Click and drag cards - game starts immediately!",
            image: "assets/games/solitaire.jpg",
            url: "https://cardgames.io/solitaire/", 
            featured: false,
            rating: 4.6
        },
        {
            id: 7,
            title: "Wordle",
            category: "puzzle",
            description: "Start typing to guess the word!",
            image: "assets/games/wordle.jpg",
            url: "https://www.nytimes.com/games/wordle/index.html", 
            featured: false,
            rating: 4.7
        },
        {
            id: 8,
            title: "Minesweeper",
            category: "puzzle",
            description: "Click squares to start finding mines!",
            image: "assets/games/minesweeper.jpg",
            url: "https://minesweeper.online/", 
            featured: false,
            rating: 4.1
        },
        {
            id: 9,
            title: "Tetris",
            category: "arcade",
            description: "Blocks fall immediately - use arrow keys!",
            image: "assets/games/tetris.jpg",
            url: "https://tetris.com/play-tetris", 
            featured: false,
            rating: 4.9
        },
        {
            id: 10,
            title: "Pac-Man",
            category: "arcade",
            description: "Press any key to start eating dots!",
            image: "assets/games/pacman.jpg",
            url: "https://www.google.com/logos/2010/pacman10-i.html", 
            featured: true,
            rating: 4.8
        },
        {
            id: 11,
            title: "Sudoku",
            category: "puzzle",
            description: "Click cells and type numbers - play immediately!",
            image: "assets/games/sudoku.jpg",
            url: "https://sudoku.com/", 
            featured: false,
            rating: 4.4
        },
        {
            id: 12,
            title: "Crossword",
            category: "puzzle",
            description: "Click clues and type answers - starts immediately!",
            image: "assets/games/crossword.jpg",
            url: "https://www.nytimes.com/crosswords/game/daily", 
            featured: false,
            rating: 4.3
        }
    ];

    // ===== DOM ELEMENTS =====
    const gamesGrid = document.getElementById('games-grid');
    const allGamesGrid = document.getElementById('all-games-grid');
    const searchInput = document.getElementById('search-input');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const loginPopup = document.getElementById('loginPopup');
    const popupMessage = document.getElementById('popup-message');
    const popupLoginBtn = document.getElementById('popup-login-btn');
    const popupSignupBtn = document.getElementById('popup-signup-btn');
    const popupCancelBtn = document.getElementById('popup-cancel-btn');
    const userAuthBtn = document.getElementById('user-auth');
    const themeToggle = document.getElementById('theme-toggle');

    // ===== INITIALIZE =====
    initializePage();
    
    function initializePage() {
        // Load games
        loadFeaturedGames();
        loadAllGames();
        
        // Set up event listeners
        setupEventListeners();
    }

    // ===== GAME LOADING FUNCTIONS =====
    function loadFeaturedGames() {
        const featuredGames = games.filter(game => game.featured);
        gamesGrid.innerHTML = '';
        featuredGames.forEach(game => {
            gamesGrid.appendChild(createGameCard(game));
        });
    }

    function loadAllGames() {
        allGamesGrid.innerHTML = '';
        games.forEach(game => {
            allGamesGrid.appendChild(createGameCard(game));
        });
    }

    function createGameCard(game) {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.dataset.category = game.category;
        card.dataset.title = game.title.toLowerCase();
        
        card.innerHTML = `
            <div class="game-image-wrapper">
                <img src="${game.image}" alt="${game.title}" class="game-image" 
                     onerror="this.src='assets/games/default.jpg'">
                <div class="game-overlay">
                    <button class="play-btn" data-game-id="${game.id}">Play Now</button>
                </div>
            </div>
            <div class="game-info">
                <h3 class="game-title">${game.title}</h3>
                <span class="game-category">${game.category.toUpperCase()}</span>
                <p class="game-description">${game.description}</p>
                <div class="game-rating">⭐ ${game.rating}/5</div>
            </div>
        `;
        
        return card;
    }

    // ===== EVENT LISTENERS =====
    function setupEventListeners() {
        // Search functionality
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            filterGames(searchTerm);
        });

        // Category filters
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter games
                const category = button.dataset.category;
                filterGames('', category);
            });
        });

        // Play button clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('play-btn')) {
                const gameId = parseInt(e.target.dataset.gameId);
                const game = games.find(g => g.id === gameId);
                
                if (game) {
                    // Check if user is logged in
                    if (!localStorage.getItem('user')) {
                        // Not logged in - SHOW POPUP
                        showLoginPopup(game);
                    } else {
                        // Logged in - play the game
                        window.open(game.url, '_blank');
                        
                        // Record game play in history
                        const user = JSON.parse(localStorage.getItem('user'));
                        const gameHistory = JSON.parse(localStorage.getItem('gameHistory') || '[]');
                        gameHistory.unshift({
                            gameId: game.id,
                            gameTitle: game.title,
                            playedAt: new Date().toISOString(),
                            userId: user.id || user.email
                        });
                        localStorage.setItem('gameHistory', JSON.stringify(gameHistory.slice(0, 10)));
                    }
                }
            }
        });

        // Popup buttons - FIXED
        popupLoginBtn.addEventListener('click', () => {
            window.location.href = 'login.html';
            hideLoginPopup();
        });

        popupSignupBtn.addEventListener('click', () => {
            window.location.href = 'signup.html';
            hideLoginPopup();
        });

        popupCancelBtn.addEventListener('click', hideLoginPopup);

        // Close popup when clicking outside
        loginPopup.addEventListener('click', (e) => {
            if (e.target === loginPopup) {
                hideLoginPopup();
            }
        });

        // Theme toggle
        themeToggle.addEventListener('click', toggleTheme);
    }

    // ===== LOGIN POPUP =====
    function showLoginPopup(game) {
        popupMessage.textContent = `Log in to play "${game.title}" and save your progress!`;
        loginPopup.style.display = 'flex';
        
        // Store game info for after login
        localStorage.setItem('pendingGame', JSON.stringify(game));
    }

    function hideLoginPopup() {
        loginPopup.style.display = 'none';
    }

    // ===== GAME FILTERING =====
    function filterGames(searchTerm = '', category = 'all') {
        const cards = allGamesGrid.querySelectorAll('.game-card');
        
        cards.forEach(card => {
            const matchesSearch = !searchTerm || 
                card.dataset.title.includes(searchTerm) ||
                card.querySelector('.game-title').textContent.toLowerCase().includes(searchTerm);
            
            const matchesCategory = category === 'all' || 
                card.dataset.category === category;
            
            card.style.display = (matchesSearch && matchesCategory) ? 'block' : 'none';
        });
    }

    // ===== THEME TOGGLE =====
    function toggleTheme() {
        document.body.classList.toggle('light-mode');
        
        if (document.body.classList.contains('light-mode')) {
            themeToggle.textContent = '🌙';
            document.body.style.backgroundColor = '#f5f5f5';
            document.body.style.color = '#333';
        } else {
            themeToggle.textContent = '☀️';
            document.body.style.backgroundColor = '#0f0f0f';
            document.body.style.color = '#fff';
        }
    }
});
