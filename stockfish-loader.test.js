"use strict";

const Loader=require("./stockfish-loader.js");

test("Stockfish stays unloaded until explicitly requested",()=>{
  const calls=[];
  const fakeTransport={createFromUrl(url){calls.push(url);return {send(){},waitForBestmove(){return Promise.resolve("bestmove e2e4");},stop(){},dispose(){}};}};
  const fakeStockfish={
    createUciTransport(){return {bestMove:async()=>"e2e4"};},
    stockfishAgent({transport}){return {id:"stockfish",chooseAction:ctx=>transport.bestMove().then(uci=>ctx.legalActions.find(a=>a.uci===uci))};}
  };
  const loader=Loader.create({workerTransport:fakeTransport,stockfish:fakeStockfish});
  expect(loader.loaded).toBe(false);
  expect(calls).toEqual([]);
  const agent=loader.load();
  expect(agent.id).toBe("stockfish");
  expect(loader.loaded).toBe(true);
  expect(calls).toEqual(["vendor/stockfish/stockfish-18-lite-single.js"]);
});

test("Stockfish loader is idempotent and disposable",()=>{
  let created=0,disposed=0;
  const fakeTransport={createFromUrl(){created++;return {send(){},waitForBestmove(){return Promise.resolve("bestmove e2e4");},stop(){},dispose(){disposed++;}};}};
  const fakeStockfish={createUciTransport(){return {bestMove:async()=>"e2e4"};},stockfishAgent(){return {id:"stockfish",chooseAction(){}};}};
  const loader=Loader.create({workerTransport:fakeTransport,stockfish:fakeStockfish});
  expect(loader.load()).toBe(loader.load());
  expect(created).toBe(1);
  loader.dispose();
  expect(disposed).toBe(1);
  expect(loader.loaded).toBe(false);
});
