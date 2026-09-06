"use strict";

/*
 * Central catalogue used by the Atlas UI. A game can be historically related
 * without being forced into the chess engine. Families keep geometry/rules
 * separate while the Atlas timeline can still present them together.
 *
 * sortEra is only an ordering aid. period is the human-facing chronology and
 * deliberately avoids false precision where dating or lineage is disputed.
 */

const GAMES = Object.freeze([
  Object.freeze({ id: "senet", name: "Senet", family: "race", sortEra: -3000, period: "Predynastic / Early Dynastic Egypt onward", implementation: "playable-reconstruction", uncertainty: "high" }),
  Object.freeze({ id: "ur", name: "Royal Game of Ur", family: "race", sortEra: -2600, period: "Early Dynastic Mesopotamia, 3rd millennium BCE", implementation: "playable-reconstruction", uncertainty: "medium" }),
  Object.freeze({ id: "latrunculi", name: "Ludus Latrunculorum", family: "capture", sortEra: -100, period: "Roman antiquity", implementation: "profile-only", uncertainty: "high" }),
  Object.freeze({ id: "nine-mens-morris", name: "Nine Men's Morris / Merels", family: "graph-placement-capture", sortEra: 500, period: "Historically widespread; early chronology is debated", implementation: "playable", uncertainty: "medium" }),
  Object.freeze({ id: "chaturanga", name: "Chaturanga", family: "chess", sortEra: 600, period: "Early medieval South Asia, commonly c. 6th century CE", implementation: "playable", uncertainty: "medium" }),
  Object.freeze({ id: "shatranj", name: "Shatranj", family: "chess", sortEra: 800, period: "Early Islamic world, c. 7th–10th centuries CE", implementation: "playable", uncertainty: "low" }),
  Object.freeze({ id: "acedrex", name: "Acedrex — Alfonso X", family: "chess", sortEra: 1283, period: "Alfonso X manuscript, 1283 CE", implementation: "playable", uncertainty: "low" }),
  Object.freeze({ id: "pachisi", name: "Pachisi / Chaupar family", family: "cross-circle-race", sortEra: 1500, period: "South Asian historical tradition; forms and dating vary", implementation: "profile-only", uncertainty: "high" }),
  Object.freeze({ id: "modern", name: "Modern Chess", family: "chess", sortEra: 1500, period: "Late 15th century CE onward", implementation: "playable", uncertainty: "low" }),
  Object.freeze({ id: "konane", name: "Kōnane", family: "orthogonal-capture", sortEra: 1700, period: "Traditional pre-contact Hawaiʻi; exact origin date unknown", implementation: "playable", uncertainty: "medium" }),
  Object.freeze({ id: "infinite", name: "Infinite Chess", family: "advanced-chess", sortEra: 2000, period: "Modern mathematical/online variants", implementation: "engine-substrate", uncertainty: "variant-dependent" }),
  Object.freeze({ id: "4d", name: "4D Spatial Chess", family: "advanced-chess", sortEra: 2000, period: "Modern multidimensional variants", implementation: "engine-substrate", uncertainty: "variant-dependent" }),
  Object.freeze({ id: "quantum", name: "Quantum Chess", family: "advanced-chess", sortEra: 2010, period: "21st-century quantum-inspired variants", implementation: "engine-substrate", uncertainty: "variant-dependent" }),
  Object.freeze({ id: "5d", name: "5D Timeline Chess", family: "advanced-chess", sortEra: 2020, period: "21st-century branching-timeline variants", implementation: "timeline-substrate", uncertainty: "variant-dependent" })
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

const GameRegistry = {
  games: GAMES,
  getGame,
  gamesByFamily,
  chronologicalGames
};

if (typeof module !== "undefined" && module.exports) module.exports = GameRegistry;
if (typeof window !== "undefined") window.ChessAtlasGameRegistry = GameRegistry;
