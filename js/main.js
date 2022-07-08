/*----- constants -----*/


/*----- app's state (variables) -----*/
let boardSize; // size of board, squared in init()
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
document.getElementById("board").addEventListener("mousedown", handleMouseDown);
document.getElementById("board").addEventListener("mouseup", handleMouseUp);
document.getElementById("play").addEventListener("click", init);

/*----- functions -----*/
init();

function init() {
    playBtn.id = "play";
    tileClears = 0;
    tileMines = 0;
    timeStatus = 0;
    timeElapsed = 0;
    gameStatus = null;
    boardSize = 9;
    // map mines below
    board.forEach(function (tile, idx) {
        tile.className = "";
        tile.textContent = "";
        rnd = Math.floor(Math.random() * board.length);
        if (rnd < boardSize) { // chance that the tile is a mine; use boardSize
            tile.classList.add("bad");
            tileMines++;
        } else {
            tile.classList.add("good");
            tileClears++;
        }
    });
    if (tileMines === 0) {
        rnd = Math.floor(Math.random() * board.length);
        board[rnd].className = "bad";
        tileMines++;
        tileClears--;
    }
    render();
}

// updates board every tile click
function render() {
    renderNumbers();
    if (tileMines === 0 || tileClears === 0) {
        gameStatus = "W";
        playBtn.id = "win";
    } else if (gameStatus === "L") {
        playBtn.id = "retry";
        renderMines();
    }
}

// display mines after loss
function renderMines() {
    board.forEach(function (tile) {
        if (tile.classList.contains("bad")) {
            tile.className = "mine";
        }
    });
}

// updates each tile with adjacent mine count
function renderNumbers() {
    // Guards
    if (
        gameStatus === "L"
    ) return;
    for (let i = 0; i < board.length; i++) {
        let count = 0; // accumulates surrounding mines
        if (board[i].classList.contains("clear")) {
            // left
            if (i % boardSize !== 0) {
                if (board[i - 1].classList.contains("bad")) {
                    count++;
                }
            }
            // right
            if ((i + 1) % boardSize !== 0) {
                if (board[i + 1].classList.contains("bad")) {
                    count++;
                }
            }
            if (i > boardSize) {
                // up
                if (board[i - boardSize].classList.contains("bad")) {
                    count++;
                }
                // upleft
                if (board[i - 1 - boardSize].classList.contains("bad") && i % boardSize !== 0) {
                    count++;
                }
                // upright
                if (board[i + 1 - boardSize].classList.contains("bad") && (i + 1) % boardSize !== 0) {
                    count++;
                }
            }
            if (i < board.length - boardSize - 1) {
                // down
                if (board[i + boardSize].classList.contains("bad")) {
                    count++;
                }
                // downleft
                if (board[i - 1 + boardSize].classList.contains("bad") && i % boardSize !== 0) {
                    count++;
                }
                // downright
                if (board[i + 1 + boardSize].classList.contains("bad") && (i + 1) % boardSize !== 0) {
                    count++;
                }
            }
            if (count > 0) {
                board[i].textContent = `${count}`;
                switch (count) {
                    case 1:
                        board[i].classList.add("one");
                        break;
                    case 2:
                        board[i].classList.add("two");
                        break;
                    case 3:
                        board[i].classList.add("three");
                        break;
                    case 4:
                        board[i].classList.add("four");
                        break;
                    case 6:
                        board[i].classList.add("five");
                        break;
                    case 5:
                        board[i].classList.add("six");
                        break;
                    case 7:
                        board[i].classList.add("seven");
                        break;
                    case 8:
                        board[i].classList.add("eight");
                        break;
                }
            }
        }
    }
}

// clear tile using Left-Mouse Button
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
    } else {
        if (
            marks.contains("good") &&
            !marks.contains("flag")
        ) {
            board[idx].className = "clear";
            tileClears--;
        } else if (marks.contains("bad")) {
            board[idx].className = "mine";
            gameStatus = "L";
        }
    }
    render();
}

// place flag using Right-Mouse Button
function handleFlag(evt) {
    evt.preventDefault();
    const idx = board.indexOf(evt.target);
    const marks = board[idx].classList; // for readability
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

// animate smiley
function handleMouseDown(evt) {
    const idx = board.indexOf(evt.target);
    if (
        gameStatus !== null ||
        !board.includes(evt.target)
    ) return;
    if (evt) {
        playBtn.id = "clicked";
    }
}

// animate smiley
function handleMouseUp(evt) {
    const idx = board.indexOf(evt.target);
    if (
        gameStatus !== null ||
        !board.includes(evt.target)
    ) return;
    if (evt) {
        playBtn.id = "play";
    }
}