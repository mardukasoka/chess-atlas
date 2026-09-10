const Agents=require('./game-agents.js');
const H=require('./game-agent-heuristics.js');

describe('game-specific heuristic agents',()=>{
  test('registry exposes Go and Backgammon scorers',()=>{expect(H.list()).toEqual(expect.arrayContaining(['go','backgammon']));});
  test('Go heuristic prefers placement over pass',async()=>{const a=H.createAgent(Agents,'go',{random:()=>0});const place={type:'place',at:[4,4]},pass={type:'pass'};const chosen=await a.chooseAction({legalActions:[pass,place],game:{size:9,turn:1,board:Array.from({length:9},()=>Array(9).fill(0))}});expect(chosen).toBe(place);});
  test('Backgammon heuristic strongly prefers bearing off',async()=>{const a=H.createAgent(Agents,'backgammon',{random:()=>0});const ordinary={from:6,to:4,die:2},off={from:2,to:'off',die:2};const chosen=await a.chooseAction({legalActions:[ordinary,off],game:{turn:'white',points:Array(25).fill(0)}});expect(chosen).toBe(off);});
});
