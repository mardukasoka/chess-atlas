"use strict";
(function(root,factory){const api=factory(root?.JanggiPosition);if(typeof module==="object"&&module.exports)module.exports=api;if(root)root.JanggiRules=api;})(typeof globalThis!=="undefined"?globalThis:this,function(Position){
  const pos=Position||(typeof require==="function"?require('./janggi-position.js'):null);
  const inside=(r,c)=>r>=0&&r<10&&c>=0&&c<9;
  const opponent=s=>s==='cho'?'han':'cho';
  const forward=s=>s==='cho'?1:-1;
  const cloneBoard=b=>b.map(row=>row.slice());
  const palaceFor=(side,r,c)=>c>=3&&c<=5&&(side==='cho'?r>=0&&r<=2:r>=7&&r<=9);
  const anyPalace=(r,c)=>(c>=3&&c<=5&&((r>=0&&r<=2)||(r>=7&&r<=9)));
  const centerOfPalace=(r,c)=>c===4&&(r===1||r===8);
  function diagonalNeighbors(r,c){const out=[];if(!anyPalace(r,c))return out;const centers=[[1,4],[8,4]];for(const [cr,cc] of centers){if(Math.abs(r-cr)<=1&&Math.abs(c-cc)<=1){if(centerOfPalace(r,c)){for(const dr of [-1,1])for(const dc of [-1,1])out.push([r+dr,c+dc]);}else if(Math.abs(r-cr)===1&&Math.abs(c-cc)===1)out.push([cr,cc]);}}return out;}
  function onSamePalaceDiagonal(from,to){const [fr,fc]=from,[tr,tc]=to;if(!anyPalace(fr,fc)||!anyPalace(tr,tc))return null;for(const line of [[[0,3],[1,4],[2,5]],[[0,5],[1,4],[2,3]],[[7,3],[8,4],[9,5]],[[7,5],[8,4],[9,3]]]){const a=line.findIndex(([r,c])=>r===fr&&c===fc),b=line.findIndex(([r,c])=>r===tr&&c===tc);if(a>=0&&b>=0)return{line,a,b};}return null;}
  function orthBetween(board,from,to){const [fr,fc]=from,[tr,tc]=to;if(fr!==tr&&fc!==tc)return null;const cells=[];if(fr===tr){for(let c=Math.min(fc,tc)+1;c<Math.max(fc,tc);c++)cells.push(board[fr][c]);}else{for(let r=Math.min(fr,tr)+1;r<Math.max(fr,tr);r++)cells.push(board[r][fc]);}return cells;}
  function diagonalBetween(board,from,to){const info=onSamePalaceDiagonal(from,to);if(!info)return null;const cells=[];for(let i=Math.min(info.a,info.b)+1;i<Math.max(info.a,info.b);i++){const [r,c]=info.line[i];cells.push(board[r][c]);}return cells;}
  function clearLine(board,from,to,allowPalace=true){const cells=orthBetween(board,from,to)??(allowPalace?diagonalBetween(board,from,to):null);return cells&&cells.every(x=>!x);}
  function screenLine(board,from,to,allowPalace=true){return orthBetween(board,from,to)??(allowPalace?diagonalBetween(board,from,to):null);}
  function horsePath(fr,fc,tr,tc){const dr=tr-fr,dc=tc-fc,aR=Math.abs(dr),aC=Math.abs(dc);if(!((aR===2&&aC===1)||(aR===1&&aC===2)))return null;return aR===2?[[fr+Math.sign(dr),fc]]:[[fr,fc+Math.sign(dc)]];}
  function elephantPath(fr,fc,tr,tc){const dr=tr-fr,dc=tc-fc,aR=Math.abs(dr),aC=Math.abs(dc);if(!((aR===3&&aC===2)||(aR===2&&aC===3)))return null;if(aR===3)return[[fr+Math.sign(dr),fc],[fr+2*Math.sign(dr),fc+Math.sign(dc)]];return[[fr,fc+Math.sign(dc)],[fr+Math.sign(dr),fc+2*Math.sign(dc)]];}
  function pseudo(board,from,to,side,{allowGeneralCapture=false}={}){const [fr,fc]=from,[tr,tc]=to;if(!inside(fr,fc)||!inside(tr,tc)||(fr===tr&&fc===tc))return false;const p=board[fr][fc],target=board[tr][tc];if(!p||p.side!==side||target?.side===side)return false;if(target?.type==='k'&&!allowGeneralCapture)return false;const dr=tr-fr,dc=tc-fc,aR=Math.abs(dr),aC=Math.abs(dc),f=forward(side);
    if(p.type==='k'||p.type==='a'){if(!palaceFor(side,tr,tc))return false;if(aR+aC===1)return true;return aR===1&&aC===1&&diagonalNeighbors(fr,fc).some(([r,c])=>r===tr&&c===tc);}
    if(p.type==='r')return !!clearLine(board,from,to,true);
    if(p.type==='c'){const cells=screenLine(board,from,to,true);if(!cells||target?.type==='c')return false;const occupied=cells.filter(Boolean);return occupied.length===1&&occupied[0].type!=='c';}
    if(p.type==='h'){const path=horsePath(fr,fc,tr,tc);return !!path&&path.every(([r,c])=>!board[r][c]);}
    if(p.type==='e'){const path=elephantPath(fr,fc,tr,tc);return !!path&&path.every(([r,c])=>!board[r][c]);}
    if(p.type==='p'){if(dr===f&&dc===0)return true;if(dr===0&&aC===1)return true;if(dr===f&&aC===1&&palaceFor(opponent(side),fr,fc)&&diagonalNeighbors(fr,fc).some(([r,c])=>r===tr&&c===tc))return true;return false;}
    return false;}
  function generalSquare(board,side){for(let r=0;r<10;r++)for(let c=0;c<9;c++)if(board[r][c]?.side===side&&board[r][c]?.type==='k')return[r,c];return null;}
  function isInCheck(board,side){const k=generalSquare(board,side);if(!k)return true;const enemy=opponent(side);for(let r=0;r<10;r++)for(let c=0;c<9;c++)if(board[r][c]?.side===enemy&&pseudo(board,[r,c],k,enemy,{allowGeneralCapture:true}))return true;return false;}
  function initialState(choLayout='classic',hanLayout='classic'){return{board:pos.initialPosition(choLayout,hanLayout),turn:'cho'};}
  function legalMove(state,from,to){if(!pseudo(state.board,from,to,state.turn,{allowGeneralCapture:true}))return false;const b=cloneBoard(state.board);b[to[0]][to[1]]=b[from[0]][from[1]];b[from[0]][from[1]]=null;return !isInCheck(b,state.turn);}
  function legalMoves(state,from){const out=[];for(let r=0;r<10;r++)for(let c=0;c<9;c++)if(legalMove(state,from,[r,c]))out.push([r,c]);return out;}
  function applyMove(state,from,to){if(!legalMove(state,from,to))throw new Error('Illegal Janggi move');const b=cloneBoard(state.board);b[to[0]][to[1]]=b[from[0]][from[1]];b[from[0]][from[1]]=null;return{board:b,turn:opponent(state.turn)};}
  function canPass(state){return !isInCheck(state.board,state.turn);}
  function pass(state){if(!canPass(state))throw new Error('Cannot pass while in check');return{board:cloneBoard(state.board),turn:opponent(state.turn)};}
  return Object.freeze({initialState,opponent,forward,palaceFor,diagonalNeighbors,isInCheck,legalMove,legalMoves,applyMove,canPass,pass});
});
