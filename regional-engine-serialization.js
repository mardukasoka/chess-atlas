"use strict";
(function(root,factory){const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;if(root)root.ChessAtlasRegionalSerialization=api;})(typeof globalThis!=="undefined"?globalThis:this,function(){
  function compressRow(cells){let out="",empty=0;for(const cell of cells){if(!cell){empty++;continue;}if(empty){out+=String(empty);empty=0;}out+=cell;}if(empty)out+=String(empty);return out;}

  const XIANGQI_MAP=new Map([
    ['車','r'],['馬','n'],['象','b'],['士','a'],['將','k'],['砲','c'],['卒','p'],
    ['俥','R'],['傌','N'],['相','B'],['仕','A'],['帥','K'],['炮','C'],['兵','P']
  ]);
  function xiangqiFen(board,turn='red'){
    if(!Array.isArray(board)||board.length!==10)throw new TypeError('Xiangqi board must be 10 ranks');
    const placement=board.map(row=>{
      if(!Array.isArray(row)||row.length!==9)throw new TypeError('Xiangqi board must be 9 files');
      return compressRow(row.map(p=>{if(!p)return null;const ch=XIANGQI_MAP.get(p);if(!ch)throw new Error(`Unknown Xiangqi piece: ${p}`);return ch;}));
    }).join('/');
    return `${placement} ${turn==='black'?'b':'w'} - - 0 1`;
  }

  const JANGGI_CHAR={r:'r',h:'n',e:'b',a:'a',k:'k',c:'c',p:'p'};
  function janggiFen(board,turn='cho'){
    if(!Array.isArray(board)||board.length!==10)throw new TypeError('Janggi board must be 10 ranks');
    const placement=board.map(row=>{
      if(!Array.isArray(row)||row.length!==9)throw new TypeError('Janggi board must be 9 files');
      return compressRow(row.map(p=>{
        if(!p)return null;const ch=JANGGI_CHAR[p.type];if(!ch)throw new Error(`Unknown Janggi piece type: ${p.type}`);
        return p.side==='cho'?ch.toUpperCase():ch;
      }));
    }).join('/');
    return `${placement} ${turn==='cho'?'w':'b'} - - 0 1`;
  }

  function shogiPiece(piece){if(!piece)return null;const promoted=piece[0]==='+';const base=promoted?piece.slice(1):piece;return promoted?`+${base}`:base;}
  const SHOGI_HAND_ORDER=['R','B','G','S','N','L','P'];
  function shogiHands(hands){let out='';for(const side of ['black','white'])for(const t of SHOGI_HAND_ORDER){const n=hands?.[side]?.[t]||0;if(!n)continue;const ch=side==='black'?t:t.toLowerCase();out+=(n>1?String(n):'')+ch;}return out||'-';}
  function shogiPocket(hands){let out='';for(const side of ['black','white'])for(const t of SHOGI_HAND_ORDER){const n=hands?.[side]?.[t]||0;if(!n)continue;const ch=side==='black'?t:t.toLowerCase();out+=ch.repeat(n);}return out||'-';}
  function shogiPlacement(state){
    const board=state?.board;if(!Array.isArray(board)||board.length!==9)throw new TypeError('Shogi board must be 9 ranks');
    return board.map(row=>{if(!Array.isArray(row)||row.length!==9)throw new TypeError('Shogi board must be 9 files');return compressRow(row.map(shogiPiece));}).join('/');
  }
  function shogiSfen(state,moveNumber=1){
    const placement=shogiPlacement(state);
    return `${placement} ${state.turn==='white'?'w':'b'} ${shogiHands(state.hands)} ${Math.max(1,Number(moveNumber)||1)}`;
  }
  function shogiFen(state,moveNumber=1){
    const placement=shogiPlacement(state),pocket=shogiPocket(state.hands);
    // Atlas 'black' is sente and moves first; Fairy-Stockfish generalized FEN
    // represents that same uppercase side as engine white.
    return `${placement}[${pocket}] ${state.turn==='black'?'w':'b'} - - 0 ${Math.max(1,Number(moveNumber)||1)}`;
  }

  return Object.freeze({compressRow,xiangqiFen,janggiFen,shogiHands,shogiPocket,shogiSfen,shogiFen});
});
