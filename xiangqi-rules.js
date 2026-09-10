"use strict";
(function(root,factory){const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;if(root)root.XiangqiRules=api;})(typeof globalThis!=="undefined"?globalThis:this,function(){
  const START=[
    ['車','馬','象','士','將','士','象','馬','車'],[null,null,null,null,null,null,null,null,null],[null,'砲',null,null,null,null,null,'砲',null],['卒',null,'卒',null,'卒',null,'卒',null,'卒'],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],['兵',null,'兵',null,'兵',null,'兵',null,'兵'],[null,'炮',null,null,null,null,null,'炮',null],[null,null,null,null,null,null,null,null,null],['俥','傌','相','仕','帥','仕','相','傌','俥']
  ];
  const TYPE=new Map([
    ['車','r'],['俥','r'],['馬','h'],['傌','h'],['象','e'],['相','e'],['士','a'],['仕','a'],['將','k'],['帥','k'],['砲','c'],['炮','c'],['卒','p'],['兵','p']
  ]);
  const RED=new Set(['俥','傌','相','仕','帥','炮','兵']);
  const BLACK=new Set(['車','馬','象','士','將','砲','卒']);
  const inside=(r,c)=>r>=0&&r<10&&c>=0&&c<9;
  const clone=board=>board.map(row=>row.slice());
  const sideOf=piece=>RED.has(piece)?'red':BLACK.has(piece)?'black':null;
  const typeOf=piece=>TYPE.get(piece)||null;
  const opponent=side=>side==='red'?'black':'red';
  const palace=(side,r,c)=>c>=3&&c<=5&&(side==='black'?r>=0&&r<=2:r>=7&&r<=9);
  const clearBetween=(board,fr,fc,tr,tc)=>{let count=0;if(fr===tr){const lo=Math.min(fc,tc)+1,hi=Math.max(fc,tc);for(let c=lo;c<hi;c++)if(board[fr][c])count++;return count;}if(fc===tc){const lo=Math.min(fr,tr)+1,hi=Math.max(fr,tr);for(let r=lo;r<hi;r++)if(board[r][fc])count++;return count;}return Infinity;};
  function pseudoLegal(board,from,to,side,{allowKingCapture=false}={}){
    const [fr,fc]=from,[tr,tc]=to;if(!inside(fr,fc)||!inside(tr,tc)||(fr===tr&&fc===tc))return false;
    const piece=board[fr][fc],target=board[tr][tc];if(!piece||sideOf(piece)!==side||sideOf(target)===side)return false;
    if(target&&typeOf(target)==='k'&&!allowKingCapture)return false;
    const dr=tr-fr,dc=tc-fc,adr=Math.abs(dr),adc=Math.abs(dc),type=typeOf(piece);
    if(type==='r')return (fr===tr||fc===tc)&&clearBetween(board,fr,fc,tr,tc)===0;
    if(type==='c'){
      if(fr!==tr&&fc!==tc)return false;const screens=clearBetween(board,fr,fc,tr,tc);return target?screens===1:screens===0;
    }
    if(type==='h'){
      if(!((adr===2&&adc===1)||(adr===1&&adc===2)))return false;
      const leg=adr===2?[fr+Math.sign(dr),fc]:[fr,fc+Math.sign(dc)];return !board[leg[0]][leg[1]];
    }
    if(type==='e'){
      if(adr!==2||adc!==2)return false;if(side==='black'&&tr>4)return false;if(side==='red'&&tr<5)return false;
      return !board[fr+dr/2][fc+dc/2];
    }
    if(type==='a')return adr===1&&adc===1&&palace(side,tr,tc);
    if(type==='k'){
      if(fr===tr&&fc===tc)return false;
      if(fc===tc&&target&&typeOf(target)==='k'&&clearBetween(board,fr,fc,tr,tc)===0)return true;
      return adr+adc===1&&palace(side,tr,tc);
    }
    if(type==='p'){
      const forward=side==='black'?1:-1,crossed=side==='black'?fr>=5:fr<=4;
      if(dr===forward&&dc===0)return true;return crossed&&dr===0&&adc===1;
    }
    return false;
  }
  function findGeneral(board,side){for(let r=0;r<10;r++)for(let c=0;c<9;c++){const p=board[r][c];if(p&&sideOf(p)===side&&typeOf(p)==='k')return[r,c];}return null;}
  function generalsFace(board){const red=findGeneral(board,'red'),black=findGeneral(board,'black');return !!red&&!!black&&red[1]===black[1]&&clearBetween(board,red[0],red[1],black[0],black[1])===0;}
  function isInCheck(board,side){const king=findGeneral(board,side);if(!king)return true;if(generalsFace(board))return true;const enemy=opponent(side);for(let r=0;r<10;r++)for(let c=0;c<9;c++){if(sideOf(board[r][c])===enemy&&pseudoLegal(board,[r,c],king,enemy,{allowKingCapture:true}))return true;}return false;}
  function isLegalMove(board,from,to,side){if(!pseudoLegal(board,from,to,side,{allowKingCapture:true}))return false;const next=clone(board);next[to[0]][to[1]]=next[from[0]][from[1]];next[from[0]][from[1]]=null;return !isInCheck(next,side);}
  function legalMoves(board,from,side){const out=[];for(let r=0;r<10;r++)for(let c=0;c<9;c++)if(isLegalMove(board,from,[r,c],side))out.push([r,c]);return out;}
  function applyMove(board,from,to,side){if(!isLegalMove(board,from,to,side))throw new Error('Illegal Xiangqi move');const next=clone(board);next[to[0]][to[1]]=next[from[0]][from[1]];next[from[0]][from[1]]=null;return next;}
  function initialPosition(){return clone(START);}
  return Object.freeze({initialPosition,clone,sideOf,typeOf,opponent,palace,generalsFace,isInCheck,isLegalMove,legalMoves,applyMove});
});
