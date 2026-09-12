"use strict";

(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.ChessAtlasHistorySpatial = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const SUBJECT_KINDS = Object.freeze([
    "empire",
    "state",
    "polity",
    "language-group",
    "culture",
    "ethnicity"
  ]);

  const GEOMETRY_MEANINGS = Object.freeze([
    "administrative-territory",
    "controlled-territory",
    "claimed-territory",
    "core-area",
    "attested-distribution",
    "reconstructed-distribution",
    "uncertainty-envelope"
  ]);

  const EPISTEMIC_CLASSES = Object.freeze([
    "documented",
    "archaeological",
    "archaeological-reconstruction",
    "scholarly-reconstruction",
    "disputed",
    "inferred",
    "unknown-gap"
  ]);

  function isFinitePoint(point) {
    return Array.isArray(point) && point.length === 2 && point.every(Number.isFinite);
  }

  function validatePolygonRecord(record) {
    const errors = [];
    if (!record || typeof record !== "object") return { ok: false, errors: ["record must be an object"] };
    if (!record.id || typeof record.id !== "string") errors.push("id is required");
    if (!record.subjectId || typeof record.subjectId !== "string") errors.push("subjectId is required");
    if (!SUBJECT_KINDS.includes(record.subjectKind)) errors.push("subjectKind is unsupported");
    if (!GEOMETRY_MEANINGS.includes(record.geometryMeaning)) errors.push("geometryMeaning is unsupported");
    if (!EPISTEMIC_CLASSES.includes(record.epistemicClass)) errors.push("epistemicClass is unsupported");
    if (!record.time || !Number.isInteger(record.time.startYear) || !Number.isInteger(record.time.endYear) || record.time.startYear > record.time.endYear) {
      errors.push("time must contain startYear <= endYear");
    }
    if (!Array.isArray(record.geometry) || record.geometry.length < 3 || !record.geometry.every(isFinitePoint)) {
      errors.push("geometry must contain at least three finite [x,y] points");
    }
    if (!Array.isArray(record.sources) || record.sources.length === 0) errors.push("at least one source is required");
    if (!record.confidence || !["low", "medium", "high"].includes(record.confidence)) errors.push("confidence must be low, medium, or high");

    if (["language-group", "culture", "ethnicity"].includes(record.subjectKind)) {
      if (["administrative-territory", "controlled-territory", "claimed-territory"].includes(record.geometryMeaning)) {
        errors.push(`${record.subjectKind} must not be encoded as a sovereign/administrative territory`);
      }
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

  function forSubject(records, subjectId) {
    return records.filter(record => record.subjectId === subjectId);
  }

  function unresolvedSubjects(subjects, polygonRecords) {
    const represented = new Set(polygonRecords.map(record => record.subjectId));
    return subjects
      .filter(subject => !represented.has(subject.id))
      .map(subject => ({ id: subject.id, kind: subject.kind, spatialStatus: "unresolved" }));
  }

  return Object.freeze({
    SUBJECT_KINDS,
    GEOMETRY_MEANINGS,
    EPISTEMIC_CLASSES,
    validatePolygonRecord,
    activeAt,
    forSubject,
    unresolvedSubjects
  });
});
