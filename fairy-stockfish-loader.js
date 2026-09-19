"use strict";
/*
 * Lazy Fairy-Stockfish Emscripten factory loader.
 * Engine assets are deliberately absent from the core Atlas checkout.
 * A deployment may mirror the GPL build under vendor/fairy-stockfish/.
 */
(function(root,factory){const api=factory(root);if(typeof module==="object"&&module.exports)module.exports=api;if(root)root.ChessAtlasFairyStockfishLoader=api;})(typeof globalThis!=="undefined"?globalThis:this,function(root){
  const DEFAULT_SCRIPT="vendor/fairy-stockfish/stockfish.js";
  const DEFAULT_WASM="vendor/fairy-stockfish/stockfish.wasm";
  let promise=null;
  function supported(env=root){return !!env&&typeof env.WebAssembly!=="undefined"&&!!env.document}
  function install(options={}){
    if(typeof root.FairyStockfishFactory==="function")return Promise.resolve(root.FairyStockfishFactory);
    if(!supported())return Promise.reject(new Error("Fairy-Stockfish WASM is unavailable in this browser"));
    if(promise)return promise;
    const scriptUrl=options.scriptUrl||DEFAULT_SCRIPT,wasmUrl=options.wasmUrl||DEFAULT_WASM;
    promise=new Promise((resolve,reject)=>{
      const script=root.document.createElement("script");script.src=scriptUrl;script.async=true;
      script.onload=()=>{
        const compiled=root.Stockfish||root.Module;
        if(typeof compiled!=="function"){promise=null;reject(new Error("Fairy-Stockfish factory was not exported by the engine script"));return}
        root.FairyStockfishFactory=(moduleOptions={})=>compiled(Object.assign({locateFile:path=>path.endsWith(".wasm")?wasmUrl:path},moduleOptions));
        resolve(root.FairyStockfishFactory);
      };
      script.onerror=()=>{promise=null;reject(new Error("Fairy-Stockfish engine assets are not installed"))};
      root.document.head.appendChild(script);
    });
    return promise;
  }
  return Object.freeze({DEFAULT_SCRIPT,DEFAULT_WASM,supported,install});
});