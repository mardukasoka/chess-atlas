"use strict";

const SenetRandomizer =
  typeof module !== "undefined" && module.exports
    ? require("./randomizer.js")
    : window.ChessAtlasRandomizer;

/*
 * Senet does not have a surviving complete ancient rulebook. This module is
 * deliberately named as a reconstruction. It implements a compact
 * Kendall-style five-piece ruleset: alternating opening row, four casting
 * sticks, swaps with vulnerable single opponents, protected groups, a
 * three-piece blockade, mandatory House 26, Water returning toward House 15,
 * and exact exits from the final houses.
 */

const HOUSE = Object.freeze({
  REBIRTH: 15,
  HAPPINESS: 26,
  WATER: 27,
  THREE_TRUTHS: 28,
  RE_ATOUM: 29,
  HORUS: 30,
  OFF: 31
});

function otherSide(side) {
  return side === "w" ? "b" : "w";
}

class SenetKendallGame {
  constructor(options = {}) {
    this.sides = ["w", "b"];
    this.turn = options.firstSide ?? "w";
    this.random = options.random ?? new SenetRandomizer.SeededRandom(options.seed ?? 1);
    this.lastThrow = null;
    this.bonusTurn = false;
    this.winner = null;
    this.pieces = new Map([
      ["w", [1, 3, 5, 7, 9].map(position => ({ position, passedHappiness: false }))],
      ["b", [2, 4, 6, 8, 10].map(position => ({ position, passedHappiness: false }))]
    ]);
  }

  cast() {
    const lights = SenetRandomizer.rollFaces(this.random, [0, 1], 4)
      .reduce((sum, face) => sum + face, 0);
    const value = lights === 0 ? 5 : lights;
    this.lastThrow = value;
    this.bonusTurn = value === 1 || value === 4 || value === 5;
    return value;
  }

  occupiedAt(position) {
    if (position === HOUSE.OFF) return null;
    for (const side of this.sides) {
      const pieceIndex = this.pieces.get(side).findIndex(piece => piece.position === position);
      if (pieceIndex !== -1) return { side, pieceIndex, piece: this.pieces.get(side)[pieceIndex] };
    }
    return null;
  }

  protectedEnemyAt(position, movingSide) {
    const occupant = this.occupiedAt(position);
    if (!occupant || occupant.side === movingSide) return false;
    const side = occupant.side;
    const before = this.occupiedAt(position - 1);
    const after = this.occupiedAt(position + 1);
    return Boolean(
      (before && before.side === side) ||
      (after && after.side === side) ||
      position === HOUSE.THREE_TRUTHS ||
      position === HOUSE.RE_ATOUM
    );
  }

  opponentBlockades() {
    const opponent = otherSide(this.turn);
    const positions = new Set(
      this.pieces.get(opponent)
        .map(piece => piece.position)
        .filter(position => position >= 1 && position <= 30)
    );
    const starts = [];
    for (let position = 1; position <= 28; position++) {
      if (positions.has(position) && positions.has(position + 1) && positions.has(position + 2)) {
        starts.push(position);
      }
    }
    return starts;
  }

  crossesBlockade(from, to) {
    if (to <= from) return false;
    return this.opponentBlockades().some(start => from < start && to > start + 2);
  }

  waterReturnPosition() {
    if (!this.occupiedAt(HOUSE.REBIRTH)) return HOUSE.REBIRTH;
    for (let position = HOUSE.REBIRTH - 1; position >= 1; position--) {
      if (!this.occupiedAt(position)) return position;
    }
    throw new RangeError("No empty square available for House of Water return");
  }

  exitAllowed(position, roll) {
    return (
      (position === HOUSE.THREE_TRUTHS && roll === 3) ||
      (position === HOUSE.RE_ATOUM && roll === 2) ||
      (position === HOUSE.HORUS && roll === 1)
    );
  }

  forwardMoveFor(pieceIndex, roll = this.lastThrow) {
    const piece = this.pieces.get(this.turn)?.[pieceIndex];
    if (!piece || piece.position === HOUSE.OFF || !Number.isInteger(roll) || roll < 1 || roll > 5) return null;

    if (this.exitAllowed(piece.position, roll)) {
      return { side: this.turn, pieceIndex, from: piece.position, to: HOUSE.OFF, roll, exit: true };
    }

    const destination = piece.position + roll;
    if (destination > HOUSE.HORUS) return null;

    // Every piece must land exactly on House 26 before entering the final run.
    if (!piece.passedHappiness && piece.position < HOUSE.HAPPINESS && destination > HOUSE.HAPPINESS) return null;
    if (this.crossesBlockade(piece.position, destination)) return null;

    const occupant = this.occupiedAt(destination);
    if (occupant && occupant.side === this.turn) return null;
    if (occupant && this.protectedEnemyAt(destination, this.turn)) return null;

    return {
      side: this.turn,
      pieceIndex,
      from: piece.position,
      to: destination,
      roll,
      exit: false,
      swap: occupant ? { side: occupant.side, pieceIndex: occupant.pieceIndex } : null,
      water: destination === HOUSE.WATER,
      happiness: destination === HOUSE.HAPPINESS
    };
  }

  legalMoves(roll = this.lastThrow) {
    if (this.winner) return [];
    return this.pieces.get(this.turn)
      .map((_, index) => this.forwardMoveFor(index, roll))
      .filter(Boolean);
  }

  move(pieceIndex, roll = this.lastThrow) {
    const move = this.forwardMoveFor(pieceIndex, roll);
    if (!move) throw new RangeError("Illegal Senet reconstruction move");

    const side = this.turn;
    const movingPiece = this.pieces.get(side)[pieceIndex];

    if (move.exit) {
      movingPiece.position = HOUSE.OFF;
    } else {
      if (move.swap) {
        this.pieces.get(move.swap.side)[move.swap.pieceIndex].position = move.from;
      }
      movingPiece.position = move.to;
      if (move.happiness) movingPiece.passedHappiness = true;
      if (move.water) movingPiece.position = this.waterReturnPosition();
    }

    if (this.pieces.get(side).every(piece => piece.position === HOUSE.OFF)) {
      this.winner = side;
      this.lastThrow = null;
      return { ...move, winner: side, bonusTurn: false };
    }

    const bonusTurn = this.bonusTurn;
    this.lastThrow = null;
    this.bonusTurn = false;
    if (!bonusTurn) this.turn = otherSide(side);
    return { ...move, winner: null, bonusTurn };
  }

  passIfNoMove(roll = this.lastThrow) {
    if (this.legalMoves(roll).length > 0) throw new RangeError("Cannot pass while a Senet move exists");
    const side = this.turn;
    const bonusTurn = this.bonusTurn;
    this.lastThrow = null;
    this.bonusTurn = false;
    if (!bonusTurn) this.turn = otherSide(side);
    return this;
  }

  snapshot() {
    return Object.freeze({
      reconstruction: "kendall-style-five-piece",
      turn: this.turn,
      lastThrow: this.lastThrow,
      winner: this.winner,
      pieces: Object.freeze(Object.fromEntries(
        [...this.pieces.entries()].map(([side, pieces]) => [side, Object.freeze(
          pieces.map(piece => Object.freeze({ ...piece }))
        )])
      )),
      random: this.random.snapshot()
    });
  }
}

const Senet = {
  HOUSE,
  SenetKendallGame
};

if (typeof module !== "undefined" && module.exports) module.exports = Senet;
if (typeof window !== "undefined") window.ChessAtlasSenet = Senet;
