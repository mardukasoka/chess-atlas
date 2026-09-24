"use strict";

(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.ChessAtlasEquipmentResolver = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function inInterval(date, item) {
    if (date == null) return true;
    if (item.earliestDate != null && date < item.earliestDate) return false;
    if (item.latestDate != null && date > item.latestDate) return false;
    return true;
  }

  function contextMatches(context, item) {
    if (!inInterval(context.date, item)) return false;
    if (item.region && context.region && item.region !== context.region) return false;
    if (item.culture && context.culture && item.culture !== context.culture) return false;
    return true;
  }

  function resolveHistoricalEquipment(context, catalogue) {
    if (!context || !context.gameId) throw new TypeError("gameId is required");
    if (!Array.isArray(catalogue)) throw new TypeError("equipment catalogue must be an array");
    return catalogue.filter(item => contextMatches(context, item)).map(item => Object.freeze({
      id: item.id,
      role: item.role || null,
      weapon: item.weapon || null,
      armour: item.armour || null,
      mobility: item.mobility || null,
      earliestDate: item.earliestDate == null ? null : item.earliestDate,
      latestDate: item.latestDate == null ? null : item.latestDate,
      region: item.region || null,
      culture: item.culture || null,
      evidence: item.evidence || null,
      confidence: item.confidence || null
    }));
  }

  return Object.freeze({ resolveHistoricalEquipment });
});
