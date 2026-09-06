# Chess Atlas game modules

Chess Atlas keeps historical rules engines independent, but exposes them through a tiny optional adapter contract so new games, UIs, and agents do not require changes to the core registry.

A module has a stable `id`, human `name`, and `create(options)` function. For agent-compatible games it also exposes `legalActions(game)` and `applyAction(game, action)`. `snapshot(game)` is optional when the engine already has `game.snapshot()`.

```js
ChessAtlasGameModules.register({
  id: "example-game",
  name: "Example Game",
  create(options) {
    return new ExampleGame(options);
  },
  legalActions(game) {
    return game.legalMoves().map(move => ({ type: "move", move }));
  },
  applyAction(game, action) {
    if (action.type !== "move") throw new Error("Illegal action");
    return game.move(action.move);
  }
});
```

The rules engine remains the authority. Adapters must not invent legality: every action returned to a UI or agent should come from the engine, and every applied action must still be validated by the engine.

Historical provenance stays in `game-registry.js` and per-game provenance files. The module layer is an execution interface, not a historical source of truth.

This separation is deliberate:

- **rules engine** — historical/game logic
- **game registry** — identity, chronology, provenance, authorship
- **game module** — runtime adapter
- **UI** — presentation and human input
- **agent** — chooses among actions supplied by the module

New games can therefore be added one at a time without expanding a monolithic switch statement, while future game-playing agents can use the same `legalActions → choose → applyAction` path.
