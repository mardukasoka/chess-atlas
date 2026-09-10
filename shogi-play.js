"use strict";
(()=>{
  const rules=window.ShogiRules,boardEl=document.getElementById('shogi-board'),status=document.getElementById('shogi-status');
  if(!rules||!boardEl||!status)return;
  const KANJI={K:'玉',R:'飛',B:'角',G:'金',S:'銀',N:'桂',L:'香',P:'歩'};
  const PROMOTED={R:'龍',B:'馬',S:'全',N:'圭',L:'杏',P:'と'};
  const ORDER=['R','B','G','S','N','L','P'];
  let state=rules.initialState(),selected=null,targets=[];
  const label=p=>rules.promoted(p)?(PROMOTED[rules.rawType(p)]||KANJI[rules.rawType(p)]):KANJI[rules.rawType(p)];
  const sideName=s=>s==='black'?'Sente':'Gote';
  const targetKey=([r,c])=>`${r},${c}`;
  function hand(side,id){const el=document.getElementById(id);el.textContent='';let any=false;for(const t of ORDER){const count=state.hands[side][t]||0;if(!count)continue;any=true;const b=document.createElement('button');b.type='button';b.className='hand-piece';b.textContent=`${KANJI[t]}×${count}`;b.disabled=side!==state.turn;b.onclick=()=>selectDrop(t);el.appendChild(b);}if(!any)el.textContent='—';}
  function render(){
    hand('white','shogi-white-hand');hand('black','shogi-black-hand');boardEl.textContent='';const legal=new Set(targets.map(x=>targetKey(x.to)));
    for(let r=0;r<9;r++)for(let c=0;c<9;c++){
      const cell=document.createElement('button');cell.type='button';cell.className='shogi-cell';if(r<=2)cell.classList.add('white-zone');if(r>=6)cell.classList.add('black-zone');
      const p=state.board[r][c];cell.setAttribute('aria-label',`row ${r+1}, column ${c+1}${p?', '+label(p):''}`);
      if(selected?.kind==='board'&&selected.from[0]===r&&selected.from[1]===c)cell.classList.add('selected');if(legal.has(`${r},${c}`))cell.classList.add('legal');
      if(p){const piece=document.createElement('span');piece.className=`shogi-piece ${rules.sideOf(p)}`;piece.textContent=label(p);cell.appendChild(piece);}
      cell.onclick=()=>choose(r,c);boardEl.appendChild(cell);
    }
  }
  function selectDrop(type){selected={kind:'drop',type};targets=rules.dropMoves(state,type).map(to=>({to}));status.textContent=`${sideName(state.turn)} · drop ${KANJI[type]} · ${targets.length} legal square${targets.length===1?'':'s'}`;render();}
  function choose(r,c){
    const options=targets.filter(x=>x.to[0]===r&&x.to[1]===c);
    if(selected&&options.length){
      if(selected.kind==='drop')state=rules.applyDrop(state,selected.type,[r,c]);else{
        let promote=false;const promoted=options.find(x=>x.promote),plain=options.find(x=>!x.promote);
        if(promoted&&!plain)promote=true;else if(promoted&&plain)promote=window.confirm?window.confirm('Promote this piece?'):false;
        state=rules.applyBoardMove(state,selected.from,[r,c],promote);
      }
      selected=null;targets=[];status.textContent=`${sideName(state.turn)} to move${rules.isInCheck(state.board,state.turn)?' · check':''}`;render();return;
    }
    const p=state.board[r][c];if(p&&rules.sideOf(p)===state.turn){selected={kind:'board',from:[r,c]};targets=rules.boardMoves(state,[r,c]);status.textContent=`${sideName(state.turn)} · ${label(p)} selected · ${new Set(targets.map(x=>targetKey(x.to))).size} destination${targets.length===1?'':'s'}`;render();return;}
    selected=null;targets=[];status.textContent=`${sideName(state.turn)} to move · select a piece or a piece in hand`;render();
  }
  function reset(){state=rules.initialState();selected=null;targets=[];status.textContent='Sente to move';render();}
  document.getElementById('shogi-reset').onclick=reset;reset();
})();
