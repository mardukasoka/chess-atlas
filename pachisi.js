"use strict";

/*
 * Compact Pachisi engine using the straightforward six-cowrie profile described
 * by Masters Traditional Games. Traditional rules vary, so this is a named
 * rules profile rather than a claim of one universal historical ruleset.
 */
(function (root, factory) {
  const api = factory(
    typeof module !== "undefined" && module.exports
      ? require("./randomizer.js")
      : root.ChessAtlasRandomizer
  );
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.ChessAtlasPachisi = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (randomizer) {
  const COLORS = Object.freeze(["yellow", "red", "black", "green"]);
  const ARMS = Object.freeze(["north", "west", "south", "east"]);
  const ARM_BY_COLOR = Object.freeze({
    yellow: "north",
    red: "west",
    black: "south",
    green: "east"
  });
  const TEAM_BY_COLOR = Object.freeze({
    yellow: "yellow-black",
    black: "yellow-black",
    red: "red-green",
    green: "red-green"
  });

  function cell(arm, column, distance) {
    return `${arm}:${column}:${distance}`;
  }

  function makeOuterCycle() {
    const result = [];
    for (const arm of ARMS) {
      result.push(cell(arm, "M", 8));
      for (let distance = 8; distance >= 1; distance -= 1) {
        result.push(cell(arm, "R", distance));
      }
      for (let distance = 1; distance <= 8; distance += 1) {
        result.push(cell(arm, "L", distance));
      }
    }
    return Object.freeze(result);
  }

  const OUTER_CYCLE = makeOuterCycle();
  const CASTLES = new Set();
  for (const arm of ARMS) {
    CASTLES.add(cell(arm, "M", 8));
    CASTLES.add(cell(arm, "L", 4));
    CASTLES.add(cell(arm, "R", 4));
  }

  function colorIndex(color) {
    const index = COLORS.indexOf(color);
    if (index < 0) throw new Error(`Unknown Pachisi colour: ${color}`);
    return index;
  }

  function routeCell(color, progress) {
    colorIndex(color);
    if (progress <= 0 || progress >= 84) return "charkoni";

    const arm = ARM_BY_COLOR[color];
    if (progress <= 8) return cell(arm, "M", progress);

    if (progress <= 76) {
      const entry = OUTER_CYCLE.indexOf(cell(arm, "M", 8));
      return OUTER_CYCLE[(entry + progress - 8) % OUTER_CYCLE.length];
    }

    return cell(arm, "M", 84 - progress);
  }

  function cowrieValue(mouthsUp) {
    if (!Number.isInteger(mouthsUp) || mouthsUp < 0 || mouthsUp > 6) {
      throw new RangeError("mouthsUp must be an integer from 0 to 6");
    }
    if (mouthsUp === 0) return 25;
    if (mouthsUp === 1) return 10;
    return mouthsUp;
  }

  function isGrace(value) {
    return value === 6 || value === 10 || value === 25;
  }

  function clonePiece(piece) {
    return { color: piece.color, index: piece.index, progress: piece.progress };
  }

  class PachisiGame {
    constructor(options = {}) {
      this.rng = new randomizer.SeededRandom(options.seed == null ? 1 : options.seed);
      this.turn = options.turn || "yellow";
      colorIndex(this.turn);
      this.lastThrow = null;
      this.lastMouthsUp = null;
      this.winner = null;
      this.firstDepartureUsed = new Map(COLORS.map(color => [color, false]));
      this.pieces = new Map(
        COLORS.map(color => [
          color,
          Array.from({ length: 4 }, (_, index) => ({ color, index, progress: -1 }))
        ])
      );
    }

    cast() {
      if (this.winner) throw new Error("Game is over");
      if (this.lastThrow !== null) throw new Error("Resolve the current throw first");
      let mouthsUp = 0;
      for (let index = 0; index < 6; index += 1) {
        mouthsUp += this.rng.integer(0, 1);
      }
      this.lastMouthsUp = mouthsUp;
      this.lastThrow = cowrieValue(mouthsUp);
      return this.lastThrow;
    }

    setThrow(mouthsUp) {
      if (this.lastThrow !== null) throw new Error("Resolve the current throw first");
      this.lastMouthsUp = mouthsUp;
      this.lastThrow = cowrieValue(mouthsUp);
      return this.lastThrow;
    }

    piecesFor(color = this.turn) {
      colorIndex(color);
      return this.pieces.get(color);
    }

    occupantsAt(boardCell) {
      const occupants = [];
      for (const color of COLORS) {
        for (const piece of this.pieces.get(color)) {
          if (piece.progress > 0 && piece.progress < 84 && routeCell(color, piece.progress) === boardCell) {
            occupants.push(piece);
          }
        }
      }
      return occupants;
    }

    canEnter(piece, value = this.lastThrow) {
      if (!piece || piece.color !== this.turn || piece.progress !== -1) return false;
      if (!this.firstDepartureUsed.get(piece.color)) return true;
      return isGrace(value);
    }

    destinationFor(piece, value = this.lastThrow) {
      if (!piece || value === null) return null;
      if (piece.progress === 84) return null;
      const target = piece.progress === -1 ? value : piece.progress + value;
      if (piece.progress === -1 && !this.canEnter(piece, value)) return null;
      if (target > 84) return null;

      if (target > 0 && target < 84) {
        const destination = routeCell(piece.color, target);
        if (CASTLES.has(destination)) {
          const enemy = this.occupantsAt(destination).some(
            occupant => TEAM_BY_COLOR[occupant.color] !== TEAM_BY_COLOR[piece.color]
          );
          if (enemy) return null;
        }
      }
      return target;
    }

    legalMoves() {
      if (this.lastThrow === null || this.winner) return [];
      const legal = [];
      for (const piece of this.piecesFor()) {
        const target = this.destinationFor(piece);
        if (target !== null) {
          legal.push({
            color: piece.color,
            pieceIndex: piece.index,
            from: piece.progress,
            to: target,
            boardCell: target === 84 ? "charkoni" : routeCell(piece.color, target)
          });
        }
      }
      return legal;
    }

    move(pieceIndex) {
      if (this.lastThrow === null) throw new Error("Cast the cowries first");
      const move = this.legalMoves().find(candidate => candidate.pieceIndex === pieceIndex);
      if (!move) throw new Error("Illegal Pachisi move");

      const piece = this.piecesFor()[pieceIndex];
      const wasWaiting = piece.progress === -1;
      piece.progress = move.to;
      if (wasWaiting) this.firstDepartureUsed.set(piece.color, true);

      let captured = false;
      if (piece.progress > 0 && piece.progress < 84 && !CASTLES.has(move.boardCell)) {
        for (const occupant of this.occupantsAt(move.boardCell)) {
          if (occupant === piece) continue;
          if (TEAM_BY_COLOR[occupant.color] === TEAM_BY_COLOR[piece.color]) continue;
          occupant.progress = -1;
          captured = true;
        }
      }

      const grace = isGrace(this.lastThrow);
      this.lastThrow = null;
      this.lastMouthsUp = null;
      this.updateWinner();
      if (!this.winner && !grace && !captured) this.advanceTurn();
      return { ...move, captured, extraThrow: grace || captured };
    }

    pass() {
      if (this.lastThrow === null) throw new Error("Cast the cowries first");
      const grace = isGrace(this.lastThrow);
      this.lastThrow = null;
      this.lastMouthsUp = null;
      if (!grace) this.advanceTurn();
    }

    advanceTurn() {
      this.turn = COLORS[(colorIndex(this.turn) + 1) % COLORS.length];
    }

    updateWinner() {
      for (const team of ["yellow-black", "red-green"]) {
        const colors = COLORS.filter(color => TEAM_BY_COLOR[color] === team);
        if (colors.every(color => this.pieces.get(color).every(piece => piece.progress === 84))) {
          this.winner = team;
          return team;
        }
      }
      return null;
    }

    snapshot() {
      return {
        profile: "pachisi-six-cowrie-straightforward",
        turn: this.turn,
        lastThrow: this.lastThrow,
        lastMouthsUp: this.lastMouthsUp,
        winner: this.winner,
        firstDepartureUsed: Object.fromEntries(this.firstDepartureUsed),
        pieces: Object.fromEntries(
          COLORS.map(color => [color, this.pieces.get(color).map(clonePiece)])
        ),
        rng: this.rng.snapshot()
      };
    }
  }

  return Object.freeze({
    PachisiGame,
    COLORS,
    ARMS,
    ARM_BY_COLOR,
    TEAM_BY_COLOR,
    OUTER_CYCLE,
    CASTLES,
    routeCell,
    cowrieValue,
    isGrace
  });
});
