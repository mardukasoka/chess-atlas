"use strict";

const assert = require("assert");
const Modules = require("./game-modules.js");
const Agents = require("./game-agents.js");
const HnefataflModule = require("./hnefatafl-module.js");

(async function () {
  Modules.clear();
  Modules.register(HnefataflModule);

  const gameId = HnefataflModule.id;
  const game = Modules.create(gameId);
  const before = Modules.snapshot(gameId, game);
  const legal = Modules.legalActions(gameId, game);

  assert.ok(legal.length > 0, "real game module should expose legal actions");
  assert.strictEqual(before.turn, "attackers");

  const result = await Agents.takeTurn({
    modules: Modules,
    gameId,
    game,
    agent: Agents.randomAgent({ random: () => 0 })
  });

  assert.strictEqual(result.status, "applied");
  assert.strictEqual(result.action, legal[0]);
  assert.strictEqual(game.turn, "defenders");
  assert.notDeepStrictEqual(Modules.snapshot(gameId, game).board, before.board);

  console.log("game-agents integration tests passed");
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
