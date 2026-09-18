"use strict";
/*
 * Optional regional Fairy-Stockfish bridge.
 * No engine bytes are loaded at page start. A host may inject an Emscripten
 * factory as window.FairyStockfishFactory; only then is the specialist tier
 * advertised. Atlas legalActions remain the final move gate.
 */
(function(root,factory){const api=factory(root);if(typeof module==="object"&&module.exports)module.exports=api;if(root)root.ChessAtlasRegionalFairyStockfish=api;})(typeof globalThis!=="undefined"?globalThis:this,function(root){
  let transport=null;
  function factory(){return root&&typeof root.FairyStockfishFactory==="function"?root.FairyStockfishFactory:null}
  function available(){return !!factory()&&!!root.ChessAtlasFairyStockfishTransport&&!!root.ChessAtlasFairyStockfishAgent}
  function ensureTransport(){if(!available())throw new Error("Fairy-Stockfish WASM factory is not installed");if(!transport)transport=root.ChessAtlasFairyStockfishTransport.create({factory:factory()});return transport}
  function createAgent(gameId,options={}){return root.ChessAtlasFairyStockfishAgent.create({gameId,transport:ensureTransport(),search:options.search||"go depth 8"})}
  function configureSelect(select){if(!select)return false;let option=select.querySelector('option[value="fairy-stockfish"]');if(!option){option=document.createElement("option");option.value="fairy-stockfish";select.appendChild(option)}const ok=available();option.disabled=!ok;option.textContent=ok?"Fairy-Stockfish · WASM":"Fairy-Stockfish · WASM not installed";return ok}
  function dispose(){if(transport)transport.dispose();transport=null}
  return Object.freeze({available,createAgent,configureSelect,dispose});
});