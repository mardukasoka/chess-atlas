"use strict";

(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.AtlasReturnState = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function finite(value) {
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
  }

  function encode({ atlas, mode, camera = null, selectedId = null }) {
    const params = new URLSearchParams();
    if (atlas) params.set("atlas", atlas);
    if (mode) params.set("mode", mode);
    if (camera) {
      const x = finite(camera.x);
      const y = finite(camera.y);
      const zoom = finite(camera.zoom);
      if (x !== null) params.set("x", String(x));
      if (y !== null) params.set("y", String(y));
      if (zoom !== null) params.set("zoom", String(zoom));
    }
    if (selectedId) params.set("selected", selectedId);
    return params.toString();
  }

  function decode(value) {
    if (!value) return null;
    let text = String(value).replace(/^#/, "");
    if (!text.includes("=") && /%3D/i.test(text)) {
      try { text = decodeURIComponent(text); } catch (_) {}
    }
    const params = new URLSearchParams(text);
    if (!params.get("atlas")) return null;
    return {
      atlas: params.get("atlas"),
      mode: params.get("mode"),
      x: finite(params.get("x")),
      y: finite(params.get("y")),
      zoom: finite(params.get("zoom")),
      selectedId: params.get("selected") || null
    };
  }

  function restoreMap(map, state) {
    if (!map || !map.camera || !state) return false;
    if (state.zoom !== null) map.camera.zoom = state.zoom;
    if (state.x !== null) map.camera.x = state.x;
    if (state.y !== null) map.camera.y = state.y;
    map.camera.clamp();
    if (state.selectedId && map.featureById?.(state.selectedId)) {
      map.selectedId = state.selectedId;
    }
    map.invalidate?.();
    return true;
  }

  return Object.freeze({ encode, decode, restoreMap });
});
