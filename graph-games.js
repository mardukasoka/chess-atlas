"use strict";

/*
 * Lightweight graph topology for games whose board is better represented by
 * connected points than by a rectangular chess grid (Morris/Merels, Rota,
 * and later route/diplomacy boards).
 */

function normalizeGraph(definition) {
  if (!definition || !Array.isArray(definition.nodes)) {
    throw new TypeError("Graph definition requires nodes");
  }

  const nodes = [...new Set(definition.nodes.map(String))];
  const nodeSet = new Set(nodes);
  const adjacency = new Map(nodes.map(node => [node, new Set()]));

  for (const edge of definition.edges ?? []) {
    if (!Array.isArray(edge) || edge.length !== 2) {
      throw new TypeError("Graph edges must be [from,to] pairs");
    }
    const [from, to] = edge.map(String);
    if (!nodeSet.has(from) || !nodeSet.has(to) || from === to) {
      throw new RangeError("Graph edge references invalid nodes");
    }
    adjacency.get(from).add(to);
    adjacency.get(to).add(from);
  }

  const winningLines = (definition.winningLines ?? []).map(line => {
    if (!Array.isArray(line) || line.length < 2) {
      throw new TypeError("Winning lines must contain at least two nodes");
    }
    const normalized = line.map(String);
    if (normalized.some(node => !nodeSet.has(node))) {
      throw new RangeError("Winning line references invalid node");
    }
    return Object.freeze(normalized);
  });

  return Object.freeze({
    nodes: Object.freeze(nodes),
    adjacency,
    winningLines: Object.freeze(winningLines)
  });
}

class GraphBoard {
  constructor(definition) {
    this.graph = normalizeGraph(definition);
    this.occupancy = new Map();
  }

  hasNode(node) {
    return this.graph.adjacency.has(String(node));
  }

  get(node) {
    return this.occupancy.get(String(node)) ?? null;
  }

  set(node, piece) {
    const key = String(node);
    if (!this.hasNode(key)) {
      throw new RangeError(`Unknown graph node: ${key}`);
    }
    if (piece === null || piece === undefined) {
      this.occupancy.delete(key);
    } else {
      this.occupancy.set(key, piece);
    }
    return this;
  }

  neighbors(node) {
    const key = String(node);
    if (!this.hasNode(key)) {
      throw new RangeError(`Unknown graph node: ${key}`);
    }
    return [...this.graph.adjacency.get(key)];
  }

  emptyNodes() {
    return this.graph.nodes.filter(node => !this.occupancy.has(node));
  }

  isWinningLine(line, side) {
    return line.every(node => {
      const piece = this.get(node);
      return piece && (piece.side ?? piece.owner ?? piece) === side;
    });
  }

  winningLinesFor(side) {
    return this.graph.winningLines.filter(line => this.isWinningLine(line, side));
  }

  clone() {
    const board = new GraphBoard({
      nodes: this.graph.nodes,
      edges: this.graph.nodes.flatMap(from =>
        this.neighbors(from)
          .filter(to => from < to)
          .map(to => [from, to])
      ),
      winningLines: this.graph.winningLines
    });
    for (const [node, piece] of this.occupancy) {
      board.set(node, typeof piece === "object" ? { ...piece } : piece);
    }
    return board;
  }
}

function createNineMensMorrisDefinition() {
  const nodes = [
    "a7", "d7", "g7", "b6", "d6", "f6", "c5", "d5", "e5",
    "a4", "b4", "c4", "e4", "f4", "g4", "c3", "d3", "e3",
    "b2", "d2", "f2", "a1", "d1", "g1"
  ];

  const edges = [
    ["a7","d7"],["d7","g7"],["b6","d6"],["d6","f6"],["c5","d5"],["d5","e5"],
    ["a4","b4"],["b4","c4"],["e4","f4"],["f4","g4"],["c3","d3"],["d3","e3"],
    ["b2","d2"],["d2","f2"],["a1","d1"],["d1","g1"],
    ["a7","a4"],["a4","a1"],["b6","b4"],["b4","b2"],["c5","c4"],["c4","c3"],
    ["d7","d6"],["d6","d5"],["d3","d2"],["d2","d1"],["e5","e4"],["e4","e3"],
    ["f6","f4"],["f4","f2"],["g7","g4"],["g4","g1"]
  ];

  const winningLines = [
    ["a7","d7","g7"],["b6","d6","f6"],["c5","d5","e5"],
    ["a4","b4","c4"],["e4","f4","g4"],["c3","d3","e3"],
    ["b2","d2","f2"],["a1","d1","g1"],
    ["a7","a4","a1"],["b6","b4","b2"],["c5","c4","c3"],
    ["d7","d6","d5"],["d3","d2","d1"],["e5","e4","e3"],
    ["f6","f4","f2"],["g7","g4","g1"]
  ];

  return { nodes, edges, winningLines };
}

