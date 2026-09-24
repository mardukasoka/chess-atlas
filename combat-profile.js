"use strict";

(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.ChessAtlasCombatProfile = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const NAMESPACES = Object.freeze({
    REAL: "real",
    RECONSTRUCTED: "reconstructed",
    COUNTERFACTUAL: "counterfactual",
    SYNTHETIC: "synthetic"
  });

  const SOURCE_KINDS = Object.freeze([
    "piece", "individual", "squad", "formation", "army-element", "synthetic-entity"
  ]);

  function createProfile(input) {
    if (!input || !input.id) throw new TypeError("Combat profile id is required");
    if (!SOURCE_KINDS.includes(input.sourceKind)) throw new TypeError("Unsupported combat source kind");
    if (!Object.values(NAMESPACES).includes(input.namespace)) throw new TypeError("Valid epistemic namespace is required");
    return Object.freeze({
      version: 1,
      id: input.id,
      sourceKind: input.sourceKind,
      namespace: input.namespace,
      referent: input.referent || null,
      representation: input.representation || null,
      interpretation: input.interpretation || null,
      context: Object.freeze({
        gameId: input.context && input.context.gameId || null,
        date: input.context && input.context.date || null,
        region: input.context && input.context.region || null,
        culture: input.context && input.context.culture || null,
        universe: input.context && input.context.universe || null
      }),
      equipment: Object.freeze([...(input.equipment || [])]),
      abilities: Object.freeze([...(input.abilities || [])]),
      locomotion: input.locomotion || null,
      provenance: Object.freeze([...(input.provenance || [])]),
      confidence: input.confidence || null
    });
  }

  function isCanonical(profile) {
    return profile && (profile.namespace === NAMESPACES.REAL || profile.namespace === NAMESPACES.RECONSTRUCTED);
  }

  function canWriteHistoricalAtlas(profile) {
    return isCanonical(profile);
  }

  return Object.freeze({ NAMESPACES, SOURCE_KINDS, createProfile, isCanonical, canWriteHistoricalAtlas });
});
