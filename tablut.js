"use strict";

/* Tablut profile grounded in Linnaeus's 1732 account as corrected by Olli Salmi.
 * The throne interpretation is explicit rather than silently mixing later tafl rules.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.ChessAtlasTablut = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const SIZE = 9;
  const THRONE = [4, 4];
  const DIRS = [[1,0],[-1,0],[0,1],[0,-1]];
  const key = (r,c) => `${r},${c}`;
  const inside = (r,c) => r >= 0 && r < SIZE && c >= 0 && c < SIZE;
  const same = (a,b) => a[0] === b[0] && a[1] === b[1];
  const sideOf = p => p === "attacker" ? "attackers" : (p === "defender" || p === "king" ? "defenders" : null);
  const enemy = (a,b) => sideOf(a) && sideOf(b) && sideOf(a) !== sideOf(b);

  class TablutGame {
    constructor(options = {}) {
      this.board = new Map();
      this.turn = "attackers";
      this.winner = null;
      this.captured = { attackers: 0, defenders: 0 };
      if (options.setup !== false) this.setup();
    }
    setup() {
      this.board.clear();
      this.set(4,4,"king");
      [[4,2],[4,3],[4,5],[4,6],[2,4],[3,4],[5,4],[6,4]].forEach(([r,c]) => this.set(r,c,"defender"));
      [[0,3],[0,4],[0,5],[1,4],[8,3],[8,4],[8,5],[7,4],[3,0],[4,0],[5,0],[4,1],[3,8],[4,8],[5,8],[4,7]].forEach(([r,c]) => this.set(r,c,"attacker"));
    }
    at(r,c) { return this.board.get(key(r,c)) || null; }
    set(r,c,piece) { if (piece) this.board.set(key(r,c),piece); else this.board.delete(key(r,c)); }
    canStop(piece,r,c) {
      if (!inside(r,c) || this.at(r,c)) return false;
      // Salmi translation: the royal fort cannot be entered once vacated.
      if (same([r,c], THRONE)) return false;
      return true;
    }
    movesFrom(r,c) {
      const piece = this.at(r,c);
      if (!piece || sideOf(piece) !== this.turn || this.winner) return [];
      const out = [];
      for (const [dr,dc] of DIRS) {
        let nr=r+dr, nc=c+dc;
        while (inside(nr,nc) && !this.at(nr,nc)) {
          if (this.canStop(piece,nr,nc)) out.push({type:"move",from:[r,c],to:[nr,nc]});
          // throne is a blocked fort, not a transit square in this profile
          if (same([nr,nc],THRONE)) break;
          nr += dr; nc += dc;
        }
      }
      return out;
    }
    legalActions() {
      if (this.winner) return [];
      const out=[];
      for (const k of this.board.keys()) {
        const [r,c]=k.split(",").map(Number);
        out.push(...this.movesFrom(r,c));
      }
      return out;
    }
    isHostileSupport(r,c,moverSide) {
      const p=this.at(r,c);
      if (p) return sideOf(p) === moverSide;
      return same([r,c],THRONE);
    }
    kingCapturedAt(r,c) {
      if (same([r,c],THRONE)) return DIRS.every(([dr,dc]) => this.at(r+dr,c+dc) === "attacker");
      if (Math.abs(r-4)+Math.abs(c-4) === 1) {
        return DIRS.every(([dr,dc]) => {
          const nr=r+dr,nc=c+dc;
          return same([nr,nc],THRONE) || this.at(nr,nc) === "attacker";
        });
      }
      return DIRS.some(([dr,dc]) => {
        const a=this.at(r+dr,c+dc), b=this.at(r-dr,c-dc);
        return a === "attacker" && b === "attacker";
      });
    }
    resolveCaptures(r,c,piece) {
      const moverSide=sideOf(piece);
      for (const [dr,dc] of DIRS) {
        const ar=r+dr, ac=c+dc, br=r+2*dr, bc=c+2*dc;
        if (!inside(ar,ac)) continue;
        const victim=this.at(ar,ac);
        if (!victim || !enemy(piece,victim)) continue;
        if (victim === "king") {
          if (this.kingCapturedAt(ar,ac)) { this.set(ar,ac,null); this.winner="attackers"; }
          continue;
        }
        if (inside(br,bc) && this.isHostileSupport(br,bc,moverSide)) {
          this.set(ar,ac,null);
          this.captured[sideOf(victim)] += 1;
        }
      }
    }
    apply(action) {
      if (!action || action.type !== "move") throw new Error("Tablut action must be a move");
      const legal=this.movesFrom(...action.from).some(m => same(m.to,action.to));
      if (!legal) throw new Error("Illegal Tablut move");
      const piece=this.at(...action.from);
      this.set(...action.from,null); this.set(...action.to,piece);
      if (piece === "king" && (action.to[0]===0 || action.to[0]===8 || action.to[1]===0 || action.to[1]===8)) this.winner="defenders";
      if (!this.winner) this.resolveCaptures(action.to[0],action.to[1],piece);
      if (!this.winner) this.turn=this.turn === "attackers" ? "defenders" : "attackers";
      return this.snapshot();
    }
    snapshot() {
      return { profile:"tablut-linnaeus-1732-salmi", size:SIZE, throne:[...THRONE], turn:this.turn, winner:this.winner, captured:{...this.captured}, board:[...this.board.entries()].map(([k,piece]) => ({at:k.split(",").map(Number),piece})) };
    }
  }
  return Object.freeze({ SIZE, THRONE, TablutGame });
});
