# Atlas History Baseline v0.1 — Inventory and Gap Analysis

## Purpose

Create an evidence-backed, continuous historical baseline that is authoritative for Chess Atlas, Diplomacy, Civilization, and later continuum-divergence gameplay.

The baseline is not a simulator. Simulation may read the baseline and fork from it, but may not silently rewrite it.

## Existing Atlas assets

### Chess Atlas

Useful foundations already present:

- `timeline-state.js` — immutable branching snapshot graph suitable for alternate timelines after a baseline fork.
- `atlas-time-state.js` — shared navigation modes for games, chess, civilisation, and diplomacy.
- `stateGraph.js` — game/history state graph substrate.
- `site-data.js` — sourced archaeological locations with phase ranges, evidence type, source links, and explicit warnings against treating research networks as political territories.
- `geography.js`, `map-renderer.js`, `spatial-legality.js` — geographic/playability infrastructure.
- `historical-games.js`, `early-games-archaeology.js`, `*.PROVENANCE.md` — examples of marking reconstruction rather than presenting uncertain rules as fact.
- `culture-data.js` and `culture-cluster-sources.md` — candidate cultural layer with source metadata.

Current limitation: these assets do not yet form a continuous world-history baseline of polities, rulers, conflicts, treaties, migrations, technologies, borders, trade routes, population/economic anchors, and major events.

### Human History Simulator fork

`mardukasoka/human-history-simulator` is a high-value candidate source and later consequence engine. It contains:

- 20 era presets from the Bronze Age through the AI Age.
- Large per-era seed files with civilization state.
- historical boundary snapshots / GeoJSON infrastructure.
- economy, diplomacy, trade, military, culture, population and technology state.
- event, rollback and speculative-history mechanisms.

Important epistemic restriction: simulator seed data is an **import candidate**, not baseline authority. Its data may mix curated material, generated material, modeling assumptions and gameplay state. Every imported claim must acquire independent provenance and an epistemic classification before canonical promotion.

## Canonical record classes

The v0.1 validator supports:

- event
- polity
- person
- place
- boundary
- conflict
- battle
- treaty
- migration
- trade-route
- technology
- demographic-anchor
- economic-anchor
- institution
- culture
- religion

Epistemic classes:

- documented
- archaeological
- archaeological-reconstruction
- scholarly-reconstruction
- disputed
- inferred
- unknown-gap

Status lifecycle:

`candidate -> reviewed -> canonical`

or

`candidate/reviewed -> rejected`

## Coverage target

The first complete baseline should prioritize continuity over maximal detail. For every major time slice and region, the Atlas should be able to answer:

1. Which major polities and politically independent regions exist?
2. What are the best-supported territorial extents or uncertainty zones?
3. Who are the major rulers/office-holders where known?
4. Which wars, battles, treaties and migrations are active or recently decisive?
5. Which cities/settlements and trade routes materially structure the region?
6. What major technologies/institutions are available?
7. What population/economic anchors are defensible?
8. What evidence supports each assertion and how confident are we?

## Era completion queue

### P0 — Foundation and continuity

These must be completed first because later simulation and timeline policing depend on them.

1. **Deep prehistory / Neolithic, c. 15,000–3500 BCE**
   - sites and settlement networks
   - agriculture/domestication transitions
   - migration and exchange networks
   - no invented political boundaries where evidence does not support them
   - start deliberately includes late-Pleistocene American evidence such as Monte Verde rather than cutting the baseline at an arbitrary 12,000 BCE threshold

2. **Early states and Bronze Age, c. 3500–1200 BCE**
   - Mesopotamia, Egypt, Anatolia, Levant, Aegean, Indus, early China
   - state successions, major cities, diplomatic systems, trade routes
   - Bronze Age collapse with explicit uncertainty and competing explanations

3. **Iron Age / Axial world, c. 1200–323 BCE**
   - Assyrian/Babylonian/Persian sequences
   - Greek poleis and Macedon
   - Zhou/Warring States China
   - South Asia and emerging imperial formations
   - Mediterranean/Phoenician and trans-Asian trade

