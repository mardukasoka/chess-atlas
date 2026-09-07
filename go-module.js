"use strict";

/* Minimal positional-superko Go core. Board intersections are 0-based [row,col]. */
(function (root, factory) {
  const moduleApi = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = moduleApi;
  root.ChessAtlasGoModule = moduleApi;
  if (root.ChessAtlasGameModules && !root.ChessAtlasGameModules.get(moduleApi.id)) {
    root.ChessAtlasGameModules.register(moduleApi);
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const EMPTY = 0, BLACK = 1, WHITE = 2;
  const other = color => color === BLACK ? WHITE : BLACK;
  const key = (r,c) => `${r},${c}`;

  function boardKey(board) { return board.map(row => row.join("")).join("/"); }
  function cloneBoard(board) { return board.map(row => row.slice()); }
  function neighbors(size,r,c) {
    return [[r-1,c],[r+1,c],[r,c-1],[r,c+1]].filter(([a,b])=>a>=0&&b>=0&&a<size&&b<size);
  }
  function group(board,r,c) {
    const color=board[r][c], stones=[], liberties=new Set(), seen=new Set([key(r,c)]), stack=[[r,c]];
    while(stack.length){
      const [a,b]=stack.pop(); stones.push([a,b]);
      neighbors(board.length,a,b).forEach(([x,y])=>{
        if(board[x][y]===EMPTY) liberties.add(key(x,y));
        else if(board[x][y]===color&&!seen.has(key(x,y))){seen.add(key(x,y));stack.push([x,y]);}
      });
    }
    return {stones,liberties};
  }
  function simulate(game,r,c){
    if(game.board[r][c]!==EMPTY) return null;
    const board=cloneBoard(game.board), color=game.turn, enemy=other(color); board[r][c]=color;
    let captured=0;
    neighbors(game.size,r,c).forEach(([x,y])=>{
      if(board[x][y]!==enemy) return;
      const g=group(board,x,y);
      if(g.liberties.size===0){captured+=g.stones.length;g.stones.forEach(([a,b])=>board[a][b]=EMPTY);}
    });
    if(group(board,r,c).liberties.size===0) return null;
    if(game.history.has(boardKey(board))) return null;
    return {board,captured};
  }
  function create(options={}){
    const size=options.size||9;
    if(![9,13,19].includes(size)) throw new RangeError("Go size must be 9, 13, or 19");
    const board=Array.from({length:size},()=>Array(size).fill(EMPTY));
    return {size,board,turn:BLACK,passes:0,captures:{black:0,white:0},history:new Set([boardKey(board)]),status:"playing"};
  }
  function legalActions(game){
    if(game.status!=="playing") return [];
    const actions=[];
    for(let r=0;r<game.size;r++) for(let c=0;c<game.size;c++) if(simulate(game,r,c)) actions.push(Object.freeze({type:"place",at:[r,c]}));
    actions.push(Object.freeze({type:"pass"}));
    return actions;
  }
  function applyAction(game,action){
    if(game.status!=="playing") throw new Error("Go game is finished");
    if(action?.type==="pass"){
      game.passes+=1; game.turn=other(game.turn); if(game.passes>=2) game.status="scoring"; return game;
    }
    if(action?.type!=="place"||!Array.isArray(action.at)) throw new Error("Illegal Go action");
    const [r,c]=action.at;
    if(!Number.isInteger(r)||!Number.isInteger(c)||r<0||c<0||r>=game.size||c>=game.size) throw new Error("Illegal Go action");
    const result=simulate(game,r,c); if(!result) throw new Error("Illegal Go placement");
    game.board=result.board; game.history.add(boardKey(game.board));
    if(game.turn===BLACK) game.captures.black+=result.captured; else game.captures.white+=result.captured;
    game.turn=other(game.turn); game.passes=0; return game;
  }
  function snapshot(game){
    return Object.freeze({size:game.size,board:game.board.map(r=>Object.freeze(r.slice())),turn:game.turn===BLACK?"black":"white",passes:game.passes,captures:Object.freeze({...game.captures}),status:game.status});
  }
  return Object.freeze({id:"go",name:"Go",create,legalActions,applyAction,snapshot,constants:Object.freeze({EMPTY,BLACK,WHITE})});
});
