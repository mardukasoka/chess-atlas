"use strict";

/*
 * Evidence-first Asian game archaeology.
 *
 * This layer records attested equipment, chronology and evidence boundaries.
 * It does not convert incomplete ancient evidence into a playable ruleset.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.ChessAtlasAsianGames = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const profiles = Object.freeze({
    liubo: Object.freeze({
      id: "liubo",
      name: "Liubo (六博)",
      region: "China",
      chronology: Object.freeze({
        earlyClaimStatus: "written traditions may place the game earlier, but visual evidence before the late Warring States period is sparse",
        secureArchaeologicalHorizon: "late Warring States and especially Han dynasty",
        hanPeriod: "206 BCE–220 CE"
      }),
      board: Object.freeze({
        topology: "marked-road-board",
        markings: "distinctive TLV-like diagrammatic pattern is attested on Han-period material"
      }),
      players: 2,
      pieces: Object.freeze({
        perSide: 6,
        total: 12,
        attestedForms: Object.freeze(["pieces", "rods", "counters"])
      }),
      chanceEquipment: Object.freeze(["dice", "casting rods in earlier descriptions"]),
      rulesStatus: "equipment-and-play-context-attested-complete-rules-not-secure",
      playable: false,
      evidence: Object.freeze([
        "Han archaeological objects and tomb models show players at marked Liubo boards",
        "museum records describe twelve playing pieces, six per player, with dice used to determine movement",
        "the board pattern also appears in Han cosmological imagery, but cosmological meaning should not be treated as a complete rules description"
      ]),
      evidenceBoundary: "Do not present any modern reconstruction as the ancient rules of Liubo without an explicit reconstruction author/profile.",
      sources: Object.freeze([
        "https://www.metmuseum.org/art/collection/search/44732",
        "https://www.metmuseum.org/art/collection/search/50484",
        "https://www.metmuseum.org/art/collection/search/61417",
        "https://www.britishmuseum.org/collection/object/A_1933-1114-1-d"
      ])
    }),
    go: Object.freeze({
      id: "go",
      names: Object.freeze(["Go", "Weiqi", "Baduk"]),
      region: "East Asia",
      roleInAtlas: "long-lived strategy-game lineage represented by the existing Go core module",
      implementationStatus: "core-module-present",
      archaeologyNote: "Kept separate from Liubo; visual similarity, chronology or coexistence does not establish direct descent."
    })
  });

  const sequence = Object.freeze([
    Object.freeze({ id: "liubo", relation: "chronologically-before-or-overlapping-early-go-evidence", descentClaim: false }),
    Object.freeze({ id: "go", relation: "independent-long-lived-strategy-lineage", descentClaim: false })
  ]);

  function get(id) { return profiles[id] || null; }
  function list() { return Object.values(profiles); }

  return Object.freeze({ profiles, sequence, get, list });
});
