"use strict";

(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.ChessAtlasHistoryBranchAdjudication = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const DECISIONS = Object.freeze([
    "alternate-branch-accepted",
    "branch-failed",
    "return-to-baseline"
  ]);

  function validateInput(input) {
    const errors = [];
    if (!input || typeof input !== "object" || Array.isArray(input)) return Object.freeze({ ok:false, errors:Object.freeze(["input must be an object"]) });
    if (!input.contest || input.contest.ok !== true) errors.push("valid contest is required");
    if (!input.caseObject || input.caseObject.ok !== true) errors.push("valid Continuum case is required");
    if (!DECISIONS.includes(input.decision)) errors.push("decision is unsupported");
    if (input.contest && input.caseObject && input.contest.caseId !== input.caseObject.caseId) errors.push("contest and caseObject must refer to the same case");
    if (input.decision === "alternate-branch-accepted" && input.contest && input.contest.status !== "won-pending-review") errors.push("alternate branch may be accepted only after contest victory pending review");
    if (input.decision === "branch-failed" && input.contest && !["lost","active","won-pending-review"].includes(input.contest.status)) errors.push("branch-failed requires a resolvable contest state");
    if (input.decision === "return-to-baseline" && input.caseObject && !["contested","correction-proposed"].includes(input.caseObject.status)) errors.push("return-to-baseline requires a resolved player choice state");
    if (input.applyToCanonical === true || input.mutatesBaseline === true) errors.push("adjudication may not mutate canonical history");
    return Object.freeze({ ok:errors.length===0, errors:Object.freeze(errors) });
  }

  function adjudicate(input) {
    const validation = validateInput(input);
    if (!validation.ok) return Object.freeze({ ok:false, errors:validation.errors });

    const accepted = input.decision === "alternate-branch-accepted";
    const returned = input.decision === "return-to-baseline";
    const failed = input.decision === "branch-failed";

    const alternateTimeline = accepted ? Object.freeze({
      timelineId:`alternate:${input.caseObject.branchId}`,
      parentBaselineSubjectId:input.caseObject.subjectId,
      divergenceYear:input.caseObject.year,
      branchId:input.caseObject.branchId,
      immutable:true,
      canonical:false,
      acceptedForGameplay:true
    }) : null;

    return Object.freeze({
      ok:true,
      adjudicationId:`adjudication:${input.caseObject.caseId}`,
      caseId:input.caseObject.caseId,
      branchId:input.caseObject.branchId,
      decision:input.decision,
      status:accepted ? "alternate-preserved" : returned ? "baseline-restored" : "branch-closed-failed",
      alternateTimeline,
      branchAccepted:accepted,
      branchFailed:failed,
      returnedToBaseline:returned,
      canonicalHistoryChanged:false,
      writesCanonicalHistory:false,
      preservesDecisionHistory:true,
      history:Object.freeze([
        ...(input.caseObject.history || []),
        ...(input.contest.history || []),
        Object.freeze({ event:"final-adjudication", decision:input.decision, note:typeof input.note === "string" ? input.note : "" })
      ])
    });
  }

  function limits() {
    return Object.freeze({
      decisions:DECISIONS,
      canonicalMutationAllowed:false,
      acceptedAlternateBecomesCanonical:false,
      acceptedAlternateStoredSeparately:true,
      immutableTimelineRequired:true,
      failedBranchHistoryPreserved:true,
      baselineReturnDoesNotRewriteHistory:true
    });
  }

  return Object.freeze({ DECISIONS, validateInput, adjudicate, limits });
});
