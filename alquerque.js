"use strict";

/*
 * Alquerque de Doze — Alfonso X / Libro de los Juegos profile (1283).
 *
 * The medieval source securely supports the 5x5 line board, twelve men per
 * player, adjacent movement along drawn lines, capture by hopping an enemy,
 * and victory by taking all opposing men. Later compulsory-capture, huffing,
 * and chained-capture conventions are deliberately not mixed into this profile.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.ChessAtlasAlquerque = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const SIZE = 5;
  const ORTHOGONAL = Object.freeze([[1,0],[-1,0],[0,1],[0,-1]]);
  const DIAGONAL = Object.freeze([[1,1],[1,-1],[-1,1],[-1,-1]]);

  function key(row, col) { return `${row},${col}`; }
  function inside(row, col) { return row >= 0 && row < SIZE && col >= 0 && col < SIZE; }
  function hasDiagonals(row, col) { return (row + col) % 2 === 0; }
  function directions(row, col) { return hasDiagonals(row, col) ? [...ORTHOGONAL, ...DIAGONAL] : [...ORTHOGONAL]; }

  class AlfonsoAlquerqueGame {
    constructor(options = {}) {
      this.turn = options.turn || "white";
      this.board = new Map();
      this.captured = { white: 0, black: 0 };
      this.winner = null;
      if (options.setup !== false) this.setup();
    }

    opponent(player = this.turn) { return player === "white" ? "black" : "white"; }
    at(row, col) { return this.board.get(key(row, col)) || null; }
    set(row, col, player) {
      if (!inside(row, col)) throw new Error("Outside Alquerque board");
      if (player) this.board.set(key(row, col), player);
      else this.board.delete(key(row, col));
    }

    setup() {
      this.board.clear();
      for (let row = 0; row < SIZE; row += 1) {
        for (let col = 0; col < SIZE; col += 1) {
          if (row < 2 || (row === 2 && col > 2)) this.set(row, col, "white");
          else if (row > 2 || (row === 2 && col < 2)) this.set(row, col, "black");
        }
      }
      this.turn = "white";
      this.captured = { white: 0, black: 0 };
      this.winner = null;
    }

    connected(row, col, toRow, toCol) {
      const dr = toRow - row;
      const dc = toCol - col;
      return directions(row, col).some(([r, c]) => r === dr && c === dc);
    }

    movesFrom(row, col) {
      if (this.winner || this.at(row, col) !== this.turn) return [];
      const moves = [];
      for (const [dr, dc] of directions(row, col)) {
        const nr = row + dr;
        const nc = col + dc;
        if (inside(nr, nc) && !this.at(nr, nc)) {
          moves.push({ type: "move", from: [row, col], to: [nr, nc] });
        }
      }
      return moves;
    }

    capturesFrom(row, col) {
      if (this.winner || this.at(row, col) !== this.turn) return [];
      const enemy = this.opponent();
      const captures = [];
      for (const [dr, dc] of directions(row, col)) {
        const mr = row + dr;
        const mc = col + dc;
        const lr = row + 2 * dr;
        const lc = col + 2 * dc;
        if (!inside(lr, lc)) continue;
        if (!this.connected(mr, mc, lr, lc)) continue;
        if (this.at(mr, mc) === enemy && !this.at(lr, lc)) {
          captures.push({ type: "capture", from: [row, col], over: [mr, mc], to: [lr, lc] });
        }
      }
      return captures;
    }

    legalActions() {
      if (this.winner) return [];
      const result = [];
      for (const [cell, player] of this.board.entries()) {
        if (player !== this.turn) continue;
        const [row, col] = cell.split(",").map(Number);
        result.push(...this.movesFrom(row, col), ...this.capturesFrom(row, col));
      }
      return result;
    }

    apply(action) {
      if (!action || !["move", "capture"].includes(action.type)) throw new Error("Invalid Alquerque action");
      const legal = this.legalActions().find(candidate => JSON.stringify(candidate) === JSON.stringify(action));
      if (!legal) throw new Error("Illegal Alquerque action");
      const player = this.turn;
      this.set(...legal.from, null);
      if (legal.type === "capture") {
        const victim = this.at(...legal.over);
        this.set(...legal.over, null);
        this.captured[victim] += 1;
      }
      this.set(...legal.to, player);
      this.updateWinner();
      if (!this.winner) this.turn = this.opponent(player);
      return legal;
    }

    remaining(player) {
      let count = 0;
      for (const value of this.board.values()) if (value === player) count += 1;
      return count;
    }

    updateWinner() {
      if (this.remaining("black") === 0) this.winner = "white";
      else if (this.remaining("white") === 0) this.winner = "black";
      return this.winner;
    }

    snapshot() {
      return {
        profile: "alquerque-alfonso-1283",
        turn: this.turn,
        winner: this.winner,
        captured: { ...this.captured },
        board: Object.fromEntries(this.board)
      };
    }
  }

  return Object.freeze({ AlfonsoAlquerqueGame, SIZE, directions, hasDiagonals });
});
