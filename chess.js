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

function isWhite(piece) {
  return "♙♖♘♗♕♔".includes(piece);
}

function isBlack(piece) {
  return "♟♜♞♝♛♚".includes(piece);
}

function createBoard() {
  boardElement.innerHTML = "";

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = document.createElement("button");

      square.type = "button";
      square.id = `square-${row}-${col}`;
      square.dataset.row = row;
      square.dataset.col = col;

      square.classList.add("square");
      square.classList.add(
        (row + col) % 2 === 0 ? "light" : "dark"
      );

      boardElement.appendChild(square);
    }
  }
}

function drawBoard() {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square =
        document.getElementById(`square-${row}-${col}`);

      square.textContent = board[row][col];

      square.classList.toggle(
        "selected",
        Boolean(
          selected &&
          selected.row === row &&
          selected.col === col
        )
      );
    }
  }
}

function resetGame() {
  board = startingPosition.map(row => [...row]);
  selected = null;
  turn = "White";

  statusElement.textContent = "White to move";
  drawBoard();
}

function handleSquare(row, col) {
  const piece = board[row][col];

  if (!selected) {
    if (!piece) return;

    if (turn === "White" && !isWhite(piece)) return;
    if (turn === "Black" && !isBlack(piece)) return;

    selected = { row, col };

    statusElement.textContent =
      `Selected ${piece} at ${row},${col}`;

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

boardElement.addEventListener("pointerdown", event => {
  const square = event.target.closest(".square");

  if (!square || !boardElement.contains(square)) return;

  event.preventDefault();

  const row = Number(square.dataset.row);
  const col = Number(square.dataset.col);

  handleSquare(row, col);
});

resetButton.addEventListener("click", resetGame);

createBoard();
resetGame();