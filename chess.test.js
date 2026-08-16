/**
 * @jest-environment jsdom
 */

const fs = require("fs");
const path = require("path");

function touch(element) {
  const event = new Event("pointerdown", {
    bubbles: true,
    cancelable: true
  });

  element.dispatchEvent(event);
}

function squareAt(row, col) {
  return document.querySelectorAll("#board .square")[row * 8 + col];
}

describe("Chess Atlas browser state", () => {
  beforeEach(() => {
    jest.resetModules();

    const html = fs.readFileSync(
      path.resolve(__dirname, "index.html"),
      "utf8"
    );

    document.open();
    document.write(html);
    document.close();

    require("./chess.js");
  });

  test("creates a complete 8x8 board", () => {
    const board = document.getElementById("board");

    expect(board).not.toBeNull();
    expect(board.querySelectorAll(".square")).toHaveLength(64);
  });

  test("starts with White to move", () => {
    expect(document.getElementById("status").textContent)
      .toBe("White to move");

    expect(document.getElementById("turn-display").textContent)
      .toBe("White");
  });

  test("selecting the white e2 pawn updates status", () => {
    const e2 = squareAt(6, 4);

    expect(e2.textContent).toBe("♙");

    touch(e2);

    expect(document.getElementById("status").textContent)
      .toContain("Selected ♙");
  });

  test("e2 pawn can be moved to e4 in the current prototype", () => {
    const e2 = squareAt(6, 4);
    const e4 = squareAt(4, 4);

    touch(e2);
    touch(e4);

    expect(squareAt(6, 4).textContent).toBe("");
    expect(squareAt(4, 4).textContent).toBe("♙");

    expect(document.getElementById("status").textContent)
      .toBe("Black to move");
  });

  test("turn indicator switches after a valid move", () => {
    expect(document.getElementById("turn-display").textContent)
      .toBe("White");

    touch(squareAt(6, 4));
    touch(squareAt(4, 4));

    expect(document.getElementById("turn-display").textContent)
      .toBe("Black");
  });

  test("Reset Game restores the starting position and turn", () => {
    touch(squareAt(6, 4));
    touch(squareAt(4, 4));

    document.getElementById("reset").click();

    expect(squareAt(6, 4).textContent).toBe("♙");
    expect(squareAt(4, 4).textContent).toBe("");

    expect(document.getElementById("status").textContent)
      .toBe("White to move");

    expect(document.getElementById("turn-display").textContent)
      .toBe("White");
  });
});