"use strict";

const ChaturangaRuleKernelApi =
  typeof module !==
    "undefined" &&
  module.exports
    ? require("./rules.js")
    : window.ChessAtlasRules;

const ChaturangaDenseBoardAdapter =
  typeof module !==
    "undefined" &&
  module.exports
    ? require(
        "./dense-board-adapter.js"
      )
    : window.DenseBoardOccupancy;


const CHATURANGA_DIAGONALS =
  ChaturangaRuleKernelApi
    .vectors.bishop(2);

const CHATURANGA_ORTHOGONALS =
  ChaturangaRuleKernelApi
    .vectors.rook(2);

const CHATURANGA_ELEPHANT_JUMPS =
  Object.freeze(
    CHATURANGA_ORTHOGONALS.map(
      vector =>
        Object.freeze(
          vector.map(
            component =>
              component * 2
          )
        )
    )
  );

const CHATURANGA_MOVEMENTS =
  Object.freeze({
    R:
      ChaturangaRuleKernelApi.slide(
        CHATURANGA_ORTHOGONALS
      ),
    K:
      ChaturangaRuleKernelApi.step(
        ChaturangaRuleKernelApi
          .vectors.king(2)
      ),
    N:
      ChaturangaRuleKernelApi.jump(
        ChaturangaRuleKernelApi
          .vectors.knight(2)
      ),
    F:
      ChaturangaRuleKernelApi.step(
        CHATURANGA_DIAGONALS
      ),
    E:
      ChaturangaRuleKernelApi.jump(
        CHATURANGA_ELEPHANT_JUMPS
      ),
    wP:
      ChaturangaRuleKernelApi.pawn({
        forwardAxis: 0,
        forwardDirection: -1,
        startingRank: 6,
        oneStep: 1,
        captureAxes: [1],
        promotionBoundary: 0
      }),
    bP:
      ChaturangaRuleKernelApi.pawn({
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
      CHATURANGA_MOVEMENTS[
        piece
      ] || null
    );
  }

  return (
    CHATURANGA_MOVEMENTS[
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
    new ChaturangaDenseBoardAdapter(
      board,
      shape.dimensions
    );

  return ChaturangaRuleKernelApi
    .generateMoves({
      shape,
      origin: [row, col],
      piece,
      occupancy,
      movement
    });
}


const ChaturangaRules = {
  movements:
    CHATURANGA_MOVEMENTS,
  movementFor,
  generateMoves
};


if (
  typeof module !==
    "undefined" &&
  module.exports
) {
  module.exports =
    ChaturangaRules;
}


if (
  typeof window !==
    "undefined"
) {
  window.ChessAtlasChaturangaRules =
    ChaturangaRules;
}