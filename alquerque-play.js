"use strict";

(function () {
  const api = globalThis.ChessAtlasAlquerque;
  if (!api) throw new Error("Alquerque engine not loaded");

  const boardEl = document.getElementById("alquerque-board");
  const statusEl = document.getElementById("alquerque-status");
  const resetEl = document.getElementById("alquerque-reset");
  const MARKER = { white: "○", black: "●" };
  let game;
  let selected = null;

  function same(a, b) { return a && b && a[0] === b[0] && a[1] === b[1]; }

  function drawLines() {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("aria-hidden", "true");
    svg.classList.add("alquerque-lines");
    const segments = [];
    for (let i = 0; i < 5; i += 1) {
      const p = i * 25;
      segments.push([0,p,100,p], [p,0,p,100]);
    }
    segments.push([0,0,100,100], [100,0,0,100]);
    segments.push([50,0,100,50], [100,50,50,100], [50,100,0,50], [0,50,50,0]);
    for (const [x1,y1,x2,y2] of segments) {
      const line = document.createElementNS(ns, "line");
      line.setAttribute("x1", x1); line.setAttribute("y1", y1);
      line.setAttribute("x2", x2); line.setAttribute("y2", y2);
      svg.appendChild(line);
    }
    boardEl.appendChild(svg);
  }

  function renderStatus() {
    if (game.winner) {
      statusEl.textContent = `${game.winner} wins — all opposing men captured.`;
      return;
    }
    statusEl.textContent = `${game.turn} to move · White ${game.remaining("white")} · Black ${game.remaining("black")}`;
  }

  function render() {
    boardEl.replaceChildren();
    drawLines();
    const actions = game.legalActions();
    const selectedActions = selected ? actions.filter(action => same(action.from, selected)) : [];

    for (let row = 0; row < 5; row += 1) {
      for (let col = 0; col < 5; col += 1) {
        const cell = document.createElement("button");
        cell.type = "button";
        cell.className = "alquerque-cell";
        cell.style.gridRow = String(row + 1);
        cell.style.gridColumn = String(col + 1);
        const occupant = game.at(row, col);
        cell.textContent = occupant ? MARKER[occupant] : "·";
        cell.setAttribute("aria-label", `${String.fromCharCode(65 + col)}${row + 1}${occupant ? ` ${occupant}` : " empty"}`);
        if (selected && same(selected, [row, col])) cell.classList.add("selected");
        const destinations = selectedActions.filter(action => same(action.to, [row, col]));
        if (destinations.length) cell.dataset.legal = "true";
        if (destinations.some(action => action.type === "capture")) cell.dataset.capture = "true";
        cell.addEventListener("click", () => handle(row, col));
        boardEl.appendChild(cell);
      }
    }
    renderStatus();
  }

  function handle(row, col) {
    if (game.winner) return;
    const occupant = game.at(row, col);
    if (occupant === game.turn) {
      selected = [row, col];
      render();
      return;
    }
    if (!selected) return;
    const action = game.legalActions().find(candidate => same(candidate.from, selected) && same(candidate.to, [row, col]));
    if (!action) return;
    game.apply(action);
    selected = null;
    render();
  }

  function reset() {
    game = new api.AlfonsoAlquerqueGame();
    selected = null;
    render();
  }

  resetEl.addEventListener("click", reset);
  reset();
})();
