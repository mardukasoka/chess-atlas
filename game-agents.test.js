"use strict";

const assert = require("assert");
const Agents = require("./game-agents.js");

(async function () {
  const a = { type: "move", n: 1 };
  const b = { type: "move", n: 2 };
  const chance = { actor: "chance", type: "cast" };

  assert.strictEqual(Agents.randomAgent({ random: () => 0 }).chooseAction({ legalActions: [a, b] }), a);
  assert.deepStrictEqual(Agents.playerActions([chance, a]), [a]);
  assert.deepStrictEqual(Agents.chanceActions([chance, a]), [chance]);

  const heuristic = Agents.heuristicAgent({
    random: () => 0,
    scoreAction(action) { return action.n; }
  });
  assert.strictEqual(heuristic.chooseAction({ legalActions: [a, b] }), b);
  assert.strictEqual(heuristic.chooseAction({ legalActions: [chance, a, b] }), b);

  const tied = Agents.heuristicAgent({ random: () => 0.99, scoreAction() { return 5; } });
  assert.strictEqual(tied.chooseAction({ legalActions: [a, b] }), b);

  const modules = {
    legalActions() { return [a, b]; },
    snapshot() { return { turn: 1 }; },
    applyAction(id, game, action) { game.last = action; return game; }
  };
  const game = {};
  const result = await Agents.takeTurn({ modules, gameId: "test", game, agent: Agents.randomAgent({ random: () => 0.99 }) });
  assert.strictEqual(result.status, "applied");
  assert.strictEqual(result.action, b);
  assert.strictEqual(game.last, b);

  const heuristicResult = await Agents.takeTurn({ modules, gameId: "test", game: {}, agent: heuristic });
  assert.strictEqual(heuristicResult.status, "applied");
  assert.strictEqual(heuristicResult.action, b);

  const chanceResult = await Agents.takeTurn({
    modules: { ...modules, legalActions() { return [chance]; } },
    gameId: "chance-test",
    game: {},
    agent: Agents.randomAgent()
  });
  assert.strictEqual(chanceResult.status, "chance");
  assert.deepStrictEqual(chanceResult.actions, [chance]);

  const illegalAgent = { id: "illegal", chooseAction() { return { type: "invented" }; } };
  await assert.rejects(() => Agents.choose(illegalAgent, { legalActions: [a] }), /outside legalActions/);

  console.log("game-agents tests passed");
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
