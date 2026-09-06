"use strict";

const FutureAdvanced = window.ChessAtlasAdvancedVariants;
const FutureLegality = window.ChessAtlasSpatialLegality;
const FutureTesseract = window.ChessAtlasTesseractRenderer;

const GLYPH = Object.freeze({
  wK: "♔", wQ: "♕", wR: "♖", wB: "♗", wN: "♘", wP: "♙",
  bK: "♚", bQ: "♛", bR: "♜", bB: "♝", bN: "♞", bP: "♟"
});

const modeSelect = document.getElementById("future-mode");
const viewSelect = document.getElementById("future-view");
const viewLabel = document.getElementById("view-label");
const resetButton = document.getElementById("future-reset");
const status = document.getElementById("future-status");
const detail = document.getElementById("future-detail");
const slicePanel = document.getElementById("slice-panel");
const tesseractPanel = document.getElementById("tesseract-panel");
const sliceBoards = document.getElementById("slice-boards");
const tesseractSvg = document.getElementById("tesseract-board");
const panControls = document.getElementById("infinite-pan");
const readout = document.getElementById("coordinate-readout");

let mode = "4d";
let view = "slices";
let game = null;
let selected = null;
let legalDestinations = [];
let viewport = { x: -1, y: -1, size: 10 };

function piece(side, type) {
  return { side, type };
}

function create4DStart() {
  const pieces = [];
  const back = ["R", "N", "Q", "K"];
  for (let x = 0; x < 4; x++) {
    pieces.push({ coordinate: [x, 0, 0, 0], piece: piece("w", back[x]) });
    pieces.push({ coordinate: [x, 1, 0, 0], piece: piece("w", "P") });
    pieces.push({ coordinate: [x, 3, 1, 1], piece: piece("b", back[x]) });
    pieces.push({ coordinate: [x, 2, 1, 1], piece: piece("b", "P") });
  }
  return FutureAdvanced.createSpatialBoard([4, 4, 2, 2], pieces);
}

function createInfiniteStart() {
  const pieces = [];
  const back = ["R", "N", "B", "Q", "K", "B", "N", "R"];
  for (let x = 0; x < 8; x++) {
    pieces.push({ coordinate: [x, 0], piece: piece("w", back[x]) });
    pieces.push({ coordinate: [x, 1], piece: piece("w", "P") });
    pieces.push({ coordinate: [x, 7], piece: piece("b", back[x]) });
    pieces.push({ coordinate: [x, 6], piece: piece("b", "P") });
  }
  return FutureAdvanced.createSpatialBoard([null, null], pieces);
}

function resetGame() {
  selected = null;
  legalDestinations = [];
  viewport = { x: -1, y: -1, size: 10 };

  if (mode === "4d") {
    game = new FutureLegality.AdvancedChessGame({
      board: create4DStart(),
      pawn: { forwardAxis: 1, captureAxes: [0, 2, 3] }
    });
  } else {
    game = new FutureLegality.AdvancedChessGame({
      board: createInfiniteStart(),
      pawn: { forwardAxis: 1, captureAxes: [0] }
    });
  }
  render();
}

function coordKey(coordinate) {
  return coordinate.join(":");
}

function sameCoord(a, b) {
  return Boolean(a && b && a.length === b.length && a.every((value, index) => value === b[index]));
}

function enumerateLegalFrom(origin) {
  if (mode === "4d") {
    return FutureTesseract.enumerateCells([4, 4, 2, 2]).filter(to => game.legal(origin, to));
  }

  const radius = 10;
  const destinations = [];
  for (let x = origin[0] - radius; x <= origin[0] + radius; x++) {
    for (let y = origin[1] - radius; y <= origin[1] + radius; y++) {
      const to = [x, y];
      if (game.legal(origin, to)) destinations.push(to);
    }
  }
  return destinations;
}

function selectCoordinate(coordinate) {
  const occupant = game.board.occupancy.get(coordinate);
  const legalTarget = legalDestinations.some(to => sameCoord(to, coordinate));

  if (selected && legalTarget) {
    game.move(selected, coordinate);
    selected = null;
    legalDestinations = [];
    render();
    return;
  }

  if (occupant && occupant.side === game.turn) {
    selected = [...coordinate];
    legalDestinations = enumerateLegalFrom(selected);
  } else {
    selected = null;
    legalDestinations = [];
  }
  render();
}

function pieceGlyph(pieceValue) {
  if (!pieceValue) return "";
  return GLYPH[`${pieceValue.side}${pieceValue.type}`] ?? pieceValue.type;
}

