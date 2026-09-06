"use strict";

const {
  PachisiGame,
  OUTER_CYCLE,
  CASTLES,
  routeCell,
  cowrieValue,
  isGrace
} = require("./pachisi.js");

describe("Pachisi six-cowrie profile", () => {
  test("maps six cowries to the traditional values", () => {
    expect([0, 1, 2, 3, 4, 5, 6].map(cowrieValue)).toEqual([
      25, 10, 2, 3, 4, 5, 6
    ]);
    expect([6, 10, 25].every(isGrace)).toBe(true);
    expect(isGrace(5)).toBe(false);
  });

  test("builds a 68-cell outer cycle and twelve castles", () => {
    expect(OUTER_CYCLE).toHaveLength(68);
    expect(new Set(OUTER_CYCLE).size).toBe(68);
    expect(CASTLES.size).toBe(12);
  });

  test("first piece may leave on any throw, later pieces require a grace", () => {
    const game = new PachisiGame({ seed: 1 });
    game.setThrow(3);
    expect(game.legalMoves()).toHaveLength(4);
    game.move(0);

    game.turn = "yellow";
    game.setThrow(3);
    expect(game.legalMoves().map(move => move.pieceIndex)).toEqual([0]);
    game.pass();

    game.turn = "yellow";
    game.setThrow(6);
    expect(game.legalMoves().map(move => move.pieceIndex)).toEqual([0, 1, 2, 3]);
  });

  test("requires an exact throw to re-enter the Charkoni", () => {
    const game = new PachisiGame();
    const piece = game.piecesFor("yellow")[0];
    piece.progress = 82;
    game.firstDepartureUsed.set("yellow", true);

    game.setThrow(3);
    expect(game.legalMoves()).toHaveLength(0);
    game.pass();

    game.turn = "yellow";
    game.setThrow(2);
    expect(game.legalMoves()[0].to).toBe(84);
    game.move(0);
    expect(piece.progress).toBe(84);
  });

  test("castle squares cannot be entered when occupied by an enemy", () => {
    const game = new PachisiGame();
    const yellow = game.piecesFor("yellow")[0];
    const red = game.piecesFor("red")[0];

    let found = null;
    for (let yp = 1; yp < 84 && !found; yp += 1) {
      const target = routeCell("yellow", yp);
      if (!CASTLES.has(target)) continue;
      for (let rp = 1; rp < 84; rp += 1) {
        if (routeCell("red", rp) === target) {
          found = { yp, rp };
          break;
        }
      }
    }

    expect(found).not.toBeNull();
    yellow.progress = found.yp - 2;
    red.progress = found.rp;
    game.firstDepartureUsed.set("yellow", true);
    game.setThrow(2);
    expect(game.legalMoves().some(move => move.pieceIndex === 0)).toBe(false);
  });

  test("capture returns enemies to the Charkoni and earns another throw", () => {
    const game = new PachisiGame();
    const yellow = game.piecesFor("yellow")[0];
    const red = game.piecesFor("red")[0];

    let found = null;
    for (let yp = 3; yp < 84 && !found; yp += 1) {
      const target = routeCell("yellow", yp);
      if (CASTLES.has(target) || target === "charkoni") continue;
      for (let rp = 1; rp < 84; rp += 1) {
        if (routeCell("red", rp) === target) {
          found = { yp, rp };
          break;
        }
      }
    }

    expect(found).not.toBeNull();
    yellow.progress = found.yp - 2;
    red.progress = found.rp;
    game.firstDepartureUsed.set("yellow", true);
    game.setThrow(2);
    const result = game.move(0);

    expect(result.captured).toBe(true);
    expect(result.extraThrow).toBe(true);
    expect(red.progress).toBe(-1);
    expect(game.turn).toBe("yellow");
  });

  test("a grace throw keeps the same colour for the extra cast", () => {
    const game = new PachisiGame();
    game.setThrow(6);
    game.move(0);
    expect(game.turn).toBe("yellow");
    expect(game.lastThrow).toBeNull();
  });
});
