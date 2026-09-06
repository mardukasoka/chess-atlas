"use strict";

const { Schadler1994Game } = require("./latrunculi.js");

function movementGame(options = {}) {
  const game = new Schadler1994Game(options);
  game.phase = "movement";
  return game;
}

describe("Ludus Latrunculorum — Schädler 1994 reconstruction", () => {
  test("identifies the reconstruction explicitly in snapshots", () => {
    const game = new Schadler1994Game();
    expect(game.snapshot().profile).toBe("latrunculi-schadler-1994");
  });

  test("alternating placement leads into movement after both armies are placed", () => {
    const game = new Schadler1994Game({ rows: 4, cols: 4, piecesPerPlayer: 2 });
    game.place(0, 0);
    game.place(3, 3);
    game.place(0, 1);
    game.place(3, 2);

    expect(game.phase).toBe("movement");
    expect(game.turn).toBe("black");
    expect(game.placed).toEqual({ black: 2, white: 2 });
  });

  test("movement is one empty orthogonal square", () => {
    const game = movementGame({ rows: 5, cols: 5 });
    game.set(2, 2, "black");
    game.set(2, 3, "white");
    game.refreshTraps();

    expect(game.adjacentMoves(2, 2)).toEqual(expect.arrayContaining([[3, 2], [1, 2], [2, 1]]));
    expect(game.adjacentMoves(2, 2)).not.toContainEqual([2, 3]);
    expect(game.adjacentMoves(2, 2)).not.toContainEqual([3, 3]);
  });

  test("a piece can make a multiple orthogonal leap over occupied pieces", () => {
    const game = movementGame({ rows: 5, cols: 5 });
    game.set(2, 0, "black");
    game.set(2, 1, "white");
    game.set(2, 3, "black");
    game.refreshTraps();

    const sequences = game.jumpSequences(2, 0);
    expect(sequences).toContainEqual([[2, 2]]);
    expect(sequences).toContainEqual([[2, 2], [2, 4]]);
  });

  test("custodial enclosure immobilises the surrounded piece", () => {
    const game = movementGame({ rows: 6, cols: 6 });
    game.set(3, 2, "black");
    game.set(3, 3, "white");
    game.set(3, 4, "black");
    game.refreshTraps();

    expect(game.isTrapped(3, 3)).toBe(true);
    game.turn = "white";
    expect(game.adjacentMoves(3, 3)).toEqual([]);
    expect(game.jumpSequences(3, 3)).toEqual([]);
  });

  test("an enclosed piece is captured only when the enclosing player gets the next turn", () => {
    const game = movementGame({ rows: 6, cols: 6 });
    game.placed = { black: 3, white: 3 };
    game.set(3, 2, "black");
    game.set(2, 4, "black");
    game.set(5, 5, "black");
    game.set(3, 3, "white");
    game.set(0, 0, "white");
    game.set(5, 0, "white");
    game.refreshTraps();

    game.move(2, 4, 3, 4);
    expect(game.turn).toBe("white");
    expect(game.isTrapped(3, 3)).toBe(true);
    expect(game.capturable()).not.toContainEqual([3, 3]);

    game.move(0, 0, 0, 1);
    expect(game.turn).toBe("black");
    expect(game.capturable()).toContainEqual([3, 3]);

    game.capture(3, 3);
    expect(game.at(3, 3)).toBeNull();
    expect(game.captured.white).toBe(1);
  });

  test("a player loses when reduced to one remaining piece", () => {
    const game = movementGame({ rows: 4, cols: 4, piecesPerPlayer: 2 });
    game.placed = { black: 2, white: 2 };
    game.captured.white = 1;
    game.updateWinner();
    expect(game.winner).toBe("black");
  });
});
