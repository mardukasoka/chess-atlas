"use strict";

const Spatial = require("./history-spatial.js");
const Bronze = require("./history-baseline-bronze.js");

function sourceFor(id) {
  const record = Bronze.get(id);
  return Object.freeze(record.sources.map(source => Object.freeze({ label: source.label, url: source.url })));
}

const records = Object.freeze([
  Object.freeze({
    id: "spatial-culture-mycenaean-greece-bronze",
    subjectId: "culture-mycenaean-greece",
    subjectKind: "culture",
    name: "Mycenaean cultural distribution — representative core",
    geometryType: "MultiPolygon",
    geometryMeaning: "reconstructed-distribution",
    coordinateSpace: "wgs84-lonlat",
    epistemicClass: "archaeological-reconstruction",
    time: Object.freeze({ startYear: -1600, endYear: -1100 }),
    geometry: Object.freeze([
      Object.freeze([[20.4,36.4],[23.7,36.2],[24.7,38.8],[22.5,40.0],[20.1,38.7]]),
      Object.freeze([[23.2,34.6],[26.5,34.7],[26.4,35.8],[23.3,35.9]])
    ]),
    confidence: "medium",
    reconstructionMethod: "First-pass schematic envelopes around the principal mainland Greek/Aegean archaeological core represented by the UNESCO Mycenae-Tiryns horizon; deliberately not a political frontier.",
    spatialCaveat: "Material-culture distribution; not a single state, ethnicity, or language boundary.",
    sources: sourceFor("culture-mycenaean-greece")
  }),
  Object.freeze({
    id: "spatial-polity-egypt-new-kingdom",
    subjectId: "polity-egypt-new-kingdom",
    subjectKind: "empire",
    name: "New Kingdom Egypt — representative control envelope",
    geometryType: "MultiPolygon",
    geometryMeaning: "uncertainty-envelope",
    coordinateSpace: "wgs84-lonlat",
    epistemicClass: "scholarly-reconstruction",
    time: Object.freeze({ startYear: -1550, endYear: -1070 }),
    geometry: Object.freeze([
      Object.freeze([[29.0,31.7],[33.0,31.4],[33.4,29.0],[32.7,24.0],[32.0,20.0],[30.0,20.0],[29.2,24.5],[28.5,29.0]]),
      Object.freeze([[32.0,31.5],[35.8,31.7],[36.2,33.6],[34.0,34.2],[32.1,33.1]])
    ]),
    confidence: "medium",
    reconstructionMethod: "Schematic Nile/Nubian and southern-Levant envelopes based on the Met chronology and its description of New Kingdom control in Nubia and expansion/influence in the Near East; not a single-year frontier reconstruction.",
    sources: Object.freeze([
      ...sourceFor("polity-egypt-new-kingdom"),
      Object.freeze({ label: "Metropolitan Museum — The Land of Nubia", url: "https://www.metmuseum.org/de/essays/nubia" })
    ])
  }),
  Object.freeze({
    id: "spatial-polity-kerma",
    subjectId: "polity-kerma",
    subjectKind: "polity",
    name: "Kerma polity — representative Nubian core area",
    geometryType: "Polygon",
    geometryMeaning: "core-area",
    coordinateSpace: "wgs84-lonlat",
    epistemicClass: "archaeological-reconstruction",
    time: Object.freeze({ startYear: -2500, endYear: -1500 }),
    geometry: Object.freeze([[29.3,20.8],[32.4,20.5],[33.5,17.5],[31.0,16.5],[29.0,18.3]]),
    confidence: "medium",
    reconstructionMethod: "Schematic Upper Nubian core centred on Kerma; does not claim a surveyed kingdom frontier.",
    sources: sourceFor("polity-kerma")
  }),
  Object.freeze({
    id: "spatial-polity-shang-dynasty",
    subjectId: "polity-shang-dynasty",
    subjectKind: "state",
    name: "Shang dynasty — representative archaeological core",
    geometryType: "Polygon",
    geometryMeaning: "uncertainty-envelope",
    coordinateSpace: "wgs84-lonlat",
    epistemicClass: "archaeological-reconstruction",
    time: Object.freeze({ startYear: -1600, endYear: -1046 }),
    geometry: Object.freeze([[108.0,37.5],[112.0,40.0],[117.5,39.0],[120.0,35.0],[116.5,31.5],[111.0,32.0],[107.0,34.5]]),
    confidence: "low",
    reconstructionMethod: "Broad first-pass Yellow River archaeological envelope; deliberately low-confidence pending dynasty-phase GIS reconstruction and not a claim of a fixed Shang state border throughout 1600–1046 BCE.",
    sources: sourceFor("polity-shang-dynasty")
  }),
  Object.freeze({
    id: "spatial-culture-poverty-point",
    subjectId: "culture-poverty-point",
    subjectKind: "culture",
    name: "Poverty Point tradition — representative Lower Mississippi core",
    geometryType: "Polygon",
    geometryMeaning: "core-area",
    coordinateSpace: "wgs84-lonlat",
    epistemicClass: "archaeological-reconstruction",
    time: Object.freeze({ startYear: -1700, endYear: -1100 }),
    geometry: Object.freeze([[-93.5,35.0],[-88.5,35.0],[-88.0,29.0],[-92.5,28.5],[-94.0,31.5]]),
    confidence: "low",
    reconstructionMethod: "Schematic Lower Mississippi core around the Monumental Earthworks of Poverty Point tradition; requires later site-distribution GIS refinement.",
    spatialCaveat: "Archaeological tradition envelope; not political territory or an ethnic boundary.",
    sources: sourceFor("culture-poverty-point")
  }),
  Object.freeze({
    id: "spatial-culture-olmec-early-state-horizon",
    subjectId: "culture-olmec-early-state-horizon",
    subjectKind: "culture",
    name: "Olmec Gulf Coast — candidate core distribution",
    geometryType: "Polygon",
    geometryMeaning: "reconstructed-distribution",
    coordinateSpace: "wgs84-lonlat",
    epistemicClass: "scholarly-reconstruction",
    time: Object.freeze({ startYear: -1800, endYear: -400 }),
    geometry: Object.freeze([[-96.8,19.2],[-93.0,19.0],[-91.5,17.2],[-94.0,16.8],[-96.6,17.5]]),
    confidence: "low",
    reconstructionMethod: "Candidate schematic Gulf Coast envelope around the San Lorenzo/La Venta horizon referenced by the source; retained at low confidence until dedicated archaeological map cross-checking.",
    spatialCaveat: "Cultural/archaeological distribution, not an ethnic or sovereign border.",
    sources: sourceFor("culture-olmec-early-state-horizon")
  }),
  Object.freeze({
    id: "spatial-culture-lapita",
    subjectId: "culture-lapita",
    subjectKind: "culture",
    name: "Lapita horizon — multipart representative distribution",
    geometryType: "MultiPolygon",
    geometryMeaning: "reconstructed-distribution",
    coordinateSpace: "wgs84-lonlat",
    epistemicClass: "archaeological-reconstruction",
    time: Object.freeze({ startYear: -1600, endYear: -500 }),
    geometry: Object.freeze([
      Object.freeze([[145,-2],[154,-2],[155,-7],[147,-8]]),
      Object.freeze([[154,-5],[164,-5],[164,-12],[156,-12]]),
      Object.freeze([[164,-12],[171,-12],[171,-21],[165,-21]]),
      Object.freeze([[176,-15],[-176,-15],[-176,-22],[176,-22]])
    ]),
    confidence: "low",
    reconstructionMethod: "Separate schematic archipelago envelopes following the ANU synthesis of Lapita spread across Melanesia into western Polynesia; multipart geometry intentionally avoids filling intervening ocean as continuous occupation.",
    spatialCaveat: "Archaeological distribution envelopes across island groups; not political, ethnic, or linguistic borders.",
    sources: sourceFor("culture-lapita")
  })
]);

function get(idOrSubjectId) {
  return records.find(record => record.id === idOrSubjectId || record.subjectId === idOrSubjectId) || null;
}
function activeAt(year) { return Spatial.activeAt(records, year); }
function rendererFeaturesAt(year) { return activeAt(year).flatMap(Spatial.toRendererFeatures); }

module.exports = Object.freeze({ records, get, activeAt, rendererFeaturesAt });
