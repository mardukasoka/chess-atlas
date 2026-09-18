"use strict";
describe("regional Fairy-Stockfish activation gate",()=>{test("stays unavailable without injected engine bytes",()=>{delete global.FairyStockfishFactory;global.ChessAtlasFairyStockfishTransport={};global.ChessAtlasFairyStockfishAgent={};jest.resetModules();const G=require("./regional-fairy-stockfish.js");expect(G.available()).toBe(false)});});
