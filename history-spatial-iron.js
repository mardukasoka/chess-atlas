"use strict";

const Spatial = require("./history-spatial.js");
const Iron = require("./history-baseline-iron.js");

function sources(id) {
  return Object.freeze(Iron.get(id).sources.map(source => Object.freeze({ label: source.label, url: source.url })));
}

const records = Object.freeze([
  Object.freeze({
    id: "spatial-polity-athens-classical",
    subjectId: "polity-athens-classical",
    subjectKind: "state",
    name: "Classical Athens — Attic polity core",
    geometryType: "Polygon",
    geometryMeaning: "core-area",
    coordinateSpace: "wgs84-lonlat",
    epistemicClass: "scholarly-reconstruction",
    time: Object.freeze({ startYear: -508, endYear: -322 }),
    geometry: Object.freeze([[22.85,37.65],[24.15,37.65],[24.20,38.35],[23.20,38.45],[22.75,38.05]]),
    confidence: "medium",
    reconstructionMethod: "Schematic Attica core envelope for the Athenian polis. Maritime alliance/control outside Attica is deliberately excluded and must be modeled as separate dated relations/territories.",
    sources: sources("polity-athens-classical")
  }),
  Object.freeze({
    id: "spatial-polity-achaemenid-empire",
    subjectId: "polity-achaemenid-empire",
    subjectKind: "empire",
    name: "Achaemenid Empire — representative maximum-era uncertainty envelope",
    geometryType: "Polygon",
    geometryMeaning: "uncertainty-envelope",
    coordinateSpace: "wgs84-lonlat",
    epistemicClass: "scholarly-reconstruction",
    time: Object.freeze({ startYear: -522, endYear: -486 }),
    geometry: Object.freeze([[24,41],[31,31],[36,23],[47,23],[58,25],[73,30],[78,36],[70,42],[61,47],[50,45],[40,42],[31,43]]),
    confidence: "low",
    reconstructionMethod: "First-pass Darius-I-era imperial envelope based on the Met description of the realm from Greece/Egypt through Central Asia to India. It is a coarse outer envelope, not a satrapy-grade frontier reconstruction.",
    sources: sources("polity-achaemenid-empire")
  }),
  Object.freeze({
    id: "spatial-polity-kush-napatan",
    subjectId: "polity-kush-napatan",
    subjectKind: "state",
    name: "Napatan Kush — representative Nile core",
    geometryType: "Polygon",
    geometryMeaning: "core-area",
    coordinateSpace: "wgs84-lonlat",
    epistemicClass: "archaeological-reconstruction",
    time: Object.freeze({ startYear: -900, endYear: -270 }),
    geometry: Object.freeze([[29.0,21.0],[33.0,21.0],[34.5,16.0],[31.0,14.5],[28.5,17.5]]),
    confidence: "medium",
    reconstructionMethod: "Schematic Napatan Nile-valley core centred on the Gebel Barkal/Nuri/Sanam landscape; the temporary Kushite conquest of Egypt is not flattened into this centuries-long core polygon.",
    sources: sources("polity-kush-napatan")
  }),
  Object.freeze({
    id: "spatial-culture-scythian-steppe",
    subjectId: "culture-scythian-steppe",
    subjectKind: "culture",
    name: "Scythian steppe horizon — multipart distribution",
    geometryType: "MultiPolygon",
    geometryMeaning: "reconstructed-distribution",
    coordinateSpace: "wgs84-lonlat",
    epistemicClass: "scholarly-reconstruction",
    time: Object.freeze({ startYear: -900, endYear: -200 }),
    geometry: Object.freeze([
      Object.freeze([[25,43],[42,43],[50,48],[43,53],[28,50]]),
      Object.freeze([[50,44],[70,43],[82,48],[75,53],[57,52]]),
      Object.freeze([[78,46],[98,46],[105,52],[95,56],[82,54]])
    ]),
    confidence: "low",
    reconstructionMethod: "Separated steppe evidence envelopes reflecting the British Museum's broad Black Sea-to-Central-Asia description; multipart representation avoids implying one homogeneous political territory.",
    spatialCaveat: "A broad archaeological/historical cultural horizon involving multiple nomadic groups; not a state, hard ethnicity border, or continuously occupied area.",
    sources: sources("culture-scythian-steppe")
  }),
  Object.freeze({
    id: "spatial-polity-magadha-early",
    subjectId: "polity-magadha-early",
    subjectKind: "state",
    name: "Magadha — early core area",
    geometryType: "Polygon",
    geometryMeaning: "uncertainty-envelope",
    coordinateSpace: "wgs84-lonlat",
    epistemicClass: "scholarly-reconstruction",
    time: Object.freeze({ startYear: -600, endYear: -322 }),
    geometry: Object.freeze([[82.5,27.0],[88.0,27.0],[88.0,22.5],[83.5,22.0],[81.5,24.5]]),
    confidence: "low",
    reconstructionMethod: "First-pass northeastern Indo-Gangetic Magadha envelope. The long range covers changing dynastic control and therefore must be replaced by phase-specific polygons during densification.",
    sources: sources("polity-magadha-early")
  }),
  Object.freeze({
    id: "spatial-polity-eastern-zhou",
    subjectId: "polity-eastern-zhou",
    subjectKind: "state",
    name: "Eastern Zhou court — Luoyang core",
    geometryType: "Polygon",
    geometryMeaning: "core-area",
    coordinateSpace: "wgs84-lonlat",
    epistemicClass: "scholarly-reconstruction",
    time: Object.freeze({ startYear: -770, endYear: -256 }),
    geometry: Object.freeze([[110.0,35.7],[113.5,35.7],[113.8,33.8],[110.5,33.5]]),
    confidence: "low",
    reconstructionMethod: "Schematic royal-domain core around Luoyang only. It intentionally does not treat the competing Spring-and-Autumn/Warring-States polities as territorially controlled by the Zhou court.",
    sources: sources("polity-eastern-zhou")
  }),
  Object.freeze({
    id: "spatial-culture-dong-son",
    subjectId: "culture-dong-son",
    subjectKind: "culture",
    name: "Dong Son culture — northern Vietnam core distribution",
    geometryType: "Polygon",
    geometryMeaning: "reconstructed-distribution",
    coordinateSpace: "wgs84-lonlat",
    epistemicClass: "archaeological-reconstruction",
    time: Object.freeze({ startYear: -500, endYear: 300 }),
    geometry: Object.freeze([[102.5,23.5],[108.5,23.5],[109.0,18.0],[105.0,17.0],[102.0,20.0]]),
    confidence: "medium",
    reconstructionMethod: "Schematic northern-Vietnam core; the much wider distribution of Dong Son drums is exchange evidence and is not equated with the culture's settlement area.",
    spatialCaveat: "Archaeological culture distribution, not an ethnic, linguistic, or state border.",
    sources: sources("culture-dong-son")
  }),
  Object.freeze({
    id: "spatial-culture-adena",
    subjectId: "culture-adena",
    subjectKind: "culture",
    name: "Adena horizon — Ohio Valley representative core",
    geometryType: "Polygon",
    geometryMeaning: "reconstructed-distribution",
    coordinateSpace: "wgs84-lonlat",
    epistemicClass: "archaeological-reconstruction",
    time: Object.freeze({ startYear: -1000, endYear: -100 }),
    geometry: Object.freeze([[-86.5,41.5],[-78.0,41.5],[-78.5,36.0],[-85.5,36.0],[-88.0,39.0]]),
    confidence: "low",
    reconstructionMethod: "Broad Ohio/upper Ohio Valley evidence envelope for first-pass visualization; requires later site-distribution refinement and does not imply political unity.",
    spatialCaveat: "Archaeological horizon only; not a tribal, ethnic, linguistic, or political border.",
    sources: sources("culture-adena")
  }),
  Object.freeze({
    id: "spatial-culture-maya-preclassic",
    subjectId: "culture-maya-preclassic",
    subjectKind: "culture",
    name: "Preclassic Maya-area horizons — multipart distribution",
    geometryType: "MultiPolygon",
    geometryMeaning: "reconstructed-distribution",
    coordinateSpace: "wgs84-lonlat",
    epistemicClass: "archaeological-reconstruction",
    time: Object.freeze({ startYear: -1000, endYear: 250 }),
    geometry: Object.freeze([
      Object.freeze([[-91.5,21.5],[-87.0,21.5],[-86.5,16.5],[-91.0,16.0],[-93.0,18.5]]),
      Object.freeze([[-93.0,16.5],[-89.0,16.5],[-89.5,13.5],[-92.5,13.5]])
    ]),
    confidence: "low",
    reconstructionMethod: "Separate lowland and southern/Pacific schematic envelopes following the Met's distinct Preclassic regional chronologies; not a single Maya polity.",
    spatialCaveat: "Overlapping archaeological cultural horizons; not a single state, ethnicity, or language boundary.",
    sources: sources("culture-maya-preclassic")
  }),
  Object.freeze({
    id: "spatial-culture-chavin",
    subjectId: "culture-chavin",
    subjectKind: "culture",
    name: "Chavín horizon — Andean dissemination envelope",
    geometryType: "Polygon",
    geometryMeaning: "reconstructed-distribution",
    coordinateSpace: "wgs84-lonlat",
    epistemicClass: "archaeological-reconstruction",
    time: Object.freeze({ startYear: -1500, endYear: -300 }),
    geometry: Object.freeze([[-81.5,-5.0],[-74.0,-5.0],[-71.5,-15.5],[-78.5,-17.5],[-82.0,-12.0]]),
    confidence: "low",
    reconstructionMethod: "Broad first-pass Peruvian Andean/coastal dissemination envelope based on UNESCO's description of Chavín influence across north, central and south coasts, northern highlands and high jungle; not a polity frontier.",
    spatialCaveat: "Cultural-religious dissemination area with multiple local populations and languages; not an ethnic or political border.",
    sources: sources("culture-chavin")
  })
]);

function get(idOrSubjectId) { return records.find(record => record.id === idOrSubjectId || record.subjectId === idOrSubjectId) || null; }
function activeAt(year) { return Spatial.activeAt(records, year); }
function rendererFeaturesAt(year) { return activeAt(year).flatMap(Spatial.toRendererFeatures); }

module.exports = Object.freeze({ records, get, activeAt, rendererFeaturesAt });
