const X=require('./xiangqi-rules.js');

describe('Xiangqi lightweight rules core',()=>{
  test('initial position has correct geometry and sides',()=>{
    const b=X.initialPosition();
    expect(b).toHaveLength(10);expect(b[0]).toHaveLength(9);
    expect(X.sideOf(b[0][4])).toBe('black');expect(X.sideOf(b[9][4])).toBe('red');
  });
  test('elephants cannot cross the river and can be blocked at the eye',()=>{
    const b=Array.from({length:10},()=>Array(9).fill(null));b[2][4]='象';b[9][4]='帥';b[0][4]='將';
    expect(X.isLegalMove(b,[2,4],[4,6],'black')).toBe(true);
    b[3][5]='卒';expect(X.isLegalMove(b,[2,4],[4,6],'black')).toBe(false);
    b[3][5]=null;expect(X.isLegalMove(b,[4,6],[6,4],'black')).toBe(false);
  });
  test('horse leg blocks a horse',()=>{
    const b=Array.from({length:10},()=>Array(9).fill(null));b[9][4]='帥';b[0][4]='將';b[7][4]='傌';
    expect(X.isLegalMove(b,[7,4],[5,5],'red')).toBe(true);
    b[6][4]='兵';expect(X.isLegalMove(b,[7,4],[5,5],'red')).toBe(false);
  });
  test('cannon needs exactly one screen to capture',()=>{
    const b=Array.from({length:10},()=>Array(9).fill(null));b[9][4]='帥';b[0][3]='將';b[7][1]='炮';b[5][1]='兵';b[2][1]='車';
    expect(X.isLegalMove(b,[7,1],[2,1],'red')).toBe(true);
    b[4][1]='卒';expect(X.isLegalMove(b,[7,1],[2,1],'red')).toBe(false);
  });
  test('soldiers gain sideways movement after crossing the river',()=>{
    const b=Array.from({length:10},()=>Array(9).fill(null));b[9][4]='帥';b[0][3]='將';b[6][2]='兵';
    expect(X.isLegalMove(b,[6,2],[6,3],'red')).toBe(false);
    b[6][2]=null;b[4][2]='兵';expect(X.isLegalMove(b,[4,2],[4,3],'red')).toBe(true);
    expect(X.isLegalMove(b,[4,2],[5,2],'red')).toBe(false);
  });
  test('a move may not leave the generals facing each other',()=>{
    const b=Array.from({length:10},()=>Array(9).fill(null));b[0][4]='將';b[9][4]='帥';b[5][4]='俥';
    expect(X.generalsFace(b)).toBe(false);
    expect(X.isLegalMove(b,[5,4],[5,5],'red')).toBe(false);
  });
});
