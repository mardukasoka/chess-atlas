"use strict";

(function () {
  const api = globalThis.ChessAtlasLatrunculi;
  if (!api) throw new Error("Latrunculi engine not loaded");

  const boardEl = document.getElementById("latrunculi-board");
  const statusEl = document.getElementById("latrunculi-status");
  const resetEl = document.getElementById("latrunculi-reset");
  const MARKER = { black: "●", white: "○" };

  let game;
  let selected = null;

  function sameCell(a, b) {
    return a && b && a[0] === b[0] && a[1] === b[1];
  }

  function currentMoves() {
    return game.phase === "movement" ? game.legalMoves() : [];
  }

  function renderStatus() {
    if (game.winner) {
      statusEl.textContent = `${game.winner} wins — the opponent has been reduced to one piece.`;
      return;
    }

    if (game.phase === "placement") {
      statusEl.textContent = `Placement — ${game.turn} to place (${game.placed.black}/${game.piecesPerPlayer} black, ${game.placed.white}/${game.piecesPerPlayer} white).`;
      return;
    }

    const capturable = game.capturable();
    if (capturable.length) {
      statusEl.textContent = `${game.turn} to act — ${capturable.length} enclosed piece${capturable.length === 1 ? "" : "s"} can be captured, or choose a legal move.`;
      return;
    }

    statusEl.textContent = `${game.turn} to move. Select a piece, then a highlighted destination.`;
  }

  function render() {
    boardEl.replaceChildren();
    const moves = currentMoves();
    const selectedMoves = selected ? moves.filter(move => sameCell(move.from, selected)) : [];
    const capturable = game.capturable();

    for (let row = 0; row < game.rows; row += 1) {
      for (let col = 0; col < game.cols; col += 1) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "latrunculi-cell";
        const occupant = game.at(row, col);
        button.textContent = occupant ? MARKER[occupant] : "";
        button.setAttribute("aria-label", `${String.fromCharCode(65 + col)}${row + 1}${occupant ? ` ${occupant}` : " empty"}`);

        if (selected && selected[0] === row && selected[1] === col) button.classList.add("selected");
        if (game.isTrapped(row, col)) button.classList.add("trapped");
        if (selectedMoves.some(move => sameCell(move.to, [row, col]))) button.dataset.destination = "true";
        if (capturable.some(cell => sameCell(cell, [row, col]))) button.dataset.capturable = "true";

        button.addEventListener("click", () => handleCell(row, col));
        boardEl.appendChild(button);
      }
    }

    renderStatus();
  }

  function handleCell(row, col) {
    if (game.winner) return;

    if (game.phase === "placement") {
      if (!game.at(row, col)) {
        game.place(row, col);
        selected = null;
        render();
      }
      return;
    }

    if (game.capturable().some(([r, c]) => r === row && c === col)) {
      game.capture(row, col);
      selected = null;
      render();
      return;
    }

    const occupant = game.at(row, col);
    if (occupant === game.turn && !game.isTrapped(row, col)) {
      selected = [row, col];
      render();
      return;
    }

    if (!selected) return;
    const move = game.legalMoves().find(candidate => sameCell(candidate.from, selected) && sameCell(candidate.to, [row, col]));
    if (!move) return;

    game.move(selected[0], selected[1], row, col, move.path || null);
    selected = null;
    render();
  }

  function reset() {
    game = new api.Schadler1994Game();
    selected = null;
    render();
  }

  resetEl.addEventListener("click", reset);
  reset();
})();
