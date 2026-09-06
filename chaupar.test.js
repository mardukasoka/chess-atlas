"use strict";

const { ChauparGame, LONG_DIE_FACES, START_PROGRESS } = require("./chaupar.js");
const { routeCell } = require("./pachisi.js");

describe("Chaupar three-long-dice profile", () => {
  test("uses three long dice with 1, 2, 5 and 6 faces and fixed starts", () => {
    expect(LONG_DIE_FACES).toEqual([1, 2, 5, 6]);
    expect(START_PROGRESS).toEqual([6, 7, 23, 24]);
    const game = new ChauparGame();
    expect(game.piecesFor("yellow").map(piece => piece.progress)).toEqual([6, 7, 23, 24]);
  });

  test("accepts exactly three valid long-die values", () => {
    const game = new ChauparGame();
    expect(game.setDice([1, 2, 6])).toEqual([1, 2, 6]);
    expect(() => new ChauparGame().setDice([1, 2])).toThrow();
    expect(() => new ChauparGame().setDice([1, 2, 3])).toThrow();
  });

  test("a throw can be split or combined", () => {
    const game = new ChauparGame();
    game.setDice([1, 2, 6]);
    const moves = game.legalMoves().filter(move => move.pieceIndex === 0);
    expect(moves.some(move => move.distance === 1)).toBe(true);
    expect(moves.some(move => move.distance === 2)).toBe(true);
    expect(moves.some(move => move.distance === 6)).toBe(true);
    expect(moves.some(move => move.distance === 3)).toBe(true);
    expect(moves.some(move => move.distance === 9)).toBe(true);
  });

  test("using part of a throw leaves the other dice available", () => {
    const game = new ChauparGame();
    game.setDice([1, 2, 6]);
    const result = game.move(0, [1]);
    expect(result.distance).toBe(2);
    expect(result.remainingDice).toEqual([1, 6]);
    expect(game.turn).toBe("yellow");
  });

  test("same-colour pieces on one cell move as a conglomerate", () => {
    const game = new ChauparGame();
    const pieces = game.piecesFor("yellow");
    pieces[0].progress = 10;
    pieces[1].progress = 10;
    game.setDice([1, 2, 5]);
    const move = game.legalMoves().find(candidate => candidate.pieceIndex === 0 && candidate.distance === 2);
    expect(move.groupSize).toBe(2);
    game.move(0, move.diceIndices);
    expect(pieces[0].progress).toBe(12);
    expect(pieces[1].progress).toBe(12);
  });

  test("a smaller group cannot capture a larger conglomerate", () => {
    const game = new ChauparGame();
    const yellow = game.piecesFor("yellow");
    const red = game.piecesFor("red");
    yellow[0].progress = 10;

    let targetProgress = null;
    for (let progress = 11; progress < 20; progress += 1) {
      const cell = routeCell("yellow", progress);
      const redProgress = Array.from({ length: 83 }, (_, index) => index + 1)
        .find(candidate => routeCell("red", candidate) === cell);
      if (redProgress) {
        targetProgress = { yellow: progress, red: redProgress };
        break;
      }
    }
    expect(targetProgress).not.toBeNull();
    yellow[0].progress = targetProgress.yellow - 1;
    red[0].progress = targetProgress.red;
    red[1].progress = targetProgress.red;
    game.setDice([1, 2, 5]);
    expect(game.legalMoves().some(move => move.pieceIndex === 0 && move.distance === 1)).toBe(false);
  });

  test("equal-sized conglomerates can capture and captured pieces return to Charkoni", () => {
    const game = new ChauparGame();
    const yellow = game.piecesFor("yellow");
    const red = game.piecesFor("red");

    let found = null;
    for (let yp = 2; yp < 83 && !found; yp += 1) {
      const cell = routeCell("yellow", yp + 1);
      for (let rp = 1; rp < 84; rp += 1) {
        if (routeCell("red", rp) === cell) { found = { yp, rp }; break; }
      }
    }
    expect(found).not.toBeNull();
    yellow[0].progress = found.yp;
    yellow[1].progress = found.yp;
    red[0].progress = found.rp;
    red[1].progress = found.rp;
    game.setDice([1, 2, 5]);
    const move = game.legalMoves().find(candidate => candidate.pieceIndex === 0 && candidate.distance === 1);
    expect(move.groupSize).toBe(2);
    const result = game.move(0, move.diceIndices);
    expect(result.captured).toBe(2);
    expect(red[0].progress).toBe(-1);
    expect(red[1].progress).toBe(-1);
  });

  test("captured pieces can re-enter from Charkoni on a later throw", () => {
    const game = new ChauparGame({ turn: "red" });
    const red = game.piecesFor("red")[0];
    red.progress = -1;
    game.setDice([1, 2, 5]);

    const move = game.legalMoves().find(candidate => candidate.pieceIndex === 0 && candidate.distance === 2);
    expect(move).toBeDefined();
    expect(move.from).toBe(-1);
    expect(move.to).toBe(2);

    game.move(0, move.diceIndices);
    expect(red.progress).toBe(2);
  });

  test("requires exact home and enforces partner finishing order", () => {
    const game = new ChauparGame();
    const yellow = game.piecesFor("yellow");
    yellow[0].progress = 82;
    game.setDice([2, 5, 6]);
    expect(game.legalMoves().some(move => move.pieceIndex === 0 && move.to === 84)).toBe(false);

    game.dice = [];
    for (const piece of game.piecesFor("black")) piece.progress = 84;
    game.setDice([2, 5, 6]);
    expect(game.legalMoves().some(move => move.pieceIndex === 0 && move.to === 84)).toBe(true);
    expect(game.legalMoves().some(move => move.to > 84)).toBe(false);
  });

  test("cannot pass while any legal use of the throw remains", () => {
    const game = new ChauparGame();
    game.setDice([1, 2, 5]);
    expect(() => game.pass()).toThrow(/cannot be passed/);
  });
});
