// Game constants and variables
const ROWS = 6;
const COLS = 7;
const EMPTY = 0;
const RED = 1;
const YELLOW = 2;

// Game state
let board = [];
let currentPlayer = RED;
let gameOver = false;
let aiMode = false;
let winningCells = [];

// Sound effects
let dropSound, winSound, clickSound;

// DOM elements
let playerIndicator;
let playerIndicatorText;
let gameMessage;
let messageText;

// Initialize the game when the window loads
window.onload = function () {
    // Get DOM elements
    playerIndicator = document.querySelector('.current-player');
    playerIndicatorText = document.querySelector('.player-indicator p');
    gameMessage = document.getElementById('game-message');
    messageText = document.getElementById('message-text');

    // Add event listeners
    document.getElementById('reset').addEventListener('click', resetGame);
    document.getElementById('mode').addEventListener('click', toggleAIMode);
    document.getElementById('play-again').addEventListener('click', resetGame);
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

    // Initialize sounds
    initSounds();

    // Create the game board
    createBoard();

    // Check for saved theme preference
    checkThemePreference();
}

function initSounds() {
    // Create audio elements
    dropSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2073/2073-preview.mp3');
    winSound = new Audio('https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3');
    clickSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');

    // Set volume
    dropSound.volume = 0.3;
    winSound.volume = 0.4;
    clickSound.volume = 0.2;
}

// Create the game board
function createBoard() {
    // Clear any existing board
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';

    // Initialize the board array
    board = [];
    for (let r = 0; r < ROWS; r++) {
        const row = [];
        for (let c = 0; c < COLS; c++) {
            row.push(EMPTY);

            // Create cell element
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = r;
            cell.dataset.col = c;

            // Add click event to each cell
            cell.addEventListener('click', handleCellClick);

            // Add hover events for column highlighting
            cell.addEventListener('mouseenter', handleCellHover);
            cell.addEventListener('mouseleave', handleCellLeave);

            boardElement.appendChild(cell);
        }
        board.push(row);
    }

    // Reset game state
    currentPlayer = RED;
    gameOver = false;
    winningCells = [];
    updatePlayerIndicator();
}

// Update the player indicator to show whose turn it is
function updatePlayerIndicator() {
    if (currentPlayer === RED) {
        playerIndicator.className = 'current-player red';
        playerIndicatorText.textContent = "Red's Turn";
    } else {
        playerIndicator.className = 'current-player yellow';
        playerIndicatorText.textContent = "Yellow's Turn";
    }
}

// Handle cell click event
function handleCellClick() {
    if (gameOver) return;

    // If it's AI's turn and AI mode is on, don't allow player to make a move
    if (aiMode && currentPlayer === YELLOW) return;

    const col = parseInt(this.dataset.col);
    makeMove(col);
}

// Handle cell hover event
function handleCellHover() {
    if (gameOver) return;
    if (aiMode && currentPlayer === YELLOW) return;

    const col = parseInt(this.dataset.col);
    highlightColumn(col);
}

// Handle cell leave event
function handleCellLeave() {
    const col = parseInt(this.dataset.col);
    unhighlightColumn(col);
}

// Highlight column
function highlightColumn(col) {
    // Find the top empty cell in the column
    const row = getTopEmptyRow(col);
    if (row === -1) return; // Column is full

    const cells = document.querySelectorAll(`.cell[data-col="${col}"]`);

    // Add hover effect to the column
    cells.forEach(cell => {
        // Add a subtle highlight to the entire column
        if (!cell.classList.contains('red') && !cell.classList.contains('yellow')) {
            cell.classList.add('column-hover');

            // Highlight the cell where the piece would land
            if (parseInt(cell.dataset.row) === row) {
                cell.style.backgroundColor = currentPlayer === RED ?
                    'rgba(231, 76, 60, 0.3)' : 'rgba(241, 196, 15, 0.3)';
            }
        }
    });
}

