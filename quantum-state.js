"use strict";

const QuantumRandomizer =
  typeof module !== "undefined" && module.exports
    ? require("./randomizer.js")
    : window.ChessAtlasRandomizer;

function cloneCoordinate(coordinate) {
  if (!Array.isArray(coordinate) || !coordinate.every(Number.isInteger)) {
    throw new TypeError("Quantum locations require integer coordinates");
  }
  return [...coordinate];
}

function normalizeBranches(branches) {
  if (!Array.isArray(branches) || branches.length === 0) {
    throw new RangeError("A quantum piece requires at least one branch");
  }

  const normalized = branches.map(branch => ({
    coordinate: cloneCoordinate(branch.coordinate),
    probability: Number(branch.probability)
  }));

  const total = normalized.reduce((sum, branch) => {
    if (!Number.isFinite(branch.probability) || branch.probability < 0) {
      throw new RangeError("Branch probabilities must be finite and non-negative");
    }
    return sum + branch.probability;
  }, 0);

  if (total <= 0) {
    throw new RangeError("Quantum branch probabilities must have positive total");
  }

  return normalized.map(branch => Object.freeze({
    coordinate: Object.freeze(branch.coordinate),
    probability: branch.probability / total
  }));
}

class QuantumState {
  constructor(options = {}) {
    this.pieces = new Map();
    this.entanglements = new Map();
    this.random = options.random ?? new QuantumRandomizer.SeededRandom(options.seed ?? 1);
  }

  addPiece(id, piece, coordinate) {
    if (!id || this.pieces.has(id)) {
      throw new RangeError("Quantum piece id must be unique");
    }
    this.pieces.set(id, {
      id,
      piece: { ...piece },
      branches: normalizeBranches([{ coordinate, probability: 1 }]),
      groupId: null
    });
    return this.get(id);
  }

  get(id) {
    const entry = this.pieces.get(id);
    if (!entry) {
      return null;
    }
    return Object.freeze({
      id: entry.id,
      piece: Object.freeze({ ...entry.piece }),
      branches: Object.freeze(entry.branches.map(branch => Object.freeze({
        coordinate: Object.freeze([...branch.coordinate]),
        probability: branch.probability
      }))),
      groupId: entry.groupId
    });
  }

  split(id, destinations, probabilities = null) {
    const entry = this.pieces.get(id);
    if (!entry) {
      throw new RangeError(`Unknown quantum piece: ${id}`);
    }
    if (!Array.isArray(destinations) || destinations.length < 2) {
      throw new RangeError("Quantum split requires at least two destinations");
    }

    const weights = probabilities ?? destinations.map(() => 1);
    if (!Array.isArray(weights) || weights.length !== destinations.length) {
      throw new RangeError("Split probabilities must match destinations");
    }

    entry.branches = normalizeBranches(destinations.map((coordinate, index) => ({
      coordinate,
      probability: weights[index]
    })));
    return this.get(id);
  }

  entangle(ids, options = {}) {
    if (!Array.isArray(ids) || ids.length < 2) {
      throw new RangeError("Entanglement requires at least two pieces");
    }
    ids.forEach(id => {
      if (!this.pieces.has(id)) {
        throw new RangeError(`Unknown quantum piece: ${id}`);
      }
    });

    const groupId = options.groupId ?? `q${this.entanglements.size}`;
    if (this.entanglements.has(groupId)) {
      throw new RangeError(`Entanglement group already exists: ${groupId}`);
    }

    const members = [...ids];
    this.entanglements.set(groupId, members);
    members.forEach(id => {
      this.pieces.get(id).groupId = groupId;
    });
    return groupId;
  }

  measure(id) {
    const entry = this.pieces.get(id);
    if (!entry) {
      throw new RangeError(`Unknown quantum piece: ${id}`);
    }

    const selectedIndex = this.random.weighted(
      entry.branches.map((branch, index) => ({ value: index, weight: branch.probability }))
    );
    const selected = entry.branches[selectedIndex];
    entry.branches = normalizeBranches([{ coordinate: selected.coordinate, probability: 1 }]);

    if (entry.groupId) {
      const members = this.entanglements.get(entry.groupId) ?? [];
      for (const partnerId of members) {
        if (partnerId === id) {
          continue;
        }
        const partner = this.pieces.get(partnerId);
        if (!partner || partner.branches.length === 1) {
          continue;
        }
        // Lightweight correlation rule: correlated branches share branch index.
        // Explicit probabilities stay local to each piece; the measured index is
        // projected onto the partner's available branch set.
        const partnerIndex = selectedIndex % partner.branches.length;
        const partnerSelected = partner.branches[partnerIndex];
        partner.branches = normalizeBranches([
          { coordinate: partnerSelected.coordinate, probability: 1 }
        ]);
      }
    }

    return this.get(id);
  }

  classicalOccupancy() {
    const occupancy = [];
    for (const entry of this.pieces.values()) {
      if (entry.branches.length === 1 && entry.branches[0].probability === 1) {
        occupancy.push({
          id: entry.id,
          piece: { ...entry.piece },
          coordinate: [...entry.branches[0].coordinate]
        });
      }
    }
    return occupancy;
  }

  probabilityAt(id, coordinate) {
    const entry = this.pieces.get(id);
    if (!entry) {
      return 0;
    }
    const key = JSON.stringify(coordinate);
    return entry.branches
      .filter(branch => JSON.stringify(branch.coordinate) === key)
      .reduce((sum, branch) => sum + branch.probability, 0);
  }

  serialize() {
    const pieces = [...this.pieces.values()]
      .sort((a, b) => String(a.id).localeCompare(String(b.id)))
      .map(entry => ({
        id: entry.id,
        piece: entry.piece,
        branches: entry.branches,
        groupId: entry.groupId
      }));
    const entanglements = [...this.entanglements.entries()]
      .sort(([a], [b]) => a.localeCompare(b));
    return JSON.stringify({
      pieces,
      entanglements,
      random: this.random.snapshot()
    });
  }
}

function requiresMeasurement(move) {
  return Boolean(move && (move.capture || move.captured || move.isCapture));
}

function createQuantumChessState(options = {}) {
  return Object.freeze({
    id: "quantum",
    spatialDimensions: 2,
    quantum: true,
    state: new QuantumState(options)
  });
}

const QuantumChessState = {
  QuantumState,
  normalizeBranches,
  requiresMeasurement,
  createQuantumChessState
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = QuantumChessState;
}

if (typeof window !== "undefined") {
  window.ChessAtlasQuantumState = QuantumChessState;
}
