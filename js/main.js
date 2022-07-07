/*----- constants -----*/


/*----- app's state (variables) -----*/
let boardSize; // size of board, squared in init()
let boardSpace; // for large tile clears
let tileClears; // number of clears set by init()
let tileMines; // number of mines set by init()
let timeStatus; // 0 -> off; 1 -> on;
let timeElapsed; // Number to count seconds in realtime
let gameStatus; // null -> game ready; 'W' -> won; 'L' -> lost
let rnd; // number randomizer

/*----- cached element references -----*/
const board = [...document.querySelectorAll("#board > div")]; // spread
const playBtn = document.getElementById("play");

/*----- event listeners -----*/
document.getElementById("board").addEventListener("click", handleClick);
document.getElementById("board").addEventListener("contextmenu", handleFlag);
document.getElementById("play").addEventListener("click", init);

/*----- functions -----*/
init();

function init() {
    console.clear();
    playBtn.textContent = ":)";
    playBtn.id = "play";
    tileClears = 0;
    tileMines = 0;
    timeStatus = 0;
    timeElapsed = 0;
    gameStatus = null;
    directions = [];
    directs = {};
    boardSize = 9;
    boardSpace = [];
    // board = [...document.querySelectorAll("#board > div")];
    // map mines below
    board.forEach(function (tile, idx) {
        tile.className = "";
        tile.textContent = "";
        rnd = Math.floor(Math.random() * 100);
        if (rnd < 100) { // #/10 the tile is a mine
            tile.classList.add("bad");
            tileMines++;
            console.warn(`MINE (idx = ${idx})`);
        } else {
            tile.classList.add("good");
            tileClears++;
        }
    });
    console.log("Mines: " + tileMines);
    console.log("Clears " + tileClears);
    render();
}

function render() {
    renderNumbers();
}

function renderMines() {
    board.forEach(function (tile) {
        if (tile.classList.contains("bad")) {
            tile.className = "mine";
        }
    });
}

function renderNumbers() {
    // Guards
    if (
        gameStatus === "L"
    ) return;
    for (let i = 0; i < board.length; i++) {
        let count = 0;
        if (board[i].classList.contains("clear")) {
            // left
            if (i % boardSize !== 0) {
                if (board[i - 1].classList.contains("bad")) {
                    count++;
                    console.log("bad left");
                }
            }
            // right
            if ((i + 1) % boardSize !== 0) {
                if (board[i + 1].classList.contains("bad")) {
                    count++;
                    console.log("bad right");
                }
            }
            if (i > boardSize) {
                // up
                if (board[i - boardSize].classList.contains("bad")) {
                    count++;
                    console.log("bad up");
                }
                // upleft
                if (board[i - 1 - boardSize].classList.contains("bad")) {
                    count++;
                    console.log("bad upleft");
                }
                // upright
                if (board[i + 1 - boardSize].classList.contains("bad")) {
                    count++;
                    console.log("bad upright");
                }
            }
            if (i < board.length - boardSize - 1) {
                // down
                if (board[i + boardSize].classList.contains("bad")) {
                    count++;
                    console.log("bad down");
                }
                // downleft
                if (board[i - 1 + boardSize].classList.contains("bad")) {
                    count++;
                    console.log("bad downleft");
                }
                // downright
                if (board[i + 1 + boardSize].classList.contains("bad")) {
                    count++;
                    console.log("bad downright");
                }
            }
            board[i].textContent = `${count}`;
        }
    }
}

function handleClick(evt) {
    const idx = board.indexOf(evt.target);
    const marks = board[idx].classList; // for readability
    // Guards
    if (
        gameStatus !== null ||
        !board.includes(evt.target) ||
        marks.contains("flag") ||
        marks.contains("clear")
    ) return;
    // update tile when clicked
    if (tileClears + tileMines === Math.pow(boardSize, 2)) { // first tile is safe
        board[idx].className = "clear";
        tileClears--;
        console.log(idx);
        // experimental: 
        // add getPerimeter() here; commit d8db3c5 and earlier
        // add renderSpace(evt) here; Commit d8db3c5 and earlier
    } else {
        if (
            marks.contains("good") &&
            !marks.contains("flag")
        ) {
            board[idx].className = "clear";
            tileClears--;
            console.log(idx);
        } else if (marks.contains("bad")) {
            board[idx].className = "mine";
            playBtn.textContent = "):";
            playBtn.id = "retry";
            gameStatus = "L";
            renderMines();
        }
    }
    render();
}

function handleFlag(evt) {
    evt.preventDefault();
    const idx = board.indexOf(evt.target);
    const marks = board[idx].classList;
    // Guards
    if (
        gameStatus !== null ||
        !board.includes(evt.target) ||
        marks.contains("clear")
    ) return;
    if (!marks.contains("flag")) {
        marks.add("flag");
    } else {
        marks.remove("flag");
    }
    render();
}