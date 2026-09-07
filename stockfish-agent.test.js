"use strict";

const Stockfish = require("./stockfish-agent.js");
const Agents = require("./game-agents.js");
const Modules = require("./game-modules.js");
const ModernChessModule = require("./modern-chess-module.js");

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

test("converts a modern Chess Atlas snapshot to safe FEN", () => {
  Modules.clear();
  Modules.register(ModernChessModule);
  const game = Modules.create(ModernChessModule.id);
  const snapshot = Modules.snapshot(ModernChessModule.id, game);
  expect(Stockfish.snapshotToFen(snapshot)).toBe("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1");
  expect(Stockfish.positionFromContext({ snapshot })).toBe("fen rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1");
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

test("generic agent runner can execute a Stockfish move on modern chess", async () => {
  Modules.clear();
  Modules.register(ModernChessModule);
  const game = Modules.create(ModernChessModule.id);
  const agent = Stockfish.stockfishAgent({ transport: { bestMove: async position => {
    expect(position.startsWith("fen rnbqkbnr/pppppppp")).toBe(true);
    return "e2e4";
  } } });
  const result = await Agents.takeTurn({ modules: Modules, gameId: ModernChessModule.id, game, agent });
  expect(result.status).toBe("applied");
  expect(result.action.uci).toBe("e2e4");
  expect(game.turn).toBe("b");
  expect(game.board[4][4]).toBe("wP");
});
