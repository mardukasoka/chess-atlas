"use strict";
const {HnefataflGame}=require("./hnefatafl.js");

describe("Hnefatafl — Fetlar 2007 reconstruction",()=>{
 test("starts 11x11 with 24 attackers, 12 defenders and king",()=>{const g=new HnefataflGame(),s=g.snapshot();expect(s.profile).toBe("hnefatafl-fetlar-2007");expect(s.board.filter(x=>x.piece==="attacker")).toHaveLength(24);expect(s.board.filter(x=>x.piece==="defender")).toHaveLength(12);expect(g.at(5,5)).toBe("king");expect(g.turn).toBe("attackers");});
 test("rook movement cannot jump pieces",()=>{const g=new HnefataflGame({setup:false});g.set(5,1,"attacker");g.set(5,3,"defender");expect(g.movesFrom(5,1)).toContainEqual({type:"move",from:[5,1],to:[5,2]});expect(g.movesFrom(5,1)).not.toContainEqual({type:"move",from:[5,1],to:[5,4]});});
 test("soldiers cannot stop on restricted squares but can cross empty throne",()=>{const g=new HnefataflGame({setup:false});g.set(5,3,"attacker");const m=g.movesFrom(5,3);expect(m).not.toContainEqual({type:"move",from:[5,3],to:[5,5]});expect(m).toContainEqual({type:"move",from:[5,3],to:[5,6]});});
 test("king may re-enter throne",()=>{const g=new HnefataflGame({setup:false});g.set(5,3,"king");g.turn="defenders";expect(g.movesFrom(5,3)).toContainEqual({type:"move",from:[5,3],to:[5,5]});});
 test("custodial capture removes ordinary soldier",()=>{const g=new HnefataflGame({setup:false});g.set(2,0,"attacker");g.set(2,1,"defender");g.set(2,3,"attacker");g.apply({type:"move",from:[2,3],to:[2,2]});expect(g.at(2,1)).toBeNull();});
 test("king escapes only at a corner",()=>{const g=new HnefataflGame({setup:false});g.set(0,2,"king");g.turn="defenders";g.apply({type:"move",from:[0,2],to:[0,0]});expect(g.winner).toBe("defenders");expect(g.result).toBe("king-escaped");});
 test("king away from throne requires four attackers",()=>{const g=new HnefataflGame({setup:false});g.set(3,3,"king");[[2,3],[4,3],[3,2],[3,5]].forEach(x=>g.set(...x,"attacker"));g.apply({type:"move",from:[3,5],to:[3,4]});expect(g.winner).toBe("attackers");expect(g.result).toBe("king-captured");});
 test("king beside throne is captured by three attackers plus throne",()=>{const g=new HnefataflGame({setup:false});g.set(5,4,"king");[[4,4],[6,4],[5,2]].forEach(x=>g.set(...x,"attacker"));g.apply({type:"move",from:[5,2],to:[5,3]});expect(g.winner).toBe("attackers");});
 test("invalid action is rejected",()=>{const g=new HnefataflGame();expect(()=>g.apply({type:"move",from:[0,3],to:[1,4]})).toThrow("Illegal Hnefatafl move");});
});
