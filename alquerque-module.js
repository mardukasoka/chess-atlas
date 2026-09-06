"use strict";

(function (root, factory) {
  const api = factory(
    typeof require === "function" ? require("./alquerque.js") : root.ChessAtlasAlquerque,
    typeof require === "function" ? require("./game-modules.js") : root.ChessAtlasGameModules
  );
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.ChessAtlasAlquerqueModule = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (engine, modules) {
  if (!engine) throw new Error("Alquerque engine not loaded");

  const gameModule = Object.freeze({
    id: "alquerque-alfonso-1283",
    name: "Alquerque de Doze — Alfonso X (1283)",
    create(options) { return new engine.AlfonsoAlquerqueGame(options); },
    legalActions(game) { return game.legalActions(); },
    applyAction(game, action) { return game.apply(action); },
    snapshot(game) { return game.snapshot(); }
  });

  if (modules && !modules.get(gameModule.id)) modules.register(gameModule);
  return gameModule;
});
