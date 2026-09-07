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
        const returnState = `atlas=${encodeURIComponent(node.id)}&mode=${encodeURIComponent(currentMode)}`;
        location.href = `culture.html?id=${encodeURIComponent(culture.slug)}&return=${encodeURIComponent(returnState)}`;
      });
    });

    const requested = location.hash.startsWith("#atlas=")
      ? new URLSearchParams(location.hash.slice(1))
      : null;
    if (requested) {
      const nodeId = requested.get("atlas");
      const mode = requested.get("mode");
      const index = ATLAS_WORLD.nodes.findIndex(node => node.id === nodeId);
      if (index >= 0) currentNodeIndex = index;
      renderTimeline();
      applyTimelineGame();
      if (mode === "diplomacy" || mode === "chess") setMode(mode);
    }
  });
})();
