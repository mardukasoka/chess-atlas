"use strict";

/*
 * Compact Chaupar/Chausar engine. This implements a documented typical profile,
 * not a claim of one universal historical ruleset: traditional rules vary.
 * The cross-board topology is shared with Pachisi, while Chaupar uses three
 * long dice, fixed starts, split throws and conglomerate pieces.
 */
(function (root, factory) {
  const api = factory(
    typeof module !== "undefined" && module.exports
      ? require("./randomizer.js")
      : root.ChessAtlasRandomizer,
    typeof module !== "undefined" && module.exports
      ? require("./pachisi.js")
      : root.ChessAtlasPachisi
  );
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.ChessAtlasChaupar = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (randomizer, pachisi) {
  const { COLORS, TEAM_BY_COLOR, routeCell } = pachisi;
  const LONG_DIE_FACES = Object.freeze([1, 2, 5, 6]);
  const START_PROGRESS = Object.freeze([6, 7, 23, 24]);

  function colorIndex(color) {
    const index = COLORS.indexOf(color);
    if (index < 0) throw new Error(`Unknown Chaupar colour: ${color}`);
    return index;
  }

  function validateDie(value) {
    if (!LONG_DIE_FACES.includes(value)) {
      throw new RangeError("Each Chaupar long die must be 1, 2, 5 or 6");
    }
    return value;
  }

  function clonePiece(piece) {
    return { color: piece.color, index: piece.index, progress: piece.progress };
  }

  function subsets(values) {
    const result = [];
    for (let mask = 1; mask < (1 << values.length); mask += 1) {
      const indices = [];
      let total = 0;
      for (let index = 0; index < values.length; index += 1) {
        if (mask & (1 << index)) {
          indices.push(index);
          total += values[index];
        }
      }
      result.push({ indices, total });
    }
    return result;
  }

  class ChauparGame {
    constructor(options = {}) {
      this.rng = new randomizer.SeededRandom(options.seed == null ? 1 : options.seed);
      this.turn = options.turn || "yellow";
      colorIndex(this.turn);
      this.dice = [];
      this.winner = null;
      this.pieces = new Map(
        COLORS.map(color => [
          color,
          START_PROGRESS.map((progress, index) => ({ color, index, progress }))
        ])
      );
    }

    throwDice() {
      if (this.winner) throw new Error("Game is over");
      if (this.dice.length) throw new Error("Resolve the current dice first");
      this.dice = Array.from({ length: 3 }, () => this.rng.choose(LONG_DIE_FACES));
      return [...this.dice];
    }

    setDice(values) {
      if (this.dice.length) throw new Error("Resolve the current dice first");
      if (!Array.isArray(values) || values.length !== 3) {
        throw new RangeError("Chaupar uses exactly three long dice");
      }
      this.dice = values.map(validateDie);
      return [...this.dice];
    }

    piecesFor(color = this.turn) {
      colorIndex(color);
      return this.pieces.get(color);
    }

    boardCell(piece) {
      if (piece.progress < 0 || piece.progress >= 84) return "charkoni";
      return routeCell(piece.color, piece.progress);
    }

    groupForPiece(piece) {
      if (!piece || piece.progress < 0 || piece.progress >= 84) return piece ? [piece] : [];
      const boardCell = this.boardCell(piece);
      return this.piecesFor(piece.color).filter(candidate =>
        candidate.progress >= 0 && candidate.progress < 84 && this.boardCell(candidate) === boardCell
      );
    }

    enemyGroupsAt(boardCell, color) {
      const groups = [];
      for (const enemyColor of COLORS) {
        if (TEAM_BY_COLOR[enemyColor] === TEAM_BY_COLOR[color]) continue;
        const occupants = this.piecesFor(enemyColor).filter(piece =>
          piece.progress >= 0 && piece.progress < 84 && this.boardCell(piece) === boardCell
        );
        if (occupants.length) groups.push(occupants);
      }
      return groups;
    }

    legalMoves() {
      if (!this.dice.length || this.winner) return [];
      const legal = [];
      const seen = new Set();
      for (const piece of this.piecesFor()) {
        if (piece.progress < 0 || piece.progress >= 84) continue;
        const group = this.groupForPiece(piece);
        const representative = Math.min(...group.map(member => member.index));
        if (piece.index !== representative) continue;

        for (const option of subsets(this.dice)) {
          const target = piece.progress + option.total;
          if (target > 84) continue;
          const boardCell = target === 84 ? "charkoni" : routeCell(piece.color, target);
          const enemyGroups = target === 84 ? [] : this.enemyGroupsAt(boardCell, piece.color);
          if (enemyGroups.some(enemy => enemy.length > group.length)) continue;
          const key = `${representative}:${option.indices.join(",")}:${target}`;
          if (seen.has(key)) continue;
          seen.add(key);
          legal.push({
            color: piece.color,
            pieceIndex: representative,
            groupSize: group.length,
            diceIndices: option.indices,
            distance: option.total,
            from: piece.progress,
            to: target,
            boardCell
          });
        }
      }
      return legal;
    }

    move(pieceIndex, diceIndices) {
      if (!this.dice.length) throw new Error("Throw the long dice first");
      const normalized = [...diceIndices].sort((a, b) => a - b);
      const move = this.legalMoves().find(candidate =>
        candidate.pieceIndex === pieceIndex &&
        candidate.diceIndices.length === normalized.length &&
        candidate.diceIndices.every((value, index) => value === normalized[index])
      );
      if (!move) throw new Error("Illegal Chaupar move");

      const piece = this.piecesFor()[pieceIndex];
      const group = this.groupForPiece(piece);
      for (const member of group) member.progress = move.to;

      let captured = 0;
      if (move.to < 84) {
        for (const enemyGroup of this.enemyGroupsAt(move.boardCell, piece.color)) {
          if (enemyGroup.length <= group.length) {
            for (const enemy of enemyGroup) enemy.progress = -1;
            captured += enemyGroup.length;
          }
        }
      }

      this.dice = this.dice.filter((_, index) => !normalized.includes(index));
      this.updateWinner();
      if (!this.winner && !this.dice.length) this.advanceTurn();
      return { ...move, captured, remainingDice: [...this.dice] };
    }

    pass() {
      if (!this.dice.length) throw new Error("Throw the long dice first");
      if (this.legalMoves().length) throw new Error("A Chaupar throw cannot be passed while a legal move remains");
      this.dice = [];
      this.advanceTurn();
    }

    advanceTurn() {
      this.turn = COLORS[(colorIndex(this.turn) + 1) % COLORS.length];
    }

    updateWinner() {
      // In this documented partnership profile, black must finish before yellow,
      // and red before green. The team wins when both partner colours are home.
      for (const team of ["yellow-black", "red-green"]) {
        const colors = COLORS.filter(color => TEAM_BY_COLOR[color] === team);
        if (colors.every(color => this.piecesFor(color).every(piece => piece.progress === 84))) {
          this.winner = team;
          return team;
        }
      }
      return null;
    }

    canFinishColor(color) {
      if (color === "yellow") return this.piecesFor("black").every(piece => piece.progress === 84);
      if (color === "green") return this.piecesFor("red").every(piece => piece.progress === 84);
      return true;
    }

    snapshot() {
      return {
        profile: "chaupar-three-long-dice-typical",
        turn: this.turn,
        dice: [...this.dice],
        winner: this.winner,
        pieces: Object.fromEntries(COLORS.map(color => [color, this.piecesFor(color).map(clonePiece)])),
        rng: this.rng.snapshot()
      };
    }
  }

  // Apply the partnership finishing-order restriction to generated moves.
  const baseLegalMoves = ChauparGame.prototype.legalMoves;
  ChauparGame.prototype.legalMoves = function legalMovesWithFinishOrder() {
    return baseLegalMoves.call(this).filter(move => move.to !== 84 || this.canFinishColor(move.color));
  };

  return Object.freeze({
    ChauparGame,
    LONG_DIE_FACES,
    START_PROGRESS
  });
});
