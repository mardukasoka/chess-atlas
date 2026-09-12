"use strict";

const OUTCOMES = Object.freeze(["within-tolerance", "continuum-case-required"]);

function confidenceToleranceKm(confidence) {
  const c = typeof confidence === "number" ? confidence : confidence === "high" ? 0.9 : confidence === "medium" ? 0.65 : 0.35;
  if (c >= 0.85) return 35;
  if (c >= 0.6) return 80;
  return 160;
}

function pointInRing(point, ring) {
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersects = ((yi > y) !== (yj > y)) &&
      (x < ((xj - xi) * (y - yi)) / ((yj - yi) || Number.EPSILON) + xi);
    if (intersects) inside = !inside;
  }
  return inside;
}

function pointInsideGeometry(point, record) {
  if (record.geometryType === "Polygon") return pointInRing(point, record.geometry);
  if (record.geometryType === "MultiPolygon") return record.geometry.some(ring => pointInRing(point, ring));
  return false;
}

function haversineKm(a, b) {
  const R = 6371;
  const rad = Math.PI / 180;
  const dLat = (b[1] - a[1]) * rad;
  const dLon = (b[0] - a[0]) * rad;
  const lat1 = a[1] * rad;
  const lat2 = b[1] * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

function nearestVertexDistanceKm(point, record) {
  const rings = record.geometryType === "MultiPolygon" ? record.geometry : [record.geometry];
  return Math.min(...rings.flatMap(ring => ring.map(vertex => haversineKm(point, vertex))));
}

function activeForSubject(records, subjectId, year) {
  return records.filter(record => record.subjectId === subjectId && year >= record.time.startYear && year <= record.time.endYear);
}

function evaluateDivergence(input) {
  const { subjectId, year, proposedPoints, spatialRecords, overrideToleranceKm } = input || {};
  const errors = [];
  if (typeof subjectId !== "string" || !subjectId) errors.push("subjectId is required");
  if (!Number.isInteger(year)) errors.push("year must be an integer astronomical year");
  if (!Array.isArray(proposedPoints) || proposedPoints.length === 0 || proposedPoints.some(p => !Array.isArray(p) || p.length !== 2 || !p.every(Number.isFinite))) errors.push("proposedPoints must contain lon/lat coordinate pairs");
  if (!Array.isArray(spatialRecords)) errors.push("spatialRecords must be an array");
  if (errors.length) return Object.freeze({ ok:false, errors:Object.freeze(errors) });

  const active = activeForSubject(spatialRecords, subjectId, year);
  if (!active.length) {
    return Object.freeze({
      ok:true,
      outcome:"continuum-case-required",
      reason:"no-active-historical-polygon",
      subjectId,
      year,
      outsidePoints:Object.freeze([...proposedPoints]),
      toleranceKm:null,
      writesCanonicalHistory:false,
      automaticCorrection:false,
      requiresReview:true
    });
  }

  const reference = active[0];
  const toleranceKm = Number.isFinite(overrideToleranceKm) ? overrideToleranceKm : confidenceToleranceKm(reference.confidence);
  const outside = proposedPoints.map(point => {
    if (pointInsideGeometry(point, reference)) return null;
    return Object.freeze({ point:Object.freeze([...point]), distanceKm:nearestVertexDistanceKm(point, reference) });
  }).filter(Boolean);
  const material = outside.filter(item => item.distanceKm > toleranceKm);

  return Object.freeze({
    ok:true,
    outcome:material.length ? "continuum-case-required" : "within-tolerance",
    reason:material.length ? "outside-evidential-tolerance" : "inside-or-near-reference-extent",
    subjectId,
    year,
    referenceSpatialId:reference.id,
    toleranceKm,
    outsidePoints:Object.freeze(outside),
    materialOutsidePoints:Object.freeze(material),
    writesCanonicalHistory:false,
    automaticCorrection:false,
    requiresReview:material.length > 0
  });
}

function limits() {
  return Object.freeze({
    outcomes:OUTCOMES,
    canonicalMutationAllowed:false,
    automaticCorrectionAllowed:false,
    continuumCaseIsProposal:true
  });
}

module.exports = Object.freeze({ OUTCOMES, confidenceToleranceKm, pointInsideGeometry, activeForSubject, evaluateDivergence, limits });
