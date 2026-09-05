const canvas = document.getElementById("boardCanvas");
const ctx = canvas.getContext("2d");

const cameraStatus = document.getElementById("cameraStatus");
const zoomStatus = document.getElementById("zoomStatus");
const homeButton = document.getElementById("homeButton");

const HOME = {
  x: 4,
  y: 4,
  zoom: 1
};

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

const whiteBack = [
  "♖",
  "♘",
  "♗",
  "♕",
  "♔",
  "♗",
  "♘",
  "♖"
];

const blackBack = [
  "♜",
  "♞",
  "♝",
  "♛",
  "♚",
  "♝",
  "♞",
  "♜"
];

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

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  canvas.width = Math.max(
    1,
    Math.round(rect.width * dpr)
  );

  canvas.height = Math.max(
    1,
    Math.round(rect.height * dpr)
  );

  ctx.setTransform(
    dpr,
    0,
    0,
    dpr,
    0,
    0
  );

  draw();
}

function worldToScreen(worldX, worldY) {
  const size = squareSize();
  const rect = canvas.getBoundingClientRect();

  return {
    x:
      rect.width / 2 +
      (worldX - state.cameraX) * size,

    y:
      rect.height / 2 -
      (worldY - state.cameraY) * size
  };
}

function screenToWorld(screenX, screenY) {
  const size = squareSize();
  const rect = canvas.getBoundingClientRect();

  return {
    x:
      state.cameraX +
      (screenX - rect.width / 2) / size,

    y:
      state.cameraY -
      (screenY - rect.height / 2) / size
  };
}

function screenToSquare(screenX, screenY) {
  const world =
    screenToWorld(
      screenX,
      screenY
    );

  return {
    x: Math.floor(world.x),
    y: Math.floor(world.y)
  };
}

function draw() {
  const rect = canvas.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;

  const size = squareSize();

  ctx.clearRect(
    0,
    0,
    width,
    height
  );

  const topLeftWorld =
    screenToWorld(
      0,
      0
    );

  const bottomRightWorld =
    screenToWorld(
      width,
      height
    );

  const minX =
    Math.floor(
      topLeftWorld.x
    ) - 1;

  const maxX =
    Math.ceil(
      bottomRightWorld.x
    ) + 1;

  const minY =
    Math.floor(
      bottomRightWorld.y
    ) - 1;

  const maxY =
    Math.ceil(
      topLeftWorld.y
    ) + 1;

  for (
    let x = minX;
    x <= maxX;
    x++
  ) {
    for (
      let y = minY;
      y <= maxY;
      y++
    ) {
      const topLeft =
        worldToScreen(
          x,
          y + 1
        );

      const light =
        (x + y) % 2 === 0;

      ctx.fillStyle =
        light
          ? "#d8d8d8"
          : "#6e6e6e";

      ctx.fillRect(
        topLeft.x,
        topLeft.y,
        size + 1,
        size + 1
      );

      drawSelectedSquare(
        x,
        y,
        topLeft,
        size
      );

      drawPiece(
        x,
        y,
        topLeft,
        size
      );
    }
  }

  drawClassicalBoundary();
  drawAxes();
  updateZoomStatus();
}

function drawSelectedSquare(
  x,
  y,
  topLeft,
  size
) {
  if (
    !state.selectedSquare ||
    state.selectedSquare.x !== x ||
    state.selectedSquare.y !== y
  ) {
    return;
  }

  ctx.save();

  ctx.strokeStyle =
    "#ffd54a";

  ctx.lineWidth =
    Math.max(
      2,
      size * 0.06
    );

  ctx.strokeRect(
    topLeft.x + 2,
    topLeft.y + 2,
    size - 4,
    size - 4
  );

  ctx.restore();
}

function drawPiece(
  x,
  y,
  topLeft,
  size
) {
  const piece =
    pieces.get(
      `${x},${y}`
    );

  if (!piece) {
    return;
  }

  ctx.save();

  ctx.font =
    `${size * 0.76}px ` +
    `"Arial Unicode MS", ` +
    `"Noto Sans Symbols 2", ` +
    `serif`;

  ctx.textAlign =
    "center";

  ctx.textBaseline =
    "middle";

  ctx.fillStyle =
    "#111";

  ctx.fillText(
    piece,
    topLeft.x + size / 2,
    topLeft.y + size / 2
  );

  ctx.restore();
}

function drawClassicalBoundary() {
  const size =
    squareSize();

  const topLeft =
    worldToScreen(
      0,
      8
    );

  ctx.save();

  ctx.strokeStyle =
    "#ffd54a";

  ctx.lineWidth =
    Math.max(
      2,
      size * 0.05
    );

  ctx.strokeRect(
    topLeft.x,
    topLeft.y,
    size * 8,
    size * 8
  );

  ctx.restore();
}

function drawAxes() {
  const rect =
    canvas.getBoundingClientRect();

  const origin =
    worldToScreen(
      0,
      0
    );

  ctx.save();

  ctx.lineWidth = 2;

  ctx.strokeStyle =
    "rgba(255,255,255,0.55)";

  ctx.beginPath();

  ctx.moveTo(
    0,
    origin.y
  );

  ctx.lineTo(
    rect.width,
    origin.y
  );

  ctx.stroke();

  ctx.beginPath();

  ctx.moveTo(
    origin.x,
    0
  );

  ctx.lineTo(
    origin.x,
    rect.height
  );

  ctx.stroke();

  ctx.restore();
}

function updateZoomStatus() {
  zoomStatus.textContent =
    `Zoom: ${state.zoom.toFixed(2)}×`;
}

