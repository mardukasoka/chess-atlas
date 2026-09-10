"use strict";
(function(root,factory){const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;if(root)root.JanggiPosition=api;})(typeof globalThis!=="undefined"?globalThis:this,function(){
  const piece=(side,type,label)=>Object.freeze({side,type,label});
  const formation={classic:['r','e','h','a',null,'a','h','e','r'],left:['r','h','e','a',null,'a','h','e','r'],right:['r','e','h','a',null,'a','e','h','r'],both:['r','h','e','a',null,'a','e','h','r']};
  const labels={r:'車',h:'馬',e:'象',a:'士',c:'包',p:'卒',k:{cho:'楚',han:'漢'}};
  function makeBack(side,layout){return formation[layout||'classic'].map(type=>type?piece(side,type,labels[type]):null);}
  function initialPosition(choLayout='classic',hanLayout='classic'){
    const b=Array.from({length:10},()=>Array(9).fill(null));
    b[0]=makeBack('cho',choLayout);b[1][4]=piece('cho','k',labels.k.cho);b[2][1]=piece('cho','c',labels.c);b[2][7]=piece('cho','c',labels.c);for(const c of [0,2,4,6,8])b[3][c]=piece('cho','p',labels.p);
    b[9]=makeBack('han',hanLayout);b[8][4]=piece('han','k',labels.k.han);b[7][1]=piece('han','c',labels.c);b[7][7]=piece('han','c',labels.c);for(const c of [0,2,4,6,8])b[6][c]=piece('han','p',labels.p);
    return b;
  }
  return Object.freeze({initialPosition,formations:Object.freeze(Object.keys(formation))});
});
