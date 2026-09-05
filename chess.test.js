/**
 * @jest-environment jsdom
 */

const fs =
  require("fs");

const path =
  require("path");

const ChessEngine =
  require("./engine.js");


function touch(
  element
) {
  const event =
    new Event(
      "pointerdown",
      {
        bubbles: true,
        cancelable: true
      }
    );

  element.dispatchEvent(
    event
  );
}


function squareAt(
  row,
  col
) {
  return document
    .querySelectorAll(
      "#board .square"
    )[
      row * 8 + col
    ];
}


describe(
  "Historical Chess Atlas engine",
  () => {

    test(
      "Chaturanga creates an 8x8 board",
      () => {

        const engine =
          new ChessEngine(
            "chaturanga"
          );

        expect(
          engine.board
        ).toHaveLength(8);

        engine.board.forEach(
          row => {
            expect(row)
              .toHaveLength(8);
          }
        );

            }
    );


test(
  "Acedrex pawn may double-step before the first capture",
  () => {

    const engine =
      new ChessEngine(
        "acedrex"
      );

    const moves =
      engine.legalMoves(
        6,
        4
      );

    expect(moves)
      .toContainEqual({
        row: 4,
        col: 4
      });

  }
);


test(
  "Acedrex pawn double-step disappears after a capture",
  () => {

    const engine =
      new ChessEngine(
        "acedrex"
      );

    // Create a simple capture position.
    engine.board[4][4] =
      "wP";

    engine.board[3][3] =
      "bP";

    engine.board[6][4] =
      "";

    engine.turn =
      "w";

    engine.handleSquare(
      4,
      4
    );

    engine.handleSquare(
      3,
      3
    );

    // Return turn to White so we can
    // inspect another starting pawn.
    engine.turn =
      "w";

    const moves =
      engine.legalMoves(
        6,
        0
      );

    expect(moves)
      .toContainEqual({
        row: 5,
        col: 0
      });

    expect(moves)
      .not
      .toContainEqual({
        row: 4,
        col: 0
      });

  }
);


test(
  "Acedrex bishop jumps exactly two diagonal squares",
  () => {

    const engine =
      new ChessEngine(
        "acedrex"
      );

    const moves =
      engine.legalMoves(
        7,
        2
      );

    expect(moves)
      .toContainEqual({
        row: 5,
        col: 0
      });

    expect(moves)
      .toContainEqual({
        row: 5,
        col: 4
      });

    expect(moves)
      .not
      .toContainEqual({
        row: 6,
        col: 3
      });

  }
);


test(
  "Acedrex queen has a special two-square first move",
  () => {

    const engine =
      new ChessEngine(
        "acedrex"
      );

    // Clear the landing squares.
    engine.board[5][1] =
      "";

    engine.board[5][5] =
      "";

    const moves =
      engine.legalMoves(
        7,
        3
      );

    expect(moves)
      .toContainEqual({
        row: 5,
        col: 1
      });

    expect(moves)
      .toContainEqual({
        row: 5,
        col: 5
      });

  }
);


test(
  "Acedrex queen loses the two-square jump after moving",
  () => {

    const engine =
      new ChessEngine(
        "acedrex"
      );

    // Clear one diagonal square.
    engine.board[6][2] =
      "";

    // Move queen one square.
    engine.handleSquare(
      7,
      3
    );

    engine.handleSquare(
      6,
      2
    );

    // Force turn back for the test.
    engine.turn =
      "w";

    const moves =
      engine.legalMoves(
        6,
        2
      );

    expect(moves)
      .not
      .toContainEqual({
        row: 4,
        col: 0
      });

    expect(moves)
      .not
      .toContainEqual({
        row: 4,
        col: 4
      });

  }
);


test(
  "Acedrex pawn does not promote while own queen still exists",
  () => {

    const engine =
      new ChessEngine(
        "acedrex"
      );

    // Construct a promotion position.
    engine.board =
      Array.from(
        { length: 8 },
        () =>
          Array(8)
            .fill("")
      );

    engine.board[7][4] =
      "wK";

    engine.board[0][4] =
      "bK";

    engine.board[7][3] =
      "wQ";

    engine.board[1][0] =
      "wP";

    engine.turn =
      "w";

    engine.handleSquare(
      1,
      0
    );

    const state =
      engine.handleSquare(
        0,
        0
      );

    expect(
      state.board[0][0]
    ).toBe(
      "wP"
    );

  }
);


test(
  "Acedrex pawn promotes after own queen has been captured",
  () => {

    const engine =
      new ChessEngine(
        "acedrex"
      );

    engine.board =
      Array.from(
        { length: 8 },
        () =>
          Array(8)
            .fill("")
      );

    engine.board[7][4] =
      "wK";

    engine.board[0][4] =
      "bK";

    // No white queen remains.
    engine.board[1][0] =
      "wP";

    engine.turn =
      "w";

    engine.handleSquare(
      1,
      0
    );

    const state =
      engine.handleSquare(
        0,
        0
      );

    expect(
      state.board[0][0]
    ).toBe(
      "wQ"
    );

    }
);


    test(
      "Chaturanga starts with historical pieces",
      () => {

        const engine =
          new ChessEngine(
            "chaturanga"
          );

        expect(
          engine.board[7]
        ).toEqual([
          "wR",
          "wN",
          "wE",
          "wF",
          "wK",
          "wE",
          "wN",
          "wR"
        ]);

        expect(
          engine.board[0]
        ).toEqual([
          "bR",
          "bN",
          "bE",
          "bK",
          "bF",
          "bE",
          "bN",
          "bR"
        ]);

      }
    );


    test(
      "Chaturanga pawn moves one square but not two",
      () => {

        const engine =
          new ChessEngine(
            "chaturanga"
          );

        const moves =
          engine.legalMoves(
            6,
            0
          );

        expect(moves)
          .toContainEqual({
            row: 5,
            col: 0
          });

        expect(moves)
          .not
          .toContainEqual({
            row: 4,
            col: 0
          });

      }
    );


    test(
      "Shatranj pawn also has no double step",
      () => {

        const engine =
          new ChessEngine(
            "shatranj"
          );

        const moves =
          engine.legalMoves(
            6,
            4
          );

        expect(moves)
          .toContainEqual({
            row: 5,
            col: 4
          });

        expect(moves)
          .not
          .toContainEqual({
            row: 4,
            col: 4
          });

      }
    );


    test(
      "Modern chess restores the pawn double step",
      () => {

        const engine =
          new ChessEngine(
            "modern"
          );

        const moves =
          engine.legalMoves(
            6,
            4
          );

        expect(moves)
          .toContainEqual({
            row: 5,
            col: 4
          });

        expect(moves)
          .toContainEqual({
            row: 4,
            col: 4
          });

      }
    );


    test(
      "Chaturanga elephant jumps two orthogonally",
      () => {

        const engine =
          new ChessEngine(
            "chaturanga"
          );

        const moves =
          engine.legalMoves(
            7,
            2
          );

        expect(moves)
          .toContainEqual({
            row: 5,
            col: 2
          });

      }
    );


    test(
      "Shatranj elephant jumps two diagonally",
      () => {

        const engine =
          new ChessEngine(
            "shatranj"
          );

        const moves =
          engine.legalMoves(
            7,
            2
          );

        expect(moves)
          .toContainEqual({
            row: 5,
            col: 0
          });

        expect(moves)
          .toContainEqual({
            row: 5,
            col: 4
          });

      }
    );


    test(
      "Ferz moves one square diagonally",
      () => {

        const engine =
          new ChessEngine(
            "shatranj"
          );

        // Clear the pawns in front
        // of the ferz.
        engine.board[6][2] = "";
        engine.board[6][4] = "";

        const moves =
          engine.legalMoves(
            7,
            3
          );

        expect(moves)
          .toContainEqual({
            row: 6,
            col: 2
          });

        expect(moves)
          .toContainEqual({
            row: 6,
            col: 4
          });

      }
    );


    test(
      "friendly piece click changes selection without moving",
      () => {

        const engine =
          new ChessEngine(
            "chaturanga"
          );

        engine.handleSquare(
          6,
          4
        );

        const state =
          engine.handleSquare(
            6,
            3
          );

        expect(
          state.selected
        ).toEqual({
          row: 6,
          col: 3
        });

        expect(
          state.turn
        ).toBe("White");

        expect(
          state.board[6][4]
        ).toBe("wP");

        expect(
          state.board[6][3]
        ).toBe("wP");

      }
    );


    test(
      "legal Chaturanga pawn move consumes the turn",
      () => {

        const engine =
          new ChessEngine(
            "chaturanga"
          );

        engine.handleSquare(
          6,
          4
        );

        const state =
          engine.handleSquare(
            5,
            4
          );

        expect(
          state.board[6][4]
        ).toBe("");

        expect(
          state.board[5][4]
        ).toBe("wP");

        expect(
          state
            .turn
        ).toBe("Black");

      }
    );
  }
);
