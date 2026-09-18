"use strict";
/* First agent bridge: human plays White, lightweight Atlas agent plays Black.
   The game engine remains authoritative; the agent only selects legal actions. */
(()=>{
  const opponent=document.getElementById("history-opponent");
  if(!opponent||!window.ChessAtlasGameAgent)return;
  const supported=new Set(["ur","senet","konane"]);
  let timer=null;

  function agentActive(){return opponent.value==="agent"&&supported.has(mode)&&game&&!game.winner&&game.turn==="b"}
  function adapter(){
    if(mode==="ur")return{
      isTerminal:()=>Boolean(game.winner),
      prepareTurn:()=>{if(game.lastRoll===null){game.cast();recordState("agent cast");return"cast"}return null},
      legalActions:()=>game.legalMoves(),
      choose:actions=>window.ChessAtlasUrAgent?window.ChessAtlasUrAgent.create().chooseAction({game,legalActions:actions}):actions[0],
      apply:m=>{game.move(m.pieceIndex);recordState("agent move")},
      pass:()=>{game.passIfNoMove();recordState("agent pass");return"pass"}
    };
    if(mode==="konane")return{\n      isTerminal:()=>Boolean(game.winner),\n      prepareTurn:()=>null,\n      legalActions:()=>game.phase==="play"?game.legalMoves():[],\n      choose:actions=>window.ChessAtlasKonaneAgent?window.ChessAtlasKonaneAgent.create({depth:2}).chooseAction({game,legalActions:actions}):actions[0],\n      apply:m=>game.move(m.from,m.to),\n      pass:()=>null\n    };\n    if(mode==="senet")return{
      isTerminal:()=>Boolean(game.winner),
      prepareTurn:()=>{if(game.lastThrow===null){game.cast();recordState("agent cast");return"cast"}return null},
      legalActions:()=>game.legalMoves(),
      apply:m=>{game.move(m.pieceIndex);recordState("agent move")},
      pass:()=>{game.passIfNoMove();recordState("agent pass");return"pass"}
    };
    return null;
  }
  function schedule(){
    if(timer){clearTimeout(timer);timer=null}
    if(!agentActive())return;
    Array.from(actions.querySelectorAll("button")).forEach(b=>b.disabled=true);
    timer=setTimeout(()=>{
      timer=null;
      const a=adapter();if(!a)return;
      window.ChessAtlasGameAgent.step(a);
      render();
    },220);
  }
  const baseRender=render;
  render=function(){baseRender();schedule()};
  function syncOpponent(){
    const option=opponent.querySelector('option[value="agent"]');
    const ok=supported.has(mode);
    if(option){option.disabled=!ok;option.textContent=ok?"Atlas agent · Black":"Atlas agent · unavailable for this game"}
    if(!ok&&opponent.value==="agent")opponent.value="human";
    schedule();
  }
  opponent.addEventListener("change",()=>{render();syncOpponent()});
  modeSelect.addEventListener("change",()=>setTimeout(syncOpponent,0));
  syncOpponent();
})();