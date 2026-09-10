const S=require('./regional-engine-serialization.js');
const X=require('./xiangqi-rules.js');
const Shogi=require('./shogi-rules.js');
const J=require('./janggi-position.js');

describe('regional engine serialization',()=>{
  test('Xiangqi initial position matches generalized Fairy-Stockfish FEN placement',()=>{
    expect(S.xiangqiFen(X.initialPosition(),'red')).toBe('rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w - - 0 1');
  });
  test('Shogi initial state matches standard SFEN',()=>{
    expect(S.shogiSfen(Shogi.initialState())).toBe('lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b - 1');
  });
  test('Shogi SFEN preserves promoted pieces and pieces in hand',()=>{
    const s=Shogi.initialState();s.board[6][0]=null;s.board[5][0]='+P';s.hands.black.P=2;s.hands.white.B=1;s.turn='white';
    expect(S.shogiSfen(s,7)).toContain('+P8');
    expect(S.shogiSfen(s,7)).toMatch(/ w 2Pb 7$/);
  });
  test('Janggi initial position serializes 9x10 board and palace-centre generals',()=>{
    const fen=S.janggiFen(J.initialPosition(),'cho');
    expect(fen.split(' ')[0]).toBe('rnba1abnr/4k4/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/4K4/RNBA1ABNR');
    expect(fen.split(' ')[0].split('/')).toHaveLength(10);
  });
});
