/**
 * @jest-environment jsdom
 */

const fs = require("fs");
const path = require("path");

const ChessEngine = require("./engine.js");

function touch(element) {
  const event = new Event(
    "pointerdown",
    {
      bubbles: true,
      cancelable: true
    }
  );

  element.dispatchEvent(event);
}

function squareAt(row, col) {
  return document
    .querySelectorAll("#board .square")
    [row * 8 + col];
}

describe(
  "Chess Atlas headless engine",
  () => {
    test(
      "creates a complete 8x8 board",
      () => {
        const engine = new ChessEngine();
        const state = engine.getState();

        expect(state.board).toHaveLength(8);

        for (const row of state.board) {
          expect(row).toHaveLength(8);
        }
      }
    );

    test(
      "starts with White to move",
      () => {
        const engine = new ChessEngine();
        const state = engine.getState();

        expect(state.turn)
          .toBe("White");

        expect(state.status)
          .toBe("White to move");
      }
    );

    test(
      "selecting the white e2 pawn updates status",
      () => {
        const engine = new ChessEngine();

        const state =
          engine.handleSquare(6, 4);

        expect(state.board[6][4])
          .toBe("♙");

        expect(state.selected)
          .toEqual({
            row: 6,
            col: 4
          });

        expect(state.status)
          .toContain("Selected ♙");
      }
    );

    test(
      "Black cannot select or move while it is White's turn",
      () => {
        const engine = new ChessEngine();

        engine.handleSquare(1, 4);

        const state =
          engine.handleSquare(3, 4);

        expect(state.board[1][4])
          .toBe("♟");

        expect(state.board[3][4])
          .toBe("");

        expect(state.turn)
          .toBe("White");

        expect(state.status)
          .toBe("White to move");

        expect(state.selected)
          .toBeNull();
      }
    );

    test(
      "a player can switch between friendly pieces without consuming the turn",
      () => {
        const engine = new ChessEngine();

        engine.handleSquare(6, 4);

        const state =
          engine.handleSquare(6, 3);

        expect(state.selected)
          .toEqual({
            row: 6,
            col: 3
          });

        expect(state.turn)
          .toBe("White");

        expect(state.status)
          .toContain(
            "Selected ♙ at 6,3"
          );
      }
    );

    test(
      "e2 pawn can be moved to e4 in the current prototype",
      () => {
        const engine = new ChessEngine();

        engine.handleSquare(6, 4);

        const state =
          engine.handleSquare(4, 4);

        expect(state.board[6][4])
          .toBe("");

        expect(state.board[4][4])
          .toBe("♙");

        expect(state.turn)
          .toBe("Black");

        expect(state.status)
          .toBe("Black to move");
      }
    );

    test(
      "Reset Game restores the starting position and turn",
      () => {
        const engine = new ChessEngine();

        engine.handleSquare(6, 4);
        engine.handleSquare(4, 4);

        const state =
          engine.resetGame();

        expect(state.board[6][4])
          .toBe("♙");

        expect(state.board[4][4])
          .toBe("");

        expect(state.selected)
          .toBeNull();

        expect(state.turn)
          .toBe("White");

        expect(state.status)
          .toBe("White to move");
      }
    );
  }
);

describe(
  "Chess Atlas browser boundary",
  () => {
    beforeEach(() => {
      jest.resetModules();

      const html =
        fs.readFileSync(
          path.resolve(
            __dirname,
            "index.html"
          ),
          "utf8"
        );

      document.open();
      document.write(html);
      document.close();

      window.ChessEngine =
        ChessEngine;

      require("./chess.js");
    });

    test(
      "pointer events delegate a move to the engine and repaint the board",
      () => {
        expect(
          document
            .querySelectorAll(
              "#board .square"
            )
        ).toHaveLength(64);

        const e2 = squareAt(6, 4);
        const e4 = squareAt(4, 4);

        expect(e2.textContent)
          .toBe("♙");

        touch(e2);
        touch(e4);

        expect(
          squareAt(6, 4).textContent
        ).toBe("");

        expect(
          squareAt(4, 4).textContent
        ).toBe("♙");

        expect(
          document
            .getElementById(
              "turn-display"
            )
            .textContent
        ).toBe("Black");

        expect(
          document
            .getElementById("status")
            .textContent
        ).toBe("Black to move");
      }
    );
  }
);