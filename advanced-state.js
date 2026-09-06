"use strict";

const StateAdvanced = window.ChessAtlasAdvancedVariants;
const StateLegality = window.ChessAtlasSpatialLegality;
const Timeline = window.ChessAtlasTimelineState;
const Quantum = window.ChessAtlasQuantumState;

const GLYPH = Object.freeze({
  wK: "♔", wQ: "♕", wR: "♖", wB: "♗", wN: "♘", wP: "♙",
  bK: "♚", bQ: "♛", bR: "♜", bB: "♝", bN: "♞", bP: "♟"
});

const timelineMode = document.getElementById("timeline-mode");
const quantumMode = document.getElementById("quantum-mode");
const resetButton = document.getElementById("state-reset");
const timelineBoard = document.getElementById("timeline-board");
const timelineNodes = document.getElementById("timeline-nodes");
const timelineStatus = document.getElementById("timeline-status");
const timelineDetail = document.getElementById("timeline-detail");
const timelineReadout = document.getElementById("timeline-readout");
const forkButton = document.getElementById("fork-here");
const quantumBoard = document.getElementById("quantum-board");
const quantumSplit = document.getElementById("quantum-split");
const quantumMeasure = document.getElementById("quantum-measure");
const quantumReadout = document.getElementById("quantum-readout");

let selectedMode = "timeline";
let game;
let graph;
let activeNodeId;
let selectedNodeId;
let pendingForkParentId = null;
let selected = null;
let legal = [];
let quantum;

function piece(side, type) {
  return { side, type };
}

function createClassicStart() {
  const pieces = [];
  const back = ["R", "N", "B", "Q", "K", "B", "N", "R"];
  for (let x = 0; x < 8; x++) {
    pieces.push({ coordinate: [x, 0], piece: piece("w", back[x]) });
    pieces.push({ coordinate: [x, 1], piece: piece("w", "P") });
    pieces.push({ coordinate: [x, 7], piece: piece("b", back[x]) });
    pieces.push({ coordinate: [x, 6], piece: piece("b", "P") });
  }
  return StateAdvanced.createSpatialBoard([8, 8], pieces);
}

function boardSnapshot(board, turn) {
  const pieces = [];
  for (const [coordinate, value] of board.occupancy.entries()) {
    pieces.push({ coordinate: [...coordinate], piece: { ...value } });
  }
  pieces.sort((a, b) => a.coordinate[1] - b.coordinate[1] || a.coordinate[0] - b.coordinate[0]);
  return { pieces, turn };
}

function restoreSnapshot(snapshot) {
  const board = StateAdvanced.createSpatialBoard([8, 8], snapshot.pieces);
  game = new StateLegality.AdvancedChessGame({
    board,
    turn: snapshot.turn,
    pawn: { forwardAxis: 1, captureAxes: [0] }
  });
}

function sameCoord(a, b) {
  return Boolean(a && b && a.length === b.length && a.every((value, index) => value === b[index]));
}

function pieceGlyph(value) {
  return value ? (GLYPH[`${value.side}${value.type}`] ?? value.type) : "";
}

function enumerateLegal(origin) {
  const destinations = [];
  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
      const target = [x, y];
      if (game.legal(origin, target)) destinations.push(target);
    }
  }
  return destinations;
}

function selectTimelineCoordinate(coordinate) {
  const occupant = game.board.occupancy.get(coordinate);
  const target = legal.some(to => sameCoord(to, coordinate));

  if (selected && target) {
    const from = [...selected];
    const to = [...coordinate];
    game.move(from, to);
    const state = boardSnapshot(game.board, game.turn);
    let node;
    if (pendingForkParentId) {
      node = graph.fork(pendingForkParentId, state, { from, to });
      pendingForkParentId = null;
    } else {
      node = graph.append(activeNodeId, state, { from, to });
    }
    activeNodeId = node.id;
    selectedNodeId = node.id;
    selected = null;
    legal = [];
    renderTimeline();
    return;
  }

  if (occupant && occupant.side === game.turn) {
    selected = [...coordinate];
    legal = enumerateLegal(selected);
  } else {
    selected = null;
    legal = [];
  }
  renderTimelineBoard();
}

function renderTimelineBoard() {
  timelineBoard.replaceChildren();
  for (let y = 7; y >= 0; y--) {
    for (let x = 0; x < 8; x++) {
      const coordinate = [x, y];
      const value = game.board.occupancy.get(coordinate);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "board-cell";
      if (selected && sameCoord(selected, coordinate)) button.classList.add("selected");
      if (legal.some(to => sameCoord(to, coordinate))) button.classList.add("legal");
      button.setAttribute("aria-label", `${String.fromCharCode(97 + x)}${y + 1}${value ? ` ${value.side}${value.type}` : " empty"}`);
      const glyph = document.createElement("span");
      glyph.className = "piece";
      glyph.textContent = pieceGlyph(value);
      button.appendChild(glyph);
      button.addEventListener("click", () => selectTimelineCoordinate(coordinate));
      timelineBoard.appendChild(button);
    }
  }
}

