/**
 * @jest-environment node
 */

const ChessEngine =
  require("./engine.js");
const DenseBoardOccupancy =
  require(
    "./dense-board-adapter.js"
  );


function emptyBoard() {
  return Array.from(
    {
      length: 8
    },
    () =>
      Array(8).fill("")
  );
}


function place(
  engine,
  pieces
) {
  engine.board =
    emptyBoard();

  pieces.forEach(
    ({
      row,
      col,
      piece
    }) => {
      engine.board[row][col] =
        piece;
    }
  );
}


function keys(
  moves
) {
  return moves
    .map(
      move =>
        `${move.row},${move.col}`
    )
    .sort();
}


function legacyLegalMoves(
  engine,
  row,
  col
) {
  const current =
    engine.pseudoMoves;

  engine.pseudoMoves =
    function (
      targetRow,
      targetCol,
      board = this.board
    ) {
      return this
        .legacyPseudoMoves(
          targetRow,
          targetCol,
          board
        );
    };

  try {
    return engine.legalMoves(
      row,
      col
    );
  } finally {
    engine.pseudoMoves =
      current;
  }
}


function expectParity(
  engine,
  row,
  col
) {
  const piece =
    engine.board[row][col];
  const legacyPseudo =
    engine.legacyPseudoMoves(
      row,
      col
    );
  const genericCandidates =
    engine.modernMoveCandidates(
      row,
      col
    );
  const genericPseudo =
    engine.modernPseudoMoves(
      row,
      col
    );

  expect(
    keys(genericPseudo)
  ).toEqual(
    keys(legacyPseudo)
  );

  genericCandidates.forEach(
    move => {
      const destination =
        engine.board[
          move.to[0]
        ][
          move.to[1]
        ];
      const promotes =
        piece[1] === "P" &&
        (
          move.to[0] === 0 ||
          move.to[0] === 7
        );

      expect(move.capture)
        .toBe(
          Boolean(destination)
        );
      expect(move.captured)
        .toBe(
          destination || null
        );
      expect(move.promotion)
        .toBe(promotes);
    }
  );

  expect(
    keys(
      engine.legalMoves(
        row,
        col
      )
    )
  ).toEqual(
    keys(
      legacyLegalMoves(
        engine,
        row,
        col
      )
    )
  );
}


