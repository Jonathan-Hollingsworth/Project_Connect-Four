/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  for(let y = 0; y < HEIGHT; y ++){
    board.push([])
    for(let x = 0; x < WIDTH; x ++){
      board[y].push(null)
    }
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  const htmlBoard = document.querySelector('#board')

  //Creating the topmost row where the peices drop from
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  //Creating the board 
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  for (let y = board.length -1; y >= 0; y--) { //check from the bottom and go up
    if (board[y][x] === null){ //if this spot is empty
      return y
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  const newPiece = document.createElement("div")
  newPiece.classList.add('piece')
  newPiece.classList.add(`player${currPlayer}`)
  const pieceZone = document.getElementById(`${y}-${x}`)
  pieceZone.append(newPiece)
}

/** endGame: announce game end */

function endGame(msg) {
  alert(msg)
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  placeInTable(y, x);
  board[y][x] = currPlayer

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  if(board.every((row) => {
    return !row.includes(null)
  })){return endGame('The board is full and neither player won.')}

  // switch players
  currPlayer === 1 ? currPlayer ++ : currPlayer --
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  for (let y = 0; y < HEIGHT; y++) { //Checking each row
    for (let x = 0; x < WIDTH; x++) { //Checking each cell of the row
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]]; //checking horizontal
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]]; //checking vertical
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]]; //checking diagonally to the right
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]]; //checking diagonally to the left

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) { //if any variant of [_win] returns true
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
