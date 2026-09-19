"use strict";
(function(root,factory){
  const ChessEngine=typeof require!=="undefined"?require("./engine.js"):root.ChessEngine;
  const registry=typeof require!=="undefined"?require("./game-modules.js"):root.ChessAtlasGameModules;
  const defs=factory(ChessEngine);
  if(typeof module!=="undefined"&&module.exports)module.exports=defs;
  if(registry)for(const def of Object.values(defs))if(!registry.get(def.id))registry.register(def);
})(typeof globalThis!=="undefined"?globalThis:this,function(ChessEngine){
  const files="abcdefgh";
  const square=(row,col)=>`${files[col]}${8-row}`;
  function createDefinition(profileId,name){
    function legalActions(game){
      if(!game||game.profileId!==profileId||game.gameOver)return[];
      const out=[];
      for(let row=0;row<8;row++)for(let col=0;col<8;col++){
        const piece=game.board[row][col];
        if(!piece||piece[0]!==game.turn)continue;
        for(const move of game.legalMoves(row,col))out.push(Object.freeze({
          type:"move",from:[row,col],to:[move.row,move.col],
          engineMove:`${square(row,col)}${square(move.row,move.col)}`
        }));
      }
      return out;
    }
    function applyAction(game,action){
      const legal=legalActions(game).find(candidate=>candidate.engineMove===action?.engineMove);
      if(!legal)throw new Error(`Illegal ${name} move`);
      game.handleSquare(...legal.from);
      return game.handleSquare(...legal.to);
    }
    return Object.freeze({
      id:profileId,name,create:()=>new ChessEngine(profileId),legalActions,applyAction,
      snapshot:game=>Object.freeze({...game.getState(),engine:Object.freeze({provider:"fairy-stockfish",variant:profileId,protocol:"uci-variant"})})
    });
  }
  return Object.freeze({
    shatranj:createDefinition("shatranj","Shatranj"),
    makruk:createDefinition("makruk","Makruk")
  });
});
