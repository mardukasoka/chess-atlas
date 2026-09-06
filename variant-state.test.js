"use strict";

const VariantState = require("./variant-state.js");

describe("advanced variant composition", () => {
  test("plain modern chess stays finite 2D", () => {
    const state = new VariantState.VariantState({ baseRules: "modern" });
    expect(state.descriptor()).toEqual({
      baseRules: "modern",
      spatialDimensions: 2,
      extent: "finite",
      timeline: false,
      quantum: false,
      dimensions: [8, 8]
    });
    expect(state.timeline).toBeNull();
    expect(state.quantum).toBeNull();
  });

  test("all modifiers can coexist without adding time or quantum axes", () => {
    const state = new VariantState.VariantState({
      baseRules: "modern",
      spatialDimensions: 4,
      extent: "unbounded",
      timeline: true,
      quantum: true
    }, { seed: 9 });

    expect(state.board.shape.dimensions).toEqual([null, null, null, null]);
    expect(state.timeline).not.toBeNull();
    expect(state.quantum).not.toBeNull();
    expect(state.descriptor().spatialDimensions).toBe(4);
    expect(state.descriptor()).toMatchObject({ timeline: true, quantum: true });
  });

  test("4D finite shape defaults to 4x4x2x2", () => {
    const state = new VariantState.VariantState({ spatialDimensions: 4 });
    expect(state.board.shape.dimensions).toEqual([4, 4, 2, 2]);
    expect(state.board.shape.size).toBe(64);
  });
});
