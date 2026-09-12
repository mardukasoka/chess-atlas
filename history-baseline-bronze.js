"use strict";

/*
 * First-pass Early States / Bronze Age world spine (c. 3500–1200 BCE).
 * Records are archaeological/historical anchors, not claims of equivalent
 * political complexity across regions. Reviewed status means source-checked
 * for this pass; canonical promotion remains a separate continuity review.
 */
(function (root) {
  const records = Object.freeze([
    Object.freeze({
      id: "culture-mycenaean-greece",
      type: "culture",
      name: "Mycenaean civilization — Mycenae and Tiryns horizon",
      time: Object.freeze({ startYear: -1600, endYear: -1100, precision: "range" }),
      epistemicClass: "archaeological",
      status: "reviewed",
      confidence: 0.95,
      confidenceRationale: "UNESCO dates the Mycenaean civilization represented at Mycenae and Tiryns to 1600–1100 BCE, with dominance in the eastern Mediterranean especially from the 15th to 12th centuries BCE.",
      coverageRegions: Object.freeze(["europe"]),
      sources: Object.freeze([{ label: "UNESCO — Archaeological Sites of Mycenae and Tiryns", type: "institutional-dataset", reference: "World Heritage List 941", url: "https://whc.unesco.org/en/list/941" }])
    }),
    Object.freeze({
      id: "polity-egypt-new-kingdom",
      type: "polity",
      name: "Egypt — New Kingdom",
      time: Object.freeze({ startYear: -1550, endYear: -1070, precision: "range" }),
      epistemicClass: "documented",
      status: "reviewed",
      confidence: 0.95,
      confidenceRationale: "The Metropolitan Museum's Heilbrunn Timeline gives the New Kingdom chronology as ca. 1550–1070 BCE and documents its political and monumental context.",
      coverageRegions: Object.freeze(["middle-east-north-africa"]),
      sources: Object.freeze([{ label: "Metropolitan Museum of Art — Egypt in the New Kingdom", type: "academic-secondary", reference: "Heilbrunn Timeline of Art History, ca. 1550–1070 BCE", url: "https://www.metmuseum.org/fr/essays/egypt-in-the-new-kingdom-ca-1550-1070-b-c" }])
    }),
    Object.freeze({
      id: "polity-kerma",
      type: "polity",
      name: "Kingdom / urban society of Kerma",
      time: Object.freeze({ startYear: -2500, endYear: -1500, precision: "range" }),
      epistemicClass: "archaeological-reconstruction",
      status: "reviewed",
      confidence: 0.9,
      confidenceRationale: "The British Museum dates the flourishing of Kerma's culture and urban society to about 2500–1500 BCE and describes a powerful kingdom centred at Kerma by around 2500 BCE.",
      coverageRegions: Object.freeze(["sub-saharan-africa"]),
      sources: Object.freeze([{ label: "British Museum — Sudan, Egypt and Nubia", type: "institutional-dataset", reference: "Room 65 gallery chronology", url: "https://www.britishmuseum.org/collection/galleries/sudan-egypt-and-nubia" }])
    }),
    Object.freeze({
      id: "place-sarazm-proto-urban",
      type: "place",
      name: "Sarazm proto-urban settlement",
      time: Object.freeze({ startYear: -4000, endYear: -2000, precision: "range" }),
      epistemicClass: "archaeological-reconstruction",
      status: "reviewed",
      confidence: 0.85,
      confidenceRationale: "UNESCO describes settlement development at Sarazm from the 4th millennium to the late 3rd millennium BCE and emphasizes inter-regional trade across Central Asia.",
      coverageRegions: Object.freeze(["central-asia-steppe"]),
      sources: Object.freeze([{ label: "UNESCO — Proto-urban Site of Sarazm", type: "institutional-dataset", reference: "World Heritage List 1141", url: "https://whc.unesco.org/en/list/1141" }])
    }),
    Object.freeze({
      id: "place-mohenjo-daro-indus",
      type: "place",
      name: "Mohenjo-daro — Indus civilization metropolis",
      time: Object.freeze({ startYear: -2500, endYear: -1500, precision: "range" }),
      epistemicClass: "archaeological",
      status: "reviewed",
      confidence: 0.95,
      confidenceRationale: "UNESCO identifies Mohenjo-daro as a major Indus civilization metropolis flourishing between 2500 and 1500 BCE and as an early planned urban settlement.",
      coverageRegions: Object.freeze(["south-asia"]),
      sources: Object.freeze([{ label: "UNESCO — Archaeological Ruins at Moenjodaro", type: "institutional-dataset", reference: "World Heritage List 138", url: "https://whc.unesco.org/en/list/138" }])
    }),
    Object.freeze({
      id: "polity-shang-dynasty",
      type: "polity",
      name: "Shang dynasty",
      time: Object.freeze({ startYear: -1600, endYear: -1046, precision: "range" }),
      epistemicClass: "archaeological-reconstruction",
      status: "reviewed",
      confidence: 0.9,
      confidenceRationale: "The Metropolitan Museum's Heilbrunn Timeline gives 1600–1046 BCE and describes Shang as the earliest archaeologically recorded dynasty in Chinese history.",
      coverageRegions: Object.freeze(["east-asia"]),
      sources: Object.freeze([{ label: "Metropolitan Museum of Art — Shang and Zhou Dynasties: The Bronze Age of China", type: "academic-secondary", reference: "Heilbrunn Timeline of Art History", url: "https://www.metmuseum.org/zh/essays/shang-and-zhou-dynasties-the-bronze-age-of-china" }])
    }),
    Object.freeze({
      id: "place-ban-chiang-early-sequence",
      type: "place",
      name: "Ban Chiang early agrarian and bronze-working sequence",
      time: Object.freeze({ startYear: -1495, endYear: -900, precision: "range" }),
      epistemicClass: "archaeological",
      status: "reviewed",
      confidence: 0.9,
      confidenceRationale: "UNESCO's current chronology dates continuous occupation from 1495 BCE to about 900 BCE and identifies early settled agriculture and bronze tool-making.",
      coverageRegions: Object.freeze(["southeast-asia"]),
      sources: Object.freeze([{ label: "UNESCO — Ban Chiang Archaeological Site", type: "institutional-dataset", reference: "World Heritage List 575", url: "https://whc.unesco.org/en/list/575" }])
    }),
    Object.freeze({
      id: "culture-poverty-point",
      type: "culture",
      name: "Poverty Point monumental earthwork tradition",
      time: Object.freeze({ startYear: -1700, endYear: -1100, precision: "range" }),
      epistemicClass: "archaeological-reconstruction",
      status: "reviewed",
      confidence: 0.85,
      confidenceRationale: "UNESCO nomination comparison material gives the major Poverty Point construction horizon as 1700–1100 BCE; the World Heritage property independently describes construction about 3700–3100 BP.",
      coverageRegions: Object.freeze(["north-america"]),
      sources: Object.freeze([
        { label: "UNESCO — Monumental Earthworks of Poverty Point", type: "institutional-dataset", reference: "World Heritage List 1435", url: "https://whc.unesco.org/en/list/1435" },
        { label: "UNESCO — Hopewell Ceremonial Earthworks nomination comparison", type: "institutional-dataset", reference: "Document 192681, Poverty Point comparison", url: "https://whc.unesco.org/document/192681" }
      ])
    }),
    Object.freeze({
      id: "culture-olmec-early-state-horizon",
      type: "culture",
      name: "Olmec early state horizon",
      time: Object.freeze({ startYear: -1800, endYear: -400, precision: "range" }),
      epistemicClass: "scholarly-reconstruction",
      status: "candidate",
      confidence: 0.7,
      confidenceRationale: "A UNESCO nomination comparative analysis quotes an Olmec specialist dating the Gulf Coast tradition to 1800–400 BCE and describing San Lorenzo and La Venta as successive monumental capitals; this indirect source requires dedicated archaeological cross-checking before promotion.",
      coverageRegions: Object.freeze(["central-america-caribbean"]),
      sources: Object.freeze([{ label: "UNESCO nomination 1453 — comparative Olmec chronology", type: "candidate-import", reference: "Nomination PDF comparative analysis citing Cyphers", url: "https://whc.unesco.org/uploads/nominations/1453.pdf" }])
    }),
    Object.freeze({
      id: "place-caral-supe",
      type: "place",
      name: "Sacred City of Caral-Supe",
      time: Object.freeze({ startYear: -3000, endYear: -1800, precision: "range" }),
      epistemicClass: "archaeological",
      status: "reviewed",
      confidence: 0.95,
      confidenceRationale: "UNESCO reports radiocarbon analysis placing Caral's main development between 3000 and 1800 BCE in the Late Archaic Period.",
      coverageRegions: Object.freeze(["south-america"]),
      sources: Object.freeze([{ label: "UNESCO — Sacred City of Caral-Supe", type: "institutional-dataset", reference: "World Heritage List 1269", url: "https://whc.unesco.org/en/list/1269" }])
    }),
    Object.freeze({
      id: "culture-lapita",
      type: "culture",
      name: "Lapita cultural horizon",
      time: Object.freeze({ startYear: -1600, endYear: -500, precision: "range" }),
      epistemicClass: "archaeological-reconstruction",
      status: "reviewed",
      confidence: 0.9,
      confidenceRationale: "Australian National University archaeological synthesis dates Lapita from about 1600 BCE to roughly 500 BCE/around the start of the Common Era depending on region and describes its spread across Melanesia into Polynesia.",
      coverageRegions: Object.freeze(["oceania-pacific"]),
      sources: Object.freeze([{ label: "Matthew Spriggs — The Lapita Culture and Austronesian Prehistory in Oceania", type: "academic-secondary", reference: "ANU Press, Chapter 6", url: "https://press-files.anu.edu.au/downloads/press/p69411/html/ch06.html" }])
    })
  ]);

  function all() { return [...records]; }
  function get(id) { return records.find(record => record.id === id) || null; }

  root.AtlasHistoryBronze = Object.freeze({ records, all, get });
  if (typeof module === "object" && module.exports) module.exports = root.AtlasHistoryBronze;
})(typeof globalThis !== "undefined" ? globalThis : this);
