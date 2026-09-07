"use strict";

/*
 * Archaeological site points for the Atlas God's-eye map.
 *
 * A site point is not a city, polity, culture boundary, or claim of continuous
 * occupation. Dates describe the archaeological phase represented here; later
 * phases can be added as separate occupation records.
 */
(function (root) {
  const sites = Object.freeze([
    Object.freeze({
      id: "site-gobekli-tepe",
      slug: "gobekli-tepe",
      name: "Göbekli Tepe",
      region: "Şanlıurfa, Upper Mesopotamia",
      siteType: "monumental-and-settlement-archaeological-site",
      phase: Object.freeze({ startYear: -9600, endYear: -8200, label: "Pre-Pottery Neolithic monumental phase, c. 9600–8200 BCE" }),
      location: Object.freeze({ lat: 37.223, lon: 38.922, coordinateConfidence: "high-rounded-from-unesco-coordinate" }),
      chronologyNote: "UNESCO dates the monumental round-oval and rectangular megalithic structures represented here to 9600–8200 BCE.",
      network: "tas-tepeler-upper-mesopotamia",
      evidenceType: "archaeological",
      sources: Object.freeze([
        Object.freeze({ label: "UNESCO World Heritage Centre — Göbekli Tepe", url: "https://whc.unesco.org/en/list/1572" }),
        Object.freeze({ label: "UNESCO — Göbekli Tepe maps and geographical data", url: "https://whc.unesco.org/en/list/1572/maps/" })
      ])
    }),
    Object.freeze({
      id: "site-karahantepe",
      slug: "karahantepe",
      name: "Karahantepe",
      region: "Tek Tek Mountains, Şanlıurfa",
      siteType: "neolithic-settlement-and-communal-site",
      phase: Object.freeze({ startYear: -9500, endYear: -8000, label: "Early Neolithic; project description places the regional settlement expansion around the mid-10th millennium BCE" }),
      location: Object.freeze({ lat: 37.058, lon: 39.167, coordinateConfidence: "approximate-rounded-secondary-gazetteer" }),
      chronologyNote: "Taş Tepeler describes a three-phase settlement with monumental and communal architecture; the broad range here is deliberately approximate pending phase-specific publication data.",
      network: "tas-tepeler-upper-mesopotamia",
      evidenceType: "archaeological",
      sources: Object.freeze([
        Object.freeze({ label: "Taş Tepeler — Karahantepe", url: "https://tastepeler.org/en/yerlesmeler/karahantepe" })
      ])
    }),
    Object.freeze({
      id: "site-sefertepe",
      slug: "sefertepe",
      name: "Sefertepe",
      region: "Viranşehir Plain / Tek Tek Mountains margin, Şanlıurfa",
      siteType: "pre-pottery-neolithic-settlement",
      phase: Object.freeze({ startYear: -8800, endYear: -7000, label: "Pre-Pottery Neolithic; Phase B architecture attested" }),
      location: Object.freeze({ lat: 37.182, lon: 39.496, coordinateConfidence: "approximate-rounded-secondary-gazetteer" }),
      chronologyNote: "The official project page identifies quadrangular buildings with the regional Pre-Pottery Neolithic Phase B architectural tradition; exact occupation limits remain provisional here.",
      network: "tas-tepeler-upper-mesopotamia",
      evidenceType: "archaeological",
      sources: Object.freeze([
        Object.freeze({ label: "Taş Tepeler — Sefertepe", url: "https://tastepeler.org/en/settlements/sefertepe" })
      ])
    }),
    Object.freeze({
      id: "site-cakmaktepe",
      slug: "cakmaktepe",
      name: "Çakmaktepe",
      region: "Fatik Mountains plateau, Şanlıurfa",
      siteType: "early-neolithic-settlement",
      phase: Object.freeze({ startYear: -9600, endYear: -8800, label: "Pre-Pottery Neolithic A, approximately 9600–8800 BCE" }),
      location: Object.freeze({ lat: 37.086, lon: 38.630, coordinateConfidence: "approximate-rounded-gazetteer" }),
      chronologyNote: "Regional inventory sources place the excavated Neolithic phase approximately in PPNA; exact phase boundaries should be revised as excavation publications mature.",
      network: "tas-tepeler-upper-mesopotamia",
      evidenceType: "archaeological",
      sources: Object.freeze([
        Object.freeze({ label: "Taş Tepeler — Çakmaktepe", url: "https://tastepeler.org/yerlesmeler/cakmaktepe" }),
        Object.freeze({ label: "Şanlıurfa Culture Atlas — Çakmaktepe", url: "https://www.urfakulturatlasi.com.tr/envanter/detay/cakmaktepe" })
      ])
    })
  ]);

  const siteNetworks = Object.freeze({
    "tas-tepeler-upper-mesopotamia": Object.freeze({
      id: "tas-tepeler-upper-mesopotamia",
      name: "Taş Tepeler / Şanlıurfa Neolithic research network",
      startYear: -10000,
      endYear: -7000,
      mapMeaning: "Research-network grouping of settlements, campsites, hunting grounds and related archaeological sites; not a political or ethnic territory.",
      relatedSiteNames: Object.freeze([
        "Göbekli Tepe", "Karahantepe", "Sayburç", "Sefertepe", "Çakmaktepe",
        "Gürcütepe", "Harbetsuvan", "Yenimahalle", "Söğüt Tarlası"
      ]),
      sources: Object.freeze([
        Object.freeze({ label: "Taş Tepeler — Şanlıurfa Neolithic Research Project", url: "https://tastepeler.org/en" })
      ])
    })
  });

  function get(idOrSlug) {
    return sites.find(site => site.id === idOrSlug || site.slug === idOrSlug) || null;
  }

  function activeAt(year) {
    return sites.filter(site => year >= site.phase.startYear && year <= site.phase.endYear);
  }

  function inNetwork(networkId) {
    return sites.filter(site => site.network === networkId);
  }

  root.AtlasSiteData = Object.freeze({ sites, siteNetworks, get, activeAt, inNetwork });
})(typeof window !== "undefined" ? window : globalThis);
