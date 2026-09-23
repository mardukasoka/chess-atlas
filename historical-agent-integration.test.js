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
