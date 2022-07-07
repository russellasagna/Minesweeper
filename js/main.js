// change

/*----- constants -----*/


/*----- app's state (variables) -----*/
let boardSize; // size of board, squared in init()
let boardSpace; // for large tile clears
let tileClears; // number of clears set by init()
let tileMines; // number of mines set by init()
let timeStatus; // 0 -> off; 1 -> on;
let timeElapsed; // Number to count seconds in realtime
let gameStatus; // null -> game ready; 'W' -> won; 'L' -> lost
let directions; // Array of directs
let directs; // Object of directions from click position
let space; // size of safe tiles after first click
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
    board.forEach(function (tile) {
        tile.className = "";
        rnd = Math.floor(Math.random() * 100);
        if (rnd < 15) { // #/10 the tile is a mine
            tile.classList.add("bad");
            tileMines++;
        } else {
            tile.classList.add("good");
            tileClears++;
        }
    });
    // after mapping mines, adjust state for first click being safe
    tileClears++;
    tileMines--;
    // insert mines into array using -1
    // insert safe tiles into array using 0

    render();
}

function render() {
    // update tiles' nearby mines using array logic
}

function renderMines() {
    board.forEach(function (tile) {
        if (tile.classList.contains("bad")) {
            tile.className = "mine";
            tileMines--;
        }
    });
}

function renderSpace(evt) {
    const idx = board.indexOf(evt.target);
    space = boardSize / 2;
    // if (idx < boardSize + 1 || idx > board.length - boardSize - 1) {
    //     space = 20;
    // }
    console.log("Safe Tile: " + idx);
    while (space > 0) {
        rnd = Math.floor(Math.random() * space + 1) // for getPerimeter(); 
        pwr = Math.floor(Math.random() * 2 + 1);
        rnd *= Math.pow(-1, pwr);
        getPerimeter(idx + rnd);
        while (directions.length > 0) {
            let direction = directions[Math.floor(Math.random() * directions.length)];
            if (
                direction.classList.contains("good") &&
                !direction.classList.contains("flag")
            ) {
                direction.className = "clear";
                tileClears--;
                console.log("Space Tile: " + board.indexOf(direction));
            }
            // remove the last used direction
            directions.splice(directions.indexOf(direction), 1);
        }
        space--;
    }
}

function getPerimeter(idx) {
    directions = [];
    directs.center = board[idx];
    directs.upup = board[idx - boardSize];
    directs.upLeft = board[idx - boardSize - 1];
    directs.upRight = board[idx - boardSize + 1];
    directs.left = board[idx - 1];
    directs.right = board[idx + 1];
    directs.downDown = board[idx + boardSize];
    directs.downLeft = board[idx + boardSize - 1];
    directs.downRight = board[idx + boardSize + 1];

    // for readability, and unshifts "perimeter" into array
    if (idx > boardSize)
        directions.unshift(
            directs.upup, directs.upLeft, directs.upRight
        );
    if (idx < board.length - boardSize)
        directions.unshift(
            directs.downDown, directs.downLeft, directs.downRight
        );
    directions.unshift(directs.left, directs.right);
    return board.indexOf(directs.center);
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
        getPerimeter(idx);
        renderSpace(evt);
        renderNumbers(evt);
    } else {
        if (
            marks.contains("good") &&
            !marks.contains("flag")
        ) {
            board[idx].className = "clear";
            tileClears--;
            getPerimeter(idx);
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