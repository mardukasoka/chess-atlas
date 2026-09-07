# Go core profile

Chess Atlas treats Go as an independent board-game lineage, not as a chess variant.

## Implemented core

- intersection placement
- orthogonal liberties and connected groups
- capture of groups with no liberties
- suicide prohibited
- positional repetition prohibited by stored board history
- pass; two consecutive passes enter `scoring`
- 9×9 default for the mobile UI/runtime, with 13×13 and 19×19 supported by the same module

## Deliberate boundary

This first core does **not** silently choose Japanese, Chinese, AGA, Ing, Tromp-Taylor, or another scoring/rules convention. After two passes the game enters `scoring`; a later named rules profile will determine territory/area scoring, komi, dead-stone adjudication and any ruleset-specific ko details.

That boundary is intentional: the Atlas should attribute contested or modern rule conventions rather than present one as timeless Go.

## Architecture

`go-module.js` implements the existing generic game-module contract (`create`, `legalActions`, `applyAction`, `snapshot`). It is therefore available to the generic agent layer without coupling Go to the chess movement engine.
