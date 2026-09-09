"use strict";

(() => {
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
