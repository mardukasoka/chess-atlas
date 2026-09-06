"use strict";

const modules = require("./game-modules.js");

describe("Alquerque game module", () => {
  beforeEach(() => modules.clear());

  test("registers and exposes the shared agent-facing contract", () => {
    const moduleDef = require("./alquerque-module.js");
    if (!modules.get(moduleDef.id)) modules.register(moduleDef);
    expect(modules.get(moduleDef.id)).not.toBeNull();
    const game = modules.create(moduleDef.id);
    const actions = modules.legalActions(moduleDef.id, game);
    expect(actions.length).toBeGreaterThan(0);
    const before = modules.snapshot(moduleDef.id, game);
    modules.applyAction(moduleDef.id, game, actions[0]);
    const after = modules.snapshot(moduleDef.id, game);
    expect(after.board).not.toEqual(before.board);
  });
});
