var playerRed = "R";
var playerYellow = "Y";
var currentPlayer = playerRed;
var gameOver = false;
var board;

var rows = 5;
var columns = 8;
var currColumns;
var moveCount = 0;
var win ="";
let twoPlayerGame = true;
let aiGame = false;
let available = [];
let random;
let checkingAhead = false;
let tempOver = false;


window.onload = function () {
    setGame();
    document.getElementById("reset").addEventListener("click", resetGame);
    document.getElementById("mode").addEventListener("click", setAIGame);
}

function setGame() {
    let text = document.getElementById("winner");
    board = [];
    currColumns = [4, 4, 4, 4, 4, 4, 4, 4]
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

function setAIGame(){
    if(aiGame){
        aiGame = false;
        document.getElementById("mode").innerText = "TWO PLAYER MODE";
        if(document.getElementById("winner").classList.contains('AI'))document.getElementById("winner").classList.remove('AI');
        document.getElementById("winner").classList.add('TWO');
    } else {
        aiGame = true;
        document.getElementById("mode").innerText = "AI MODE";
        if(document.getElementById("winner").classList.contains('TWO'))document.getElementById("winner").classList.remove('TWO');
        document.getElementById("winner").classList.add('AI');
    }
}

function setPeice() {
    if (gameOver || (aiGame && currentPlayer == playerYellow)) {
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
        currentPlayer = playerYellow;
        r--;
        currColumns[c] = r;
        moveCount++;
        if(moveCount >= 3){
            checkWin();
        }
        if(aiGame){
            if(!gameOver){
                aiMove();
            }
        }

    } else if (currentPlayer == playerYellow && !aiGame) {
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

function aiMove() {
    outputR = [];
    outputC  = [];
    let r =0;
    let c =0;
    let nextMove = checkNextMoveWin();
    if(nextMove < 0){
        let randomY = Math.floor(Math.random() * columns);
        while(currColumns[randomY] < 0){
            randomY = Math.floor(Math.random() * columns);
        }
        c = randomY;
        r = currColumns[randomY];
    } else {
        c = nextMove;
        r = currColumns[nextMove];
    }
    checkingAhead = false;
    let tile = document.getElementById(r.toString() + "-" + c.toString());
    let text = document.getElementById("winner");
    board[r][c] = currentPlayer;
    currentPlayer = playerRed;  
    text.innerText = "RED IT IS YOUR MOVE";
    text.classList.remove('Yellow');
    text.classList.add('Red');
    tile.classList.add("yellow-piece");
    if (c < 0) {
        return;
    } 
    r--;
    currColumns[c] = r;
    checkWin();

}

function checkNextMoveWin(){
    aval = [];
    for(let x = 0; x < columns; x++){
        if(currColumns[x] >= 0){
            aval.push(x);
        }
    }
    //Check Lose
    for(i in aval){
        currentPlayer = playerRed;
        let r = currColumns[aval[i]];
        let c = aval[i];
        board[r][c] = currentPlayer;
        checkingAhead = true;
        checkWin();
        board[r][c] = " ";
        if(tempOver){
            currentPlayer = playerYellow;
            tempOver = false;
            return aval[i];
        }
    }
    //Check Win
    for(i in aval){
        currentPlayer = playerYellow;
        let c = aval[i];
        let r = currColumns[aval[i]];
        board[r][c] = currentPlayer;
        checkingAhead = true;
        checkWin();
        board[r][c] = " ";
        if(tempOver){
            currentPlayer = playerYellow;
            tempOver = false;
            return aval[i];
        }
    }
    return -1;
}



function checkWin() {
    for(let r = 0; r < rows; r++){
        for(let c = 0; c < columns; c++){
            if(board[r][c] != " "){
                if(c + 3 < columns && board[r][c] == board[r][c + 1] && board[r][c] == board[r][c + 2] && board[r][c] == board[r][c + 3]){
                    setWin(r,c);
                    return;
                }
                if(r + 3 < rows && board[r][c] == board[r + 1][c] && board[r][c] == board[r + 2][c] && board[r][c] == board[r + 3][c]){
                    setWin(r,c);
                    return;
                }
                if(r + 3 < rows && c + 3 < columns && board[r][c] == board[r + 1][c + 1] && board[r][c] == board[r + 2][c + 2] && board[r][c] == board[r + 3][c + 3]){
                    setWin(r,c);
                    return;
                }
                if(r - 3 >= 0 && c + 3 < columns && board[r][c] == board[r - 1][c + 1] && board[r][c] == board[r - 2][c + 2] && board[r][c] == board[r - 3][c + 3]){
                    setWin(r,c);
                    return;
                }
            }
        }
    }
}

function setWin(r,c){
    win = board[r][c];
    (currentPlayer);
    if(!checkingAhead){
        setWinner();
        gameOver = true;
    } else {
        tempOver = true;
    }
}

function setWinner() {
    let text = document.getElementById("winner");
    if (win == "Y") {
        text.innerText = "THE WINNER IS YELLOW";
        text.classList.add('YellowWin');
    } else {
        text.innerText = "THE WINNER IS RED";
        text.classList.add('RedWin');
    }
}


function resetGame() {
    board = [];
    gameOver = false;
    currColumns = [4, 4, 4, 4, 4, 4, 4, 4]
    currentPlayer = playerRed;
    document.getElementById("winner").innerText = "RED IT IS YOUR MOVE";
    if(win == "YELLOW"){
        document.getElementById("winner").classList.remove('YellowWin');
    } else {
        document.getElementById("winner").classList.remove('RedWin');
    }
    win = "";
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            row.push(" ");
            let tile = document.getElementById(r.toString() + "-" + c.toString())
            if (tile.classList.contains("red-piece")) {
                ("red remove");
                tile.classList.remove("red-piece");
            } else if (tile.classList.contains("yellow-piece")) {
                ("yellow remove");
                tile.classList.remove("yellow-piece");
            }
        }
        board.push(row);
    }
};