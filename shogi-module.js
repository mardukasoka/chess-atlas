"use strict";
(function(root,factory){const api=factory(root?.ShogiRules,root?.ChessAtlasRegionalSerialization,root?.ChessAtlasRegionalEngineMoves);if(typeof module==="object"&&module.exports)module.exports=api;if(root){root.ChessAtlasShogiModule=api;if(root.ChessAtlasGameModules&&!root.ChessAtlasGameModules.get(api.id))root.ChessAtlasGameModules.register(api);}})(typeof globalThis!=="undefined"?globalThis:this,function(Rules,Serialization,Moves){
  const rules=Rules||(typeof require==="function"?require('./shogi-rules.js'):null);
  const serialization=Serialization||(typeof require==="function"?require('./regional-engine-serialization.js'):null);
  const moves=Moves||(typeof require==="function"?require('./regional-engine-moves.js'):null);
  const HAND_TYPES=['P','L','N','S','G','B','R'];
  function create(){return rules.initialState();}
  function legalActions(state){const out=[];for(let r=0;r<9;r++)for(let c=0;c<9;c++){const p=state.board[r][c];if(!p||rules.sideOf(p)!==state.turn)continue;const from=[r,c];for(const m of rules.boardMoves(state,from))out.push(Object.freeze({type:'move',from:Object.freeze(from.slice()),to:Object.freeze(m.to.slice()),promote:!!m.promote,engineMove:moves.shogi(from,m.to,!!m.promote)}));}for(const type of HAND_TYPES){if(!state.hands[state.turn]?.[type])continue;for(const to of rules.dropMoves(state,type))out.push(Object.freeze({type:'drop',piece:type,to:Object.freeze(to.slice()),engineMove:moves.shogiDrop(type,to)}));}return out;}
  function applyAction(state,action){if(action?.type==='move')return rules.applyBoardMove(state,action.from,action.to,!!action.promote);if(action?.type==='drop')return rules.applyDrop(state,action.piece,action.to);throw new Error('Illegal Shogi action');}
  function snapshot(state){return Object.freeze({turn:state.turn,board:state.board.map(r=>Object.freeze(r.slice())),hands:Object.freeze({black:Object.freeze({...state.hands.black}),white:Object.freeze({...state.hands.white})}),engine:'fairy-stockfish',engineVariant:'shogi',engineProtocol:'uci-variant',enginePosition:serialization.shogiFen(state),sfen:serialization.shogiSfen(state)});}
  return Object.freeze({id:'shogi',name:'Shogi',create,legalActions,applyAction,snapshot});
});
