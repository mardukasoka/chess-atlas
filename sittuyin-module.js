"use strict";
(function(root,factory){const api=factory(root?.ChessAtlasSittuyinRules);if(typeof module==="object"&&module.exports)module.exports=api;if(root){root.ChessAtlasSittuyinModule=api;if(root.ChessAtlasGameModules&&!root.ChessAtlasGameModules.get(api.id))root.ChessAtlasGameModules.register(api);}})(typeof globalThis!=="undefined"?globalThis:this,function(Rules){
 const rules=Rules||(typeof require==="function"?require("./sittuyin-rules.js"):null);
 const files="abcdefgh";
 const engineMove=(from,to)=>files[from[1]]+(8-from[0])+files[to[1]]+(8-to[0]);
 function create(options={}){if(!Array.isArray(options.board))throw new Error("Sittuyin create() requires an explicit verified board; deployment is not inferred");return{board:options.board.map(r=>r.slice()),turn:options.turn==="b"?"b":"w",phase:options.phase||"play"}}
 function legalActions(state){if(state.phase!=="play")return[];const out=[];for(let r=0;r<8;r++)for(let c=0;c<8;c++){const p=state.board[r][c];if(!p||p[0]!==state.turn)continue;for(const to of rules.moves(state.board,r,c)){const from=[r,c],dest=[to.row,to.col];out.push(Object.freeze({type:"move",from:Object.freeze(from),to:Object.freeze(dest),engineMove:engineMove(from,dest)}))}}return out}
 function applyAction(state,action){const legal=legalActions(state);const found=legal.find(a=>a.engineMove===action?.engineMove);if(!found)throw new Error("Illegal Sittuyin action");const board=state.board.map(r=>r.slice());board[found.to[0]][found.to[1]]=board[found.from[0]][found.from[1]];board[found.from[0]][found.from[1]]="";return{board,turn:state.turn==="w"?"b":"w",phase:"play"}}
 function snapshot(state){return Object.freeze({turn:state.turn,phase:state.phase,board:state.board.map(r=>Object.freeze(r.slice())),engine:"fairy-stockfish",engineVariant:"sittuyin",engineProtocol:"uci-variant",enginePosition:null})}
 return Object.freeze({id:"sittuyin",name:"Sittuyin",create,legalActions,applyAction,snapshot});
});