function chooseTimelineNode(nodeId) {
  const node = graph.get(nodeId);
  if (!node) return;
  selectedNodeId = nodeId;
  activeNodeId = nodeId;
  pendingForkParentId = null;
  selected = null;
  legal = [];
  restoreSnapshot(node.state);
  renderTimeline();
}

function renderTimelineNodes() {
  timelineNodes.replaceChildren();
  const nodes = [...graph.nodes.values()].sort((a, b) => a.createdOrder - b.createdOrder);
  for (const node of nodes) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "timeline-node";
    if (node.id === selectedNodeId) button.classList.add("active");
    button.innerHTML = `<strong>${node.branchId}</strong><small>ply ${node.ply}</small>`;
    button.title = node.move ? `${node.move.from.join(":")} → ${node.move.to.join(":")}` : "Initial state";
    button.addEventListener("click", () => chooseTimelineNode(node.id));
    timelineNodes.appendChild(button);
  }
}

function renderTimeline() {
  renderTimelineBoard();
  renderTimelineNodes();
  const current = graph.get(activeNodeId);
  const side = game.turn === "w" ? "White" : "Black";
  timelineStatus.textContent = `${side} to move${game.inCheck() ? " — check" : ""}`;
  timelineReadout.textContent = `${current.branchId} · ply ${current.ply}`;
  timelineDetail.textContent = pendingForkParentId
    ? `Next legal move creates a new branch from ${pendingForkParentId}.`
    : "Time is graph metadata, not a board axis.";
}

function resetTimeline() {
  game = new StateLegality.AdvancedChessGame({
    board: createClassicStart(),
    pawn: { forwardAxis: 1, captureAxes: [0] }
  });
  graph = new Timeline.TimelineGraph(boardSnapshot(game.board, game.turn));
  activeNodeId = graph.rootId;
  selectedNodeId = graph.rootId;
  pendingForkParentId = null;
  selected = null;
  legal = [];
  renderTimeline();
}

forkButton.addEventListener("click", () => {
  const node = graph.get(selectedNodeId);
  if (!node) return;
  activeNodeId = node.id;
  pendingForkParentId = node.id;
  restoreSnapshot(node.state);
  selected = null;
  legal = [];
  renderTimeline();
});

function resetQuantum() {
  quantum = new Quantum.QuantumState({ seed: 2200 });
  quantum.addPiece("knight", { side: "w", type: "N" }, [1, 0]);
  renderQuantum();
}

function renderQuantum() {
  quantumBoard.replaceChildren();
  const knight = quantum.get("knight");
  const probabilities = new Map();
  for (const branch of knight.branches) {
    probabilities.set(branch.coordinate.join(":"), branch.probability);
  }

  for (let y = 7; y >= 0; y--) {
    for (let x = 0; x < 8; x++) {
      const coordinate = [x, y];
      const key = coordinate.join(":");
      const probability = probabilities.get(key) ?? 0;
      const cell = document.createElement("div");
      cell.className = "quantum-cell";
      if (probability > 0) {
        cell.classList.add("branch");
        const glyph = document.createElement("span");
        glyph.className = "piece";
        glyph.textContent = "♘";
        glyph.style.opacity = String(Math.max(.35, probability));
        cell.appendChild(glyph);
        const label = document.createElement("small");
        label.className = "probability";
        label.textContent = `${Math.round(probability * 100)}%`;
        cell.appendChild(label);
      }
      quantumBoard.appendChild(cell);
    }
  }

  const branchText = knight.branches
    .map(branch => `[${branch.coordinate.join(",")}] ${Math.round(branch.probability * 100)}%`)
    .join(" · ");
  quantumReadout.textContent = `Knight state: ${branchText}. Measurement uses the deterministic replay seed.`;
}

quantumSplit.addEventListener("click", () => {
  quantum.split("knight", [[0, 2], [2, 2]], [1, 1]);
  renderQuantum();
});

quantumMeasure.addEventListener("click", () => {
  quantum.measure("knight");
  renderQuantum();
});

document.querySelectorAll("[data-mode]").forEach(button => {
  button.addEventListener("click", () => {
    selectedMode = button.dataset.mode;
    document.querySelectorAll("[data-mode]").forEach(item => item.classList.toggle("active", item === button));
    timelineMode.hidden = selectedMode !== "timeline";
    quantumMode.hidden = selectedMode !== "quantum";
  });
});

resetButton.addEventListener("click", () => {
  if (selectedMode === "timeline") resetTimeline();
  else resetQuantum();
});

resetTimeline();
resetQuantum();
