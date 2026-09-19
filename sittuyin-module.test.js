"use strict";
const M=require("./sittuyin-module.js");
const board=()=>Array.from({length:8},()=>Array(8).fill(""));
test("Sittuyin module exposes exact Atlas legal actions",()=>{const b=board();b[4][4]="wE";const s=M.create({board:b,turn:"w"});const a=M.legalActions(s);expect(a.length).toBe(5);expect(a.map(x=>x.engineMove)).toContain("e4e5")});
test("Sittuyin module rejects moves outside current Atlas legal actions",()=>{const b=board();b[4][4]="wE";const s=M.create({board:b,turn:"w"});expect(()=>M.applyAction(s,{engineMove:"a1a8"})).toThrow(/Illegal Sittuyin action/)});
test("deployment is never silently invented",()=>{expect(()=>M.create()).toThrow(/explicit verified board/);const b=board();const s=M.create({board:b,phase:"deployment"});expect(M.legalActions(s)).toEqual([])});
