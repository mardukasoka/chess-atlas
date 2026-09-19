"use strict";

(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.ChessAtlasArchon = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const BOARD_SIZE = 9;
  const SIDES = Object.freeze({ LIGHT: "light", DARK: "dark" });
  const POWER_POINTS = Object.freeze([[0,0],[0,8],[4,4],[8,0],[8,8]]);

  // Data-first scaffold. Combat statistics/spells are intentionally deferred
  // until cross-checked against licensed/reference implementations.
  const BACK_RANK = Object.freeze([
    "valkyrie", "golem", "unicorn", "djinni", "wizard",
    "djinni", "unicorn", "golem", "valkyrie"
  ]);
  const DARK_BACK_RANK = Object.freeze([
    "banshee", "troll", "basilisk", "shapeshifter", "sorceress",
    "shapeshifter", "basilisk", "troll", "banshee"
  ]);

  function piece(id, side, type, row, col) {
    return Object.freeze({ id, side, type, row, col, alive: true });
  }

  function createArmy(side) {
    const home = side === SIDES.LIGHT ? 8 : 0;
    const front = side === SIDES.LIGHT ? 7 : 1;
    const rank = side === SIDES.LIGHT ? BACK_RANK : DARK_BACK_RANK;
    const infantry = side === SIDES.LIGHT ? "knight" : "goblin";
    const pieces = [];
    rank.forEach((type, col) => pieces.push(piece(`${side}-${type}-${col}`, side, type, home, col)));
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      pieces.push(piece(`${side}-${infantry}-${col}`, side, infantry, front, col));
    }
    return pieces;
  }

  function createInitialState() {
    return {
      id: "archon",
      year: 1983,
      board: { rows: BOARD_SIZE, cols: BOARD_SIZE },
      turn: SIDES.LIGHT,
      moveNumber: 1,
      phase: "strategic",
      battle: null,
      pieces: [...createArmy(SIDES.DARK), ...createArmy(SIDES.LIGHT)],
      powerPoints: POWER_POINTS.map(([row, col]) => ({ row, col }))
    };
  }

  function pieceAt(state, row, col) {
    return state.pieces.find(p => p.alive && p.row === row && p.col === col) || null;
  }

  function battleFor(state, move) {
    const attacker = state.pieces.find(p => p.id === move.pieceId && p.alive);
    if (!attacker) return null;
    const defender = pieceAt(state, move.to.row, move.to.col);
    if (!defender || defender.side === attacker.side) return null;
    return { attackerId: attacker.id, defenderId: defender.id, square: { ...move.to } };
  }

  function beginBattle(state, move) {
    const battle = battleFor(state, move);
    if (!battle) return state;
    return { ...state, phase: "battle", battle };
  }

  function resolveBattle(state, winnerId) {
    if (state.phase !== "battle" || !state.battle) throw new Error("No battle to resolve");
    const { attackerId, defenderId, square } = state.battle;
    if (winnerId !== attackerId && winnerId !== defenderId) throw new Error("Winner must be a combatant");
    const loserId = winnerId === attackerId ? defenderId : attackerId;
    const pieces = state.pieces.map(p => {
      if (p.id === loserId) return { ...p, alive: false };
      if (p.id === winnerId) return { ...p, row: square.row, col: square.col };
      return p;
    });
    return {
      ...state,
      pieces,
      phase: "strategic",
      battle: null,
      turn: state.turn === SIDES.LIGHT ? SIDES.DARK : SIDES.LIGHT,
      moveNumber: state.moveNumber + 1
    };
  }

  function powerPointControl(state) {
    const control = { light: 0, dark: 0, vacant: 0 };
    for (const point of state.powerPoints) {
      const occupant = pieceAt(state, point.row, point.col);
      if (!occupant) control.vacant += 1;
      else control[occupant.side] += 1;
    }
    return control;
  }

  return Object.freeze({
    BOARD_SIZE, SIDES, POWER_POINTS,
    createInitialState, pieceAt, battleFor, beginBattle,
    resolveBattle, powerPointControl
  });
});
