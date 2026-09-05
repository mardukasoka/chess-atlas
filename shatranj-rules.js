"use strict";

const ShatranjRuleKernelApi =
  typeof module !==
    "undefined" &&
  module.exports
    ? require("./rules.js")
    : window.ChessAtlasRules;

const ShatranjDenseBoardAdapter =
  typeof module !==
    "undefined" &&
  module.exports
    ? require(
        "./dense-board-adapter.js"
      )
    : window.DenseBoardOccupancy;


const SHATRANJ_DIAGONALS =
  ShatranjRuleKernelApi
    .vectors.bishop(2);

const SHATRANJ_ELEPHANT_JUMPS =
  Object.freeze(
    SHATRANJ_DIAGONALS.map(
      vector =>
        Object.freeze(
          vector.map(
            component =>
              component * 2
          )
        )
    )
  );

const SHATRANJ_MOVEMENTS =
  Object.freeze({
    R:
      ShatranjRuleKernelApi.slide(
        ShatranjRuleKernelApi
          .vectors.rook(2)
      ),
    K:
      ShatranjRuleKernelApi.step(
        ShatranjRuleKernelApi
          .vectors.king(2)
      ),
    N:
      ShatranjRuleKernelApi.jump(
        ShatranjRuleKernelApi
          .vectors.knight(2)
      ),
    F:
      ShatranjRuleKernelApi.step(
        SHATRANJ_DIAGONALS
      ),
    E:
      ShatranjRuleKernelApi.jump(
        SHATRANJ_ELEPHANT_JUMPS
      ),
    wP:
      ShatranjRuleKernelApi.pawn({
        forwardAxis: 0,
        forwardDirection: -1,
        startingRank: 6,
        oneStep: 1,
        captureAxes: [1],
        promotionBoundary: 0
      }),
    bP:
      ShatranjRuleKernelApi.pawn({
        forwardAxis: 0,
        forwardDirection: 1,
        startingRank: 1,
        oneStep: 1,
        captureAxes: [1],
        promotionBoundary: 7
      })
  });


function movementFor(
  piece
) {
  if (
    typeof piece !==
      "string" ||
    piece.length < 2
  ) {
    return null;
  }

  if (piece[1] === "P") {
    return (
      SHATRANJ_MOVEMENTS[
        piece
      ] || null
    );
  }

  return (
    SHATRANJ_MOVEMENTS[
      piece[1]
    ] || null
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
    new ShatranjDenseBoardAdapter(
      board,
      shape.dimensions
    );

  return ShatranjRuleKernelApi
    .generateMoves({
      shape,
      origin: [row, col],
      piece,
      occupancy,
      movement
    });
}


const ShatranjRules = {
  movements:
    SHATRANJ_MOVEMENTS,
  movementFor,
  generateMoves
};


if (
  typeof module !==
    "undefined" &&
  module.exports
) {
  module.exports =
    ShatranjRules;
}


if (
  typeof window !==
    "undefined"
) {
  window.ChessAtlasShatranjRules =
    ShatranjRules;
}