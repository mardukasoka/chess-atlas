"use strict";

const Spatial = require("./history-spatial.js");
const Neolithic = require("./history-baseline-neolithic.js");

function sources(id) {
  return Object.freeze(Neolithic.get(id).sources.map(source => Object.freeze({ label: source.label, url: source.url })));
}

const records = Object.freeze([
  Object.freeze({
    id: "spatial-culture-mongolian-altai-early-rock-art",
    subjectId: "culture-mongolian-altai-early-rock-art",
    subjectKind: "culture",
    name: "Mongolian Altai early rock-art horizon — representative evidence area",
    geometryType: "Polygon",
    geometryMeaning: "reconstructed-distribution",
    coordinateSpace: "wgs84-lonlat",
    epistemicClass: "archaeological-reconstruction",
    time: Object.freeze({ startYear: -11000, endYear: -6000 }),
    geometry: Object.freeze([[87.0,46.5],[92.5,46.5],[92.5,50.5],[87.0,50.5]]),
    confidence: "low",
    reconstructionMethod: "Schematic western-Mongolian Altai evidence envelope around the UNESCO petroglyph complexes; not a claim that a single cultural population occupied the whole polygon.",
    spatialCaveat: "Rock-art evidence region only; not a polity, ethnicity, or language boundary.",
    sources: sources("culture-mongolian-altai-early-rock-art")
  }),
  Object.freeze({
    id: "spatial-culture-jomon-northern-japan",
    subjectId: "culture-jomon-northern-japan",
    subjectKind: "culture",
    name: "Northern Jōmon — representative multipart distribution",
    geometryType: "MultiPolygon",
    geometryMeaning: "reconstructed-distribution",
    coordinateSpace: "wgs84-lonlat",
    epistemicClass: "archaeological-reconstruction",
    time: Object.freeze({ startYear: -13000, endYear: -400 }),
    geometry: Object.freeze([
      Object.freeze([[139.2,41.3],[145.8,41.3],[145.8,45.8],[140.0,45.8]]),
      Object.freeze([[139.0,38.5],[142.2,38.5],[142.2,41.5],[139.0,41.5]])
    ]),
    confidence: "medium",
    reconstructionMethod: "Separate schematic Hokkaido and northern-Tohoku envelopes corresponding to the UNESCO serial-property region; later phase/site GIS should replace these broad first-pass shapes.",
    spatialCaveat: "Archaeological-cultural distribution; not a single political, ethnic, or linguistic boundary across the full 13,000–400 BCE sequence.",
    sources: sources("culture-jomon-northern-japan")
  })
]);

function get(idOrSubjectId) { return records.find(record => record.id === idOrSubjectId || record.subjectId === idOrSubjectId) || null; }
function activeAt(year) { return Spatial.activeAt(records, year); }
function rendererFeaturesAt(year) { return activeAt(year).flatMap(Spatial.toRendererFeatures); }

module.exports = Object.freeze({ records, get, activeAt, rendererFeaturesAt });
