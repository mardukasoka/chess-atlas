"use strict";
(()=>{
  const rules=window.XiangqiRules,Module=window.ChessAtlasXiangqiModule,Modules=window.ChessAtlasGameModules,Agents=window.ChessAtlasGameAgents,H=window.ChessAtlasAgentHeuristics;
  const grid=document.getElementById('grid'),status=document.getElementById('status');
  if(!rules||!Module||!grid||!status)return;
  let game=Module.create(),selected=null,legal=[],busy=false;
  const key=([r,c])=>`${r},${c}`;
  const opponentMode=()=>document.getElementById('xiangqi-opponent').value;
  const isAgentTurn=()=>game.turn==='black'&&opponentMode()!=='human';
  function currentAgent(){const mode=opponentMode();if(mode==='heuristic')return H?.createAgent(Agents,'xiangqi',{id:'xiangqi-heuristic',name:'Atlas Heuristic'});if(mode==='random')return Agents?.randomAgent({id:'xiangqi-random',name:'Random Legal'});return null;}
  function setStatus(message){status.textContent=message;}
  function render(){
    grid.textContent='';const legalKeys=new Set(legal.map(key));
    for(let r=0;r<10;r++)for(let c=0;c<9;c++){
      const cell=document.createElement('button');cell.className='sq';cell.type='button';cell.style.left=`${(c/8)*100}%`;cell.style.top=`${(r/9)*100}%`;
      const p=game.board[r][c];cell.setAttribute('aria-label',`row ${r+1}, column ${c+1}${p?', '+p:''}`);
      if(selected&&selected[0]===r&&selected[1]===c)cell.classList.add('selected');if(legalKeys.has(`${r},${c}`))cell.classList.add('legal');
      if(p){const el=document.createElement('span');el.className=`piece ${rules.sideOf(p)}`;el.textContent=p;cell.appendChild(el);}cell.disabled=busy||isAgentTurn();cell.onclick=()=>choose(r,c);grid.appendChild(cell);
    }
    document.getElementById('clear').disabled=busy||isAgentTurn();
  }
  async function maybeAgent(){if(!isAgentTurn()||busy||!Modules||!Agents)return;const agent=currentAgent();if(!agent)return;busy=true;selected=null;legal=[];setStatus('Black · agent thinking');render();try{const result=await Agents.takeTurn({modules:Modules,gameId:'xiangqi',game,agent});if(result.status==='applied'){game=result.result;setStatus(`Red to move${rules.isInCheck(game.board,'red')?' · check':''}`);}}catch(e){setStatus(`Agent error: ${e.message}`);}finally{busy=false;render();}}
  function choose(r,c){if(busy||isAgentTurn())return;const p=game.board[r][c];if(selected&&legal.some(([lr,lc])=>lr===r&&lc===c)){
      game=Module.applyAction(game,{type:'move',from:selected,to:[r,c]});selected=null;legal=[];const check=rules.isInCheck(game.board,game.turn);setStatus(`${game.turn==='red'?'Red':'Black'} to move${check?' · check':''}`);render();void maybeAgent();return;
    }
    if(p&&rules.sideOf(p)===game.turn){selected=[r,c];legal=rules.legalMoves(game.board,selected,game.turn);setStatus(`${game.turn==='red'?'Red':'Black'} · ${p} selected · ${legal.length} legal move${legal.length===1?'':'s'}`);render();return;}
    selected=null;legal=[];setStatus(`${game.turn==='red'?'Red':'Black'} to move · select one of your pieces`);render();
  }
  function reset(){game=Module.create();selected=null;legal=[];busy=false;setStatus('Red to move');render();}
  document.getElementById('reset').onclick=reset;document.getElementById('clear').onclick=()=>{selected=null;legal=[];setStatus(`${game.turn==='red'?'Red':'Black'} to move`);render();};document.getElementById('xiangqi-opponent').onchange=()=>{selected=null;legal=[];render();void maybeAgent();};reset();
})();
