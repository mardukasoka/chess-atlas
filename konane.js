"use strict";

/*
 * Kōnane: full-board alternating setup, two opening removals, then mandatory
 * orthogonal captures. Multi-jumps may continue in one straight direction and
 * may stop after any capture. The player with no capture on their turn loses.
 */

const ORTHOGONAL = Object.freeze([
  Object.freeze([-1, 0]),
  Object.freeze([1, 0]),
  Object.freeze([0, -1]),
  Object.freeze([0, 1])
]);

function coordinateKey([row, col]) {
  return `${row},${col}`;
}

class KonaneGame {
  constructor(options = {}) {
    this.rows = options.rows ?? options.size ?? 8;
    this.cols = options.cols ?? options.size ?? 8;
    if (!Number.isInteger(this.rows) || !Number.isInteger(this.cols) || this.rows < 3 || this.cols < 3) {
      throw new RangeError("Konane board dimensions must be integers >= 3");
    }

    this.board = Array.from({ length: this.rows }, (_, row) =>
      Array.from({ length: this.cols }, (_, col) => ((row + col) % 2 === 0 ? "b" : "w"))
    );
    this.phase = "black-removal";
    this.turn = "b";
    this.firstHole = null;
    this.winner = null;
  }

  inside([row, col]) {
    return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
  }

  get([row, col]) {
    return this.inside([row, col]) ? this.board[row][col] : null;
  }

  set([row, col], value) {
    if (!this.inside([row, col])) throw new RangeError("Konane coordinate outside board");
    this.board[row][col] = value;
  }

  corners() {
    return [[0, 0], [0, this.cols - 1], [this.rows - 1, 0], [this.rows - 1, this.cols - 1]];
  }

  centerCells() {
    const rowCenters = this.rows % 2 === 0
      ? [this.rows / 2 - 1, this.rows / 2]
      : [Math.floor(this.rows / 2)];
    const colCenters = this.cols % 2 === 0
      ? [this.cols / 2 - 1, this.cols / 2]
      : [Math.floor(this.cols / 2)];
    return rowCenters.flatMap(row => colCenters.map(col => [row, col]));
  }

  blackOpeningChoices() {
    const seen = new Set();
    return [...this.corners(), ...this.centerCells()]
      .filter(coordinate => {
        const key = coordinateKey(coordinate);
        if (seen.has(key)) return false;
        seen.add(key);
        return this.get(coordinate) === "b";
      });
  }

  whiteOpeningChoices() {
    if (!this.firstHole) return [];
    return ORTHOGONAL
      .map(([dr, dc]) => [this.firstHole[0] + dr, this.firstHole[1] + dc])
      .filter(coordinate => this.inside(coordinate) && this.get(coordinate) === "w");
  }

  removeOpening(coordinate) {
    const target = [...coordinate];
    if (this.phase === "black-removal") {
      const legal = this.blackOpeningChoices().some(choice => coordinateKey(choice) === coordinateKey(target));
      if (!legal) throw new RangeError("Black must remove a black corner or center stone");
      this.set(target, null);
      this.firstHole = target;
      this.phase = "white-removal";
      this.turn = "w";
      return this;
    }

    if (this.phase === "white-removal") {
      const legal = this.whiteOpeningChoices().some(choice => coordinateKey(choice) === coordinateKey(target));
      if (!legal) throw new RangeError("White must remove a stone orthogonally adjacent to the first hole");
      this.set(target, null);
      this.phase = "play";
      this.turn = "b";
      return this;
    }

    throw new RangeError("Konane opening removals are complete");
  }

  jumpsFrom(from, side = this.turn) {
    if (this.phase !== "play" || this.get(from) !== side) return [];
    const opponent = side === "b" ? "w" : "b";
    const moves = [];

    for (const [dr, dc] of ORTHOGONAL) {
      let current = [...from];
      const captures = [];
      let distance = 0;

      while (true) {
        const jumped = [current[0] + dr, current[1] + dc];
        const landing = [current[0] + 2 * dr, current[1] + 2 * dc];
        if (!this.inside(landing) || this.get(jumped) !== opponent || this.get(landing) !== null) break;

        captures.push(jumped);
        distance++;
        moves.push({
          from: [...from],
          to: [...landing],
          direction: [dr, dc],
          jumps: distance,
          captures: captures.map(coordinate => [...coordinate])
        });
        current = landing;
      }
    }

    return moves;
  }

  legalMoves(side = this.turn) {
    if (this.phase !== "play" || this.winner) return [];
    const moves = [];
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (this.board[row][col] === side) moves.push(...this.jumpsFrom([row, col], side));
      }
    }
    return moves;
  }

  move(from, to) {
    if (this.phase !== "play" || this.winner) throw new RangeError("Konane game is not accepting moves");
    const key = coordinateKey(to);
    const move = this.jumpsFrom(from, this.turn).find(candidate => coordinateKey(candidate.to) === key);
    if (!move) throw new RangeError("Illegal Konane capture");

    const piece = this.get(from);
    this.set(from, null);
    for (const captured of move.captures) this.set(captured, null);
    this.set(to, piece);

    const mover = this.turn;
    this.turn = mover === "b" ? "w" : "b";
    if (this.legalMoves(this.turn).length === 0) this.winner = mover;
    return { ...move, winner: this.winner };
  }

  snapshot() {
    return Object.freeze({
      phase: this.phase,
      turn: this.turn,
      winner: this.winner,
      board: Object.freeze(this.board.map(row => Object.freeze([...row])))
    });
  }
}

const Konane = { KonaneGame, ORTHOGONAL };

if (typeof module !== "undefined" && module.exports) module.exports = Konane;
if (typeof window !== "undefined") window.ChessAtlasKonane = Konane;
