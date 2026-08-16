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
  });

  test("selecting the white e2 pawn updates status", () => {
    const e2 = squareAt(6, 4);

    expect(e2.textContent).toBe("♙");

    touch(e2);

    expect(document.getElementById("status").textContent)
      .toContain("Selected ♙");
  });

  test("e2 pawn can be moved to e4 in the current prototype", () => {
    let e2 = squareAt(6, 4);
    let e4 = squareAt(4, 4);

    touch(e2);

    // drawBoard() rebuilds the square elements,
    // so obtain e4 again after selection.
    e4 = squareAt(4, 4);
    touch(e4);

    // drawBoard() rebuilt the DOM again.
    e2 = squareAt(6, 4);
    e4 = squareAt(4, 4);

    expect(e2.textContent).toBe("");
    expect(e4.textContent).toBe("♙");

    expect(document.getElementById("status").textContent)
      .toBe("Black to move");
  });

  test("Reset Game restores the starting position", () => {
    touch(squareAt(6, 4));
    touch(squareAt(4, 4));

    document.getElementById("reset").click();

    expect(squareAt(6, 4).textContent).toBe("♙");
    expect(squareAt(4, 4).textContent).toBe("");
    expect(document.getElementById("status").textContent)
      .toBe("White to move");
  });
});