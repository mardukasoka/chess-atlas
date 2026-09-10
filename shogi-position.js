"use strict";
(function(root,factory){const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;if(root)root.ShogiPosition=api;})(typeof globalThis!=="undefined"?globalThis:this,function(){
  const START=[
    ['l','n','s','g','k','g','s','n','l'],
    [null,'r',null,null,null,null,null,'b',null],
    ['p','p','p','p','p','p','p','p','p'],
    [null,null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null,null],
    ['P','P','P','P','P','P','P','P','P'],
    [null,'B',null,null,null,null,null,'R',null],
    ['L','N','S','G','K','G','S','N','L']
  ];
  const clone=board=>board.map(row=>row.slice());
  const sideOf=piece=>!piece?null:piece===piece.toUpperCase()?'black':'white';
  const typeOf=piece=>piece?piece.toUpperCase():null;
  function initialPosition(){return clone(START);}
  return Object.freeze({initialPosition,clone,sideOf,typeOf});
});
