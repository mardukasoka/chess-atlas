const M=require('./regional-engine-moves.js');

describe('regional engine move notation',()=>{
  test('Xiangqi board coordinates use generalized UCI ranks',()=>{
    expect(M.xiangqi([7,7],[7,4])).toBe('h3e3');
    expect(M.xiangqi([0,7],[2,6])).toBe('h10g8');
  });
  test('Shogi promotion uses trailing plus and drops use @',()=>{
    expect(M.shogi([6,2],[5,2],false)).toBe('c3c4');
    expect(M.shogi([7,1],[1,7],true)).toBe('b2h8+');
    expect(M.shogiDrop('P',[2,5])).toBe('P@f7');
  });
  test('Janggi pass repeats the general square',()=>{
    expect(M.janggiPass([1,4])).toBe('e9e9');
  });
});
