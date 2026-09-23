"use strict";

const SenetAgent = require("./senet-agent.js");

describe("Senet specialist agent", () => {
  test("returns the identical highest-ranked legal action object", () => {
    const progress = { pieceIndex: 0, from: 10, to: 14, exit: false, swap: null, happiness: false };
    const swap = { pieceIndex: 1, from: 12, to: 15, exit: false, swap: { side: "w", pieceIndex: 2 }, happiness: false };
    const exit = { pieceIndex: 2, from: 28, to: 31, exit: true, swap: null, happiness: false };
    const actions = [progress, swap, exit];
    const choice = SenetAgent.create().chooseAction({ legalActions: actions });
    expect(choice).toBe(exit);
    expect(actions).toContain(choice);
  });

  test("returns null for no legal actions", () => {
    expect(SenetAgent.create().chooseAction({ legalActions: [] })).toBeNull();
  });

  test("selection is deterministic and never manufactures an action", () => {
    const first = { pieceIndex: 0, from: 4, to: 8, exit: false, swap: null, happiness: false };
    const second = { pieceIndex: 1, from: 8, to: 12, exit: false, swap: null, happiness: false };
    const actions = [first, second];
    const agent = SenetAgent.create();
    expect(agent.chooseAction({ legalActions: actions })).toBe(second);
    expect(agent.chooseAction({ legalActions: actions })).toBe(second);
  });
});
