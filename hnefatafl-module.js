"use strict";
(function(root,factory){
 const engine=typeof require!=="undefined"?require("./hnefatafl.js"):root.ChessAtlasHnefatafl;
 const registry=typeof require!=="undefined"?require("./game-modules.js"):root.ChessAtlasGameModules;
 const def=factory(engine);
 if(typeof module!=="undefined"&&module.exports)module.exports=def;
 if(registry&&!registry.get(def.id))registry.register(def);
})(typeof globalThis!=="undefined"?globalThis:this,function(engine){return Object.freeze({id:"hnefatafl-fetlar-2007",name:"Hnefatafl (Fetlar 2007 reconstruction)",create:options=>new engine.HnefataflGame(options),legalActions:game=>game.legalActions(),applyAction:(game,action)=>game.apply(action),snapshot:game=>game.snapshot()});});
