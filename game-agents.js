"use strict";

/*
 * Lightweight agent seam for Chess Atlas game modules.
 *
 * Agents choose only from legal actions exposed by a game module. The rules
 * engine remains authoritative: every chosen action is applied through the
 * module adapter, so an agent cannot bypass game validation.
 *
 * Chance is deliberately not an agent decision. Modules may mark actions with
 * actor: "chance"; callers should resolve those through the engine before
 * asking a player agent to choose.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.ChessAtlasGameAgents = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function validateAgent(agent) {
    if (!agent || typeof agent !== "object") throw new TypeError("Agent must be an object");
    if (!agent.id || typeof agent.id !== "string") throw new TypeError("Agent id is required");
    if (typeof agent.chooseAction !== "function") throw new TypeError(`Agent ${agent.id} requires chooseAction()`);
    return agent;
  }

  function playerActions(actions) {
    return actions.filter(action => !action || action.actor !== "chance");
  }

  function chanceActions(actions) {
    return actions.filter(action => action && action.actor === "chance");
  }

  function randomAgent(options) {
    const opts = options || {};
    const random = typeof opts.random === "function" ? opts.random : Math.random;
    return Object.freeze({
      id: opts.id || "random",
      name: opts.name || "Random",
      chooseAction(context) {
        const actions = playerActions(context.legalActions || []);
        if (!actions.length) return null;
        return actions[Math.floor(random() * actions.length)];
      }
    });
  }

  async function choose(agent, context) {
    validateAgent(agent);
    const actions = Array.isArray(context && context.legalActions) ? context.legalActions : [];
    const available = playerActions(actions);
    if (!available.length) return null;
    const action = await agent.chooseAction({ ...context, legalActions: available.slice() });
    if (action == null) return null;
    if (!available.includes(action)) {
      throw new Error(`Agent ${agent.id} selected an action outside legalActions`);
    }
    return action;
  }

  async function takeTurn(options) {
    const opts = options || {};
    const modules = opts.modules;
    if (!modules || typeof modules.legalActions !== "function" || typeof modules.applyAction !== "function") {
      throw new TypeError("takeTurn requires a game-module registry");
    }
    if (!opts.gameId) throw new TypeError("takeTurn requires gameId");
    const actions = modules.legalActions(opts.gameId, opts.game);
    const pendingChance = chanceActions(actions);
    if (pendingChance.length) {
      return Object.freeze({ status: "chance", actions: pendingChance.slice(), action: null, result: null });
    }
    const action = await choose(opts.agent, {
      gameId: opts.gameId,
      game: opts.game,
      snapshot: typeof modules.snapshot === "function" ? modules.snapshot(opts.gameId, opts.game) : null,
      legalActions: actions
    });
    if (action == null) return Object.freeze({ status: "no-action", actions: [], action: null, result: null });
    const result = modules.applyAction(opts.gameId, opts.game, action);
    return Object.freeze({ status: "applied", actions: [], action, result });
  }

  return Object.freeze({ validateAgent, randomAgent, choose, takeTurn, playerActions, chanceActions });
});
