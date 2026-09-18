"use strict";
const Engine=require("./alquerque.js");
const Modules=require("./game-modules.js");
Modules.clear();require("./alquerque-module.js");
const Agents=require("./game-agents.js");
const Specialist=require("./alquerque-agent.js");
describe("Alquerque specialist agent",()=>{test("chooses only an Atlas-legal action",async()=>{const game=Modules.create("alquerque-alfonso-1283");const legal=Modules.legalActions("alquerque-alfonso-1283",game);const action=await Agents.choose(Specialist.create({depth:2}),{gameId:"alquerque-alfonso-1283",game,legalActions:legal});expect(legal).toContain(action)});test("takes a turn through the common agent seam",async()=>{const game=Modules.create("alquerque-alfonso-1283");const before=game.turn;const turn=await Agents.takeTurn({modules:Modules,gameId:"alquerque-alfonso-1283",game,agent:Specialist.create({depth:1})});expect(turn.status).toBe("applied");expect(game.turn).not.toBe(before)});});