// Remove highlight from column
function unhighlightColumn(col) {
    const cells = document.querySelectorAll(`.cell[data-col="${col}"]`);

    cells.forEach(cell => {
        cell.classList.remove('column-hover');
        if (!cell.classList.contains('red') && !cell.classList.contains('yellow')) {
            cell.style.backgroundColor = '';
        }
    });
}

// Find the top empty row in a column
function getTopEmptyRow(col) {
    for (let r = ROWS - 1; r >= 0; r--) {
        if (board[r][col] === EMPTY) {
            return r;
        }
    }
    return -1; // Column is full
}

// Make a move in the specified column
function makeMove(col) {
    // Find the top empty row in the column
    const row = getTopEmptyRow(col);

    // If the column is full, do nothing
    if (row === -1) return;

    // Update the board array
    board[row][col] = currentPlayer;

    // Update the UI
    updateCell(row, col);

    // Play drop sound
    if (dropSound) dropSound.play();

    // Check for a win
    if (checkWin(row, col)) {
        gameOver = true;
        highlightWinningCells();
        showGameMessage();
        createConfetti();
        if (winSound) winSound.play();
        return;
    }

    // Check for a draw
    if (checkDraw()) {
        gameOver = true;
        showGameMessage(true);
        return;
    }

    // Switch players
    currentPlayer = currentPlayer === RED ? YELLOW : RED;
    updatePlayerIndicator();

    // If it's AI's turn and AI mode is on, make AI move after a delay
    if (aiMode && currentPlayer === YELLOW && !gameOver) {
        setTimeout(makeAIMove, 700);
    }
}

// Update the cell in the UI
function updateCell(row, col) {
    const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    if (currentPlayer === RED) {
        cell.classList.add('red');
    } else {
        cell.classList.add('yellow');
    }
}

// Check for a win starting from the last placed piece
function checkWin(row, col) {
    const player = board[row][col];
    let count;

    // Check horizontal
    count = 1;
    winningCells = [{ row, col }];

    // Check left
    for (let c = col - 1; c >= 0; c--) {
        if (board[row][c] === player) {
            count++;
            winningCells.push({ row, col: c });
        } else {
            break;
        }
    }

    // Check right
    for (let c = col + 1; c < COLS; c++) {
        if (board[row][c] === player) {
            count++;
            winningCells.push({ row, col: c });
        } else {
            break;
        }
    }

    if (count >= 4) return true;

    // Check vertical
    count = 1;
    winningCells = [{ row, col }];

    // Check down (no need to check up as pieces fall down)
    for (let r = row + 1; r < ROWS; r++) {
        if (board[r][col] === player) {
            count++;
            winningCells.push({ row: r, col });
        } else {
            break;
        }
    }

    if (count >= 4) return true;

    // Check diagonal (top-left to bottom-right)
    count = 1;
    winningCells = [{ row, col }];

    // Check top-left
    for (let r = row - 1, c = col - 1; r >= 0 && c >= 0; r--, c--) {
        if (board[r][c] === player) {
            count++;
            winningCells.push({ row: r, col: c });
        } else {
            break;
        }
    }

    // Check bottom-right
    for (let r = row + 1, c = col + 1; r < ROWS && c < COLS; r++, c++) {
        if (board[r][c] === player) {
            count++;
            winningCells.push({ row: r, col: c });
        } else {
            break;
        }
    }

    if (count >= 4) return true;

    // Check diagonal (top-right to bottom-left)
    count = 1;
    winningCells = [{ row, col }];

    // Check top-right
    for (let r = row - 1, c = col + 1; r >= 0 && c < COLS; r--, c++) {
        if (board[r][c] === player) {
            count++;
            winningCells.push({ row: r, col: c });
        } else {
            break;
        }
    }

    // Check bottom-left
    for (let r = row + 1, c = col - 1; r < ROWS && c >= 0; r++, c--) {
        if (board[r][c] === player) {
            count++;
            winningCells.push({ row: r, col: c });
        } else {
            break;
        }
    }

    if (count >= 4) return true;

    // No win found
    winningCells = [];
    return false;
}

