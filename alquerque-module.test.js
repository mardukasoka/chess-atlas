"use strict";

const modules = require("./game-modules.js");

describe("Alquerque game module", () => {
  beforeEach(() => modules.clear());

  test("registers and exposes the shared agent-facing contract", () => {
    jest.resetModules();
    const registry = require("./game-modules.js");
    registry.clear();
    const moduleDef = require("./alquerque-module.js");
    expect(registry.get(moduleDef.id)).not.toBeNull();
    const game = registry.create(moduleDef.id);
    const actions = registry.legalActions(moduleDef.id, game);
    expect(actions.length).toBeGreaterThan(0);
    const before = registry.snapshot(moduleDef.id, game);
    registry.applyAction(moduleDef.id, game, actions[0]);
    const after = registry.snapshot(moduleDef.id, game);
    expect(after.board).not.toEqual(before.board);
  });
});
