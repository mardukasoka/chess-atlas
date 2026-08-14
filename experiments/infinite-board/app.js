const canvas = document.getElementById("boardCanvas");
const ctx = canvas.getContext("2d");
const cameraStatus = document.getElementById("cameraStatus");
const zoomStatus = document.getElementById("zoomStatus");
const homeButton = document.getElementById("homeButton");

const HOME = { x: 4, y: 4, zoom: 1 };

const state = {
  cameraX: HOME.x,
  cameraY: HOME.y,
  zoom: HOME.zoom,
  baseSquareSize: 56,
  minZoom: 0.35,
  maxZoom: 3,
  pointers: new Map(),
  dragStart: null,
  pinchStartDistance: null,
  pinchStartZoom: null,
  tapStart: null,
  selectedSquare: null,
  selectedPiece: null
};

const pieces = new Map();

const whiteBack = ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"];
const blackBack = ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"];

function resetPieces() {
  pieces.clear();

  for (let x = 0; x < 8; x++) {
    pieces.set(`${x},0`, whiteBack[x]);
    pieces.set(`${x},1`, "♙");
    pieces.set(`${x},6`, "♟");
    pieces.set(`${x},7`, blackBack[x]);
  }
}

resetPieces();

function squareSize() {
  return state.baseSquareSize * state.zoom;
}

function worldToScreen(x, y) {
  const size = squareSize();
  const rect = canvas.getBoundingClientRect();

  return {
    x: rect.width / 2 + (x - state.cameraX) * size,
    y: rect.height / 2 - (y - state.cameraY) * size
  };
}

function screenToWorld(x, y) {
  const size = squareSize();
  const rect = canvas.getBoundingClientRect();

  return {
    x: state.cameraX + (x - rect.width / 2) / size,
    y: state.cameraY - (y - rect.height / 2) / size
  };
}

function screenToSquare(x, y) {
  const world = screenToWorld(x, y);

  return {
    x: Math.floor(world.x),
    y: Math.floor(world.y)
  };
}

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  canvas.width = Math.max(1, Math.round(rect.width * dpr));
  canvas.height = Math.max(1, Math.round(rect.height * dpr));

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  draw();
}

function draw() {
  const rect = canvas.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;