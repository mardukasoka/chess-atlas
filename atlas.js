"use strict";

/*
 * Chess Atlas — temporal/world navigation proof of concept.
 *
 * This layer does NOT own chess, diplomacy or civilisation rules.
 * It tells each game which world, date, timeline and region it is viewing.
 */

const ATLAS_WORLD = {
  worldId: "earth-main",
  timelineId: "history",
  region: "world",

  nodes: [
    {
      id: "ancient",
      year: -2500,
      label: "Ancient World",
      description: "Early states, trade networks and race games.",
      games: ["race"]
    },
    {
      id: "chaturanga",
      year: 600,
      label: "Chaturanga",
      description: "Early Indian chess tradition.",
      games: ["chess", "civilisation"]
    },
    {
      id: "shatranj",
      year: 800,
      label: "Shatranj",
      description: "Chess spreads through the Islamic world.",
      games: ["chess", "civilisation", "diplomacy"]
    },
    {
      id: "classical",
      year: 1500,
      label: "Modern Chess Emerges",
      description: "European chess approaches its modern rules.",
      games: ["chess", "civilisation", "diplomacy"]
    },
    {
      id: "industrial",
      year: 1800,
      label: "Industrial World",
      description: "Population, industry and interstate competition accelerate.",
      games: ["chess", "civilisation", "diplomacy"]
    },
    {
      id: "present",
      year: 2026,
      label: "Present",
      description: "Observed history reaches the simulation boundary.",
      games: ["chess", "civilisation", "diplomacy"]
    },
    {
      id: "near-future",
      year: 2050,
      label: "Modelled Future",
      description: "Population and political trajectories become simulations.",
      games: ["chess", "civilisation", "diplomacy", "infinite"]
    },
    {
      id: "far-future",
      year: 2200,
      label: "Speculative Future",
      description: "Alternative futures and fictional scenarios branch outward.",
      games: ["civilisation", "diplomacy", "infinite"]
    }
  ]
};

let currentNodeIndex = ATLAS_WORLD.nodes.findIndex(
  node => node.id === "present"
);

let currentMode = "chess";

function getCurrentNode() {
  return ATLAS_WORLD.nodes[currentNodeIndex];
}

function formatYear(year) {
  if (year < 0) {
    return `${Math.abs(year)} BCE`;
  }

  return `${year} CE`;
}

function setMode(mode) {
  currentMode = mode;

  document.querySelectorAll(".atlas-mode").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.mode === currentMode
    );
  });

  renderMode();
}

function moveTimeline(direction) {
  const nextIndex = currentNodeIndex + direction;

  if (
    nextIndex < 0 ||
    nextIndex >= ATLAS_WORLD.nodes.length
  ) {
    return;
  }

  currentNodeIndex = nextIndex;
  renderTimeline();
  renderMode();
}

function renderTimeline() {
  const node = getCurrentNode();

  document.getElementById("atlas-year").textContent =
    formatYear(node.year);

  document.getElementById("atlas-period").textContent =
    node.label;

  document.getElementById("atlas-description").textContent =
    node.description;

  document.getElementById("timeline-up").disabled =
    currentNodeIndex === ATLAS_WORLD.nodes.length - 1;

  document.getElementById("timeline-down").disabled =
    currentNodeIndex === 0;
}

function renderMode() {
  const node = getCurrentNode();

  const board = document.getElementById("board");
  const chessControls = document.getElementById("chess-controls");
  const worldPanel = document.getElementById("world-panel");

  if (currentMode === "chess") {
    board.hidden = false;
    chessControls.hidden = false;
    worldPanel.hidden = true;
    return;
  }

  board.hidden = true;
  chessControls.hidden = true;
  worldPanel.hidden = false;

  const available = node.games.includes(currentMode);

  const labels = {
    diplomacy: "Diplomacy",
    civilisation: "Civilisation"
  };

  document.getElementById("world-mode-title").textContent =
    labels[currentMode] || currentMode;

  if (available) {
    document.getElementById("world-mode-status").textContent =
      `${labels[currentMode]} view — ${node.label}, ${formatYear(node.year)}`;

    document.getElementById("world-mode-detail").textContent =
      `World: ${ATLAS_WORLD.worldId} · Timeline: ${ATLAS_WORLD.timelineId} · Region: ${ATLAS_WORLD.region}`;
  } else {
    document.getElementById("world-mode-status").textContent =
      `${labels[currentMode]} is not yet available at this historical node.`;

    document.getElementById("world-mode-detail").textContent =
      "The timeline remains fixed. Choose another representation or period.";
  }
}

function initialiseAtlas() {
  document
    .getElementById("timeline-up")
    .addEventListener("click", () => moveTimeline(1));

  document
    .getElementById("timeline-down")
    .addEventListener("click", () => moveTimeline(-1));

  document.querySelectorAll(".atlas-mode").forEach(button => {
    button.addEventListener("click", () => {
      setMode(button.dataset.mode);
    });
  });

  renderTimeline();
  setMode("chess");
}

document.addEventListener("DOMContentLoaded", initialiseAtlas);