"use strict";

/*
 * Deep-time cultural overlays for the Atlas God's-eye map.
 *
 * IMPORTANT: geometry is a deliberately simplified research envelope derived
 * from published site distributions. It is NOT a political border, ethnic
 * boundary, language boundary, or claim of territorial control. Source links
 * remain attached so later GIS refinement can replace each envelope without
 * changing the navigation contract.
 */
(function (root) {
  function project(lon, lat) {
    return [
      ((lon + 180) / 360) * 2048,
      ((90 - lat) / 180) * 1024
    ];
  }

  function polygon(points) {
    return points.map(point => project(point[0], point[1]));
  }

  const cultures = [
    {
      id: "culture-natufian",
      slug: "natufian",
      name: "Natufian cultural complex",
      startYear: -12500,
      endYear: -9500,
      dateLabel: "c. 14,500–11,500 BP",
      evidenceType: "archaeological",
      confidence: "high for site distribution; low for any hard boundary",
      mapMeaning: "Simplified envelope around the principal Levantine Natufian site distribution; not territory.",
      geometry: polygon([
        [33.8, 29.0], [35.0, 28.8], [36.4, 30.0], [37.2, 32.0],
        [37.4, 34.5], [36.2, 36.0], [34.8, 35.8], [34.2, 33.5]
      ]),
      summary: "Late Epipalaeolithic cultural complex of the Levant, represented here through archaeological distributions rather than political territory.",
      sources: [
        { label: "Bar-Yosef-derived Natufian site distribution (CC BY-SA map)", url: "https://commons.wikimedia.org/wiki/File:Natoufien.svg" },
        { label: "Belfer-Cohen & Goring-Morris — Natufian core-area discussion", url: "https://www.researchgate.net/figure/Map-of-the-distribution-of-Natufian-sites-in-the-southern-Levant-Core-area-modified_fig1_264352458" }
      ]
    },
    {
      id: "culture-catalhoyuk",
      slug: "catalhoyuk",
      name: "Çatalhöyük settlement complex",
      startYear: -7400,
      endYear: -5200,
      dateLabel: "c. 7400–5200 BCE",
      evidenceType: "archaeological",
      confidence: "high for site location and occupation sequence; geometry is intentionally local",
      mapMeaning: "Local site envelope around Çatalhöyük on the Konya plain; not a regional culture boundary.",
      geometry: polygon([
        [31.8, 37.2], [33.1, 37.2], [33.1, 38.1], [31.8, 38.1]
      ]),
      summary: "Long-lived Neolithic and Chalcolithic settlement complex in central Anatolia. The Atlas treats it as a site-based archaeological layer, not as a territorial polity.",
      sources: [
        { label: "UNESCO World Heritage Centre — Neolithic Site of Çatalhöyük", url: "https://whc.unesco.org/en/list/1405" }
      ]
    },
    {
      id: "culture-lbk",
      slug: "lbk",
      name: "Linear Pottery culture (LBK)",
      startYear: -5550,
      endYear: -4950,
      dateLabel: "c. 5550–4950 BCE",
      evidenceType: "archaeological",
      confidence: "high for broad archaeological horizon; boundary is schematic",
      mapMeaning: "Simplified archaeological distribution envelope across temperate Europe; not ethnicity, language, or territory.",
      geometry: polygon([
        [5.0, 47.0], [8.0, 45.5], [13.0, 45.8], [18.5, 47.0],
        [23.5, 49.0], [24.0, 52.0], [18.0, 53.5], [11.0, 53.2], [6.0, 51.0]
      ]),
      summary: "Early farming archaeological horizon identified especially through longhouse settlements and characteristic pottery across much of temperate Europe.",
      sources: [
        { label: "Household integration in Neolithic villages — LBK chronology and spread", url: "https://www.sciencedirect.com/science/article/pii/S0278416515000811" }
      ]
    },
    {
      id: "culture-cucuteni-trypillia",
      slug: "cucuteni-trypillia",
      name: "Cucuteni–Trypillia complex",
      startYear: -4800,
      endYear: -2950,
      dateLabel: "c. 4800–2950 BCE",
      evidenceType: "archaeological",
      confidence: "high for broad cultural complex; phase boundaries and outer geometry remain approximate",
      mapMeaning: "Simplified distribution envelope across parts of modern Romania, Moldova and Ukraine; not political territory.",
      geometry: polygon([
        [23.0, 44.5], [27.0, 44.2], [31.0, 45.3], [34.0, 47.0],
        [33.5, 50.5], [29.5, 51.0], [25.0, 49.5], [22.5, 47.0]
      ]),
      summary: "Neolithic–Chalcolithic cultural complex known for painted ceramics and, in some phases, very large aggregated settlements or megasites.",
      sources: [
        { label: "Life and death in Trypillia times — phase chronology and megasites", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11633957/" },
        { label: "Scientific Reports — Trypillian population and megasite context", url: "https://www.nature.com/articles/s41598-022-11117-8" }
      ]
    },
    {
      id: "culture-yamnaya",
      slug: "yamnaya",
      name: "Yamnaya horizon",
      startYear: -3300,
      endYear: -2600,
      dateLabel: "c. 3300–2600 BCE",
      evidenceType: "archaeological",
      confidence: "high for Pontic–Caspian horizon; boundary is schematic",
      mapMeaning: "Simplified Pontic–Caspian distribution envelope; not a state border and not a language boundary.",
      geometry: polygon([
        [22.0, 44.0], [28.0, 43.5], [34.0, 45.0], [42.0, 46.0],
        [51.0, 47.0], [57.0, 49.5], [54.0, 52.5], [45.0, 53.0],
        [36.0, 52.0], [29.0, 50.5], [24.0, 48.0]
      ]),
      summary: "Early Bronze Age archaeological horizon centred on the Pontic–Caspian steppe. The Atlas keeps later migrations and linguistic inference as separate evidence layers.",
      sources: [
        { label: "Nature — Dairying enabled Early Bronze Age Yamnaya steppe expansions", url: "https://www.nature.com/articles/s41586-021-03798-4" },
        { label: "Maptism — Yamnaya Horizon research map", url: "https://maptism.org/maps/yamnaya-horizon/" }
      ]
    },
    {
      id: "culture-corded-ware",
      slug: "corded-ware",
      name: "Corded Ware horizon",
      startYear: -2800,
      endYear: -2200,
      dateLabel: "c. 2800–2200 BCE",
      evidenceType: "archaeological",
      confidence: "high for broad material/burial horizon; regional boundaries are schematic",
      mapMeaning: "Broad evidence envelope across central, northern and eastern Europe; not a single polity, ethnicity, or language boundary.",
      geometry: polygon([
        [4.0, 47.0], [10.0, 46.0], [18.0, 47.0], [27.0, 50.0],
        [35.0, 54.0], [31.0, 59.0], [22.0, 61.0], [13.0, 59.0], [6.0, 54.0]
      ]),
      summary: "Widespread Late Neolithic–Early Bronze Age archaeological horizon defined by recurring material and burial traits with substantial regional variation.",
      sources: [
        { label: "PLOS ONE — Corded Ware archaeological definition and c. 2800–2200 BCE burial range", url: "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0155083" }
      ]
    }
  ];

  function activeAt(year) {
    return cultures.filter(culture => year >= culture.startYear && year <= culture.endYear);
  }

  function get(idOrSlug) {
    return cultures.find(culture => culture.id === idOrSlug || culture.slug === idOrSlug) || null;
  }

  root.AtlasCultureData = Object.freeze({ cultures, activeAt, get });
})(typeof window !== "undefined" ? window : globalThis);
