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

test("Atlas routes ancient and future game nodes without changing chess rules", () => {
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
  require("./stateGraph.js");
  require("./chess.js");

  new Function(`${atlasSource}\n${integrationSource}`)();
  document.dispatchEvent(new Event("DOMContentLoaded"));

  const navLink = document.querySelector(
    '.atlas-modes a[href="historical-play.html"]'
  );
  expect(navLink).not.toBeNull();
  expect(navLink.textContent).toContain("Ancient Games");

  const down = document.getElementById("timeline-down");
  for (let step = 0; step < 7; step += 1) {
    down.click();
  }

  expect(document.getElementById("atlas-period").textContent).toBe("Senet");
  expect(document.getElementById("board").hidden).toBe(true);
  expect(
    document.querySelector('#status a[href="historical-play.html?game=senet"]')
  ).not.toBeNull();

  down.click();
  expect(document.getElementById("atlas-period").textContent).toBe(
    "Royal Game of Ur"
  );
  expect(
    document.querySelector('#status a[href="historical-play.html?game=ur"]')
  ).not.toBeNull();

  for (let step = 0; step < 10; step += 1) {
    document.getElementById("timeline-up").click();
  }
  expect(document.getElementById("atlas-year").textContent).toBe("2200 CE");
  expect(
    document.querySelector('#status a[href="advanced-play.html"]')
  ).not.toBeNull();
});
