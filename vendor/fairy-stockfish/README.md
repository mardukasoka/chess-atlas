# Fairy-Stockfish browser assets

Chess Atlas does **not** commit engine binaries in its lightweight core. A deployment that wants the optional regional specialist should place a matching Fairy-Stockfish WASM build here:

- `stockfish.js`
- `stockfish.wasm`
- optionally `stockfish.worker.js` if required by that build
- `Copying.txt`
- `AUTHORS`

The expected source is the fork `mardukasoka/fairy-stockfish.wasm` (default branch `nnue`) or its upstream release. The fork's Emscripten build emits these files from `src/emscripten/public`.

Keep the corresponding source-code pointer/build revision with any deployed binary to satisfy the engine's GPL-3.0 distribution requirements. The Atlas loader is lazy: these files are requested only when the user explicitly enables the specialist tier.
