# Chess Atlas — mobile release gate

Purpose: stabilize the existing game catalogue without replacing its engines or creating duplicate interfaces.

## Reproduction matrix
| Case | Action | Pass condition |
|---|---|---|
| Android portrait | Load index, choose a game, return | No horizontal clipping or inaccessible navigation |
| Chaturanga | Start a new game | All expected pieces render with correct sides and legal initial positions |
| Reload persistence | Make a legal move, reload | Restored state or clearly documented reset behaviour; never silently lose a saved game |
| 5D chess | Navigate time/branch controls | Touch controls remain accessible and move history is coherent |
| Offline/poor connection | Load previously cached resources | Explicit failure message, no invisible empty board |
| Accessibility | Keyboard and screen reader | Named controls, visible focus and understandable turn/status feedback |

## Evidence required before claiming a fix
- Device/browser version, reproduction steps, screenshot or trace, expected vs actual result.
- Identify engine, state persistence layer, renderer and route owning each failure.
- Automated smoke test for initial pieces and a reload round trip.
- No merges until checks pass and an actual phone session is documented.

## Scope boundary
Do not conflate Chess Atlas with independent historical-game forks; catalogue them by game, ruleset, engine and license. Preserve invention-date chronology as a separate metadata field.
