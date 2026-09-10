"use strict";
(function(root,factory){const api=factory();if(typeof module!=="undefined"&&module.exports)module.exports=api;if(root)root.ChessAtlasFairyStockfishTransport=api;})(typeof globalThis!=="undefined"?globalThis:this,function(){
  function capability(env=globalThis){
    return Object.freeze({
      webAssembly:typeof env.WebAssembly!=="undefined",
      worker:typeof env.Worker!=="undefined",
      sharedArrayBuffer:typeof env.SharedArrayBuffer!=="undefined",
      crossOriginIsolated:env.crossOriginIsolated===true
    });
  }

  function readyForPthreads(env=globalThis){
    const c=capability(env);
    return c.webAssembly&&c.worker&&c.sharedArrayBuffer&&c.crossOriginIsolated;
  }

  function create(options={}){
    const factory=options.factory;
    if(typeof factory!=="function")throw new TypeError("Fairy-Stockfish transport requires an injected Stockfish factory");
    const timeoutMs=Number.isFinite(options.timeoutMs)?options.timeoutMs:10000;
    let engine=null,pending=null,loading=null;

    async function load(){
      if(engine)return engine;
      if(!loading)loading=Promise.resolve(factory(options.moduleOptions||{})).then(instance=>{
        if(!instance||typeof instance.postMessage!=="function"||typeof instance.addMessageListener!=="function")throw new TypeError("Invalid Fairy-Stockfish Emscripten module");
        engine=instance;return engine;
      });
      return loading;
    }

    function finish(error,move){
      if(!pending)return;
      const p=pending;pending=null;clearTimeout(p.timer);if(error)p.reject(error);else p.resolve(move);
    }

    function parseBestmove(line){
      if(typeof line!=="string")return null;
      const m=line.trim().match(/^bestmove\s+(\S+)/i);
      return m&&m[1]!=="(none)"?m[1].toLowerCase():null;
    }

    async function bestMove(request={}){
      const e=await load();
      if(pending)throw new Error("Fairy-Stockfish search already pending");
      if(!request.variant||!request.position)throw new TypeError("Fairy-Stockfish variant and position are required");
      return new Promise((resolve,reject)=>{
        const listener=line=>{const move=parseBestmove(line);if(move){e.removeMessageListener(listener);finish(null,move);}};
        const timer=setTimeout(()=>{e.removeMessageListener(listener);finish(new Error("Fairy-Stockfish bestmove timeout"));},timeoutMs);
        pending={resolve,reject,timer,listener};
        e.addMessageListener(listener);
        e.postMessage(`setoption name UCI_Variant value ${request.variant}`);
        e.postMessage(`position fen ${request.position}`);
        e.postMessage(request.search||"go depth 8");
      });
    }

    return Object.freeze({
      capability:()=>capability(options.env||globalThis),
      readyForPthreads:()=>readyForPthreads(options.env||globalThis),
      get loaded(){return !!engine;},
      load,
      bestMove,
      stop(){if(engine)engine.postMessage("stop");},
      dispose(){if(pending){const p=pending;if(engine&&p.listener)engine.removeMessageListener(p.listener);finish(new Error("Fairy-Stockfish transport disposed"));}if(engine&&typeof engine.terminate==="function")engine.terminate();engine=null;loading=null;}
    });
  }

  return Object.freeze({capability,readyForPthreads,create});
});
