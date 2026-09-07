"use strict";

const assert = require("assert");
const Geometry = require("./geometry.js");
const Makruk = require("./makruk-rules.js");

function board() {
  return Array.from({ length: 8 }, () => Array(8).fill(""));
}

function destinations(moves) {
  return moves.map(move => move.to.join(",")).sort();
}

test("Makruk met, khon, knight, rook and pawn use core movement rules", () => {
  const shape = Geometry.createBoardShape([8, 8]);

  const khonBoard = board();
  khonBoard[4][4] = "wB";
  assert.deepStrictEqual(
    destinations(Makruk.generateMoves({ board: khonBoard, shape, row: 4, col: 4 })),
    ["3,3", "3,4", "3,5", "5,3", "5,5"]
  );

  const blackKhon = board();
  blackKhon[3][3] = "bB";
  assert.deepStrictEqual(
    destinations(Makruk.generateMoves({ board: blackKhon, shape, row: 3, col: 3 })),
    ["2,2", "2,4", "4,2", "4,3", "4,4"]
  );

  const metBoard = board();
  metBoard[4][4] = "wF";
  assert.deepStrictEqual(
    destinations(Makruk.generateMoves({ board: metBoard, shape, row: 4, col: 4 })),
    ["3,3", "3,5", "5,3", "5,5"]
  );

  const pawnBoard = board();
  pawnBoard[5][3] = "wP";
  assert.deepStrictEqual(
    destinations(Makruk.generateMoves({ board: pawnBoard, shape, row: 5, col: 3 })),
    ["4,3"]
  );
});

test("Makruk pawn move marks promotion on the sixth rank", () => {
  const shape = Geometry.createBoardShape([8, 8]);
  const b = board();
  b[3][3] = "wP";
  const move = Makruk.generateMoves({ board: b, shape, row: 3, col: 3 })
    .find(candidate => candidate.to[0] === 2 && candidate.to[1] === 3);
  assert.ok(move);
  assert.strictEqual(move.promotion, true);
});
