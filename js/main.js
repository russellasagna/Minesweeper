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
document.getElementById("board").addEventListener("mousedown", handleMouseDown);
document.getElementById("board").addEventListener("mouseup", handleMouseUp);
document.getElementById("play").addEventListener("click", init);

/*----- functions -----*/
init();

function init() {
    console.clear();
    playBtn.textContent = "";
    playBtn.id = "play";
    tileClears = 0;
    tileMines = 0;
    timeStatus = 0;
    timeElapsed = 0;
    gameStatus = null;
    boardSize = 9;
    boardSpace = [];
    // map mines below
    board.forEach(function (tile, idx) {
        tile.className = "";
        tile.textContent = "";
        rnd = Math.floor(Math.random() * board.length);
        if (rnd < boardSize) { // chance that the tile is a mine; use boardSize
            tile.classList.add("bad");
            tileMines++;
            console.warn(`MINE (idx = ${idx})`);
        } else {
            tile.classList.add("good");
            tileClears++;
        }
    });
    if (tileMines === 0) {
        console.error("No chance! Adding a mine:");
        rnd = Math.floor(Math.random() * board.length);
        board[rnd].className = "bad";
        tileMines++;
        tileClears--;
        console.warn(`MINE (idx = ${rnd})`);
    }
    console.log("Mines: " + tileMines);
    console.log("Clears " + tileClears);
    render();
}

function render() {
    if (tileMines === 0 || tileClears === 0) {
        gameStatus = "W";
        playBtn.id = "win";
        playBtn.textContent = "";
        console.error("You win!");
    } else if (gameStatus === "L") {
        playBtn.id = "retry";
        playBtn.textContent = "";
        console.error("You lose!");
    }
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
    console.warn("Warning:");
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
                if (board[i - 1 - boardSize].classList.contains("bad") && i % boardSize !== 0) {
                    count++;
                    console.log("bad upleft");
                }
                // upright
                if (board[i + 1 - boardSize].classList.contains("bad") && (i + 1) % boardSize !== 0) {
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
                if (board[i - 1 + boardSize].classList.contains("bad") && i % boardSize !== 0) {
                    count++;
                    console.log("bad downleft");
                }
                // downright
                if (board[i + 1 + boardSize].classList.contains("bad") && (i + 1) % boardSize !== 0) {
                    count++;
                    console.log("bad downright");
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
            gameStatus = "L";
            renderMines();
        }
    }
    renderNumbers();
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