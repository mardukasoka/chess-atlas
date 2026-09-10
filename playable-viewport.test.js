const fs=require('fs');

const pages=[
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

describe('shared viewport coverage',()=>{
  for(const page of pages)test(`${page} keeps mobile zoom/pan`,()=>{
    const html=fs.readFileSync(page,'utf8');
    expect(html).toContain('board-viewport.css');
    expect(html).toContain('board-viewport.js');
    expect(html).toMatch(/data-atlas-zoom-board|id=["']board["']/);
  });
});
