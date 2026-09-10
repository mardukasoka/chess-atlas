"use strict";
(function(root,factory){const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;if(root)root.ChessAtlasRegionalEngineMoves=api;})(typeof globalThis!=="undefined"?globalThis:this,function(){
  const files='abcdefghijklmnopqrstuvwxyz';
  function square(coord,ranks){const [r,c]=coord||[];if(!Number.isInteger(r)||!Number.isInteger(c)||c<0||c>=files.length||r<0||r>=ranks)throw new RangeError('Invalid engine coordinate');return `${files[c]}${ranks-r}`;}
  function boardMove(from,to,ranks,promote=false){return `${square(from,ranks)}${square(to,ranks)}${promote?'+':''}`;}
  function xiangqi(from,to){return boardMove(from,to,10,false);}
  function janggi(from,to){return boardMove(from,to,10,false);}
  function janggiPass(generalSquare){const sq=square(generalSquare,10);return `${sq}${sq}`;}
  function shogi(from,to,promote=false){return boardMove(from,to,9,promote);}
  function shogiDrop(type,to){const t=String(type||'').replace('+','').toUpperCase();if(!/^[PLNSGBR]$/.test(t))throw new Error('Invalid Shogi drop piece');return `${t}@${square(to,9)}`;}
  return Object.freeze({square,boardMove,xiangqi,janggi,janggiPass,shogi,shogiDrop});
});
