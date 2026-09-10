"use strict";
(function(root,factory){const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;if(root)root.ChessAtlasBackgammon=api;})(typeof globalThis!=="undefined"?globalThis:this,function(){
  const WHITE='white',BLACK='black';
  const opponent=s=>s===WHITE?BLACK:WHITE;
  const sign=s=>s===WHITE?1:-1;
  const owner=v=>v>0?WHITE:v<0?BLACK:null;
  const count=v=>Math.abs(v||0);
  const clone=s=>({points:s.points.slice(),bar:{...s.bar},off:{...s.off},turn:s.turn,diceRemaining:s.diceRemaining.slice(),status:s.status,winner:s.winner||null});
  function create(){const points=Array(25).fill(0);points[24]=2;points[13]=5;points[8]=3;points[6]=5;points[1]=-2;points[12]=-5;points[17]=-3;points[19]=-5;return{points,bar:{white:0,black:0},off:{white:0,black:0},turn:null,diceRemaining:[],status:'opening',winner:null};}
  function openPoint(state,side,p){const v=state.points[p];return owner(v)!==opponent(side)||count(v)<=1;}
  function homePoint(side,p){return side===WHITE?p>=1&&p<=6:p>=19&&p<=24;}
  function allHome(state,side){if(state.bar[side])return false;for(let p=1;p<=24;p++)if(owner(state.points[p])===side&&!homePoint(side,p))return false;return true;}
  function entryPoint(side,die){return side===WHITE?25-die:die;}
  function bearAllowed(state,side,p,die){if(!allHome(state,side))return false;const dest=side===WHITE?p-die:p+die;if(side===WHITE){if(dest===0)return true;if(dest>0)return false;for(let q=p+1;q<=6;q++)if(owner(state.points[q])===side)return false;return true;}if(dest===25)return true;if(dest<25)return false;for(let q=19;q<p;q++)if(owner(state.points[q])===side)return false;return true;}
  function singleMoves(state,die){const side=state.turn;if(!side||state.status==='finished')return[];const moves=[];if(state.bar[side]>0){const to=entryPoint(side,die);if(openPoint(state,side,to))moves.push({from:'bar',to,die});return moves;}
    for(let p=1;p<=24;p++){if(owner(state.points[p])!==side)continue;const to=side===WHITE?p-die:p+die;if(to>=1&&to<=24){if(openPoint(state,side,to))moves.push({from:p,to,die});}else if(bearAllowed(state,side,p,die))moves.push({from:p,to:'off',die});}return moves;}
  function applySingle(state,move){const next=clone(state),side=next.turn,s=sign(side);if(move.from==='bar')next.bar[side]-=1;else next.points[move.from]-=s;if(move.to==='off')next.off[side]+=1;else{const target=next.points[move.to];if(owner(target)===opponent(side)&&count(target)===1){next.bar[opponent(side)]+=1;next.points[move.to]=0;}next.points[move.to]+=s;}if(next.off[side]===15){next.status='finished';next.winner=side;next.diceRemaining=[];}return next;}
  function sequences(state,dice){const out=[];function walk(s,remaining,seq){let extended=false;const used=new Set();for(let i=0;i<remaining.length;i++){const die=remaining[i];if(used.has(die))continue;used.add(die);for(const move of singleMoves(s,die)){extended=true;const rest=remaining.slice();rest.splice(i,1);walk(applySingle(s,move),rest,seq.concat(move));}}if(!extended)out.push(seq);}walk(state,dice,[]);const max=Math.max(0,...out.map(s=>s.length));let best=out.filter(s=>s.length===max);if(max===1&&dice.length===2&&dice[0]!==dice[1]){const hi=Math.max(...dice);if(best.some(s=>s[0]?.die===hi))best=best.filter(s=>s[0]?.die===hi);}return best;}
  function legalNextMoves(state){if(!state.diceRemaining.length)return[];const seqs=sequences(state,state.diceRemaining),seen=new Set(),out=[];for(const seq of seqs){const m=seq[0];if(!m)continue;const k=`${m.from}:${m.to}:${m.die}`;if(!seen.has(k)){seen.add(k);out.push(m);}}return out;}
  function finishTurn(next){if(next.status==='finished')return next;if(next.diceRemaining.length&&legalNextMoves(next).length)return next;next.diceRemaining=[];next.turn=opponent(next.turn);return next;}
  function playMove(state,move){const legal=legalNextMoves(state).find(m=>m.from===move.from&&m.to===move.to&&m.die===move.die);if(!legal)throw new Error('Illegal Backgammon move');let next=applySingle(state,legal);const i=next.diceRemaining.indexOf(legal.die);if(i>=0)next.diceRemaining.splice(i,1);return finishTurn(next);}
  function start(state,whiteDie,blackDie){if(state.status!=='opening'||whiteDie===blackDie)throw new Error('Opening roll requires unequal dice');const next=clone(state);next.status='playing';next.turn=whiteDie>blackDie?WHITE:BLACK;next.diceRemaining=[whiteDie,blackDie];return next;}
  function roll(state,d1,d2){if(state.status!=='playing'||!state.turn||state.diceRemaining.length)throw new Error('Cannot roll now');const next=clone(state);next.diceRemaining=d1===d2?[d1,d1,d1,d1]:[d1,d2];return finishTurn(next);}
  function snapshot(s){return{points:s.points.slice(),bar:{...s.bar},off:{...s.off},turn:s.turn,diceRemaining:s.diceRemaining.slice(),status:s.status,winner:s.winner};}
  return Object.freeze({create,snapshot,owner,count,opponent,allHome,singleMoves,sequences,legalNextMoves,playMove,start,roll,constants:Object.freeze({WHITE,BLACK})});
});
