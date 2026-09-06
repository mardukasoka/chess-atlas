"use strict";

/*
 * Lightweight game-module registry.
 *
 * A module is the seam between a rules engine, the UI, and future agents.
 * Engines remain free to keep their own internal API; adapters expose a small
 * common surface without forcing every historical game into one rules model.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.ChessAtlasGameModules = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const modules = new Map();

  function validateModule(module) {
    if (!module || typeof module !== "object") throw new TypeError("Game module must be an object");
    if (!module.id || typeof module.id !== "string") throw new TypeError("Game module id is required");
    if (!module.name || typeof module.name !== "string") throw new TypeError("Game module name is required");
    if (typeof module.create !== "function") throw new TypeError(`Game module ${module.id} requires create()`);
    if (module.legalActions && typeof module.legalActions !== "function") throw new TypeError(`Game module ${module.id} legalActions must be a function`);
    if (module.applyAction && typeof module.applyAction !== "function") throw new TypeError(`Game module ${module.id} applyAction must be a function`);
    if (module.snapshot && typeof module.snapshot !== "function") throw new TypeError(`Game module ${module.id} snapshot must be a function`);
    return module;
  }

  function register(module) {
    validateModule(module);
    if (modules.has(module.id)) throw new Error(`Game module already registered: ${module.id}`);
    const frozen = Object.freeze({ ...module });
    modules.set(frozen.id, frozen);
    return frozen;
  }

  function unregister(id) {
    return modules.delete(id);
  }

  function get(id) {
    return modules.get(id) || null;
  }

  function list() {
    return [...modules.values()];
  }

  function create(id, options) {
    const module = get(id);
    if (!module) throw new Error(`Unknown game module: ${id}`);
    return module.create(options);
  }

  function legalActions(id, game) {
    const module = get(id);
    if (!module) throw new Error(`Unknown game module: ${id}`);
    if (typeof module.legalActions !== "function") throw new Error(`Game module ${id} does not expose legalActions()`);
    const actions = module.legalActions(game);
    if (!Array.isArray(actions)) throw new TypeError(`Game module ${id} legalActions() must return an array`);
    return actions;
  }

  function applyAction(id, game, action) {
    const module = get(id);
    if (!module) throw new Error(`Unknown game module: ${id}`);
    if (typeof module.applyAction !== "function") throw new Error(`Game module ${id} does not expose applyAction()`);
    return module.applyAction(game, action);
  }

  function snapshot(id, game) {
    const module = get(id);
    if (!module) throw new Error(`Unknown game module: ${id}`);
    if (typeof module.snapshot === "function") return module.snapshot(game);
    if (game && typeof game.snapshot === "function") return game.snapshot();
    return null;
  }

  function clear() {
    modules.clear();
  }

  return Object.freeze({
    register,
    unregister,
    get,
    list,
    create,
    legalActions,
    applyAction,
    snapshot,
    clear,
    validateModule
  });
});
