"use strict";
const Agents=require("./game-agents.js");

describe("universal game-agent controller",()=>{
  function registry(){
    return {
      snapshot(_id,game){return {turn:game.turn,winner:game.winner||null};},
      legalActions(_id,game){return game.actions;},
      applyAction(_id,game,action){game.applied=action;return {ok:true,action};}
    };
  }

  test("exposes the Council-facing state/move/result contract",async()=>{
    const move={type:"move",from:"a",to:"b"};
    const game={turn:"white",actions:[move]};
    const controller=Agents.createController({modules:registry(),gameId:"test"});
    expect(controller.getState(game)).toEqual({turn:"white",winner:null});
    expect(controller.legalMoves(game)).toEqual([move]);
    const agent=Agents.randomAgent({random:()=>0});
    expect(await controller.chooseMove(agent,game)).toBe(move);
    expect(controller.makeMove(game,move)).toEqual({ok:true,action:move});
    expect(game.applied).toBe(move);
    expect(controller.result(game)).toBeNull();
  });

  test("does not let an agent or caller bypass legal actions",async()=>{
    const legal={type:"move",to:"a"};
    const illegal={type:"move",to:"z"};
    const game={actions:[legal]};
    const controller=Agents.createController({modules:registry(),gameId:"test"});
    await expect(controller.chooseMove({id:"bad",chooseAction:()=>illegal},game))
      .rejects.toThrow("outside legalActions");
    expect(()=>controller.makeMove(game,illegal)).toThrow("outside legalActions");
  });

  test("leaves chance resolution to the rules engine",async()=>{
    const chance={actor:"chance",type:"roll"};
    const game={actions:[chance]};
    const controller=Agents.createController({modules:registry(),gameId:"test"});
    expect(await controller.chooseMove(Agents.randomAgent(),game)).toBeNull();
  });
});
