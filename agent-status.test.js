const fs = require("fs");

describe("shared opponent status", () => {
  test("loads through every shared game shell", () => {
    const shell = fs.readFileSync("atlas-game-shell.js", "utf8");
    expect(shell).toContain("agent-status.js?v=1");
  });

  test("distinguishes local tiers and persists the choice", () => {
    const source = fs.readFileSync("agent-status.js", "utf8");
    expect(source).toContain("Local agent · random");
    expect(source).toContain("Local agent · heuristic");
    expect(source).toContain("Specialist engine");
    expect(source).toContain("localStorage.setItem");
    expect(source).toContain("rules engine remains authoritative");
  });
});
