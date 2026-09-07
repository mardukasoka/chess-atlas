"use strict";

const HistoricalRandomizer =
  typeof module !== "undefined" && module.exports
    ? require("./randomizer.js")
    : window.ChessAtlasRandomizer;

/*
 * Historical game catalogue. Rules that are archaeologically uncertain are
 * explicitly marked as reconstructions instead of being presented as settled
 * ancient rules.
 */

const HISTORICAL_PROFILES = Object.freeze({
  ur: Object.freeze({
    id: "ur",
    name: "Royal Game of Ur",
    family: "race",
    period: "3rd millennium BCE",
    certainty: "reconstructed-from-cuneiform",
    randomizer: "four-binary-tetrahedra"
  }),
  senet: Object.freeze({
    id: "senet",
    name: "Senet",
    family: "race",
    period: "Predynastic / Early Dynastic Egypt onward",
    certainty: "reconstructed-rules-vary",
    randomizer: "casting-sticks"
  }),
  mehen: Object.freeze({
    id: "mehen",
    name: "Mehen",
    family: "spiral-race-archaeological",
    period: "Predynastic / Early Dynastic and Old Kingdom Egypt",
    certainty: "board-and-pieces-attested-rules-unknown",
    playable: false
  }),
  fiftyEightHoles: Object.freeze({
    id: "fifty-eight-holes",
    name: "Fifty-Eight Holes / Hounds and Jackals",
    family: "two-track-peg-race",
    period: "Middle Kingdom Egypt and Bronze Age Near East",
    certainty: "race-structure-attested-complete-rules-unknown",
    playableProfile: "carter-carnarvon-1912-basic"
  }),
  nineMensMorris: Object.freeze({
    id: "nine-mens-morris",
    name: "Nine Men's Morris / Merels",
    family: "graph-placement-capture",
    period: "historically widespread; exact early chronology varies",
    certainty: "well-attested-later-rules"
  }),
  pachisi: Object.freeze({
    id: "pachisi",
    name: "Pachisi / Chaupar family",
    family: "cross-and-circle-race",
    period: "South Asian historical tradition",
    certainty: "rules-vary-by-period-and-region",
    randomizer: "cowries-or-long-dice"
  }),
  konane: Object.freeze({
    id: "konane",
    name: "Kōnane",
    family: "orthogonal-capture",
    period: "pre-contact Hawaiʻi",
    certainty: "documented-with-opening-variants"
  }),
  latrunculi: Object.freeze({
    id: "latrunculi",
    name: "Ludus Latrunculorum",
    family: "capture-strategy",
    period: "Roman antiquity",
    certainty: "reconstructed-rules-uncertain"
  })
});

const UR_PIECES_PER_SIDE = 7;
const UR_EXIT = 14;
const UR_ROSETTES = new Set([3, 7, 13]);
const UR_SHARED_START = 4;
const UR_SHARED_END = 11;

class RoyalGameOfUr {
  constructor(options = {}) {
    this.sides = options.sides ?? ["w", "b"];
    this.turnIndex = 0;
    this.random = options.random ?? new HistoricalRandomizer.SeededRandom(options.seed ?? 1);
    this.pieces = new Map(this.sides.map(side => [side, Array(UR_PIECES_PER_SIDE).fill(-1)]));
    this.lastRoll = null;
    this.winner = null;
    if (options.snapshot) this.restore(options.snapshot);
  }

  get turn() { return this.sides[this.turnIndex]; }

  cast() {
    const result = HistoricalRandomizer.rollFaces(this.random, [0, 1], 4)
      .reduce((sum, value) => sum + value, 0);
    this.lastRoll = result;
    return result;
  }

  opponent(side) { return this.sides.find(candidate => candidate !== side); }
  occupiedBy(side, progress) { return this.pieces.get(side).findIndex(value => value === progress); }
  isShared(progress) { return progress >= UR_SHARED_START && progress <= UR_SHARED_END; }

