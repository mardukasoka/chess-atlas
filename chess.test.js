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