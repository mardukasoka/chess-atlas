"use strict";

const Spatial = require("./history-spatial.js");
const Classical = require("./history-baseline-classical.js");

function sources(id) {
  return Object.freeze(Classical.get(id).sources.map(source => Object.freeze({ label: source.label, url: source.url })));
}

const records = Object.freeze([
  Object.freeze({
    id: "spatial-polity-roman-empire-principate",
    subjectId: "polity-roman-empire-principate",
    subjectKind: "empire",
    name: "Roman Empire — representative early-imperial envelope",
    geometryType: "MultiPolygon",
    geometryMeaning: "uncertainty-envelope",
    coordinateSpace: "wgs84-lonlat",
    epistemicClass: "scholarly-reconstruction",
    time: Object.freeze({ startYear: -27, endYear: 300 }),
    geometry: Object.freeze([
      Object.freeze([[-10,36],[-6,51],[10,55],[25,48],[31,40],[27,34],[10,31],[-5,34]]),
      Object.freeze([[24,31],[36,37],[43,36],[42,29],[31,22],[25,24]])
    ]),
    confidence: "low",
    reconstructionMethod: "Coarse Mediterranean/European and eastern/southern imperial envelopes representing the early imperial system across a three-century span. Provincial frontiers changed repeatedly and require phase-specific GIS reconstruction later.",
    sources: sources("polity-roman-empire-principate")
  }),
  Object.freeze({
    id: "spatial-polity-parthian-empire",
    subjectId: "polity-parthian-empire",
    subjectKind: "empire",
    name: "Parthian Empire — representative Iranian-Mesopotamian envelope",
    geometryType: "Polygon",
    geometryMeaning: "uncertainty-envelope",
    coordinateSpace: "wgs84-lonlat",
    epistemicClass: "scholarly-reconstruction",
    time: Object.freeze({ startYear: -247, endYear: 224 }),
    geometry: Object.freeze([[39,37],[48,43],[61,40],[67,34],[62,26],[50,25],[42,29]]),
    confidence: "low",
    reconstructionMethod: "First-pass Iranian/Mesopotamian imperial envelope across a long period of changing Arsacid control; not a fixed frontier or claim of continuous administrative intensity.",
    sources: sources("polity-parthian-empire")
  }),
  Object.freeze({
    id: "spatial-polity-kush-meroitic",
    subjectId: "polity-kush-meroitic",
    subjectKind: "state",
    name: "Meroitic Kush — Nile and adjacent core",
    geometryType: "Polygon",
    geometryMeaning: "uncertainty-envelope",
    coordinateSpace: "wgs84-lonlat",
    epistemicClass: "archaeological-reconstruction",
    time: Object.freeze({ startYear: -250, endYear: 300 }),
    geometry: Object.freeze([[28.5,22.5],[34.5,22.0],[36.0,15.0],[33.0,12.5],[29.0,15.0],[27.5,19.0]]),
    confidence: "medium",
    reconstructionMethod: "Schematic Nile-centered Meroitic Kush envelope around the Napata–Meroë system and associated trade corridor; later work should separate royal core, controlled Lower Nubia, and exchange reach.",
    sources: sources("polity-kush-meroitic")
  }),
  Object.freeze({
    id: "spatial-polity-kushan-empire",
    subjectId: "polity-kushan-empire",
    subjectKind: "empire",
    name: "Kushan Empire — representative Central/South Asian envelope",
    geometryType: "Polygon",
    geometryMeaning: "uncertainty-envelope",
    coordinateSpace: "wgs84-lonlat",
    epistemicClass: "scholarly-reconstruction",
    time: Object.freeze({ startYear: 78, endYear: 280 }),
    geometry: Object.freeze([[62,41],[75,42],[83,36],[81,27],[72,24],[64,30]]),
    confidence: "low",
    reconstructionMethod: "Broad first-pass Bactria–northwestern South Asia–upper Indo-Gangetic envelope. Dynastic chronology and territorial maximum remain debated and require phase-specific reconstruction.",
    sources: sources("polity-kushan-empire")
  }),
  Object.freeze({
    id: "spatial-polity-mauryan-empire",
    subjectId: "polity-mauryan-empire",
    subjectKind: "empire",
    name: "Mauryan Empire — representative imperial envelope",
    geometryType: "Polygon",
    geometryMeaning: "uncertainty-envelope",
    coordinateSpace: "wgs84-lonlat",
    epistemicClass: "scholarly-reconstruction",
    time: Object.freeze({ startYear: -322, endYear: -185 }),
    geometry: Object.freeze([[66,35],[76,35],[88,28],[88,20],[80,10],[73,12],[68,22]]),
    confidence: "low",
    reconstructionMethod: "Coarse subcontinental envelope for Mauryan imperial reach. It deliberately avoids presenting the southern peninsula and frontier zones as uniformly administered and should later be split by reign/evidence class.",
    sources: sources("polity-mauryan-empire")
  }),
  Object.freeze({
    id: "spatial-polity-han-dynasty",
    subjectId: "polity-han-dynasty",
    subjectKind: "empire",
    name: "Han dynasty — representative imperial core and corridors",
    geometryType: "Polygon",
    geometryMeaning: "uncertainty-envelope",
    coordinateSpace: "wgs84-lonlat",
    epistemicClass: "scholarly-reconstruction",
    time: Object.freeze({ startYear: -206, endYear: 220 }),
    geometry: Object.freeze([[98,40],[106,44],[119,42],[124,34],[119,24],[108,21],[101,27]]),
    confidence: "low",
    reconstructionMethod: "First-pass Han imperial/core envelope across Western and Eastern Han. Western Regions protectorates, tributary relations, and temporary military control are not flattened into this single polygon.",
    sources: sources("polity-han-dynasty")
  }),
  Object.freeze({
    id: "spatial-culture-sa-huynh",
    subjectId: "culture-sa-huynh",
    subjectKind: "culture",
    name: "Sa Huynh horizon — southern Vietnam core",
    geometryType: "Polygon",
    geometryMeaning: "reconstructed-distribution",
    coordinateSpace: "wgs84-lonlat",
    epistemicClass: "archaeological-reconstruction",
    time: Object.freeze({ startYear: -500, endYear: 100 }),
    geometry: Object.freeze([[106.0,17.0],[109.5,17.0],[109.0,10.0],[106.0,10.0]]),
    confidence: "medium",
    reconstructionMethod: "Schematic southern/central Vietnamese core for Sa Huynh-associated jar-burial and material traditions; exchange links to island Southeast Asia are not encoded as settlement territory.",
    spatialCaveat: "Archaeological culture distribution only; not a state, ethnicity, or language border.",
    sources: sources("culture-sa-huynh")
  }),
  Object.freeze({
    id: "spatial-culture-hopewell",
    subjectId: "culture-hopewell",
    subjectKind: "culture",
    name: "Hopewell horizon — Eastern Woodlands representative distribution",
    geometryType: "MultiPolygon",
    geometryMeaning: "reconstructed-distribution",
    coordinateSpace: "wgs84-lonlat",
    epistemicClass: "archaeological-reconstruction",
    time: Object.freeze({ startYear: -200, endYear: 300 }),
    geometry: Object.freeze([
      Object.freeze([[-87,42],[-79,42],[-79,37],[-86,37]]),
      Object.freeze([[-92,40],[-87,41],[-87,37],[-91,36]])
    ]),
    confidence: "low",
    reconstructionMethod: "Separated Ohio Valley and adjacent interaction envelopes for first-pass visualization; they represent archaeological/material networks, not a unified polity or ethnicity.",
    spatialCaveat: "Archaeological interaction horizon; not political, ethnic, tribal, or linguistic territory.",
    sources: sources("culture-hopewell")
  }),
  Object.freeze({
    id: "spatial-culture-maya-late-preclassic-early-classic",
    subjectId: "culture-maya-late-preclassic-early-classic",
    subjectKind: "culture",
    name: "Maya Late Preclassic–Early Classic transition — multipart distribution",
    geometryType: "MultiPolygon",
    geometryMeaning: "reconstructed-distribution",
    coordinateSpace: "wgs84-lonlat",
    epistemicClass: "archaeological-reconstruction",
    time: Object.freeze({ startYear: -300, endYear: 300 }),
    geometry: Object.freeze([
      Object.freeze([[-91.5,21.5],[-87,21.5],[-86.5,16.3],[-91.2,16.0],[-93,18.5]]),
      Object.freeze([[-92.5,16.5],[-89,16.5],[-89.5,13.5],[-92.5,13.5]])
    ]),
    confidence: "low",
    reconstructionMethod: "Continuation/refinement of the Maya-area archaeological envelopes across the Late Preclassic to Early Classic transition; political city-states are deliberately not merged into one territorial polygon.",
    spatialCaveat: "Overlapping cultural and urban traditions; not a single Maya state, ethnicity, or language boundary.",
    sources: sources("culture-maya-late-preclassic-early-classic")
  }),
  Object.freeze({
    id: "spatial-culture-moche-early",
    subjectId: "culture-moche-early",
    subjectKind: "culture",
    name: "Early Moche — north Peruvian coastal distribution",
    geometryType: "Polygon",
    geometryMeaning: "reconstructed-distribution",
    coordinateSpace: "wgs84-lonlat",
    epistemicClass: "archaeological-reconstruction",
    time: Object.freeze({ startYear: 100, endYear: 300 }),
    geometry: Object.freeze([[-81.5,-5.5],[-77.5,-5.5],[-77.0,-13.5],[-81.0,-13.5]]),
    confidence: "low",
    reconstructionMethod: "Schematic north-coast Peru envelope for the early Moche cultural horizon. It does not imply one continuously unified Moche state across the entire coast.",
    spatialCaveat: "Archaeological cultural distribution; political organization varied regionally and through time.",
    sources: sources("culture-moche-early")
  })
]);

function get(idOrSubjectId) { return records.find(record => record.id === idOrSubjectId || record.subjectId === idOrSubjectId) || null; }
function activeAt(year) { return Spatial.activeAt(records, year); }
function rendererFeaturesAt(year) { return activeAt(year).flatMap(Spatial.toRendererFeatures); }

module.exports = Object.freeze({ records, get, activeAt, rendererFeaturesAt });
