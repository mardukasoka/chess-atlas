"use strict";

const Spatial = require("./history-spatial.js");

describe("Atlas historical spatial polygons", () => {
  const source = { label: "Example scholarly map", url: "https://example.org/map" };
  const atlasCoordinateSpace = "atlas-equirectangular-2048x1024";
  const base = {
    geometryType: "Polygon",
    coordinateSpace: atlasCoordinateSpace,
    sources: [source]
  };

  test("accepts a sourced political territory polygon", () => {
    const result = Spatial.validatePolygonRecord({
      ...base, id: "rome-100ce", subjectId: "polity-roman-empire", subjectKind: "empire",
      geometryMeaning: "controlled-territory", epistemicClass: "scholarly-reconstruction",
      time: { startYear: 100, endYear: 100 }, geometry: [[0,0],[1,0],[1,1],[0,1]], confidence: "medium"
    });
    expect(result.ok).toBe(true);
  });

  test("rejects language as a sovereign political border", () => {
    const result = Spatial.validatePolygonRecord({
      ...base, id: "bad-language-border", subjectId: "language-latin", subjectKind: "language-group",
      geometryMeaning: "controlled-territory", epistemicClass: "scholarly-reconstruction",
      time: { startYear: 100, endYear: 100 }, geometry: [[0,0],[1,0],[1,1]], confidence: "low"
    });
    expect(result.ok).toBe(false);
    expect(result.errors.join(" ")).toMatch(/must not be encoded as a sovereign/i);
  });

  test("ethnicity requires an explicit soft-boundary caveat", () => {
    const result = Spatial.validatePolygonRecord({
      ...base, id: "ethnic-distribution", subjectId: "ethnicity-example", subjectKind: "ethnicity",
      geometryMeaning: "attested-distribution", epistemicClass: "documented",
      time: { startYear: 1900, endYear: 1900 }, geometry: [[0,0],[1,0],[1,1]], confidence: "medium"
    });
    expect(result.ok).toBe(false);
    expect(result.errors).toContain("ethnicity polygons require spatialCaveat explaining that identity/distribution is not a hard border");
  });

  test("reconstructed distributions record their method", () => {
    const result = Spatial.validatePolygonRecord({
      ...base, id: "culture-envelope", subjectId: "culture-example", subjectKind: "culture",
      geometryMeaning: "reconstructed-distribution", epistemicClass: "archaeological-reconstruction",
      time: { startYear: -1000, endYear: -800 }, geometry: [[0,0],[1,0],[1,1]], confidence: "medium"
    });
    expect(result.ok).toBe(false);
    expect(result.errors).toContain("reconstructed or uncertainty geometry requires reconstructionMethod");
  });

  test("rejects ambiguous geometry with no declared coordinate space", () => {
    const result = Spatial.validatePolygonRecord({
      id: "ambiguous", subjectId: "polity-a", subjectKind: "polity", geometryType: "Polygon",
      geometryMeaning: "core-area", epistemicClass: "documented", time: { startYear: 1, endYear: 2 },
      geometry: [[10,10],[20,10],[20,20]], confidence: "medium", sources: [source]
    });
    expect(result.ok).toBe(false);
    expect(result.errors).toContain("coordinateSpace is unsupported or missing");
  });

  test("projects WGS84 geometry into the existing Atlas map space", () => {
    expect(Spatial.projectLonLatToAtlas([0, 0])).toEqual([1024, 512]);
    expect(Spatial.toAtlasGeometry({ geometryType: "Polygon", coordinateSpace: "wgs84-lonlat", geometry: [[0, 0], [180, 90], [-180, -90]] })).toEqual([
      [1024, 512], [2048, 0], [0, 1024]
    ]);
  });

  test("supports discontiguous multipart distributions without joining empty space", () => {
    const record = {
      ...base, id: "lapita-parts", subjectId: "culture-lapita", subjectKind: "culture",
      geometryType: "MultiPolygon", geometryMeaning: "reconstructed-distribution",
      epistemicClass: "archaeological-reconstruction", time: { startYear: -1600, endYear: -500 },
      geometry: [ [[100,100],[110,100],[110,110]], [[500,300],[510,300],[510,310]] ],
      confidence: "medium", reconstructionMethod: "separate evidence envelopes"
    };
    expect(Spatial.validatePolygonRecord(record).ok).toBe(true);
    expect(Spatial.toRendererFeatures(record)).toHaveLength(2);
  });

  test("reports subjects that still lack polygon representation", () => {
    const subjects = [{ id: "a", kind: "state" }, { id: "b", kind: "culture" }];
    const polygons = [{ subjectId: "a" }];
    expect(Spatial.unresolvedSubjects(subjects, polygons)).toEqual([{ id: "b", kind: "culture", spatialStatus: "unresolved" }]);
  });
});
