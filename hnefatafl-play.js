"use strict";
(function(){
  const {HnefataflGame,THRONE,CORNERS}=window.ChessAtlasHnefatafl;
  const boardEl=document.getElementById("tafl-board"),statusEl=document.getElementById("tafl-status"),detailEl=document.getElementById("tafl-detail"),resetEl=document.getElementById("tafl-reset");
  let game=new HnefataflGame(),selected=null;
  const same=(a,b)=>a&&b&&a[0]===b[0]&&a[1]===b[1];
  const restricted=(r,c)=>same([r,c],THRONE)||CORNERS.some(x=>same(x,[r,c]));
  const glyph=p=>p==="attacker"?"●":p==="defender"?"○":p==="king"?"♚":"";
  const side=p=>p==="attacker"?"attackers":(p==="defender"||p==="king"?"defenders":null);
  const legal=()=>selected?game.movesFrom(...selected):[];
  function renderStatus(){if(game.winner){const labels={"king-escaped":"Defenders win — the king escaped.","king-captured":"Attackers win — the king was captured.",encirclement:"Attackers win — the defenders were encircled.","no-legal-move":`${game.winner==="attackers"?"Attackers":"Defenders"} win — the opponent has no legal move.`};statusEl.textContent=labels[game.result]||`${game.winner} win`;detailEl.textContent="";return;}statusEl.textContent=game.turn==="attackers"?"Attackers to move":"Defenders to move";detailEl.textContent=`Captured: ${game.captured.attackers} attackers · ${game.captured.defenders} defenders`;}
  function render(){renderStatus();const moves=legal();boardEl.replaceChildren();for(let r=0;r<11;r++)for(let c=0;c<11;c++){const b=document.createElement("button");b.type="button";b.className="tafl-cell";b.dataset.row=r;b.dataset.col=c;if(restricted(r,c))b.classList.add("restricted");if(same(selected,[r,c]))b.classList.add("selected");if(moves.some(m=>same(m.to,[r,c])))b.dataset.legal="true";const p=game.at(r,c);b.textContent=glyph(p);b.setAttribute("aria-label",p?`${p} at row ${r+1}, column ${c+1}`:`empty row ${r+1}, column ${c+1}`);b.addEventListener("click",click);boardEl.appendChild(b);}}
  function click(e){if(game.winner)return;const r=Number(e.currentTarget.dataset.row),c=Number(e.currentTarget.dataset.col),move=legal().find(m=>same(m.to,[r,c]));if(move){game.apply(move);selected=null;render();return;}const p=game.at(r,c);selected=p&&side(p)===game.turn?[r,c]:null;render();}
  resetEl.addEventListener("click",()=>{game=new HnefataflGame();selected=null;render();});render();
})();
