"use strict";
const Agents=require("./game-agents.js");
describe("universal game-agent controller",()=>{
  function registry(){return {
    snapshot(_id,g){return {turn:g.turn,winner:g.winner||null,enginePosition:g.enginePosition};},
    legalActions(_id,g){return g.actions;},
    applyAction(_id,g,a){g.applied=a;return {ok:true,action:a};}
  };}
  test("exposes Council-facing state/move/result contract",async()=>{
    const move={type:"move",engineMove:"a1a2"},game={turn:"white",actions:[move]};
    const c=Agents.createController({modules:registry(),gameId:"test"});
    expect(c.getState(game).turn).toBe("white"); expect(c.legalMoves(game)).toEqual([move]);
    expect(await c.chooseMove(Agents.randomAgent({random:()=>0}),game)).toBe(move);
    expect(c.makeMove(game,move)).toEqual({ok:true,action:move}); expect(c.result(game)).toBeNull();
  });
  test("awaits async specialists and passes enginePosition",async()=>{
    const move={type:"move",engineMove:"a1a2"},game={actions:[move],enginePosition:"fen-like"};
    const c=Agents.createController({modules:registry(),gameId:"test"});
    const agent={id:"async-specialist",async chooseAction(ctx){await Promise.resolve();expect(ctx.enginePosition).toBe("fen-like");return ctx.legalActions[0];}};
    expect(await c.chooseMove(agent,game)).toBe(move);
  });
  test("rejects actions outside exact Atlas legalActions",async()=>{
    const legal={type:"move",to:"a"},illegal={type:"move",to:"z"},game={actions:[legal]};
    const c=Agents.createController({modules:registry(),gameId:"test"});
    await expect(c.chooseMove({id:"bad",chooseAction:async()=>illegal},game)).rejects.toThrow("outside legalActions");
    expect(()=>c.makeMove(game,illegal)).toThrow("outside legalActions");
  });
  test("leaves chance resolution to rules engine",async()=>{
    const game={actions:[{actor:"chance",type:"roll"}]},c=Agents.createController({modules:registry(),gameId:"test"});
    expect(await c.chooseMove(Agents.randomAgent(),game)).toBeNull();
  });
});