// Check for a draw (board is full)
function checkDraw() {
    for (let c = 0; c < COLS; c++) {
        if (board[0][c] === EMPTY) {
            return false; // At least one column is not full
        }
    }
    return true; // All columns are full
}

// Highlight the winning cells
function highlightWinningCells() {
    winningCells.forEach(cell => {
        const cellElement = document.querySelector(`.cell[data-row="${cell.row}"][data-col="${cell.col}"]`);
        cellElement.classList.add('win');
    });
}

// Show game message (win or draw)
function showGameMessage(isDraw = false) {
    if (isDraw) {
        messageText.textContent = "It's a Draw!";
    } else {
        messageText.textContent = currentPlayer === RED ? "Red Wins!" : "Yellow Wins!";
    }

    gameMessage.classList.remove('hidden');
    gameMessage.classList.add('visible');
}

// Toggle between AI and two-player mode
function toggleAIMode() {
    if (clickSound) clickSound.play();

    aiMode = !aiMode;
    const modeButton = document.getElementById('mode');

    if (aiMode) {
        modeButton.innerHTML = '<i class="fas fa-robot"></i> Play vs AI';
    } else {
        modeButton.innerHTML = '<i class="fas fa-user-friends"></i> Two Player';
    }

    // Reset the game when switching modes
    resetGame();
}

// Make an AI move using minimax algorithm with alpha-beta pruning
function makeAIMove() {
    if (gameOver || currentPlayer !== YELLOW) return;

    // Start the minimax algorithm to find the best move
    const bestMove = findBestMove();

    // Make the move
    if (bestMove !== -1) {
        makeMove(bestMove);
    } else {
        // Fallback to simple strategy if minimax fails
        makeSimpleMove();
    }
}

// Find the best move using minimax with alpha-beta pruning
function findBestMove() {
    let bestScore = -Infinity;
    let bestMove = -1;
    const depth = 5; // Look ahead 5 moves

    // Try each column
    for (let c = 0; c < COLS; c++) {
        const r = getTopEmptyRow(c);
        if (r === -1) continue; // Column is full

        // Make the move
        board[r][c] = YELLOW;

        // Evaluate this move
        const score = minimax(board, depth, -Infinity, Infinity, false);

        // Undo the move
        board[r][c] = EMPTY;

        // Update best move if this is better
        if (score > bestScore) {
            bestScore = score;
            bestMove = c;
        }
    }

    return bestMove;
}

// Minimax algorithm with alpha-beta pruning
function minimax(board, depth, alpha, beta, isMaximizing) {
    // Check for terminal states
    if (checkForWin(YELLOW)) return 1000; // AI wins
    if (checkForWin(RED)) return -1000; // Player wins
    if (isBoardFull()) return 0; // Draw
    if (depth === 0) return evaluateBoard(); // Depth limit reached

    if (isMaximizing) {
        // AI's turn (maximizing)
        let maxScore = -Infinity;

        // Try each column
        for (let c = 0; c < COLS; c++) {
            const r = getTopEmptyRow(c);
            if (r === -1) continue; // Column is full

            // Make the move
            board[r][c] = YELLOW;

            // Evaluate this move
            const score = minimax(board, depth - 1, alpha, beta, false);

            // Undo the move
            board[r][c] = EMPTY;

            // Update max score
            maxScore = Math.max(maxScore, score);

            // Alpha-beta pruning
            alpha = Math.max(alpha, score);
            if (beta <= alpha) break;
        }

        return maxScore;
    } else {
        // Player's turn (minimizing)
        let minScore = Infinity;

        // Try each column
        for (let c = 0; c < COLS; c++) {
            const r = getTopEmptyRow(c);
            if (r === -1) continue; // Column is full

            // Make the move
            board[r][c] = RED;

            // Evaluate this move
            const score = minimax(board, depth - 1, alpha, beta, true);

            // Undo the move
            board[r][c] = EMPTY;

            // Update min score
            minScore = Math.min(minScore, score);

            // Alpha-beta pruning
            beta = Math.min(beta, score);
            if (beta <= alpha) break;
        }

        return minScore;
    }
}

