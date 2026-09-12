"use strict";

const Coverage = require("./history-baseline-coverage.js");

describe("Atlas history baseline coverage audit", () => {
  test("maps a record into every era it overlaps", () => {
    expect(Coverage.eraIdsFor({ time: { startYear: -1300, endYear: -1100 } })).toEqual([
      "early-states-bronze-age",
      "iron-age-axial"
    ]);
  });

  test("accepts only standard coverage regions", () => {
    expect(Coverage.regionIdsFor({ coverageRegions: ["south-asia", "mars", "south-asia"] })).toEqual(["south-asia"]);
  });

  test("reports geographic and chronological holes explicitly", () => {
    const report = Coverage.coverageReport([{
      id: "event-test",
      type: "event",
      status: "canonical",
      time: { year: -500 },
      coverageRegions: ["east-asia"]
    }]);
    expect(report.matrix["iron-age-axial"]["east-asia"].canonical).toBe(1);
    expect(report.matrix["iron-age-axial"]["europe"].total).toBe(0);
    expect(report.emptyCells).toContainEqual({ era: "iron-age-axial", region: "europe" });
  });

  test("does not hide records lacking time or regional assignment", () => {
    const report = Coverage.coverageReport([{ id: "orphan", type: "event", status: "candidate" }]);
    expect(report.unassigned).toContain("orphan");
  });

  test("covers all regions required by the baseline tasking", () => {
    expect(Coverage.REGIONS).toEqual(expect.arrayContaining([
      "europe",
      "middle-east-north-africa",
      "sub-saharan-africa",
      "central-asia-steppe",
      "south-asia",
      "east-asia",
      "southeast-asia",
      "north-america",
      "central-america-caribbean",
      "south-america",
      "oceania-pacific"
    ]));
  });
});
