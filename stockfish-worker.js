"use strict";

/* Browser Worker transport for a UCI-compatible Stockfish build. */
(function(root,factory){
  const api=factory();
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
  root.ChessAtlasStockfishWorker=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  function createWorkerTransport(options){
    const opts=options||{};
    const worker=opts.worker||(
      typeof opts.createWorker==="function"?opts.createWorker():null
    );
    if(!worker||typeof worker.postMessage!=="function"){
      throw new TypeError("Stockfish worker transport requires a Worker-like object");
    }
    const timeoutMs=Number.isFinite(opts.timeoutMs)?opts.timeoutMs:10000;
    let pending=null;

    function clearPending(error,line){
      if(!pending)return;
      const current=pending;
      pending=null;
      clearTimeout(current.timer);
      if(error)current.reject(error);else current.resolve(line);
    }

    function onMessage(event){
      const line=typeof event==="string"?event:event&&event.data;
      if(typeof line!=="string")return;
      if(/^bestmove\s+/i.test(line.trim()))clearPending(null,line);
    }

    function onError(event){
      const message=event&&event.message?event.message:"Stockfish worker failed";
      clearPending(new Error(message));
    }

    if(typeof worker.addEventListener==="function"){
      worker.addEventListener("message",onMessage);
      worker.addEventListener("error",onError);
    }else{
      worker.onmessage=onMessage;
      worker.onerror=onError;
    }

    return Object.freeze({
      send(command){
        worker.postMessage(command);
      },
      waitForBestmove(){
        if(pending)return Promise.reject(new Error("Stockfish search already pending"));
        return new Promise((resolve,reject)=>{
          const timer=setTimeout(()=>{
            clearPending(new Error("Stockfish bestmove timeout"));
          },timeoutMs);
          pending={resolve,reject,timer};
        });
      },
      stop(){
        worker.postMessage("stop");
      },
      dispose(){
        if(pending)clearPending(new Error("Stockfish worker disposed"));
        if(typeof worker.terminate==="function")worker.terminate();
      }
    });
  }

  function createFromUrl(url,options){
    if(typeof Worker==="undefined")throw new Error("Web Workers are not available");
    if(!url||typeof url!=="string")throw new TypeError("Stockfish worker URL is required");
    const opts=options||{};
    return createWorkerTransport({
      ...opts,
      worker:new Worker(url,opts.workerOptions||undefined)
    });
  }

  return Object.freeze({createWorkerTransport,createFromUrl});
});
