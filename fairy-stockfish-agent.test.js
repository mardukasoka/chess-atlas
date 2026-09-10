const F=require('./fairy-stockfish-agent.js');

describe('gated Fairy-Stockfish specialist seam',()=>{
  test('known regional variants have explicit mappings',()=>{expect(F.variantFor('xiangqi')).toBe('xiangqi');expect(F.variantFor('shogi')).toBe('shogi');expect(F.variantFor('janggi')).toBe('janggi');});
  test('unknown variants stay unbound',()=>{expect(F.variantFor('ouk-chatrang')).toBeNull();});
  test('engine proposal must map back to an Atlas legal action',async()=>{const legal=[{uci:'a1a2'},{uci:'b1b2'}];const agent=F.create({gameId:'xiangqi',transport:{bestMove:async()=> 'b1b2'}});await expect(agent.chooseAction({legalActions:legal,enginePosition:'dummy'})).resolves.toBe(legal[1]);});
  test('engine proposal outside Atlas legal actions is rejected',async()=>{const agent=F.create({gameId:'shogi',transport:{bestMove:async()=> 'x'}});await expect(agent.chooseAction({legalActions:[{uci:'a'}],enginePosition:'dummy'})).rejects.toThrow(/outside legalActions/);});
});
