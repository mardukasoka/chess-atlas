"use strict";

const Spatial = require("./history-spatial.js");
const Coverage = require("./history-spatial-coverage.js");
const Bronze = require("./history-baseline-bronze.js");
const BronzeSpatial = require("./history-spatial-bronze.js");

describe("Atlas Bronze Age spatial baseline", () => {
  test("every Bronze spatial record satisfies the spatial validator", () => {
    for (const record of BronzeSpatial.records) {
      expect(Spatial.validatePolygonRecord(record)).toEqual({ ok: true, errors: [] });
    }
  });

  test("every Bronze culture or polity anchor has representative geometry", () => {
    const subjects = Bronze.records
      .filter(record => ["culture", "polity"].includes(record.type))
      .map(record => ({
        id: record.id,
        kind: record.type === "culture" ? "culture" : (
          record.id === "polity-egypt-new-kingdom" ? "empire" : record.id === "polity-shang-dynasty" ? "state" : "polity"
        )
      }));
    const report = Coverage.spatialCoverageReport(subjects, BronzeSpatial.records);
    expect(report.complete).toBe(true);
    expect(report.missing).toEqual([]);
    expect(report.represented).toBe(subjects.length);
  });

  test("place anchors remain site/place geometry rather than being promoted to culture polygons", () => {
    const placeIds = Bronze.records.filter(record => record.type === "place").map(record => record.id);
    for (const id of placeIds) expect(BronzeSpatial.get(id)).toBeNull();
  });

  test("Lapita uses separated multipart geometry across the dateline", () => {
    const lapita = BronzeSpatial.get("culture-lapita");
    expect(lapita.geometryType).toBe("MultiPolygon");
    expect(lapita.geometry.length).toBeGreaterThan(3);
    for (const ring of lapita.geometry) {
      const longitudes = ring.map(point => point[0]);
      expect(Math.max(...longitudes) - Math.min(...longitudes)).toBeLessThan(20);
    }
  });

  test("renderer adapter emits independently selectable polygon parts", () => {
    const features = BronzeSpatial.rendererFeaturesAt(-1500);
    expect(features.length).toBeGreaterThan(BronzeSpatial.activeAt(-1500).length);
    expect(features.every(feature => Array.isArray(feature.geometry))).toBe(true);
  });
});
