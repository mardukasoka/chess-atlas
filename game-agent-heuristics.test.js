const Agents=require('./game-agents.js');
const H=require('./game-agent-heuristics.js');
require('./xiangqi-rules.js');

describe('game-specific heuristic agents',()=>{
  test('registry exposes Go, Backgammon and regional chess scorers',()=>{expect(H.list()).toEqual(expect.arrayContaining(['go','backgammon','xiangqi','shogi','janggi']));});
  test('Go heuristic prefers placement over pass',async()=>{const a=H.createAgent(Agents,'go',{random:()=>0});const place={type:'place',at:[4,4]},pass={type:'pass'};const chosen=await a.chooseAction({legalActions:[pass,place],game:{size:9,turn:1,board:Array.from({length:9},()=>Array(9).fill(0))}});expect(chosen).toBe(place);});
  test('Backgammon heuristic strongly prefers bearing off',async()=>{const a=H.createAgent(Agents,'backgammon',{random:()=>0});const ordinary={from:6,to:4,die:2},off={from:2,to:'off',die:2};const chosen=await a.chooseAction({legalActions:[ordinary,off],game:{turn:'white',points:Array(25).fill(0)}});expect(chosen).toBe(off);});
  test('Xiangqi heuristic prefers a capture',async()=>{const a=H.createAgent(Agents,'xiangqi',{random:()=>0}),board=Array.from({length:10},()=>Array(9).fill(null));board[4][4]='卒';const quiet={type:'move',to:[5,4]},capture={type:'move',to:[4,4]};expect(await a.chooseAction({legalActions:[quiet,capture],game:{board}})).toBe(capture);});
  test('Shogi heuristic prefers promotion when otherwise equal',async()=>{const a=H.createAgent(Agents,'shogi',{random:()=>0}),plain={type:'move',to:[2,4],promote:false},promote={type:'move',to:[2,4],promote:true};expect(await a.chooseAction({legalActions:[plain,promote],game:{board:Array.from({length:9},()=>Array(9).fill(null))}})).toBe(promote);});
  test('Janggi heuristic prefers a capture to pass',async()=>{const a=H.createAgent(Agents,'janggi',{random:()=>0}),board=Array.from({length:10},()=>Array(9).fill(null));board[4][4]={side:'han',type:'p'};const pass={type:'pass'},capture={type:'move',to:[4,4]};expect(await a.chooseAction({legalActions:[pass,capture],game:{board}})).toBe(capture);});
});
