"use strict";

(() => {
  if (!document.querySelector('script[src^="game-catalogue.js"]')) {
    const catalogue = document.createElement("script");
    catalogue.src = "game-catalogue.js?v=2";
    catalogue.defer = true;
    document.head.appendChild(catalogue);
  }
  if (!document.querySelector('script[src^="agent-status.js"]')) {
    const agentStatus = document.createElement("script");
    agentStatus.src = "agent-status.js?v=1";
    agentStatus.defer = true;
    document.head.appendChild(agentStatus);
  }
  const TimeState = window.ChessAtlasTimeState;
  if (!TimeState) return;
  const state = TimeState.read(window.location.search);
  if (!state.nodeId && !state.mode) return;

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || /^(?:https?:|mailto:|#)/i.test(href)) return;
    if (!/\.html(?:[?#]|$)/i.test(href)) return;
    link.setAttribute('href', TimeState.addToRoute(href, state));
  });
})();

/* Compact presentation when a game is hosted by the Atlas timeline. */
const atlasEmbed = new URLSearchParams(window.location.search).get("embed") === "1";
if (atlasEmbed) {
  document.documentElement.classList.add("atlas-embedded");
  const style = document.createElement("style");
  style.textContent = `
    html.atlas-embedded,html.atlas-embedded body{min-height:100%;overflow-y:auto!important;overscroll-behavior:auto!important}
    html.atlas-embedded body{padding:0!important}
    html.atlas-embedded header,html.atlas-embedded .top,html.atlas-embedded .history-header,
    html.atlas-embedded .eyebrow,html.atlas-embedded .subtitle,html.atlas-embedded .back-link,
    html.atlas-embedded .note,html.atlas-embedded .note-card,
    html.atlas-embedded .atlas-board-zoom-controls{display:none!important}
    html.atlas-embedded main,html.atlas-embedded .shell,html.atlas-embedded .history-shell{padding:6px!important;margin:0 auto!important}
    html.atlas-embedded [data-atlas-zoom-board]{margin:4px auto!important}
    html.atlas-embedded .game-card,html.atlas-embedded .board-card,html.atlas-embedded .board-panel{margin-top:4px!important}
  `;
  document.head.appendChild(style);
}
