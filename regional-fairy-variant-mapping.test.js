"use strict";
const Fairy=require("./fairy-stockfish-agent.js");
test("regional completion variants have explicit Fairy mappings",()=>{
  expect(Fairy.variantFor("sittuyin")).toBe("sittuyin");
  expect(Fairy.variantFor("shatar")).toBe("shatar");
  expect(Fairy.variantFor("ouk-chatrang")).toBe("cambodian");
  expect(Fairy.variantFor("courier")).toBe("courier");
});
test("unknown regional game cannot silently inherit an engine variant",()=>{
  expect(Fairy.variantFor("unknown-regional-game")).toBeNull();
});
