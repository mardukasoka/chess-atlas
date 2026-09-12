"use strict";

/* Unified read-only query facade for history baseline + spatial + continuity + disputes. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.ChessAtlasHistoryQuery = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function flattenBatches(batches) {
    return (batches || []).flatMap(batch => Array.isArray(batch) ? batch : (batch && Array.isArray(batch.records) ? batch.records : []));
  }

  function timeRange(record) {
    if (!record || !record.time) return null;
    if (Number.isInteger(record.time.year)) return [record.time.year, record.time.year];
    if (Number.isInteger(record.time.startYear) && Number.isInteger(record.time.endYear)) return [record.time.startYear, record.time.endYear];
    return null;
  }

  function activeAt(records, year) {
    return (records || []).filter(record => {
      const range = timeRange(record);
      return range && year >= range[0] && year <= range[1];
    });
  }

  function uniqueById(records) {
    const out=[];
    const seen=new Set();
    for (const record of records || []) {
      if (!record || !record.id || seen.has(record.id)) continue;
      seen.add(record.id);
      out.push(record);
    }
    return out;
  }

  function createHistoryQuery(input = {}) {
    const baselineRecords = Object.freeze(uniqueById(flattenBatches(input.baselineBatches || [input.baselineRecords || []])));
    const spatialRecords = Object.freeze(uniqueById(flattenBatches(input.spatialBatches || [input.spatialRecords || []])));
    const continuityRelations = Object.freeze(uniqueById(flattenBatches(input.continuityBatches || [input.continuityRelations || []])));
    const claimConflicts = Object.freeze(uniqueById(flattenBatches(input.claimConflictBatches || [input.claimConflicts || []])));

    const baselineById = new Map(baselineRecords.map(record => [record.id, record]));

    function record(id) { return baselineById.get(id) || null; }

    function subject(subjectId) {
      const baseline = record(subjectId);
      const spatial = spatialRecords.filter(item => item.subjectId === subjectId);
      const continuity = continuityRelations.filter(item =>
        (Array.isArray(item.from) && item.from.includes(subjectId)) ||
        (Array.isArray(item.to) && item.to.includes(subjectId))
      );
      const disputes = claimConflicts.filter(conflict =>
        Array.isArray(conflict.claims) && conflict.claims.some(claim => Array.isArray(claim.subjectIds) && claim.subjectIds.includes(subjectId))
      );
      return Object.freeze({ baseline, spatial:Object.freeze(spatial), continuity:Object.freeze(continuity), disputes:Object.freeze(disputes) });
    }

    function atYear(year, options = {}) {
      const result = {
        baseline: activeAt(baselineRecords, year),
        spatial: activeAt(spatialRecords, year),
        disputes: activeAt(claimConflicts, year)
      };
      if (options.region) result.baseline = result.baseline.filter(record => Array.isArray(record.coverageRegions) && record.coverageRegions.includes(options.region));
      if (options.type) result.baseline = result.baseline.filter(record => record.type === options.type);
      if (options.subjectKind) result.spatial = result.spatial.filter(record => record.subjectKind === options.subjectKind);
      return Object.freeze({
        baseline:Object.freeze(result.baseline),
        spatial:Object.freeze(result.spatial),
        disputes:Object.freeze(result.disputes)
      });
    }

    function search(predicate) {
      if (typeof predicate !== "function") throw new TypeError("search requires a predicate function");
      return Object.freeze(baselineRecords.filter(predicate));
    }

    function stats() {
      return Object.freeze({
        baselineRecords:baselineRecords.length,
        spatialRecords:spatialRecords.length,
        continuityRelations:continuityRelations.length,
        claimConflicts:claimConflicts.length
      });
    }

    return Object.freeze({ record, subject, atYear, search, stats, baselineRecords, spatialRecords, continuityRelations, claimConflicts });
  }

  return Object.freeze({ flattenBatches, timeRange, activeAt, uniqueById, createHistoryQuery });
});
