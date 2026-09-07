"use strict";

const Stockfish = require("./stockfish-agent.js");

test("parses Stockfish bestmove output", () => {
  expect(Stockfish.parseBestmove("bestmove e2e4 ponder e7e5")).toBe("e2e4");
  expect(Stockfish.parseBestmove("bestmove (none)")).toBeNull();
});

test("UCI transport sends position then search command", async () => {
  const sent = [];
  const transport = Stockfish.createUciTransport({
    send: async command => sent.push(command),
    waitForBestmove: async () => "bestmove e2e4"
  });
  await expect(transport.bestMove("startpos", "go depth 4")).resolves.toBe("e2e4");
  expect(sent).toEqual(["position startpos", "go depth 4"]);
});

test("Stockfish maps its UCI proposal back to the supplied legal action", async () => {
  const legal = [
    { type: "move", uci: "d2d4" },
    { type: "move", uci: "e2e4" }
  ];
  const agent = Stockfish.stockfishAgent({
    transport: { bestMove: async () => "e2e4" }
  });
  await expect(agent.chooseAction({ legalActions: legal, uciPosition: "startpos" })).resolves.toBe(legal[1]);
});

test("Stockfish cannot invent a move outside legalActions", async () => {
  const agent = Stockfish.stockfishAgent({
    transport: { bestMove: async () => "a2a4" }
  });
  await expect(agent.chooseAction({
    legalActions: [{ type: "move", uci: "e2e4" }],
    uciPosition: "startpos"
  })).rejects.toThrow(/outside legalActions/);
});