function updateCameraStatus() {
  cameraStatus.textContent =
    `Camera: (` +
    `${state.cameraX.toFixed(2)}, ` +
    `${state.cameraY.toFixed(2)}` +
    `)`;
}

function pointerPosition(event) {
  const rect =
    canvas.getBoundingClientRect();

  return {
    x:
      event.clientX -
      rect.left,

    y:
      event.clientY -
      rect.top
  };
}

function distanceBetweenPointers() {
  const points =
    [...state.pointers.values()];

  if (
    points.length < 2
  ) {
    return null;
  }

  return Math.hypot(
    points[1].x -
      points[0].x,

    points[1].y -
      points[0].y
  );
}

canvas.addEventListener(
  "pointerdown",
  (event) => {
    canvas.setPointerCapture(
      event.pointerId
    );

    const position =
      pointerPosition(
        event
      );

    state.pointers.set(
      event.pointerId,
      position
    );

    if (
      state.pointers.size === 1
    ) {
      state.dragStart = {
        pointerX:
          position.x,

        pointerY:
          position.y,

        cameraX:
          state.cameraX,

        cameraY:
          state.cameraY
      };

      state.tapStart = {
        x:
          position.x,

        y:
          position.y,

        time:
          performance.now()
      };
    }

    if (
      state.pointers.size === 2
    ) {
      state.pinchStartDistance =
        distanceBetweenPointers();

      state.pinchStartZoom =
        state.zoom;
    }
  }
);

canvas.addEventListener(
  "pointermove",
  (event) => {
    if (
      !state.pointers.has(
        event.pointerId
      )
    ) {
      return;
    }

    const position =
      pointerPosition(
        event
      );

    state.pointers.set(
      event.pointerId,
      position
    );

    if (
      state.pointers.size === 2
    ) {
      const distance =
        distanceBetweenPointers();

      if (
        distance &&
        state.pinchStartDistance
      ) {
        const ratio =
          distance /
          state.pinchStartDistance;

        state.zoom =
          Math.min(
            state.maxZoom,
            Math.max(
              state.minZoom,
              state.pinchStartZoom *
                ratio
            )
          );

        draw();
      }

      return;
    }

    if (
      state.pointers.size === 1 &&
      state.dragStart
    ) {
      const dx =
        position.x -
        state.dragStart.pointerX;

      const dy =
        position.y -
        state.dragStart.pointerY;

      const size =
        squareSize();

      state.cameraX =
        state.dragStart.cameraX -
        dx / size;

      state.cameraY =
        state.dragStart.cameraY +
        dy / size;

      updateCameraStatus();

      draw();
    }
  }
);

function finishPointer(event) {
  const position =
    pointerPosition(
      event
    );

  const isTap =
    state.pointers.size === 1 &&
    state.tapStart &&
    performance.now() -
      state.tapStart.time <
      350 &&
    Math.hypot(
      position.x -
        state.tapStart.x,

      position.y -
        state.tapStart.y
    ) < 12;

  if (isTap) {
    handleTap(
      position.x,
      position.y
    );
  }

  state.pointers.delete(
    event.pointerId
  );

  if (
    state.pointers.size < 2
  ) {
    state.pinchStartDistance =
      null;

    state.pinchStartZoom =
      null;
  }

  if (
    state.pointers.size === 0
  ) {
    state.dragStart =
      null;

    state.tapStart =
      null;
  }
}

function handleTap(
  screenX,
  screenY
) {
  const square =
    screenToSquare(
      screenX,
      screenY
    );

  const key =
    `${square.x},${square.y}`;

  const piece =
    pieces.get(key);

  state.selectedSquare =
    square;

  if (
    !state.selectedPiece
  ) {
    if (piece) {
      state.selectedPiece = {
        key,
        piece
      };

      cameraStatus.textContent =
        `Selected ${piece} ` +
        `at (${key})`;
    } else {
      cameraStatus.textContent =
        `Square: (${key})`;
    }

    draw();

    return;
  }

  if (
    key ===
    state.selectedPiece.key
  ) {
    cameraStatus.textContent =
      `Cancelled ` +
      `${state.selectedPiece.piece}`;

    state.selectedPiece =
      null;

    draw();

    return;
  }

  pieces.delete(
    state.selectedPiece.key
  );

  pieces.set(
    key,
    state.selectedPiece.piece
  );

  const movedPiece =
    state.selectedPiece.piece;

  state.selectedPiece =
    null;

  cameraStatus.textContent =
    `Moved ${movedPiece} ` +
    `to (${key})`;

  draw();
}

canvas.addEventListener(
  "pointerup",
  finishPointer
);

canvas.addEventListener(
  "pointercancel",
  finishPointer
);

canvas.addEventListener(
  "wheel",
  (event) => {
    event.preventDefault();

    const factor =
      event.deltaY < 0
        ? 1.1
        : 0.9;

    state.zoom =
      Math.min(
        state.maxZoom,
        Math.max(
          state.minZoom,
          state.zoom *
            factor
        )
      );

    draw();
  },
  {
    passive: false
  }
);

homeButton.addEventListener(
  "click",
  () => {
    state.cameraX =
      HOME.x;

    state.cameraY =
      HOME.y;

    state.zoom =
      HOME.zoom;

    state.selectedSquare =
      null;

    state.selectedPiece =
      null;

    cameraStatus.textContent =
      "Camera: (4.00, 4.00)";

    draw();
  }
);

window.addEventListener(
  "resize",
  resizeCanvas
);

resizeCanvas();
