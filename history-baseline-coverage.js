"use strict";

(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.ChessAtlasHistoryCoverage = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const REGIONS = Object.freeze([
    "europe",
    "middle-east-north-africa",
    "sub-saharan-africa",
    "central-asia-steppe",
    "south-asia",
    "east-asia",
    "southeast-asia",
    "north-america",
    "central-america-caribbean",
    "south-america",
    "oceania-pacific"
  ]);

  const ERAS = Object.freeze([
    Object.freeze({ id: "deep-prehistory-neolithic", startYear: -15000, endYear: -3501 }),
    Object.freeze({ id: "early-states-bronze-age", startYear: -3500, endYear: -1201 }),
    Object.freeze({ id: "iron-age-axial", startYear: -1200, endYear: -324 }),
    Object.freeze({ id: "hellenistic-roman-han", startYear: -323, endYear: 299 }),
    Object.freeze({ id: "late-antiquity-early-medieval", startYear: 300, endYear: 799 }),
    Object.freeze({ id: "medieval-connected-world", startYear: 800, endYear: 1499 }),
    Object.freeze({ id: "early-modern-world", startYear: 1500, endYear: 1799 }),
    Object.freeze({ id: "industrial-imperial-world", startYear: 1800, endYear: 1913 }),
    Object.freeze({ id: "world-wars-decolonization", startYear: 1914, endYear: 1990 }),
    Object.freeze({ id: "contemporary", startYear: 1991, endYear: 10000 })
  ]);

  const CORE_TYPES = Object.freeze([
    "event", "polity", "person", "place", "boundary", "conflict", "battle",
    "treaty", "migration", "trade-route", "technology", "demographic-anchor",
    "economic-anchor", "institution", "culture", "religion"
  ]);

  function timeRange(record) {
    if (!record || !record.time) return null;
    if (Number.isInteger(record.time.year)) return [record.time.year, record.time.year];
    if (Number.isInteger(record.time.startYear) && Number.isInteger(record.time.endYear)) {
      return [record.time.startYear, record.time.endYear];
    }
    return null;
  }

  function overlaps(aStart, aEnd, bStart, bEnd) {
    return aStart <= bEnd && bStart <= aEnd;
  }

  function eraIdsFor(record) {
    const range = timeRange(record);
    if (!range) return [];
    return ERAS.filter(era => overlaps(range[0], range[1], era.startYear, era.endYear)).map(era => era.id);
  }

  function regionIdsFor(record) {
    const values = record && record.coverageRegions;
    if (!Array.isArray(values)) return [];
    return [...new Set(values.filter(value => REGIONS.includes(value)))];
  }

  function coverageReport(records = []) {
    const matrix = {};
    for (const era of ERAS) {
      matrix[era.id] = {};
      for (const region of REGIONS) {
        matrix[era.id][region] = { total: 0, canonical: 0, reviewed: 0, candidate: 0, types: {} };
      }
    }

    const unassigned = [];
    const unknownTypes = [];
    for (const record of records) {
      const eras = eraIdsFor(record);
      const regions = regionIdsFor(record);
      if (!eras.length || !regions.length) {
        unassigned.push(record && record.id ? record.id : null);
        continue;
      }
      if (!CORE_TYPES.includes(record.type)) unknownTypes.push(record.id || null);
      for (const eraId of eras) {
        for (const regionId of regions) {
          const cell = matrix[eraId][regionId];
          cell.total += 1;
          if (["canonical", "reviewed", "candidate"].includes(record.status)) cell[record.status] += 1;
          cell.types[record.type] = (cell.types[record.type] || 0) + 1;
        }
      }
    }

    const emptyCells = [];
    for (const era of ERAS) {
      for (const region of REGIONS) {
        if (matrix[era.id][region].total === 0) emptyCells.push({ era: era.id, region });
      }
    }

    return Object.freeze({
      eras: ERAS,
      regions: REGIONS,
      matrix,
      emptyCells: Object.freeze(emptyCells),
      unassigned: Object.freeze(unassigned),
      unknownTypes: Object.freeze(unknownTypes)
    });
  }

  return Object.freeze({ REGIONS, ERAS, CORE_TYPES, eraIdsFor, regionIdsFor, coverageReport });
});