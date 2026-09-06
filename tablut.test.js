"use strict";
const { TablutGame } = require("./tablut.js");

describe("Tablut — Linnaeus 1732 / Salmi profile", () => {
  test("starts with 16 attackers, 8 defenders and king on 9x9 board", () => {
    const g=new TablutGame(); const s=g.snapshot();
    expect(s.profile).toBe("tablut-linnaeus-1732-salmi");
    expect(s.board.filter(x=>x.piece==="attacker")).toHaveLength(16);
    expect(s.board.filter(x=>x.piece==="defender")).toHaveLength(8);
    expect(g.at(4,4)).toBe("king"); expect(g.turn).toBe("attackers");
  });
  test("pieces move orthogonally without jumping", () => {
    const g=new TablutGame({setup:false}); g.set(4,1,"attacker"); g.set(4,3,"defender");
    expect(g.movesFrom(4,1)).toContainEqual({type:"move",from:[4,1],to:[4,2]});
    expect(g.movesFrom(4,1)).not.toContainEqual({type:"move",from:[4,1],to:[4,4]});
  });
  test("custodial capture removes a soldier", () => {
    const g=new TablutGame({setup:false}); g.set(2,0,"attacker"); g.set(2,2,"attacker"); g.set(2,1,"defender");
    g.apply({type:"move",from:[2,0],to:[1,0]});
    g.turn="attackers"; g.apply({type:"move",from:[1,0],to:[2,0]});
    expect(g.at(2,1)).toBeNull(); expect(g.captured.defenders).toBe(1);
  });
  test("king wins by reaching the edge", () => {
    const g=new TablutGame({setup:false}); g.set(1,4,"king"); g.turn="defenders";
    g.apply({type:"move",from:[1,4],to:[1,0]}); expect(g.winner).toBe("defenders");
  });
  test("king on throne requires four attackers", () => {
    const g=new TablutGame({setup:false}); g.set(4,4,"king"); [[3,4],[5,4],[4,3],[4,6]].forEach(([r,c])=>g.set(r,c,"attacker"));
    g.apply({type:"move",from:[4,6],to:[4,5]}); expect(g.winner).toBe("attackers");
  });
  test("ordinary king away from throne is captured custodially", () => {
    const g=new TablutGame({setup:false}); g.set(2,2,"king"); g.set(2,1,"attacker"); g.set(2,4,"attacker");
    g.apply({type:"move",from:[2,4],to:[2,3]}); expect(g.winner).toBe("attackers");
  });
});
