"use strict";
(()=>{
  const rules=window.XiangqiRules;
  const grid=document.getElementById('grid');
  const status=document.getElementById('status');
  if(!rules||!grid||!status)return;
  let board=rules.initialPosition(),turn='red',selected=null,legal=[];
  const key=([r,c])=>`${r},${c}`;
  function setStatus(message){status.textContent=message;}
  function render(){
    grid.textContent='';const legalKeys=new Set(legal.map(key));
    for(let r=0;r<10;r++)for(let c=0;c<9;c++){
      const cell=document.createElement('button');cell.className='sq';cell.type='button';
      const p=board[r][c];cell.setAttribute('aria-label',`row ${r+1}, column ${c+1}${p?', '+p:''}`);
      if(selected&&selected[0]===r&&selected[1]===c)cell.classList.add('selected');
      if(legalKeys.has(`${r},${c}`))cell.classList.add('legal');
      if(p){const el=document.createElement('span');el.className=`piece ${rules.sideOf(p)}`;el.textContent=p;cell.appendChild(el);}
      cell.onclick=()=>choose(r,c);grid.appendChild(cell);
    }
  }
  function choose(r,c){
    const p=board[r][c];
    if(selected&&legal.some(([lr,lc])=>lr===r&&lc===c)){
      board=rules.applyMove(board,selected,[r,c],turn);turn=rules.opponent(turn);selected=null;legal=[];
      const check=rules.isInCheck(board,turn);setStatus(`${turn==='red'?'Red':'Black'} to move${check?' · check':''}`);render();return;
    }
    if(p&&rules.sideOf(p)===turn){selected=[r,c];legal=rules.legalMoves(board,selected,turn);setStatus(`${turn==='red'?'Red':'Black'} · ${p} selected · ${legal.length} legal move${legal.length===1?'':'s'}`);render();return;}
    selected=null;legal=[];setStatus(`${turn==='red'?'Red':'Black'} to move · select one of your pieces`);render();
  }
  function reset(){board=rules.initialPosition();turn='red';selected=null;legal=[];setStatus('Red to move');render();}
  document.getElementById('reset').onclick=reset;
  document.getElementById('clear').onclick=()=>{selected=null;legal=[];setStatus(`${turn==='red'?'Red':'Black'} to move`);render();};
  reset();
})();
