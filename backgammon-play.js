"use strict";
(()=>{
  const B=window.ChessAtlasBackgammon,board=document.getElementById('bg-board'),status=document.getElementById('bg-status'),diceEl=document.getElementById('bg-dice'),movesEl=document.getElementById('bg-moves');
  if(!B||!board)return;let game=B.create();
  const name=s=>s==='white'?'White':'Black';
  function pointColumn(p){if(p>=13&&p<=18)return p-12;if(p>=19)return p-11;if(p>=7&&p<=12)return 13-p;return 14-p;}
  function pointRow(p){return p>=13?1:2;}
  function renderPoint(p,value){const el=document.createElement('div');el.className=`bg-point ${pointRow(p)===1?'top':'bottom'}`;el.style.gridColumn=pointColumn(p);el.style.gridRow=pointRow(p);el.dataset.point=p;const n=document.createElement('small');n.textContent=p;el.appendChild(n);const count=Math.abs(value);for(let i=0;i<Math.min(count,5);i++){const c=document.createElement('span');c.className=`checker ${value>0?'white':'black'}`;el.appendChild(c);}if(count>5){const badge=document.createElement('b');badge.textContent=`×${count}`;el.appendChild(badge);}return el;}
  function moveLabel(m){return `${m.from==='bar'?'Bar':m.from} → ${m.to==='off'?'Off':m.to} · ${m.die}`;}
  function renderMoves(){movesEl.textContent='';const moves=B.legalNextMoves(game);if(!game.diceRemaining.length)return;if(!moves.length){const span=document.createElement('span');span.textContent='No legal move; turn passes automatically.';movesEl.appendChild(span);return;}for(const m of moves){const b=document.createElement('button');b.type='button';b.textContent=moveLabel(m);b.onclick=()=>{try{game=B.playMove(game,m);render();}catch(e){status.textContent=e.message;}};movesEl.appendChild(b);}}
  function render(){const s=B.snapshot(game);board.textContent='';for(let p=1;p<=24;p++)board.appendChild(renderPoint(p,s.points[p]));const bar=document.createElement('div');bar.className='bg-bar';bar.style.gridColumn='7';bar.style.gridRow='1 / 3';bar.innerHTML=`<strong>BAR</strong><span>○ ${s.bar.white}</span><span>● ${s.bar.black}</span>`;board.appendChild(bar);document.getElementById('bg-off-white').textContent=`White off: ${s.off.white}`;document.getElementById('bg-off-black').textContent=`Black off: ${s.off.black}`;
    diceEl.textContent=s.diceRemaining.length?`Dice: ${s.diceRemaining.join(' · ')}`:'Dice: —';const roll=document.getElementById('bg-roll');roll.disabled=s.status==='finished'||(s.status==='playing'&&s.diceRemaining.length>0);
    status.textContent=s.status==='opening'?'Opening roll · press Start':s.status==='finished'?`${name(s.winner)} wins`:s.diceRemaining.length?`${name(s.turn)} · play the roll`:`${name(s.turn)} to roll`;renderMoves();}
  function die(){return 1+Math.floor(Math.random()*6);}
  document.getElementById('bg-roll').onclick=()=>{try{if(game.status==='opening'){let w,b;do{w=die();b=die();}while(w===b);game=B.start(game,w,b);status.textContent=`Opening: White ${w}, Black ${b}`;}else game=B.roll(game,die(),die());render();}catch(e){status.textContent=e.message;}};
  document.getElementById('bg-reset').onclick=()=>{game=B.create();render();};render();
})();