  legalMoves(roll = this.lastRoll) {
    if (this.winner || !Number.isInteger(roll) || roll < 1 || roll > 4) return [];
    const side = this.turn;
    const own = this.pieces.get(side);
    const opponent = this.opponent(side);
    return own.flatMap((progress, pieceIndex) => {
      if (progress === UR_EXIT) return [];
      const destination = progress + roll;
      if (destination > UR_EXIT) return [];
      if (this.occupiedBy(side, destination) !== -1 && destination !== UR_EXIT) return [];
      if (this.isShared(destination)) {
        const enemyIndex = this.occupiedBy(opponent, destination);
        if (enemyIndex !== -1 && UR_ROSETTES.has(destination)) return [];
      }
      return [{ side, pieceIndex, from: progress, to: destination, roll }];
    });
  }

  move(pieceIndex, roll = this.lastRoll) {
    const legal = this.legalMoves(roll).find(move => move.pieceIndex === pieceIndex);
    if (!legal) throw new RangeError("Illegal Royal Game of Ur move");
    const side = this.turn;
    const opponent = this.opponent(side);
    const own = this.pieces.get(side);
    own[pieceIndex] = legal.to;
    if (this.isShared(legal.to) && !UR_ROSETTES.has(legal.to)) {
      const enemyIndex = this.occupiedBy(opponent, legal.to);
      if (enemyIndex !== -1) this.pieces.get(opponent)[enemyIndex] = -1;
    }
    if (own.every(progress => progress === UR_EXIT)) {
      this.winner = side;
      return { ...legal, capture: false, extraTurn: false, winner: side };
    }
    const extraTurn = UR_ROSETTES.has(legal.to);
    if (!extraTurn) this.turnIndex = (this.turnIndex + 1) % this.sides.length;
    this.lastRoll = null;
    return { ...legal, extraTurn, winner: null };
  }

  passIfNoMove(roll = this.lastRoll) {
    if (this.legalMoves(roll).length !== 0) throw new RangeError("Cannot pass while a legal Ur move exists");
    this.turnIndex = (this.turnIndex + 1) % this.sides.length;
    this.lastRoll = null;
    return this;
  }

  restore(snapshot) {
    if (!snapshot || !snapshot.pieces || !this.sides.includes(snapshot.turn)) {
      throw new TypeError("Invalid Royal Game of Ur snapshot");
    }
    for (const side of this.sides) {
      const values = snapshot.pieces[side];
      if (!Array.isArray(values) || values.length !== UR_PIECES_PER_SIDE) {
        throw new TypeError("Invalid Royal Game of Ur piece state");
      }
      this.pieces.set(side, [...values]);
    }
    this.turnIndex = this.sides.indexOf(snapshot.turn);
    this.lastRoll = snapshot.lastRoll ?? null;
    this.winner = snapshot.winner ?? null;
    if (snapshot.random) this.random.restore(snapshot.random);
    return this;
  }

  snapshot() {
    return Object.freeze({
      profile: "finkel-basic",
      turn: this.turn,
      pieces: Object.freeze(Object.fromEntries(
        [...this.pieces.entries()].map(([side, values]) => [side, Object.freeze([...values])])
      )),
      lastRoll: this.lastRoll,
      winner: this.winner,
      random: this.random.snapshot()
    });
  }
}

function historicalProfile(id) { return HISTORICAL_PROFILES[id] ?? null; }

const HistoricalGames = {
  profiles: HISTORICAL_PROFILES,
  historicalProfile,
  RoyalGameOfUr,
  constants: Object.freeze({
    UR_PIECES_PER_SIDE,
    UR_EXIT,
    UR_ROSETTES: Object.freeze([...UR_ROSETTES]),
    UR_SHARED_START,
    UR_SHARED_END
  })
};

if (typeof module !== "undefined" && module.exports) module.exports = HistoricalGames;
if (typeof window !== "undefined") window.ChessAtlasHistoricalGames = HistoricalGames;
