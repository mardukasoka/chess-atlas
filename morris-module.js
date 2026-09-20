"use strict";
(function(root,factory){
  const GraphGames=typeof require!=="undefined"?require("./graph-games.js"):root.ChessAtlasGraphGames;
  const registry=typeof require!=="undefined"?require("./game-modules.js"):root.ChessAtlasGameModules;
  const def=factory(GraphGames);
  if(typeof module!=="undefined"&&module.exports)module.exports=def;
  if(root)root.ChessAtlasMorrisModule=def;
  if(registry&&!registry.get(def.id))registry.register(def);
})(typeof globalThis!=="undefined"?globalThis:this,function(GraphGames){
  function legalActions(game){
    if(!game)return[];
    const nodes=game.board.graph.nodes, out=[];
    if(game.pendingCapture){
      for(const node of nodes){const copy=game.board.get(node);if(!copy||copy.side===game.turn)continue;try{ // capture legality is engine-owned
        const opponent=game.sides[(game.turnIndex+1)%game.sides.length];
        if(copy.side!==opponent)continue;
        const mills=game.board.winningLinesFor(opponent),protectedNodes=new Set(mills.flat());
        const outside=[...game.board.occupancy.entries()].some(([n,p])=>p.side===opponent&&!protectedNodes.has(n));
        if(!outside||!protectedNodes.has(node))out.push(Object.freeze({type:"capture",node}));
      }catch(_){}} return out;
    }
    const phase=game.phase();
    if(phase==="placement"){for(const node of nodes)if(!game.board.get(node))out.push(Object.freeze({type:"place",node}));return out;}
    for(const from of nodes){
      const p=game.board.get(from);if(!p||p.side!==game.turn)continue;
      const targets=phase==="flying"?nodes:game.board.neighbors(from);
      for(const to of targets)if(!game.board.get(to))out.push(Object.freeze({type:"move",from,to}));
    }
    return out;
  }
  function applyAction(game,a){
    const legal=legalActions(game).find(x=>x.type===a?.type&&x.node===a?.node&&x.from===a?.from&&x.to===a?.to);
    if(!legal)throw new Error("Illegal Nine Men's Morris action");
    if(legal.type==="place")game.place(legal.node);
    else if(legal.type==="capture")game.capture(legal.node);
    else game.move(legal.from,legal.to);
    return game;
  }
  function snapshot(game){return Object.freeze({turn:game.turn,phase:game.phase(),pendingCapture:game.pendingCapture,toPlace:Object.fromEntries(game.toPlace),occupancy:Object.fromEntries([...game.board.occupancy.entries()].map(([n,p])=>[n,p.side]))});}
  return Object.freeze({id:"nine-mens-morris",name:"Nine Men's Morris / Merels",create:()=>new GraphGames.MorrisGame(),legalActions,applyAction,snapshot});
});