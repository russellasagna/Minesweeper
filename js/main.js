/*----- constants -----*/



/*----- app's state (variables) -----*/
let board; // n x n board
let timeStatus; // 0 -> off; 1 -> on;
let timeElapsed; // Number to count seconds in realtime
let gameStatus; // null -> game ready; 'W' -> won; 'L' -> lost

/*----- cached element references -----*/



/*----- event listeners -----*/



/*----- functions -----*/

function init() {
    board = 9;
    timeStatus = 0;
    timeElapsed = 0;
    gameStatus = 0;
}