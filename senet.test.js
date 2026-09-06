"use strict";

const Senet = require("./senet.js");

describe("Senet Kendall-style reconstruction", () => {
  test("setup alternates five pieces per side across houses 1-10", () => {
    const game = new Senet.SenetKendallGame();
    expect(game.pieces.get("w").map(piece => piece.position)).toEqual([1, 3, 5, 7, 9]);
    expect(game.pieces.get("b").map(piece => piece.position)).toEqual([2, 4, 6, 8, 10]);
  });

  test("four dark sticks score five and bonus values are deterministic", () => {
    const first = new Senet.SenetKendallGame({ seed: "senet" });
    const second = new Senet.SenetKendallGame({ seed: "senet" });
    const a = Array.from({ length: 12 }, () => first.cast());
    const b = Array.from({ length: 12 }, () => second.cast());
    expect(a).toEqual(b);
    expect(a.every(value => value >= 1 && value <= 5)).toBe(true);
  });

  test("a piece may not pass House 26 before landing there", () => {
    const game = new Senet.SenetKendallGame();
    game.pieces.get("w")[0] = { position: 24, passedHappiness: false };
    expect(game.forwardMoveFor(0, 3)).toBeNull();
    expect(game.forwardMoveFor(0, 2)).toMatchObject({ to: 26, happiness: true });
  });

  test("landing on a vulnerable enemy swaps positions", () => {
    const game = new Senet.SenetKendallGame();
    game.pieces.get("w")[0] = { position: 11, passedHappiness: false };
    game.pieces.get("b")[0] = { position: 13, passedHappiness: false };
    // Move other black pieces away so 13 is not protected by an adjacent pair.
    game.pieces.get("b")[1].position = 20;
    game.pieces.get("b")[2].position = 22;
    game.pieces.get("b")[3].position = 24;
    game.pieces.get("b")[4].position = 26;
    game.turn = "w";
    game.lastThrow = 2;
    game.bonusTurn = false;

    game.move(0, 2);
    expect(game.pieces.get("w")[0].position).toBe(13);
    expect(game.pieces.get("b")[0].position).toBe(11);
  });

  test("House of Water returns a piece toward House 15", () => {
    const game = new Senet.SenetKendallGame();
    game.pieces.get("w")[0] = { position: 26, passedHappiness: true };
    game.pieces.get("b").forEach((piece, index) => { piece.position = 18 + index * 2; });
    game.turn = "w";
    game.lastThrow = 1;
    game.bonusTurn = true;

    game.move(0, 1);
    expect(game.pieces.get("w")[0].position).toBe(15);
  });

  test("final houses require exact exit throws", () => {
    const game = new Senet.SenetKendallGame();
    game.pieces.get("w")[0] = { position: 28, passedHappiness: true };
    expect(game.forwardMoveFor(0, 2)).toBeNull();
    expect(game.forwardMoveFor(0, 3)).toMatchObject({ to: 31, exit: true });
  });
});
