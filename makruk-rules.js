"use strict";

const MakrukRuleKernelApi =
  typeof module !== "undefined" && module.exports
    ? require("./rules.js")
    : window.ChessAtlasRules;

const MakrukDenseBoardAdapter =
  typeof module !== "undefined" && module.exports
    ? require("./dense-board-adapter.js")
    : window.DenseBoardOccupancy;

const DIAGONALS = MakrukRuleKernelApi.vectors.bishop(2);
const ROOKS = MakrukRuleKernelApi.vectors.rook(2);
const KINGS = MakrukRuleKernelApi.vectors.king(2);
const KNIGHTS = MakrukRuleKernelApi.vectors.knight(2);

const MAKRUК_MOVEMENTS = Object.freeze({
  R: MakrukRuleKernelApi.slide(ROOKS),
  K: MakrukRuleKernelApi.step(KINGS),
  N: MakrukRuleKernelApi.jump(KNIGHTS),
  F: MakrukRuleKernelApi.step(DIAGONALS),
  wB: MakrukRuleKernelApi.step([...DIAGONALS, [-1, 0]]),
  bB: MakrukRuleKernelApi.step([...DIAGONALS, [1, 0]]),
  wP: MakrukRuleKernelApi.pawn({
    forwardAxis: 0,
    forwardDirection: -1,
    startingRank: 5,
    oneStep: 1,
    captureAxes: [1],
    promotionBoundary: 2
  }),
  bP: MakrukRuleKernelApi.pawn({
    forwardAxis: 0,
    forwardDirection: 1,
    startingRank: 2,
    oneStep: 1,
    captureAxes: [1],
    promotionBoundary: 5
  })
});

function movementFor(piece) {
  if (typeof piece !== "string" || piece.length < 2) return null;
  if (piece[1] === "P" || piece[1] === "B") return MAKRUК_MOVEMENTS[piece] || null;
  return MAKRUК_MOVEMENTS[piece[1]] || null;
}

function generateMoves({ board, shape, row, col }) {
  const piece = board?.[row]?.[col];
  const movement = movementFor(piece);
  if (!movement) return [];

  const occupancy = new MakrukDenseBoardAdapter(board, shape.dimensions);
  return MakrukRuleKernelApi.generateMoves({
    shape,
    origin: [row, col],
    piece,
    occupancy,
    movement
  });
}

const MakrukRules = Object.freeze({
  movements: MAKRUК_MOVEMENTS,
  movementFor,
  generateMoves
});

if (typeof module !== "undefined" && module.exports) module.exports = MakrukRules;
if (typeof window !== "undefined") window.ChessAtlasMakrukRules = MakrukRules;
