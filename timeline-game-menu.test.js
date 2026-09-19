"use strict";
const fs=require("fs");
const source=fs.readFileSync("atlas-games-integration.js","utf8");
test("timeline menus use the current game's origin node rather than cumulative history",()=>{
  expect(source).toContain("function gamesAtNode(node,familyTest)");
  expect(source).toContain("const id=node.boardGameId");
  expect(source).not.toContain("g.sortEra<=year&&g.timelineEligible!==false");
});
test("timeline menu copy describes introduction rather than persistent availability",()=>{
  expect(source).toContain("No new playable non-chess game is introduced at this timeline node.");
  expect(source).toContain("No new playable chess-family game is introduced at this timeline node.");
});
