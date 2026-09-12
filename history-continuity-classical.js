"use strict";

const Continuity = require("./history-continuity.js");

const sources = Object.freeze({
  hellenistic: Object.freeze([{ label: "British Museum — Alexander's world / Hellenistic kingdoms", url: "https://www.britishmuseum.org/sites/default/files/2023-04/Luxury_and_power_large_print_guide.pdf" }]),
  qinHan: Object.freeze([{ label: "Metropolitan Museum — China, 1000 B.C.–1 A.D.", url: "https://82nd-and-fifth.metmuseum.org/toah/ht/04/eac.html" }, { label: "Metropolitan Museum — China, 1–500 A.D.", url: "https://82nd-and-fifth.metmuseum.org/toah/ht/05/eac.html" }]),
  iran: Object.freeze([{ label: "Metropolitan Museum — Iran, 1–500 A.D.", url: "https://82nd-and-fifth.metmuseum.org/toah/ht/05/wai.html" }]),
  india: Object.freeze([{ label: "Metropolitan Museum — Mauryan Empire", url: "https://www.metmuseum.org/es/essays/mauryan-empire-ca-323-185-b-c" }, { label: "Metropolitan Museum — South Asia, 1000 B.C.–1 A.D.", url: "https://82nd-and-fifth.metmuseum.org/toah/ht/04/ssa.html" }])
});

const relations = Object.freeze([
  Object.freeze({
    id: "continuity-alexander-successor-kingdoms",
    type: "split",
    from: Object.freeze(["polity-achaemenid-empire"]),
    to: Object.freeze(["polity-seleucid-empire", "polity-ptolemaic-egypt"]),
    year: -323,
    epistemicClass: "scholarly-reconstruction",
    confidence: 0.9,
    rationale: "Alexander's conquests displaced Achaemenid imperial rule; after his death, competing successors consolidated major Hellenistic kingdoms. This relation is a compressed continuity bridge and does not imply that all Achaemenid territory passed directly into only these two states.",
    sources: sources.hellenistic
  }),
  Object.freeze({
    id: "continuity-qin-western-han",
    type: "dynastic-transition",
    from: Object.freeze(["polity-qin-dynasty"]),
    to: Object.freeze(["polity-western-han"]),
    year: -206,
    epistemicClass: "documented",
    confidence: 0.99,
    rationale: "The Qin dynasty ends in 206 BCE and Western Han begins in 206 BCE in the Met chronology.",
    sources: sources.qinHan
  }),
  Object.freeze({
    id: "continuity-western-han-wang-mang",
    type: "dynastic-transition",
    from: Object.freeze(["polity-western-han"]),
    to: Object.freeze(["polity-wang-mang-interregnum"]),
    year: 9,
    epistemicClass: "documented",
    confidence: 0.99,
    rationale: "Western Han is interrupted in 9 CE by Wang Mang's regime.",
    sources: sources.qinHan
  }),
  Object.freeze({
    id: "continuity-wang-mang-eastern-han",
    type: "dynastic-transition",
    from: Object.freeze(["polity-wang-mang-interregnum"]),
    to: Object.freeze(["polity-eastern-han"]),
    year: 25,
    epistemicClass: "documented",
    confidence: 0.99,
    rationale: "The Met chronology marks Eastern Han from 25 CE after the Wang Mang interregnum.",
    sources: sources.qinHan
  }),
  Object.freeze({
    id: "continuity-parthian-sasanian",
    type: "dynastic-transition",
    from: Object.freeze(["polity-parthian-empire"]),
    to: Object.freeze(["polity-sasanian-empire-b4"]),
    year: 224,
    epistemicClass: "documented",
    confidence: 0.99,
    rationale: "The Met chronology dates the end of Parthian rule and beginning of Sasanian rule to 224 CE.",
    sources: sources.iran
  }),
  Object.freeze({
    id: "continuity-magadha-maurya",
    type: "political-reunification",
    from: Object.freeze(["polity-magadha-early"]),
    to: Object.freeze(["polity-mauryan-empire"]),
    year: -322,
    epistemicClass: "scholarly-reconstruction",
    confidence: 0.94,
    rationale: "Magadha is the political core from which Chandragupta Maurya established the Mauryan Empire in the late fourth century BCE.",
    sources: sources.india
  })
]);

function validateAll() {
  return relations.map(relation => ({ relation, validation: Continuity.validateContinuityRelation(relation) }));
}

module.exports = Object.freeze({ relations, validateAll, sources });
