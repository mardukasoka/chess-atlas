"use strict";

(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.ChessAtlasStrategicCombatBridge = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function createScenario({ strategicSystem, encounter, combatants, context, seed = 1 }) {
    if (!strategicSystem) throw new TypeError("strategicSystem is required");
    if (!encounter) throw new TypeError("encounter is required");
    if (!Array.isArray(combatants) || combatants.length < 2) throw new TypeError("combatants are required");
    return {
      kind: "strategic-combat-scenario",
      version: 1,
      strategicSystem,
      encounter: JSON.parse(JSON.stringify(encounter)),
      context: JSON.parse(JSON.stringify(context || {})),
      combatants: JSON.parse(JSON.stringify(combatants)),
      seed,
      status: "pending",
      result: null
    };
  }

  function resolveScenario(scenario, combatResult) {
    if (!scenario || scenario.kind !== "strategic-combat-scenario") throw new TypeError("scenario required");
    if (!combatResult) throw new TypeError("combatResult required");
    return { ...scenario, status: "complete", result: JSON.parse(JSON.stringify(combatResult)) };
  }

  return Object.freeze({ createScenario, resolveScenario });
});
