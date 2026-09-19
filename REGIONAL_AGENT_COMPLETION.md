# Regional game-agent completion pass

This tranche finishes the agent-facing inventory before the final historical game additions.

## Existing playable specialist tiers

- Alquerque — bounded alpha-beta specialist.
- Kōnane — bounded alpha-beta specialist.
- Royal Game of Ur — Finkel-profile heuristic specialist.
- Xiangqi — local legal/random + heuristic; optional lazy Fairy-Stockfish/WASM.
- Shogi — local legal/random + heuristic; optional lazy Fairy-Stockfish/WASM.
- Janggi — local legal/random + heuristic; optional lazy Fairy-Stockfish/WASM.
- Go — local legal/random + heuristic.
- Backgammon — local legal/random + heuristic.
- Senet — shared legal-action runner.
- Chess-family orthodox play — Stockfish adapter remains separate from historical provenance.

## Next engine-backed regional profiles

These are **not promoted to playable Atlas pages merely because Fairy-Stockfish has a variant implementation**. Each requires an Atlas-native rules/profile and historical provenance first:

1. Makruk
2. Shatranj
3. Sittuyin
4. Shatar
5. Ouk Chatrang
6. Courier Chess

The specialist-engine sequence is always:

`Atlas state → Atlas legalActions → engine serialization → specialist bestmove → map to exact Atlas legalAction → Atlas applyAction`.

An engine response that cannot be mapped to an Atlas legal action is rejected.

## Completion boundary

After the remaining historical/regional catalogue is implemented and verified, expansion moves to a separately labelled **contemporary variants** layer. Modern variants must record their creator/source and date where known and must not be inserted backwards into the historical lineage.
