"use strict";

const AcedrexRuleKernelApi =
  typeof module !==
    "undefined" &&
  module.exports
    ? require("./rules.js")
    : window.ChessAtlasRules;

const AcedrexDenseBoardAdapter =
  typeof module !==
    "undefined" &&
  module.exports
    ? require(
        "./dense-board-adapter.js"
      )
    : window.DenseBoardOccupancy;


const ACEDREX_DIAGONALS =
  AcedrexRuleKernelApi
    .vectors.bishop(2);

const ACEDREX_ORTHOGONALS =
  AcedrexRuleKernelApi
    .vectors.rook(2);

const ACEDREX_DOUBLE_DIAGONALS =
  Object.freeze(
    ACEDREX_DIAGONALS.map(
      vector =>
        Object.freeze(
          vector.map(
            component =>
              component * 2
          )
        )
    )
  );

const ACEDREX_STATIC_MOVEMENTS =
  Object.freeze({
    R:
      AcedrexRuleKernelApi.slide(
        ACEDREX_ORTHOGONALS
      ),
    K:
      AcedrexRuleKernelApi.step(
        AcedrexRuleKernelApi
          .vectors.king(2)
      ),
    N:
      AcedrexRuleKernelApi.jump(
        AcedrexRuleKernelApi
          .vectors.knight(2)
      ),
    B:
      AcedrexRuleKernelApi.jump(
        ACEDREX_DOUBLE_DIAGONALS
      ),
    wP:
      AcedrexRuleKernelApi.pawn({
        forwardAxis: 0,
        forwardDirection: -1,
        startingRank: 6,
        oneStep: 1,
        multiStep: 2,
        captureAxes: [1],
        promotionBoundary: 0
      }),
    bP:
      AcedrexRuleKernelApi.pawn({
        forwardAxis: 0,
        forwardDirection: 1,
        startingRank: 1,
        oneStep: 1,
        multiStep: 2,
        captureAxes: [1],
        promotionBoundary: 7
      }),
    wPAfterCapture:
      AcedrexRuleKernelApi.pawn({
        forwardAxis: 0,
        forwardDirection: -1,
        startingRank: 6,
        oneStep: 1,
        captureAxes: [1],
        promotionBoundary: 0
      }),
    bPAfterCapture:
      AcedrexRuleKernelApi.pawn({
        forwardAxis: 0,
        forwardDirection: 1,
        startingRank: 1,
        oneStep: 1,
        captureAxes: [1],
        promotionBoundary: 7
      })
  });


function queenMovement(
  hasMoved
) {
  const movements = [
    AcedrexRuleKernelApi.step(
      ACEDREX_DIAGONALS
    )
  ];

  if (!hasMoved) {
    movements.push(
      AcedrexRuleKernelApi.jump(
        ACEDREX_DOUBLE_DIAGONALS,
        {
          captureMode: "none"
        }
      )
    );
  }

  return AcedrexRuleKernelApi
    .combine(
      ...movements
    );
}


function movementFor(
  piece,
  context = {}
) {
  if (
    typeof piece !==
      "string" ||
    piece.length < 2
  ) {
    return null;
  }

  const colour =
    piece[0];

  if (piece[1] === "Q") {
    return queenMovement(
      Boolean(
        context.queenHasMoved?.[
          colour
        ]
      )
    );
  }

  if (piece[1] === "P") {
    return ACEDREX_STATIC_MOVEMENTS[
      context.captureOccurred
        ? `${colour}PAfterCapture`
        : `${colour}P`
    ] || null;
  }

  return (
    ACEDREX_STATIC_MOVEMENTS[
      piece[1]
    ] || null
  );
}


function generateMoves({
  board,
  shape,
  row,
  col,
  context = {}
}) {
  const piece =
    board?.[row]?.[col];
  const movement =
    movementFor(
      piece,
      context
    );

  if (!movement) {
    return [];
  }

  const occupancy =
    new AcedrexDenseBoardAdapter(
      board,
      shape.dimensions
    );

  return AcedrexRuleKernelApi
    .generateMoves({
      shape,
      origin: [row, col],
      piece,
      occupancy,
      movement
    });
}


const AcedrexRules = {
  movements:
    ACEDREX_STATIC_MOVEMENTS,
  movementFor,
  generateMoves
};


if (
  typeof module !==
    "undefined" &&
  module.exports
) {
  module.exports =
    AcedrexRules;
}


if (
  typeof window !==
    "undefined"
) {
  window.ChessAtlasAcedrexRules =
    AcedrexRules;
}