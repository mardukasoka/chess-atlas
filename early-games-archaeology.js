"use strict";

/* Archaeological profiles deliberately separate attested board form from playable rules. */
(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.ChessAtlasEarlyGames = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const profiles = Object.freeze({
    mehen: Object.freeze({
      id: "mehen",
      name: "Mehen",
      region: "Egypt",
      chronology: "Predynastic / Early Dynastic to Old Kingdom",
      board: Object.freeze({ topology: "spiral", form: "coiled serpent divided into segments" }),
      pieces: Object.freeze({ attested: ["lion figures", "lioness figures", "marbles"] }),
      rulesStatus: "unknown",
      playable: false,
      evidence: Object.freeze([
        "surviving circular serpent boards",
        "Old Kingdom depictions associate lion pieces and marbles with the board"
      ]),
      sources: Object.freeze([
        "https://www.britishmuseum.org/collection/object/Y_EA66216",
        "https://www.metmuseum.org/de/essays/board-games-from-ancient-egypt-and-the-near-east"
      ])
    }),
    fiftyEightHoles: Object.freeze({
      id: "fifty-eight-holes",
      name: "Fifty-Eight Holes / Hounds and Jackals",
      region: "Egypt and Bronze Age Near East",
      chronology: "Middle Kingdom Egypt; attested farther east in the Bronze Age",
      board: Object.freeze({ topology: "paired-tracks", holesPerSide: 29, commonGoalInterpretation: true }),
      pieces: Object.freeze({ perSide: 5, form: "pegs; surviving Egyptian example has hound and jackal heads" }),
      rulesStatus: "race-structure-secure-complete-rules-unknown",
      playable: false,
      evidence: Object.freeze([
        "fifty-eight-hole boards with two sets of five pegs",
        "examples occur in Egypt and the Near East, including Old Assyrian-trading contexts in Anatolia"
      ]),
      sources: Object.freeze([
        "https://www.metmuseum.org/art/collection/search/543867",
        "https://www.metmuseum.org/art/collection/search/561802",
        "https://www.metmuseum.org/art/collection/search/329709"
      ])
    })
  });

  function get(id) { return profiles[id] || null; }
  function list() { return Object.values(profiles); }

  return Object.freeze({ profiles, get, list });
});
