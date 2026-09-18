"use strict";
/*
 * Lightweight Alquerque specialist for the Atlas-native Alfonso X profile.
 *
 * Inspired by the forked Alquerque project's use of tree search, but implemented
 * against Chess Atlas legalActions/apply so the Atlas rules engine remains
 * authoritative. No upstream UI/runtime dependency is imported.
 */
(function(root,factory){
  const api=factory(typeof require==="function"?require("./alquerque.js"):root.ChessAtlasAlquerque);
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
  root.ChessAtlasAlquerqueAgent=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(engine){
  if(!engine)throw new Error("Alquerque engine not loaded");
  function clone(game){
    const snap=game.snapshot();
    const copy=new engine.AlfonsoAlquerqueGame({setup:false,turn:snap.turn});
    copy.turn=snap.turn; copy.winner=snap.winner; copy.captured={...snap.captured};
    for(const [cell,player] of Object.entries(snap.board)){const [r,c]=cell.split(",").map(Number);copy.set(r,c,player)}
    return copy;
  }
  function evaluate(game,side){
    const enemy=game.opponent(side);
    if(game.winner===side)return 100000;
    if(game.winner===enemy)return -100000;
    const material=(game.remaining(side)-game.remaining(enemy))*100;
    const savedTurn=game.turn; game.turn=side; const mobility=game.legalActions().length; game.turn=enemy; const enemyMobility=game.legalActions().length; game.turn=savedTurn;
    return material+(mobility-enemyMobility)*2;
  }
  function search(game,side,depth,alpha,beta){
    if(depth<=0||game.winner)return evaluate(game,side);
    const actions=game.legalActions();
    if(!actions.length)return evaluate(game,side);
    const maximizing=game.turn===side;
    let value=maximizing?-Infinity:Infinity;
    for(const action of actions){
      const next=clone(game); next.apply(action);
      const score=search(next,side,depth-1,alpha,beta);
      if(maximizing){value=Math.max(value,score);alpha=Math.max(alpha,value)}else{value=Math.min(value,score);beta=Math.min(beta,value)}
      if(beta<=alpha)break;
    }
    return value;
  }
  function create(options={}){
    const depth=Math.max(1,Math.min(4,Number(options.depth)||2));
    return Object.freeze({id:options.id||"alquerque-alpha-beta",name:options.name||"Alquerque Alpha-Beta",async chooseAction(context){
      const actions=context.legalActions||[];if(!actions.length)return null;
      const side=context.game.turn;let best=-Infinity,candidates=[];
      for(const action of actions){const next=clone(context.game);next.apply(action);const score=search(next,side,depth-1,-Infinity,Infinity);if(score>best){best=score;candidates=[action]}else if(score===best)candidates.push(action)}
      return candidates[0];
    }});
  }
  return Object.freeze({create,evaluate});
});