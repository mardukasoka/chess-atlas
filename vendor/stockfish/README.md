# Stockfish browser assets

Chess Atlas integrates with **Stockfish 18 lite single-threaded** through `stockfish-loader.js` and `stockfish-worker.js`.

The engine is deliberately lazy-loaded: normal Chess Atlas pages do not download Stockfish. When Stockfish play is enabled, the loader expects these same-origin files:

- `vendor/stockfish/stockfish-18-lite-single.js`
- `vendor/stockfish/stockfish-18-lite-single.wasm`

Upstream: nmrugg/stockfish.js / npm package `stockfish` 18.0.8.

## License boundary

Stockfish.js and the Stockfish engine are GPL-3.0. Any deployment that distributes the engine files must also satisfy the GPL source/license obligations for those files. Keep the upstream `Copying.txt` with a vendored distribution and provide the corresponding source offer/source location.

The Chess Atlas adapter does not make Stockfish authoritative: it sends a FEN position to the UCI engine, accepts a proposed UCI move, maps that proposal back to the module's supplied `legalActions`, and only then lets the Chess Atlas rules engine apply it.

The binary assets are not committed by this integration change because the GitHub text-file connector cannot safely write/verify the ~7 MB WASM binary. The runtime path and integration are complete; deployments should copy the pinned upstream 18.0.8 `lite-single` JS/WASM pair into this directory unchanged.
