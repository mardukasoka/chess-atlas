"use strict";

/*
 * Dispute / claim-conflict layer for the Atlas history baseline.
 *
 * A conflict records incompatible or overlapping historical/spatial claims
 * without selecting a winner or mutating any referenced baseline record.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.ChessAtlasHistoryClaimConflicts = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const CLAIM_TYPES = Object.freeze([
    "sovereignty",
    "territorial-control",
    "boundary-location",
    "chronology",
    "succession",
    "attribution",
    "identity-distribution",
    "interpretation"
  ]);

  const EPISTEMIC_CLASSES = Object.freeze([
    "documented",
    "archaeological-reconstruction",
    "scholarly-reconstruction",
    "disputed",
    "inferred"
  ]);

  const RESOLUTION_STATES = Object.freeze([
    "open",
    "partially-resolved",
    "resolved-by-evidence",
    "irreducibly-disputed"
  ]);

  function isStableId(value) {
    return typeof value === "string" && /^[a-z0-9][a-z0-9._:-]*$/.test(value);
  }

  function validYearRange(time) {
    return time && Number.isInteger(time.startYear) && Number.isInteger(time.endYear) && time.startYear <= time.endYear;
  }

  function validateSource(source, index) {
    const errors = [];
    if (!source || typeof source !== "object") return [`sources[${index}] must be an object`];
    if (typeof source.label !== "string" || !source.label.trim()) errors.push(`sources[${index}].label is required`);
    if (typeof source.reference !== "string" || !source.reference.trim()) errors.push(`sources[${index}].reference is required`);
    if (source.url !== undefined && (typeof source.url !== "string" || !/^https?:\/\//.test(source.url))) errors.push(`sources[${index}].url must be http(s)`);
    return errors;
  }

  function validateClaim(claim, index) {
    const errors = [];
    const at = `claims[${index}]`;
    if (!claim || typeof claim !== "object") return [`${at} must be an object`];
    if (!isStableId(claim.id)) errors.push(`${at}.id must be a stable lowercase identifier`);
    if (!Array.isArray(claim.subjectIds) || claim.subjectIds.length === 0 || claim.subjectIds.some(id => typeof id !== "string" || !id)) errors.push(`${at}.subjectIds must contain at least one subject id`);
    if (typeof claim.assertion !== "string" || !claim.assertion.trim()) errors.push(`${at}.assertion is required`);
    if (!EPISTEMIC_CLASSES.includes(claim.epistemicClass)) errors.push(`${at}.epistemicClass is unsupported`);
    if (typeof claim.confidence !== "number" || !Number.isFinite(claim.confidence) || claim.confidence < 0 || claim.confidence > 1) errors.push(`${at}.confidence must be 0..1`);
    if (!Array.isArray(claim.sources) || claim.sources.length === 0) errors.push(`${at}.sources requires at least one source`);
    else claim.sources.forEach((source, sourceIndex) => errors.push(...validateSource(source, sourceIndex).map(error => `${at}.${error}`)));
    return errors;
  }

  function validateConflict(record) {
    const errors = [];
    if (!record || typeof record !== "object" || Array.isArray(record)) return { ok:false, errors:["record must be an object"] };
    if (!isStableId(record.id)) errors.push("id must be a stable lowercase identifier");
    if (!CLAIM_TYPES.includes(record.claimType)) errors.push("claimType is unsupported");
    if (!validYearRange(record.time)) errors.push("time must contain startYear <= endYear");
    if (!Array.isArray(record.claims) || record.claims.length < 2) errors.push("at least two competing claims are required");
    else record.claims.forEach((claim, index) => errors.push(...validateClaim(claim, index)));
    if (!RESOLUTION_STATES.includes(record.resolutionState)) errors.push("resolutionState is unsupported");
    if (typeof record.summary !== "string" || !record.summary.trim()) errors.push("summary is required");
    if (record.preferredClaimId !== undefined) {
      const ids = new Set((record.claims || []).map(claim => claim.id));
      if (!ids.has(record.preferredClaimId)) errors.push("preferredClaimId must reference one of the claims");
      if (record.resolutionState === "open" || record.resolutionState === "irreducibly-disputed") errors.push("open or irreducibly-disputed conflicts must not select a preferred claim");
    }
    const forbidden = ["simulation", "playerAction", "alternateTimeline", "gameState"];
    for (const key of forbidden) if (Object.prototype.hasOwnProperty.call(record, key)) errors.push(`${key} is forbidden in claim conflicts`);
    return Object.freeze({ ok:errors.length===0, errors:Object.freeze(errors) });
  }

  function activeAt(records, year) {
    return records.filter(record => record.time && year >= record.time.startYear && year <= record.time.endYear);
  }

  function forSubject(records, subjectId) {
    return records.filter(record => record.claims && record.claims.some(claim => claim.subjectIds.includes(subjectId)));
  }

  function limits() {
    return Object.freeze({
      mutatesBaseline:false,
      autoResolution:false,
      competingClaimsPreserved:true,
      claimTypes:CLAIM_TYPES,
      resolutionStates:RESOLUTION_STATES
    });
  }

  return Object.freeze({ CLAIM_TYPES, EPISTEMIC_CLASSES, RESOLUTION_STATES, validateConflict, activeAt, forSubject, limits });
});
