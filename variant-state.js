"use strict";

const VariantAdvanced =
  typeof module !== "undefined" && module.exports
    ? require("./advanced-variants.js")
    : window.ChessAtlasAdvancedVariants;

const VariantTimeline =
  typeof module !== "undefined" && module.exports
    ? require("./timeline-state.js")
    : window.ChessAtlasTimelineState;

const VariantQuantum =
  typeof module !== "undefined" && module.exports
    ? require("./quantum-state.js")
    : window.ChessAtlasQuantumState;

function spatialShapeFor(config) {
  if (config.extent === "unbounded") {
    return Array(config.spatialDimensions).fill(null);
  }

  if (Array.isArray(config.dimensions)) {
    if (config.dimensions.length !== config.spatialDimensions) {
      throw new RangeError("dimensions must match spatialDimensions");
    }
    return [...config.dimensions];
  }

  if (config.spatialDimensions === 2) return [8, 8];
  if (config.spatialDimensions === 4) return [4, 4, 2, 2];
  return Array(config.spatialDimensions).fill(4);
}

class VariantState {
  constructor(config = {}, options = {}) {
    const normalized = VariantAdvanced.normalizeVariantConfig(config);
    this.config = Object.freeze({
      ...normalized,
      dimensions: Object.freeze(spatialShapeFor({ ...config, ...normalized }))
    });

    this.board = VariantAdvanced.createSpatialBoard(
      this.config.dimensions,
      options.pieces ?? []
    );

    this.timeline = this.config.timeline
      ? new VariantTimeline.TimelineGraph(options.initialState ?? this.snapshotSpatial())
      : null;

    this.quantum = this.config.quantum
      ? new VariantQuantum.QuantumState({ seed: options.seed ?? 1, random: options.random })
      : null;
  }

  snapshotSpatial() {
    return {
      dimensions: [...this.board.shape.dimensions],
      pieces: [...this.board.occupancy].map(([coordinate, piece]) => ({
        coordinate: [...coordinate],
        piece: { ...piece }
      }))
    };
  }

  recordTimeline(parentId, move, options = {}) {
    if (!this.timeline) {
      throw new RangeError("Timeline modifier is disabled");
    }
    const state = options.state ?? this.snapshotSpatial();
    return options.fork
      ? this.timeline.fork(parentId, state, move, options)
      : this.timeline.append(parentId, state, move, options);
  }

  addQuantumPiece(id, piece, coordinate) {
    if (!this.quantum) {
      throw new RangeError("Quantum modifier is disabled");
    }
    return this.quantum.addPiece(id, piece, coordinate);
  }

  descriptor() {
    return Object.freeze({
      baseRules: this.config.baseRules,
      spatialDimensions: this.config.spatialDimensions,
      extent: this.config.extent,
      timeline: this.config.timeline,
      quantum: this.config.quantum,
      dimensions: Object.freeze([...this.config.dimensions])
    });
  }
}

function createVariantState(config, options) {
  return new VariantState(config, options);
}

const VariantStateApi = {
  spatialShapeFor,
  VariantState,
  createVariantState
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = VariantStateApi;
}

if (typeof window !== "undefined") {
  window.ChessAtlasVariantState = VariantStateApi;
}
