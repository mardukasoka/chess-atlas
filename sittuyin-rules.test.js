"use strict";
const R=require("./sittuyin-rules.js");
const empty=()=>Array.from({length:8},()=>Array(8).fill(""));
test("Sittuyin elephant steps diagonally and one step forward",()=>{const b=empty();b[4][4]="wE";expect(R.moves(b,4,4)).toEqual(expect.arrayContaining([{row:3,col:3},{row:3,col:4},{row:3,col:5},{row:5,col:3},{row:5,col:5}]))});
test("Sittuyin pawn moves forward and captures diagonally",()=>{const b=empty();b[4][4]="wP";b[3][3]="bN";expect(R.moves(b,4,4)).toEqual(expect.arrayContaining([{row:3,col:4},{row:3,col:3}]));expect(R.moves(b,4,4)).not.toContainEqual({row:3,col:5})});
test("promotion squares are diagonal squares in the opposing half",()=>{const w=R.promotionSquares("w"),b=R.promotionSquares("b");expect(w.every(([r,c])=>(r===c||r+c===7)&&r<4)).toBe(true);expect(b.every(([r,c])=>(r===c||r+c===7)&&r>=4)).toBe(true)});

test("verified deployment profile starts pawns on staggered third/fourth ranks",()=>{const b=R.initialPawns();expect(b.flat().filter(x=>x==="wP")).toHaveLength(8);expect(b.flat().filter(x=>x==="bP")).toHaveLength(8);expect(b[5].slice(0,4)).toEqual(["wP","wP","wP","wP"]);expect(b[4].slice(4)).toEqual(["wP","wP","wP","wP"]);expect(b[2].slice(0,4)).toEqual(["bP","bP","bP","bP"]);expect(b[3].slice(4)).toEqual(["bP","bP","bP","bP"])});
test("deployment region excludes the fixed pawn squares",()=>{const b=R.initialPawns();for(const side of ["w","b"])for(const [r,c] of R.deploymentRegion(side))expect(b[r][c]).toBe("")});
