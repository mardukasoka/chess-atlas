"use strict";
(()=>{
  const model=window.JanggiPosition,grid=document.getElementById('janggi-grid'),status=document.getElementById('janggi-status');
  if(!model||!grid||!status)return;
  let board,selected=null;
  function render(){grid.textContent='';for(let r=0;r<10;r++)for(let c=0;c<9;c++){
    const cell=document.createElement('button');cell.type='button';cell.className='janggi-point';cell.style.left=`${c/8*100}%`;cell.style.top=`${r/9*100}%`;
    const p=board[r][c];cell.setAttribute('aria-label',`row ${r+1}, column ${c+1}${p?', '+p.label:''}`);
    if(selected&&selected[0]===r&&selected[1]===c)cell.classList.add('selected');
    if(p){const el=document.createElement('span');el.className=`janggi-piece ${p.side} type-${p.type}`;el.textContent=p.label;cell.appendChild(el);}
    cell.onclick=()=>{selected=p?[r,c]:null;status.textContent=p?`${p.side==='cho'?'Cho':'Han'} ${p.label} selected · legality phase pending`:'Select a piece';render();};grid.appendChild(cell);
  }}
  function reset(){const cho=document.getElementById('cho-formation').value,han=document.getElementById('han-formation').value;board=model.initialPosition(cho,han);selected=null;status.textContent='Cho to move · geometry/setup integrated; legality engine pending';render();}
  document.getElementById('janggi-reset').onclick=reset;document.getElementById('cho-formation').onchange=reset;document.getElementById('han-formation').onchange=reset;reset();
})();
