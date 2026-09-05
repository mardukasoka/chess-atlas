/**
 * @jest-environment node
 */

const ChessEngine =
  require("./engine.js");


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
  const legacy =
    engine.legacyPseudoMoves(
      row,
      col
    );
  const candidates =
    engine.shatranjMoveCandidates(
      row,
      col
    );

  expect(
    keys(
      engine.shatranjPseudoMoves(
        row,
        col
      )
    )
  ).toEqual(
    keys(legacy)
  );

  candidates.forEach(
    move => {
      const occupant =
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
        .toBe(Boolean(occupant));
      expect(move.captured)
        .toBe(
          occupant || null
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
  "Shatranj generic-kernel parity",
  () => {
    test(
      "matches every piece in the full starting position",
      () => {
        const engine =
          new ChessEngine(
            "shatranj"
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
        piece: "wR"
      },
      {
        name: "king",
        piece: "wK"
      },
      {
        name: "knight",
        piece: "wN"
      },
      {
        name: "ferz",
        piece: "wF"
      },
      {
        name: "elephant",
        piece: "wE"
      }
    ])(
      "matches an open-board $name",
      ({
        piece
      }) => {
        const engine =
          new ChessEngine(
            "shatranj"
          );
        const pieces = [
          {
            row: 0,
            col: 0,
            piece: "bK"
          },
          {
            row: 4,
            col: 4,
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
          4,
          4
        );
      }
    );


    test(
      "elephant jumps occupied intermediates and obeys destination occupancy",
      () => {
        const engine =
          new ChessEngine(
            "shatranj"
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
              piece: "wE"
            },
            {
              row: 3,
              col: 3,
              piece: "wP"
            },
            {
              row: 2,
              col: 6,
              piece: "wP"
            },
            {
              row: 6,
              col: 2,
              piece: "bP"
            }
          ]
        );

        expectParity(
          engine,
          4,
          4
        );

        const candidates =
          engine
            .shatranjMoveCandidates(
              4,
              4
            );

        expect(
          candidates.some(
            move =>
              move.to[0] === 2 &&
              move.to[1] === 2
          )
        ).toBe(true);
        expect(
          candidates.some(
            move =>
              move.to[0] === 2 &&
              move.to[1] === 6
          )
        ).toBe(false);
        expect(
          candidates.find(
            move =>
              move.to[0] === 6 &&
              move.to[1] === 2
          ).capture
        ).toBe(true);
      }
    );


    test(
      "matches pawn one-step, capture and friendly blocking without a double-step",
      () => {
        const engine =
          new ChessEngine(
            "shatranj"
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
              .shatranjPseudoMoves(
                6,
                3
              )
          )
        ).toEqual([
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
            "shatranj"
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
            .shatranjMoveCandidates(
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
      "matches rook friendly blocking and enemy capture",
      () => {
        const engine =
          new ChessEngine(
            "shatranj"
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
      }
    );


    test(
      "matches king-safety filtering for a pinned rook",
      () => {
        const engine =
          new ChessEngine(
            "shatranj"
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
            "shatranj"
          );
        const sequence = [
          [6, 4, 5, 4],
          [1, 4, 2, 4],
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