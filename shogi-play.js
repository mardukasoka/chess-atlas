"use strict";
(()=>{
  const model=window.ShogiPosition,boardEl=document.getElementById('shogi-board'),status=document.getElementById('shogi-status');
  if(!model||!boardEl||!status)return;
  const KANJI={K:'玉',R:'飛',B:'角',G:'金',S:'銀',N:'桂',L:'香',P:'歩'};
  let board=model.initialPosition(),selected=null;
  function render(){boardEl.textContent='';for(let r=0;r<9;r++)for(let c=0;c<9;c++){
    const cell=document.createElement('button');cell.type='button';cell.className='shogi-cell';if(r<=2)cell.classList.add('white-zone');if(r>=6)cell.classList.add('black-zone');
    const p=board[r][c];cell.setAttribute('aria-label',`row ${r+1}, column ${c+1}${p?', '+KANJI[model.typeOf(p)]:''}`);
    if(selected&&selected[0]===r&&selected[1]===c)cell.classList.add('selected');
    if(p){const piece=document.createElement('span');piece.className=`shogi-piece ${model.sideOf(p)}`;piece.textContent=KANJI[model.typeOf(p)];cell.appendChild(piece);}
    cell.onclick=()=>{selected=p?[r,c]:null;status.textContent=p?`${model.sideOf(p)==='black'?'Sente':'Gote'} ${KANJI[model.typeOf(p)]} selected · move/drop legality phase pending`:'Select a piece';render();};boardEl.appendChild(cell);
  }}
  function reset(){board=model.initialPosition();selected=null;status.textContent='Sente to move · board integrated; legality/drop engine pending';render();}
  document.getElementById('shogi-reset').onclick=reset;reset();
})();
