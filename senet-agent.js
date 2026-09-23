"use strict";
/* Senet specialist. The Senet engine remains authoritative for legality. */
(function(root,factory){const api=factory();if(typeof module!=="undefined"&&module.exports)module.exports=api;root.ChessAtlasSenetAgent=api;})(typeof globalThis!=="undefined"?globalThis:this,function(){
  function score(action){
    if(!action)return -Infinity;
    let value=0;
    if(action.exit)value+=1000;
    if(Number.isFinite(action.to))value+=action.to;
    if(action.swap)value+=20;
    if(action.happiness)value+=12;
    return value;
  }
  function create(options={}){
    return Object.freeze({
      id:options.id||"senet-progress-heuristic",
      name:options.name||"Senet Progress Heuristic",
      chooseAction(context={}){
        const actions=context.legalActions||[];
        if(!actions.length)return null;
        let best=actions[0],bestScore=score(best);
        for(let i=1;i<actions.length;i++){
          const candidate=actions[i],candidateScore=score(candidate);
          if(candidateScore>bestScore){best=candidate;bestScore=candidateScore}
        }
        return best;
      }
    });
  }
  return Object.freeze({create,score});
});
