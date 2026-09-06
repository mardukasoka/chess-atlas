"use strict";

const AdvancedGeometry =
  typeof module !== "undefined" && module.exports
    ? require("./geometry.js")
    : window.Geometry;

const AdvancedRules =
  typeof module !== "undefined" && module.exports
    ? require("./rules.js")
    : window.ChessAtlasRules;

function normalizePiece(piece) {
  if (!piece) {
    throw new TypeError("Piece is required");
  }

  if (typeof piece === "string") {
    const side = piece[0];
    const type = piece.slice(1).toUpperCase();
    return { side, type };
  }

  const side = piece.side ?? piece.owner;
  const type = String(piece.type ?? piece.role ?? piece.kind ?? "").toUpperCase();

  if (!side || !type) {
    throw new TypeError("Piece requires side and type");
  }

  return { ...piece, side, type };
}

function movementForPiece(piece, dimensions, options = {}) {
  const normalized = normalizePiece(piece);
  const dimensionCount = dimensions.length;
  const unbounded = dimensions.some(size => size === null || size === Infinity);
  const maxSteps = unbounded ? (options.maxSteps ?? 16) : null;

  switch (normalized.type) {
    case "R":
      return AdvancedRules.slide(
        AdvancedRules.vectors.rook(dimensionCount),
        { maxSteps }
      );
    case "B":
      return AdvancedRules.slide(
        AdvancedRules.vectors.bishop(dimensionCount),
        { maxSteps }
      );
    case "Q":
      return AdvancedRules.slide(
        AdvancedRules.vectors.queen(dimensionCount),
        { maxSteps }
      );
    case "K":
      return AdvancedRules.step(
        AdvancedRules.vectors.king(dimensionCount)
      );
    case "N":
      return AdvancedRules.jump(
        AdvancedRules.vectors.knight(dimensionCount)
      );
    case "P": { 
      const forwardAxis = options.forwardAxis ?? 1;
      const captureAxes = options.captureAxes ??
        Array.from({ length: dimensionCount }, (_, axis) => axis)
          .filter(axis => axis !== forwardAxis);
      const forwardDirection =
        options.forwardDirection ??
        (normalized.side === "w" || normalized.side === "white" ? 1 : -1);

      return AdvancedRules.pawn({
        forwardAxis,
        forwardDirection,
        captureAxes,
        oneStep: 1,
        multiStep: null,
        promotionBoundary: options.promotionBoundary
      });
    }
    default:
      throw new RangeError(`Unsupported advanced piece type: ${normalized.type}`);
  }
}

function createSpatialBoard(dimensions, pieces = []) {
  const shape = AdvancedGeometry.createBoardShape(dimensions);
  const occupancy = new AdvancedGeometry.CoordinateMap(dimensions);

  for (const entry of pieces) {
    if (!entry || !Array.isArray(entry.coordinate)) {
      throw new TypeError("Each piece entry requires a coordinate");
    }
    occupancy.set(entry.coordinate, normalizePiece(entry.piece));
  }

  return { shape, occupancy };
}

function cloneSpatialBoard(board) {
  const clone = createSpatialBoard(board.shape.dimensions);
  for (const [coordinate, piece] of board.occupancy) {
    clone.occupancy.set(coordinate, { ...piece });
  }
  return clone;
}

function generateSpatialMoves({
  board,
  origin,
  maxSteps = 16,
  pawn = {}
}) {
  if (!board || !board.shape || !board.occupancy) {
    throw new TypeError("board must contain shape and occupancy");
  }

  const piece = board.occupancy.get(origin);
  if (!piece) {
    return [];
  }

  const normalized = normalizePiece(piece);
  const movement = movementForPiece(
    normalized,
    board.shape.dimensions,
    {
      maxSteps,
      forwardAxis: pawn.forwardAxis,
      captureAxes: pawn.captureAxes,
      forwardDirection: pawn.forwardDirection,
      promotionBoundary: pawn.promotionBoundary
    }
  );

  return AdvancedRules.generateMoves({
    shape: board.shape,
    origin,
    piece: normalized,
    side: normalized.side,
    occupancy: board.occupancy,
    movement
  });
}

function applySpatialMove(board, move) {
  if (!move || !Array.isArray(move.from) || !Array.isArray(move.to)) {
    throw new TypeError("Move requires from and to coordinates");
  }

  const piece = board.occupancy.get(move.from);
  if (!piece) {
    throw new RangeError("No piece at move origin");
  }

  const clone = cloneSpatialBoard(board);
  clone.occupancy.delete(move.from);
  clone.occupancy.set(move.to, piece);
  return clone;
}

function viewportMoves(options) {
  const radius = options.radius ?? 8;
  if (!Number.isInteger(radius) || radius < 1) {
    throw new RangeError("Viewport radius must be a positive integer");
  }
  return generateSpatialMoves({ ...options, maxSteps: radius });
}

function createInfiniteChess(pieces = []) {
  return Object.freeze({
    id: "infinite",
    spatialDimensions: 2,
    extent: "unbounded",
    dimensions: Object.freeze([null, null]),
    board: createSpatialBoard([null, null], pieces)
  });
}

function create4DChess(pieces = []) {
  return Object.freeze({
    id: "4d",
    spatialDimensions: 4,
    extent: "finite",
    dimensions: Object.freeze([4, 4, 2, 2]),
    board: createSpatialBoard([4, 4, 2, 2], pieces)
  });
}

function normalizeVariantConfig(config = {}) {
  const spatialDimensions = config.spatialDimensions ?? 2;
  if (!Number.isInteger(spatialDimensions) || spatialDimensions < 2) {
    throw new RangeError("spatialDimensions must be an integer >= 2");
  }

  const extent = config.extent ?? "finite";
  if (extent !== "finite" && extent !== "unbounded") {
    throw new RangeError("extent must be finite or unbounded");
  }

  return Object.freeze({
    baseRules: config.baseRules ?? "modern",
    spatialDimensions,
    extent,
    timeline: Boolean(config.timeline),
    quantum: Boolean(config.quantum)
  });
}

const AdvancedVariants = {
  normalizePiece,
  movementForPiece,
  createSpatialBoard,
  cloneSpatialBoard,
  generateSpatialMoves,
  applySpatialMove,
  viewportMoves,
  createInfiniteChess,
  create4DChess,
  normalizeVariantConfig
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = AdvancedVariants;
}

if (typeof window !== "undefined") {
  window.ChessAtlasAdvancedVariants = AdvancedVariants;
}
