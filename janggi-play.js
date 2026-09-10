"use strict";
(()=>{
  const rules=window.JanggiRules,grid=document.getElementById('janggi-grid'),status=document.getElementById('janggi-status');
  if(!rules||!grid||!status)return;
  let state,selected=null,legal=[];
  const sideName=s=>s==='cho'?'Cho':'Han';
  function render(){grid.textContent='';const keys=new Set(legal.map(([r,c])=>`${r},${c}`));for(let r=0;r<10;r++)for(let c=0;c<9;c++){
    const cell=document.createElement('button');cell.type='button';cell.className='janggi-point';cell.style.left=`${c/8*100}%`;cell.style.top=`${r/9*100}%`;
    const p=state.board[r][c];cell.setAttribute('aria-label',`row ${r+1}, column ${c+1}${p?', '+p.label:''}`);
    if(selected&&selected[0]===r&&selected[1]===c)cell.classList.add('selected');if(keys.has(`${r},${c}`))cell.classList.add('legal');
    if(p){const el=document.createElement('span');el.className=`janggi-piece ${p.side} type-${p.type}`;el.textContent=p.label;cell.appendChild(el);}
    cell.onclick=()=>choose(r,c);grid.appendChild(cell);
  }}
  function choose(r,c){if(selected&&legal.some(([lr,lc])=>lr===r&&lc===c)){state=rules.applyMove(state,selected,[r,c]);selected=null;legal=[];status.textContent=`${sideName(state.turn)} to move${rules.isInCheck(state.board,state.turn)?' · check':''}`;render();return;}const p=state.board[r][c];if(p?.side===state.turn){selected=[r,c];legal=rules.legalMoves(state,selected);status.textContent=`${sideName(state.turn)} · ${p.label} selected · ${legal.length} legal move${legal.length===1?'':'s'}`;render();return;}selected=null;legal=[];status.textContent=`${sideName(state.turn)} to move · select one of your pieces`;render();}
  function reset(){const cho=document.getElementById('cho-formation').value,han=document.getElementById('han-formation').value;state=rules.initialState(cho,han);selected=null;legal=[];status.textContent='Cho to move';render();}
  document.getElementById('janggi-reset').onclick=reset;document.getElementById('cho-formation').onchange=reset;document.getElementById('han-formation').onchange=reset;document.getElementById('janggi-pass').onclick=()=>{if(!rules.canPass(state)){status.textContent='Pass is not legal while in check';return;}state=rules.pass(state);selected=null;legal=[];status.textContent=`${sideName(state.turn)} to move · opponent passed`;render();};reset();
})();
