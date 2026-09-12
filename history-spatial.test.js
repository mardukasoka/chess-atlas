"use strict";

const Spatial = require("./history-spatial.js");

describe("Atlas historical spatial polygons", () => {
  const source = { label: "Example scholarly map", url: "https://example.org/map" };
  const atlasCoordinateSpace = "atlas-equirectangular-2048x1024";

  test("accepts a sourced political territory polygon", () => {
    const result = Spatial.validatePolygonRecord({
      id: "rome-100ce",
      subjectId: "polity-roman-empire",
      subjectKind: "empire",
      geometryMeaning: "controlled-territory",
      coordinateSpace: atlasCoordinateSpace,
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
      coordinateSpace: atlasCoordinateSpace,
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
      coordinateSpace: atlasCoordinateSpace,
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
      coordinateSpace: atlasCoordinateSpace,
      epistemicClass: "archaeological-reconstruction",
      time: { startYear: -1000, endYear: -800 },
      geometry: [[0,0],[1,0],[1,1]],
      confidence: "medium",
      sources: [source]
    });
    expect(result.ok).toBe(false);
    expect(result.errors).toContain("reconstructed or uncertainty geometry requires reconstructionMethod");
  });

  test("rejects ambiguous geometry with no declared coordinate space", () => {
    const result = Spatial.validatePolygonRecord({
      id: "ambiguous",
      subjectId: "polity-a",
      subjectKind: "polity",
      geometryMeaning: "core-area",
      epistemicClass: "documented",
      time: { startYear: 1, endYear: 2 },
      geometry: [[10,10],[20,10],[20,20]],
      confidence: "medium",
      sources: [source]
    });
    expect(result.ok).toBe(false);
    expect(result.errors).toContain("coordinateSpace is unsupported or missing");
  });

  test("projects WGS84 geometry into the existing Atlas map space", () => {
    expect(Spatial.projectLonLatToAtlas([0, 0])).toEqual([1024, 512]);
    expect(Spatial.toAtlasGeometry({ coordinateSpace: "wgs84-lonlat", geometry: [[0, 0], [180, 90], [-180, -90]] })).toEqual([
      [1024, 512], [2048, 0], [0, 1024]
    ]);
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
