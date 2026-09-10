"use strict";

const assert = require("assert");
const Modules = require("./game-modules.js");
const Agents = require("./game-agents.js");
const HnefataflModule = require("./hnefatafl-module.js");
const GoModule = require("./go-module.js");
const Backgammon = require("./backgammon.js");
const BackgammonModule = require("./backgammon-module.js");

test("agent runner applies a legal move through a real Hnefatafl module", async () => {
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
  assert.deepStrictEqual(result.action, legal[0]);
  assert.strictEqual(game.turn, "defenders");
  assert.notDeepStrictEqual(Modules.snapshot(gameId, game).board, before.board);
});

test("shared agent runner can play a legal Go turn", async () => {
  Modules.clear();
  Modules.register(GoModule);
  const game = Modules.create("go", { size: 9 });
  const before = Modules.snapshot("go", game);
  const legal = Modules.legalActions("go", game);
  assert.ok(legal.length > 0);
  assert.strictEqual(before.turn, "black");

  const result = await Agents.takeTurn({
    modules: Modules,
    gameId: "go",
    game,
    agent: Agents.randomAgent({ id: "go-test-agent", random: () => 0 })
  });

  assert.strictEqual(result.status, "applied");
  assert.deepStrictEqual(result.action, legal[0]);
  assert.strictEqual(Modules.snapshot("go", game).turn, "white");
});

test("Backgammon exposes dice as chance and checker movement as agent action", async () => {
  Modules.clear();
  Modules.register(BackgammonModule);
  let game = Modules.create("backgammon");

  let result = await Agents.takeTurn({
    modules: Modules,
    gameId: "backgammon",
    game,
    agent: Agents.randomAgent({ id: "bg-test-agent", random: () => 0 })
  });
  assert.strictEqual(result.status, "chance");
  assert.strictEqual(result.actions[0].type, "opening-roll");

  game = Backgammon.start(game, 2, 6);
  const legal = Modules.legalActions("backgammon", game);
  assert.ok(legal.length > 0);
  assert.ok(legal.every(action => action.type === "move" && action.actor !== "chance"));

  result = await Agents.takeTurn({
    modules: Modules,
    gameId: "backgammon",
    game,
    agent: Agents.randomAgent({ id: "bg-test-agent", random: () => 0 })
  });
  assert.strictEqual(result.status, "applied");
  assert.strictEqual(result.action.type, "move");
});
