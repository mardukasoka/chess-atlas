"use strict";

/*
 * First-pass Iron Age / Axial world spine (c. 1200–323 BCE).
 * The aim is global continuity at major-polity/culture level, not exhaustive
 * enumeration. Spatial extent is supplied separately by history-spatial-iron.js.
 */
(function (root) {
  const records = Object.freeze([
    Object.freeze({
      id: "polity-athens-classical",
      type: "polity",
      name: "Classical Athens",
      time: Object.freeze({ startYear: -508, endYear: -322, precision: "range" }),
      epistemicClass: "documented",
      status: "reviewed",
      confidence: 0.95,
      confidenceRationale: "The Met dates the democratic constitutional settlement to 508/507 BCE and Macedonian domination through the dissolution of the Corinthian League in 322 BCE; the record is an Athens polity anchor rather than a claim that one constitution remained unchanged throughout.",
      coverageRegions: Object.freeze(["europe"]),
      sources: Object.freeze([{ label: "Metropolitan Museum — Ancient Greece, 1000 B.C.–1 A.D.", type: "academic-secondary", reference: "Heilbrunn Timeline, Athens democracy and Classical period", url: "https://visitmetmuseum.com/toah/ht/04/eusb.html" }])
    }),
    Object.freeze({
      id: "polity-achaemenid-empire",
      type: "polity",
      name: "Achaemenid Persian Empire",
      time: Object.freeze({ startYear: -550, endYear: -330, precision: "range" }),
      epistemicClass: "documented",
      status: "reviewed",
      confidence: 0.97,
      confidenceRationale: "The Met's dedicated Achaemenid synthesis dates the empire 550–330 BCE and documents its multi-provincial imperial structure and succession through Darius III.",
      coverageRegions: Object.freeze(["middle-east-north-africa", "central-asia-steppe"]),
      sources: Object.freeze([{ label: "Metropolitan Museum — The Achaemenid Persian Empire (550–330 B.C.)", type: "academic-secondary", reference: "Heilbrunn Timeline of Art History", url: "https://www.metmuseum.org/de/essays/the-achaemenid-persian-empire-550-330-b-c" }])
    }),
    Object.freeze({
      id: "polity-kush-napatan",
      type: "polity",
      name: "Kingdom of Kush — Napatan phase",
      time: Object.freeze({ startYear: -900, endYear: -270, precision: "range" }),
      epistemicClass: "archaeological-reconstruction",
      status: "reviewed",
      confidence: 0.95,
      confidenceRationale: "UNESCO dates the Napatan culture of the second kingdom of Kush to 900–270 BCE and identifies the Gebel Barkal/Napatan sites as its major political-religious landscape.",
      coverageRegions: Object.freeze(["sub-saharan-africa"]),
      sources: Object.freeze([{ label: "UNESCO — Gebel Barkal and the Sites of the Napatan Region", type: "institutional-dataset", reference: "World Heritage List 1073", url: "https://whc.unesco.org/en/list/1073" }])
    }),
    Object.freeze({
      id: "culture-scythian-steppe",
      type: "culture",
      name: "Scythian steppe cultural horizon",
      time: Object.freeze({ startYear: -900, endYear: -200, precision: "range" }),
      epistemicClass: "scholarly-reconstruction",
      status: "reviewed",
      confidence: 0.9,
      confidenceRationale: "The British Museum describes Scythian culture as flourishing from about 900 to 200 BCE and extending its influence across Central Asia from the northern Black Sea toward China; this is encoded as a cultural distribution, not a unitary state or ethnicity boundary.",
      coverageRegions: Object.freeze(["central-asia-steppe"]),
      sources: Object.freeze([{ label: "British Museum — Introducing the Scythians", type: "academic-secondary", reference: "Scythian chronology and Central Asian extent", url: "https://www.britishmuseum.org/blog/introducing-scythians" }])
    }),
    Object.freeze({
      id: "polity-magadha-early",
      type: "polity",
      name: "Magadha — early ascendancy",
      time: Object.freeze({ startYear: -600, endYear: -322, precision: "range" }),
      epistemicClass: "scholarly-reconstruction",
      status: "reviewed",
      confidence: 0.85,
      confidenceRationale: "The Met identifies the rise of the mahajanapadas in the 8th–6th centuries BCE, larger republics in the 6th century, Nanda rule, and the dominance of Magadha under Bimbisara and Ajatashatru as the core from which the Mauryan empire emerged.",
      coverageRegions: Object.freeze(["south-asia"]),
      sources: Object.freeze([{ label: "Metropolitan Museum — South Asia, 1000 B.C.–1 A.D.", type: "academic-secondary", reference: "Heilbrunn Timeline, mahajanapadas and Magadha", url: "https://82nd-and-fifth.metmuseum.org/toah/ht/04/ssa.html" }])
    }),
    Object.freeze({
      id: "polity-eastern-zhou",
      type: "polity",
      name: "Eastern Zhou dynasty",
      time: Object.freeze({ startYear: -770, endYear: -256, precision: "range" }),
      epistemicClass: "documented",
      status: "reviewed",
      confidence: 0.95,
      confidenceRationale: "The Met chronology explicitly dates Eastern Zhou to 770–256 BCE and distinguishes Spring and Autumn and Warring States phases, when political authority was dispersed among competing states.",
      coverageRegions: Object.freeze(["east-asia"]),
      sources: Object.freeze([{ label: "Metropolitan Museum — China, 1000 B.C.–1 A.D.", type: "academic-secondary", reference: "Heilbrunn Timeline, Eastern Zhou 770–256 BCE", url: "https://82nd-and-fifth.metmuseum.org/toah/ht/04/eac.html" }])
    }),
    Object.freeze({
      id: "culture-dong-son",
      type: "culture",
      name: "Dong Son cultural horizon",
      time: Object.freeze({ startYear: -500, endYear: 300, precision: "range" }),
      epistemicClass: "archaeological-reconstruction",
      status: "reviewed",
      confidence: 0.9,
      confidenceRationale: "The Met dates Dong Son culture in northern Vietnam to about 500 BCE–300 CE and documents the wide circulation of Dong Son drums through mainland and island Southeast Asia.",
      coverageRegions: Object.freeze(["southeast-asia"]),
      sources: Object.freeze([{ label: "Metropolitan Museum — Southeast Asia, 1000 B.C.–1 A.D.", type: "academic-secondary", reference: "Heilbrunn Timeline, Dong Son culture", url: "https://82nd-and-fifth.metmuseum.org/toah/ht/04/sse.html" }])
    }),
    Object.freeze({
      id: "culture-adena",
      type: "culture",
      name: "Adena cultural horizon",
      time: Object.freeze({ startYear: -1000, endYear: -100, precision: "range" }),
      epistemicClass: "archaeological-reconstruction",
      status: "reviewed",
      confidence: 0.9,
      confidenceRationale: "The Met North America chronology places Adena cultures at 1000–100 BCE within the broader Eastern Woodland sequence; NPS sources independently describe Early Woodland/Adena earthwork and ceremonial traditions.",
      coverageRegions: Object.freeze(["north-america"]),
      sources: Object.freeze([{ label: "Metropolitan Museum — North America, 1000 B.C.–1 A.D.", type: "academic-secondary", reference: "Heilbrunn Timeline, Adena 1000–100 BCE", url: "https://82nd-and-fifth.metmuseum.org/toah/ht/04/na.html" }])
    }),
    Object.freeze({
      id: "culture-maya-preclassic",
      type: "culture",
      name: "Maya area — Preclassic cultural horizons",
      time: Object.freeze({ startYear: -1000, endYear: 250, precision: "range" }),
      epistemicClass: "archaeological-reconstruction",
      status: "reviewed",
      confidence: 0.9,
      confidenceRationale: "The Met chronology documents Lowland Preclassic cultures from about 1000 BCE to 250 CE and longer Pacific plain/highland Preclassic sequences; the record denotes overlapping archaeological cultural horizons, not a single Maya state.",
      coverageRegions: Object.freeze(["central-america-caribbean"]),
      sources: Object.freeze([{ label: "Metropolitan Museum — Maya Area, 1000 B.C.–1 A.D.", type: "academic-secondary", reference: "Heilbrunn Timeline, Preclassic Maya-area cultures", url: "https://82nd-and-fifth.metmuseum.org/toah/ht/04/caa.html" }])
    }),
    Object.freeze({
      id: "culture-chavin",
      type: "culture",
      name: "Chavín cultural-religious horizon",
      time: Object.freeze({ startYear: -1500, endYear: -300, precision: "range" }),
      epistemicClass: "archaeological-reconstruction",
      status: "reviewed",
      confidence: 0.95,
      confidenceRationale: "UNESCO dates the culture named for Chavín between 1500 and 300 BCE and describes the site as a convergence and dissemination centre whose cult spread across a wide Andean territory.",
      coverageRegions: Object.freeze(["south-america"]),
      sources: Object.freeze([{ label: "UNESCO — Chavin (Archaeological Site)", type: "institutional-dataset", reference: "World Heritage List 330", url: "https://whc.unesco.org/en/list/330" }])
    }),
    Object.freeze({
      id: "trade-route-western-pacific-iron-age",
      type: "trade-route",
      name: "Western Pacific interaction network — Iron Age horizon",
      time: Object.freeze({ startYear: -1000, endYear: -1, precision: "range" }),
      epistemicClass: "scholarly-reconstruction",
      status: "reviewed",
      confidence: 0.8,
      confidenceRationale: "The Met Oceania chronology describes growing trade and interaction between island Southeast Asia, western Pacific communities, and the Asian mainland during 1000 BCE–1 BCE, including later Dong Son exchange; this is a network anchor rather than a bounded culture.",
      coverageRegions: Object.freeze(["oceania-pacific"]),
      sources: Object.freeze([{ label: "Metropolitan Museum — Oceania, 1000 B.C.–1 A.D.", type: "academic-secondary", reference: "Heilbrunn Timeline, western Pacific interaction", url: "https://82nd-and-fifth.metmuseum.org/toah/ht/04/oc.html" }])
    })
  ]);

  function all() { return [...records]; }
  function get(id) { return records.find(record => record.id === id) || null; }

  const api = Object.freeze({ records, all, get });
  root.AtlasHistoryIron = api;
  if (typeof module === "object" && module.exports) module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
