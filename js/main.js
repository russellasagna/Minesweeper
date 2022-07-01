// Minesweeper
/*----- constants -----*/
// No constants?
// Time elapse, tiles, and grid size should change.

/*----- app's state (variables) -----*/
let board; // n x n board array
let boardWin; // winner n x n board array
let badTiles; // Array to hold bad tiles
let goodTiles; // Array to hold good tiles
let timeElapsed; // Number to count seconds in realtime
let gameStatus; // null -> game in progress; 'W' -> won; 'L' -> lost

/*----- cached element references -----*/
// const tileBtns = Array.from(document.querySelectorAll('article > button')); // One way to iterate
// const tileBtns = [...document.querySelectorAll('div > button')]; // Another way to iterate
// const happyFace = document.querySelector('button'); // Windows 98 play button

/*----- event listeners -----*/
// Add event listeners to board array of tiles
// Add an event listener for the play button using init()

/*----- functions -----*/
init();

function init() {
// initialize board
// initialize gameStatus
// initialize timer
}

function render() {
// render the board
    // render menu for board length/width
    // begin render after menu options are set
    // render the good and bad tiles
        // use DOM manipulation to insert <button>'s based on nxn
// render the timer
    // add realtime seconds to timeElapsed
}

function handleTiles(evt) {
    // Guards
    if (
        false
    ) return;
    // when a tile is primary mouse-clicked, update adjacent tiles
    // when a tile is secondary mouse-clicked, toggle flags/question mark
}

function endGame() {
    // end game once board has all good tiles
    // end game once board has ONE bad tile
    // update and output gameStatus as win or lose
}