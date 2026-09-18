# Forked Games Pass

This inventory keeps **implementation sources separate from historical evidence**. A fork can supply rendering, a rules engine, or an AI without becoming evidence for a game's origin or historical rules.

## Immediate integration order

1. **Mahjong** — lightweight canonical tiles in Atlas; Chinese Classical/Cantonese from `mahjong`, Hong Kong correctness/AI reference from `mahjong2`; Riichi remains a labelled Japanese branch.
2. **Alquerque** — retain the Atlas rules profile; evaluate the fork's browser MCTS/UCT as a specialist agent behind the universal controller.
3. **Royal Game of Ur** — compare the fork's Finkel-profile engine and AI against Atlas tests; import AI ideas only after rule-state equivalence.
4. **Kōnane** — compare both Python minimax/alpha-beta forks with the Atlas legal-move core; port the search algorithm, not the terminal UI.
5. **Regional chess** — Fairy-Stockfish + WASM remain the specialist path for supported variants, lazy-loaded on mobile.
6. **Senet / Latrunculi / Chanda Kaudi / Patolli** — reference-only until provenance, rules compatibility and licensing are checked.

## Advanced games

`quantum-chess`, `infinitechess.org`, and `5d-chess-js` remain recorded but postponed. This preserves the current project decision to stabilize historical games, navigation, zoom/time state and agents before reopening advanced-board work.

## Runtime policy

The Atlas front end stays lightweight and mobile-first. Browser JavaScript/TypeScript and optional WASM are preferred. Rust/Python/C++ may serve as reference or remote/compiled engines behind adapters. **Java is not part of the selected runtime stack.**
