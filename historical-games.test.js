"use strict";

const GraphGames = require("./graph-games.js");
const Historical = require("./historical-games.js");

describe("Nine Men's Morris graph", () => {
  test("standard graph has 24 playable nodes and 16 mill lines", () => {
    const definition = GraphGames.createNineMensMorrisDefinition();
    expect(definition.nodes).toHaveLength(24);
    expect(definition.winningLines).toHaveLength(16);
  });

  test("placement that forms a mill requires a capture", () => {
    const game = new GraphGames.MorrisGame();

    game.place("a7"); // w
    game.place("b6"); // b
    game.place("d7"); // w
    game.place("d6"); // b
    game.place("g7"); // w forms mill

    expect(game.pendingCapture).toBe(true);
    expect(game.turn).toBe("w");
    game.capture("b6");
    expect(game.pendingCapture).toBe(false);
    expect(game.turn).toBe("b");
    expect(game.board.get("b6")).toBeNull();
  });
});

describe("Royal Game of Ur", () => {
  test("four binary tetrahedral outcomes are deterministic from a seed", () => {
    const first = new Historical.RoyalGameOfUr({ seed: "ur" });
    const second = new Historical.RoyalGameOfUr({ seed: "ur" });
    expect(Array.from({ length: 8 }, () => first.cast()))
      .toEqual(Array.from({ length: 8 }, () => second.cast()));
  });

  test("a rosette grants another turn", () => {
    const game = new Historical.RoyalGameOfUr({ seed: 1 });
    game.lastRoll = 4;
    const result = game.move(0, 4);
    expect(result.to).toBe(3);
    expect(result.extraTurn).toBe(true);
    expect(game.turn).toBe("w");
  });

  test("shared-lane landing captures an opponent except on protected rosette", () => {
    const game = new Historical.RoyalGameOfUr({ seed: 1 });
    game.pieces.get("w")[0] = 4;
    game.pieces.get("b")[0] = 5;
    game.lastRoll = 1;
    game.move(0, 1);
    expect(game.pieces.get("b")[0]).toBe(-1);
  });

  test("the protected central rosette cannot be captured", () => {
    const game = new Historical.RoyalGameOfUr({ seed: 1 });
    game.pieces.get("w")[0] = 6;
    game.pieces.get("b")[0] = 7;
    game.lastRoll = 1;
    expect(game.legalMoves(1).some(move => move.pieceIndex === 0)).toBe(false);
  });

  test("historically uncertain games are labelled as reconstructions", () => {
    expect(Historical.profiles.senet.certainty).toMatch(/reconstructed/);
    expect(Historical.profiles.latrunculi.certainty).toMatch(/reconstructed/);
  });
});
