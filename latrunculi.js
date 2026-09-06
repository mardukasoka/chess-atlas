"use strict";

/*
 * Ludus Latrunculorum — Ulrich Schädler 1994 reconstruction.
 *
 * The Roman game's complete rules do not survive. This engine therefore names
 * the modern reconstruction it implements rather than presenting these rules
 * as a canonical ancient ruleset.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.ChessAtlasLatrunculi = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const EMPTY = null;
  const DIRECTIONS = Object.freeze([[1,0],[-1,0],[0,1],[0,-1]]);

  function key(row, col) { return `${row},${col}`; }
  function parse(cell) { return cell.split(",").map(Number); }

  class Schadler1994Game {
    constructor(options = {}) {
      this.rows = options.rows || 8;
      this.cols = options.cols || 8;
      this.piecesPerPlayer = options.piecesPerPlayer || 16;
      this.turn = options.turn || "black";
      this.phase = "placement";
      this.board = new Map();
      this.placed = { black: 0, white: 0 };
      this.captured = { black: 0, white: 0 };
      this.trapped = new Set();
      this.winner = null;
    }

    opponent(player = this.turn) { return player === "black" ? "white" : "black"; }
    inside(row, col) { return row >= 0 && row < this.rows && col >= 0 && col < this.cols; }
    at(row, col) { return this.board.get(key(row, col)) || EMPTY; }
    set(row, col, player) {
      const cell = key(row, col);
      if (player) this.board.set(cell, player); else this.board.delete(cell);
    }

    place(row, col) {
      if (this.phase !== "placement" || this.winner) throw new Error("Not in placement phase");
      if (!this.inside(row, col) || this.at(row, col)) throw new Error("Illegal placement");
      this.set(row, col, this.turn);
      this.placed[this.turn] += 1;
      if (this.placed.black === this.piecesPerPlayer && this.placed.white === this.piecesPerPlayer) {
        this.phase = "movement";
      }
      this.advanceTurn();
      return { row, col };
    }

    isTrapped(row, col) { return this.trapped.has(key(row, col)); }

    trappingPairs(row, col, player) {
      const pairs = [];
      if (this.at(row, col) !== player) return pairs;
      const enemy = this.opponent(player);
      for (const [[dr1, dc1], [dr2, dc2]] of [
        [[[1,0]], [[-1,0]]], [[[0,1]], [[0,-1]]]
      ]) {
        const a = [row + dr1, col + dc1];
        const b = [row + dr2, col + dc2];
        if (this.inside(...a) && this.inside(...b) && this.at(...a) === enemy && this.at(...b) === enemy) {
          pairs.push([a, b]);
        }
      }
      return pairs;
    }

    refreshTraps() {
      this.trapped.clear();
      for (const [cell, player] of this.board.entries()) {
        const [row, col] = parse(cell);
        if (this.trappingPairs(row, col, player).length) this.trapped.add(cell);
      }
    }

    adjacentMoves(row, col) {
      if (this.phase !== "movement" || this.at(row, col) !== this.turn || this.isTrapped(row, col)) return [];
      return DIRECTIONS.map(([dr, dc]) => [row + dr, col + dc])
        .filter(([r, c]) => this.inside(r, c) && !this.at(r, c));
    }

    jumpSequences(row, col) {
      if (this.phase !== "movement" || this.at(row, col) !== this.turn || this.isTrapped(row, col)) return [];
      const results = [];
      const start = key(row, col);
      const visit = (r, c, path, visited) => {
        for (const [dr, dc] of DIRECTIONS) {
          const mr = r + dr, mc = c + dc, lr = r + 2 * dr, lc = c + 2 * dc;
          if (!this.inside(lr, lc) || !this.at(mr, mc) || this.at(lr, lc)) continue;
          const landing = key(lr, lc);
          if (visited.has(landing) || landing === start) continue;
          const nextPath = [...path, [lr, lc]];
          results.push(nextPath);
          const nextVisited = new Set(visited); nextVisited.add(landing);
          visit(lr, lc, nextPath, nextVisited);
        }
      };
      visit(row, col, [], new Set([start]));
      return results;
    }

    legalMoves() {
      if (this.phase !== "movement" || this.winner) return [];
      const moves = [];
      for (const [cell, player] of this.board.entries()) {
        if (player !== this.turn) continue;
        const [row, col] = parse(cell);
        for (const to of this.adjacentMoves(row, col)) moves.push({ type: "step", from: [row,col], to });
        for (const path of this.jumpSequences(row, col)) moves.push({ type: "jump", from: [row,col], path, to: path[path.length - 1] });
      }
      return moves;
    }

    move(fromRow, fromCol, toRow, toCol, path = null) {
      if (this.phase !== "movement" || this.winner) throw new Error("Not in movement phase");
      const legal = this.legalMoves().find(move => move.from[0] === fromRow && move.from[1] === fromCol && move.to[0] === toRow && move.to[1] === toCol && (!path || JSON.stringify(move.path || []) === JSON.stringify(path)));
      if (!legal) throw new Error("Illegal Latrunculi move");
      const player = this.turn;
      this.set(fromRow, fromCol, null);
      this.set(toRow, toCol, player);
      this.refreshTraps();
      this.advanceTurn();
      this.updateWinner();
      return legal;
    }

    capturable() {
      if (this.phase !== "movement" || this.winner) return [];
      const enemy = this.opponent(this.turn);
      const result = [];
      for (const cell of this.trapped) {
        const [row, col] = parse(cell);
        if (this.at(row, col) !== enemy) continue;
        const pairs = this.trappingPairs(row, col, enemy);
        if (pairs.some(pair => pair.every(([r,c]) => this.at(r,c) === this.turn && !this.isTrapped(r,c)))) result.push([row,col]);
      }
      return result;
    }

    capture(row, col) {
      if (!this.capturable().some(([r,c]) => r === row && c === col)) throw new Error("Piece is not capturable this turn");
      const victim = this.at(row, col);
      this.set(row, col, null);
      this.captured[victim] += 1;
      this.refreshTraps();
      this.advanceTurn();
      this.updateWinner();
      return { row, col, victim };
    }

    remaining(player) { return this.placed[player] - this.captured[player]; }

    updateWinner() {
      if (this.phase !== "movement") return null;
      if (this.remaining("black") <= 1) this.winner = "white";
      else if (this.remaining("white") <= 1) this.winner = "black";
      return this.winner;
    }

    advanceTurn() { this.turn = this.opponent(this.turn); }

    snapshot() {
      return {
        profile: "latrunculi-schadler-1994",
        rows: this.rows, cols: this.cols, piecesPerPlayer: this.piecesPerPlayer,
        phase: this.phase, turn: this.turn, winner: this.winner,
        placed: { ...this.placed }, captured: { ...this.captured },
        board: Object.fromEntries(this.board), trapped: [...this.trapped]
      };
    }
  }

  return Object.freeze({ Schadler1994Game, DIRECTIONS });
});
