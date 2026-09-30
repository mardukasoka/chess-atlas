"use strict";

(function () {
  const { TablutGame, THRONE } = window.ChessAtlasTablut;
  const boardEl = document.getElementById("tablut-board");
  const statusEl = document.getElementById("tablut-status");
  const detailEl = document.getElementById("tablut-detail");
  const resetEl = document.getElementById("tablut-reset");
  const opponentEl = document.getElementById("tablut-opponent");
  let agentBusy = false;
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

  function scoreAction(action) {
    const [r,c] = action.to;
    const piece = game.at(...action.from);
    let score = Math.random() * 0.01;
    if (piece === "king") score += Math.min(r, 8-r, c, 8-c) * -8;
    if (piece === "defender") score += 2 - (Math.abs(r-4)+Math.abs(c-4)) * 0.08;
    return score;
  }

  function maybeAgent() {
    if (!opponentEl || opponentEl.value !== "agent" || game.winner || game.turn !== "defenders" || agentBusy) return;
    agentBusy = true;
    selected = null;
    render();
    setTimeout(() => {
      const legal = game.legalActions();
      if (legal.length) {
        const action = legal.slice().sort((a,b) => scoreAction(b)-scoreAction(a))[0];
        game.apply(action);
      }
      agentBusy = false;
      render();
    }, 220);
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
    if (game.winner || agentBusy || (opponentEl && opponentEl.value === "agent" && game.turn === "defenders")) return;
    const row = Number(event.currentTarget.dataset.row);
    const col = Number(event.currentTarget.dataset.col);
    const destination = legalFromSelected().find(move => same(move.to, [row, col]));
    if (destination) {
      game.apply(destination);
      selected = null;
      render();
      maybeAgent();
      return;
    }
    const piece = game.at(row, col);
    if (piece && side(piece) === game.turn) selected = [row, col];
    else selected = null;
    render();
  }

  if (opponentEl) opponentEl.addEventListener("change", () => { render(); maybeAgent(); });

  resetEl.addEventListener("click", () => {
    game = new TablutGame();
    selected = null;
    render();
  });

  render();
})();
