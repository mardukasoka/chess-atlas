"use strict";

const ModernRuleKernelApi =
  typeof module !==
    "undefined" &&
  module.exports
    ? require("./rules.js")
    : window.ChessAtlasRules;

const ModernDenseBoardAdapter =
  typeof module !==
    "undefined" &&
  module.exports
    ? require(
        "./dense-board-adapter.js"
      )
    : window.DenseBoardOccupancy;


const MODERN_MOVEMENTS =
  Object.freeze({
    R:
      ModernRuleKernelApi.slide(
        ModernRuleKernelApi
          .vectors.rook(2)
      ),
    B:
      ModernRuleKernelApi.slide(
        ModernRuleKernelApi
          .vectors.bishop(2)
      ),
    Q:
      ModernRuleKernelApi.slide(
        ModernRuleKernelApi
          .vectors.queen(2)
      ),
    K:
      ModernRuleKernelApi.step(
        ModernRuleKernelApi
          .vectors.king(2)
      ),
    N:
      ModernRuleKernelApi.jump(
        ModernRuleKernelApi
          .vectors.knight(2)
      ),
    wP:
      ModernRuleKernelApi.pawn({
        forwardAxis: 0,
        forwardDirection: -1,
        startingRank: 6,
        oneStep: 1,
        multiStep: 2,
        captureAxes: [1],
        promotionBoundary: 0
      }),
    bP:
      ModernRuleKernelApi.pawn({
        forwardAxis: 0,
        forwardDirection: 1,
        startingRank: 1,
        oneStep: 1,
        multiStep: 2,
        captureAxes: [1],
        promotionBoundary: 7
      })
  });


function typeOf(
  piece
) {
  return (
    typeof piece === "string"
      ? piece[1]
      : null
  );
}


function movementFor(
  piece
) {
  const type =
    typeOf(piece);

  if (type === "P") {
    return MODERN_MOVEMENTS[
      piece
    ] || null;
  }

  return (
    MODERN_MOVEMENTS[type] ||
    null
  );
}


function generateMoves({
  board,
  shape,
  row,
  col
}) {
  const piece =
    board?.[row]?.[col];
  const movement =
    movementFor(piece);

  if (!movement) {
    return [];
  }

  const occupancy =
    new ModernDenseBoardAdapter(
      board,
      shape.dimensions
    );

  return ModernRuleKernelApi
    .generateMoves({
      shape,
      origin: [row, col],
      piece,
      occupancy,
      movement
    });
}


const ModernRules = {
  movements:
    MODERN_MOVEMENTS,
  movementFor,
  generateMoves
};


if (
  typeof module !==
    "undefined" &&
  module.exports
) {
  module.exports =
    ModernRules;
}


if (
  typeof window !==
    "undefined"
) {
  window.ChessAtlasModernRules =
    ModernRules;
}