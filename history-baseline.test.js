"use strict";

const Baseline = require("./history-baseline.js");

function source(overrides = {}) {
  return {
    label: "Example academic source",
    type: "academic-secondary",
    reference: "Example citation, pp. 1-10",
    url: "https://example.org/source",
    ...overrides
  };
}

function record(overrides = {}) {
  return {
    id: "event-example",
    type: "event",
    name: "Example historical event",
    time: { year: -323, precision: "year" },
    epistemicClass: "documented",
    status: "reviewed",
    confidence: 0.9,
    confidenceRationale: "Multiple independent sources agree on the core chronology.",
    sources: [source()],
    geography: { lat: 32.5, lon: 44.4 },
    ...overrides
  };
}

describe("Atlas canonical history baseline", () => {
  test("accepts an evidence-backed reviewed record", () => {
    expect(Baseline.validateBaselineRecord(record())).toEqual({ ok: true, errors: [] });
  });

  test("requires provenance and an explicit confidence rationale", () => {
    const result = Baseline.validateBaselineRecord(record({ sources: [], confidenceRationale: "" }));
    expect(result.ok).toBe(false);
    expect(result.errors.join(" ")).toMatch(/provenance source/i);
    expect(result.errors.join(" ")).toMatch(/confidenceRationale/i);
  });

  test("keeps simulation and player state outside the baseline", () => {
    const result = Baseline.validateBaselineRecord(record({ simulation: { outcome: "Rome conquers India" } }));
    expect(result.ok).toBe(false);
    expect(result.errors.join(" ")).toMatch(/simulation is forbidden/i);
  });

  test("does not promote a simulator import directly to canonical authority", () => {
    const imported = record({
      status: "candidate",
      sources: [source({ type: "candidate-import", label: "Human History Simulator seed" })]
    });
    expect(Baseline.canPromoteToCanonical(imported)).toBe(false);
  });

  test("allows reconstruction while preserving its epistemic class", () => {
    const reconstruction = record({
      id: "boundary-example",
      type: "boundary",
      epistemicClass: "archaeological-reconstruction",
      confidence: 0.65,
      confidenceRationale: "Boundary is reconstructed from settlement and material evidence.",
      time: { startYear: -1600, endYear: -1500, precision: "range" }
    });
    expect(Baseline.validateBaselineRecord(reconstruction).ok).toBe(true);
  });

  test("rejects contradictory exact and ranged chronology", () => {
    const result = Baseline.validateBaselineRecord(record({ time: { year: 100, startYear: 90, endYear: 110 } }));
    expect(result.ok).toBe(false);
    expect(result.errors.join(" ")).toMatch(/either year or startYear\/endYear/i);
  });

  test("advertises a read-only epistemic boundary", () => {
    expect(Baseline.baselineLimits()).toMatchObject({
      simulationAllowed: false,
      candidateImportsAreAuthority: false,
      canonicalMutationBySimulation: false
    });
  });
});
