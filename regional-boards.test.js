const fs=require('fs');
const Shogi=require('./shogi-position.js');
const Janggi=require('./janggi-position.js');

describe('regional chess board substrates',()=>{
  test('Shogi starts as a 9x9 board with 20 pieces per side',()=>{
    const b=Shogi.initialPosition();expect(b).toHaveLength(9);expect(b.every(r=>r.length===9)).toBe(true);
    const pieces=b.flat().filter(Boolean);expect(pieces.filter(p=>Shogi.sideOf(p)==='black')).toHaveLength(20);expect(pieces.filter(p=>Shogi.sideOf(p)==='white')).toHaveLength(20);
  });
  test('Janggi starts as a 9x10 intersection board with centre-palace generals',()=>{
    const b=Janggi.initialPosition();expect(b).toHaveLength(10);expect(b.every(r=>r.length===9)).toBe(true);
    expect(b[1][4]).toMatchObject({side:'cho',type:'k',label:'楚'});expect(b[8][4]).toMatchObject({side:'han',type:'k',label:'漢'});
    expect(b.flat().filter(Boolean)).toHaveLength(32);
  });
  test('Janggi supports four independent horse-elephant opening formations',()=>{
    for(const name of Janggi.formations){const b=Janggi.initialPosition(name,name);expect(b[0][0].type).toBe('r');expect(b[0][8].type).toBe('r');expect(b[9][0].type).toBe('r');expect(b[9][8].type).toBe('r');}
  });
  test('both regional board pages keep time-state and shared zoom shell',()=>{
    for(const file of ['shogi-play.html','janggi-play.html']){const html=fs.readFileSync(file,'utf8');expect(html).toContain('atlas-time-state.js');expect(html).toContain('atlas-game-shell.js');expect(html).toContain('data-atlas-zoom-board');expect(html).toContain('board-viewport.js');}
  });
});
