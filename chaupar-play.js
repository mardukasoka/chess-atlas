"use strict";

const api = window.ChessAtlasChaupar;
const pachisi = window.ChessAtlasPachisi;
const actions = document.getElementById("chaupar-actions");
const board = document.getElementById("chaupar-board");
const status = document.getElementById("chaupar-status");
const detail = document.getElementById("chaupar-detail");
const reset = document.getElementById("chaupar-reset");

let game = null;

function actionButton(label, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}

function marker(color) {
  return { yellow: "🟡", red: "🔴", black: "⚫", green: "🟢" }[color];
}

function boardPosition(cellId) {
  if (cellId === "charkoni") return { row: 9, column: 9 };
  const [arm, column, distanceText] = cellId.split(":");
  const distance = Number(distanceText);
  if (arm === "north") return { row: 9 - distance, column: { L: 8, M: 9, R: 10 }[column] };
  if (arm === "south") return { row: 9 + distance, column: { L: 10, M: 9, R: 8 }[column] };
  if (arm === "east") return { row: { L: 8, M: 9, R: 10 }[column], column: 9 + distance };
  return { row: { L: 10, M: 9, R: 8 }[column], column: 9 - distance };
}

function occupantsAt(cellId) {
  const occupants = [];
  for (const color of pachisi.COLORS) {
    for (const piece of game.piecesFor(color)) {
      if (piece.progress >= 0 && piece.progress < 84 && game.boardCell(piece) === cellId) occupants.push(piece);
    }
  }
  return occupants;
}

function renderCell(cellId) {
  const cell = document.createElement("div");
  const position = boardPosition(cellId);
  cell.className = "pachisi-cell";
  cell.style.gridRow = position.row;
  cell.style.gridColumn = position.column;

  const stack = document.createElement("span");
  stack.className = "pachisi-piece-stack";
  for (const piece of occupantsAt(cellId)) {
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
  const cells = new Set(pachisi.OUTER_CYCLE);
  for (const arm of pachisi.ARMS) {
    for (const column of ["L", "M", "R"]) {
      for (let distance = 1; distance <= 8; distance += 1) cells.add(`${arm}:${column}:${distance}`);
    }
  }
  for (const cellId of cells) renderCell(cellId);

  const center = document.createElement("div");
  center.className = "pachisi-cell center";
  center.textContent = "Charkoni";
  board.appendChild(center);

  const summary = document.createElement("div");
  summary.className = "pachisi-summary";
  summary.style.gridColumn = "1 / -1";
  for (const color of pachisi.COLORS) {
    const pieces = game.piecesFor(color);
    const captured = pieces.filter(piece => piece.progress < 0).length;
    const finished = pieces.filter(piece => piece.progress === 84).length;
    const item = document.createElement("div");
    item.textContent = `${marker(color)} ${color} · Charkoni ${captured} · finished ${finished}/4`;
    summary.appendChild(item);
  }
  board.appendChild(summary);
}

function moveLabel(move) {
  const from = move.from < 0 ? "Charkoni" : `step ${move.from}`;
  const to = move.to === 84 ? "home" : `step ${move.to}`;
  const dice = move.diceIndices.map(index => game.dice[index]).join("+");
  const group = move.groupSize > 1 ? ` group ×${move.groupSize}` : "";
  return `${marker(move.color)} Piece ${move.pieceIndex + 1}${group}: ${from} → ${to} · ${dice}`;
}

function renderActions() {
  actions.replaceChildren();
  if (game.winner) return;

  if (!game.dice.length) {
    actions.appendChild(actionButton("Throw 3 long dice", () => {
      game.throwDice();
      render();
    }));
    return;
  }

  const legal = game.legalMoves();
  for (const move of legal) {
    actions.appendChild(actionButton(moveLabel(move), () => {
      game.move(move.pieceIndex, move.diceIndices);
      render();
    }));
  }

  if (!legal.length) {
    actions.appendChild(actionButton("Pass", () => {
      game.pass();
      render();
    }));
  }
}

function render() {
  if (game.winner) {
    status.textContent = `${game.winner} partnership wins`;
    detail.textContent = "Both partner colours have finished in the required order.";
  } else {
    status.textContent = `${marker(game.turn)} ${game.turn} to play`;
    detail.textContent = game.dice.length
      ? `Remaining dice: ${game.dice.join(" · ")}`
      : "Throw three long dice";
  }
  renderActions();
  renderBoard();
}

function resetGame() {
  game = new api.ChauparGame({ seed: 1500 });
  render();
}

reset.addEventListener("click", resetGame);
resetGame();