// Check if the board is full
function isBoardFull() {
    for (let c = 0; c < COLS; c++) {
        if (getTopEmptyRow(c) !== -1) {
            return false; // At least one column is not full
        }
    }
    return true; // All columns are full
}

// Check if a player has won
function checkForWin(player) {
    // Check horizontal
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c <= COLS - 4; c++) {
            if (board[r][c] === player &&
                board[r][c + 1] === player &&
                board[r][c + 2] === player &&
                board[r][c + 3] === player) {
                return true;
            }
        }
    }

    // Check vertical
    for (let r = 0; r <= ROWS - 4; r++) {
        for (let c = 0; c < COLS; c++) {
            if (board[r][c] === player &&
                board[r + 1][c] === player &&
                board[r + 2][c] === player &&
                board[r + 3][c] === player) {
                return true;
            }
        }
    }

    // Check diagonal (down-right)
    for (let r = 0; r <= ROWS - 4; r++) {
        for (let c = 0; c <= COLS - 4; c++) {
            if (board[r][c] === player &&
                board[r + 1][c + 1] === player &&
                board[r + 2][c + 2] === player &&
                board[r + 3][c + 3] === player) {
                return true;
            }
        }
    }

    // Check diagonal (up-right)
    for (let r = 3; r < ROWS; r++) {
        for (let c = 0; c <= COLS - 4; c++) {
            if (board[r][c] === player &&
                board[r - 1][c + 1] === player &&
                board[r - 2][c + 2] === player &&
                board[r - 3][c + 3] === player) {
                return true;
            }
        }
    }

    return false;
}

// Evaluate the current board state
function evaluateBoard() {
    let score = 0;

    // Evaluate center column (preferred control)
    const centerCol = Math.floor(COLS / 2);
    const centerCount = countPiecesInColumn(centerCol, YELLOW);
    score += centerCount * 3;

    // Evaluate horizontal windows
    score += evaluateLines('horizontal');

    // Evaluate vertical windows
    score += evaluateLines('vertical');

    // Evaluate diagonal windows
    score += evaluateLines('diagonal');

    return score;
}

// Count pieces in a column
function countPiecesInColumn(col, player) {
    let count = 0;
    for (let r = 0; r < ROWS; r++) {
        if (board[r][col] === player) {
            count++;
        }
    }
    return count;
}

// Evaluate lines (horizontal, vertical, diagonal)
function evaluateLines(direction) {
    let score = 0;

    // Check different line types
    if (direction === 'horizontal') {
        // Horizontal lines
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c <= COLS - 4; c++) {
                score += evaluateWindow([
                    board[r][c],
                    board[r][c + 1],
                    board[r][c + 2],
                    board[r][c + 3]
                ]);
            }
        }
    } else if (direction === 'vertical') {
        // Vertical lines
        for (let c = 0; c < COLS; c++) {
            for (let r = 0; r <= ROWS - 4; r++) {
                score += evaluateWindow([
                    board[r][c],
                    board[r + 1][c],
                    board[r + 2][c],
                    board[r + 3][c]
                ]);
            }
        }
    } else if (direction === 'diagonal') {
        // Diagonal down-right
        for (let r = 0; r <= ROWS - 4; r++) {
            for (let c = 0; c <= COLS - 4; c++) {
                score += evaluateWindow([
                    board[r][c],
                    board[r + 1][c + 1],
                    board[r + 2][c + 2],
                    board[r + 3][c + 3]
                ]);
            }
        }

        // Diagonal up-right
        for (let r = 3; r < ROWS; r++) {
            for (let c = 0; c <= COLS - 4; c++) {
                score += evaluateWindow([
                    board[r][c],
                    board[r - 1][c + 1],
                    board[r - 2][c + 2],
                    board[r - 3][c + 3]
                ]);
            }
        }
    }

    return score;
}

