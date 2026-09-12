"use strict";

(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.ChessAtlasHistoryPropagation = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const DOMAINS = Object.freeze([
    "logistics",
    "diplomacy",
    "manpower",
    "trade",
    "economy",
    "institutions",
    "demography"
  ]);

  function validateInput(input) {
    const errors = [];
    if (!input || typeof input !== "object" || Array.isArray(input)) return { ok:false, errors:["input must be an object"] };
    if (typeof input.branchId !== "string" || !input.branchId) errors.push("branchId is required");
    if (typeof input.actorId !== "string" || !input.actorId) errors.push("actorId is required");
    if (!Number.isInteger(input.year)) errors.push("year must be an integer astronomical year");
    if (!input.action || typeof input.action !== "object") errors.push("action is required");
    if (input.action && typeof input.action.type !== "string") errors.push("action.type is required");
    if (input.action && typeof input.action.targetId !== "string") errors.push("action.targetId is required");
    if (input.applyToCanonical === true || input.mutatesBaseline === true) errors.push("propagation may not mutate canonical history");
    return Object.freeze({ ok: errors.length===0, errors:Object.freeze(errors) });
  }

  function normalizeSeverity(value) {
    if (value === "low" || value === "medium" || value === "high") return value;
    return "medium";
  }

  function makeEffect(domain, kind, severity, rationale, evidenceIds) {
    if (!DOMAINS.includes(domain)) throw new RangeError(`unsupported domain: ${domain}`);
    return Object.freeze({
      domain,
      kind,
      severity: normalizeSeverity(severity),
      rationale,
      evidenceIds: Object.freeze([...(evidenceIds || [])]),
      canonicalMutation: false
    });
  }

  function propagate(input, context) {
    const validation = validateInput(input);
    if (!validation.ok) return Object.freeze({ ok:false, errors:validation.errors });

    const ctx = context || {};
    const effects = [];
    const action = input.action;
    const distance = Number.isFinite(action.distanceFromCoreKm) ? action.distanceFromCoreKm : 0;
    const contested = action.documentedConflict === false;
    const hostileNeighbors = Number.isInteger(action.hostileNeighborCount) ? action.hostileNeighborCount : 0;
    const tradeDependency = Number.isFinite(action.tradeDependency) ? Math.max(0, Math.min(1, action.tradeDependency)) : 0;
    const localPopulation = Number.isFinite(action.localPopulation) ? Math.max(0, action.localPopulation) : null;

    if (["capture","occupy","annex"].includes(action.type)) {
      if (distance > 150) effects.push(makeEffect("logistics", "supply-line-extension", distance > 500 ? "high" : "medium", "Territorial expansion increases transport, provisioning and garrison burden as distance from the political/military core grows.", ctx.logisticsEvidenceIds));
      effects.push(makeEffect("manpower", "garrison-demand", action.garrisonRequired === false ? "low" : "medium", "Occupation normally requires troops or administrative coercive capacity that cannot simultaneously serve elsewhere.", ctx.manpowerEvidenceIds));
      if (hostileNeighbors > 0) effects.push(makeEffect("diplomacy", "balancing-response", hostileNeighbors >= 3 ? "high" : "medium", "Expansion can alter neighboring threat perceptions and increase incentives for balancing coalitions or opportunistic intervention.", ctx.diplomacyEvidenceIds));
      if (tradeDependency > 0.25) effects.push(makeEffect("trade", "route-disruption-risk", tradeDependency > 0.6 ? "high" : "medium", "Conflict or occupation around a trade-dependent target raises route, market-access and merchant-security risk.", ctx.tradeEvidenceIds));
      effects.push(makeEffect("economy", "occupation-cost", "medium", "Campaign, garrison and administrative costs create fiscal pressure before any durable revenue gain is established.", ctx.economyEvidenceIds));
      effects.push(makeEffect("institutions", "administrative-integration-pressure", distance > 300 ? "high" : "medium", "New territory creates pressure to extend taxation, law, delegation and local governance arrangements.", ctx.institutionEvidenceIds));
      if (localPopulation !== null) effects.push(makeEffect("demography", "displacement-and-mortality-risk", action.highIntensityConflict === true ? "high" : "medium", "Armed conquest and subsequent coercion may alter mortality, displacement and settlement patterns; magnitude must remain scenario-specific rather than assumed exact.", ctx.demographyEvidenceIds));
    }

    if (contested) {
      effects.push(makeEffect("diplomacy", "historical-divergence-signal", "high", "The action creates a large contradiction with the current evidence-backed baseline because no corresponding conflict is documented for the target/date.", ctx.divergenceEvidenceIds));
    }

    return Object.freeze({
      ok: true,
      mode: "proposal-only",
      branchId: input.branchId,
      actorId: input.actorId,
      year: input.year,
      action: Object.freeze({ ...action }),
      effects: Object.freeze(effects),
      writesCanonicalHistory: false,
      requiresReview: true
    });
  }

  function limits() {
    return Object.freeze({
      domains: DOMAINS,
      proposalOnly: true,
      canonicalMutationAllowed: false,
      automaticBranchAcceptance: false,
      automaticTimelineCorrection: false
    });
  }

  return Object.freeze({ DOMAINS, validateInput, propagate, limits });
});
