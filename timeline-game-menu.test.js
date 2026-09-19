"use strict";
const fs=require("fs");
const source=fs.readFileSync("atlas-games-integration.js","utf8");
test("timeline menus use the current game's origin node rather than cumulative history",()=>{
  expect(source).toContain("function gamesAtNode(node,familyTest)");
  expect(source).toContain("const id=node.boardGameId");
  expect(source).not.toContain("g.sortEra<=year&&g.timelineEligible!==false");
});
test("empty origin-node menus collapse rather than describe persistent availability",()=>{\n  expect(source).toContain("menu.hidden=!games.length");\n  expect(source).toContain("setModeAvailability");\n  expect(source).not.toContain("No new playable chess-family game is introduced at this timeline node.");\n});
