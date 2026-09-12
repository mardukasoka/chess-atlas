"use strict";

require("./culture-data.js");
const Spatial = require("./history-spatial.js");

const EXCLUDED_NON_CULTURE_OVERLAYS = Object.freeze([
  Object.freeze({
    id: "culture-catalhoyuk",
    reason: "Çatalhöyük is represented in culture-data as a local settlement-complex overlay; it must remain a place/site layer rather than be promoted into a culture-distribution polygon."
  })
]);

function confidenceLevel(text) {
  const value = String(text || "").toLowerCase();
  if (value.startsWith("high")) return "high";
  if (value.startsWith("medium")) return "medium";
  return "low";
}

const excluded = new Set(EXCLUDED_NON_CULTURE_OVERLAYS.map(item => item.id));
const records = Object.freeze(global.AtlasCultureData.cultures
  .filter(culture => !excluded.has(culture.id))
  .map(culture => Object.freeze({
    id: `spatial-${culture.id}`,
    subjectId: culture.id,
    subjectKind: "culture",
    name: culture.name,
    geometryType: "Polygon",
    geometryMeaning: "reconstructed-distribution",
    coordinateSpace: "atlas-equirectangular-2048x1024",
    epistemicClass: "archaeological-reconstruction",
    time: Object.freeze({ startYear: culture.startYear, endYear: culture.endYear }),
    geometry: Object.freeze(culture.geometry.map(point => Object.freeze([...point]))),
    confidence: confidenceLevel(culture.confidence),
    reconstructionMethod: culture.mapMeaning,
    spatialCaveat: "Archaeological material/site distribution envelope only; not a political, ethnic, or linguistic boundary.",
    sources: Object.freeze(culture.sources.map(source => Object.freeze({ ...source })))
  })));

function get(idOrSubjectId) {
  return records.find(record => record.id === idOrSubjectId || record.subjectId === idOrSubjectId) || null;
}

function activeAt(year) {
  return Spatial.activeAt(records, year);
}

module.exports = Object.freeze({ records, get, activeAt, EXCLUDED_NON_CULTURE_OVERLAYS });
