"use strict";

const Geometry = require("./geometry.js");
const Rules = require("./rules.js");
const Advanced = require("./advanced-variants.js");
const Randomizer = require("./randomizer.js");

describe("advanced spatial variants", () => {
  test("4D profile uses 4x4x2x2 geometry", () => {
    const game = Advanced.create4DChess();
    expect(game.dimensions).toEqual([4, 4, 2, 2]);
    expect(game.board.shape.size).toBe(64);
  });

  test("4D vector counts match the shared N-D rule kernel", () => {
    expect(Rules.vectors.rook(4)).toHaveLength(8);
    expect(Rules.vectors.bishop(4)).toHaveLength(24);
    expect(Rules.vectors.queen(4)).toHaveLength(80);
    expect(Rules.vectors.king(4)).toHaveLength(80);
    expect(Rules.vectors.knight(4)).toHaveLength(48);
  });

  test("4D rook slides along exactly one spatial axis", () => {
    const board = Advanced.createSpatialBoard(
      [4, 4, 2, 2],
      [{ coordinate: [1, 1, 0, 0], piece: { side: "w", type: "R" } }]
    );
    const moves = Advanced.generateSpatialMoves({
      board,
      origin: [1, 1, 0, 0]
    });

    expect(moves.some(move => Geometry.equals(move.to, [3, 1, 0, 0]))).toBe(true);
    expect(moves.some(move => Geometry.equals(move.to, [1, 1, 1, 0]))).toBe(true);
    expect(moves.some(move => Geometry.equals(move.to, [2, 2, 0, 0]))).toBe(false);
  });

  test("4D bishop changes exactly two axes equally", () => {
    const board = Advanced.createSpatialBoard(
      [4, 4, 2, 2],
      [{ coordinate: [1, 1, 0, 0], piece: { side: "w", type: "B" } }]
    );
    const moves = Advanced.generateSpatialMoves({ board, origin: [1, 1, 0, 0] });

    expect(moves.some(move => Geometry.equals(move.to, [2, 2, 0, 0]))).toBe(true);
    expect(moves.some(move => Geometry.equals(move.to, [2, 1, 1, 0]))).toBe(true);
    expect(moves.some(move => Geometry.equals(move.to, [2, 2, 1, 0]))).toBe(false);
  });

  test("infinite chess uses sparse unbounded coordinates", () => {
    const game = Advanced.createInfiniteChess([
      { coordinate: [-1000, 2500], piece: { side: "w", type: "N" } }
    ]);

    expect(game.board.shape.bounded).toBe(false);
    expect(game.board.occupancy.get([-1000, 2500]).type).toBe("N");
    expect(game.board.occupancy.size).toBe(1);
  });

  test("unbounded sliders are request bounded rather than board bounded", () => {
    const game = Advanced.createInfiniteChess([
      { coordinate: [0, 0], piece: { side: "w", type: "R" } }
    ]);
    const moves = Advanced.viewportMoves({
      board: game.board,
      origin: [0, 0],
      radius: 3
    });

    expect(moves.some(move => Geometry.equals(move.to, [3, 0]))).toBe(true);
    expect(moves.some(move => Geometry.equals(move.to, [4, 0]))).toBe(false);
    expect(moves.some(move => Geometry.equals(move.to, [-3, 0]))).toBe(true);
  });

  test("advanced modifiers remain orthogonal", () => {
    expect(Advanced.normalizeVariantConfig({
      spatialDimensions: 4,
      extent: "unbounded",
      timeline: true,
      quantum: true
    })).toEqual({
      baseRules: "modern",
      spatialDimensions: 4,
      extent: "unbounded",
      timeline: true,
      quantum: true
    });
  });
});

describe("deterministic randomizer", () => {
  test("same seed produces the same sequence", () => {
    const first = new Randomizer.SeededRandom("atlas");
    const second = new Randomizer.SeededRandom("atlas");
    expect(Array.from({ length: 8 }, () => first.nextUint32()))
      .toEqual(Array.from({ length: 8 }, () => second.nextUint32()));
  });

  test("snapshot and restore replay exactly", () => {
    const random = new Randomizer.SeededRandom(42);
    random.next();
    const snapshot = random.snapshot();
    const expected = [random.next(), random.next(), random.next()];
    random.restore(snapshot);
    expect([random.next(), random.next(), random.next()]).toEqual(expected);
  });
});