// Evaluate a window of 4 positions
function evaluateWindow(window) {
    let score = 0;
    const aiCount = window.filter(cell => cell === YELLOW).length;
    const playerCount = window.filter(cell => cell === RED).length;
    const emptyCount = window.filter(cell => cell === EMPTY).length;

    // Score the window based on piece counts
    if (aiCount === 4) {
        score += 100; // AI wins
    } else if (aiCount === 3 && emptyCount === 1) {
        score += 5; // AI can win next move
    } else if (aiCount === 2 && emptyCount === 2) {
        score += 2; // AI has two in a row with space
    }

    // Defensive scoring
    if (playerCount === 3 && emptyCount === 1) {
        score -= 4; // Block player from winning
    }

    return score;
}

// Fallback to simple strategy if minimax fails
function makeSimpleMove() {
    // First check if AI can win in the next move
    for (let c = 0; c < COLS; c++) {
        const r = getTopEmptyRow(c);
        if (r === -1) continue; // Column is full

        // Try placing a piece here
        board[r][c] = YELLOW;
        if (checkWin(r, c)) {
            // Undo the move in the board array (we'll make it for real)
            board[r][c] = EMPTY;
            makeMove(c);
            return;
        }
        // Undo the move
        board[r][c] = EMPTY;
    }

    // Then check if player can win in the next move (block them)
    for (let c = 0; c < COLS; c++) {
        const r = getTopEmptyRow(c);
        if (r === -1) continue; // Column is full

        // Try placing opponent's piece here
        board[r][c] = RED;
        if (checkWin(r, c)) {
            // Undo the move in the board array (we'll make it for real)
            board[r][c] = EMPTY;
            makeMove(c);
            return;
        }
        // Undo the move
        board[r][c] = EMPTY;
    }

    // Otherwise, prefer center columns
    const centerColumns = [3, 2, 4, 1, 5, 0, 6];
    for (const c of centerColumns) {
        if (getTopEmptyRow(c) !== -1) {
            makeMove(c);
            return;
        }
    }
}

// Create confetti effect for winning
function createConfetti() {
    const confetti = document.getElementById('confetti');
    confetti.innerHTML = '';
    confetti.classList.remove('hidden');

    const colors = ['#e74c3c', '#f1c40f', '#3498db', '#2ecc71', '#9b59b6'];

    for (let i = 0; i < 150; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';

        // Random properties
        const size = Math.random() * 10 + 5;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100;
        const delay = Math.random() * 3;
        const duration = Math.random() * 3 + 2;

        // Set styles
        piece.style.width = `${size}px`;
        piece.style.height = `${size}px`;
        piece.style.backgroundColor = color;
        piece.style.left = `${left}%`;
        piece.style.animationDelay = `${delay}s`;
        piece.style.animationDuration = `${duration}s`;

        confetti.appendChild(piece);
    }

    // Remove confetti after animation
    setTimeout(() => {
        confetti.classList.add('hidden');
    }, 5000);
}

// Toggle between light and dark theme
function toggleTheme() {
    const html = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = html.getAttribute('data-theme');

    // Play click sound
    if (clickSound) clickSound.play();

    // Toggle theme
    if (currentTheme === 'dark') {
        html.setAttribute('data-theme', 'light');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('theme', 'light');
    } else {
        html.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', 'dark');
    }
}

// Check for saved theme preference
function checkThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    const themeToggle = document.getElementById('theme-toggle');

    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

// Reset the game
function resetGame() {
    // Play click sound
    if (clickSound) clickSound.play();

    // Hide game message if visible
    gameMessage.classList.remove('visible');
    gameMessage.classList.add('hidden');

    // Hide confetti
    document.getElementById('confetti').classList.add('hidden');

    // Create a new board
    createBoard();

    // Add a small animation to the board
    const boardElement = document.getElementById('board');
    boardElement.classList.add('board-reset');
    setTimeout(() => {
        boardElement.classList.remove('board-reset');
    }, 500);
}

