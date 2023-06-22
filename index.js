var playerRed = "R";
var playerYellow = "Y";
var currentPlayer = playerRed;
var gameOver = false;
var board;

var rows = 6;
var columns = 7;
var currColumns;

let twoPlayerGame = true;
let aiGame = false;
let available = [];
let random;


window.onload = function () {
    setGame();
}

function setGame() {
    let text = document.getElementById("winner");
    const resetBtn = document.querySelector("#resetBtn");
    board = [];
    currColumns = [5, 5, 5, 5, 5, 5, 5]
    text.innerText = "RED IT IS YOUR MOVE";
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            row.push(" ");
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            tile.addEventListener("click", setPeice);
            document.getElementById("board").append(tile);
        }
        board.push(row);
    }
}


function setPeice() {
    if (gameOver) {
        return;
    }

    let cords = this.id.split("-");
    let r = parseInt(cords[0]);
    let c = parseInt(cords[1]);

    r = currColumns[c];
    if (r < 0) {
        return;
    }

    board[r][c] = currentPlayer;
    let tile = document.getElementById(r.toString() + "-" + c.toString());
    let text = document.getElementById("winner");

    if (currentPlayer == playerRed) {
        text.innerText = "YELLOW IT IS YOUR MOVE";
        text.classList.remove('Red');
        text.classList.add('Yellow');
        tile.classList.add("red-piece");
        console.log(r.toString() + "-" + c.toString());
        currentPlayer = playerYellow;
        r--;
        currColumns[c] = r;

        checkWin();

    } else if (currentPlayer == playerYellow) {
        text.innerText = "RED IT IS YOUR MOVE";
        text.classList.remove('Yellow');
        text.classList.add('Red');
        currentPlayer = playerRed;
        tile.classList.add("yellow-piece");
        r--;
        currColumns[c] = r;

        checkWin();

    }
}



function win(game, turn) {
    // Horizontal Check
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < 4; c++) {
            var board1 = game[r][c];
            var board2 = game[r][c + 1];
            var board3 = game[r][c + 2];
            var board4 = game[r][c + 3];
            if (board1 == turn && board2 == turn && board3 == turn && board4 == turn) {
                return true;
            }

        }
    }
    // Vertical Check
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < columns; c++) {
            var board1 = game[r][c];
            var board2 = game[r + 1][c];
            var board3 = game[r + 2][c];
            var board4 = game[r + 3][c];
            if (board1 == turn && board2 == turn && board3 == turn && board4 == turn) {
                return true;
            }

        }
    }
    // Diagonal Left to Right Check
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < columns - 3; c++) {
            var board1 = game[r][c];
            var board2 = game[r + 1][c + 1];
            var board3 = game[r + 2][c + 2];
            var board4 = game[r + 3][c + 3];
            if (board1 == turn && board2 == turn && board3 == turn && board4 == turn) {
                return true;
            }

        }
    }
    // Diagonal Right to Left Check
    for (let r = 3; r < rows; r++) {
        for (let c = 0; c < columns - 3; c++) {
            var board1 = game[r][c];
            var board2 = game[r - 1][c + 1];
            var board3 = game[r - 2][c + 2];
            var board4 = game[r - 3][c + 3];
            if (board1 == turn && board2 == turn && board3 == turn && board4 == turn) {
                return true;
            }
        }
    }
}


function checkWin() {
    // Horizontal Check
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < 4; c++) {
            var board1 = board[r][c];
            var board2 = board[r][c + 1];
            var board3 = board[r][c + 2];
            var board4 = board[r][c + 3];
            if (board1 == playerRed && board2 == playerRed && board3 == playerRed && board4 == playerRed) {
                console.log("Red");
                setWinner("RED");
                gameOver = true;
            } else if (board1 == playerYellow && board2 == playerYellow && board3 == playerYellow && board4 == playerYellow) {
                console.log("Yellow");
                setWinner("YELLOW");
                gameOver = true;
            }

        }
    }
    // Vertical Check
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < columns; c++) {
            var board1 = board[r][c];
            var board2 = board[r + 1][c];
            var board3 = board[r + 2][c];
            var board4 = board[r + 3][c];
            if (board1 == playerRed && board2 == playerRed && board3 == playerRed && board4 == playerRed) {
                console.log("Red");
                setWinner("RED");
                gameOver = true;
            } else if (board1 == playerYellow && board2 == playerYellow && board3 == playerYellow && board4 == playerYellow) {
                console.log("Yellow");
                setWinner("YELLOW");
                gameOver = true;
            }

        }
    }
    // Diagonal Left to Right Check
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < columns - 3; c++) {
            var board1 = board[r][c];
            var board2 = board[r + 1][c + 1];
            var board3 = board[r + 2][c + 2];
            var board4 = board[r + 3][c + 3];
            if (board1 == playerRed && board2 == playerRed && board3 == playerRed && board4 == playerRed) {
                console.log("Red");
                setWinner("RED");
                gameOver = true;
            } else if (board1 == playerYellow && board2 == playerYellow && board3 == playerYellow && board4 == playerYellow) {
                console.log("Yellow");
                setWinner("YELLOW");
                gameOver = true;
            }

        }
    }
    // Diagonal Right to Left Check
    for (let r = 3; r < rows; r++) {
        for (let c = 0; c < columns - 3; c++) {
            var board1 = board[r][c];
            var board2 = board[r - 1][c + 1];
            var board3 = board[r - 2][c + 2];
            var board4 = board[r - 3][c + 3];
            if (board1 == playerRed && board2 == playerRed && board3 == playerRed && board4 == playerRed) {
                console.log("Red");
                setWinner("RED");
                gameOver = true;
            } else if (board1 == playerYellow && board2 == playerYellow && board3 == playerYellow && board4 == playerYellow) {
                console.log("Yellow");
                setWinner("YELLOW");
                gameOver = true;
            }

        }
    }
}

function setWinner(win) {
    let text = document.getElementById("winner");
    text.innerText = "THE WINNER IS " + win;
    if (win == "YELLOW") {
        text.classList.add('YellowWin');
    } else {
        text.classList.add('RedWin');
    }
}


function resetGame() {
    console.log("reset");
    currColumns = [5, 5, 5, 5, 5, 5, 5]
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString())
            if (tile.classList.contains("red-piece")) {
                console.log("red remove");
                tile.classList.remove("red-piece");
            } else if (tile.classList.contains("yellow-piece")) {
                console.log("yellow remove");
                tile.classList.remove("yellow-piece");
            }
        }
    }
};