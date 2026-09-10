"use strict";
(function(root,factory){const api=factory(root?.JanggiRules,root?.ChessAtlasRegionalSerialization,root?.ChessAtlasRegionalEngineMoves);if(typeof module==="object"&&module.exports)module.exports=api;if(root){root.ChessAtlasJanggiModule=api;if(root.ChessAtlasGameModules&&!root.ChessAtlasGameModules.get(api.id))root.ChessAtlasGameModules.register(api);}})(typeof globalThis!=="undefined"?globalThis:this,function(Rules,Serialization,Moves){
  const rules=Rules||(typeof require==="function"?require('./janggi-rules.js'):null);
  const serialization=Serialization||(typeof require==="function"?require('./regional-engine-serialization.js'):null);
  const moves=Moves||(typeof require==="function"?require('./regional-engine-moves.js'):null);
  function create(options={}){return rules.initialState(options.choLayout||'classic',options.hanLayout||'classic');}
  function legalActions(state){const out=[];for(let r=0;r<10;r++)for(let c=0;c<9;c++){const p=state.board[r][c];if(!p||p.side!==state.turn)continue;const from=[r,c];for(const to of rules.legalMoves(state,from))out.push(Object.freeze({type:'move',from:Object.freeze(from.slice()),to:Object.freeze(to.slice()),engineMove:moves.janggi(from,to)}));}if(rules.canPass(state)){const k=(()=>{for(let r=0;r<10;r++)for(let c=0;c<9;c++)if(state.board[r][c]?.side===state.turn&&state.board[r][c]?.type==='k')return[r,c];return null;})();if(k)out.push(Object.freeze({type:'pass',engineMove:moves.janggiPass(k)}));}return out;}
  function applyAction(state,action){if(action?.type==='move')return rules.applyMove(state,action.from,action.to);if(action?.type==='pass')return rules.pass(state);throw new Error('Illegal Janggi action');}
  function snapshot(state){return Object.freeze({turn:state.turn,board:state.board.map(r=>Object.freeze(r.slice())),engine:'fairy-stockfish',engineVariant:'janggi',engineProtocol:'uci',enginePosition:serialization.janggiFen(state.board,state.turn)});}
  return Object.freeze({id:'janggi',name:'Janggi',create,legalActions,applyAction,snapshot});
});
