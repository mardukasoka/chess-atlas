"use strict";

(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.ChessAtlasHistoryContinuity = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const RELATION_TYPES = Object.freeze([
    "predecessor-successor",
    "dynastic-transition",
    "split",
    "merge",
    "conquest-transition",
    "territorial-phase",
    "political-fragmentation",
    "political-reunification"
  ]);

  const EPISTEMIC_CLASSES = Object.freeze([
    "documented",
    "archaeological-reconstruction",
    "scholarly-reconstruction",
    "disputed",
    "inferred"
  ]);

  function validateContinuityRelation(relation) {
    const errors = [];
    if (!relation || typeof relation !== "object" || Array.isArray(relation)) {
      return { ok: false, errors: ["relation must be an object"] };
    }
    if (typeof relation.id !== "string" || !/^[a-z0-9][a-z0-9._:-]*$/.test(relation.id)) errors.push("id must be a stable lowercase identifier");
    if (!RELATION_TYPES.includes(relation.type)) errors.push("type is unsupported");
    if (!Array.isArray(relation.from) || relation.from.length === 0 || relation.from.some(id => typeof id !== "string" || !id)) errors.push("from must contain at least one subject id");
    if (!Array.isArray(relation.to) || relation.to.length === 0 || relation.to.some(id => typeof id !== "string" || !id)) errors.push("to must contain at least one subject id");
    if (!Number.isInteger(relation.year) || relation.year < -100000 || relation.year > 10000) errors.push("year must be a bounded astronomical integer year");
    if (!EPISTEMIC_CLASSES.includes(relation.epistemicClass)) errors.push("epistemicClass is unsupported");
    if (typeof relation.confidence !== "number" || !Number.isFinite(relation.confidence) || relation.confidence < 0 || relation.confidence > 1) errors.push("confidence must be 0..1");
    if (typeof relation.rationale !== "string" || !relation.rationale.trim()) errors.push("rationale is required");
    if (!Array.isArray(relation.sources) || relation.sources.length === 0) errors.push("at least one source is required");
    return Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) });
  }

  function danglingRelations(relations, knownSubjectIds) {
    const known = knownSubjectIds instanceof Set ? knownSubjectIds : new Set(knownSubjectIds || []);
    return relations.flatMap(relation => [...relation.from, ...relation.to]
      .filter(id => !known.has(id))
      .map(id => ({ relationId: relation.id, missingSubjectId: id })));
  }

  return Object.freeze({ RELATION_TYPES, EPISTEMIC_CLASSES, validateContinuityRelation, danglingRelations });
});
