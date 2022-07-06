/*----- constants -----*/


/*----- app's state (variables) -----*/
let board; // one-dimensional array, for spread syntax
let boardMap; // two-dimensional array
let boardSize; // size of board, squared in init()
let tileClears; // number of clears set by init()
let tileMines; // number of mines set by init()
let timeStatus; // 0 -> off; 1 -> on;
let timeElapsed; // Number to count seconds in realtime
let gameStatus; // null -> game ready; 'W' -> won; 'L' -> lost

/*----- cached element references -----*/
const tileEls = [...document.querySelectorAll("#board > div")]; // spread
const playBtn = document.getElementById("play");


/*----- event listeners -----*/
document.getElementById("board").addEventListener("click", handleClick);
document.getElementById("play").addEventListener("click", init);

/*----- functions -----*/
init();

function init() {
    playBtn.textContent = ":)";
    playBtn.id = "play";
    tileClears = 0;
    tileMines = 0;
    timeStatus = 0;
    timeElapsed = 0;
    gameStatus = null;
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
}

function handleClick(evt) {
    // Guards
    if (
        gameStatus !== null ||
        !tileEls.includes(evt.target)
    ) return;

    // update tile when clicked
    const idx = tileEls.indexOf(evt.target);
    if (tileClears + tileMines === Math.pow(boardSize, 2)) { // first tile is safe
        board[idx].className = "clear";
        tileClears--;
    } else {
        if (board[idx].classList.contains("good")) {
            board[idx].className = "clear";
            tileClears--;
        } else if (board[idx].classList.contains("bad")) {
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
}