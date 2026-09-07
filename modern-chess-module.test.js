"use strict";

const Modules = require("./game-modules.js");
const ModernChessModule = require("./modern-chess-module.js");

test("modern chess module exposes UCI legal actions", () => {
  Modules.clear();
  Modules.register(ModernChessModule);
  const game = Modules.create(ModernChessModule.id);
  const actions = Modules.legalActions(ModernChessModule.id, game);
  expect(actions.length).toBe(20);
  expect(actions.some(action => action.uci === "e2e4")).toBe(true);
  expect(actions.some(action => action.uci === "g1f3")).toBe(true);
});

test("modern chess module applies a validated UCI action", () => {
  Modules.clear();
  Modules.register(ModernChessModule);
  const game = Modules.create(ModernChessModule.id);
  const action = Modules.legalActions(ModernChessModule.id, game).find(item => item.uci === "e2e4");
  const result = Modules.applyAction(ModernChessModule.id, game, action);
  expect(result.turnCode).toBe("b");
  expect(result.board[4][4]).toBe("wP");
  expect(result.board[6][4]).toBe("");
});
