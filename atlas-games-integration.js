"use strict";

/*
 * Extends the Atlas timeline with non-chess historical games and future chess
 * without coupling their rule engines to the main chess board.
 */
(() => {
  const ancientIndex = ATLAS_WORLD.nodes.findIndex(
    node => node.id === "ancient"
  );

  if (ancientIndex >= 0) {
    ATLAS_WORLD.nodes[ancientIndex] = {
      ...ATLAS_WORLD.nodes[ancientIndex],
      id: "senet",
      label: "Senet",
      description:
        "Ancient Egyptian board-game tradition. Exact play is reconstructed because no complete ancient rulebook survives.",
      boardGame: "senet"
    };

    ATLAS_WORLD.nodes.splice(ancientIndex, 0, {
      id: "ur",
      year: -2600,
      label: "Royal Game of Ur",
      description:
        "Mesopotamian race-game tradition; surviving boards precede the later cuneiform rules evidence.",
      games: ["race"],
      historicalGame: null,
      boardGame: "ur"
    });

    currentNodeIndex = ATLAS_WORLD.nodes.findIndex(
      node => node.id === "present"
    );
  }

  const futureNode = ATLAS_WORLD.nodes.find(
    node => node.id === "far-future"
  );

  if (futureNode) {
    futureNode.description =
      "Tesseract, Infinite, timeline and quantum variants branch beyond historical chess.";
    futureNode.games = [
      ...new Set([
        ...futureNode.games,
        "4d",
        "5d",
        "quantum"
      ])
    ];
    futureNode.futureGames = true;
  }

  const baseRenderMode = renderMode;

  renderMode = function renderIntegratedMode() {
    baseRenderMode();

    if (currentMode !== "chess") {
      return;
    }

    const node = getCurrentNode();
    const board = document.getElementById("board");

    if (!board.hidden) {
      return;
    }

    const status = document.getElementById("status");

    if (node.boardGame) {
      status.innerHTML =
        `${node.label} is available in the ancient-games board. ` +
        `<a href="historical-play.html?game=${node.boardGame}">Play ${node.label} →</a>`;
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

    if (!nav || nav.querySelector('[href="historical-play.html"]')) {
      return;
    }

    const link = document.createElement("a");
    link.className = "atlas-mode";
    link.href = "historical-play.html";
    link.textContent = "◈ Ancient Games";

    const diplomacy = nav.querySelector('[data-mode="diplomacy"]');
    nav.insertBefore(link, diplomacy || null);
  });
})();
