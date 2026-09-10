"use strict";

const Asian = require("./asian-games-archaeology.js");

describe("Asian game archaeology", () => {
  test("Liubo preserves securely attested Han equipment without inventing full rules", () => {
    const game = Asian.get("liubo");
    expect(game.region).toBe("China");
    expect(game.players).toBe(2);
    expect(game.pieces.perSide).toBe(6);
    expect(game.pieces.total).toBe(12);
    expect(game.board.topology).toBe("marked-road-board");
    expect(game.chanceEquipment).toContain("dice");
    expect(game.rulesStatus).toMatch(/complete-rules-not-secure/);
    expect(game.playable).toBe(false);
  });

  test("Liubo chronology does not promote early literary tradition into secure archaeology", () => {
    const game = Asian.get("liubo");
    expect(game.chronology.secureArchaeologicalHorizon).toMatch(/Warring States.*Han/i);
    expect(game.chronology.earlyClaimStatus).toMatch(/visual evidence.*sparse/i);
  });

  test("Liubo and Go are not encoded as a direct ancestor-descendant chain", () => {
    const liuboLink = Asian.sequence.find(item => item.id === "liubo");
    const goLink = Asian.sequence.find(item => item.id === "go");
    expect(liuboLink.descentClaim).toBe(false);
    expect(goLink.descentClaim).toBe(false);
    expect(Asian.get("go").archaeologyNote).toMatch(/does not establish direct descent/i);
  });

  test("archaeological profiles retain provenance", () => {
    expect(Asian.get("liubo").sources.length).toBeGreaterThanOrEqual(3);
    expect(Asian.get("liubo").sources.every(source => source.startsWith("https://"))).toBe(true);
  });
});
