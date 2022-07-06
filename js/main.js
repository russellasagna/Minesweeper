/*----- constants -----*/


/*----- app's state (variables) -----*/
let board; // one-dimensional array, for spread syntax
let boardMap; // two-dimensional array
let boardSize; // size of board, squared in init()
let tileClears; // number of clears set by init()
let tileMines; // number of mines set by init()
let timeStatus; // 0 -> off; 1 -> on;
let timeElapsed; // Number to count seconds in realtime
let gameStatus; // null -> game ready; 'W' -> won; 'L' -> lostlet upup = board[idx - boardSize];
let directions; // Array of directs
let directs; // Object of directions from click position
let space; // size of safe tiles after first click
let rnd; // number randomizer

/*----- cached element references -----*/
const tileEls = [...document.querySelectorAll("#board > div")]; // spread
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
    board = [...document.querySelectorAll("#board > div")];
    // map mines below
    board.forEach(function (tile) {
        tile.className = "";
        let chance = Math.floor(Math.random() * 100);
        if (chance < 15) { // #/10 the tile is a mine
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
    // update tiles nearby mines using array logic
    renderMines();
}

function renderMines() {
    // Guards

}

function renderSpace(evt) {
    const idx = tileEls.indexOf(evt.target);
    let space = boardSize / 2;
    while (space > 0) {
        let rnd = Math.floor(Math.random() * 10 + 1) // for getPerimeter(); 
        let pwr = Math.floor(Math.random() * 2 + 1);
        rnd *= Math.pow(-1, pwr);
        getPerimeter(idx + rnd);
        while (directions.length > 0) {
            let direction = directions[Math.floor(Math.random() * directions.length)];
            console.log("Safe Tile: " + idx);
            if (direction.classList.contains("good")) {
                direction.className = "clear";
                console.log("Space Tile: " + board.indexOf(direction));
            }
            directions.splice(directions.indexOf(direction), 1);
        }
        space--;
    }
    console.log(rnd);
    console.log(pwr);
}

function getPerimeter(idx) {
    directs.upup = board[idx - boardSize];
    directs.upLeft = board[idx - boardSize - 1];
    directs.upRight = board[idx - boardSize + 1];
    directs.left = board[idx - 1];
    directs.right = board[idx + 1];
    directs.downDown = board[idx + boardSize];
    directs.downLeft = board[idx + boardSize - 1];
    directs.downRight = board[idx + boardSize + 1];
    directions.unshift(
        directs.upup, directs.upLeft, directs.upRight,
        directs.left, directs.right,
        directs.downDown, directs.downLeft, directs.downRight
    );
}

function handleClick(evt) {
    const idx = tileEls.indexOf(evt.target);
    const marks = board[idx].classList;
    // Guards
    if (
        gameStatus !== null ||
        !tileEls.includes(evt.target) ||
        marks.contains("flag")
    ) return;
    // update tile when clicked
    if (tileClears + tileMines === Math.pow(boardSize, 2)) { // first tile is safe
        board[idx].className = "clear";
        tileClears--;
        getPerimeter(idx);
        renderSpace(evt);
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
        }
    }
    render();
}

function handleFlag(evt) {
    evt.preventDefault();
    const idx = tileEls.indexOf(evt.target);
    const marks = board[idx].classList;
    if (
        gameStatus !== null ||
        !tileEls.includes(evt.target) ||
        marks.contains("clear")
    ) return;
    if (!marks.contains("flag")) {
        marks.add("flag");
    } else {
        marks.remove("flag");
    }
    render();
}