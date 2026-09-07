"use strict";

const assert = require("assert");
const ReturnState = require("./atlas-return-state.js");

test("Atlas return state round-trips timeline, mode and camera", () => {
  const encoded = ReturnState.encode({
    atlas: "natufian",
    mode: "diplomacy",
    camera: { x: -123.5, y: -77.25, zoom: 2.4 },
    selectedId: "culture-natufian"
  });
  const state = ReturnState.decode(encoded);
  assert.deepStrictEqual(state, {
    atlas: "natufian",
    mode: "diplomacy",
    x: -123.5,
    y: -77.25,
    zoom: 2.4,
    selectedId: "culture-natufian"
  });
});

test("Atlas return state accepts legacy percent-encoded hash", () => {
  const legacy = encodeURIComponent("atlas=yamnaya&mode=chess&zoom=1.5");
  const state = ReturnState.decode(`#${legacy}`);
  assert.strictEqual(state.atlas, "yamnaya");
  assert.strictEqual(state.mode, "chess");
  assert.strictEqual(state.zoom, 1.5);
});

test("restoreMap clamps and invalidates after applying camera", () => {
  let invalidated = false;
  let clamped = false;
  const map = {
    camera: {
      x: 0, y: 0, zoom: 1,
      clamp() { clamped = true; }
    },
    selectedId: null,
    featureById(id) { return id === "culture-natufian" ? { id } : null; },
    invalidate() { invalidated = true; }
  };
  ReturnState.restoreMap(map, {
    x: -10, y: -20, zoom: 3, selectedId: "culture-natufian"
  });
  assert.deepStrictEqual([map.camera.x, map.camera.y, map.camera.zoom], [-10, -20, 3]);
  assert.strictEqual(map.selectedId, "culture-natufian");
  assert.strictEqual(clamped, true);
  assert.strictEqual(invalidated, true);
});
