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
    board.forEach(function(tile) {
        tile.className = "";
        let chance = Math.floor(Math.random() * 100);
        if (chance < 15) { // #/10 the tile is a mine
            tile.textContent = "-1";
            tileMines++;
        } else {
            tile.textContent = "0";
            tileClears++;
        }
    });
    console.log("[RISK] Total clears: " + tileClears);
    console.log("[RISK] Total mines: " + tileMines);
    console.warn("Adjusting state for first click being safe...");
    // after mapping mines, adjust state for first click being safe
    tileClears++;
    tileMines--;
    console.log("[SAFE] Total clears: " + tileClears);
    console.log("[SAFE] Total mines: " + tileMines);
    console.log(board);
    boardMap = [];
    for (let i = 0; i < boardSize; i++) {
        const arr = [];
        for (let j = 0; j < boardSize; j++) {
            arr.push(board[i * j - 1]);
            // console.log(arr);
        }
        boardMap.push(arr);
    }
    console.log(boardMap);
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
        board[idx].textContent = "";
        board[idx].className = "clear";
        tileClears--;
    } else {
        switch (board[idx].textContent) {
            case "0": 
                board[idx].textContent = "";
                board[idx].className = "clear";
                tileClears--;
                break;
            case "-1": 
                board[idx].textContent = "";
                board[idx].className = "mine";
                playBtn.textContent = "):";
                playBtn.id = "retry";
                gameStatus = "L";
                break;
        }
    }
    render();
}