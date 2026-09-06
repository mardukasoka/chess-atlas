"use strict";

/*
 * Small deterministic randomizer substrate shared by quantum and historical
 * games. It deliberately avoids Math.random() so tests and saved games can be
 * replayed exactly from a seed.
 */

function normalizeSeed(seed) {
  if (typeof seed === "string") {
    let hash = 2166136261;
    for (let i = 0; i < seed.length; i++) {
      hash ^= seed.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0 || 1;
  }

  if (!Number.isFinite(seed)) {
    throw new TypeError("Seed must be a finite number or string");
  }

  return (Math.trunc(seed) >>> 0) || 1;
}

class SeededRandom {
  constructor(seed = 1) {
    this.state = normalizeSeed(seed);
  }

  nextUint32() {
    // xorshift32: tiny, deterministic, and sufficient for game simulation.
    let value = this.state >>> 0;
    value ^= value << 13;
    value ^= value >>> 17;
    value ^= value << 5;
    this.state = value >>> 0;
    return this.state;
  }

  next() {
    return this.nextUint32() / 0x100000000;
  }

  integer(maxExclusive) {
    if (!Number.isInteger(maxExclusive) || maxExclusive <= 0) {
      throw new RangeError("maxExclusive must be a positive integer");
    }
    return Math.floor(this.next() * maxExclusive);
  }

  choose(values) {
    if (!Array.isArray(values) || values.length === 0) {
      throw new RangeError("choose requires at least one value");
    }
    return values[this.integer(values.length)];
  }

  weighted(entries) {
    if (!Array.isArray(entries) || entries.length === 0) {
      throw new RangeError("weighted requires at least one entry");
    }

    let total = 0;
    const normalized = entries.map(entry => {
      const weight = Number(entry.weight);
      if (!Number.isFinite(weight) || weight < 0) {
        throw new RangeError("Weights must be finite and non-negative");
      }
      total += weight;
      return { value: entry.value, weight };
    });

    if (total <= 0) {
      throw new RangeError("At least one weight must be positive");
    }

    let cursor = this.next() * total;
    for (const entry of normalized) {
      cursor -= entry.weight;
      if (cursor < 0) {
        return entry.value;
      }
    }

    return normalized[normalized.length - 1].value;
  }

  snapshot() {
    return Object.freeze({ state: this.state >>> 0 });
  }

  restore(snapshot) {
    if (!snapshot || !Number.isInteger(snapshot.state)) {
      throw new TypeError("Invalid randomizer snapshot");
    }
    this.state = snapshot.state >>> 0 || 1;
    return this;
  }
}

function rollFaces(random, faces, count = 1) {
  if (!(random instanceof SeededRandom)) {
    throw new TypeError("rollFaces requires a SeededRandom instance");
  }
  if (!Array.isArray(faces) || faces.length === 0) {
    throw new RangeError("faces must contain at least one outcome");
  }
  if (!Number.isInteger(count) || count < 1) {
    throw new RangeError("count must be a positive integer");
  }

  return Array.from({ length: count }, () => random.choose(faces));
}

const Randomizer = {
  normalizeSeed,
  SeededRandom,
  rollFaces
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = Randomizer;
}

if (typeof window !== "undefined") {
  window.ChessAtlasRandomizer = Randomizer;
}