4. **Hellenistic–Roman–Han world, 323 BCE–300 CE**
   - Alexander and successor states
   - Roman expansion and provincial boundaries
   - Qin/Han, Maurya/post-Maurya, Kushan, Parthian/Sasanian transition
   - Silk Road and Indian Ocean exchange

5. **Late Antiquity–early medieval, 300–800 CE**
   - Roman transformations, Byzantium, Sasanian Persia
   - migration-period polities
   - Gupta/post-Gupta South Asia
   - Chinese dynastic transitions
   - early Islamic expansion

6. **Medieval connected world, 800–1500 CE**
   - Europe, Byzantium, Islamic polities, steppe systems
   - Tang/Song/Yuan/Ming transitions
   - South/Southeast Asia
   - African states and trade systems
   - pre-Columbian Americas
   - Mongol integration and fragmentation

7. **Early modern world, 1500–1800 CE**
   - Ottoman/Safavid/Mughal systems
   - Ming/Qing transitions
   - European state formation and overseas empires
   - American transformations after contact
   - Atlantic/Indian Ocean trade and slavery systems

8. **Industrial/imperial world, 1800–1914 CE**
   - industrialization, nationalism, colonial borders
   - Qing/Meiji/Ottoman reforms
   - African, Asian and American political continuity

9. **World wars / decolonization, 1914–1991 CE**
   - borders, alliances, wars, occupation zones, independence transitions
   - Cold War blocs without flattening non-aligned states

10. **Contemporary baseline, 1991–present**
   - internationally recognized borders plus explicit disputed territories
   - major conflicts/treaties and institutional changes
   - kept separate from speculative future chronology

### P1 — Geographic balance audit

Each era receives an explicit coverage audit for:

- Europe
- Middle East / North Africa
- Sub-Saharan Africa
- Central Asia / steppe
- South Asia
- East Asia
- Southeast Asia
- North America
- Central America / Caribbean
- South America
- Oceania / Pacific

A time slice is not considered complete solely because Europe, Rome, China or the Middle East are well covered.

### P2 — Densification

After continuity exists:

- more cities and secondary polities
- campaigns and battles
- ruler successions
- trade goods and route changes
- demographic/economic estimates
- institutional, scientific, religious and cultural developments

## Boundary policy

Territorial boundaries require special treatment because they will later trigger Continuum Agency intervention.

Every boundary record should eventually carry:

- valid date/range
- source map/dataset
- epistemic class
- confidence
- reconstruction method where applicable
- disputed/contested areas
- resolution/scale warning
- optional tolerance metadata for gameplay, derived later rather than stored as historical fact

Low-confidence reconstructed frontiers must permit more player variation than tightly documented borders.

## Source hierarchy

Preferred evidence order depends on claim type, but baseline review should generally distinguish:

1. primary textual / epigraphic / archival evidence
2. peer-reviewed archaeological publication
3. academic historical synthesis
4. institutional datasets / museum / university / UNESCO resources
5. scholarly historical maps and gazetteers
6. reputable reference works
7. candidate imported datasets

No single hierarchy mechanically decides truth; conflicts remain explicit and can be represented as disputed claims.

## Immediate import strategy

1. Preserve existing Chess Atlas archaeological records and game-history provenance.
2. Inventory Human History Simulator era seeds and historical GeoJSON snapshots.
3. Import only IDs, candidate claims and source pointers into a review queue — not directly into canonical data.
4. Validate each promoted record with `history-baseline.js`.
5. Add baseline records in chronological/regional batches.
6. Run continuity audits between adjacent time slices so disappearing/appearing states have explained transitions.
7. Only after baseline coverage is adequate, expose it to the cause/effect engine.

## Definition of baseline-complete v0.1

Baseline v0.1 is complete when:

- every P0 era has globally balanced coverage at the major-polity/event level;
- each canonical record has explicit provenance, epistemic class and confidence;
- major territorial transitions are represented with sourced boundaries or explicit gaps;
- major polity births, transformations and endings connect across adjacent slices;
- known disputes remain disputes rather than forced consensus;
- simulation data cannot mutate canonical records;
- a machine-readable gap report can identify missing regions/time spans/data classes;
- Chess Atlas, Diplomacy and Civilization can query the same time-indexed baseline.
