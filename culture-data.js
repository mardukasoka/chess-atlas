"use strict";

/*
 * Deep-time cultural overlays for the Atlas God's-eye map.
 *
 * IMPORTANT: geometry is a deliberately simplified research envelope derived
 * from published site distributions. It is NOT a political border or claim of
 * territorial control. Source links remain attached so later GIS refinement
 * can replace the envelope without changing the navigation contract.
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
        {
          label: "Bar-Yosef-derived Natufian site distribution (CC BY-SA map)",
          url: "https://commons.wikimedia.org/wiki/File:Natoufien.svg"
        },
        {
          label: "Belfer-Cohen & Goring-Morris — Natufian core-area discussion",
          url: "https://www.researchgate.net/figure/Map-of-the-distribution-of-Natufian-sites-in-the-southern-Levant-Core-area-modified_fig1_264352458"
        }
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
        {
          label: "Nature — Dairying enabled Early Bronze Age Yamnaya steppe expansions",
          url: "https://www.nature.com/articles/s41586-021-03798-4"
        },
        {
          label: "Maptism — Yamnaya Horizon research map",
          url: "https://maptism.org/maps/yamnaya-horizon/"
        }
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
