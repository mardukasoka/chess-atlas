# Combat profile and strategic battle bridge v0.1

This layer keeps tactical combat independent of both historical game rules and the future OpenFront-derived civilization simulation.

## Invariant

Canonical game/world state proposes an encounter. The combat subsystem receives a scenario and combat profiles, resolves it, and returns a neutral result. Only the originating rules/simulation layer may apply that result.

## Scale-independent combat source

A combat profile may represent a piece, individual, squad, formation, army element, or explicitly synthetic entity. This lets the same encounter boundary serve Archon I, Combat Chess variants, and later OpenFront-derived strategic battles.

## Epistemic boundary

Profiles carry a namespace: real, reconstructed, counterfactual, or synthetic. Synthetic/counterfactual profiles may read Atlas geography/history as scenario context, but cannot write claims into the canonical historical Atlas. Names do not determine status: a dragon may be a synthetic Archon creature, a documented cultural representation, or another explicitly sourced interpretation.

## Historical equipment

The equipment resolver is deliberately data-only. It filters evidence-bearing equipment by date/region/culture. It does not invent missing weapons, armour, statistics, or chronology. The eventual equipment catalogue should be shared with Atlas history, technology diffusion, and civilization simulation.

## OpenFront bridge

The strategic bridge is engine-neutral. An OpenFront-derived Atlas layer can later emit an encounter containing place/date/culture/forces; Combat Chess resolves the tactical scenario; the neutral result returns to the strategic simulation. OpenFront must not become the historical source of truth.
