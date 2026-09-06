"use strict";

const Tesseract = require("./tesseract-renderer.js");

describe("tesseract renderer geometry", () => {
  test("enumerates 4x4x2x2 as 64 cells", () => {
    expect(Tesseract.enumerateCells([4, 4, 2, 2])).toHaveLength(64);
  });

  test("4D adjacency changes exactly one axis by one", () => {
    expect(Tesseract.adjacent4D([0, 0, 0, 0], [1, 0, 0, 0])).toBe(true);
    expect(Tesseract.adjacent4D([0, 0, 0, 0], [0, 0, 0, 1])).toBe(true);
    expect(Tesseract.adjacent4D([0, 0, 0, 0], [1, 1, 0, 0])).toBe(false);
  });

  test("4D board has expected axis-edge count", () => {
    // Sum over axes: (size_i - 1) * product(other sizes).
    expect(Tesseract.edgePairs([4, 4, 2, 2])).toHaveLength(160);
  });

  test("projection separates W without changing game coordinates", () => {
    const lower = Tesseract.project4D([1, 1, 0, 0]);
    const upper = Tesseract.project4D([1, 1, 0, 1]);
    expect(upper.x).not.toBe(lower.x);
    expect(upper.y).not.toBe(lower.y);
    expect(Tesseract.coordinateId([1, 1, 0, 1])).toBe("1:1:0:1");
  });
});
