"use strict";

(function (root, factory) {
  const api = factory(
    typeof require === "function" ? require("./history-spatial.js") : root.ChessAtlasHistorySpatial
  );
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.ChessAtlasHistorySpatialCoverage = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (Spatial) {
  function subjectKey(subject) {
    return subject && typeof subject.id === "string" ? subject.id : null;
  }

  function spatialCoverageReport(subjects = [], polygons = [], unresolved = []) {
    const validPolygons = [];
    const invalidPolygons = [];
    for (const polygon of polygons) {
      const validation = Spatial.validatePolygonRecord(polygon);
      if (validation.ok) validPolygons.push(polygon);
      else invalidPolygons.push({ id: polygon && polygon.id || null, errors: validation.errors });
    }

    const representedIds = new Set(validPolygons.map(record => record.subjectId));
    const unresolvedIds = new Set(
      unresolved
        .filter(record => record && record.spatialStatus === "unresolved" && typeof record.id === "string")
        .map(record => record.id)
    );

    const byKind = {};
    for (const kind of Spatial.SUBJECT_KINDS) {
      byKind[kind] = { total: 0, represented: 0, unresolved: 0, missing: 0 };
    }

    const missing = [];
    const duplicateSubjectIds = [];
    const seen = new Set();
    for (const subject of subjects) {
      const id = subjectKey(subject);
      if (!id || !Spatial.SUBJECT_KINDS.includes(subject.kind)) continue;
      if (seen.has(id)) duplicateSubjectIds.push(id);
      seen.add(id);
      const bucket = byKind[subject.kind];
      bucket.total += 1;
      if (representedIds.has(id)) bucket.represented += 1;
      else if (unresolvedIds.has(id)) bucket.unresolved += 1;
      else {
        bucket.missing += 1;
        missing.push({ id, kind: subject.kind });
      }
    }

    const orphanPolygons = validPolygons
      .filter(record => !seen.has(record.subjectId))
      .map(record => ({ id: record.id, subjectId: record.subjectId }));
    const orphanUnresolved = [...unresolvedIds]
      .filter(id => !seen.has(id))
      .map(id => ({ id }));

    const totalSubjects = Object.values(byKind).reduce((sum, bucket) => sum + bucket.total, 0);
    const represented = Object.values(byKind).reduce((sum, bucket) => sum + bucket.represented, 0);
    const explicitlyUnresolved = Object.values(byKind).reduce((sum, bucket) => sum + bucket.unresolved, 0);

    return Object.freeze({
      complete: missing.length === 0 && invalidPolygons.length === 0 && duplicateSubjectIds.length === 0,
      totalSubjects,
      represented,
      explicitlyUnresolved,
      missing: Object.freeze(missing),
      invalidPolygons: Object.freeze(invalidPolygons),
      orphanPolygons: Object.freeze(orphanPolygons),
      orphanUnresolved: Object.freeze(orphanUnresolved),
      duplicateSubjectIds: Object.freeze([...new Set(duplicateSubjectIds)]),
      byKind: Object.freeze(byKind)
    });
  }

  return Object.freeze({ spatialCoverageReport });
});
