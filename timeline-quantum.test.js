"use strict";

const Timeline = require("./timeline-state.js");
const Quantum = require("./quantum-state.js");
const Randomizer = require("./randomizer.js");

describe("5D timeline substrate", () => {
  test("time is stored as graph metadata, not a spatial coordinate", () => {
    const game = Timeline.create5DChessState({ board: "initial" });
    const root = game.graph.get(game.graph.rootId);
    expect(root.state).toEqual({ board: "initial" });
    expect(game.spatialDimensions).toBe(2);
    expect(game.timeline).toBe(true);
    expect(game.graph.coordinates(root.id)).toEqual({
      timelineId: "t0",
      ply: 0,
      nodeId: root.id
    });
  });

  test("forks preserve immutable ancestors", () => {
    const graph = new Timeline.TimelineGraph({ value: 0 });
    const first = graph.append(graph.rootId, { value: 1 }, { move: "a" });
    const branch = graph.fork(first.id, { value: 2 }, { move: "b" }, { branchId: "t1" });

    expect(graph.isAncestor(graph.rootId, branch.id)).toBe(true);
    expect(graph.isAncestor(first.id, branch.id)).toBe(true);
    expect(graph.get(first.id).state).toEqual({ value: 1 });
    expect(graph.branchIds()).toEqual(["t0", "t1"]);
  });

  test("serialization is deterministic", () => {
    const build = () => {
      const graph = new Timeline.TimelineGraph({ z: 2, a: 1 });
      const first = graph.append(graph.rootId, { b: 2, a: 1 }, { to: [1, 2], from: [0, 2] });
      graph.fork(first.id, { q: 7 }, null, { branchId: "t1", id: "t1:2" });
      return graph.serialize();
    };
    expect(build()).toBe(build());
  });
});

describe("quantum chess substrate", () => {
  test("a quantum split defaults to equal probability", () => {
    const state = new Quantum.QuantumState({ seed: 7 });
    state.addPiece("wN1", { side: "w", type: "N" }, [0, 1]);
    state.split("wN1", [[2, 0], [2, 2]]);

    expect(state.probabilityAt("wN1", [2, 0])).toBeCloseTo(0.5);
    expect(state.probabilityAt("wN1", [2, 2])).toBeCloseTo(0.5);
  });

  test("measurement collapses a superposition reproducibly", () => {
    const first = new Quantum.QuantumState({ random: new Randomizer.SeededRandom("measure") });
    const second = new Quantum.QuantumState({ random: new Randomizer.SeededRandom("measure") });

    for (const state of [first, second]) {
      state.addPiece("q", { side: "w", type: "Q" }, [0, 0]);
      state.split("q", [[1, 1], [2, 2]], [0.25, 0.75]);
    }

    expect(first.measure("q").branches).toEqual(second.measure("q").branches);
    expect(first.get("q").branches).toHaveLength(1);
    expect(first.get("q").branches[0].probability).toBe(1);
  });

  test("entangled pieces collapse correlated branch indices", () => {
    const state = new Quantum.QuantumState({ seed: 3 });
    state.addPiece("a", { side: "w", type: "N" }, [0, 0]);
    state.addPiece("b", { side: "b", type: "N" }, [7, 7]);
    state.split("a", [[1, 2], [2, 1]]);
    state.split("b", [[6, 5], [5, 6]]);
    state.entangle(["a", "b"], { groupId: "pair" });

    state.measure("a");
    expect(state.get("a").branches).toHaveLength(1);
    expect(state.get("b").branches).toHaveLength(1);
  });

  test("captures trigger measurement", () => {
    expect(Quantum.requiresMeasurement({ capture: true })).toBe(true);
    expect(Quantum.requiresMeasurement({ capture: false })).toBe(false);
  });
});
