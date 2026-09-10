const B=require('./backgammon.js');

describe('Backgammon topology and dice sequencing',()=>{
  test('standard setup has 15 checkers per side on 24 points',()=>{const s=B.create();expect(s.points).toHaveLength(25);let w=0,b=0;for(let p=1;p<=24;p++){if(s.points[p]>0)w+=s.points[p];else b-=s.points[p];}expect(w).toBe(15);expect(b).toBe(15);});
  test('opening roll gives higher roller the two opening dice',()=>{const s=B.start(B.create(),6,3);expect(s.turn).toBe('white');expect(s.diceRemaining).toEqual([6,3]);});
  test('doubles create four moves',()=>{let s=B.start(B.create(),6,3);s.diceRemaining=[];s=B.roll(s,4,4);expect(s.diceRemaining).toEqual([4,4,4,4]);});
  test('a blot is hit and moved to the bar',()=>{let s=B.create();s.status='playing';s.turn='white';s.diceRemaining=[1];s.points=Array(25).fill(0);s.points[8]=1;s.points[7]=-1;s.off.white=14;s.off.black=14;const move=B.legalNextMoves(s).find(m=>m.from===8&&m.to===7);expect(move).toBeTruthy();s=B.playMove(s,move);expect(s.bar.black).toBe(1);expect(s.points[7]).toBe(1);});
  test('bar entry has priority over ordinary moves',()=>{let s=B.create();s.status='playing';s.turn='white';s.diceRemaining=[3];s.bar.white=1;const moves=B.legalNextMoves(s);expect(moves.length).toBeGreaterThan(0);expect(moves.every(m=>m.from==='bar')).toBe(true);});
  test('blocked point cannot be entered',()=>{let s=B.create();s.status='playing';s.turn='white';s.diceRemaining=[3];s.bar.white=1;s.points[22]=-2;expect(B.legalNextMoves(s)).toHaveLength(0);});
  test('bearing off requires every active checker in home board',()=>{let s=B.create();s.status='playing';s.turn='white';s.diceRemaining=[6];expect(B.singleMoves(s,6).some(m=>m.to==='off')).toBe(false);s.points=Array(25).fill(0);s.points[6]=15;expect(B.singleMoves(s,6).some(m=>m.from===6&&m.to==='off')).toBe(true);});
  test('if only one of two dice can be used the higher die is required',()=>{let s=B.create();s.status='playing';s.turn='white';s.points=Array(25).fill(0);s.points[2]=1;s.off.white=14;s.off.black=15;s.diceRemaining=[1,2];const moves=B.legalNextMoves(s);expect(moves.length).toBe(1);expect(moves[0].die).toBe(2);expect(moves[0].to).toBe('off');});
});
