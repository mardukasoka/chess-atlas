"use strict";

const assert = require("assert");
const ChessEngine = require("./engine.js");
const MakrukRules = require("./makruk-rules.js");
const MakrukExtension = require("./makruk-extension.js");

MakrukExtension.install(ChessEngine, MakrukRules);

test("Makruk profile creates the historical starting formation", () => {
  const engine = new ChessEngine("makruk");
  const state = engine.getState();

  assert.deepStrictEqual(state.board[7], ["wR", "wN", "wB", "wK", "wF", "wB", "wN", "wR"]);
  assert.deepStrictEqual(state.board[0], ["bR", "bN", "bB", "bF", "bK", "bB", "bN", "bR"]);
  assert.ok(state.board[5].every(piece => piece === "wP"));
  assert.ok(state.board[2].every(piece => piece === "bP"));
  assert.ok(state.board[6].every(piece => piece === ""));
  assert.ok(state.board[1].every(piece => piece === ""));
});

test("Makruk pawn promotes to met on the sixth rank before turn resolution", () => {
  const engine = new ChessEngine("makruk");
  engine.board = Array.from({ length: 8 }, () => Array(8).fill(""));
  engine.board[7][0] = "wK";
  engine.board[0][7] = "bK";
  engine.board[3][3] = "wP";
  engine.turn = "w";
  engine.gameOver = false;
  engine.selected = null;

  engine.handleSquare(3, 3);
  const state = engine.handleSquare(2, 3);

  assert.strictEqual(state.board[2][3], "wF");
  assert.strictEqual(state.turnCode, "b");
});
