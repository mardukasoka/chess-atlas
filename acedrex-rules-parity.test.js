/**
 * @jest-environment node
 */

const ChessEngine =
  require("./engine.js");


function emptyBoard() {
  return Array.from(
    { length: 8 },
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
    engine.acedrexMoveCandidates(
      row,
      col
    );

  expect(
    keys(
      engine.acedrexPseudoMoves(
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
  "Acedrex generic-kernel parity",
  () => {
    test(
      "matches every piece in the starting position",
      () => {
        const engine =
          new ChessEngine(
            "acedrex"
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
      ["rook", "wR"],
      ["king", "wK"],
      ["knight", "wN"],
      ["bishop jump", "wB"]
    ])(
      "matches an open-board %s",
      (
        name,
        piece
      ) => {
        const engine =
          new ChessEngine(
            "acedrex"
          );

        place(
          engine,
          [
            {
              row: 0,
              col: 0,
              piece: "bK"
            },
            {
              row: 4,
              col: 4,
              piece
            },
            {
              row: 7,
              col: 7,
              piece: "wK"
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
      "matches the bishop two-square jump over occupancy",
      () => {
        const engine =
          new ChessEngine(
            "acedrex"
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
              piece: "wB"
            },
            {
              row: 3,
              col: 3,
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
        expect(
          engine
            .acedrexMoveCandidates(
              4,
              4
            )
            .some(
              move =>
                move.to[0] === 2 &&
                move.to[1] === 2
            )
        ).toBe(true);
      }
    );


    test(
      "matches queen normal and first-move special movement",
      () => {
        const engine =
          new ChessEngine(
            "acedrex"
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
              piece: "wQ"
            },
            {
              row: 3,
              col: 3,
              piece: "wP"
            },
            {
              row: 2,
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

        const candidates =
          engine
            .acedrexMoveCandidates(
              4,
              4
            );

        // The occupied intermediate square does not stop
        // the special jump, but the enemy destination does.
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
              move.to[0] === 2 &&
              move.to[1] === 2
          ).capture
        ).toBe(false);
      }
    );


    test(
      "removes the special queen movement after that queen moves",
      () => {
        const engine =
          new ChessEngine(
            "acedrex"
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
              piece: "wQ"
            }
          ]
        );

        expect(
          engine
            .acedrexPseudoMoves(
              4,
              4
            )
        ).toContainEqual({
          row: 2,
          col: 2
        });

        engine.handleSquare(
          4,
          4
        );
        engine.handleSquare(
          3,
          3
        );

        expect(
          engine.queenHasMoved.w
        ).toBe(true);
        expectParity(
          engine,
          3,
          3
        );
        expect(
          engine
            .acedrexPseudoMoves(
              3,
              3
            )
        ).not.toContainEqual({
          row: 1,
          col: 1
        });
      }
    );


    test(
      "matches pawn movement before and after captureOccurred",
      () => {
        const engine =
          new ChessEngine(
            "acedrex"
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
            engine.acedrexPseudoMoves(
              6,
              3
            )
          )
        ).toEqual([
          "4,3",
          "5,2",
          "5,3"
        ]);

        engine.captureOccurred =
          true;
        expectParity(
          engine,
          6,
          3
        );
        expect(
          keys(
            engine.acedrexPseudoMoves(
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
      "matches rook friendly blocking and enemy capture",
      () => {
        const engine =
          new ChessEngine(
            "acedrex"
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
      "matches promotion metadata and queen-dependent replacement",
      () => {
        const withQueen =
          new ChessEngine(
            "acedrex"
          );

        place(
          withQueen,
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
              row: 7,
              col: 3,
              piece: "wQ"
            },
            {
              row: 1,
              col: 0,
              piece: "wP"
            }
          ]
        );
        expectParity(
          withQueen,
          1,
          0
        );
        withQueen.handleSquare(
          1,
          0
        );
        expect(
          withQueen.handleSquare(
            0,
            0
          ).board[0][0]
        ).toBe("wP");

        const withoutQueen =
          new ChessEngine(
            "acedrex"
          );

        place(
          withoutQueen,
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
            }
          ]
        );
        expectParity(
          withoutQueen,
          1,
          0
        );
        withoutQueen.handleSquare(
          1,
          0
        );
        expect(
          withoutQueen.handleSquare(
            0,
            0
          ).board[0][0]
        ).toBe("wQ");
      }
    );


    test(
      "matches king-safety filtering for a pinned rook",
      () => {
        const engine =
          new ChessEngine(
            "acedrex"
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
          engine.legalMoves(
            6,
            4
          ).every(
            move =>
              move.col === 4
          )
        ).toBe(true);
      }
    );


    test(
      "matches through a representative legal sequence",
      () => {
        const engine =
          new ChessEngine(
            "acedrex"
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


    test(
      "restores queen and capture context",
      () => {
        const engine =
          new ChessEngine(
            "acedrex"
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
              piece: "wQ"
            },
            {
              row: 6,
              col: 3,
              piece: "wP"
            }
          ]
        );
        engine.captureOccurred =
          true;
        engine.queenHasMoved = {
          w: true,
          b: false
        };

        const snapshot =
          engine.getState();
        const restored =
          new ChessEngine(
            "modern"
          );

        restored.restoreState(
          snapshot
        );

        expect(
          restored.captureOccurred
        ).toBe(true);
        expect(
          restored.queenHasMoved
        ).toEqual({
          w: true,
          b: false
        });
        expectParity(
          restored,
          4,
          4
        );
        expectParity(
          restored,
          6,
          3
        );
      }
    );
  }
);