"use strict";

(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.ChessAtlasHistorySpatial = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const SUBJECT_KINDS = Object.freeze(["empire", "state", "polity", "language-group", "culture", "ethnicity"]);
  const GEOMETRY_MEANINGS = Object.freeze([
    "administrative-territory", "controlled-territory", "claimed-territory", "core-area",
    "attested-distribution", "reconstructed-distribution", "uncertainty-envelope"
  ]);
  const GEOMETRY_TYPES = Object.freeze(["Polygon", "MultiPolygon"]);
  const COORDINATE_SPACES = Object.freeze(["atlas-equirectangular-2048x1024", "wgs84-lonlat"]);
  const EPISTEMIC_CLASSES = Object.freeze([
    "documented", "archaeological", "archaeological-reconstruction", "scholarly-reconstruction",
    "disputed", "inferred", "unknown-gap"
  ]);

  function isFinitePoint(point) {
    return Array.isArray(point) && point.length === 2 && point.every(Number.isFinite);
  }

  function validPointForCoordinateSpace(point, coordinateSpace) {
    if (!isFinitePoint(point)) return false;
    if (coordinateSpace === "wgs84-lonlat") return point[0] >= -180 && point[0] <= 180 && point[1] >= -90 && point[1] <= 90;
    if (coordinateSpace === "atlas-equirectangular-2048x1024") return point[0] >= 0 && point[0] <= 2048 && point[1] >= 0 && point[1] <= 1024;
    return false;
  }

  function validRing(ring, coordinateSpace) {
    return Array.isArray(ring) && ring.length >= 3 && ring.every(point => validPointForCoordinateSpace(point, coordinateSpace));
  }

  function validGeometry(record) {
    if (record.geometryType === "Polygon") return validRing(record.geometry, record.coordinateSpace);
    if (record.geometryType === "MultiPolygon") {
      return Array.isArray(record.geometry) && record.geometry.length > 0 && record.geometry.every(ring => validRing(ring, record.coordinateSpace));
    }
    return false;
  }

  function validatePolygonRecord(record) {
    const errors = [];
    if (!record || typeof record !== "object") return { ok: false, errors: ["record must be an object"] };
    if (!record.id || typeof record.id !== "string") errors.push("id is required");
    if (!record.subjectId || typeof record.subjectId !== "string") errors.push("subjectId is required");
    if (!SUBJECT_KINDS.includes(record.subjectKind)) errors.push("subjectKind is unsupported");
    if (!GEOMETRY_MEANINGS.includes(record.geometryMeaning)) errors.push("geometryMeaning is unsupported");
    if (!GEOMETRY_TYPES.includes(record.geometryType)) errors.push("geometryType must be Polygon or MultiPolygon");
    if (!COORDINATE_SPACES.includes(record.coordinateSpace)) errors.push("coordinateSpace is unsupported or missing");
    if (!EPISTEMIC_CLASSES.includes(record.epistemicClass)) errors.push("epistemicClass is unsupported");
    if (!record.time || !Number.isInteger(record.time.startYear) || !Number.isInteger(record.time.endYear) || record.time.startYear > record.time.endYear) {
      errors.push("time must contain startYear <= endYear");
    }
    if (!validGeometry(record)) errors.push("geometry must match geometryType and contain valid points in the declared coordinateSpace");
    if (!Array.isArray(record.sources) || record.sources.length === 0) errors.push("at least one source is required");
    if (!["low", "medium", "high"].includes(record.confidence)) errors.push("confidence must be low, medium, or high");

    if (["language-group", "culture", "ethnicity"].includes(record.subjectKind) &&
        ["administrative-territory", "controlled-territory", "claimed-territory"].includes(record.geometryMeaning)) {
      errors.push(`${record.subjectKind} must not be encoded as a sovereign/administrative territory`);
    }
    if (record.subjectKind === "ethnicity" && !record.spatialCaveat) {
      errors.push("ethnicity polygons require spatialCaveat explaining that identity/distribution is not a hard border");
    }
    if (["reconstructed-distribution", "uncertainty-envelope"].includes(record.geometryMeaning) && !record.reconstructionMethod) {
      errors.push("reconstructed or uncertainty geometry requires reconstructionMethod");
    }
    return Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) });
  }

  function activeAt(records, year) {
    return records.filter(record => record.time && year >= record.time.startYear && year <= record.time.endYear);
  }
  function forSubject(records, subjectId) { return records.filter(record => record.subjectId === subjectId); }
  function unresolvedSubjects(subjects, polygonRecords) {
    const represented = new Set(polygonRecords.map(record => record.subjectId));
    return subjects.filter(subject => !represented.has(subject.id)).map(subject => ({ id: subject.id, kind: subject.kind, spatialStatus: "unresolved" }));
  }

  function projectLonLatToAtlas(point) {
    if (!validPointForCoordinateSpace(point, "wgs84-lonlat")) throw new RangeError("Invalid WGS84 longitude/latitude point");
    return [((point[0] + 180) / 360) * 2048, ((90 - point[1]) / 180) * 1024];
  }

  function projectRing(ring, coordinateSpace) {
    if (coordinateSpace === "atlas-equirectangular-2048x1024") return ring.map(point => [...point]);
    if (coordinateSpace === "wgs84-lonlat") return ring.map(projectLonLatToAtlas);
    throw new RangeError("Unsupported coordinateSpace");
  }

  function toAtlasGeometry(record) {
    if (!record || !Array.isArray(record.geometry)) return [];
    if (record.geometryType === "Polygon") return projectRing(record.geometry, record.coordinateSpace);
    if (record.geometryType === "MultiPolygon") return record.geometry.map(ring => projectRing(ring, record.coordinateSpace));
    throw new RangeError("Unsupported geometryType");
  }

  function toRendererFeatures(record) {
    const geometry = toAtlasGeometry(record);
    const parts = record.geometryType === "MultiPolygon" ? geometry : [geometry];
    return parts.map((part, index) => ({
      id: parts.length === 1 ? record.id : `${record.id}:part-${index + 1}`,
      parentSpatialId: record.id,
      subjectId: record.subjectId,
      name: record.name || record.subjectId,
      geometry: part,
      mapMeaning: record.spatialCaveat || `${record.geometryMeaning}; ${record.epistemicClass}; confidence ${record.confidence}.`
    }));
  }

  return Object.freeze({
    SUBJECT_KINDS, GEOMETRY_MEANINGS, GEOMETRY_TYPES, COORDINATE_SPACES, EPISTEMIC_CLASSES,
    validatePolygonRecord, activeAt, forSubject, unresolvedSubjects,
    projectLonLatToAtlas, toAtlasGeometry, toRendererFeatures
  });
});
