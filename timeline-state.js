"use strict";

/*
 * Generic branching timeline substrate.
 *
 * Time is intentionally NOT a spatial coordinate. Spatial boards remain
 * ordinary N-dimensional states; this graph records immutable snapshots,
 * ancestry, and branches for 5D chess now and Diplomacy/history later.
 */

function cloneSerializable(value) {
  if (value === undefined) {
    return undefined;
  }
  return JSON.parse(JSON.stringify(value));
}

function stableObject(value) {
  if (Array.isArray(value)) {
    return value.map(stableObject);
  }
  if (value && typeof value === "object") {
    return Object.keys(value)
      .sort()
      .reduce((result, key) => {
        result[key] = stableObject(value[key]);
        return result;
      }, {});
  }
  return value;
}

class TimelineGraph {
  constructor(initialState, options = {}) {
    this.nodes = new Map();
    this.children = new Map();
    this.branchHeads = new Map();
    this.sequence = 0;

    const rootId = options.rootId ?? "t0:0";
    const branchId = options.branchId ?? "t0";
    const root = Object.freeze({
      id: rootId,
      branchId,
      parentId: null,
      ply: 0,
      state: cloneSerializable(initialState),
      move: null,
      createdOrder: this.sequence++
    });

    this.nodes.set(rootId, root);
    this.children.set(rootId, new Set());
    this.branchHeads.set(branchId, rootId);
    this.rootId = rootId;
  }

  get(id) {
    return this.nodes.get(id) ?? null;
  }

  head(branchId = "t0") {
    const id = this.branchHeads.get(branchId);
    return id ? this.get(id) : null;
  }

  has(id) {
    return this.nodes.has(id);
  }

  append(parentId, state, move = null, options = {}) {
    const parent = this.get(parentId);
    if (!parent) {
      throw new RangeError(`Unknown timeline node: ${parentId}`);
    }

    const branchId = options.branchId ?? parent.branchId;
    const ply = parent.ply + 1;
    const id = options.id ?? `${branchId}:${ply}:${this.sequence}`;

    if (this.nodes.has(id)) {
      throw new RangeError(`Timeline node already exists: ${id}`);
    }

    const node = Object.freeze({
      id,
      branchId,
      parentId,
      ply,
      state: cloneSerializable(state),
      move: cloneSerializable(move),
      createdOrder: this.sequence++
    });

    this.nodes.set(id, node);
    this.children.set(id, new Set());
    this.children.get(parentId).add(id);
    this.branchHeads.set(branchId, id);
    return node;
  }

  fork(parentId, state, move = null, options = {}) {
    const branchId = options.branchId ?? `t${this.branchHeads.size}`;
    if (this.branchHeads.has(branchId)) {
      throw new RangeError(`Timeline branch already exists: ${branchId}`);
    }
    return this.append(parentId, state, move, { ...options, branchId });
  }

  ancestors(id) {
    const result = [];
    let current = this.get(id);
    if (!current) {
      throw new RangeError(`Unknown timeline node: ${id}`);
    }

    while (current) {
      result.push(current);
      current = current.parentId ? this.get(current.parentId) : null;
    }
    return result;
  }

  isAncestor(ancestorId, descendantId) {
    return this.ancestors(descendantId).some(node => node.id === ancestorId);
  }

  branchIds() {
    return [...this.branchHeads.keys()].sort();
  }

  coordinates(id) {
    const node = this.get(id);
    if (!node) {
      throw new RangeError(`Unknown timeline node: ${id}`);
    }
    return Object.freeze({ timelineId: node.branchId, ply: node.ply, nodeId: node.id });
  }

  serialize() {
    const payload = {
      rootId: this.rootId,
      branchHeads: [...this.branchHeads.entries()].sort(([a], [b]) => a.localeCompare(b)),
      nodes: [...this.nodes.values()]
        .sort((a, b) => a.createdOrder - b.createdOrder)
        .map(node => ({
          id: node.id,
          branchId: node.branchId,
          parentId: node.parentId,
          ply: node.ply,
          state: stableObject(node.state),
          move: stableObject(node.move),
          createdOrder: node.createdOrder
        }))
    };
    return JSON.stringify(payload);
  }
}

function create5DChessState(initialBoardState) {
  return Object.freeze({
    id: "5d",
    spatialDimensions: 2,
    timeline: true,
    graph: new TimelineGraph(initialBoardState)
  });
}

const TimelineState = {
  TimelineGraph,
  create5DChessState
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = TimelineState;
}

if (typeof window !== "undefined") {
  window.ChessAtlasTimelineState = TimelineState;
}
