# Archon adapter research

Status: research scaffold only — no third-party Archon source copied.

## Target architecture

Archon rules/state -> Chess Atlas game adapter -> existing board/navigation shell -> replaceable battle renderer (Three.js candidate).

## Source audit

- Archon Remake (SourceForge): browser-based Archon remake with AI. Treat as behavioral/reference material until an explicit source-code license is verified.
- heinrichelsigan/Archon / mardukasoka/Archon: GPL-3.0 reference implementation. The checked-in `htmljs/archon` directory currently contains a Frogger-style game rather than the expected Archon web implementation.
- XArchon: GPL-2.0 C/C++ implementation; useful as an additional rules/reference source, not a browser implementation.

## Integration constraints

1. No Java runtime dependency in Chess Atlas.
2. Keep strategic game state independent of rendering.
3. Implement the 9x9 board and legal movement in native JavaScript.
4. Treat combat as a separate state entered when a move targets an enemy-occupied square.
5. Battle renderer must be replaceable; Three.js/WebGL/WebGPU rendering must not own game rules.
6. Preserve mobile-first layout and existing Atlas time/navigation state.
7. Do not copy SourceForge Archon Remake code unless its license is positively identified.

## Planned adapter surface

```js
{
  id: "archon",
  year: 1983,
  board: { files: 9, ranks: 9 },
  createInitialState(),
  legalMoves(state, pieceId),
  applyStrategicMove(state, move),
  battleFor(move, state),
  resolveBattle(state, result),
  powerPoints(state),
  winner(state)
}
```

## Next implementation slice

Create the data-only Archon state model and tests first. Rendering comes after rules/state tests pass.
