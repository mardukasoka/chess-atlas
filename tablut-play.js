"use strict";

(function () {
  const { TablutGame, THRONE } = window.ChessAtlasTablut;
  const boardEl = document.getElementById("tablut-board");
  const statusEl = document.getElementById("tablut-status");
  const detailEl = document.getElementById("tablut-detail");
  const resetEl = document.getElementById("tablut-reset");
  let game = new TablutGame();
  let selected = null;

  const same = (a, b) => a && b && a[0] === b[0] && a[1] === b[1];
  const side = piece => piece === "attacker" ? "attackers" : (piece === "defender" || piece === "king" ? "defenders" : null);

  function pieceElement(piece) {
    if (!piece) return null;
    const token = document.createElement("span");
    token.className = `tablut-piece ${piece}`;
    token.textContent = piece === "king" ? "♚" : "";
    token.setAttribute("aria-hidden", "true");
    return token;
  }

  function legalFromSelected() {
    return selected ? game.movesFrom(selected[0], selected[1]) : [];
  }

  function renderStatus() {
    if (game.winner) {
      statusEl.textContent = game.winner === "defenders" ? "Defenders win — the king escaped." : "Attackers win — the king was captured.";
      detailEl.textContent = "";
      return;
    }
    statusEl.textContent = game.turn === "attackers" ? "Red attackers to move" : "White defenders to move";
    detailEl.textContent = `Captured: ${game.captured.attackers} attackers · ${game.captured.defenders} defenders`;
  }

  function render() {
    renderStatus();
    const legal = legalFromSelected();
    boardEl.replaceChildren();
    for (let row = 0; row < 9; row += 1) {
      for (let col = 0; col < 9; col += 1) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "tablut-cell";
        button.dataset.row = row;
        button.dataset.col = col;
        if (row === THRONE[0] && col === THRONE[1]) button.classList.add("throne");
        if (same(selected, [row, col])) button.classList.add("selected");
        if (legal.some(move => same(move.to, [row, col]))) button.dataset.legal = "true";
        const piece = game.at(row, col);
        const token = pieceElement(piece);
        if (token) button.appendChild(token);
        button.setAttribute("aria-label", piece ? `${piece} at row ${row + 1}, column ${col + 1}` : `empty row ${row + 1}, column ${col + 1}`);
        button.addEventListener("click", onCellClick);
        boardEl.appendChild(button);
      }
    }
  }

  function onCellClick(event) {
    if (game.winner) return;
    const row = Number(event.currentTarget.dataset.row);
    const col = Number(event.currentTarget.dataset.col);
    const destination = legalFromSelected().find(move => same(move.to, [row, col]));
    if (destination) {
      game.apply(destination);
      selected = null;
      render();
      return;
    }
    const piece = game.at(row, col);
    if (piece && side(piece) === game.turn) selected = [row, col];
    else selected = null;
    render();
  }

  resetEl.addEventListener("click", () => {
    game = new TablutGame();
    selected = null;
    render();
  });

  render();
})();
