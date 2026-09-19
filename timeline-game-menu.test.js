"use strict";
const fs=require("fs");
const source=fs.readFileSync("atlas-games-integration.js","utf8");
test("timeline menus use origin-node game identity rather than cumulative year filtering",()=>{
  expect(source).toContain("node.boardGameId");
  expect(source).toContain("g.timelineEligible!==false");
  expect(source).not.toContain("g.sortEra<=year&&g.timelineEligible!==false");
});
test("empty origin-node menus collapse rather than describe persistent availability",()=>{
  expect(source).toContain("menu.hidden=!games.length");
  expect(source).toContain("setModeAvailability");
  expect(source).not.toContain("No new playable chess-family game is introduced at this timeline node.");
});
