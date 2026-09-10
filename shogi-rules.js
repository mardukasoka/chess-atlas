"use strict";
(function(root,factory){const api=factory(root?.ShogiPosition);if(typeof module==="object"&&module.exports)module.exports=api;if(root)root.ShogiRules=api;})(typeof globalThis!=="undefined"?globalThis:this,function(Position){
  const pos=Position||(typeof require==="function"?require('./shogi-position.js'):null);
  const BASE=['P','L','N','S','G','B','R'];
  const inside=(r,c)=>r>=0&&r<9&&c>=0&&c<9;
  const sideOf=p=>!p?null:(p.replace('+','')===p.replace('+','').toUpperCase()?'black':'white');
  const rawType=p=>p?p.replace('+','').toUpperCase():null;
  const promoted=p=>!!p&&p[0]==='+';
  const token=(side,type,isPromoted=false)=>`${isPromoted?'+':''}${side==='black'?type:type.toLowerCase()}`;
  const opponent=s=>s==='black'?'white':'black';
  const zone=(side,r)=>side==='black'?r<=2:r>=6;
  const forward=side=>side==='black'?-1:1;
  const cloneBoard=b=>b.map(r=>r.slice());
  const emptyHands=()=>({black:Object.fromEntries(BASE.map(t=>[t,0])),white:Object.fromEntries(BASE.map(t=>[t,0]))});
  function initialState(){return{board:pos.initialPosition(),hands:emptyHands(),turn:'black'};}
  function cloneState(s){return{board:cloneBoard(s.board),hands:{black:{...s.hands.black},white:{...s.hands.white}},turn:s.turn};}
  function ray(board,from,to,dr,dc){let r=from[0]+dr,c=from[1]+dc;while(inside(r,c)){if(r===to[0]&&c===to[1])return true;if(board[r][c])return false;r+=dr;c+=dc;}return false;}
  function goldStep(side,dr,dc){const f=forward(side);return (dr===f&&Math.abs(dc)<=1)||(dr===0&&Math.abs(dc)===1)||(dr===-f&&dc===0);}
  function pseudo(board,from,to,side){const [fr,fc]=from,[tr,tc]=to;if(!inside(fr,fc)||!inside(tr,tc)||(fr===tr&&fc===tc))return false;const p=board[fr][fc],target=board[tr][tc];if(!p||sideOf(p)!==side||sideOf(target)===side)return false;const dr=tr-fr,dc=tc-fc,aR=Math.abs(dr),aC=Math.abs(dc),f=forward(side),t=rawType(p),pr=promoted(p);
    if(t==='K')return aR<=1&&aC<=1;
    if(t==='G'||(pr&&['P','L','N','S'].includes(t)))return goldStep(side,dr,dc);
    if(t==='S')return (dr===f&&aC<=1)||(dr===-f&&aC===1);
    if(t==='N')return dr===2*f&&aC===1;
    if(t==='P')return dr===f&&dc===0;
    if(t==='L')return dc===0&&dr*f>0&&ray(board,from,to,f,0);
    if(t==='R'){if((dr===0)!==(dc===0)){const rr=dr===0?0:Math.sign(dr),cc=dc===0?0:Math.sign(dc);if(ray(board,from,to,rr,cc))return true;}return pr&&aR===1&&aC===1;}
    if(t==='B'){if(aR===aC&&aR>0&&ray(board,from,to,Math.sign(dr),Math.sign(dc)))return true;return pr&&aR+aC===1;}
    return false;
  }
  function kingSquare(board,side){for(let r=0;r<9;r++)for(let c=0;c<9;c++){const p=board[r][c];if(p&&sideOf(p)===side&&rawType(p)==='K')return[r,c];}return null;}
  function isInCheck(board,side){const k=kingSquare(board,side);if(!k)return true;const enemy=opponent(side);for(let r=0;r<9;r++)for(let c=0;c<9;c++)if(sideOf(board[r][c])===enemy&&pseudo(board,[r,c],k,enemy))return true;return false;}
  function canPromote(piece,side,from,to){const t=rawType(piece);return !promoted(piece)&&['P','L','N','S','B','R'].includes(t)&&(zone(side,from[0])||zone(side,to[0]));}
  function mustPromote(piece,side,to){const t=rawType(piece),r=to[0];if(t==='P'||t==='L')return side==='black'?r===0:r===8;if(t==='N')return side==='black'?r<=1:r>=7;return false;}
  function legalBoardMove(state,from,to,promote=false){const side=state.turn,p=state.board[from[0]]?.[from[1]];if(!pseudo(state.board,from,to,side))return false;if(promote&&!canPromote(p,side,from,to))return false;if(!promote&&mustPromote(p,side,to))return false;const b=cloneBoard(state.board);b[to[0]][to[1]]=token(side,rawType(p),promoted(p)||promote);b[from[0]][from[1]]=null;return !isInCheck(b,side);}
  function boardMoves(state,from){const out=[];const p=state.board[from[0]]?.[from[1]];if(!p||sideOf(p)!==state.turn)return out;for(let r=0;r<9;r++)for(let c=0;c<9;c++){if(legalBoardMove(state,from,[r,c],false))out.push({to:[r,c],promote:false});if(canPromote(p,state.turn,from,[r,c])&&legalBoardMove(state,from,[r,c],true))out.push({to:[r,c],promote:true});}return out;}
  function fileHasPawn(board,side,col){for(let r=0;r<9;r++){const p=board[r][col];if(p&&sideOf(p)===side&&rawType(p)==='P'&&!promoted(p))return true;}return false;}
  function legalDrop(state,type,to){type=String(type).toUpperCase();const side=state.turn,[r,c]=to;if(!BASE.includes(type)||!inside(r,c)||state.board[r][c]||!state.hands[side]?.[type])return false;if(type==='P'&&fileHasPawn(state.board,side,c))return false;if((type==='P'||type==='L')&&(side==='black'?r===0:r===8))return false;if(type==='N'&&(side==='black'?r<=1:r>=7))return false;const b=cloneBoard(state.board);b[r][c]=token(side,type,false);return !isInCheck(b,side);}
  function dropMoves(state,type){const out=[];for(let r=0;r<9;r++)for(let c=0;c<9;c++)if(legalDrop(state,type,[r,c]))out.push([r,c]);return out;}
  function applyBoardMove(state,from,to,promote=false){if(!legalBoardMove(state,from,to,promote))throw new Error('Illegal Shogi move');const next=cloneState(state),side=state.turn,p=next.board[from[0]][from[1]],captured=next.board[to[0]][to[1]];if(captured){const t=rawType(captured);if(BASE.includes(t))next.hands[side][t]=(next.hands[side][t]||0)+1;}next.board[to[0]][to[1]]=token(side,rawType(p),promoted(p)||promote);next.board[from[0]][from[1]]=null;next.turn=opponent(side);return next;}
  function applyDrop(state,type,to){type=String(type).toUpperCase();if(!legalDrop(state,type,to))throw new Error('Illegal Shogi drop');const next=cloneState(state),side=state.turn;next.board[to[0]][to[1]]=token(side,type,false);next.hands[side][type]-=1;next.turn=opponent(side);return next;}
  return Object.freeze({initialState,cloneState,sideOf,rawType,promoted,opponent,zone,isInCheck,canPromote,mustPromote,legalBoardMove,boardMoves,legalDrop,dropMoves,applyBoardMove,applyDrop});
});
