"use strict";
/* Royal Game of Ur specialist. Atlas rules remain authoritative. */
(function(root,factory){const api=factory();if(typeof module!=="undefined"&&module.exports)module.exports=api;root.ChessAtlasUrAgent=api;})(typeof globalThis!=="undefined"?globalThis:this,function(){
  const ROSETTES=new Set([3,7,13]);
  function score(move,context){
    let value=move.to*2;
    if(move.to===14)value+=120;
    if(ROSETTES.has(move.to))value+=35;
    if(move.from===-1)value+=8;
    const game=context&&context.game;
    if(game&&move.to>=4&&move.to<=11&&!ROSETTES.has(move.to)){
      const opponent=game.opponent(move.side);
      if(game.occupiedBy(opponent,move.to)!==-1)value+=55;
    }
    return value;
  }
  function create(options={}){
    return Object.freeze({id:options.id||"ur-finkel-heuristic",name:options.name||"Ur Finkel Heuristic",chooseAction(context){
      const actions=context.legalActions||[];if(!actions.length)return null;
      let best=actions[0],bestScore=-Infinity;
      for(const action of actions){const s=score(action,context);if(s>bestScore){bestScore=s;best=action}}
      return best;
    }});
  }
  return Object.freeze({create,score});
});