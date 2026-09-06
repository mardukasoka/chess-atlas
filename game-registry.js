"use strict";

/*
 * Central catalogue used by the Atlas UI. A game can be historically related
 * without being forced into the chess engine. Families keep geometry/rules
 * separate while the Atlas timeline can still present them together.
 */

const GAMES = Object.freeze([
  Object.freeze({ id: "senet", name: "Senet", family: "race", era: -3000, implementation: "playable-reconstruction", uncertainty: "high" }),
  Object.freeze({ id: "ur", name: "Royal Game of Ur", family: "race", era: -2600, implementation: "playable-reconstruction", uncertainty: "medium" }),
  Object.freeze({ id: "latrunculi", name: "Ludus Latrunculorum", family: "capture", era: -100, implementation: "profile-only", uncertainty: "high" }),
  Object.freeze({ id: "nine-mens-morris", name: "Nine Men's Morris / Merels", family: "graph-placement-capture", era: 100, implementation: "playable", uncertainty: "medium" }),
  Object.freeze({ id: "pachisi", name: "Pachisi / Chaupar family", family: "cross-circle-race", era: 1500, implementation: "profile-only", uncertainty: "high" }),
  Object.freeze({ id: "konane", name: "Kōnane", family: "orthogonal-capture", era: 1700, implementation: "playable", uncertainty: "low" }),
  Object.freeze({ id: "chaturanga", name: "Chaturanga", family: "chess", era: 600, implementation: "playable", uncertainty: "medium" }),
  Object.freeze({ id: "shatranj", name: "Shatranj", family: "chess", era: 800, implementation: "playable", uncertainty: "low" }),
  Object.freeze({ id: "acedrex", name: "Acedrex — Alfonso X", family: "chess", era: 1283, implementation: "playable", uncertainty: "low" }),
  Object.freeze({ id: "modern", name: "Modern Chess", family: "chess", era: 1500, implementation: "playable", uncertainty: "low" }),
  Object.freeze({ id: "infinite", name: "Infinite Chess", family: "advanced-chess", era: 2000, implementation: "engine-substrate", uncertainty: "variant-dependent" }),
  Object.freeze({ id: "4d", name: "4D Spatial Chess", family: "advanced-chess", era: 2000, implementation: "engine-substrate", uncertainty: "variant-dependent" }),
  Object.freeze({ id: "quantum", name: "Quantum Chess", family: "advanced-chess", era: 2010, implementation: "engine-substrate", uncertainty: "variant-dependent" }),
  Object.freeze({ id: "5d", name: "5D Timeline Chess", family: "advanced-chess", era: 2020, implementation: "timeline-substrate", uncertainty: "variant-dependent" })
]);

const BY_ID = new Map(GAMES.map(game => [game.id, game]));

function getGame(id) {
  return BY_ID.get(id) ?? null;
}

function gamesByFamily(family) {
  return GAMES.filter(game => game.family === family);
}

function chronologicalGames() {
  return [...GAMES].sort((a, b) => a.era - b.era || a.name.localeCompare(b.name));
}

const GameRegistry = {
  games: GAMES,
  getGame,
  gamesByFamily,
  chronologicalGames
};

if (typeof module !== "undefined" && module.exports) module.exports = GameRegistry;
if (typeof window !== "undefined") window.ChessAtlasGameRegistry = GameRegistry;
