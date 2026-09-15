"use strict";

/* Shared mobile status and persistence for lightweight game opponents. */
(() => {
  const labels = Object.freeze({
    human: ["Human play", "Two-player local game"],
    agent: ["Local Atlas agent", "Chooses only from rules-validated moves"],
    random: ["Local agent · random", "On-device random legal move"],
    heuristic: ["Local agent · heuristic", "On-device rules-aware scoring"]
  });

  function storageKey(select) {
    return `chess-atlas-opponent:${location.pathname}:${select.id}`;
  }

  function findOpponent() {
    return document.querySelector('select[id$="-opponent"], #history-opponent');
  }

  function mount() {
    const select = findOpponent();
    if (!select || document.getElementById("atlas-agent-status")) return;

    const saved = localStorage.getItem(storageKey(select));
    if (saved && [...select.options].some(option => option.value === saved)) {
      select.value = saved;
      select.dispatchEvent(new Event("change", { bubbles: true }));
    }

    const status = document.createElement("aside");
    status.id = "atlas-agent-status";
    status.className = "atlas-agent-status";
    status.setAttribute("aria-live", "polite");

    const update = () => {
      const [title, detail] = labels[select.value] || ["Specialist engine", "Connection required before play"];
      status.innerHTML = `<strong>${title}</strong><small>${detail} · rules engine remains authoritative</small>`;
      status.dataset.agentTier = select.value;
      localStorage.setItem(storageKey(select), select.value);
    };

    const controls = select.closest(".controls, .history-controls, .control-card") || select.parentElement;
    controls.insertAdjacentElement("afterend", status);
    select.addEventListener("change", update);
    update();
  }

  const style = document.createElement("style");
  style.textContent = ".atlas-agent-status{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:7px 0;padding:7px 9px;border:1px solid #354052;border-radius:10px;background:#171c24;color:#eef2f6;text-align:left}.atlas-agent-status strong{font-size:.8rem;color:#9fd5ad}.atlas-agent-status small{font-size:.68rem;color:#aeb8c5;text-align:right}@media(max-width:520px){.atlas-agent-status{align-items:flex-start}.atlas-agent-status small{max-width:62%}}";
  document.head.appendChild(style);

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
