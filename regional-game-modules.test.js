const Modules=require('./game-modules.js');
const Agents=require('./game-agents.js');
const Fairy=require('./fairy-stockfish-agent.js');
const X=require('./xiangqi-module.js');
const S=require('./shogi-module.js');
const J=require('./janggi-module.js');

describe('regional game-module agent seam',()=>{
  beforeEach(()=>Modules.clear());
  for(const mod of [X,S,J])test(`${mod.id} exposes legal actions with engine positions`,()=>{
    Modules.register(mod);const game=Modules.create(mod.id);const snap=Modules.snapshot(mod.id,game),actions=Modules.legalActions(mod.id,game);
    expect(actions.length).toBeGreaterThan(0);expect(typeof snap.enginePosition).toBe('string');expect(snap.enginePosition.length).toBeGreaterThan(10);expect(actions.every(a=>typeof a.engineMove==='string'&&a.engineMove.length>=4)).toBe(true);
  });

  test('Fairy-Stockfish Xiangqi proposal maps back through Atlas legality',async()=>{
    Modules.register(X);const game=Modules.create('xiangqi'),legal=Modules.legalActions('xiangqi',game),chosen=legal[0];
    const agent=Fairy.create({gameId:'xiangqi',transport:{bestMove:async req=>{expect(req.variant).toBe('xiangqi');expect(req.position).toContain(' w ');return chosen.engineMove;}}});
    const result=await Agents.takeTurn({modules:Modules,gameId:'xiangqi',game,agent});expect(result.status).toBe('applied');expect(result.action).toBe(chosen);
  });

  test('Fairy-Stockfish rejects a regional move outside Atlas legalActions',async()=>{
    Modules.register(S);const game=Modules.create('shogi');const agent=Fairy.create({gameId:'shogi',transport:{bestMove:async()=> 'a1a9'}});
    await expect(Agents.takeTurn({modules:Modules,gameId:'shogi',game,agent})).rejects.toThrow('outside legalActions');
  });
});
