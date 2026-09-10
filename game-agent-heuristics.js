"use strict";

/* Lightweight, game-specific action scorers for the shared legal-action agent seam. */
(function(root,factory){const api=factory();if(typeof module!=="undefined"&&module.exports)module.exports=api;if(root)root.ChessAtlasAgentHeuristics=api;})(typeof globalThis!=="undefined"?globalThis:this,function(){
  const scorers=new Map();
  function register(gameId,scoreAction){if(!gameId||typeof gameId!=="string")throw new TypeError("gameId required");if(typeof scoreAction!=="function")throw new TypeError("scoreAction must be a function");scorers.set(gameId,scoreAction);return scoreAction;}
  function get(gameId){return scorers.get(gameId)||(()=>0);}
  function createAgent(Agents,gameId,options={}){if(!Agents||typeof Agents.heuristicAgent!=="function")throw new TypeError("Shared game agents required");return Agents.heuristicAgent({id:options.id||`${gameId}-heuristic`,name:options.name||`${gameId} heuristic`,random:options.random,scoreAction:get(gameId)});}

  register("go",(action,context)=>{
    if(action?.type==="pass")return -1000;
    const game=context?.game;if(!game||!Array.isArray(action?.at))return 0;
    const [r,c]=action.at,size=game.size||9;
    let score=0;
    const center=(size-1)/2;score+=Math.max(0,size/2-(Math.abs(r-center)+Math.abs(c-center)))*0.04;
    const board=game.board,enemy=game.turn===1?2:1;
    for(const [dr,dc] of [[-1,0],[1,0],[0,-1],[0,1]]){const rr=r+dr,cc=c+dc;if(rr<0||cc<0||rr>=size||cc>=size)continue;if(board[rr][cc]===enemy)score+=0.4;else if(board[rr][cc]===game.turn)score+=0.12;}
    return score;
  });

  register("backgammon",(action,context)=>{
    if(!action||action.actor==="chance")return -Infinity;
    let score=0;
    if(action.to==="off")score+=20;
    if(action.hit)score+=8;
    if(action.from==="bar")score+=12;
    if(typeof action.from==="number"&&typeof action.to==="number"){
      const side=context?.game?.turn;
      score+=side==="white"?(action.from-action.to)*0.1:(action.to-action.from)*0.1;
      const dest=context?.game?.points?.[action.to]||0;
      if(side==="white"&&dest===1)score+=1.2;
      if(side==="black"&&dest===-1)score+=1.2;
    }
    return score;
  });

  const XIANGQI_VALUE={r:9,c:4.5,h:4,e:2,a:2,p:1,k:100};
  register("xiangqi",(action,context)=>{
    if(action?.type!=="move"||!Array.isArray(action.to))return 0;
    const board=context?.game?.board;if(!board)return 0;
    const target=board[action.to[0]]?.[action.to[1]],rules=typeof globalThis!=="undefined"?globalThis.XiangqiRules:null;
    let score=0;
    if(target&&rules?.typeOf)score+=(XIANGQI_VALUE[rules.typeOf(target)]||1)*10;
    const [r,c]=action.to;score+=Math.max(0,4-Math.abs(c-4))*0.05;
    return score;
  });

  const SHOGI_VALUE={P:1,L:3,N:3,S:5,G:6,B:8,R:10,K:100};
  register("shogi",(action,context)=>{
    const state=context?.game;if(!state)return 0;
    let score=0;
    if(action?.type==="move"&&Array.isArray(action.to)){
      const target=state.board?.[action.to[0]]?.[action.to[1]];
      if(target){const raw=String(target).replace('+','').toUpperCase();score+=(SHOGI_VALUE[raw]||1)*10;}
      if(action.promote)score+=4;
    }else if(action?.type==="drop")score+=0.25;
    return score;
  });

  const JANGGI_VALUE={p:1,h:4,e:3,a:2,c:7,r:13,k:100};
  register("janggi",(action,context)=>{
    if(action?.type==="pass")return -2;
    if(action?.type!=="move"||!Array.isArray(action.to))return 0;
    const target=context?.game?.board?.[action.to[0]]?.[action.to[1]];
    let score=target?(JANGGI_VALUE[target.type]||1)*10:0;
    const [r,c]=action.to;score+=Math.max(0,4-Math.abs(c-4))*0.03+(r===1||r===8?0.05:0);
    return score;
  });

  return Object.freeze({register,get,createAgent,list:()=>[...scorers.keys()]});
});
