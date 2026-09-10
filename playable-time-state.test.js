const fs=require('fs');

const standalonePages=[
  'historical-play.html',
  'latrunculi-play.html',
  'alquerque-play.html',
  'hnefatafl-play.html',
  'tablut-play.html',
  'pachisi-play.html',
  'chaupar-play.html',
  'xiangqi-play.html',
  'shogi-play.html',
  'janggi-play.html',
  'go-play.html',
  'backgammon-play.html'
];

describe('standalone playable time-state coverage',()=>{
  for(const page of standalonePages)test(`${page} preserves Atlas timeline state`,()=>{
    const html=fs.readFileSync(page,'utf8');
    expect(html).toContain('atlas-time-state.js');
    expect(html).toContain('atlas-game-shell.js');
  });
});
