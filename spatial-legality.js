"use strict";

const SpatialGeometry =
  typeof module !== "undefined" && module.exports
    ? require("./geometry.js")
    : window.Geometry;

const SpatialAdvanced =
  typeof module !== "undefined" && module.exports
    ? require("./advanced-variants.js")
    : window.ChessAtlasAdvancedVariants;

function nonZeroDelta(from, to) {
  const delta = SpatialGeometry.difference(to, from);
  return {
    delta,
    nonZero: delta
      .map((value, axis) => ({ axis, value, abs: Math.abs(value) }))
      .filter(entry => entry.value !== 0)
  };
}

function sliderVector(type, from, to) {
  const { nonZero } = nonZeroDelta(from, to);
  if (nonZero.length === 0) return null;

  const distances = new Set(nonZero.map(entry => entry.abs));
  const equalDistance = distances.size === 1;

  if (type === "R" && nonZero.length !== 1) return null;
  if (type === "B" && (nonZero.length !== 2 || !equalDistance)) return null;
  if (type === "Q" && !equalDistance) return null;
  if (!["R", "B", "Q"].includes(type)) return null;

  const distance = nonZero[0].abs;
  const delta = SpatialGeometry.difference(to, from);
  return {
    distance,
    vector: delta.map(value => value === 0 ? 0 : value / distance)
  };
}

function isKnightDelta(delta) {
  const nonZero = delta.map(Math.abs).filter(Boolean).sort((a, b) => a - b);
  return nonZero.length === 2 && nonZero[0] === 1 && nonZero[1] === 2;
}

function clearSliderPath(board, from, to, type) {
  const slider = sliderVector(type, from, to);
  if (!slider) return false;

  for (let distance = 1; distance < slider.distance; distance++) {
    const coordinate = SpatialGeometry.step(from, slider.vector, distance);
    if (board.occupancy.get(coordinate)) return false;
  }
  return true;
}

function sameSide(first, second) {
  if (!first || !second) return false;
  return (first.side ?? first.owner) === (second.side ?? second.owner);
}

function pawnDestination(piece, from, to, options = {}, attacksOnly = false) {
  const dimensions = from.length;
  const forwardAxis = options.forwardAxis ?? 1;
  const captureAxes = options.captureAxes ??
    Array.from({ length: dimensions }, (_, axis) => axis).filter(axis => axis !== forwardAxis);
  const direction = options.forwardDirection ??
    ((piece.side === "w" || piece.side === "white") ? 1 : -1);
  const delta = SpatialGeometry.difference(to, from);

  if (delta[forwardAxis] !== direction) return { legal: false, capture: false };

  const changedCaptureAxes = captureAxes.filter(axis => delta[axis] !== 0);
  const invalidOtherAxis = delta.some((value, axis) =>
    axis !== forwardAxis && !captureAxes.includes(axis) && value !== 0
  );
  if (invalidOtherAxis) return { legal: false, capture: false };

  const capturePattern =
    changedCaptureAxes.length === 1 &&
    Math.abs(delta[changedCaptureAxes[0]]) === 1 &&
    captureAxes.every(axis => axis === changedCaptureAxes[0] || delta[axis] === 0);

  if (attacksOnly) return { legal: capturePattern, capture: capturePattern };

  const forwardPattern = changedCaptureAxes.length === 0 &&
    delta.every((value, axis) => axis === forwardAxis || value === 0);

  return {
    legal: forwardPattern || capturePattern,
    capture: capturePattern
  };
}

function isPseudoLegalDestination(board, from, to, options = {}) {
  if (!board.shape.contains(from) || !board.shape.contains(to)) return false;
  if (SpatialGeometry.equals(from, to)) return false;

  const piece = board.occupancy.get(from);
  if (!piece) return false;
  const normalized = SpatialAdvanced.normalizePiece(piece);
  const target = board.occupancy.get(to);
  if (sameSide(normalized, target)) return false;

  const type = normalized.type;
  const delta = SpatialGeometry.difference(to, from);

  if (["R", "B", "Q"].includes(type)) {
    return Boolean(sliderVector(type, from, to)) && clearSliderPath(board, from, to, type);
  }

  if (type === "K") {
    return delta.some(Boolean) && delta.every(value => Math.abs(value) <= 1);
  }

  if (type === "N") {
    return isKnightDelta(delta);
  }

  if (type === "P") {
    const pattern = pawnDestination(normalized, from, to, options.pawn);
    if (!pattern.legal) return false;
    return pattern.capture ? Boolean(target) : !target;
  }

  return false;
}

