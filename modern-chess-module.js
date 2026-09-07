"use strict";
(function(root,factory){
  const ChessEngine=typeof require!=="undefined"?require("./engine.js"):root.ChessEngine;
  const registry=typeof require!=="undefined"?require("./game-modules.js"):root.ChessAtlasGameModules;
  const def=factory(ChessEngine);
  if(typeof module!=="undefined"&&module.exports)module.exports=def;
  if(registry&&!registry.get(def.id))registry.register(def);
})(typeof globalThis!=="undefined"?globalThis:this,function(ChessEngine){
  const files="abcdefgh";
  const square=(row,col)=>`${files[col]}${8-row}`;
  function promotionSuffix(game,fromRow,toRow,col){
    const piece=game.board[fromRow][col];
    return piece&&piece[1]==="P"&&(toRow===0||toRow===7)?String(game.profile.promotion||"Q").toLowerCase():"";
  }
  function legalActions(game){
    if(!game||game.profileId!=="modern"||game.gameOver)return[];
    const out=[];
    for(let row=0;row<8;row++)for(let col=0;col<8;col++){
      const piece=game.board[row][col];
      if(!piece||piece[0]!==game.turn)continue;
      for(const move of game.legalMoves(row,col)){
        out.push(Object.freeze({
          type:"move",
          from:[row,col],
          to:[move.row,move.col],
          uci:`${square(row,col)}${square(move.row,move.col)}${promotionSuffix(game,row,move.row,col)}`
        }));
      }
    }
    return out;
  }
  function applyAction(game,action){
    if(!action||action.type!=="move"||!Array.isArray(action.from)||!Array.isArray(action.to))throw new Error("Modern chess action must be a move");
    const legal=legalActions(game).find(candidate=>candidate.uci===action.uci&&candidate.from[0]===action.from[0]&&candidate.from[1]===action.from[1]&&candidate.to[0]===action.to[0]&&candidate.to[1]===action.to[1]);
    if(!legal)throw new Error("Illegal modern chess move");
    game.handleSquare(...legal.from);
    return game.handleSquare(...legal.to);
  }
  return Object.freeze({
    id:"modern-chess",
    name:"Modern Chess",
    create:()=>new ChessEngine("modern"),
    legalActions,
    applyAction,
    snapshot:game=>game.getState()
  });
});
