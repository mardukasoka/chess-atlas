"use strict";

const Baseline = require("./history-baseline.js");
const Coverage = require("./history-baseline-coverage.js");
const Neolithic = require("./history-baseline-neolithic.js");

describe("Atlas first global prehistory/Neolithic baseline batch", () => {
  test("every anchor passes the baseline epistemic validator", () => {
    for (const record of Neolithic.records) {
      const result = Baseline.validateBaselineRecord(record);
      expect(result.ok).toBe(true);
      expect(result.errors).toEqual([]);
    }
  });

  test("every standard coverage region has at least one researched anchor", () => {
    const represented = new Set(Neolithic.records.flatMap(record => record.coverageRegions));
    for (const region of Coverage.REGIONS) expect(represented.has(region)).toBe(true);
  });

  test("candidate chronologies remain visibly non-canonical", () => {
    for (const id of [
      "place-trang-an-prehistoric-sequence",
      "place-shum-laka-holocene-burials",
      "place-head-smashed-in-early-use",
      "place-monte-verde-ii",
      "technology-kuk-early-agriculture"
    ]) {
      expect(Neolithic.get(id).status).toBe("candidate");
    }
  });

  test("research networks and archaeological anchors are not encoded as invented polities", () => {
    expect(Neolithic.records.some(record => record.type === "polity")).toBe(false);
  });

  test("coverage audit exposes remaining empty era-region cells", () => {
    const report = Coverage.coverageReport(Neolithic.records);
    expect(report.emptyCells.length).toBeGreaterThan(0);
    expect(report.unassigned).toEqual([]);
  });
});
