"use strict";
(()=>{
  const Go=window.ChessAtlasGoModule,Modules=window.ChessAtlasGameModules,Agents=window.ChessAtlasGameAgents,boardEl=document.getElementById('go-board'),status=document.getElementById('go-status'),detail=document.getElementById('go-detail');
  if(!Go||!boardEl||!status)return;
  let game,busy=false;const agent=Agents?.randomAgent({id:'go-random',name:'Atlas legal agent'});
  const stars={9:[[2,2],[2,6],[4,4],[6,2],[6,6]],13:[[3,3],[3,9],[6,6],[9,3],[9,9]],19:[[3,3],[3,9],[3,15],[9,3],[9,9],[9,15],[15,3],[15,9],[15,15]]};
  function isAgentTurn(){const snap=Go.snapshot(game);return document.getElementById('go-opponent').value==='random'&&snap.status==='playing'&&snap.turn==='white';}
  function render(){const snap=Go.snapshot(game),size=snap.size;boardEl.textContent='';
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('class','go-lines');svg.setAttribute('viewBox',`0 0 ${size-1} ${size-1}`);svg.setAttribute('preserveAspectRatio','none');svg.setAttribute('aria-hidden','true');
    for(let i=0;i<size;i++){for(const [x1,y1,x2,y2] of [[0,i,size-1,i],[i,0,i,size-1]]){const line=document.createElementNS(svg.namespaceURI,'line');line.setAttribute('x1',x1);line.setAttribute('y1',y1);line.setAttribute('x2',x2);line.setAttribute('y2',y2);svg.appendChild(line);}}
    boardEl.appendChild(svg);const starSet=new Set((stars[size]||[]).map(([r,c])=>`${r},${c}`));
    for(let r=0;r<size;r++)for(let c=0;c<size;c++){const point=document.createElement('button');point.type='button';point.className='go-point';point.style.left=`${c/(size-1)*100}%`;point.style.top=`${r/(size-1)*100}%`;const stone=snap.board[r][c];point.setAttribute('aria-label',`row ${r+1}, column ${c+1}${stone===1?', black stone':stone===2?', white stone':''}`);if(starSet.has(`${r},${c}`)&&!stone)point.classList.add('star');if(stone){const el=document.createElement('span');el.className=`go-stone ${stone===1?'black':'white'}`;point.appendChild(el);}point.disabled=busy||isAgentTurn();point.onclick=()=>place(r,c);boardEl.appendChild(point);}
    status.textContent=snap.status==='playing'?`${snap.turn==='black'?'Black':'White'} to move${busy?' · agent thinking':''}`:'Two passes · scoring phase';detail.textContent=`Captures · Black ${snap.captures.black} · White ${snap.captures.white} · ${size}×${size}`;document.getElementById('go-pass').disabled=busy||isAgentTurn()||snap.status!=='playing';
  }
  async function maybeAgent(){if(!isAgentTurn()||busy||!agent||!Modules)return;busy=true;render();try{const result=await Agents.takeTurn({modules:Modules,gameId:'go',game,agent});if(result.status==='applied')game=result.result;}catch(e){status.textContent=`Agent error: ${e.message}`;}finally{busy=false;render();}}
  function place(r,c){if(busy||isAgentTurn())return;try{Go.applyAction(game,{type:'place',at:[r,c]});render();void maybeAgent();}catch(e){status.textContent=e.message==='Illegal Go placement'?'Illegal placement · occupied, suicide or superko':e.message;}}
  function reset(){game=Go.create({size:Number(document.getElementById('go-size').value)});busy=false;render();}
  document.getElementById('go-size').onchange=reset;document.getElementById('go-opponent').onchange=()=>{render();void maybeAgent();};document.getElementById('go-reset').onclick=reset;document.getElementById('go-pass').onclick=()=>{if(busy||isAgentTurn())return;try{Go.applyAction(game,{type:'pass'});render();void maybeAgent();}catch(e){status.textContent=e.message;}};reset();
})();
