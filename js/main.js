/*----- constants -----*/



/*----- app's state (variables) -----*/
let board; // one-dimensional array, for spread syntax
let boardMap; // two-dimensional array
let boardSize; // size of board, squared in init()
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
    board = [...document.querySelectorAll("#board > div")];
    board.forEach(function(tile) {
        tile.className = "";
        let chance = Math.floor(Math.random() * 10);
        if (chance < 4) {
            tile.setAttribute("name", -1);
        } else {
            tile.setAttribute("name", 0);
        }
    });
    // insert mines into array using -1
    // insert safe tiles into array using 0
    timeStatus = 0;
    timeElapsed = 0;
    gameStatus = null;
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
    const idx = tileEls.indexOf(evt.target);
    console.log(board[idx]);
    switch (board[idx].getAttribute("name")) {
        case "0": 
            board[idx].className = "clear"; 
            break;
        case "-1": 
            board[idx].className = "mine";
            gameStatus = "L";
            break;
    }
}