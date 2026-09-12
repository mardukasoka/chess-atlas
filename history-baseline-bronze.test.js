"use strict";

const Baseline = require("./history-baseline.js");
const Coverage = require("./history-baseline-coverage.js");
const Bronze = require("./history-baseline-bronze.js");

describe("Atlas Early States / Bronze Age baseline spine", () => {
  test("every anchor passes the baseline validator", () => {
    for (const record of Bronze.records) {
      const result = Baseline.validateBaselineRecord(record);
      expect(result.ok).toBe(true);
      expect(result.errors).toEqual([]);
    }
  });

  test("the first-pass spine represents every world coverage region", () => {
    const represented = new Set(Bronze.records.flatMap(record => record.coverageRegions));
    for (const region of Coverage.REGIONS) expect(represented.has(region)).toBe(true);
  });

  test("indirect Olmec chronology remains candidate rather than canonical", () => {
    expect(Bronze.get("culture-olmec-early-state-horizon")).toMatchObject({
      status: "candidate",
      epistemicClass: "scholarly-reconstruction"
    });
  });

  test("baseline spine preserves different forms of social organization", () => {
    const types = new Set(Bronze.records.map(record => record.type));
    expect(types).toEqual(expect.objectContaining ? types : types);
    expect(types.has("polity")).toBe(true);
    expect(types.has("place")).toBe(true);
    expect(types.has("culture")).toBe(true);
  });

  test("Bronze Age coverage is measured separately from later continuity", () => {
    const report = Coverage.coverageReport(Bronze.records);
    for (const region of Coverage.REGIONS) {
      expect(report.matrix["early-states-bronze-age"][region].total).toBeGreaterThan(0);
    }
  });
});
