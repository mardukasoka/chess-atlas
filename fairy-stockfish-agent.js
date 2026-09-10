"use strict";

/*
 * Optional Fairy-Stockfish specialist-engine seam.
 * This does not bundle or activate an engine. It only maps a verified engine
 * proposal back to Atlas legalActions, preserving Atlas rules/provenance as
 * authoritative. UI activation must remain gated by adapter validation.
 */
(function(root,factory){const api=factory();if(typeof module!=="undefined"&&module.exports)module.exports=api;if(root)root.ChessAtlasFairyStockfishAgent=api;})(typeof globalThis!=="undefined"?globalThis:this,function(){
  const VARIANTS=Object.freeze({modern:"chess",shatranj:"shatranj",makruk:"makruk",xiangqi:"xiangqi",shogi:"shogi",janggi:"janggi",sittuyin:"sittuyin",shatar:"shatar",courier:"courier"});
  const normalize=value=>typeof value==="string"?value.trim().toLowerCase():"";
  const actionMove=action=>normalize(action?.uci||action?.engineMove||action?.move);
  function variantFor(gameId){return VARIANTS[gameId]||null;}
  function create(options={}){
    const transport=options.transport;
    if(!transport||typeof transport.bestMove!=="function")throw new TypeError("Fairy-Stockfish agent requires bestMove transport");
    const gameId=options.gameId,variant=options.variant||variantFor(gameId);
    if(!variant)throw new Error(`No verified Fairy-Stockfish mapping for ${gameId||"game"}`);
    return Object.freeze({
      id:options.id||`fairy-stockfish-${gameId}`,
      name:options.name||`Fairy-Stockfish · ${variant}`,
      engine:"fairy-stockfish",
      variant,
      async chooseAction(context){
        const actions=Array.isArray(context?.legalActions)?context.legalActions:[];
        if(!actions.length)return null;
        const position=context?.enginePosition||context?.position||context?.snapshot?.enginePosition;
        if(!position)throw new Error("Fairy-Stockfish agent requires a verified engine position");
        const move=normalize(await transport.bestMove({variant,position,search:options.search||"go depth 8"}));
        const selected=actions.find(action=>actionMove(action)===move);
        if(!selected)throw new Error(`Fairy-Stockfish selected move outside legalActions: ${move}`);
        return selected;
      }
    });
  }
  return Object.freeze({VARIANTS,variantFor,actionMove,create});
});