function cellButton(coordinate) {
  const value = game.board.occupancy.get(coordinate);
  const button = document.createElement("button");
  button.type = "button";
  button.className = "board-cell";
  if (value) button.classList.add("occupied");
  if (selected && sameCoord(selected, coordinate)) button.classList.add("selected");
  if (legalDestinations.some(to => sameCoord(to, coordinate))) button.classList.add("legal");
  button.setAttribute("aria-label", `${coordKey(coordinate)}${value ? ` ${value.side}${value.type}` : " empty"}`);

  const glyph = document.createElement("span");
  glyph.className = "piece";
  glyph.textContent = pieceGlyph(value);
  button.appendChild(glyph);

  const coord = document.createElement("small");
  coord.className = "coord";
  coord.textContent = coordKey(coordinate);
  button.appendChild(coord);

  button.addEventListener("click", () => selectCoordinate(coordinate));
  return button;
}

function render4DSlices() {
  sliceBoards.replaceChildren();
  for (let w = 0; w < 2; w++) {
    for (let z = 0; z < 2; z++) {
      const card = document.createElement("section");
      card.className = "slice-card";

      const label = document.createElement("p");
      label.className = "slice-label";
      label.innerHTML = `<strong>Z${z} · W${w}</strong><span>4×4</span>`;
      card.appendChild(label);

      const grid = document.createElement("div");
      grid.className = "slice-grid";
      grid.style.gridTemplateColumns = "repeat(4, 1fr)";
      grid.style.gridTemplateRows = "repeat(4, 1fr)";

      for (let y = 3; y >= 0; y--) {
        for (let x = 0; x < 4; x++) {
          grid.appendChild(cellButton([x, y, z, w]));
        }
      }
      card.appendChild(grid);
      sliceBoards.appendChild(card);
    }
  }
}

function renderInfinite() {
  sliceBoards.replaceChildren();
  const card = document.createElement("section");
  card.className = "slice-card";

  const label = document.createElement("p");
  label.className = "slice-label";
  label.innerHTML = `<strong>Viewport</strong><span>x ${viewport.x}…${viewport.x + viewport.size - 1}, y ${viewport.y}…${viewport.y + viewport.size - 1}</span>`;
  card.appendChild(label);

  const grid = document.createElement("div");
  grid.className = "slice-grid";
  grid.style.gridTemplateColumns = `repeat(${viewport.size}, 1fr)`;
  grid.style.gridTemplateRows = `repeat(${viewport.size}, 1fr)`;

  for (let y = viewport.y + viewport.size - 1; y >= viewport.y; y--) {
    for (let x = viewport.x; x < viewport.x + viewport.size; x++) {
      grid.appendChild(cellButton([x, y]));
    }
  }
  card.appendChild(grid);
  sliceBoards.appendChild(card);
}

function renderTesseract() {
  FutureTesseract.render(tesseractSvg, {
    dimensions: [4, 4, 2, 2],
    occupancy: game.board.occupancy,
    selected,
    legal: legalDestinations,
    width: 250,
    height: 250,
    projection: { cell: 40, originX: 24, originY: 62 },
    onCell: selectCoordinate
  });
}

function render() {
  const is4D = mode === "4d";
  if (!is4D && view === "tesseract") {
    view = "slices";
    viewSelect.value = "slices";
  }

  viewSelect.querySelector('option[value="tesseract"]').disabled = !is4D;
  viewLabel.title = is4D ? "" : "Tesseract view requires four spatial dimensions";
  panControls.hidden = is4D;

  slicePanel.hidden = view !== "slices";
  tesseractPanel.hidden = view !== "tesseract";

  if (view === "tesseract" && is4D) renderTesseract();
  else if (is4D) render4DSlices();
  else renderInfinite();

  const side = game.turn === "w" ? "White" : "Black";
  status.textContent = `${side} to move${game.inCheck() ? " — check" : ""}`;
  detail.textContent = is4D
    ? "4D experimental profile · [x, y, z, w] · W is spatial, not time"
    : "Sparse unbounded board · viewport does not limit legal space";

  if (selected) {
    readout.textContent = `${coordKey(selected)} · ${legalDestinations.length} legal destination${legalDestinations.length === 1 ? "" : "s"} shown`;
  } else {
    readout.textContent = "Tap a piece to inspect its legal moves.";
  }
}

modeSelect.addEventListener("change", () => {
  mode = modeSelect.value;
  resetGame();
});

viewSelect.addEventListener("change", () => {
  view = viewSelect.value;
  render();
});

resetButton.addEventListener("click", resetGame);

panControls.addEventListener("click", event => {
  const button = event.target.closest("button[data-pan]");
  if (!button) return;
  const step = 4;
  switch (button.dataset.pan) {
    case "left": viewport.x -= step; break;
    case "right": viewport.x += step; break;
    case "up": viewport.y += step; break;
    case "down": viewport.y -= step; break;
    case "center": viewport = { x: -1, y: -1, size: 10 }; break;
    default: return;
  }
  render();
});

resetGame();
