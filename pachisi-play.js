"use strict";

const api = window.ChessAtlasPachisi;
const actions = document.getElementById("pachisi-actions");
const board = document.getElementById("pachisi-board");
const status = document.getElementById("pachisi-status");
const detail = document.getElementById("pachisi-detail");
const reset = document.getElementById("pachisi-reset");

let game = null;

function actionButton(label, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}

function marker(color) {
  return {
    yellow: "🟡",
    red: "🔴",
    black: "⚫",
    green: "🟢"
  }[color];
}

function boardPosition(cellId) {
  if (cellId === "charkoni") return { row: 9, column: 9 };
  const [arm, column, distanceText] = cellId.split(":");
  const distance = Number(distanceText);

  if (arm === "north") {
    return { row: 9 - distance, column: { L: 8, M: 9, R: 10 }[column] };
  }
  if (arm === "south") {
    return { row: 9 + distance, column: { L: 10, M: 9, R: 8 }[column] };
  }
  if (arm === "east") {
    return { row: { L: 8, M: 9, R: 10 }[column], column: 9 + distance };
  }
  return { row: { L: 10, M: 9, R: 8 }[column], column: 9 - distance };
}

function renderCell(cellId) {
  const cell = document.createElement("div");
  const position = boardPosition(cellId);
  cell.className = "pachisi-cell";
  cell.style.gridRow = position.row;
  cell.style.gridColumn = position.column;

  if (api.CASTLES.has(cellId)) cell.classList.add("castle");

  const stack = document.createElement("span");
  stack.className = "pachisi-piece-stack";
  for (const piece of game.occupantsAt(cellId)) {
    const span = document.createElement("span");
    span.className = "pachisi-piece";
    span.textContent = marker(piece.color);
    span.title = `${piece.color} ${piece.index + 1}`;
    stack.appendChild(span);
  }
  cell.appendChild(stack);
  board.appendChild(cell);
}

function renderBoard() {
  board.replaceChildren();

  const allCells = new Set(api.OUTER_CYCLE);
  for (const arm of api.ARMS) {
    for (const column of ["L", "M", "R"]) {
      for (let distance = 1; distance <= 8; distance += 1) {
        allCells.add(`${arm}:${column}:${distance}`);
      }
    }
  }

  for (const cellId of allCells) renderCell(cellId);

  const center = document.createElement("div");
  center.className = "pachisi-cell center";
  center.textContent = "Charkoni";
  board.appendChild(center);

  const summary = document.createElement("div");
  summary.className = "pachisi-summary";
  summary.style.gridColumn = "1 / -1";
  for (const color of api.COLORS) {
    const pieces = game.piecesFor(color);
    const waiting = pieces.filter(piece => piece.progress === -1).length;
    const finished = pieces.filter(piece => piece.progress === 84).length;
    const item = document.createElement("div");
    item.textContent = `${marker(color)} ${color} · Charkoni ${waiting} · finished ${finished}/4`;
    summary.appendChild(item);
  }
  board.appendChild(summary);
}

function moveLabel(move) {
  const from = move.from === -1 ? "Charkoni" : `step ${move.from}`;
  const to = move.to === 84 ? "home" : `step ${move.to}`;
  return `${marker(move.color)} Piece ${move.pieceIndex + 1}: ${from} → ${to}`;
}

function renderActions() {
  actions.replaceChildren();
  if (game.winner) return;

  if (game.lastThrow === null) {
    actions.appendChild(actionButton("Cast 6 cowries", () => {
      game.cast();
      render();
    }));
    return;
  }

  const legal = game.legalMoves();
  for (const move of legal) {
    actions.appendChild(actionButton(moveLabel(move), () => {
      game.move(move.pieceIndex);
      render();
    }));
  }

  actions.appendChild(actionButton("Pass", () => {
    game.pass();
    render();
  }));
}

function render() {
  if (game.winner) {
    status.textContent = `${game.winner} partnership wins`;
    detail.textContent = "All eight team pieces have returned to the Charkoni.";
  } else {
    status.textContent = `${marker(game.turn)} ${game.turn} to play`;
    detail.textContent = game.lastThrow === null
      ? "Cast six cowries"
      : `${game.lastMouthsUp} mouths up → ${game.lastThrow}${api.isGrace(game.lastThrow) ? " · grace" : ""}`;
  }
  renderActions();
  renderBoard();
}

function resetGame() {
  game = new api.PachisiGame({ seed: 2600 });
  render();
}

reset.addEventListener("click", resetGame);
resetGame();
