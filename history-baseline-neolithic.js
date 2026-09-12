"use strict";

/*
 * First evidence-backed Atlas history baseline batch.
 *
 * These are globally distributed archaeological anchors, not claims that the
 * surrounding region formed a single culture or polity. Records remain
 * reviewed rather than canonical until the baseline review pass reconciles
 * chronology and source detail across independent references.
 */
(function (root) {
  const records = Object.freeze([
    Object.freeze({
      id: "place-gobekli-tepe-ppn",
      type: "place",
      name: "Göbekli Tepe — Pre-Pottery Neolithic monumental phase",
      time: Object.freeze({ startYear: -9600, endYear: -8200, precision: "range" }),
      epistemicClass: "archaeological",
      status: "reviewed",
      confidence: 0.95,
      confidenceRationale: "UNESCO directly dates the represented monumental round-oval and rectangular structures to 9600–8200 BCE.",
      coverageRegions: Object.freeze(["middle-east-north-africa"]),
      summary: "Monumental communal structures built by hunter-gatherers in Upper Mesopotamia during the Pre-Pottery Neolithic.",
      sources: Object.freeze([{ label: "UNESCO World Heritage Centre — Göbekli Tepe", type: "institutional-dataset", reference: "World Heritage List 1572", url: "https://whc.unesco.org/en/list/1572" }])
    }),
    Object.freeze({
      id: "place-catalhoyuk-neolithic-chalcolithic",
      type: "place",
      name: "Çatalhöyük — Neolithic and early Chalcolithic settlement sequence",
      time: Object.freeze({ startYear: -7400, endYear: -5200, precision: "range" }),
      epistemicClass: "archaeological",
      status: "reviewed",
      confidence: 0.95,
      confidenceRationale: "UNESCO reports Neolithic occupation of the East Mound from 7400–6200 BCE and Chalcolithic occupation of the West Mound from 6200–5200 BCE.",
      coverageRegions: Object.freeze(["middle-east-north-africa"]),
      summary: "Long-lived settlement sequence important for understanding sedentism, agriculture and changing social organization in Anatolia.",
      sources: Object.freeze([{ label: "UNESCO World Heritage Centre — Neolithic Site of Çatalhöyük", type: "institutional-dataset", reference: "World Heritage List 1405", url: "https://whc.unesco.org/en/list/1405" }])
    }),
    Object.freeze({
      id: "place-alpine-pile-dwellings-neolithic",
      type: "place",
      name: "Prehistoric Pile Dwellings around the Alps",
      time: Object.freeze({ startYear: -5000, endYear: -500, precision: "range" }),
      epistemicClass: "archaeological",
      status: "reviewed",
      confidence: 0.95,
      confidenceRationale: "UNESCO dates the serial settlement evidence from about 5000 to 500 BCE and identifies it as a major source for early agrarian societies in Alpine Europe.",
      coverageRegions: Object.freeze(["europe"]),
      summary: "A serial archaeological record of lake- and wetland-edge settlements spanning the Neolithic and Bronze Age in Alpine Europe.",
      sources: Object.freeze([{ label: "UNESCO World Heritage Centre — Prehistoric Pile Dwellings around the Alps", type: "institutional-dataset", reference: "World Heritage List 1363", url: "https://whc.unesco.org/en/list/1363" }])
    }),
    Object.freeze({
      id: "culture-mongolian-altai-early-rock-art",
      type: "culture",
      name: "Mongolian Altai early rock-art horizon",
      time: Object.freeze({ startYear: -11000, endYear: -6000, precision: "range" }),
      epistemicClass: "archaeological",
      status: "reviewed",
      confidence: 0.85,
      confidenceRationale: "UNESCO describes the earliest petroglyph images as dating to 11,000–6,000 BCE and reflecting hunter lifeways in a partly forested Altai environment.",
      coverageRegions: Object.freeze(["central-asia-steppe"]),
      summary: "Early rock-art evidence preceding later transitions toward herding and horse-dependent nomadism in the Mongolian Altai.",
      sources: Object.freeze([{ label: "UNESCO World Heritage Centre — Petroglyphic Complexes of the Mongolian Altai", type: "institutional-dataset", reference: "World Heritage property summary, 35 COM", url: "https://whc.unesco.org/en/newproperties/?inscribed=0&meeting=35COM&mode=list" }])
    }),
    Object.freeze({
      id: "place-mehrgarh-neolithic",
      type: "place",
      name: "Mehrgarh — Neolithic to early Chalcolithic sequence",
      time: Object.freeze({ startYear: -6500, endYear: -3500, precision: "range" }),
      epistemicClass: "archaeological",
      status: "reviewed",
      confidence: 0.9,
      confidenceRationale: "UNESCO's tentative-list description gives an excavator chronology from Aceramic Neolithic c.6500 BCE through Early Chalcolithic c.4500–3500 BCE.",
      coverageRegions: Object.freeze(["south-asia"]),
      summary: "Settlement sequence documenting changing subsistence, craft and storage practices antecedent to the urban Indus tradition.",
      sources: Object.freeze([{ label: "UNESCO World Heritage Centre — Archaeological Site of Mehrgarh", type: "institutional-dataset", reference: "Tentative List 1876", url: "https://whc.unesco.org/en/tentativelists/1876" }])
    }),
    Object.freeze({
      id: "culture-jomon-northern-japan",
      type: "culture",
      name: "Jomon sedentary hunter-fisher-gatherer sequence — Northern Japan",
      time: Object.freeze({ startYear: -13000, endYear: -400, precision: "range" }),
      epistemicClass: "archaeological",
      status: "reviewed",
      confidence: 0.95,
      confidenceRationale: "UNESCO identifies the serial property as evidence for a sedentary hunter-fisher-gatherer society developing from about 13,000 BCE to 400 BCE.",
      coverageRegions: Object.freeze(["east-asia"]),
      summary: "Long-duration pre-agricultural sedentary lifeways represented by settlements, burials, ritual places, stone circles and earthworks.",
      sources: Object.freeze([{ label: "UNESCO World Heritage Centre — Jomon Prehistoric Sites in Northern Japan", type: "institutional-dataset", reference: "World Heritage List 1632", url: "https://whc.unesco.org/en/list/1632" }])
    }),
    Object.freeze({
      id: "place-trang-an-prehistoric-sequence",
      type: "place",
      name: "Trang An prehistoric occupation sequence",
      time: Object.freeze({ startYear: -30000, endYear: -3500, precision: "range" }),
      epistemicClass: "archaeological-reconstruction",
      status: "candidate",
      confidence: 0.7,
      confidenceRationale: "UNESCO documents more than 30,000 years of occupation continuing through the Neolithic and Bronze Ages, but does not give a precise Neolithic start/end range on the summary page; the end bound here is deliberately provisional for the first baseline window.",
      coverageRegions: Object.freeze(["southeast-asia"]),
      summary: "Cave sequences in northern Viet Nam documenting long-term adaptation to major environmental and sea-level change.",
      sources: Object.freeze([{ label: "UNESCO World Heritage Centre — Trang An Landscape Complex", type: "institutional-dataset", reference: "World Heritage List 1438", url: "https://whc.unesco.org/en/list/1438" }])
    }),
    Object.freeze({
      id: "place-shum-laka-holocene-burials",
      type: "place",
      name: "Shum Laka — early Holocene burial evidence",
      time: Object.freeze({ year: -6050, precision: "century" }),
      epistemicClass: "archaeological",
      status: "candidate",
      confidence: 0.75,
      confidenceRationale: "A Nature study reports two sampled children buried approximately 8,000 years ago; astronomical-year placement is approximate and should be replaced by calibrated archaeological chronology during review.",
      coverageRegions: Object.freeze(["sub-saharan-africa"]),
      summary: "Archaeological and ancient-DNA evidence from western Cameroon relevant to long-term population history before food production became dominant.",
      sources: Object.freeze([{ label: "Lipson et al. — Ancient West African foragers in the context of African population history", type: "archaeological-publication", reference: "Nature 577, 665–670 (2020), doi:10.1038/s41586-020-1929-1", url: "https://www.nature.com/articles/s41586-020-1929-1" }])
    }),
    Object.freeze({
      id: "place-head-smashed-in-early-use",
      type: "place",
      name: "Head-Smashed-In Buffalo Jump — early use horizon",
      time: Object.freeze({ year: -3850, precision: "century" }),
      epistemicClass: "archaeological-reconstruction",
      status: "candidate",
      confidence: 0.75,
      confidenceRationale: "UNESCO describes use from approximately 5,800 years BP; conversion to an astronomical-year anchor is approximate pending direct calibrated chronology.",
      coverageRegions: Object.freeze(["north-america"]),
      summary: "Long-lived communal bison-hunting landscape on the North American Plains.",
      sources: Object.freeze([{ label: "UNESCO World Heritage Centre — Head-Smashed-In Buffalo Jump", type: "institutional-dataset", reference: "World Heritage List 158", url: "https://whc.unesco.org/en/list/158" }])
    }),
    Object.freeze({
      id: "technology-tehuacan-plant-domestication",
      type: "technology",
      name: "Early plant domestication evidence — Tehuacán-Cuicatlán Valley",
      time: Object.freeze({ startYear: -9500, endYear: -7000, precision: "range" }),
      epistemicClass: "archaeological-reconstruction",
      status: "reviewed",
      confidence: 0.85,
      confidenceRationale: "UNESCO nomination documentation reports cultivated plant remains approximately 9500–7000 BCE and describes the valley as preserving an exceptionally long sequence of plant domestication.",
      coverageRegions: Object.freeze(["central-america-caribbean"]),
      summary: "Early evidence for cultivation/domestication processes in the Mesoamerican region; this record does not imply later intensive agriculture already existed.",
      sources: Object.freeze([{ label: "UNESCO — Tehuacán-Cuicatlán Valley plant domestication documentation", type: "institutional-dataset", reference: "Nomination supporting document 165562", url: "https://whc.unesco.org/document/165562" }])
    }),
    Object.freeze({
      id: "place-monte-verde-ii",
      type: "place",
      name: "Monte Verde archaeological occupation",
      time: Object.freeze({ year: -12850, precision: "century" }),
      epistemicClass: "archaeological-reconstruction",
      status: "candidate",
      confidence: 0.8,
      confidenceRationale: "UNESCO's tentative-list description reports occupation about 14,800 years ago based on calibrated radiocarbon dates; the astronomical-year representation is approximate and lies just before the current baseline completion window.",
      coverageRegions: Object.freeze(["south-america"]),
      summary: "Early human occupation in southern Chile with preserved structural, botanical, faunal and lithic remains.",
      sources: Object.freeze([{ label: "UNESCO World Heritage Centre — Monte Verde Archaeological Site", type: "institutional-dataset", reference: "Tentative List 1873", url: "https://whc.unesco.org/en/tentativelists/1873" }])
    }),
    Object.freeze({
      id: "technology-kuk-early-agriculture",
      type: "technology",
      name: "Kuk early agricultural development",
      time: Object.freeze({ startYear: -5050, endYear: -4450, precision: "range" }),
      epistemicClass: "archaeological-reconstruction",
      status: "candidate",
      confidence: 0.8,
      confidenceRationale: "UNESCO dates the transformation of plant exploitation to agriculture to roughly 7,000–6,400 years ago; astronomical-year conversion is approximate and should be replaced by calibrated phase dates during review.",
      coverageRegions: Object.freeze(["oceania-pacific"]),
      summary: "Evidence from the New Guinea Highlands for an independent agricultural trajectory based on vegetative propagation and later wetland drainage.",
      sources: Object.freeze([{ label: "UNESCO World Heritage Centre — Kuk Early Agricultural Site", type: "institutional-dataset", reference: "World Heritage List 887", url: "https://whc.unesco.org/en/list/887" }])
    })
  ]);

  function all() { return [...records]; }
  function get(id) { return records.find(record => record.id === id) || null; }

  root.AtlasHistoryNeolithic = Object.freeze({ records, all, get });
  if (typeof module === "object" && module.exports) module.exports = root.AtlasHistoryNeolithic;
})(typeof globalThis !== "undefined" ? globalThis : this);
