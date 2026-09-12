# History Spatial Baseline v0.1 — Completion Tasking

## Mission

Every in-scope historical empire, state/polity, documented culture, language group, and documented ethnicity in the Atlas baseline must have either:

1. one or more sourced, time-indexed representative polygons; or
2. an explicit `spatialStatus: unresolved` record explaining why defensible geometry is unavailable.

A category is never considered complete merely because another category has similar geography.

## Permanent batch cadence

Every chronological history batch now completes in this order:

1. **Historical spine** — evidence-backed entities/events.
2. **Spatial pass** — polygons for every in-scope empire/state/polity/culture/language group/ethnicity introduced by the batch.
3. **Continuity pass** — predecessor/successor/split/merge and boundary changes.
4. **Spatial unresolved audit** — every missing shape is either researched or explicitly marked unresolved.
5. **Validation pass** — baseline validator + spatial validator + zero-dependency self-check.

## Geometry semantics

### Political entities

Allowed representative meanings include:

- administrative territory
- controlled territory
- claimed territory
- core area
- uncertainty envelope

Political geometry must be dated. Long-lived states with materially changing borders require multiple snapshots rather than one timeless maximum-extent polygon.

### Documented cultures

Use:

- attested distribution
- reconstructed distribution
- core area
- uncertainty envelope

Archaeological culture does not automatically imply language, ethnicity, political unity, or biological population continuity.

### Language groups

Language polygons require linguistic/historical evidence independent of political boundaries. Preferred evidence includes historical inscriptions/texts, historical linguistic atlases, specialist linguistic scholarship, and securely contextualized place-name or documentary evidence where appropriate.

Language groups may overlap and may be represented by multiple discontiguous polygons. A state border must never be reused as a language border merely because one language was administratively dominant.

### Documented ethnicities

Ethnicity polygons require explicit historical/ethnographic evidence and a `spatialCaveat`. They are distributions, not hard borders. Mixed settlement, mobility, exogamy, diaspora, seasonal use, changing self-identification and source terminology must remain representable.

Archaeological culture and language are not sufficient on their own to assert ethnicity.

## Coordinate and rendering contract

`history-spatial.js` supports:

- `wgs84-lonlat`
- `atlas-equirectangular-2048x1024`
- `Polygon`
- `MultiPolygon`

WGS84 geometry is projected into the existing Atlas map coordinate system at render time. Multipart geometry is required for discontiguous distributions and dateline-safe rendering.

## Current coverage

### B1 — Deep prehistory / Neolithic

Spatial representatives currently cover the culture records already present in the baseline:

- Mongolian Altai early rock-art horizon
- Northern Jōmon sequence

Site/place anchors remain site geometry and are not promoted into culture polygons.

### B2 — Early states / Bronze Age

Spatial representatives currently cover every culture/polity record in the first-pass Bronze spine:

- Mycenaean cultural horizon
- New Kingdom Egypt
- Kerma
- Shang
- Poverty Point
- Olmec candidate horizon
- Lapita

Lapita uses multipart geometry with a dateline split.

### B3 — Iron Age / Axial world

Spatial representatives currently cover every culture/polity record in the first-pass Iron/Axial spine:

- Classical Athens
- Achaemenid Empire
- Napatan Kush
- Scythian horizon
- Magadha
- Eastern Zhou court core
- Dong Son
- Adena
- Preclassic Maya horizons
- Chavín

The Eastern Zhou polygon is deliberately only the royal/core envelope. The competing Spring-and-Autumn and Warring-States polities require separate records and polygons during densification.

## Language and ethnicity research queue

This is now a required baseline workstream, not optional decoration.

For each era/region:

1. inventory historically documented language groups;
2. inventory historically documented ethnonyms/ethnic communities while preserving source terminology and uncertainty;
3. identify reliable spatial evidence independent of state/culture polygons;
4. create time-indexed distribution records;
5. permit overlaps and multipart distributions;
6. mark disputed identifications explicitly;
7. mark spatially unresolved groups rather than drawing speculative borders.

Priority should follow the chronological baseline so language/ethnicity layers are added alongside B3–B10 rather than retrofitted only at the end.

## Refinement levels

A polygon may progress through:

- **L0 unresolved** — entity known, spatial evidence not yet adequate.
- **L1 representative sketch** — sourced broad core/distribution/uncertainty envelope; suitable for world-scale visualization.
- **L2 scholarly reconstruction** — phase-specific polygon derived from specialist maps/datasets.
- **L3 GIS-refined** — higher-resolution source geometry with provenance, scale/resolution metadata, disputed zones and dated snapshots.

Gameplay divergence detection should never use an L1 sketch as though it were an L3 surveyed boundary. Polygon refinement/confidence will later determine the tolerance of the Continuum Agency response.

## Completion gate

History Baseline v0.1 is not spatially complete until:

- every in-scope empire/state/polity is represented or explicitly unresolved;
- every documented culture included in the baseline is represented or explicitly unresolved;
- every language group included in the baseline is represented or explicitly unresolved;
- every documented ethnicity included in the baseline is represented or explicitly unresolved;
- political, cultural, linguistic and ethnic layers remain semantically distinct;
- overlapping/discontiguous distributions are supported;
- every polygon carries source, time, epistemic class, confidence, coordinate system and geometry meaning;
- `history-baseline-selfcheck.js` passes;
- later higher-resolution GIS work can replace representative sketches without changing stable subject IDs.
