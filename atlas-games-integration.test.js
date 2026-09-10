/**
 * @jest-environment jsdom
 */

const fs = require("fs");
const path = require("path");

if (typeof global.structuredClone !== "function") {
  global.structuredClone = value => JSON.parse(JSON.stringify(value));
}

const indexHtml = fs.readFileSync(
  path.join(__dirname, "index.html"),
  "utf8"
);
const bodyHtml = indexHtml.match(/<body[^>]*>([\s\S]*)<\/body>/i)[1];
const atlasSource = fs.readFileSync(
  path.join(__dirname, "atlas.js"),
  "utf8"
);
const integrationSource = fs.readFileSync(
  path.join(__dirname, "atlas-games-integration.js"),
  "utf8"
);

function moveUntil(buttonId, expectedPeriod, maxSteps = 40) {
  const button = document.getElementById(buttonId);
  for (let step = 0; step < maxSteps; step += 1) {
    if (document.getElementById("atlas-period").textContent === expectedPeriod) return;
    if (button.disabled) break;
    button.click();
  }
  throw new Error(`Timeline did not reach ${expectedPeriod}`);
}

test("Atlas routes ancient and future game nodes without changing chess rules", () => {
  jest.resetModules();
  document.body.innerHTML = bodyHtml;
  localStorage.clear();

  global.AtlasGeography = window.AtlasGeography = {
    load: jest.fn(() => Promise.resolve({}))
  };
  global.AtlasMapRenderer = window.AtlasMapRenderer = class {
    resetWorld() {}
    focusSelection() {}
  };
  window.ChessEngine = require("./engine.js");
  window.ChessAtlasGameRegistry = require("./game-registry.js");
  require("./stateGraph.js");
  require("./chess.js");

  new Function(`${atlasSource}\n${integrationSource}`)();
  document.dispatchEvent(new Event("DOMContentLoaded"));

  const navLink = document.querySelector(
    '.atlas-modes a[href="historical-play.html"]'
  );
  expect(navLink).not.toBeNull();
  expect(navLink.textContent).toContain("Ancient Games");

  moveUntil("timeline-down", "Senet");
  expect(document.getElementById("board").hidden).toBe(true);
  expect(
    document.querySelector('#status a[href="historical-play.html?game=senet"]')
  ).not.toBeNull();

  moveUntil("timeline-up", "Royal Game of Ur");
  expect(
    document.querySelector('#status a[href="historical-play.html?game=ur"]')
  ).not.toBeNull();

  moveUntil("timeline-up", "Speculative Future");
  expect(document.getElementById("atlas-year").textContent).toBe("2200 CE");
  expect(
    document.querySelector('#status a[href="advanced-play.html"]')
  ).not.toBeNull();
});
