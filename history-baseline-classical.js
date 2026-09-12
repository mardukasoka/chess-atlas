"use strict";

/*
 * First-pass Hellenistic / Roman / Han world spine (323 BCE–300 CE).
 * Globally balanced anchors only; this is not yet a dense political atlas.
 * Spatial extent is supplied separately by history-spatial-classical.js.
 */
(function (root) {
  const records = Object.freeze([
    Object.freeze({
      id: "polity-roman-empire-principate",
      type: "polity",
      name: "Roman Empire — Principate and early imperial period",
      time: Object.freeze({ startYear: -27, endYear: 300, precision: "range" }),
      epistemicClass: "documented",
      status: "reviewed",
      confidence: 0.97,
      confidenceRationale: "The Met chronology dates the Roman Empire from 27 BCE and documents Roman rule across the Mediterranean and western/central Europe through this period; the Atlas record stops at 300 CE to match the B4 window.",
      coverageRegions: Object.freeze(["europe", "middle-east-north-africa"]),
      sources: Object.freeze([{ label: "Metropolitan Museum — Italian Peninsula, 1–500 A.D.", type: "academic-secondary", reference: "Heilbrunn Timeline, Roman empire 27 B.C.–393 A.D.", url: "https://82nd-and-fifth.metmuseum.org/toah/ht/05/eust.html" }])
    }),
    Object.freeze({
      id: "polity-parthian-empire",
      type: "polity",
      name: "Parthian Empire",
      time: Object.freeze({ startYear: -247, endYear: 224, precision: "range" }),
      epistemicClass: "documented",
      status: "reviewed",
      confidence: 0.96,
      confidenceRationale: "The Met chronology explicitly dates the Parthian Empire 247 BCE–224 CE and identifies its control of Iranian and Mesopotamian trade corridors linking east and west.",
      coverageRegions: Object.freeze(["middle-east-north-africa", "central-asia-steppe"]),
      sources: Object.freeze([{ label: "Metropolitan Museum — Iran, 1–500 A.D.", type: "academic-secondary", reference: "Heilbrunn Timeline, Parthian empire 247 B.C.–224 A.D.", url: "https://82nd-and-fifth.metmuseum.org/toah/ht/05/wai.html" }])
    }),
    Object.freeze({
      id: "polity-kush-meroitic",
      type: "polity",
      name: "Kingdom of Kush — Meroitic period",
      time: Object.freeze({ startYear: -250, endYear: 300, precision: "range" }),
      epistemicClass: "archaeological-reconstruction",
      status: "reviewed",
      confidence: 0.95,
      confidenceRationale: "The Met dates the Meroitic Period from about 250 BCE to 450 CE and describes Meroë as the Kushite capital and a major East African trade center; the Atlas record stops at 300 CE for this batch.",
      coverageRegions: Object.freeze(["sub-saharan-africa"]),
      sources: Object.freeze([{ label: "Metropolitan Museum — Sudan, 1–500 A.D.", type: "academic-secondary", reference: "Heilbrunn Timeline, Meroitic Period ca. 250 B.C.–450 A.D.", url: "https://82nd-and-fifth.metmuseum.org/toah/ht/05/afs.html" }])
    }),
    Object.freeze({
      id: "polity-kushan-empire",
      type: "polity",
      name: "Kushan Empire",
      time: Object.freeze({ startYear: 78, endYear: 280, precision: "range" }),
      epistemicClass: "scholarly-reconstruction",
      status: "reviewed",
      confidence: 0.85,
      confidenceRationale: "The Met Central and North Asia chronology gives Kushan rule approximately 78/142–280 CE; the uncertain initial date is represented here conservatively at 78 CE and should be refined by a dedicated Kushan chronology pass.",
      coverageRegions: Object.freeze(["central-asia-steppe", "south-asia"]),
      sources: Object.freeze([{ label: "Metropolitan Museum — Central and North Asia, 1–500 A.D.", type: "academic-secondary", reference: "Heilbrunn Timeline, Kushan empire 78/142–280 A.D.", url: "https://82nd-and-fifth.metmuseum.org/toah/ht/05/nc.html" }])
    }),
    Object.freeze({
      id: "polity-mauryan-empire",
      type: "polity",
      name: "Mauryan Empire",
      time: Object.freeze({ startYear: -322, endYear: -185, precision: "range" }),
      epistemicClass: "documented",
      status: "reviewed",
      confidence: 0.95,
      confidenceRationale: "The Met South Asia chronology identifies Magadha as the base from which Chandragupta established Mauryan imperial power after Alexander's invasion and records the Seleucid-Mauryan frontier settlement by 305 BCE.",
      coverageRegions: Object.freeze(["south-asia"]),
      sources: Object.freeze([{ label: "Metropolitan Museum — South Asia, 1000 B.C.–1 A.D.", type: "academic-secondary", reference: "Heilbrunn Timeline, Mauryan emergence and 305 B.C. frontier settlement", url: "https://82nd-and-fifth.metmuseum.org/toah/ht/04/ssa.html" }])
    }),
    Object.freeze({
      id: "polity-han-dynasty",
      type: "polity",
      name: "Han dynasty",
      time: Object.freeze({ startYear: -206, endYear: 220, precision: "range" }),
      epistemicClass: "documented",
      status: "reviewed",
      confidence: 0.98,
      confidenceRationale: "The Met chronology explicitly dates Western Han 206 BCE–9 CE and Eastern Han 25–220 CE, separated by the Wang Mang interregnum; this umbrella record preserves the dynasty-level span while later phase records can encode the interruption explicitly.",
      coverageRegions: Object.freeze(["east-asia"]),
      sources: Object.freeze([{ label: "Metropolitan Museum — China, 1–500 A.D.", type: "academic-secondary", reference: "Heilbrunn Timeline, Western Han / Wang Mang / Eastern Han", url: "https://82nd-and-fifth.metmuseum.org/toah/ht/05/eac.html" }])
    }),
    Object.freeze({
      id: "culture-sa-huynh",
      type: "culture",
      name: "Sa Huynh cultural horizon",
      time: Object.freeze({ startYear: -500, endYear: 100, precision: "range" }),
      epistemicClass: "archaeological-reconstruction",
      status: "reviewed",
      confidence: 0.9,
      confidenceRationale: "The Met dates Sa Huynh-related settlement and jar-burial traditions in southern Vietnam to about 500 BCE–100 CE and documents links with Borneo, the Philippines, and wider exchange networks.",
      coverageRegions: Object.freeze(["southeast-asia"]),
      sources: Object.freeze([{ label: "Metropolitan Museum — Southeast Asia, 1–500 A.D.", type: "academic-secondary", reference: "Heilbrunn Timeline, Sa Huynh ca. 500 B.C.–100 A.D.", url: "https://82nd-and-fifth.metmuseum.org/toah/ht/05/sse.html" }])
    }),
    Object.freeze({
      id: "culture-hopewell",
      type: "culture",
      name: "Hopewell cultural horizon",
      time: Object.freeze({ startYear: -200, endYear: 500, precision: "range" }),
      epistemicClass: "archaeological-reconstruction",
      status: "reviewed",
      confidence: 0.9,
      confidenceRationale: "The Met North America chronology dates Hopewell cultures to about 200 BCE–500 CE within the Eastern Woodland sequence; the B4 record stops at 300 CE while preserving the source chronology in provenance.",
      coverageRegions: Object.freeze(["north-america"]),
      sources: Object.freeze([{ label: "Metropolitan Museum — North America, 1000 B.C.–1 A.D.", type: "academic-secondary", reference: "Heilbrunn Timeline, Hopewell cultures 200 B.C.–500 A.D.", url: "https://82nd-and-fifth.metmuseum.org/toah/ht/04/na.html" }])
    }),
    Object.freeze({
      id: "culture-maya-late-preclassic-early-classic",
      type: "culture",
      name: "Maya area — Late Preclassic to Early Classic transition",
      time: Object.freeze({ startYear: -300, endYear: 300, precision: "range" }),
      epistemicClass: "archaeological-reconstruction",
      status: "reviewed",
      confidence: 0.9,
      confidenceRationale: "The Met dates Late Preclassic cultures in the northern and central Maya regions to roughly 300 BCE–250 CE and dynastic city-states in the central region from about 250 CE onward; this record explicitly marks a transition rather than a single political entity.",
      coverageRegions: Object.freeze(["central-america-caribbean"]),
      sources: Object.freeze([{ label: "Metropolitan Museum — Maya Area, 1–500 A.D.", type: "academic-secondary", reference: "Heilbrunn Timeline, Late Preclassic and dynastic city-state transition", url: "https://82nd-and-fifth.metmuseum.org/toah/ht/05/caa.html" }])
    }),
    Object.freeze({
      id: "culture-moche-early",
      type: "culture",
      name: "Moche cultural horizon — early phase",
      time: Object.freeze({ startYear: 100, endYear: 300, precision: "range" }),
      epistemicClass: "archaeological-reconstruction",
      status: "reviewed",
      confidence: 0.9,
      confidenceRationale: "The Met Central and Southern Andes chronology dates Moche cultures to about 100–800 CE and describes independent regional societies and urban centers on Peru's north coast; only the B4-overlapping early phase is represented here.",
      coverageRegions: Object.freeze(["south-america"]),
      sources: Object.freeze([{ label: "Metropolitan Museum — Central and Southern Andes, 1–500 A.D.", type: "academic-secondary", reference: "Heilbrunn Timeline, Moche cultures 100–800", url: "https://82nd-and-fifth.metmuseum.org/toah/ht/05/sac.html" }])
    }),
    Object.freeze({
      id: "migration-polynesian-eastern-pacific",
      type: "migration",
      name: "Polynesian settlement expansion into eastern Pacific archipelagos",
      time: Object.freeze({ startYear: -200, endYear: 1, precision: "range" }),
      epistemicClass: "scholarly-reconstruction",
      status: "reviewed",
      confidence: 0.8,
      confidenceRationale: "The Met Oceania chronology states that Polynesian voyagers began settling the Marquesas and northern Cook Islands between about 200 BCE and 1 CE; this is represented as a migration/network anchor rather than a culture polygon spanning open ocean.",
      coverageRegions: Object.freeze(["oceania-pacific"]),
      sources: Object.freeze([{ label: "Metropolitan Museum — Oceania, 1000 B.C.–1 A.D.", type: "academic-secondary", reference: "Heilbrunn Timeline, eastern Pacific settlement ca. 200 B.C.–1 A.D.", url: "https://82nd-and-fifth.metmuseum.org/toah/ht/04/oc.html" }])
    })
  ]);

  function all() { return [...records]; }
  function get(id) { return records.find(record => record.id === id) || null; }

  const api = Object.freeze({ records, all, get });
  root.AtlasHistoryClassical = api;
  if (typeof module === "object" && module.exports) module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
