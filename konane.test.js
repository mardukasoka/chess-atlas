"use strict";

const Konane = require("./konane.js");

describe("Konane", () => {
  test("board starts full in an alternating pattern", () => {
    const game = new Konane.KonaneGame({ size: 8 });
    expect(game.get([0, 0])).toBe("b");
    expect(game.get([0, 1])).toBe("w");
    expect(game.snapshot().board.flat().filter(Boolean)).toHaveLength(64);
  });

  test("black opening choices are black corners or center stones", () => {
    const game = new Konane.KonaneGame({ size: 8 });
    const choices = game.blackOpeningChoices().map(String);
    expect(choices).toContain(String([0, 0]));
    expect(choices).toContain(String([3, 3]));
    expect(choices).not.toContain(String([0, 1]));
  });

  test("white second removal must be orthogonally adjacent", () => {
    const game = new Konane.KonaneGame({ size: 8 });
    game.removeOpening([0, 0]);
    expect(game.whiteOpeningChoices().map(String)).toEqual(expect.arrayContaining([
      String([0, 1]), String([1, 0])
    ]));
    expect(() => game.removeOpening([1, 2])).toThrow();
    game.removeOpening([0, 1]);
    expect(game.phase).toBe("play");
    expect(game.turn).toBe("b");
  });

  test("capture jumps are orthogonal and may chain in one direction", () => {
    const game = new Konane.KonaneGame({ size: 8 });
    // Construct a simple play-phase line: b w . w .
    game.board = Array.from({ length: 8 }, () => Array(8).fill(null));
    game.board[0][0] = "b";
    game.board[0][1] = "w";
    game.board[0][3] = "w";
    game.phase = "play";
    game.turn = "b";

    const moves = game.jumpsFrom([0, 0]);
    expect(moves.some(move => String(move.to) === String([0, 2]) && move.captures.length === 1)).toBe(true);
    expect(moves.some(move => String(move.to) === String([0, 4]) && move.captures.length === 2)).toBe(true);
  });

  test("captured stones are removed and turn changes", () => {
    const game = new Konane.KonaneGame({ size: 6 });
    game.board = Array.from({ length: 6 }, () => Array(6).fill(null));
    game.board[2][0] = "b";
    game.board[2][1] = "w";
    game.board[5][5] = "w";
    game.board[5][4] = "b";
    game.phase = "play";
    game.turn = "b";

    game.move([2, 0], [2, 2]);
    expect(game.get([2, 0])).toBeNull();
    expect(game.get([2, 1])).toBeNull();
    expect(game.get([2, 2])).toBe("b");
    expect(game.turn).toBe("w");
  });
});
