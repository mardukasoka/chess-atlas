# Fairy-Stockfish variant induction inventory

Purpose: identify which Fairy-Stockfish games are useful to Chess Atlas, without confusing engine support with historical provenance.

## Rules for induction

1. Fairy-Stockfish proves that a rules engine exists; it does **not** by itself prove a historical date, origin, or authorship claim.
2. Historical placement in the Atlas requires an independent provenance pass before a game is attached to a dated timeline node.
3. Reconstructions remain labelled as reconstructions. Modern authored variants remain in the modern/future branch even when inspired by older cultures.
4. Atlas-native rules remain authoritative for games already implemented. Fairy-Stockfish can later act as opponent/analysis backend, but it must not silently replace a documented historical profile.
5. Browser use should prefer the WebAssembly port only after size, licence-distribution and mobile-performance checks.

## Already covered in Chess Atlas

- Shatranj — Atlas-native playable rules.
- Makruk — Atlas-native playable rules.
- Modern chess — Atlas-native playable rules.
- Chaturanga — Atlas-native playable reconstruction/profile; Fairy-Stockfish is not currently the historical authority.

These should be tested against Fairy-Stockfish where useful, but not duplicated in the UI.

## Priority A — regional/historical chess families worth inducting next

| Fairy-Stockfish game | Atlas action | Historical placement |
| --- | --- | --- |
| Xiangqi | High-priority engine-backed induction | Withhold exact timeline date until independent provenance pass |
| Shogi | High-priority engine-backed induction | Withhold exact timeline date until independent provenance pass |
| Janggi | High-priority engine-backed induction | Withhold exact timeline date until independent provenance pass |
| Sittuyin | High-priority regional induction | Independent Burmese/Myanmar historical sourcing required |
| Shatar | High-priority regional induction | Independent Mongolian historical sourcing required |
| Ouk Chatrang | Induct after Makruk comparison | Treat as a distinct Cambodian rules tradition; provenance pass required |
| Courier Chess | Strong medieval-European candidate | Independent documentary/date verification required before timeline placement |

These give much greater historical and geographic coverage than adding another recent chess variant.

## Priority B — historically interesting but requiring narrower validation

- Manchu chess — historically specific Xiangqi-relative; provenance and exact rules profile first.
- Jeson Mor — Mongolian regional game; provenance first.
- Kar Ouk — Cambodian relative; distinguish carefully from Ouk Chatrang.
- Sho Shogi and older Shogi-family forms — potentially important to the development tree, but should be separated from later/modern Shogi variants.
- Raazuvaa — engine support exists, but the Fairy-Stockfish README itself links to a modern discussion source; do not assign ancient or traditional status without better evidence.
- Indian Great Chess — appears in `variants.ini` as a configured historical-labelled variant, but its exact historical status needs independent checking before Atlas induction.

## Priority C — modern authored chess variants

Fairy-Stockfish supports many useful modern variants: Capablanca, Chess960, Crazyhouse, Bughouse, Seirawan, Grand Chess, Atomic, Horde, Racing Kings, Three-check, Los Alamos, Gardner minichess, Duck Chess, Berolina, Spartan, Wolf, Troitzky and many others.

These belong in a separate **Modern authored variants** branch. Each Atlas entry should record creator/author where recoverable, first publication/date, rules source and Fairy-Stockfish engine id. Do not mix them with the historical-origin sequence.

## Related games

Fairy-Stockfish also supports non-chess abstract games including Amazons, Ataxx, Breakthrough, Clobber, Connect Four, Five Field Kono, Reversi-family variants, Fox and Hounds, Isolation and others. These are useful to the wider Games Atlas, but they should not be inserted into the chess lineage simply because the engine can run them.

## Engine observations

The Fairy-Stockfish README explicitly separates `Regional and historical games`, `Chess variants`, `Shogi variants`, and `Related games`. The engine supports UCI/UCCI/USI-family protocols and user-defined rule configuration. Its `src/variants.ini` also demonstrates that configured variants may be modern hybrids, experiments, reconstructions or games imported from other catalogues. Therefore the Atlas must maintain its own provenance layer.

The WebAssembly fork states that it is a browser port with NNUE support and is used for client-side analysis. That makes it attractive for the Atlas's user-brings-compute/mobile architecture, but integration should remain optional and lazy-loaded.

## Induction sequence

Next implementation sequence:

1. create a small Fairy-Stockfish adapter boundary without loading the WASM by default;
2. validate Xiangqi, Shogi and Janggi engine identifiers and minimal FEN/start-position round trips;
3. independently source historical provenance for those three;
4. add registry entries only after provenance is ready;
5. then repeat for Sittuyin, Shatar, Ouk Chatrang and Courier Chess;
6. build the modern-authored branch separately with explicit creator/date metadata.

## Upstream anchors

- Fairy-Stockfish fork: `mardukasoka/Fairy-Stockfish`
- inspected engine tree commit: `c19b5f6c66894fdb0e88d0dd100e3885f744760a`
- browser fork: `mardukasoka/fairy-stockfish.wasm`, default branch `nnue`
- upstream engine licence: GPL v3 or later as stated in the repository

This file is an engineering inventory, not a historical source.