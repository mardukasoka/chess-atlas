"use strict";

(function (root) {
  const records = Object.freeze([
    Object.freeze({
      id: "polity-seleucid-empire",
      type: "polity",
      name: "Seleucid Empire",
      time: Object.freeze({ startYear: -312, endYear: -64, precision: "range" }),
      epistemicClass: "documented",
      status: "reviewed",
      confidence: 0.96,
      confidenceRationale: "The Met describes Seleucus as ruler of Alexander's eastern provinces from 312 BCE and dates the Seleucid imperial sequence to 323–64 BCE; this record uses the dynastic foundation date for continuity purposes.",
      coverageRegions: Object.freeze(["middle-east-north-africa", "central-asia-steppe"]),
      sources: Object.freeze([{ label: "Metropolitan Museum — The Seleucid Empire (323–64 B.C.)", type: "academic-secondary", reference: "Seleucus I and successor-state chronology", url: "https://www.metmuseum.org/pt/essays/the-seleucid-empire-323-64-b-c" }])
    }),
    Object.freeze({
      id: "polity-ptolemaic-egypt",
      type: "polity",
      name: "Ptolemaic Kingdom of Egypt",
      time: Object.freeze({ startYear: -305, endYear: -30, precision: "range" }),
      epistemicClass: "documented",
      status: "reviewed",
      confidence: 0.97,
      confidenceRationale: "The British Museum dates the Ptolemaic period to 332–30 BCE and identifies Ptolemy I and his descendants as rulers after Alexander; 305 BCE is used here for Ptolemy's royal dynastic phase.",
      coverageRegions: Object.freeze(["middle-east-north-africa"]),
      sources: Object.freeze([{ label: "British Museum — Timeline of ancient Egypt", type: "academic-secondary", reference: "Ptolemaic period 332–30 BC", url: "https://www.britishmuseum.org/learn/schools/ages-7-11/ancient-egypt/timeline-ancient-egypt" }])
    }),
    Object.freeze({
      id: "polity-qin-dynasty",
      type: "polity",
      name: "Qin dynasty",
      time: Object.freeze({ startYear: -221, endYear: -206, precision: "range" }),
      epistemicClass: "documented",
      status: "reviewed",
      confidence: 0.99,
      confidenceRationale: "The Met chronology explicitly dates the Qin dynasty to 221–206 BCE.",
      coverageRegions: Object.freeze(["east-asia"]),
      sources: Object.freeze([{ label: "Metropolitan Museum — China, 1000 B.C.–1 A.D.", type: "academic-secondary", reference: "Qin dynasty 221–206 B.C.", url: "https://82nd-and-fifth.metmuseum.org/toah/ht/04/eac.html" }])
    }),
    Object.freeze({
      id: "polity-western-han",
      type: "polity",
      name: "Western Han dynasty",
      time: Object.freeze({ startYear: -206, endYear: 9, precision: "range" }),
      epistemicClass: "documented",
      status: "reviewed",
      confidence: 0.99,
      confidenceRationale: "The Met chronology explicitly dates Western Han to 206 BCE–9 CE.",
      coverageRegions: Object.freeze(["east-asia"]),
      sources: Object.freeze([{ label: "Metropolitan Museum — China, 1–500 A.D.", type: "academic-secondary", reference: "Western Han 206 B.C.–9 A.D.", url: "https://82nd-and-fifth.metmuseum.org/toah/ht/05/eac.html" }])
    }),
    Object.freeze({
      id: "polity-wang-mang-interregnum",
      type: "polity",
      name: "Wang Mang interregnum / Xin dynasty",
      time: Object.freeze({ startYear: 9, endYear: 25, precision: "range" }),
      epistemicClass: "documented",
      status: "reviewed",
      confidence: 0.98,
      confidenceRationale: "The Met chronology explicitly separates Wang Mang's interregnum, 9–25 CE, from Western and Eastern Han.",
      coverageRegions: Object.freeze(["east-asia"]),
      sources: Object.freeze([{ label: "Metropolitan Museum — China, 1–500 A.D.", type: "academic-secondary", reference: "Wang Mang interregnum 9–25 A.D.", url: "https://82nd-and-fifth.metmuseum.org/toah/ht/05/eac.html" }])
    }),
    Object.freeze({
      id: "polity-eastern-han",
      type: "polity",
      name: "Eastern Han dynasty",
      time: Object.freeze({ startYear: 25, endYear: 220, precision: "range" }),
      epistemicClass: "documented",
      status: "reviewed",
      confidence: 0.99,
      confidenceRationale: "The Met chronology explicitly dates Eastern Han to 25–220 CE.",
      coverageRegions: Object.freeze(["east-asia"]),
      sources: Object.freeze([{ label: "Metropolitan Museum — China, 1–500 A.D.", type: "academic-secondary", reference: "Eastern Han 25–220 A.D.", url: "https://82nd-and-fifth.metmuseum.org/toah/ht/05/eac.html" }])
    }),
    Object.freeze({
      id: "polity-sasanian-empire-b4",
      type: "polity",
      name: "Sasanian Empire — B4 initial phase",
      time: Object.freeze({ startYear: 224, endYear: 300, precision: "range" }),
      epistemicClass: "documented",
      status: "reviewed",
      confidence: 0.98,
      confidenceRationale: "The Met dates Sasanian rule from 224 CE; this record stops at the B4 boundary of 300 CE.",
      coverageRegions: Object.freeze(["middle-east-north-africa", "central-asia-steppe"]),
      sources: Object.freeze([{ label: "Metropolitan Museum — Iran, 1–500 A.D.", type: "academic-secondary", reference: "Sasanian empire 224–651 A.D.", url: "https://82nd-and-fifth.metmuseum.org/toah/ht/05/wai.html" }])
    })
  ]);

  function all() { return [...records]; }
  function get(id) { return records.find(record => record.id === id) || null; }
  const api = Object.freeze({ records, all, get });
  root.AtlasHistoryClassicalContinuity = api;
  if (typeof module === "object" && module.exports) module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
