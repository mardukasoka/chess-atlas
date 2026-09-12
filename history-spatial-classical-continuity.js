"use strict";

const Spatial = require("./history-spatial.js");
const ContinuityBatch = require("./history-baseline-classical-continuity.js");

function sources(id) {
  return Object.freeze(ContinuityBatch.get(id).sources.map(source => Object.freeze({ label: source.label, url: source.url })));
}

const records = Object.freeze([
  Object.freeze({
    id: "spatial-polity-seleucid-empire-early",
    subjectId: "polity-seleucid-empire",
    subjectKind: "empire",
    name: "Seleucid Empire — early representative extent",
    geometryType: "Polygon",
    geometryMeaning: "uncertainty-envelope",
    coordinateSpace: "wgs84-lonlat",
    epistemicClass: "scholarly-reconstruction",
    time: Object.freeze({ startYear: -312, endYear: -246 }),
    geometry: Object.freeze([[24,41],[30,31],[38,27],[48,26],[61,29],[72,32],[76,37],[65,42],[52,44],[40,42],[30,44]]),
    confidence: "low",
    reconstructionMethod: "Schematic early Seleucid envelope based on the Met description of Seleucus ruling eastern provinces spanning Mesopotamia, Iran, Afghanistan, Syria and adjacent regions. It is not a satrapy-grade boundary.",
    sources: sources("polity-seleucid-empire")
  }),
  Object.freeze({
    id: "spatial-polity-ptolemaic-egypt",
    subjectId: "polity-ptolemaic-egypt",
    subjectKind: "state",
    name: "Ptolemaic Egypt — representative Egyptian core",
    geometryType: "Polygon",
    geometryMeaning: "core-area",
    coordinateSpace: "wgs84-lonlat",
    epistemicClass: "scholarly-reconstruction",
    time: Object.freeze({ startYear: -305, endYear: -30 }),
    geometry: Object.freeze([[24.5,31.8],[34.5,31.8],[35.2,22.0],[30.0,21.5],[27.0,25.0]]),
    confidence: "medium",
    reconstructionMethod: "Conservative Nile/Delta core only. Overseas possessions and fluctuating Levantine holdings are deliberately excluded from this long-duration polygon and should be separate dated phases.",
    sources: sources("polity-ptolemaic-egypt")
  }),
  Object.freeze({
    id: "spatial-polity-qin-dynasty",
    subjectId: "polity-qin-dynasty",
    subjectKind: "state",
    name: "Qin dynasty — representative unified core",
    geometryType: "Polygon",
    geometryMeaning: "uncertainty-envelope",
    coordinateSpace: "wgs84-lonlat",
    epistemicClass: "scholarly-reconstruction",
    time: Object.freeze({ startYear: -221, endYear: -206 }),
    geometry: Object.freeze([[102,40],[112,42],[121,39],[122,31],[116,24],[106,23],[100,30]]),
    confidence: "low",
    reconstructionMethod: "First-pass unified Qin territorial envelope for time-state visualization; frontier detail and commandery boundaries require later GIS refinement.",
    sources: sources("polity-qin-dynasty")
  }),
  Object.freeze({
    id: "spatial-polity-western-han",
    subjectId: "polity-western-han",
    subjectKind: "empire",
    name: "Western Han — representative imperial envelope",
    geometryType: "Polygon",
    geometryMeaning: "uncertainty-envelope",
    coordinateSpace: "wgs84-lonlat",
    epistemicClass: "scholarly-reconstruction",
    time: Object.freeze({ startYear: -206, endYear: 9 }),
    geometry: Object.freeze([[93,42],[104,44],[118,42],[123,34],[119,23],[106,20],[98,28],[92,34]]),
    confidence: "low",
    reconstructionMethod: "Schematic Western Han envelope including westward expansion at a broad scale; not a claim of constant control across the full 215-year span.",
    sources: sources("polity-western-han")
  }),
  Object.freeze({
    id: "spatial-polity-wang-mang-interregnum",
    subjectId: "polity-wang-mang-interregnum",
    subjectKind: "state",
    name: "Wang Mang / Xin — representative inherited imperial core",
    geometryType: "Polygon",
    geometryMeaning: "uncertainty-envelope",
    coordinateSpace: "wgs84-lonlat",
    epistemicClass: "scholarly-reconstruction",
    time: Object.freeze({ startYear: 9, endYear: 25 }),
    geometry: Object.freeze([[96,41],[107,43],[119,40],[121,31],[116,23],[105,22],[97,29]]),
    confidence: "low",
    reconstructionMethod: "Conservative inherited Han core envelope for the short interregnum; instability and effective control require later event-level refinement.",
    sources: sources("polity-wang-mang-interregnum")
  }),
  Object.freeze({
    id: "spatial-polity-eastern-han",
    subjectId: "polity-eastern-han",
    subjectKind: "empire",
    name: "Eastern Han — representative imperial envelope",
    geometryType: "Polygon",
    geometryMeaning: "uncertainty-envelope",
    coordinateSpace: "wgs84-lonlat",
    epistemicClass: "scholarly-reconstruction",
    time: Object.freeze({ startYear: 25, endYear: 220 }),
    geometry: Object.freeze([[95,41],[106,43],[120,40],[123,31],[118,22],[105,21],[97,28]]),
    confidence: "low",
    reconstructionMethod: "Broad Eastern Han state envelope. Western Protectorate influence, frontier retreat, and late-Han fragmentation must be represented by later phase polygons rather than assumed constant here.",
    sources: sources("polity-eastern-han")
  }),
  Object.freeze({
    id: "spatial-polity-sasanian-empire-b4",
    subjectId: "polity-sasanian-empire-b4",
    subjectKind: "empire",
    name: "Early Sasanian Empire — B4 representative envelope",
    geometryType: "Polygon",
    geometryMeaning: "uncertainty-envelope",
    coordinateSpace: "wgs84-lonlat",
    epistemicClass: "scholarly-reconstruction",
    time: Object.freeze({ startYear: 224, endYear: 300 }),
    geometry: Object.freeze([[37,38],[44,31],[52,25],[63,25],[68,31],[64,38],[56,41],[46,40]]),
    confidence: "low",
    reconstructionMethod: "First-pass early Sasanian Iranian/Mesopotamian envelope, intended only to distinguish the post-Parthian phase before B5 densification.",
    sources: sources("polity-sasanian-empire-b4")
  })
]);

function get(idOrSubjectId) { return records.find(record => record.id === idOrSubjectId || record.subjectId === idOrSubjectId) || null; }
function activeAt(year) { return Spatial.activeAt(records, year); }
function rendererFeaturesAt(year) { return activeAt(year).flatMap(Spatial.toRendererFeatures); }

module.exports = Object.freeze({ records, get, activeAt, rendererFeaturesAt });
