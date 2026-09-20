"use strict";

const Combat = typeof module !== "undefined" && module.exports
  ? require("./combat-state.js")
  : window.ChessAtlasCombatState;
const Archon = typeof module !== "undefined" && module.exports
  ? require("./archon-state.js")
  : window.ChessAtlasArchon;
const Profiles = typeof module !== "undefined" && module.exports
  ? require("./archon-combatants.js")
  : window.ChessAtlasArchonCombatants;

function createArchonCombat(state, move) {
  const battle = Archon.battleFor(state, move);
  if (!battle) return null;
  const attacker = state.pieces.find(p => p.id === battle.attackerId);
  const defender = state.pieces.find(p => p.id === battle.defenderId);
  return Combat.createCombatState({
    gameId: "archon",
    sourceAction: move,
    attacker,
    defender,
    profiles: {
      attacker: Profiles.arenaProfile(attacker.side, attacker.type, defender.side, defender.type),
      defender: Profiles.arenaProfile(defender.side, defender.type, attacker.side, attacker.type)
    }
  });
}

function applyArchonCombatResult(state, combatState) {
  const outcome = Combat.result(combatState);
  if (!outcome) throw new Error("Combat is not complete");
  const battleState = state.phase === "battle"
    ? state
    : Archon.beginBattle(state, outcome.sourceAction);
  return Archon.resolveBattle(battleState, outcome.winnerId);
}

const ArchonCombatAdapter = Object.freeze({
  createArchonCombat,
  applyArchonCombatResult
});

if (typeof module !== "undefined" && module.exports) module.exports = ArchonCombatAdapter;
if (typeof window !== "undefined") window.ChessAtlasArchonCombatAdapter = ArchonCombatAdapter;
