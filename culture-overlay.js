"use strict";

/* Thin integration layer: keeps deep-time evidence separate from chess rules. */
(function () {
  const deepTimeNodes = [
    {
      id: "natufian",
      year: -12500,
      label: "Natufian cultural complex",
      description: "Late Epipalaeolithic Levant. Cultural geometry represents archaeological evidence, not territory.",
      games: ["race", "civilisation"],
      historicalGame: null
    },
    {
      id: "catalhoyuk",
      year: -7000,
      label: "Çatalhöyük",
      description: "Neolithic settlement complex on the Konya plain. The map marks a site-based archaeological layer, not a polity.",
      games: ["civilisation"],
      historicalGame: null
    },
    {
      id: "lbk",
      year: -5300,
      label: "Linear Pottery culture (LBK)",
      description: "Early farming horizon across temperate Europe. The envelope represents archaeological distribution, not ethnicity or language.",
      games: ["civilisation"],
      historicalGame: null
    },
    {
      id: "cucuteni-trypillia",
      year: -4100,
      label: "Cucuteni–Trypillia complex",
      description: "Neolithic–Chalcolithic cultural complex of parts of present-day Romania, Moldova and Ukraine, including later megasites.",
      games: ["civilisation"],
      historicalGame: null
    },
    {
      id: "yamnaya",
      year: -2900,
      label: "Yamnaya horizon",
      description: "Pontic–Caspian Early Bronze Age archaeological horizon. Polygon is an evidence envelope, not a state border.",
      games: ["civilisation"],
      historicalGame: null
    },
    {
      id: "corded-ware",
      year: -2600,
      label: "Corded Ware horizon",
      description: "Late Neolithic–Early Bronze Age archaeological horizon across broad parts of Europe, with substantial regional variation.",
      games: ["civilisation"],
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
      updateAvailability();
      const requestedMode = requested.mode;
      if (requestedMode === "chess" && getCurrentNode().year < FIRST_CHESS_YEAR) setMode("civilisation");
      else if (requestedMode === "games" && getCurrentNode().year < FIRST_GAME_YEAR) setMode("civilisation");
      else if (["games", "civilisation", "diplomacy", "chess"].includes(requestedMode)) setMode(requestedMode);
      restoreMapWhenReady(requested);
    }
  });
})();