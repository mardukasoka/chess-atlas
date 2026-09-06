"use strict";
(function(root,factory){
  const engine=typeof require!=="undefined"?require("./tablut.js"):root.ChessAtlasTablut;
  const registry=typeof require!=="undefined"?require("./game-modules.js"):root.ChessAtlasGameModules;
  const def=factory(engine);
  if(typeof module!=="undefined"&&module.exports) module.exports=def;
  if(registry && !registry.get(def.id)) registry.register(def);
})(typeof globalThis!=="undefined"?globalThis:this,function(engine){
  return Object.freeze({
    id:"tablut-linnaeus-1732-salmi", name:"Tablut (Linnaeus 1732 / Salmi)",
    create: options => new engine.TablutGame(options),
    legalActions: game => game.legalActions(), applyAction:(game,action)=>game.apply(action), snapshot:game=>game.snapshot()
  });
});
