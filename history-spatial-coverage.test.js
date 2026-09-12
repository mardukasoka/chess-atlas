"use strict";

const Coverage = require("./history-spatial-coverage.js");

const source = { label: "Source", url: "https://example.org/source" };
function polygon(subjectId, subjectKind) {
  return {
    id: `polygon-${subjectId}`,
    subjectId,
    subjectKind,
    geometryType: "Polygon",
    geometryMeaning: subjectKind === "culture" ? "reconstructed-distribution" : "core-area",
    coordinateSpace: "wgs84-lonlat",
    epistemicClass: "scholarly-reconstruction",
    time: { startYear: -1000, endYear: -900 },
    geometry: [[0,0],[1,0],[1,1]],
    confidence: "medium",
    reconstructionMethod: subjectKind === "culture" ? "schematic envelope from published distribution" : undefined,
    sources: [source]
  };
}

describe("Atlas historical spatial coverage", () => {
  test("requires every subject to be represented or explicitly unresolved", () => {
    const subjects = [
      { id: "state-a", kind: "state" },
      { id: "culture-b", kind: "culture" },
      { id: "language-c", kind: "language-group" }
    ];
    const report = Coverage.spatialCoverageReport(subjects, [polygon("state-a", "state")], [
      { id: "culture-b", kind: "culture", spatialStatus: "unresolved" }
    ]);
    expect(report.complete).toBe(false);
    expect(report.missing).toEqual([{ id: "language-c", kind: "language-group" }]);
    expect(report.byKind.state.represented).toBe(1);
    expect(report.byKind.culture.unresolved).toBe(1);
  });

  test("explicit unresolved geometry can complete coverage without inventing a polygon", () => {
    const subjects = [{ id: "ethnicity-a", kind: "ethnicity" }];
    const report = Coverage.spatialCoverageReport(subjects, [], [
      { id: "ethnicity-a", kind: "ethnicity", spatialStatus: "unresolved", reason: "insufficient historical spatial evidence" }
    ]);
    expect(report.complete).toBe(true);
    expect(report.explicitlyUnresolved).toBe(1);
  });

  test("invalid polygons do not satisfy spatial coverage", () => {
    const subjects = [{ id: "state-a", kind: "state" }];
    const bad = polygon("state-a", "state");
    delete bad.coordinateSpace;
    const report = Coverage.spatialCoverageReport(subjects, [bad]);
    expect(report.complete).toBe(false);
    expect(report.invalidPolygons).toHaveLength(1);
    expect(report.missing).toEqual([{ id: "state-a", kind: "state" }]);
  });

  test("reports orphan polygons and duplicate subject IDs", () => {
    const report = Coverage.spatialCoverageReport(
      [{ id: "state-a", kind: "state" }, { id: "state-a", kind: "state" }],
      [polygon("state-a", "state"), polygon("state-orphan", "state")]
    );
    expect(report.complete).toBe(false);
    expect(report.duplicateSubjectIds).toEqual(["state-a"]);
    expect(report.orphanPolygons).toEqual([{ id: "polygon-state-orphan", subjectId: "state-orphan" }]);
  });
});
