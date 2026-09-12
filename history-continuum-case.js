"use strict";

(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.ChessAtlasContinuumCase = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const CHOICES = Object.freeze(["CORRECT", "CONTEST"]);
  const STATUSES = Object.freeze(["open", "correction-proposed", "contested"]);

  function validateCaseInput(input) {
    const errors = [];
    if (!input || typeof input !== "object" || Array.isArray(input)) return Object.freeze({ ok:false, errors:Object.freeze(["input must be an object"]) });
    if (typeof input.caseId !== "string" || !/^[a-z0-9][a-z0-9._:-]*$/.test(input.caseId)) errors.push("caseId must be a stable lowercase identifier");
    if (typeof input.branchId !== "string" || !input.branchId) errors.push("branchId is required");
    if (typeof input.subjectId !== "string" || !input.subjectId) errors.push("subjectId is required");
    if (!Number.isInteger(input.year)) errors.push("year must be an integer astronomical year");
    if (!input.divergence || input.divergence.outcome !== "continuum-case-required") errors.push("divergence must require a Continuum case");
    if (!input.propagation || input.propagation.ok !== true || input.propagation.mode !== "proposal-only") errors.push("proposal-only causal propagation is required");
    if (input.applyToCanonical === true || input.mutatesBaseline === true) errors.push("Continuum cases may not mutate canonical history");
    return Object.freeze({ ok:errors.length===0, errors:Object.freeze(errors) });
  }

  function createCase(input) {
    const validation = validateCaseInput(input);
    if (!validation.ok) return Object.freeze({ ok:false, errors:validation.errors });
    return Object.freeze({
      ok:true,
      caseId:input.caseId,
      branchId:input.branchId,
      subjectId:input.subjectId,
      year:input.year,
      status:"open",
      choices:CHOICES,
      divergence:Object.freeze({ ...input.divergence }),
      causalEffects:Object.freeze([...(input.propagation.effects || [])]),
      history:Object.freeze([Object.freeze({ event:"opened", year:input.year })]),
      writesCanonicalHistory:false,
      automaticEnforcement:false,
      requiresPlayerChoice:true
    });
  }

  function choose(caseObject, choice, note) {
    if (!caseObject || caseObject.ok !== true || !STATUSES.includes(caseObject.status)) return Object.freeze({ ok:false, errors:Object.freeze(["valid Continuum case is required"]) });
    if (!CHOICES.includes(choice)) return Object.freeze({ ok:false, errors:Object.freeze(["choice must be CORRECT or CONTEST"]) });
    const status = choice === "CORRECT" ? "correction-proposed" : "contested";
    const nextEvent = Object.freeze({ event:choice.toLowerCase(), year:caseObject.year, note:typeof note === "string" ? note : "" });
    return Object.freeze({
      ...caseObject,
      status,
      selectedChoice:choice,
      history:Object.freeze([...(caseObject.history || []), nextEvent]),
      writesCanonicalHistory:false,
      automaticEnforcement:false,
      requiresPlayerChoice:false,
      requiresReview:true,
      correctionApplied:false,
      branchAccepted:false
    });
  }

  function limits() {
    return Object.freeze({
      choices:CHOICES,
      canonicalMutationAllowed:false,
      automaticCorrectionAllowed:false,
      automaticContestResolutionAllowed:false,
      branchHistoryPreserved:true
    });
  }

  return Object.freeze({ CHOICES, STATUSES, validateCaseInput, createCase, choose, limits });
});
