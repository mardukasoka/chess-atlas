const boardElement = document.getElementById("board");
const statusElement = document.getElementById("status");
const resetButton = document.getElementById("reset");

const startingPosition = [
  ["♜","♞","♝","♛","♚","♝","♞","♜"],
  ["♟","♟","♟","♟","♟","♟","♟","♟"],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["♙","♙","♙","♙","♙","♙","♙","♙"],
  ["♖","♘","♗","♕","♔","♗","♘","♖"]
];

let board = [];
let selected = null;
let turn = "White";

function resetGame() {
  board = startingPosition.map(row => [...row]);
  selected = null;
  turn = "White";
  statusElement.textContent = "White to move";
  drawBoard();
}

function isWhite(piece) {
  return "♙♖♘♗♕♔".includes(piece);
}

function isBlack(piece) {
  return "♟♜♞♝♛♚".includes(piece);
}

function drawBoard() {
  boardElement.innerHTML = "";

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = document.createElement("div");

      square.classList.add("square");
      square.classList.add(
        (row + col) % 2 === 0 ? "light" : "dark"
      );

      if (
        selected &&
        selected.row === row &&
        selected.col === col
      ) {
        square.classList.add("selected");
      }

      square.textContent = board[row][col];

      square.addEventListener("click", () => {
        handleSquare(row, col);
      });

      boardElement.appendChild(square);
    }
  }
}

function handleSquare(row, col) {
  const piece = board[row][col];

  if (!selected) {
    if (!piece) return;

    if (turn === "White" && !isWhite(piece)) return;
    if (turn === "Black" && !isBlack(piece)) return;

    selected = { row, col };
    drawBoard();
    return;
  }

  const selectedPiece =
    board[selected.row][selected.col];

  if (
    (turn === "White" && isWhite(piece)) ||
    (turn === "Black" && isBlack(piece))
  ) {
    selected = { row, col };
    drawBoard();
    return;
  }

  board[row][col] = selectedPiece;
  board[selected.row][selected.col] = "";

  selected = null;

  turn = turn === "White" ? "Black" : "White";
  statusElement.textContent = `${turn} to move`;

  drawBoard();
}

resetButton.addEventListener("click", resetGame);

resetGame();