"use strict";

const modeSelect = document.getElementById("history-mode");
const resetButton = document.getElementById("history-reset");
const status = document.getElementById("history-status");
const detail = document.getElementById("history-detail");
const actions = document.getElementById("history-actions");
const board = document.getElementById("history-board");
const noteTitle = document.getElementById("history-note-title");
const note = document.getElementById("history-note");

let mode = "ur";
let game = null;
let selected = null;

const NOTES = {
  ur: ["Royal Game of Ur", "Common Finkel-style reconstruction from cuneiform evidence: four binary casting objects, seven pieces per side, shared central lane, protected rosette, exact exit."],
  senet: ["Senet reconstruction", "No complete ancient Senet rulebook survives. This is explicitly a compact Kendall-style five-piece reconstruction; historical rule interpretations differ."],
  morris: ["Nine Men's Morris", "Placement, mills, capture, adjacent movement, then flying when a side has three pieces. This graph engine is also reusable for related merels games."],
  konane: ["Kōnane", "Full alternating board, opening removals, then orthogonal jumping captures. Multi-jumps continue in one straight direction and may stop after any capture."]
};

function button(label, onClick, disabled = false) {
  const el = document.createElement("button");
  el.type = "button";
  el.textContent = label;
  el.disabled = disabled;
  el.addEventListener("click", onClick);
  return el;
}

function sideName(side) {
  if (side === "w") return "White";
  if (side === "b") return "Black";
  return String(side);
}

function resetGame() {
  selected = null;
  mode = modeSelect.value;
  if (mode === "ur") game = new window.ChessAtlasHistoricalGames.RoyalGameOfUr({ seed: 1 });
  if (mode === "senet") game = new window.ChessAtlasSenet.SenetKendallGame({ seed: 1 });
  if (mode === "morris") game = new window.ChessAtlasGraphGames.MorrisGame();
  if (mode === "konane") game = new window.ChessAtlasKonane.KonaneGame();
  render();
}

function render() {
  board.replaceChildren();
  actions.replaceChildren();
  const [title, text] = NOTES[mode];
  noteTitle.textContent = title;
  note.textContent = text;
  if (mode === "ur") renderUr();
  if (mode === "senet") renderSenet();
  if (mode === "morris") renderMorris();
  if (mode === "konane") renderKonane();
}

function urMoveLabel(move) {
  const from = move.from === -1 ? "home" : String(move.from + 1);
  const to = move.to === 14 ? "off" : String(move.to + 1);
  return `Piece ${move.pieceIndex + 1}: ${from} → ${to}`;
}

function renderUr() {
  const roll = game.lastRoll;
  status.textContent = game.winner ? `${sideName(game.winner)} wins` : `${sideName(game.turn)} to cast`;
  detail.textContent = roll === null ? "Four binary casting objects · total 0–4" : `Cast ${roll}`;

  if (!game.winner && roll === null) {
    actions.appendChild(button("Cast", () => { game.cast(); render(); }));
  } else if (!game.winner) {
    const legal = game.legalMoves();
    if (legal.length === 0) {
      actions.appendChild(button(`No legal move — pass (${roll})`, () => { game.passIfNoMove(); render(); }));
    } else {
      legal.forEach(move => actions.appendChild(button(urMoveLabel(move), () => { game.move(move.pieceIndex); render(); })));
    }
  }

  const shell = document.createElement("div");
  shell.className = "track";
  for (const side of ["b", "w"]) {
    const row = document.createElement("div");
    row.className = "track-row";
    const pieces = game.pieces.get(side);
    for (let progress = 0; progress < 14; progress++) {
      const cell = document.createElement("div");
      cell.className = "track-cell" + ([3,7,13].includes(progress) ? " rosette" : "");
      const label = document.createElement("small");
      label.textContent = String(progress + 1);
      cell.appendChild(label);
      const count = pieces.filter(value => value === progress).length;
      const stack = document.createElement("span");
      stack.className = `piece-stack side-${side}`;
      stack.textContent = count ? `${side === "w" ? "○" : "●"}${count > 1 ? count : ""}` : "";
      cell.appendChild(stack);
      row.appendChild(cell);
    }
    shell.appendChild(row);
    const meta = document.createElement("p");
    const home = pieces.filter(value => value === -1).length;
    const off = pieces.filter(value => value === 14).length;
    meta.className = "muted";
    meta.textContent = `${sideName(side)} · home ${home} · borne off ${off}/7`;
    shell.appendChild(meta);
  }
  board.appendChild(shell);
}

