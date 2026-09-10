const Modules=require('./game-modules.js');
const Agents=require('./game-agents.js');
const Council=require('./council-game-agent.js');
const X=require('./xiangqi-module.js');

describe('Council game agent',()=>{
  beforeEach(()=>Modules.clear());

  test('maps a returned action id to the exact supplied legal object',async()=>{
    const legal=[Object.freeze({type:'move',from:[0,0],to:[0,1]}),Object.freeze({type:'move',from:[1,0],to:[1,1]})];
    const agent=Council.create({transport:{choose:async request=>{
      expect(request.protocol).toBe('chess-atlas/legal-choice-v1');
      expect(request.actions.map(x=>x.id)).toEqual(['a0','a1']);
      return {actionId:'a1',explanation:'Prefer the second legal move.'};
    }}});
    const chosen=await agent.chooseAction({gameId:'test',snapshot:{turn:'white'},legalActions:legal});
    expect(chosen).toBe(legal[1]);
    expect(agent.getLastDecision()).toEqual({actionId:'a1',explanation:'Prefer the second legal move.'});
  });

  test('rejects invented action ids',async()=>{
    const agent=Council.create({transport:{choose:async()=>({actionId:'a99'})}});
    await expect(agent.chooseAction({gameId:'test',legalActions:[{type:'move'}]})).rejects.toThrow('outside legalActions');
  });

  test('accepts compact JSON string decisions but not free-form moves',async()=>{
    const legal=[{type:'move',from:[0,0],to:[0,1]}];
    const good=Council.create({transport:{choose:async()=>'{"actionId":"a0","explanation":"legal"}'}});
    await expect(good.chooseAction({legalActions:legal})).resolves.toBe(legal[0]);
    const bad=Council.create({transport:{choose:async()=> 'e2e4'}});
    await expect(bad.chooseAction({legalActions:legal})).rejects.toThrow('no valid action id');
  });

  test('runs through authoritative game module without bypassing Xiangqi legality',async()=>{
    Modules.register(X);
    const game=Modules.create('xiangqi');
    const before=Modules.legalActions('xiangqi',game);
    expect(before.length).toBeGreaterThan(1);
    const target=before[1];
    const agent=Council.create({transport:{choose:async req=>{
      expect(req.gameId).toBe('xiangqi');
      expect(req.actions[1].action.engineMove).toBeUndefined();
      return {actionId:'a1',reason:'selected from Atlas legal actions'};
    }}});
    const result=await Agents.takeTurn({modules:Modules,gameId:'xiangqi',game,agent});
    expect(result.status).toBe('applied');
    expect(result.action).toStrictEqual(target);
    expect(result.result.turn).toBe('black');
  });

  test('sanitizes functions and truncates oversized engine position text',()=>{
    const clean=Council.safeClone({enginePosition:'x'.repeat(900),fn(){},nested:{ok:true}});
    expect(clean.enginePosition.length).toBe(600);
    expect(clean.fn).toBeUndefined();
    expect(clean.nested.ok).toBe(true);
  });
});