describe(
  "Modern Chess generic-kernel parity",
  () => {
    test(
      "adapts dense empty and occupied cells",
      () => {
        const board =
          emptyBoard();
        board[2][3] =
          "wN";

        const occupancy =
          new DenseBoardOccupancy(
            board,
            [8, 8]
          );

        expect(
          occupancy.get([2, 3])
        ).toBe("wN");
        expect(
          occupancy.get([2, 4])
        ).toBeUndefined();
        expect(
          occupancy.get([8, 0])
        ).toBeUndefined();
        expect(
          () =>
            new DenseBoardOccupancy(
              board,
              [10, 8]
            )
        ).toThrow(
          "does not match"
        );
      }
    );


    test(
      "matches every piece in the starting position",
      () => {
        const engine =
          new ChessEngine(
            "modern"
          );

        for (
          const [row, col]
          of engine.boardShape
            .coordinates()
        ) {
          if (
            engine.board[row][col]
          ) {
            expectParity(
              engine,
              row,
              col
            );
          }
        }
      }
    );


    test.each([
      {
        name: "rook",
        piece: "wR",
        row: 4,
        col: 4
      },
      {
        name: "bishop",
        piece: "wB",
        row: 4,
        col: 4
      },
      {
        name: "queen",
        piece: "wQ",
        row: 4,
        col: 4
      },
      {
        name: "king",
        piece: "wK",
        row: 4,
        col: 4
      },
      {
        name: "knight",
        piece: "wN",
        row: 4,
        col: 4
      }
    ])(
      "matches an open-board $name",
      ({
        piece,
        row,
        col
      }) => {
        const engine =
          new ChessEngine(
            "modern"
          );
        const pieces = [
          {
            row: 0,
            col: 0,
            piece: "bK"
          },
          {
            row,
            col,
            piece
          }
        ];

        if (piece !== "wK") {
          pieces.push({
            row: 7,
            col: 7,
            piece: "wK"
          });
        }

        place(
          engine,
          pieces
        );
        expectParity(
          engine,
          row,
          col
        );
      }
    );


    test(
      "matches friendly blocking and enemy capture",
      () => {
        const engine =
          new ChessEngine(
            "modern"
          );

        place(
          engine,
          [
            {
              row: 7,
              col: 7,
              piece: "wK"
            },
            {
              row: 0,
              col: 0,
              piece: "bK"
            },
            {
              row: 4,
              col: 4,
              piece: "wR"
            },
            {
              row: 4,
              col: 2,
              piece: "wP"
            },
            {
              row: 4,
              col: 6,
              piece: "bP"
            }
          ]
        );

        expectParity(
          engine,
          4,
          4
        );

        expect(
          engine
            .modernMoveCandidates(
              4,
              4
            )
            .find(
              move =>
                move.to[0] === 4 &&
                move.to[1] === 6
            )
            .capture
        ).toBe(true);
      }
    );


    test(
      "matches pawn steps, double-step and capture",
      () => {
        const engine =
          new ChessEngine(
            "modern"
          );

        place(
          engine,
          [
            {
              row: 7,
              col: 4,
              piece: "wK"
            },
            {
              row: 0,
              col: 4,
              piece: "bK"
            },
            {
              row: 6,
              col: 3,
              piece: "wP"
            },
            {
              row: 5,
              col: 2,
              piece: "bN"
            },
            {
              row: 5,
              col: 4,
              piece: "wN"
            }
          ]
        );

        expectParity(
          engine,
          6,
          3
        );
        expect(
          keys(
            engine
              .modernPseudoMoves(
                6,
                3
              )
          )
        ).toEqual([
          "4,3",
          "5,2",
          "5,3"
        ]);
      }
    );


    test(
      "matches promotion-boundary candidates",
      () => {
        const engine =
          new ChessEngine(
            "modern"
          );

        place(
          engine,
          [
            {
              row: 7,
              col: 4,
              piece: "wK"
            },
            {
              row: 0,
              col: 4,
              piece: "bK"
            },
            {
              row: 1,
              col: 0,
              piece: "wP"
            },
            {
              row: 0,
              col: 1,
              piece: "bN"
            }
          ]
        );

        expectParity(
          engine,
          1,
          0
        );
        expect(
          engine
            .modernMoveCandidates(
              1,
              0
            )
            .every(
              move =>
                move.promotion
            )
        ).toBe(true);
      }
    );


    test(
      "matches king-safety filtering for a pinned rook",
      () => {
        const engine =
          new ChessEngine(
            "modern"
          );

        place(
          engine,
          [
            {
              row: 7,
              col: 4,
              piece: "wK"
            },
            {
              row: 6,
              col: 4,
              piece: "wR"
            },
            {
              row: 0,
              col: 4,
              piece: "bR"
            },
            {
              row: 0,
              col: 0,
              piece: "bK"
            }
          ]
        );

        expectParity(
          engine,
          6,
          4
        );

        expect(
          engine
            .legalMoves(
              6,
              4
            )
            .every(
              move =>
                move.col === 4
            )
        ).toBe(true);
      }
    );


    test(
      "matches through a short ordinary sequence",
      () => {
        const engine =
          new ChessEngine(
            "modern"
          );
        const sequence = [
          [6, 4, 4, 4],
          [1, 4, 3, 4],
          [7, 6, 5, 5]
        ];

        sequence.forEach(
          ([
            fromRow,
            fromCol,
            toRow,
            toCol
          ]) => {
            expectParity(
              engine,
              fromRow,
              fromCol
            );

            engine.handleSquare(
              fromRow,
              fromCol
            );
            const state =
              engine.handleSquare(
                toRow,
                toCol
              );

            expect(state.error)
              .toBeNull();
          }
        );

        expect(
          engine.board[5][5]
        ).toBe("wN");
        expect(engine.turn)
          .toBe("b");
      }
    );
  }
);