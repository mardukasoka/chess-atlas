"use strict";
(function(root,factory){const api=factory(root?.XiangqiRules,root?.ChessAtlasRegionalSerialization,root?.ChessAtlasRegionalEngineMoves);if(typeof module==="object"&&module.exports)module.exports=api;if(root){root.ChessAtlasXiangqiModule=api;if(root.ChessAtlasGameModules&&!root.ChessAtlasGameModules.get(api.id))root.ChessAtlasGameModules.register(api);}})(typeof globalThis!=="undefined"?globalThis:this,function(Rules,Serialization,Moves){
  const rules=Rules||(typeof require==="function"?require('./xiangqi-rules.js'):null);
  const serialization=Serialization||(typeof require==="function"?require('./regional-engine-serialization.js'):null);
  const moves=Moves||(typeof require==="function"?require('./regional-engine-moves.js'):null);
  function create(){return{board:rules.initialPosition(),turn:'red'};}
  function legalActions(state){const out=[];for(let r=0;r<10;r++)for(let c=0;c<9;c++){const p=state.board[r][c];if(!p||rules.sideOf(p)!==state.turn)continue;const from=[r,c];for(const to of rules.legalMoves(state.board,from,state.turn))out.push(Object.freeze({type:'move',from:Object.freeze(from.slice()),to:Object.freeze(to.slice()),engineMove:moves.xiangqi(from,to)}));}return out;}
  function applyAction(state,action){if(action?.type!=='move')throw new Error('Illegal Xiangqi action');return{board:rules.applyMove(state.board,action.from,action.to,state.turn),turn:rules.opponent(state.turn)};}
  function snapshot(state){return Object.freeze({turn:state.turn,board:state.board.map(r=>Object.freeze(r.slice())),engine:'fairy-stockfish',engineVariant:'xiangqi',engineProtocol:'uci',enginePosition:serialization.xiangqiFen(state.board,state.turn)});}
  return Object.freeze({id:'xiangqi',name:'Xiangqi',create,legalActions,applyAction,snapshot});
});
