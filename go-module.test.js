"use strict";

const assert = require("assert");
const Go = require("./go-module.js");

test("Go defaults to mobile 9x9 and supports 13x13/19x19", () => {
  assert.equal(Go.create().size, 9);
  assert.equal(Go.create({size:13}).board.length, 13);
  assert.equal(Go.create({size:19}).board.length, 19);
  assert.throws(() => Go.create({size:8}), /9, 13, or 19/);
});

test("Go captures a surrounded stone", () => {
  const g=Go.create();
  Go.applyAction(g,{type:"place",at:[0,1]});
  Go.applyAction(g,{type:"place",at:[1,1]});
  Go.applyAction(g,{type:"place",at:[1,0]});
  Go.applyAction(g,{type:"place",at:[8,8]});
  Go.applyAction(g,{type:"place",at:[1,2]});
  Go.applyAction(g,{type:"place",at:[8,7]});
  Go.applyAction(g,{type:"place",at:[2,1]});
  assert.equal(g.board[1][1],0);
  assert.equal(g.captures.black,1);
});

test("Go rejects suicide", () => {
  const g=Go.create();
  g.board[0][1]=2; g.board[1][0]=2;
  assert.throws(()=>Go.applyAction(g,{type:"place",at:[0,0]}),/Illegal Go placement/);
});

test("Go positional history prevents repeating a board", () => {
  const g=Go.create();
  const future=g.board.map(row=>row.slice()); future[4][4]=1;
  g.history.add(future.map(row=>row.join("")).join("/"));
  assert.throws(()=>Go.applyAction(g,{type:"place",at:[4,4]}),/Illegal Go placement/);
});

test("two passes enter scoring without pretending to choose a scoring ruleset", () => {
  const g=Go.create();
  Go.applyAction(g,{type:"pass"}); Go.applyAction(g,{type:"pass"});
  assert.equal(g.status,"scoring");
  assert.deepEqual(Go.legalActions(g),[]);
});
