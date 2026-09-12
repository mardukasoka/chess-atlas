"use strict";

(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.ChessAtlasHistoryContestGameplay = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const OBJECTIVE_DOMAINS = Object.freeze([
    "logistics",
    "manpower",
    "coalition",
    "treasury",
    "administration",
    "succession"
  ]);

  const STATUS = Object.freeze(["active", "won-pending-review", "lost", "withdrawn"]);

  function severityWeight(severity) {
    if (severity === "high") return 3;
    if (severity === "medium") return 2;
    return 1;
  }

  function objective(id, domain, title, threshold, evidenceEffectIds, rationale) {
    return Object.freeze({
      id,
      domain,
      title,
      threshold,
      progress:0,
      completed:false,
      evidenceEffectIds:Object.freeze([...(evidenceEffectIds || [])]),
      rationale
    });
  }

  function effectsFor(caseObject, domain, kinds) {
    return (caseObject.causalEffects || []).filter(effect =>
      effect.domain === domain || (Array.isArray(kinds) && kinds.includes(effect.kind))
    );
  }

  function thresholdFromEffects(effects, base) {
    return Math.max(base, base + effects.reduce((sum, effect) => sum + severityWeight(effect.severity), 0));
  }

  function createContest(caseObject) {
    const errors = [];
    if (!caseObject || caseObject.ok !== true) errors.push("valid Continuum case is required");
    if (caseObject && caseObject.status !== "contested") errors.push("Continuum case must be in contested status");
    if (caseObject && caseObject.selectedChoice !== "CONTEST") errors.push("selected choice must be CONTEST");
    if (errors.length) return Object.freeze({ ok:false, errors:Object.freeze(errors) });

    const logistics = effectsFor(caseObject, "logistics");
    const manpower = effectsFor(caseObject, "manpower");
    const coalition = effectsFor(caseObject, "diplomacy", ["balancing-response"]);
    const treasury = effectsFor(caseObject, "economy");
    const administration = effectsFor(caseObject, "institutions");

    const objectives = Object.freeze([
      objective("contest-logistics", "logistics", "Sustain the extended supply network", thresholdFromEffects(logistics, 4), logistics.map(e=>e.kind), "Expansion must remain provisioned across the contested distance without treating logistics as free."),
      objective("contest-manpower", "manpower", "Staff field forces and garrisons", thresholdFromEffects(manpower, 4), manpower.map(e=>e.kind), "The branch must support both campaigning and occupation without unlimited manpower."),
      objective("contest-coalition", "coalition", "Survive or neutralize balancing opponents", thresholdFromEffects(coalition, 3), coalition.map(e=>e.kind), "Neighboring powers may balance against rapid expansion; the player must defeat, deter, or diplomatically neutralize that response."),
      objective("contest-treasury", "treasury", "Finance conquest and occupation", thresholdFromEffects(treasury, 4), treasury.map(e=>e.kind), "Campaigning and administration require sustainable fiscal capacity rather than assumed free resources."),
      objective("contest-administration", "administration", "Integrate the conquered territory", thresholdFromEffects(administration, 4), administration.map(e=>e.kind), "The branch must establish governance, taxation, delegation, law, and local control sufficient to hold the territory."),
      objective("contest-succession", "succession", "Preserve the branch through succession", 5, [], "A conquest is not historically durable unless the altered polity survives leadership transition and avoids immediate fragmentation.")
    ]);

    return Object.freeze({
      ok:true,
      contestId:`contest:${caseObject.caseId}`,
      caseId:caseObject.caseId,
      branchId:caseObject.branchId,
      subjectId:caseObject.subjectId,
      year:caseObject.year,
      status:"active",
      objectives,
      history:Object.freeze([Object.freeze({ event:"contest-opened", year:caseObject.year })]),
      branchAccepted:false,
      writesCanonicalHistory:false,
      requiresFinalReview:true
    });
  }

  function recordProgress(contest, objectiveId, amount, note) {
    if (!contest || contest.ok !== true || contest.status !== "active") return Object.freeze({ ok:false, errors:Object.freeze(["active contest is required"]) });
    if (!Number.isFinite(amount) || amount <= 0) return Object.freeze({ ok:false, errors:Object.freeze(["progress amount must be positive"]) });
    const target = contest.objectives.find(item => item.id === objectiveId);
    if (!target) return Object.freeze({ ok:false, errors:Object.freeze(["objective not found"]) });

    const objectives = contest.objectives.map(item => {
      if (item.id !== objectiveId) return item;
      const progress = Math.min(item.threshold, item.progress + amount);
      return Object.freeze({ ...item, progress, completed:progress >= item.threshold });
    });
    const allComplete = objectives.every(item => item.completed);
    return Object.freeze({
      ...contest,
      objectives:Object.freeze(objectives),
      status:allComplete ? "won-pending-review" : "active",
      history:Object.freeze([...(contest.history || []), Object.freeze({ event:"progress", objectiveId, amount, note:typeof note === "string" ? note : "" })]),
      branchAccepted:false,
      writesCanonicalHistory:false,
      requiresFinalReview:true
    });
  }

  function concede(contest, note) {
    if (!contest || contest.ok !== true || !["active","won-pending-review"].includes(contest.status)) return Object.freeze({ ok:false, errors:Object.freeze(["resolvable contest is required"]) });
    return Object.freeze({
      ...contest,
      status:"lost",
      history:Object.freeze([...(contest.history || []), Object.freeze({ event:"conceded", note:typeof note === "string" ? note : "" })]),
      branchAccepted:false,
      writesCanonicalHistory:false,
      requiresFinalReview:false
    });
  }

  function limits() {
    return Object.freeze({
      objectiveDomains:OBJECTIVE_DOMAINS,
      statuses:STATUS,
      automaticVictoryAllowed:false,
      automaticBranchAcceptance:false,
      canonicalMutationAllowed:false,
      successRequiresAllObjectives:true,
      finalReviewRequired:true
    });
  }

  return Object.freeze({ OBJECTIVE_DOMAINS, STATUS, createContest, recordProgress, concede, limits });
});
