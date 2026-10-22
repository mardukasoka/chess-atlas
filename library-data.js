"use strict";

/*
 * Historical knowledge-centre evidence model.
 *
 * This is deliberately separate from culture-data.js: a library/archive is a
 * site/institutional evidence node, not a cultural territory. The initial six
 * records are a conservative implementation seed distilled from the supplied
 * reconstruction dossier. Claims that still require source-by-source audit
 * remain UNKNOWN / qualified rather than being promoted to fact.
 */
(function (root) {
  const CONFIDENCE = Object.freeze(["very_high", "high", "moderate", "low", "very_low"]);
  const TRANSMISSION = Object.freeze({
    DIRECT: "DIRECT TRANSMISSION",
    INDIRECT: "PROBABLE/INDIRECT TRANSMISSION",
    TRADITION: "SHARED INTELLECTUAL TRADITION",
    SIMILARITY: "CHRONOLOGICAL/STRUCTURAL SIMILARITY ONLY",
    UNKNOWN: "UNKNOWN"
  });

  const sites = [
    {
      id: "ugarit_ras_shamra", name: "Ugarit / Ras Shamra", region: "Syrian coast north of Latakia",
      startYear: -2000, endYear: -1180, overallConfidence: "high",
      institution: ["capital", "palace archives", "religious archives", "residential archives"],
      safe: ["multiple archival contexts", "multilingual tablets", "palace and religious sectors"],
      qualified: ["exact paths", "specific room function", "object placement"],
      prohibited: ["single Great Library", "invented shelves", "all tablets in one room"],
      unknowns: ["ancient shelving", "furniture", "universal catalogue", "room-by-room subject order"]
    },
    {
      id: "ashurbanipal_nineveh", name: "Library of Ashurbanipal / Nineveh", region: "Nineveh, Kuyunjik mound, Iraq",
      startYear: -668, endYear: -612, overallConfidence: "high",
      institution: ["royal scholarly collection", "palace archives", "administrative archives"],
      safe: ["two palace complexes", "excavation room labels", "K-numbered fragments", "colophons"],
      qualified: ["destruction-floor placement", "whole-tablet totals", "original room allocation"],
      prohibited: ["single library building", "invented shelves", "perfect subject order"],
      unknowns: ["shelving", "pigeonholes", "room-by-room subject arrangement"]
    },
    {
      id: "alexandria_ancient_library", name: "Ancient Library of Alexandria", region: "Alexandria, Egypt",
      startYear: -300, endYear: null, overallConfidence: "low",
      institution: ["royal scholarly institution", "bibliographic collection"],
      safe: ["abstract scholarly institution", "papyrus medium", "Pinakes categories", "source-critical dialogue"],
      qualified: ["generic halls", "royal-quarter setting", "Serapeum books"],
      prohibited: ["exact plan", "exact coordinate", "single-fire destruction", "known shelves", "Serapeum equals Great Library"],
      unknowns: ["collection total", "shelf order", "rooms", "furniture", "complete language distribution"]
    },
    {
      id: "nalanda_mahavihara", name: "Nalanda Mahavihara", region: "Bihar, India",
      startYear: -300, endYear: 1300, overallConfidence: "moderate",
      institution: ["Buddhist Mahavihara", "monastic institution", "higher-learning centre"],
      safe: ["viharas", "temples", "courts", "monastic instruction and debate"],
      qualified: ["generic manuscript use", "repository interpretation", "destruction episode"],
      prohibited: ["legendary manuscript totals", "specific excavated library without proof", "modern holdings as ancient provenance"],
      unknowns: ["manuscript totals", "library rooms", "shelving", "cataloguing system"]
    },
    {
      id: "saint_catherines_sinai", name: "Saint Catherine's Monastery", region: "South Sinai Governorate, Egypt",
      startYear: 500, endYear: null, overallConfidence: "very_high",
      institution: ["Christian monastery", "manuscript library", "icon collection"],
      safe: ["standing enclosure", "continuous monastery", "catalogued codices", "modern digitization"],
      qualified: ["historical library room", "codex location by century", "sixth-century interiors"],
      prohibited: ["unchanged library room across fifteen centuries", "invented shelving", "complete modern Codex Sinaiticus"],
      unknowns: ["historic room-by-room arrangement", "ancient furniture", "language-specific shelving"]
    },
    {
      id: "bayt_al_hikma_baghdad", name: "Bayt al-Hikma", region: "Baghdad, Iraq; precise site unknown",
      startYear: 750, endYear: 1258, overallConfidence: "very_low",
      institution: ["disputed royal library", "possible administrative bureau"],
      safe: ["historiographical debate", "Baghdad context", "royal collection hypothesis"],
      qualified: ["generic repository room", "unnamed scribes", "1258 endpoint"],
      prohibited: ["exact building", "universal academy", "known departments", "observatory attachment", "Tigris-ink scene"],
      unknowns: ["catalogue", "collection size", "departments", "staff", "public access", "furniture"]
    }
  ];

  const links = [
    ["ugarit_ras_shamra","ashurbanipal_nineveh",TRANSMISSION.TRADITION],
    ["ugarit_ras_shamra","alexandria_ancient_library",TRANSMISSION.UNKNOWN],
    ["ugarit_ras_shamra","nalanda_mahavihara",TRANSMISSION.UNKNOWN],
    ["ugarit_ras_shamra","saint_catherines_sinai",TRANSMISSION.SIMILARITY],
    ["ugarit_ras_shamra","bayt_al_hikma_baghdad",TRANSMISSION.UNKNOWN],
    ["ashurbanipal_nineveh","alexandria_ancient_library",TRANSMISSION.TRADITION],
    ["ashurbanipal_nineveh","nalanda_mahavihara",TRANSMISSION.SIMILARITY],
    ["ashurbanipal_nineveh","saint_catherines_sinai",TRANSMISSION.SIMILARITY],
    ["ashurbanipal_nineveh","bayt_al_hikma_baghdad",TRANSMISSION.TRADITION],
    ["alexandria_ancient_library","nalanda_mahavihara",TRANSMISSION.UNKNOWN],
    ["alexandria_ancient_library","saint_catherines_sinai",TRANSMISSION.INDIRECT],
    ["alexandria_ancient_library","bayt_al_hikma_baghdad",TRANSMISSION.INDIRECT],
    ["nalanda_mahavihara","saint_catherines_sinai",TRANSMISSION.SIMILARITY],
    ["nalanda_mahavihara","bayt_al_hikma_baghdad",TRANSMISSION.UNKNOWN],
    ["saint_catherines_sinai","bayt_al_hikma_baghdad",TRANSMISSION.TRADITION]
  ].map(([source,target,classification]) => ({source,target,classification}));

  function get(id) { return sites.find(site => site.id === id) || null; }
  function activeAt(year) {
    return sites.filter(site => year >= site.startYear && (site.endYear === null || year <= site.endYear));
  }
  function linkBetween(a,b) {
    return links.find(link => (link.source === a && link.target === b) || (link.source === b && link.target === a)) || null;
  }

  root.AtlasLibraryData = Object.freeze({ CONFIDENCE, TRANSMISSION, sites, links, get, activeAt, linkBetween });
})(typeof window !== "undefined" ? window : globalThis);
