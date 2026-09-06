"use strict";

const GameModules = require("./game-modules.js");

describe("extensible game module registry", () => {
  beforeEach(() => GameModules.clear());

  function counterModule() {
    return {
      id: "counter",
      name: "Counter Test Game",
      create(options = {}) {
        return { value: options.start || 0, turn: "a" };
      },
      legalActions(game) {
        return game.value < 2 ? [{ type: "increment" }] : [];
      },
      applyAction(game, action) {
        if (action.type !== "increment") throw new Error("Illegal action");
        if (!this.legalActions(game).length) throw new Error("No legal action");
        game.value += 1;
        game.turn = game.turn === "a" ? "b" : "a";
        return game;
      },
      snapshot(game) {
        return { value: game.value, turn: game.turn };
      }
    };
  }

  test("registers and creates a game without modifying the registry implementation", () => {
    GameModules.register(counterModule());
    const game = GameModules.create("counter", { start: 1 });

    expect(GameModules.get("counter").name).toBe("Counter Test Game");
    expect(game).toEqual({ value: 1, turn: "a" });
  });

  test("exposes a common legal-action and apply-action seam for future agents", () => {
    GameModules.register(counterModule());
    const game = GameModules.create("counter");

    expect(GameModules.legalActions("counter", game)).toEqual([{ type: "increment" }]);
    GameModules.applyAction("counter", game, { type: "increment" });
    expect(GameModules.snapshot("counter", game)).toEqual({ value: 1, turn: "b" });
  });

  test("rejects duplicate ids so one game cannot silently replace another", () => {
    GameModules.register(counterModule());
    expect(() => GameModules.register(counterModule())).toThrow(/already registered/);
  });

  test("rejects malformed modules early", () => {
    expect(() => GameModules.register({ id: "broken", name: "Broken" })).toThrow(/create/);
    expect(() => GameModules.register({ id: "broken", name: "Broken", create() {}, legalActions: true })).toThrow(/legalActions/);
  });

  test("falls back to an engine snapshot when an adapter snapshot is omitted", () => {
    GameModules.register({
      id: "snapshot-engine",
      name: "Snapshot Engine",
      create() { return { snapshot: () => ({ ok: true }) }; }
    });

    const game = GameModules.create("snapshot-engine");
    expect(GameModules.snapshot("snapshot-engine", game)).toEqual({ ok: true });
  });
});
