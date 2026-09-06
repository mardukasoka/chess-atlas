"use strict";

const Advanced = require("./advanced-variants.js");
const Legality = require("./spatial-legality.js");

describe("direct advanced spatial legality", () => {
  test("infinite rook destinations are validated without enumerating an infinite ray", () => {
    const board = Advanced.createSpatialBoard([null, null], [
      { coordinate: [0, 0], piece: { side: "w", type: "R" } },
      { coordinate: [0, 1000], piece: { side: "b", type: "N" } }
    ]);

    expect(Legality.isPseudoLegalDestination(board, [0, 0], [0, 1000])).toBe(true);
    expect(Legality.isPseudoLegalDestination(board, [0, 0], [1, 1000])).toBe(false);
  });

  test("sliding paths stop at blockers in 4D", () => {
    const board = Advanced.createSpatialBoard([4, 4, 2, 2], [
      { coordinate: [0, 0, 0, 0], piece: { side: "w", type: "Q" } },
      { coordinate: [1, 1, 0, 0], piece: { side: "w", type: "P" } }
    ]);
    expect(Legality.isPseudoLegalDestination(board, [0, 0, 0, 0], [2, 2, 0, 0])).toBe(false);
  });

  test("4D queen can slide through any nonempty equal-axis combination", () => {
    const board = Advanced.createSpatialBoard([4, 4, 2, 2], [
      { coordinate: [0, 0, 0, 0], piece: { side: "w", type: "Q" } }
    ]);
    expect(Legality.isPseudoLegalDestination(board, [0, 0, 0, 0], [1, 1, 1, 1])).toBe(true);
    expect(Legality.isPseudoLegalDestination(board, [0, 0, 0, 0], [2, 1, 0, 0])).toBe(false);
  });

  test("pawn attacks differ from pawn forward movement", () => {
    const board = Advanced.createSpatialBoard([8, 8], [
      { coordinate: [3, 3], piece: { side: "w", type: "P" } }
    ]);
    expect(Legality.attacksDestination(board, [3, 3], [3, 4], { pawn: { forwardAxis: 1 } })).toBe(false);
    expect(Legality.attacksDestination(board, [3, 3], [4, 4], { pawn: { forwardAxis: 1 } })).toBe(true);
  });

  test("a move exposing the king is rejected", () => {
    const board = Advanced.createSpatialBoard([8, 8], [
      { coordinate: [0, 0], piece: { side: "w", type: "K" } },
      { coordinate: [0, 1], piece: { side: "w", type: "R" } },
      { coordinate: [0, 7], piece: { side: "b", type: "R" } },
      { coordinate: [7, 7], piece: { side: "b", type: "K" } }
    ]);

    expect(Legality.isLegalDestination(board, [0, 1], [1, 1])).toBe(false);
    expect(Legality.isLegalDestination(board, [0, 1], [0, 2])).toBe(true);
  });

  test("advanced game alternates turns after a legal move", () => {
    const board = Advanced.createSpatialBoard([4, 4, 2, 2], [
      { coordinate: [0, 0, 0, 0], piece: { side: "w", type: "K" } },
      { coordinate: [3, 3, 1, 1], piece: { side: "b", type: "K" } },
      { coordinate: [1, 0, 0, 0], piece: { side: "w", type: "N" } }
    ]);
    const game = new Legality.AdvancedChessGame({ board });
    expect(game.legal([1, 0, 0, 0], [3, 1, 0, 0])).toBe(true);
    game.move([1, 0, 0, 0], [3, 1, 0, 0]);
    expect(game.turn).toBe("b");
  });
});
