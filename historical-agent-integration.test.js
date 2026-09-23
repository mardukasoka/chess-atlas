/** @jest-environment jsdom */
"use strict";

const { KonaneGame } = require("./konane.js");

describe("historical Kōnane agent adapter", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.useFakeTimers();
    document.body.innerHTML =
      '<select id="history-opponent"><option value="human">Human</option><option value="agent" selected>Atlas agent</option></select>' +
      '<select id="history-game"><option value="konane" selected>Kōnane</option></select>' +
      '<div id="actions"></div>';

    global.mode = "konane";
    global.game = new KonaneGame({ size: 8 });
    global.actions = document.getElementById("actions");
    global.modeSelect = document.getElementById("history-game");
    global.recordState = jest.fn();
    global.render = jest.fn();

    window.ChessAtlasKonaneAgent = { create: jest.fn() };
  });

  afterEach(() => {
    jest.useRealTimers();
    delete global.mode;
    delete global.game;
    delete global.actions;
    delete global.modeSelect;
    delete global.recordState;
    delete global.render;
    delete window.ChessAtlasGameAgent;
    delete window.ChessAtlasKonaneAgent;
  });

  test("routes both opening phases through authoritative Kōnane removals", () => {
    let capturedAdapter = null;
    window.ChessAtlasGameAgent = {
      step: adapter => {
        capturedAdapter = adapter;
        const legal = adapter.legalActions();
        const selected = adapter.choose(legal);
        expect(legal).toContain(selected);
        adapter.apply(selected);
        return { status: "move", action: selected };
      }
    };

    require("./historical-agent-integration.js");
    jest.advanceTimersByTime(220);

    expect(capturedAdapter).not.toBeNull();
    expect(game.phase).toBe("white-removal");
    expect(game.turn).toBe("w");

    const whiteActions = capturedAdapter.legalActions();
    expect(whiteActions.length).toBeGreaterThan(0);
    const whiteChoice = capturedAdapter.choose(whiteActions);
    expect(whiteActions).toContain(whiteChoice);
    capturedAdapter.apply(whiteChoice);

    expect(game.phase).toBe("play");
    expect(game.turn).toBe("b");
  });
});


describe("historical Senet specialist adapter", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.useFakeTimers();
    document.body.innerHTML =
      '<select id="history-opponent"><option value="human">Human</option><option value="agent" selected>Atlas agent</option></select>' +
      '<select id="history-game"><option value="senet" selected>Senet</option></select>' +
      '<div id="actions"></div>';
    const { SenetKendallGame } = require("./senet.js");
    global.mode = "senet";
    global.game = new SenetKendallGame({ seed: "agent-test", firstSide: "b" });
    global.actions = document.getElementById("actions");
    global.modeSelect = document.getElementById("history-game");
    global.recordState = jest.fn();
    global.render = jest.fn();
    window.ChessAtlasSenetAgent = require("./senet-agent.js");
  });

  afterEach(() => {
    jest.useRealTimers();
    delete global.mode; delete global.game; delete global.actions; delete global.modeSelect;
    delete global.recordState; delete global.render;
    delete window.ChessAtlasGameAgent; delete window.ChessAtlasSenetAgent;
  });

  test("casts, then selects an authoritative legal action by identity", () => {
    const results = [];
    window.ChessAtlasGameAgent = require("./game-agent.js");
    const baseStep = window.ChessAtlasGameAgent.step;
    window.ChessAtlasGameAgent = Object.freeze({
      ...window.ChessAtlasGameAgent,
      step: adapter => { const result = baseStep(adapter); results.push(result); return result; }
    });
    require("./historical-agent-integration.js");
    jest.advanceTimersByTime(220);
    expect(results[0].status).toBe("prepared");
    expect(game.lastThrow).not.toBeNull();
    const legal = game.legalMoves();
    jest.advanceTimersByTime(220);
    expect(results[1].status).toBe("move");
    expect(legal).toContain(results[1].action);
    expect(game.lastThrow).toBeNull();
  });
});
