"use strict";
/*
 * Sittuyin rules kernel.
 * Atlas policy: this implements a labelled modern/traditional rules profile,
 * not a claim about the game's invention date. Deployment is explicit because
 * historical accounts describe materially different deployment procedures.
 */
(function(root,factory){const api=factory();if(typeof module!=="undefined"&&module.exports)module.exports=api;if(root)root.ChessAtlasSittuyinRules=api;})(typeof globalThis!=="undefined"?globalThis:this,function(){
  const inside=(r,c)=>r>=0&&r<8&&c>=0&&c<8;
  const colour=p=>p?p[0]:null,type=p=>p?p[1]:null;
  const STEPS={K:[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]],F:[[-1,-1],[-1,1],[1,-1],[1,1]],N:[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]};
  function stepMoves(board,row,col,steps){const side=colour(board[row][col]);return steps.map(([dr,dc])=>({row:row+dr,col:col+dc})).filter(m=>inside(m.row,m.col)&&colour(board[m.row][m.col])!==side)}
  function rookMoves(board,row,col){const side=colour(board[row][col]),out=[];for(const[dr,dc]of [[-1,0],[1,0],[0,-1],[0,1]]){let r=row+dr,c=col+dc;while(inside(r,c)){if(!board[r][c])out.push({row:r,col:c});else{if(colour(board[r][c])!==side)out.push({row:r,col:c});break}r+=dr;c+=dc}}return out}
  function elephantMoves(board,row,col,side){const forward=side==="w"?-1:1;return stepMoves(board,row,col,[[-1,-1],[-1,1],[1,-1],[1,1],[forward,0]])}
  function pawnMoves(board,row,col,side){const d=side==="w"?-1:1,out=[];if(inside(row+d,col)&&!board[row+d][col])out.push({row:row+d,col});for(const dc of[-1,1])if(inside(row+d,col+dc)&&board[row+d][col+dc]&&colour(board[row+d][col+dc])!==side)out.push({row:row+d,col:col+dc});return out}
  function moves(board,row,col){const p=board?.[row]?.[col];if(!p)return[];const side=colour(p);switch(type(p)){case"K":return stepMoves(board,row,col,STEPS.K);case"F":return stepMoves(board,row,col,STEPS.F);case"E":return elephantMoves(board,row,col,side);case"N":return stepMoves(board,row,col,STEPS.N);case"R":return rookMoves(board,row,col);case"P":return pawnMoves(board,row,col,side);default:return[]}}
  function promotionSquares(side){const out=[];for(let r=0;r<8;r++)for(let c=0;c<8;c++)if((r===c||r+c===7)&&(side==="w"?r<4:r>=4))out.push([r,c]);return out}
  return Object.freeze({moves,promotionSquares});
});
