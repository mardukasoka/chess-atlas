"use strict";

const Early = require("./early-games-archaeology.js");

describe("early Egyptian and Near Eastern game archaeology", () => {
  test("Mehen is represented as a spiral board without invented rules", () => {
    const mehen = Early.get("mehen");
    expect(mehen.board.topology).toBe("spiral");
    expect(mehen.rulesStatus).toBe("unknown");
    expect(mehen.playable).toBe(false);
    expect(mehen.sources.length).toBeGreaterThan(1);
  });

  test("Fifty-Eight Holes preserves the secure two-track race evidence", () => {
    const game = Early.get("fifty-eight-holes");
    expect(game.board.topology).toBe("paired-tracks");
    expect(game.board.holesPerSide).toBe(29);
    expect(game.pieces.perSide).toBe(5);
    expect(game.rulesStatus).toMatch(/complete-rules-unknown/);
    expect(game.playable).toBe(false);
  });

  test("all archaeology profiles retain source provenance", () => {
    Early.list().forEach(profile => {
      expect(profile.sources.length).toBeGreaterThan(0);
      expect(profile.evidence.length).toBeGreaterThan(0);
    });
  });
});
