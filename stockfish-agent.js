"use strict";

/*
 * Stockfish adapter for the Chess Atlas game-agent seam.
 *
 * This file deliberately does not bundle Stockfish. A browser Worker, WASM
 * wrapper, or other UCI transport is injected by the caller. Stockfish proposes
 * a UCI move; Chess Atlas then maps that proposal back to one of the engine's
 * supplied legalActions. The rules engine remains authoritative.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.ChessAtlasStockfishAgent = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function normalizeUci(value) {
    return typeof value === "string" ? value.trim().toLowerCase() : "";
  }

  function actionUci(action) {
    if (!action || typeof action !== "object") return "";
    if (typeof action.uci === "string") return normalizeUci(action.uci);
    return "";
  }

  function parseBestmove(line) {
    if (typeof line !== "string") return null;
    const match = line.trim().match(/^bestmove\s+(\S+)/i);
    if (!match || match[1] === "(none)") return null;
    return normalizeUci(match[1]);
  }

  function createUciTransport(options) {
    const opts = options || {};
    if (typeof opts.send !== "function") throw new TypeError("UCI transport requires send(command)");
    if (typeof opts.waitForBestmove !== "function") throw new TypeError("UCI transport requires waitForBestmove()");
    return Object.freeze({
      async bestMove(position, go) {
        if (!position || typeof position !== "string") throw new TypeError("Stockfish position is required");
        await opts.send(`position ${position}`);
        await opts.send(go || "go depth 10");
        const response = await opts.waitForBestmove();
        const best = parseBestmove(response);
        if (!best) throw new Error("Stockfish returned no bestmove");
        return best;
      }
    });
  }

  function stockfishAgent(options) {
    const opts = options || {};
    const transport = opts.transport;
    if (!transport || typeof transport.bestMove !== "function") {
      throw new TypeError("Stockfish agent requires a UCI transport");
    }
    return Object.freeze({
      id: opts.id || "stockfish",
      name: opts.name || "Stockfish",
      async chooseAction(context) {
        const actions = Array.isArray(context && context.legalActions) ? context.legalActions : [];
        if (!actions.length) return null;
        const position = context && (context.uciPosition || context.position);
        if (!position) throw new Error("Stockfish agent requires context.uciPosition");
        const uci = await transport.bestMove(position, opts.go || "go depth 10");
        const selected = actions.find(action => actionUci(action) === uci);
        if (!selected) throw new Error(`Stockfish selected move outside legalActions: ${uci}`);
        return selected;
      }
    });
  }

  return Object.freeze({ normalizeUci, actionUci, parseBestmove, createUciTransport, stockfishAgent });
});
