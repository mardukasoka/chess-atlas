"use strict";

/* Hnefatafl playable reconstruction: Fetlar Hnefatafl Panel rules (2007).
 * This is a modern reconstruction for the historical tafl family, not a claim
 * that a complete Viking-age rules text survives.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.ChessAtlasHnefatafl = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const SIZE = 11;
  const THRONE = [5,5];
  const CORNERS = [[0,0],[0,10],[10,0],[10,10]];
  const DIRS = [[1,0],[-1,0],[0,1],[0,-1]];
  const key=(r,c)=>`${r},${c}`;
  const inside=(r,c)=>r>=0&&r<SIZE&&c>=0&&c<SIZE;
  const same=(a,b)=>a[0]===b[0]&&a[1]===b[1];
  const corner=(r,c)=>CORNERS.some(x=>same(x,[r,c]));
  const restricted=(r,c)=>same([r,c],THRONE)||corner(r,c);
  const sideOf=p=>p==="attacker"?"attackers":(p==="defender"||p==="king"?"defenders":null);
  const enemy=(a,b)=>sideOf(a)&&sideOf(b)&&sideOf(a)!==sideOf(b);

  class HnefataflGame {
    constructor(options={}) {
      this.board=new Map(); this.turn="attackers"; this.winner=null;
      this.result=null; this.captured={attackers:0,defenders:0};
      if(options.setup!==false) this.setup();
    }
    setup(){
      this.board.clear(); this.turn="attackers"; this.winner=null; this.result=null;
      this.captured={attackers:0,defenders:0}; this.set(5,5,"king");
      [[5,3],[5,4],[5,6],[5,7],[3,5],[4,5],[6,5],[7,5],[4,4],[4,6],[6,4],[6,6]].forEach(x=>this.set(...x,"defender"));
      [[0,3],[0,4],[0,5],[0,6],[0,7],[1,5],[10,3],[10,4],[10,5],[10,6],[10,7],[9,5],[3,0],[4,0],[5,0],[6,0],[7,0],[5,1],[3,10],[4,10],[5,10],[6,10],[7,10],[5,9]].forEach(x=>this.set(...x,"attacker"));
    }
    at(r,c){return this.board.get(key(r,c))||null;}
    set(r,c,p){if(p)this.board.set(key(r,c),p);else this.board.delete(key(r,c));}
    canStop(piece,r,c){return inside(r,c)&&!this.at(r,c)&&(piece==="king"||!restricted(r,c));}
    movesFrom(r,c){
      const piece=this.at(r,c); if(!piece||sideOf(piece)!==this.turn||this.winner)return [];
      const out=[];
      for(const [dr,dc] of DIRS){let nr=r+dr,nc=c+dc; while(inside(nr,nc)&&!this.at(nr,nc)){
        if(this.canStop(piece,nr,nc)) out.push({type:"move",from:[r,c],to:[nr,nc]});
        // Empty throne may be crossed. Corners cannot be crossed because they are board endpoints.
        nr+=dr; nc+=dc;
      }} return out;
    }
    legalActions(){if(this.winner)return[];const out=[];for(const k of this.board.keys()){const [r,c]=k.split(",").map(Number);out.push(...this.movesFrom(r,c));}return out;}
    hostileSupport(r,c,victim){
      const p=this.at(r,c); if(p)return sideOf(p)!==sideOf(victim);
      if(corner(r,c))return true;
      if(same([r,c],THRONE)) return victim==="attacker" || (victim==="defender" && !this.at(...THRONE));
      return false;
    }
    kingCapturedAt(r,c){
      if(r===0||r===SIZE-1||c===0||c===SIZE-1) return false;
      if(same([r,c],THRONE)) return DIRS.every(([dr,dc])=>this.at(r+dr,c+dc)==="attacker");
      if(Math.abs(r-5)+Math.abs(c-5)===1) return DIRS.every(([dr,dc])=>same([r+dr,c+dc],THRONE)||this.at(r+dr,c+dc)==="attacker");
      return DIRS.every(([dr,dc])=>this.at(r+dr,c+dc)==="attacker");
    }
    resolveCaptures(r,c,piece){
      for(const [dr,dc] of DIRS){const ar=r+dr,ac=c+dc,br=r+2*dr,bc=c+2*dc;if(!inside(ar,ac))continue;const victim=this.at(ar,ac);if(!victim||!enemy(piece,victim))continue;
        if(victim==="king"){if(this.kingCapturedAt(ar,ac)){this.set(ar,ac,null);this.winner="attackers";this.result="king-captured";}continue;}
        if(inside(br,bc)&&this.hostileSupport(br,bc,victim)){this.set(ar,ac,null);this.captured[sideOf(victim)]++;}
      }
    }
    defendersEncircled(){
      const whites=[...this.board.entries()].filter(([,p])=>p==="defender"||p==="king").map(([k])=>k.split(",").map(Number));
      if(!whites.length)return true;
      const seen=new Set(whites.map(x=>key(...x))), queue=[...whites];
      while(queue.length){const [r,c]=queue.shift();if(r===0||r===SIZE-1||c===0||c===SIZE-1)return false;for(const [dr,dc] of DIRS){const nr=r+dr,nc=c+dc;if(!inside(nr,nc)||this.at(nr,nc)==="attacker")continue;const k=key(nr,nc);if(!seen.has(k)){seen.add(k);queue.push([nr,nc]);}}}
      return true;
    }
    apply(action){
      if(!action||action.type!=="move")throw new Error("Hnefatafl action must be a move");
      const legal=this.movesFrom(...action.from).some(m=>same(m.to,action.to));if(!legal)throw new Error("Illegal Hnefatafl move");
      const piece=this.at(...action.from);this.set(...action.from,null);this.set(...action.to,piece);
      if(piece==="king"&&corner(...action.to)){this.winner="defenders";this.result="king-escaped";}
      if(!this.winner)this.resolveCaptures(...action.to,piece);
      if(!this.winner&&this.defendersEncircled()){this.winner="attackers";this.result="encirclement";}
      if(!this.winner){this.turn=this.turn==="attackers"?"defenders":"attackers";if(this.legalActions().length===0){this.winner=this.turn==="attackers"?"defenders":"attackers";this.result="no-legal-move";}}
      return this.snapshot();
    }
    snapshot(){return{profile:"hnefatafl-fetlar-2007",size:SIZE,throne:[...THRONE],corners:CORNERS.map(x=>[...x]),turn:this.turn,winner:this.winner,result:this.result,captured:{...this.captured},board:[...this.board.entries()].map(([k,piece])=>({at:k.split(",").map(Number),piece}))};}
  }
  return Object.freeze({SIZE,THRONE,CORNERS,HnefataflGame});
});
