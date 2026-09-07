"use strict";

const assert = require("assert");
const ExoticAtoms = require("./exotic-atoms.js");

test("exotic atom catalogue separates observed and theoretical systems", () => {
  const ids = ExoticAtoms.systems.map(system => system.id);
  assert.strictEqual(new Set(ids).size, ids.length);

  for (const system of ExoticAtoms.systems) {
    assert.strictEqual(ExoticAtoms.validateSystem(system), true);
    assert.strictEqual(system.strangeness, 0);
  }

  assert.strictEqual(ExoticAtoms.get("muonic-hydrogen").status, "observed");
  assert.strictEqual(ExoticAtoms.get("muonic-helium-4").status, "observed");
  assert.strictEqual(ExoticAtoms.get("pionic-hydrogen").status, "observed");
  assert.strictEqual(ExoticAtoms.get("pionic-helium-4").status, "observed");
  assert.strictEqual(ExoticAtoms.get("tauonic-hydrogen").status, "theoretical");
  assert.strictEqual(ExoticAtoms.get("tauonic-helium").status, "theoretical");

  assert.deepStrictEqual(
    ExoticAtoms.list({ family: "muonic atom" }).map(system => system.id),
    ["muonic-hydrogen", "muonic-deuterium", "muonic-helium-3", "muonic-helium-4"]
  );

  const helium4 = ExoticAtoms.get("muonic-helium-4");
  assert.strictEqual(helium4.measured.chargeRadiusFm, 1.67824);
  assert.strictEqual(helium4.measured.uncertaintyFm, 0.00083);
  assert.ok(helium4.sources.some(source => source.includes("nature.com")));
});
