"use strict";

/*
 * Connects the provenance-aware game registry to the Atlas timeline without
 * coupling historical metadata to individual rule engines.
 */
(() => {
  const registry = window.ChessAtlasGameRegistry;

  const playableRoutes = Object.freeze({
    senet: "historical-play.html?game=senet",
    ur: "historical-play.html?game=ur",
    latrunculi: "latrunculi-play.html",
    "nine-mens-morris": "historical-play.html?game=morris",
    hnefatafl: "hnefatafl-play.html",
    alquerque: "alquerque-play.html",
    pachisi: "pachisi-play.html",
    konane: "historical-play.html?game=konane",
    tablut: "tablut-play.html"
  });

  const excludedFamilies = new Set(["chess", "advanced-chess"]);

  function evidenceSummary(game) {
    const profiles = game.rulesProfiles || [];
    if (!profiles.length) {
      return game.uncertainty
        ? `Historical attribution uncertainty: ${game.uncertainty}.`
        : "Historical rule evidence varies by period and source.";
    }

    const playable = profiles.find(profile => profile.status === "playable");
    if (!playable) return profiles[0].note;

    if (playable.confidence === "reconstruction") {
      return `Playable rules: ${playable.attribution} (${playable.date}), explicitly a modern reconstruction.`;
    }

    return `Playable rules: ${playable.attribution} (${playable.date}); evidence class: ${playable.confidence}.`;
  }

  function makeHistoricalNode(game) {
    return {
      id: `game-${game.id}`,
      year: game.sortEra,
      label: game.name,
      description: `${game.origin}. ${evidenceSummary(game)}`,
      games: [game.family, "civilisation"],
      historicalGame: null,
      boardGameId: game.id,
      boardPage: playableRoutes[game.id] || null,
      evidenceUncertainty: game.uncertainty || "unspecified"
    };
  }

  if (registry) {
    registry.chronologicalGames()
      .filter(game => !excludedFamilies.has(game.family))
      .filter(game => game.timelineEligible !== false)
      .filter(game => playableRoutes[game.id])
      .forEach(game => {
        const id = `game-${game.id}`;
        if (!ATLAS_WORLD.nodes.some(node => node.id === id)) {
          ATLAS_WORLD.nodes.push(makeHistoricalNode(game));
        }
      });

    ATLAS_WORLD.nodes.sort((a, b) => a.year - b.year || a.label.localeCompare(b.label));
    currentNodeIndex = ATLAS_WORLD.nodes.findIndex(node => node.id === "present");
  }

  const futureNode = ATLAS_WORLD.nodes.find(node => node.id === "far-future");
  if (futureNode) {
    futureNode.description =
      "Tesseract, Infinite, timeline and quantum variants branch beyond historical chess; these are modern authored or implementation-defined variants, not historical continuations.";
    futureNode.games = [
      ...new Set([...futureNode.games, "4d", "5d", "quantum"])
    ];
    futureNode.futureGames = true;
  }

  const baseRenderMode = renderMode;

  renderMode = function renderIntegratedMode() {
    baseRenderMode();

    const node = getCurrentNode();

    if (currentMode === "civilisation") {
      const detail = document.getElementById("world-mode-detail");
      if (detail && node.boardGameId && registry) {
        const game = registry.getGame(node.boardGameId);
        if (game) {
          detail.textContent =
            `${game.name} · ${game.origin} · rules uncertainty: ${game.uncertainty || "unspecified"}`;
        }
      }
      return;
    }

    if (currentMode !== "chess") return;

    const board = document.getElementById("board");
    if (!board.hidden) return;

    const status = document.getElementById("status");

    if (node.boardPage) {
      const uncertainty = node.evidenceUncertainty
        ? ` Evidence uncertainty: ${node.evidenceUncertainty}.`
        : "";
      status.innerHTML =
        `${node.label} has a separate lightweight historical board.${uncertainty} ` +
        `<a href="${node.boardPage}">Play ${node.label} →</a>`;
      return;
    }

    if (node.futureGames) {
      status.innerHTML =
        "Future chess branches from this node. " +
        '<a href="advanced-play.html">Open Future Chess →</a>';
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    const nav = document.querySelector(".atlas-modes");
    if (!nav || nav.querySelector('[href="historical-play.html"]')) return;

    const link = document.createElement("a");
    link.className = "atlas-mode";
    link.href = "historical-play.html";
    link.textContent = "◈ Historical Games";

    const civilisation = nav.querySelector('[data-mode="civilisation"]');
    nav.insertBefore(link, civilisation || null);
  });
})();
