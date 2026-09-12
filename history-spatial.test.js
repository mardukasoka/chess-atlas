"use strict";

const Spatial = require("./history-spatial.js");

describe("Atlas historical spatial polygons", () => {
  const source = { label: "Example scholarly map", url: "https://example.org/map" };

  test("accepts a sourced political territory polygon", () => {
    const result = Spatial.validatePolygonRecord({
      id: "rome-100ce",
      subjectId: "polity-roman-empire",
      subjectKind: "empire",
      geometryMeaning: "controlled-territory",
      epistemicClass: "scholarly-reconstruction",
      time: { startYear: 100, endYear: 100 },
      geometry: [[0,0],[1,0],[1,1],[0,1]],
      confidence: "medium",
      sources: [source]
    });
    expect(result.ok).toBe(true);
  });

  test("rejects language as a sovereign political border", () => {
    const result = Spatial.validatePolygonRecord({
      id: "bad-language-border",
      subjectId: "language-latin",
      subjectKind: "language-group",
      geometryMeaning: "controlled-territory",
      epistemicClass: "scholarly-reconstruction",
      time: { startYear: 100, endYear: 100 },
      geometry: [[0,0],[1,0],[1,1]],
      confidence: "low",
      sources: [source]
    });
    expect(result.ok).toBe(false);
    expect(result.errors.join(" ")).toMatch(/must not be encoded as a sovereign/i);
  });

  test("ethnicity requires an explicit soft-boundary caveat", () => {
    const result = Spatial.validatePolygonRecord({
      id: "ethnic-distribution",
      subjectId: "ethnicity-example",
      subjectKind: "ethnicity",
      geometryMeaning: "attested-distribution",
      epistemicClass: "documented",
      time: { startYear: 1900, endYear: 1900 },
      geometry: [[0,0],[1,0],[1,1]],
      confidence: "medium",
      sources: [source]
    });
    expect(result.ok).toBe(false);
    expect(result.errors).toContain("ethnicity polygons require spatialCaveat explaining that identity/distribution is not a hard border");
  });

  test("reconstructed distributions record their method", () => {
    const result = Spatial.validatePolygonRecord({
      id: "culture-envelope",
      subjectId: "culture-example",
      subjectKind: "culture",
      geometryMeaning: "reconstructed-distribution",
      epistemicClass: "archaeological-reconstruction",
      time: { startYear: -1000, endYear: -800 },
      geometry: [[0,0],[1,0],[1,1]],
      confidence: "medium",
      sources: [source]
    });
    expect(result.ok).toBe(false);
    expect(result.errors).toContain("reconstructed or uncertainty geometry requires reconstructionMethod");
  });

  test("reports subjects that still lack polygon representation", () => {
    const subjects = [
      { id: "a", kind: "state" },
      { id: "b", kind: "culture" }
    ];
    const polygons = [{ subjectId: "a" }];
    expect(Spatial.unresolvedSubjects(subjects, polygons)).toEqual([
      { id: "b", kind: "culture", spatialStatus: "unresolved" }
    ]);
  });
});
