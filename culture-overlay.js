"use strict";

/* Thin integration layer: keeps deep-time evidence separate from chess rules. */
(function () {
  const deepTimeNodes = [
    {
      id: "natufian",
      year: -12500,
      label: "Natufian cultural complex",
      description: "Late Epipalaeolithic Levant. Cultural geometry represents archaeological evidence, not territory.",
      games: ["race"],
      historicalGame: null
    },
    {
      id: "yamnaya",
      year: -2900,
      label: "Yamnaya horizon",
      description: "Pontic–Caspian Early Bronze Age archaeological horizon. Polygon is an evidence envelope, not a state border.",
      games: [],
      historicalGame: null
    }
  ];

  deepTimeNodes.forEach(node => {
    if (!ATLAS_WORLD.nodes.some(existing => existing.id === node.id)) {
      ATLAS_WORLD.nodes.push(node);
    }
  });
  ATLAS_WORLD.nodes.sort((a, b) => a.year - b.year);
  currentNodeIndex = ATLAS_WORLD.nodes.findIndex(node => node.id === "present");

  function activeCultures() {
    return AtlasCultureData.activeAt(getCurrentNode().year);
  }

  function syncCultureLayer() {
    if (atlasMap) atlasMap.setCulturalFeatures(activeCultures());
  }

  function restoreMapWhenReady(state, attempts = 0) {
    if (!state || attempts > 120) return;
    if (atlasMap) {
      AtlasReturnState.restoreMap(atlasMap, state);
      return;
    }
    requestAnimationFrame(() => restoreMapWhenReady(state, attempts + 1));
  }

  const baseRenderTimeline = renderTimeline;
  renderTimeline = function () {
    baseRenderTimeline();
    syncCultureLayer();
  };

  const baseRenderMode = renderMode;
  renderMode = function () {
    baseRenderMode();
    syncCultureLayer();
  };

  document.addEventListener("DOMContentLoaded", () => {
    const map = document.getElementById("world-map");
    if (!map) return;

    map.addEventListener("click", () => {
      requestAnimationFrame(() => {
        if (!atlasMap || !atlasMap.selectedId) return;
        const culture = AtlasCultureData.get(atlasMap.selectedId);
        if (!culture) return;
        const node = getCurrentNode();
        const returnState = AtlasReturnState.encode({
          atlas: node.id,
          mode: currentMode,
          camera: atlasMap.camera,
          selectedId: atlasMap.selectedId
        });
        location.href = `culture.html?id=${encodeURIComponent(culture.slug)}&return=${encodeURIComponent(returnState)}`;
      });
    });

    const requested = AtlasReturnState.decode(location.hash);
    if (requested) {
      const index = ATLAS_WORLD.nodes.findIndex(node => node.id === requested.atlas);
      if (index >= 0) currentNodeIndex = index;
      renderTimeline();
      applyTimelineGame();
      if (requested.mode === "diplomacy" || requested.mode === "chess") setMode(requested.mode);
      restoreMapWhenReady(requested);
    }
  });
})();
