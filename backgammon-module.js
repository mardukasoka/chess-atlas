"use strict";
(function(root,factory){const api=factory(root?.ChessAtlasBackgammon);if(typeof module==="object"&&module.exports)module.exports=api;if(root){root.ChessAtlasBackgammonModule=api;if(root.ChessAtlasGameModules&&!root.ChessAtlasGameModules.get(api.id))root.ChessAtlasGameModules.register(api);}})(typeof globalThis!=="undefined"?globalThis:this,function(Backgammon){
  const B=Backgammon||(typeof require==="function"?require('./backgammon.js'):null);
  function create(){return B.create();}
  function legalActions(game){
    if(game.status==='finished')return[];
    if(game.status==='opening')return[Object.freeze({type:'opening-roll',actor:'chance'})];
    if(!game.diceRemaining.length)return[Object.freeze({type:'roll',actor:'chance'})];
    return B.legalNextMoves(game).map(m=>Object.freeze({type:'move',from:m.from,to:m.to,die:m.die}));
  }
  function applyAction(game,action){
    if(action?.actor==='chance')throw new Error('Backgammon chance action must be resolved by the caller');
    if(action?.type!=='move')throw new Error('Illegal Backgammon module action');
    const next=B.playMove(game,action);
    Object.assign(game,next);
    return game;
  }
  function snapshot(game){return B.snapshot(game);}
  return Object.freeze({id:'backgammon',name:'Backgammon',create,legalActions,applyAction,snapshot});
});
