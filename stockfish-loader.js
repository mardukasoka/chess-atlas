"use strict";

/* Lazy browser hookup for Stockfish 18 lite single-threaded.
 * The GPL engine assets stay separate from the Chess Atlas core and are
 * fetched only when a player explicitly enables Stockfish.
 */
(function(root,factory){
  const api=factory(
    typeof module!=="undefined"&&module.exports?require("./stockfish-worker.js"):root.ChessAtlasStockfishWorker,
    typeof module!=="undefined"&&module.exports?require("./stockfish-agent.js"):root.ChessAtlasStockfishAgent
  );
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
  root.ChessAtlasStockfishLoader=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(WorkerTransport,Stockfish){
  const DEFAULT_ASSET="vendor/stockfish/stockfish-18-lite-single.js";

  function create(options){
    const opts=options||{};
    const workerUrl=opts.workerUrl||DEFAULT_ASSET;
    const workerTransport=opts.workerTransport||WorkerTransport;
    const stockfish=opts.stockfish||Stockfish;
    if(!workerTransport||typeof workerTransport.createFromUrl!=="function")throw new Error("Stockfish Worker transport is unavailable");
    if(!stockfish||typeof stockfish.createUciTransport!=="function"||typeof stockfish.stockfishAgent!=="function")throw new Error("Stockfish agent adapter is unavailable");
    let transport=null;
    let agent=null;

    function load(){
      if(agent)return agent;
      transport=workerTransport.createFromUrl(workerUrl,{timeoutMs:opts.timeoutMs,workerOptions:opts.workerOptions});
      const uci=stockfish.createUciTransport({
        send:command=>transport.send(command),
        waitForBestmove:()=>transport.waitForBestmove()
      });
      agent=stockfish.stockfishAgent({transport:uci,search:opts.search||"go depth 10"});
      return agent;
    }

    return Object.freeze({
      workerUrl,
      get loaded(){return !!agent;},
      load,
      stop(){if(transport)transport.stop();},
      dispose(){if(transport)transport.dispose();transport=null;agent=null;}
    });
  }

  return Object.freeze({DEFAULT_ASSET,create});
});