function renderSenet() {
  const roll = game.lastThrow;
  status.textContent = game.winner ? `${sideName(game.winner)} wins` : `${sideName(game.turn)} to cast`;
  detail.textContent = roll === null ? "Four casting sticks · throws 1–5" : `Throw ${roll}${game.bonusTurn ? " · bonus turn" : ""}`;

  if (!game.winner && roll === null) {
    actions.appendChild(button("Cast sticks", () => { game.cast(); render(); }));
  } else if (!game.winner) {
    const legal = game.legalMoves();
    if (legal.length === 0) {
      actions.appendChild(button(`No legal move — pass (${roll})`, () => { game.passIfNoMove(); render(); }));
    } else {
      legal.forEach(move => {
        const target = move.exit ? "off" : `house ${move.to}`;
        actions.appendChild(button(`Piece ${move.pieceIndex + 1}: ${move.from} → ${target}`, () => { game.move(move.pieceIndex); render(); }));
      });
    }
  }

  const grid = document.createElement("div");
  grid.className = "senet-grid";
  for (let house = 1; house <= 30; house++) {
    const cell = document.createElement("div");
    cell.className = "senet-cell" + (house >= 26 ? " special" : "");
    const n = document.createElement("small");
    n.textContent = house;
    cell.appendChild(n);
    const occupant = game.occupiedAt(house);
    const marker = document.createElement("span");
    marker.textContent = occupant ? (occupant.side === "w" ? "○" : "●") : "";
    cell.appendChild(marker);
    grid.appendChild(cell);
  }
  board.appendChild(grid);
  const counts = document.createElement("p");
  counts.className = "muted";
  const wOff = game.pieces.get("w").filter(piece => piece.position === 31).length;
  const bOff = game.pieces.get("b").filter(piece => piece.position === 31).length;
  counts.textContent = `White off ${wOff}/5 · Black off ${bOff}/5 · Houses 26–30 are the final run in this reconstruction.`;
  board.appendChild(counts);
}

function morrisNodeAt(row, col) {
  const file = String.fromCharCode(97 + col);
  const rank = 7 - row;
  return `${file}${rank}`;
}

function handleMorris(node) {
  if (game.pendingCapture) {
    try { game.capture(node); selected = null; } catch (_) { return; }
    render();
    return;
  }
  const phase = game.phase();
  const occupant = game.board.get(node);
  if (phase === "placement") {
    if (!occupant) { try { game.place(node); } catch (_) { return; } render(); }
    return;
  }
  if (!selected) {
    if (occupant && occupant.side === game.turn) { selected = node; render(); }
    return;
  }
  if (node === selected) { selected = null; render(); return; }
  try { game.move(selected, node); selected = null; render(); } catch (_) {
    if (occupant && occupant.side === game.turn) { selected = node; render(); }
  }
}

function renderMorris() {
  const phase = game.phase();
  status.textContent = `${sideName(game.turn)} · ${game.pendingCapture ? "remove an opponent piece" : phase}`;
  detail.textContent = `Unplaced: White ${game.toPlace.get("w")} · Black ${game.toPlace.get("b")}`;
  const graph = game.board.graph;
  const grid = document.createElement("div");
  grid.className = "morris-board";
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 7; col++) {
      const node = morrisNodeAt(row, col);
      const cell = document.createElement("div");
      if (!graph.nodes.includes(node)) {
        cell.className = "morris-empty";
      } else {
        cell.className = "morris-node" + (selected === node ? " selected" : "");
        const occupant = game.board.get(node);
        cell.appendChild(button(occupant ? (occupant.side === "w" ? "○" : "●") : "·", () => handleMorris(node)));
      }
      grid.appendChild(cell);
    }
  }
  board.appendChild(grid);
}

function key2(coordinate) { return coordinate.join(","); }

function konaneLegalTargets() {
  if (!selected || game.phase !== "play") return [];
  return game.jumpsFrom(selected).map(move => move.to);
}

function handleKonane(coordinate) {
  if (game.winner) return;
  if (game.phase === "black-removal" || game.phase === "white-removal") {
    try { game.removeOpening(coordinate); } catch (_) { return; }
    render();
    return;
  }
  const occupant = game.get(coordinate);
  if (!selected) {
    if (occupant === game.turn && game.jumpsFrom(coordinate).length) { selected = coordinate; render(); }
    return;
  }
  const target = konaneLegalTargets().some(to => key2(to) === key2(coordinate));
  if (target) {
    game.move(selected, coordinate); selected = null; render(); return;
  }
  if (occupant === game.turn && game.jumpsFrom(coordinate).length) selected = coordinate;
  else selected = null;
  render();
}

function renderKonane() {
  status.textContent = game.winner ? `${sideName(game.winner)} wins` : `${sideName(game.turn)} · ${game.phase}`;
  if (game.phase === "black-removal") detail.textContent = "Black removes a black corner or centre stone.";
  else if (game.phase === "white-removal") detail.textContent = "White removes an orthogonally adjacent white stone.";
  else detail.textContent = "Orthogonal captures only · select a stone with a legal jump.";

  const openingChoices = game.phase === "black-removal" ? game.blackOpeningChoices() : game.phase === "white-removal" ? game.whiteOpeningChoices() : [];
  const targets = konaneLegalTargets();
  const grid = document.createElement("div");
  grid.className = "konane-grid";
  for (let row = 0; row < game.rows; row++) {
    for (let col = 0; col < game.cols; col++) {
      const coordinate = [row, col];
      const cell = document.createElement("div");
      cell.className = "konane-cell";
      if (selected && key2(selected) === key2(coordinate)) cell.classList.add("selected");
      if (openingChoices.some(choice => key2(choice) === key2(coordinate)) || targets.some(to => key2(to) === key2(coordinate))) cell.classList.add("legal");
      const value = game.get(coordinate);
      cell.appendChild(button(value === "w" ? "○" : value === "b" ? "●" : "", () => handleKonane(coordinate)));
      grid.appendChild(cell);
    }
  }
  board.appendChild(grid);
}

modeSelect.addEventListener("change", resetGame);
resetButton.addEventListener("click", resetGame);
resetGame();
