"use strict";
const defs=require("./historical-chess-modules.js");
require("./makruk-extension.js").install(require("./engine.js"),require("./makruk-rules.js"));
for(const [id,def] of Object.entries(defs)){
  test(`${id} exposes Atlas-legal engine moves`,()=>{
    const game=def.create(),actions=def.legalActions(game);
    expect(actions.length).toBeGreaterThan(0);
    expect(actions.every(a=>a.type==="move"&&/^[a-h][1-8][a-h][1-8]$/.test(a.engineMove))).toBe(true);
  });
  test(`${id} rejects moves outside Atlas legalActions`,()=>{
    const game=def.create();
    expect(()=>def.applyAction(game,{type:"move",engineMove:"a1a8"})).toThrow();
  });
}
