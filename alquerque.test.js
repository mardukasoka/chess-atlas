"use strict";

const { AlfonsoAlquerqueGame, directions, hasDiagonals } = require("./alquerque.js");

describe("Alquerque de Doze — Alfonso X 1283 profile", () => {
  test("starts with twelve pieces per side and the centre empty", () => {
    const game = new AlfonsoAlquerqueGame();
    expect(game.remaining("white")).toBe(12);
    expect(game.remaining("black")).toBe(12);
    expect(game.at(2, 2)).toBeNull();
    expect(game.snapshot().profile).toBe("alquerque-alfonso-1283");
  });

  test("board graph gives diagonals only to the thirteen diagonal intersections", () => {
    let diagonalPoints = 0;
    for (let row = 0; row < 5; row += 1) {
      for (let col = 0; col < 5; col += 1) {
        if (hasDiagonals(row, col)) diagonalPoints += 1;
      }
    }
    expect(diagonalPoints).toBe(13);
    expect(directions(2, 2)).toHaveLength(8);
    expect(directions(2, 1)).toHaveLength(4);
  });

  test("a man moves one adjacent point along a drawn line", () => {
    const game = new AlfonsoAlquerqueGame({ setup: false });
    game.set(2, 2, "white");
    expect(game.movesFrom(2, 2)).toEqual(expect.arrayContaining([
      { type: "move", from: [2, 2], to: [1, 1] },
      { type: "move", from: [2, 2], to: [2, 1] }
    ]));

    const other = new AlfonsoAlquerqueGame({ setup: false });
    other.set(2, 1, "white");
    expect(other.movesFrom(2, 1)).not.toContainEqual({ type: "move", from: [2, 1], to: [1, 0] });
  });

  test("capture hops an adjacent enemy to the empty point beyond", () => {
    const game = new AlfonsoAlquerqueGame({ setup: false });
    game.set(2, 0, "white");
    game.set(2, 1, "black");
    game.set(4, 4, "black");
    const capture = { type: "capture", from: [2, 0], over: [2, 1], to: [2, 2] };
    expect(game.capturesFrom(2, 0)).toContainEqual(capture);
    game.apply(capture);
    expect(game.at(2, 0)).toBeNull();
    expect(game.at(2, 1)).toBeNull();
    expect(game.at(2, 2)).toBe("white");
    expect(game.captured.black).toBe(1);
    expect(game.turn).toBe("black");
  });

  test("does not invent a diagonal jump where the board has no diagonal line", () => {
    const game = new AlfonsoAlquerqueGame({ setup: false });
    game.set(2, 1, "white");
    game.set(1, 2, "black");
    expect(game.capturesFrom(2, 1)).not.toContainEqual({
      type: "capture", from: [2, 1], over: [1, 2], to: [0, 3]
    });
  });

  test("capturing the final opposing man wins", () => {
    const game = new AlfonsoAlquerqueGame({ setup: false });
    game.set(2, 0, "white");
    game.set(2, 1, "black");
    game.apply({ type: "capture", from: [2, 0], over: [2, 1], to: [2, 2] });
    expect(game.winner).toBe("white");
    expect(game.legalActions()).toEqual([]);
  });
});
