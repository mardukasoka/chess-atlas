"use strict";

/*
 * Chess Atlas — temporal/world navigation + first campaign slice.
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
      id: "punic-opening",
      year: -218,
      label: "Second Punic War",
      description: "Hannibal leaves Iberia and advances toward Italy.",
      games: ["chess", "civilisation", "diplomacy"],
      campaign: {
        title: "Hannibal's Italian Campaign",
        sides: "Rome vs Carthage",
        status: "Campaign begins",
        chessWhite: "Rome",
        chessBlack: "Carthage"
      }
    },

    {
      id: "cannae",
      year: -216,
      label: "Battle of Cannae",
      description: "A major confrontation between Rome and Hannibal.",
      games: ["chess", "civilisation", "diplomacy"],
      campaign: {
        title: "Cannae",
        sides: "Rome vs Carthage",
        status: "Conflict available for resolution",
        chessWhite: "Rome",
        chessBlack: "Carthage"
      }
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
let atlasMap = null;
let atlasMapError = null;

function getCurrentNode() {
  return ATLAS_WORLD.nodes[currentNodeIndex];
}

function formatYear(year) {
  return year < 0
    ? `${Math.abs(year)} BCE`
    : `${year} CE`;
}

function ensureCampaignPanel() {
  if (document.getElementById("campaign-panel")) {
    return;
  }

  const panel = document.createElement("section");

  panel.id = "campaign-panel";
  panel.className = "campaign-panel";
  panel.hidden = true;

  panel.innerHTML = `
    <small>ACTIVE CAMPAIGN</small>

    <h2 id="campaign-title"></h2>

    <p id="campaign-sides"></p>

    <p id="campaign-status"></p>

    <div class="campaign-actions">
      <button id="resolve-chess">
        ♟ Chess
      </button>

      <button id="resolve-diplomacy">
        🤝 Diplomacy
      </button>

      <button id="resolve-history">
        ▶ Historical
      </button>
    </div>

    <p id="campaign-result"></p>
  `;

  const gameSpace = document.getElementById("game-space");
  gameSpace.parentNode.insertBefore(panel, gameSpace);

  document
    .getElementById("resolve-chess")
    .addEventListener("click", resolveByChess);

  document
    .getElementById("resolve-diplomacy")
    .addEventListener("click", resolveByDiplomacy);

  document
    .getElementById("resolve-history")
    .addEventListener("click", resolveHistorically);
}

function renderCampaign() {
  const node = getCurrentNode();
  const panel = document.getElementById("campaign-panel");

  if (!node.campaign) {
    panel.hidden = true;
    return;
  }

  panel.hidden = false;

  document.getElementById("campaign-title").textContent =
    node.campaign.title;

  document.getElementById("campaign-sides").textContent =
    node.campaign.sides;

  document.getElementById("campaign-status").textContent =
    node.campaign.status;

  document.getElementById("campaign-result").textContent = "";
}

function resolveByChess() {
  const node = getCurrentNode();

  setMode("chess");

  document.getElementById("campaign-result").textContent =
    `${node.campaign.chessWhite} = White · ${node.campaign.chessBlack} = Black. Chess will resolve the strategic confrontation.`;
}

function resolveByDiplomacy() {
  setMode("diplomacy");

  document.getElementById("campaign-result").textContent =
    "Diplomacy selected. The campaign date and world state remain unchanged.";
}

function resolveHistorically() {
  const node = getCurrentNode();

  if (node.id === "cannae") {
    document.getElementById("campaign-result").textContent =
      "Historical path: Carthaginian victory at Cannae. The campaign continues rather than ending the war.";
  } else {
    document.getElementById("campaign-result").textContent =
      "Historical path selected. Advance the timeline to continue.";
  }
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
  renderCampaign();
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
  const chessControls =
    document.getElementById("chess-controls");

  const worldPanel =
    document.getElementById("world-panel");

  if (currentMode === "chess") {
    board.hidden = false;
    chessControls.hidden = false;
    worldPanel.hidden = true;
    return;
  }

  board.hidden = true;
  chessControls.hidden = true;
  worldPanel.hidden = false;

  const available =
    node.games.includes(currentMode);

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

  if (atlasMapError) {
    document.getElementById("world-mode-status").textContent =
      `The common world map could not load: ${atlasMapError.message}`;
  }
}

function initialiseAtlas() {
  ensureCampaignPanel();

  const mapViewport = document.getElementById("world-map");
  const mapSummary = document.getElementById("world-map-summary");
  AtlasGeography.load("data/earth-main-v0.1.json")
    .then(geography => {
      atlasMap = new AtlasMapRenderer({
        viewport: mapViewport,
        geography,
        summary: mapSummary
      });
      document
        .getElementById("reset-world")
        .addEventListener("click", () => atlasMap.resetWorld());
      document
        .getElementById("focus-selection")
        .addEventListener("click", () => atlasMap.focusSelection());
      renderMode();
    })
    .catch(error => {
      atlasMapError = error;
      mapSummary.textContent = "The Atlas world map is unavailable.";
      renderMode();
    });

  document
    .getElementById("timeline-up")
    .addEventListener(
      "click",
      () => moveTimeline(1)
    );

  document
    .getElementById("timeline-down")
    .addEventListener(
      "click",
      () => moveTimeline(-1)
    );

  document.querySelectorAll(".atlas-mode").forEach(button => {
    button.addEventListener("click", () => {
      setMode(button.dataset.mode);
    });
  });

  renderTimeline();
  renderCampaign();
  setMode("chess");
}

document.addEventListener(
  "DOMContentLoaded",
  initialiseAtlas
);