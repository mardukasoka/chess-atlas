"use strict";

/*
 * Atlas canonical history baseline boundary.
 *
 * Baseline records describe evidence-backed historical state. Simulation,
 * gameplay outcomes and alternate-history consequences are intentionally
 * excluded. Candidate imports (including simulator seeds) must be reviewed
 * and promoted before they can be treated as canonical.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.ChessAtlasHistoryBaseline = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const RECORD_TYPES = Object.freeze([
    "event", "polity", "person", "place", "boundary", "conflict", "battle",
    "treaty", "migration", "trade-route", "technology", "demographic-anchor",
    "economic-anchor", "institution", "culture", "religion"
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

  const STATUS = Object.freeze(["candidate", "reviewed", "canonical", "rejected"]);
  const SOURCE_TYPES = Object.freeze([
    "primary-source", "archaeological-publication", "academic-secondary",
    "reference-work", "institutional-dataset", "historical-map", "dataset",
    "candidate-import"
  ]);

  function isFiniteYear(value) {
    return Number.isInteger(value) && value >= -100000 && value <= 10000;
  }

  function hasOwn(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }

  function validateSource(source, index) {
    const errors = [];
    const at = `sources[${index}]`;
    if (!source || typeof source !== "object") return [`${at} must be an object.`];
    if (typeof source.label !== "string" || !source.label.trim()) errors.push(`${at}.label is required.`);
    if (!SOURCE_TYPES.includes(source.type)) errors.push(`${at}.type must be an allowed source type.`);
    if (typeof source.reference !== "string" || !source.reference.trim()) errors.push(`${at}.reference is required.`);
    if (source.url !== undefined && (typeof source.url !== "string" || !/^https?:\/\//.test(source.url))) {
      errors.push(`${at}.url must be an http(s) URL when supplied.`);
    }
    return errors;
  }

  function validateTime(time) {
    const errors = [];
    if (!time || typeof time !== "object") return ["time is required."];
    const exact = hasOwn(time, "year");
    const ranged = hasOwn(time, "startYear") || hasOwn(time, "endYear");
    if (exact && ranged) errors.push("time must use either year or startYear/endYear, not both.");
    if (!exact && !ranged) errors.push("time requires year or startYear/endYear.");
    if (exact && !isFiniteYear(time.year)) errors.push("time.year must be a bounded integer astronomical year.");
    if (ranged) {
      if (!isFiniteYear(time.startYear) || !isFiniteYear(time.endYear)) {
        errors.push("time.startYear and time.endYear must be bounded integer astronomical years.");
      } else if (time.startYear > time.endYear) {
        errors.push("time.startYear must be <= time.endYear.");
      }
    }
    if (time.precision !== undefined && !["day", "month", "year", "decade", "century", "range", "unknown"].includes(time.precision)) {
      errors.push("time.precision is invalid.");
    }
    return errors;
  }

  function validateBaselineRecord(record) {
    const errors = [];
    if (!record || typeof record !== "object" || Array.isArray(record)) {
      return { ok: false, errors: ["record must be an object."] };
    }

    if (typeof record.id !== "string" || !/^[a-z0-9][a-z0-9._:-]*$/.test(record.id)) {
      errors.push("id must be a stable lowercase identifier.");
    }
    if (!RECORD_TYPES.includes(record.type)) errors.push("type is not an allowed baseline record type.");
    if (typeof record.name !== "string" || !record.name.trim()) errors.push("name is required.");
    errors.push(...validateTime(record.time));
    if (!EPISTEMIC_CLASSES.includes(record.epistemicClass)) errors.push("epistemicClass is invalid.");
    if (!STATUS.includes(record.status)) errors.push("status is invalid.");
    if (typeof record.confidence !== "number" || !Number.isFinite(record.confidence) || record.confidence < 0 || record.confidence > 1) {
      errors.push("confidence must be a finite number from 0 to 1.");
    }
    if (typeof record.confidenceRationale !== "string" || !record.confidenceRationale.trim()) {
      errors.push("confidenceRationale is required.");
    }
    if (!Array.isArray(record.sources) || record.sources.length === 0) {
      errors.push("at least one provenance source is required.");
    } else {
      record.sources.forEach((source, index) => errors.push(...validateSource(source, index)));
    }

    if (record.status === "canonical" && record.epistemicClass === "unknown-gap") {
      errors.push("unknown-gap records cannot be canonical assertions.");
    }
    if (record.status === "canonical" && record.sources && record.sources.every(source => source.type === "candidate-import")) {
      errors.push("canonical records require evidence beyond candidate-import provenance.");
    }

    const forbidden = ["simulation", "simulated", "playerAction", "alternateTimeline", "predictedOutcome", "gameState"];
    for (const key of forbidden) {
      if (hasOwn(record, key)) errors.push(`${key} is forbidden in the canonical history baseline.`);
    }

    if (record.geography !== undefined) {
      if (!record.geography || typeof record.geography !== "object") {
        errors.push("geography must be an object when supplied.");
      } else if (record.geography.lat !== undefined || record.geography.lon !== undefined) {
        if (!Number.isFinite(record.geography.lat) || record.geography.lat < -90 || record.geography.lat > 90) errors.push("geography.lat is invalid.");
        if (!Number.isFinite(record.geography.lon) || record.geography.lon < -180 || record.geography.lon > 180) errors.push("geography.lon is invalid.");
      }
    }

    return Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) });
  }

  function canPromoteToCanonical(record) {
    const validation = validateBaselineRecord({ ...record, status: "canonical" });
    return validation.ok;
  }

  function baselineLimits() {
    return Object.freeze({
      recordTypes: RECORD_TYPES,
      epistemicClasses: EPISTEMIC_CLASSES,
      statuses: STATUS,
      sourceTypes: SOURCE_TYPES,
      simulationAllowed: false,
      candidateImportsAreAuthority: false,
      canonicalMutationBySimulation: false
    });
  }

  return Object.freeze({
    RECORD_TYPES,
    EPISTEMIC_CLASSES,
    STATUS,
    SOURCE_TYPES,
    validateBaselineRecord,
    canPromoteToCanonical,
    baselineLimits
  });
});
