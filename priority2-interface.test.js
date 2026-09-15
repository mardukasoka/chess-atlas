const fs = require("fs");

describe("Priority 2 interface continuity", () => {
  test("God's Eye globe is the default world surface", () => {
    const html = fs.readFileSync("index.html", "utf8");
    const atlas = fs.readFileSync("atlas.js", "utf8");
    expect(html).toContain('data-world-renderer="globe"');
    expect(html).toContain('id="world-map" class="world-map" role="application" aria-label="Interactive Atlas flat map" hidden');
    expect(html).toContain("globi-renderer-adapter.js");
    expect(atlas).toContain('currentWorldRenderer=localStorage.getItem(WORLD_RENDERER_KEY)==="flat"?"flat":"globe"');
  });

  test("the shared navigator covers the completed regional boards", () => {
    const catalogue = fs.readFileSync("game-catalogue.js", "utf8");
    for (const route of ["go-play.html", "backgammon-play.html", "xiangqi-play.html", "shogi-play.html", "janggi-play.html"]) {
      expect(catalogue).toContain(route);
    }
    expect(catalogue).toContain("ChessAtlasTimeState?.addToRoute");
  });

  test("board viewport state survives page-level mobile navigation", () => {
    const viewport = fs.readFileSync("board-viewport.js", "utf8");
    expect(viewport).toContain("chess-atlas-board-view:");
    expect(viewport).toContain("sessionStorage.getItem");
    expect(viewport).toContain("sessionStorage.setItem");
  });
});
