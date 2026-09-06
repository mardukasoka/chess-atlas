"use strict";

/*
 * Central catalogue used by the Atlas UI.
 *
 * origin records when/where a game tradition is evidenced. rulesProfiles record
 * the provenance of the rules we actually implement or document. A modern
 * reconstruction must never be presented on the Atlas as if its complete rules
 * survived from the game's archaeological origin.
 */

function profile(id, attribution, date, status, confidence, note) {
  return Object.freeze({ id, attribution, date, status, confidence, note });
}

const GAMES = Object.freeze([
  Object.freeze({
    id: "senet", name: "Senet", family: "race", sortEra: -3000,
    origin: "Predynastic / Early Dynastic Egypt onward",
    uncertainty: "high",
    rulesProfiles: Object.freeze([
      profile("kendall-1978", "Timothy Kendall", 1978, "playable", "reconstruction", "Modern reconstruction; no complete ancient Senet ruleset survives."),
      profile("bell", "R. C. Bell", 1979, "documented-not-yet-implemented", "reconstruction", "Distinct modern reconstruction; keep separate from Kendall rather than silently synthesising them.")
    ])
  }),
  Object.freeze({
    id: "ur", name: "Royal Game of Ur", family: "race", sortEra: -2600,
    origin: "Early Dynastic Mesopotamia, 3rd millennium BCE",
    uncertainty: "medium",
    rulesProfiles: Object.freeze([
      profile("finkel-basic", "Irving L. Finkel / British Museum", 2007, "playable", "reconstruction", "Basic modern reconstruction informed by board evidence and cuneiform rules evidence; distinguish it from the later Seleucid rules attested on BM 33333,b."),
      profile("seleucid-tablet", "Itti-Marduk-balatu; interpreted by Irving L. Finkel", -177, "documented-not-yet-implemented", "textual-evidence", "Later twenty-squares rules tradition preserved on a Babylonian cuneiform tablet; not identical to the Early Dynastic game state.")
    ])
  }),
  Object.freeze({
    id: "latrunculi", name: "Ludus Latrunculorum", family: "capture", sortEra: -100,
    origin: "Roman antiquity, attested by the late Republic / early Imperial period; exact origin and canonical board size remain uncertain",
    uncertainty: "high",
    rulesProfiles: Object.freeze([
      profile("schadler-1994", "Ulrich Schädler", 1994, "playable", "reconstruction", "Primary Atlas profile: an explicitly attributed scholarly reconstruction from archaeological and textual evidence, used for play at the game's earliest attested Atlas position without pretending the full Roman rules survive.")
    ])
  }),
  Object.freeze({ id: "nine-mens-morris", name: "Nine Men's Morris / Merels", family: "graph-placement-capture", sortEra: 500, origin: "Historically widespread; early chronology is debated", implementation: "playable", uncertainty: "medium" }),
  Object.freeze({ id: "chaturanga", name: "Chaturanga", family: "chess", sortEra: 600, origin: "Early medieval South Asia, commonly c. 6th century CE", implementation: "playable", uncertainty: "medium" }),
  Object.freeze({ id: "shatranj", name: "Shatranj", family: "chess", sortEra: 800, origin: "Early Islamic world, c. 7th–10th centuries CE", implementation: "playable", uncertainty: "low" }),
  Object.freeze({
    id: "alquerque", name: "Alquerque de Doze", family: "line-leaping-capture", sortEra: 1283,
    origin: "Arabic-speaking world before its 13th-century Castilian documentation; earliest complete surviving rules description in Alfonso X's Libro de los Juegos (1283)",
    uncertainty: "medium",
    rulesProfiles: Object.freeze([
      profile("alfonso-1283", "Alfonso X, Libro de los Juegos", 1283, "playable", "contemporary-textual-evidence", "Primary Atlas profile follows the securely attested 5x5 line board, twelve men per side, adjacent line movement, hop capture, and elimination objective. Later compulsory-capture, huffing, chained-capture, and stalemate conventions are not silently imported into this profile.")
    ])
  }),
  Object.freeze({ id: "acedrex", name: "Acedrex — Alfonso X", family: "chess", sortEra: 1283, origin: "Alfonso X manuscript, 1283 CE", authors: Object.freeze(["Alfonso X manuscript tradition"]), implementation: "playable", uncertainty: "low" }),
  Object.freeze({ id: "pachisi", name: "Pachisi / Chaupar family", family: "cross-circle-race", sortEra: 1500, origin: "South Asian historical tradition; forms and dating vary", implementation: "playable-profile", uncertainty: "high" }),
  Object.freeze({ id: "modern", name: "Modern Chess", family: "chess", sortEra: 1500, origin: "Late 15th century CE onward", implementation: "playable", uncertainty: "low" }),
  Object.freeze({ id: "konane", name: "Kōnane", family: "orthogonal-capture", sortEra: 1700, origin: "Traditional pre-contact Hawaiʻi; exact origin date unknown", implementation: "playable", uncertainty: "medium" }),
  Object.freeze({ id: "infinite", name: "Infinite Chess", family: "advanced-chess", sortEra: 2000, origin: "Modern mathematical/online variants", authors: Object.freeze([]), implementation: "engine-substrate", uncertainty: "variant-dependent" }),
  Object.freeze({ id: "4d", name: "4D Spatial Chess", family: "advanced-chess", sortEra: 2000, origin: "Modern multidimensional variants", authors: Object.freeze([]), implementation: "engine-substrate", uncertainty: "variant-dependent" }),
  Object.freeze({ id: "quantum", name: "Quantum Chess", family: "advanced-chess", sortEra: 2010, origin: "21st-century quantum-inspired variants", authors: Object.freeze([]), implementation: "engine-substrate", uncertainty: "variant-dependent" }),
  Object.freeze({ id: "5d", name: "5D Timeline Chess", family: "advanced-chess", sortEra: 2020, origin: "21st-century branching-timeline variants", authors: Object.freeze([]), implementation: "timeline-substrate", uncertainty: "variant-dependent" })
]);

const BY_ID = new Map(GAMES.map(game => [game.id, game]));

function getGame(id) {
  return BY_ID.get(id) ?? null;
}

function gamesByFamily(family) {
  return GAMES.filter(game => game.family === family);
}

function chronologicalGames() {
  return [...GAMES].sort((a, b) => a.sortEra - b.sortEra || a.name.localeCompare(b.name));
}

function rulesProfiles() {
  return GAMES.flatMap(game => (game.rulesProfiles || []).map(rules => ({ gameId: game.id, gameName: game.name, ...rules })));
}

const GameRegistry = {
  games: GAMES,
  getGame,
  gamesByFamily,
  chronologicalGames,
  rulesProfiles
};

if (typeof module !== "undefined" && module.exports) module.exports = GameRegistry;
if (typeof window !== "undefined") window.ChessAtlasGameRegistry = GameRegistry;