class MorrisGame {
  constructor(options = {}) {
    this.board = new GraphBoard(options.definition ?? createNineMensMorrisDefinition());
    this.sides = options.sides ?? ["w", "b"];
    this.piecesPerSide = options.piecesPerSide ?? 9;
    this.toPlace = new Map(this.sides.map(side => [side, this.piecesPerSide]));
    this.turnIndex = 0;
    this.pendingCapture = false;
  }

  get turn() {
    return this.sides[this.turnIndex];
  }

  count(side) {
    let total = 0;
    for (const piece of this.board.occupancy.values()) {
      if ((piece.side ?? piece) === side) total++;
    }
    return total;
  }

  phase(side = this.turn) {
    if ((this.toPlace.get(side) ?? 0) > 0) return "placement";
    if (this.count(side) === 3) return "flying";
    return "movement";
  }

  place(node) {
    const side = this.turn;
    if (this.pendingCapture || this.phase(side) !== "placement") {
      throw new RangeError("Placement is not currently legal");
    }
    if (this.board.get(node)) {
      throw new RangeError("Morris node is occupied");
    }
    this.board.set(node, { side });
    this.toPlace.set(side, this.toPlace.get(side) - 1);
    this.pendingCapture = this.board.winningLinesFor(side).some(line => line.includes(String(node)));
    if (!this.pendingCapture) this.advanceTurn();
    return this;
  }

  move(from, to) {
    const side = this.turn;
    const phase = this.phase(side);
    if (this.pendingCapture || phase === "placement") {
      throw new RangeError("Movement is not currently legal");
    }
    const piece = this.board.get(from);
    if (!piece || (piece.side ?? piece) !== side || this.board.get(to)) {
      throw new RangeError("Illegal Morris move");
    }
    if (phase !== "flying" && !this.board.neighbors(from).includes(String(to))) {
      throw new RangeError("Morris movement must follow a graph edge");
    }
    this.board.set(from, null).set(to, piece);
    this.pendingCapture = this.board.winningLinesFor(side).some(line => line.includes(String(to)));
    if (!this.pendingCapture) this.advanceTurn();
    return this;
  }

  capture(node) {
    if (!this.pendingCapture) {
      throw new RangeError("No Morris capture is pending");
    }
    const opponent = this.sides[(this.turnIndex + 1) % this.sides.length];
    const target = this.board.get(node);
    if (!target || (target.side ?? target) !== opponent) {
      throw new RangeError("Capture must remove an opponent piece");
    }

    const opponentMills = this.board.winningLinesFor(opponent);
    const protectedNodes = new Set(opponentMills.flat());
    const removableOutsideMill = [...this.board.occupancy.entries()].some(([candidate, piece]) =>
      (piece.side ?? piece) === opponent && !protectedNodes.has(candidate)
    );
    if (removableOutsideMill && protectedNodes.has(String(node))) {
      throw new RangeError("Cannot capture from a mill while another piece is available");
    }

    this.board.set(node, null);
    this.pendingCapture = false;
    this.advanceTurn();
    return this;
  }

  advanceTurn() {
    this.turnIndex = (this.turnIndex + 1) % this.sides.length;
  }
}

const GraphGames = {
  normalizeGraph,
  GraphBoard,
  createNineMensMorrisDefinition,
  MorrisGame
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = GraphGames;
}

if (typeof window !== "undefined") {
  window.ChessAtlasGraphGames = GraphGames;
}
