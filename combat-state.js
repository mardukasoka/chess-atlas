"use strict";

/*
 * Generic Chess Atlas combat-state generator.
 * Mirrors the state-layer approach used by the dimensional/timeline systems:
 * the source game proposes a capture; this module creates an isolated arena
 * state and later returns a neutral result for the source rules engine.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.ChessAtlasCombatState = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const DEFAULT_ARENA = Object.freeze({ width: 960, height: 540 });

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function createCombatState({
    gameId,
    sourceAction,
    attacker,
    defender,
    profiles = {},
    arena = DEFAULT_ARENA,
    seed = 1
  }) {
    if (!gameId) throw new TypeError("gameId is required");
    if (!attacker || !defender) throw new TypeError("attacker and defender are required");

    const width = Number(arena.width) || DEFAULT_ARENA.width;
    const height = Number(arena.height) || DEFAULT_ARENA.height;
    return {
      kind: "combat",
      version: 1,
      gameId,
      sourceAction: clone(sourceAction || null),
      seed,
      status: "active",
      elapsedMs: 0,
      arena: { width, height },
      fighters: [
        {
          role: "attacker",
          sourceId: attacker.id,
          side: attacker.side,
          type: attacker.type,
          profile: clone(profiles.attacker || {}),
          x: width * 0.22,
          y: height * 0.5,
          facing: 1,
          health: 100,
          cooldownMs: 0,
          alive: true
        },
        {
          role: "defender",
          sourceId: defender.id,
          side: defender.side,
          type: defender.type,
          profile: clone(profiles.defender || {}),
          x: width * 0.78,
          y: height * 0.5,
          facing: -1,
          health: 100,
          cooldownMs: 0,
          alive: true
        }
      ],
      projectiles: [],
      hazards: [],
      winner: null
    };
  }

  function finishCombat(state, winnerSourceId) {
    if (!state || state.kind !== "combat") throw new TypeError("Combat state required");
    const winner = state.fighters.find(f => f.sourceId === winnerSourceId);
    if (!winner) throw new Error("Winner must be one of the fighters");
    const loser = state.fighters.find(f => f.sourceId !== winnerSourceId);
    return {
      ...state,
      status: "complete",
      winner: winnerSourceId,
      fighters: state.fighters.map(f => ({ ...f, alive: f.sourceId === winnerSourceId })),
      result: Object.freeze({
        gameId: state.gameId,
        sourceAction: clone(state.sourceAction),
        winnerId: winnerSourceId,
        loserId: loser.sourceId,
        winnerRole: winner.role
      })
    };
  }

  function result(state) {
    return state && state.status === "complete" ? clone(state.result) : null;
  }

  return Object.freeze({ DEFAULT_ARENA, createCombatState, finishCombat, result });
});
