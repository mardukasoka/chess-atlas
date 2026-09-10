const S=require('./shogi-rules.js');

describe('Shogi lightweight legality core',()=>{
  test('initial state is 9x9 with Sente to move',()=>{const s=S.initialState();expect(s.board).toHaveLength(9);expect(s.turn).toBe('black');});
  test('pawn moves one step forward and cannot move backward',()=>{const s=S.initialState();expect(S.legalBoardMove(s,[6,4],[5,4])).toBe(true);expect(S.legalBoardMove(s,[6,4],[7,4])).toBe(false);});
  test('knight has mandatory promotion on final two ranks',()=>{const s=S.initialState();s.board=Array.from({length:9},()=>Array(9).fill(null));s.board[8][4]='K';s.board[0][4]='k';s.board[2][3]='N';expect(S.legalBoardMove(s,[2,3],[0,2],false)).toBe(false);expect(S.legalBoardMove(s,[2,3],[0,2],true)).toBe(true);});
  test('capture adds an unpromoted piece to hand',()=>{const s=S.initialState();s.board=Array.from({length:9},()=>Array(9).fill(null));s.board[8][4]='K';s.board[0][4]='k';s.board[4][4]='R';s.board[2][4]='+p';const n=S.applyBoardMove(s,[4,4],[2,4],false);expect(n.hands.black.P).toBe(1);expect(n.board[2][4]).toBe('R');expect(n.turn).toBe('white');});
  test('nifu forbids dropping a second unpromoted pawn in a file',()=>{const s=S.initialState();s.hands.black.P=1;expect(S.legalDrop(s,'P',[4,4])).toBe(false);s.board[6][4]=null;expect(S.legalDrop(s,'P',[4,4])).toBe(true);});
  test('dead-rank pawn and lance drops and last-two-rank knight drops are illegal',()=>{const s=S.initialState();s.hands.black.P=1;s.hands.black.L=1;s.hands.black.N=1;s.board[6][4]=null;expect(S.legalDrop(s,'P',[0,4])).toBe(false);expect(S.legalDrop(s,'L',[0,4])).toBe(false);expect(S.legalDrop(s,'N',[1,4])).toBe(false);});
  test('a move exposing own king to rook check is illegal',()=>{const s=S.initialState();s.board=Array.from({length:9},()=>Array(9).fill(null));s.board[8][4]='K';s.board[0][0]='k';s.board[1][4]='r';s.board[5][4]='G';expect(S.legalBoardMove(s,[5,4],[5,3])).toBe(false);});
});
