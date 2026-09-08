"use strict";
/* Small rules-authority-preserving agent runner.
   Games expose state through an adapter; the agent only chooses among legal actions. */
(()=>{
  function choose(actions,rng=Math.random){if(!Array.isArray(actions)||!actions.length)return null;return actions[Math.floor(rng()*actions.length)]||null}
  function step(adapter,rng=Math.random){
    if(!adapter||adapter.isTerminal())return {status:"terminal"};
    const prep=adapter.prepareTurn?adapter.prepareTurn():null;
    if(prep)return {status:"prepared",action:prep};
    const actions=adapter.legalActions();
    if(!actions.length){const passed=adapter.pass?adapter.pass():null;return {status:"pass",action:passed}}
    const action=choose(actions,rng);adapter.apply(action);return {status:"move",action};
  }
  window.ChessAtlasGameAgent=Object.freeze({choose,step});
})();