function attacksDestination(board, from, to, options = {}) {
  const piece = board.occupancy.get(from);
  if (!piece) return false;
  const normalized = SpatialAdvanced.normalizePiece(piece);

  if (normalized.type === "P") {
    return pawnDestination(normalized, from, to, options.pawn, true).legal;
  }

  // Attack geometry ignores the colour of a hypothetical occupant at `to`.
  const clone = SpatialAdvanced.cloneSpatialBoard(board);
  const target = clone.occupancy.get(to);
  if (target && sameSide(normalized, target)) clone.occupancy.delete(to);
  return isPseudoLegalDestination(clone, from, to, options);
}

function findKing(board, side) {
  for (const [coordinate, piece] of board.occupancy) {
    const normalized = SpatialAdvanced.normalizePiece(piece);
    if (normalized.side === side && normalized.type === "K") return coordinate;
  }
  return null;
}

function isSquareAttacked(board, coordinate, bySide, options = {}) {
  for (const [from, piece] of board.occupancy) {
    const normalized = SpatialAdvanced.normalizePiece(piece);
    if (normalized.side !== bySide) continue;
    if (attacksDestination(board, from, coordinate, options)) return true;
  }
  return false;
}

function opposite(side) {
  if (side === "w") return "b";
  if (side === "b") return "w";
  if (side === "white") return "black";
  if (side === "black") return "white";
  throw new RangeError(`Unknown side: ${side}`);
}

function isKingInCheck(board, side, options = {}) {
  const king = findKing(board, side);
  if (!king) return false;
  return isSquareAttacked(board, king, opposite(side), options);
}

function isLegalDestination(board, from, to, options = {}) {
  const piece = board.occupancy.get(from);
  if (!piece || !isPseudoLegalDestination(board, from, to, options)) return false;
  const side = SpatialAdvanced.normalizePiece(piece).side;
  const move = { from: [...from], to: [...to] };
  const next = SpatialAdvanced.applySpatialMove(board, move);
  return !isKingInCheck(next, side, options);
}

function applyLegalMove(board, from, to, options = {}) {
  if (!isLegalDestination(board, from, to, options)) {
    throw new RangeError("Illegal advanced chess destination");
  }
  return SpatialAdvanced.applySpatialMove(board, { from, to });
}

class AdvancedChessGame {
  constructor(options = {}) {
    this.board = options.board ?? SpatialAdvanced.createSpatialBoard(options.dimensions ?? [8, 8]);
    this.turn = options.turn ?? "w";
    this.pawn = options.pawn ?? {};
    this.history = [];
  }

  legal(from, to) {
    const piece = this.board.occupancy.get(from);
    if (!piece || SpatialAdvanced.normalizePiece(piece).side !== this.turn) return false;
    return isLegalDestination(this.board, from, to, { pawn: this.pawn });
  }

  move(from, to) {
    if (!this.legal(from, to)) throw new RangeError("Illegal advanced chess move");
    const captured = this.board.occupancy.get(to) ?? null;
    this.board = applyLegalMove(this.board, from, to, { pawn: this.pawn });
    this.history.push(Object.freeze({ from: [...from], to: [...to], captured }));
    this.turn = opposite(this.turn);
    return this;
  }

  inCheck(side = this.turn) {
    return isKingInCheck(this.board, side, { pawn: this.pawn });
  }
}

const SpatialLegality = {
  nonZeroDelta,
  sliderVector,
  clearSliderPath,
  pawnDestination,
  isPseudoLegalDestination,
  attacksDestination,
  findKing,
  isSquareAttacked,
  isKingInCheck,
  isLegalDestination,
  applyLegalMove,
  AdvancedChessGame,
  opposite
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = SpatialLegality;
}

if (typeof window !== "undefined") {
  window.ChessAtlasSpatialLegality = SpatialLegality;
}
