"use strict";

/* Shared, lightweight navigation for every playable Chess Atlas board. */
(() => {
  if (window.ChessAtlasGameCatalogueLoaded) return;
  window.ChessAtlasGameCatalogueLoaded = true;
  const games = Object.freeze([
    { era: "c. 3000 BCE", name: "Senet", href: "historical-play.html?game=senet", match: ["historical-play.html", "senet"] },
    { era: "c. 2600 BCE", name: "Royal Game of Ur", href: "historical-play.html?game=ur", match: ["historical-play.html", "ur"] },
    { era: "Roman era", name: "Ludus Latrunculorum", href: "latrunculi-play.html" },
    { era: "historic", name: "Nine Men’s Morris", href: "historical-play.html?game=morris", match: ["historical-play.html", "morris"] },
    { era: "ancient China", name: "Go / Weiqi / Baduk", href: "go-play.html" },
    { era: "c. 600 CE", name: "Chaturanga", href: "index.html?game=chaturanga", match: ["index.html", "chaturanga"] },
    { era: "c. 800 CE", name: "Hnefatafl", href: "hnefatafl-play.html" },
    { era: "c. 800 CE", name: "Shatranj", href: "index.html?game=shatranj", match: ["index.html", "shatranj"] },
    { era: "medieval China", name: "Xiangqi", href: "xiangqi-play.html" },
    { era: "11th c. CE", name: "Shogi", href: "shogi-play.html" },
    { era: "Goryeo period", name: "Janggi", href: "janggi-play.html" },
    { era: "1283 CE", name: "Alquerque de Doze", href: "alquerque-play.html" },
    { era: "1283 CE", name: "Acedrex", href: "index.html?game=acedrex", match: ["index.html", "acedrex"] },
    { era: "historic", name: "Pachisi", href: "pachisi-play.html" },
    { era: "historic", name: "Chaupar / Chausar", href: "chaupar-play.html" },
    { era: "historic Thailand", name: "Makruk", href: "index.html?game=makruk", match: ["index.html", "makruk"] },
    { era: "documented 1795", name: "Sittuyin", href: "sittuyin-play.html" },
    { era: "traditional Mongolia", name: "Shatar", href: "shatar-play.html" },
    { era: "c. 1500 CE", name: "Modern Chess", href: "index.html?game=modern", match: ["index.html", "modern"] },
    { era: "pre-contact Hawaiʻi", name: "Kōnane", href: "historical-play.html?game=konane", match: ["historical-play.html", "konane"] },
    { era: "17th c. CE", name: "Backgammon", href: "backgammon-play.html" },
    { era: "1732 CE", name: "Tablut", href: "tablut-play.html" },
    { era: "19th c. CE", name: "Mahjong", href: "mahjong-play.html" },
    { era: "future", name: "Infinite / 4D Chess", href: "advanced-play.html" }
  ]);

  function currentPath() {
    const file = location.pathname.split("/").pop() || "index.html";
    return file === "" ? "index.html" : file;
  }

  function selectedHref() {
    const file = currentPath();
    const requested = new URLSearchParams(location.search).get("game");
    const exact = games.find(game => game.match && game.match[0] === file && game.match[1] === requested);
    if (exact) return exact.href;
    const page = games.find(game => !game.match && game.href.split("?")[0] === file);
    if (page) return page.href;
    if (file === "historical-play.html") return "historical-play.html?game=ur";
    if (file === "index.html") return `index.html?game=${requested || "modern"}`;
    return "";
  }

  function applyRequestedMainGame() {
    if (currentPath() !== "index.html") return;
    const requested = new URLSearchParams(location.search).get("game");
    const select = document.getElementById("game-variant");
    if (!requested || !select || ![...select.options].some(option => option.value === requested)) return;
    select.value = requested;
    select.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function capability(route) {
    const page = route.split("?")[0];
    if (page === "advanced-play.html") return "Experimental board";
    if (["go-play.html", "backgammon-play.html", "xiangqi-play.html", "shogi-play.html", "janggi-play.html", "sittuyin-play.html", "shatar-play.html", "courier-play.html", "historical-play.html", "mahjong-play.html"].includes(page)) return "Playable · local agent";
    return "Playable";
  }

  function mount() {
    if (document.getElementById("atlas-game-catalogue")) return;
    const shell = document.createElement("section");
    shell.id = "atlas-game-catalogue";
    shell.className = "atlas-game-catalogue";
    shell.innerHTML = `<label for="atlas-game-jump"><span>Playable Atlas</span><small>all-games catalogue · independent of timeline</small></label><div class="atlas-game-choice"><select id="atlas-game-jump" aria-label="Choose a playable Chess Atlas game">${games.map(game => `<option value="${game.href}">${game.era} · ${game.name}</option>`).join("")}</select><output id="atlas-game-capability"></output></div>`;
    const host = document.querySelector(".variant-control, .control-card, .future-header, .history-header, header");
    if (host && host.classList.contains("variant-control")) host.before(shell);
    else if (host) host.after(shell);
    else document.querySelector("main")?.prepend(shell);
    const select = shell.querySelector("select");
    const capabilityOutput = shell.querySelector("output");
    const current = selectedHref();
    if (current) select.value = current;
    const updateCapability = () => { capabilityOutput.textContent = capability(select.value); };
    updateCapability();
    select.addEventListener("change", () => {
      updateCapability();
      const state = window.ChessAtlasTimeState?.read(location.search) || {};
      const route = window.ChessAtlasTimeState?.addToRoute(select.value, state) || select.value;
      localStorage.setItem("chess-atlas-last-game-route", route);
      location.href = route;
    });
    applyRequestedMainGame();
  }

  const style = document.createElement("style");
  style.textContent = ".atlas-game-catalogue{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:8px 0;padding:8px 10px;border:1px solid #343a46;border-radius:12px;background:#171a20;color:#f3f3f4}.atlas-game-catalogue label{display:grid;gap:1px;font-weight:700;text-align:left}.atlas-game-catalogue small{font-weight:400;color:#aeb5c0}.atlas-game-choice{display:grid;gap:3px;min-width:0;width:min(62%,350px)}.atlas-game-catalogue select{min-width:0;width:100%;padding:9px;border:1px solid #465064;border-radius:9px;background:#242a34;color:#fff;font:inherit}.atlas-game-catalogue output{color:#9fd5ad;font-size:.72rem;text-align:right}@media(max-width:520px){.atlas-game-catalogue{display:grid;grid-template-columns:auto minmax(0,1fr);align-items:center;margin:6px 0;padding:7px 8px}.atlas-game-catalogue label span{font-size:.88rem}.atlas-game-catalogue label small{display:none}.atlas-game-choice{width:100%}.atlas-game-catalogue select{padding:8px;font-size:.86rem}}";
  document.head.appendChild(style);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
