# Fairy-Stockfish adapter boundary

Chess Atlas should treat Fairy-Stockfish as an optional engine backend, not as the source of historical truth.

## Intended responsibilities

- expose engine-supported variant ids;
- provide legal-move generation, analysis and optional AI-opponent play;
- preserve the Atlas game id and selected historical rules profile separately from the engine variant id;
- lazy-load browser/WASM assets only when analysis or an engine opponent is requested;
- keep the Atlas usable when the engine is unavailable or too heavy for the device.

## Non-responsibilities

This adapter must not assign dates, cultures, origins or authorship. Those belong in `game-registry.js` and provenance records. It must not silently substitute Fairy-Stockfish rules for an Atlas reconstruction whose rule profile differs.

## Candidate mapping

| Atlas id | Fairy-Stockfish id | State |
| --- | --- | --- |
| modern | chess | candidate analysis/opponent backend |
| shatranj | shatranj | candidate parity test; Atlas rules remain authoritative |
| makruk | makruk | candidate parity test; Atlas rules remain authoritative |
| xiangqi | xiangqi | induction candidate; provenance required before timeline placement |
| shogi | shogi | induction candidate; provenance required before timeline placement |
| janggi | janggi | induction candidate; provenance required before timeline placement |
| sittuyin | sittuyin | induction candidate; provenance required before timeline placement |
| shatar | shatar | induction candidate; provenance required before timeline placement |
| ouk-chatrang | cambodian / engine identifier to verify | do not bind until identifier and rules profile are verified |
| courier | courier | induction candidate; provenance required before timeline placement |

## Mobile policy

Do not include the WASM payload in the initial Atlas page. A future implementation should use a dynamic worker/lazy-loading boundary and report engine availability explicitly. This preserves the lightweight map/game experience on phones.

## Validation gates before activation

1. verify exact engine identifiers against the fork/build;
2. verify start-position/FEN round trips;
3. compare legal moves against Atlas-native games where both exist;
4. benchmark WASM download, startup memory and move latency on mobile;
5. check GPL distribution obligations for the exact browser build;
6. only then expose an `Engine opponent` control.

See `FAIRY_STOCKFISH_VARIANT_INVENTORY.md` and `references/upstream.json`.