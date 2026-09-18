"use strict";
/*
 * Forked implementation inventory.
 * These are engineering/reference sources, not historical evidence.
 * Atlas-native rules remain authoritative for legality until an adapter is
 * explicitly validated against its source ruleset.
 */
const GAME_FORK_SOURCES=Object.freeze({
  ur:Object.freeze([{repo:"mardukasoka/royal-game-of-ur",role:"rules-ai-reference",runtime:"browser-js",notes:"Static mobile browser implementation; Finkel-profile rules plus three AI levels."}]),
  senet:Object.freeze([{repo:"mardukasoka/senet",role:"implementation-reference",runtime:"browser-js",notes:"Older CraftyJS browser implementation; reference only, not the Atlas historical authority."}]),
  latrunculi:Object.freeze([{repo:"mardukasoka/Latrunculi-Game",role:"implementation-reference",runtime:"unknown",notes:"Sparse upstream documentation; keep isolated until rules and license are verified."}]),
  alquerque:Object.freeze([{repo:"mardukasoka/Alquerque",role:"rules-ai-reference",runtime:"browser-js",notes:"Browser/mobile implementation with MCTS/UCT AI; strong specialist-agent candidate."}]),
  konane:Object.freeze([
    {repo:"mardukasoka/Konane",role:"ai-reference",runtime:"python",notes:"Minimax with alpha-beta pruning."},
    {repo:"mardukasoka/Konane-Game",role:"ai-reference",runtime:"python",notes:"Random, deterministic, minimax and alpha-beta players; terminal UI is not an Atlas dependency."}
  ]),
  pachisi:Object.freeze([{repo:"mardukasoka/Chanda_kaudi_game",role:"family-reference",runtime:"web-app",notes:"Chanda Kaudi/Chaupar-family implementation; rules claims require independent historical verification."}]),
  patolli:Object.freeze([{repo:"mardukasoka/Patolli",role:"implementation-reference",runtime:"unknown",notes:"Fork retained for a future Patolli pass; not yet promoted to a dated playable Atlas node."}]),
  mahjong:Object.freeze([
    {repo:"mardukasoka/mahjong",role:"rules-ui-reference",runtime:"browser-js",notes:"Pomax: pure HTML/CSS/JS; Chinese Classical and Cantonese. Preferred lightweight Chinese browser reference."},
    {repo:"mardukasoka/mahjong2",role:"rules-ai-reference",runtime:"rust-typescript",notes:"igncp: Hong Kong style; correctness/performance core, AI and mobile web client."},
    {repo:"mardukasoka/mahjong3",role:"multiplayer-ui-reference",runtime:"typescript-go",notes:"Japanese Mahjong; programmatic tiles and server-authoritative multiplayer. Keep separate from Chinese profiles."},
    {repo:"mardukasoka/riichi_advanced",role:"variant-language-reference",runtime:"modern-web",notes:"Multi-ruleset/Riichi branch; useful for programmable variant architecture."},
    {repo:"mardukasoka/mjx",role:"ai-research-reference",runtime:"cpp-python",notes:"Research simulator/API; do not make a required mobile dependency."},
    {repo:"mardukasoka/MahjongAI",role:"ai-research-reference",runtime:"python",notes:"Training/bot reference."},
    {repo:"mardukasoka/riichi-core",role:"event-engine-reference",runtime:"javascript",notes:"Deterministic/event-oriented Riichi engine reference."},
    {repo:"mardukasoka/OpenRiichi",role:"client-agent-reference",runtime:"modern-client",notes:"Riichi client/bot/replay reference."},
    {repo:"mardukasoka/mah",role:"solitaire-reference",runtime:"browser",notes:"Mahjong Solitaire puzzle branch; not four-player Mahjong."},
    {repo:"mardukasoka/VidiMahjong",role:"solitaire-reference",runtime:"browser-js",notes:"Mahjong Solitaire puzzle branch with solvability-oriented implementation."}
  ]),
  regionalChess:Object.freeze([
    {repo:"mardukasoka/Fairy-Stockfish",role:"specialist-engine",runtime:"native-wasm-capable",notes:"Primary specialist candidate for supported regional/historical chess variants."},
    {repo:"mardukasoka/fairy-stockfish.wasm",role:"browser-engine",runtime:"wasm",notes:"Client-side Fairy-Stockfish path; lazy-load on demand for mobile."}
  ]),
  quantum:Object.freeze([{repo:"mardukasoka/quantum-chess",role:"experimental-reference",runtime:"python-qiskit",notes:"Postponed advanced branch; not part of the stable historical-game pass."}]),
  infinite:Object.freeze([{repo:"mardukasoka/infinitechess.org",role:"advanced-board-reference",runtime:"web",notes:"Postponed advanced branch; useful for infinite-board architecture."}]),
  fiveD:Object.freeze([{repo:"mardukasoka/5d-chess-js",role:"advanced-rules-reference",runtime:"javascript",notes:"AGPL 5D rules implementation; postponed until stable historical games are complete."}])
});
function sourcesFor(gameId){return GAME_FORK_SOURCES[gameId]||Object.freeze([])}
const GameForkSources={sources:GAME_FORK_SOURCES,sourcesFor};
if(typeof module!=="undefined"&&module.exports)module.exports=GameForkSources;
if(typeof window!=="undefined")window.ChessAtlasGameForkSources=GameForkSources;
