# History Baseline v0.1 — Execution Tasking

## Mission

Build the shared evidence-backed historical substrate for Chess Atlas, Diplomacy, Civilization, and later 5D/Continuum gameplay.

No cause/effect simulation, timeline policing, or player divergence enforcement may be treated as authoritative history. Those systems consume this baseline only after it is sufficiently complete.

## Hard rules

1. **Facts are not simulations.** Simulator seeds are candidate imports only.
2. **Reconstruction stays labeled.** Archaeological/scholarly reconstruction is never silently upgraded to documented fact.
3. **Disputes stay visible.** Competing chronologies/boundaries may coexist as disputed records.
4. **No invented borders.** Where territorial extent is unknown, store a gap or uncertainty rather than a clean polygon.
5. **Global coverage is required.** No era is complete because Europe, Rome, China, or the Near East are detailed.
6. **Canonical records require provenance.** Every assertion needs source metadata and confidence rationale.
7. **Simulation cannot mutate canonical history.** Alternate history forks from a baseline node.
8. **Boundary confidence will later control divergence tolerance.** Gameplay tolerance is derived downstream, not embedded as historical fact.
9. **Spatial representation is part of completion.** Every in-scope empire, state/polity, documented culture, language group, and ethnicity must have a sourced time-indexed polygon/MultiPolygon or an explicit spatially-unresolved record.
10. **Culture, language, and ethnicity are not sovereignty.** Their geometry represents attested/reconstructed distributions or uncertainty envelopes, never administrative borders unless the subject is independently a polity.

## Workstream A — Baseline substrate

Status: **in progress**

Deliverables:

- [x] canonical record validator (`history-baseline.js`)
- [x] tests enforcing provenance and simulation separation
- [x] standard world-region coverage taxonomy
- [x] machine-readable era/region gap report
- [x] inventory and source/import policy
- [x] initial globally balanced prehistory/Neolithic anchor batch
- [x] historical polygon/MultiPolygon schema with coordinate-space declaration
- [x] spatial completeness auditor
- [x] zero-dependency history baseline self-check
- [x] continuity-link schema (predecessor/successor/transform/split/merge)
- [ ] claim-conflict schema for disputed dates/boundaries
- [ ] phase-specific historical boundary metadata extension
- [ ] combined query facade for all baseline batches
- [ ] independently researched language-group spatial layer
- [ ] independently researched ethnicity spatial layer

## Workstream B — Chronological completion batches

Each batch has four required passes:

**Pass 1 — spine:** globally important polities/sites/events/routes/technologies and sourced boundary anchors.

**Pass 2 — spatial:** representative polygons/MultiPolygons for every in-scope polity/culture plus explicit unresolved records where evidence cannot support geometry.

**Pass 3 — continuity:** verify transitions into the next batch and fill unexplained births, disappearances, splits, mergers and territorial shifts.

**Pass 4 — densification:** add phase-specific boundaries, language/ethnicity distributions, secondary polities, conflicts, routes and regional evidence without inventing precision.

### B1 — Deep prehistory / Neolithic (15,000–3500 BCE)

Status: **global spine + first spatial pass verified**

- [x] first anchor in every world coverage region
- [x] polygon representatives for existing culture records
- [ ] calibrated chronology review for approximate BP/"years ago" records
- [ ] migration/population-history anchors
- [ ] domestication/agriculture comparison across independent centres
- [ ] long-distance exchange networks
- [ ] regional densification without inventing polities
- [ ] final cross-source review and canonical promotion

### B2 — Early states / Bronze Age (3500–1200 BCE)

Status: **global spine + first spatial pass verified**

Required densification:

- Mesopotamian city-state and imperial transitions
- Egypt Early Dynastic → Old/Middle/New Kingdom transitions
- Anatolia/Hittite sphere
- Levantine and eastern Mediterranean systems
- Minoan/Mycenaean Aegean
- Indus/Harappan system
- Central Asian exchange networks
- Shang and earlier Chinese state formation where supportable
- Nubia/Kerma and wider African anchors
- Americas/Oceania/SE Asia contemporaneous developments
- tin/copper/bronze exchange routes with evidential confidence
- Amarna-era diplomacy where documented
- Bronze Age collapse: separate observations from causal hypotheses

### B3 — Iron Age / Axial world (1200–323 BCE)

Status: **global spine + first spatial pass verified**

First-pass anchors include Achaemenid Persia, Classical Athens, Napatan Kush, Scythian steppe horizons, Magadha, Eastern Zhou, Dong Son, Adena, Preclassic Maya, Chavín, and western-Pacific interaction. Densification remains required for Assyrian/Babylonian succession, Phoenician/Mediterranean networks, Greek poleis, Macedon, Warring States, South Asian formations, African states, American developments and steppe systems.

### B4 — Hellenistic / Roman / Han world (323 BCE–300 CE)

Status: **global spine + first spatial + continuity passes verified**

First-pass anchors include Roman imperial rule, Parthia, Meroitic Kush, Kushan, Maurya, Han, Sa Huynh, Hopewell, Maya Late Preclassic/Early Classic transition, early Moche and eastern-Pacific Polynesian settlement expansion. Continuity now includes successor kingdoms, Qin/Han phase changes and Parthia→Sasanian transition.

Required densification:

- Antigonid and additional successor-state phase boundaries
- Rome’s dated territorial expansion and provincial change rather than one timeless maximum polygon
- Maurya → post-Maurya regional states
- Kushan chronology and phase-specific extent
- Silk Road and Indian Ocean connection records
- Meroitic Kush phase changes and Roman-Egypt frontier interactions
- American city-state/regional-culture transitions
- Pacific settlement and exchange represented as island/network evidence, not ocean-spanning territory

### B5 — Late Antiquity / early medieval (300–800 CE)

Status: **global spine + first spatial + continuity passes verified**

Verified anchors include Byzantium, Sasanian Persia, Aksum, First Turkic Khaganate, Gupta, Sui/Tang, Funan/Chenla, Late Eastern Woodland, Classic Maya, Wari/Tiwanaku, western Polynesian development, and Rashidun→Umayyad→Abbasid transitions.

Required densification:

- migration-period European polities and successor states
- post-Gupta South Asian regional systems
- Chinese dynastic fragmentation between major reunifications
- Byzantine/Sasanian frontier phases
- Indian Ocean and Red Sea commercial networks
- East African coastal systems
- regional language and identity evidence where supportable

### B6 — Medieval connected world (800–1500 CE)

Status: **global spine + first spatial + continuity passes committed; execution verification pending**

First-pass anchors include medieval Byzantium, Holy Roman Empire, Abbasids, Great Zimbabwe, Mali, Mongol imperial/successor systems, Timurids, Chola, Song→Yuan→early Ming, Angkor, Mississippian cultures, Mayapan/K'iche' systems, Chimú→Inca transition and eastern-Polynesian migration/interaction.

Required densification:

- Abbasid fragmentation into regional dynasties and caliphates
- Seljuk, Ayyubid, Mamluk and Ottoman emergence
- West African Ghana→Mali→Songhai transitions
- Great Zimbabwe→Khami/Mutapa regional transitions
- Mongol successor khanates represented separately
- Song/Jin/Yuan/Ming phase-specific boundaries
- Delhi Sultanate and regional South Asian polities
- Srivijaya/Angkor/Bagan/Majapahit/Ayutthaya/Lan Xang relationships
- Mississippian, Puebloan, Hohokam, Thule and language-group evidence
- Mayapan, K'iche', Mexica and other Mesoamerican state systems
- Chimú and Inca represented as distinct dated phases
- Polynesian settlement at archipelago scale

### B7 — Early modern world (1500–1800 CE)

Status: queued

Ottoman/Safavid/Mughal; Ming/Qing; European state formation; colonial systems; Atlantic and Indian Ocean networks; slavery systems; Indigenous American and Pacific transformations.

### B8 — Industrial / imperial world (1800–1914 CE)

Status: queued

Industrialization; nationalism; imperial/colonial borders; abolition and forced-labour transitions; Qing/Meiji/Ottoman reforms; global conflict/diplomacy/economic anchors.

### B9 — World wars / decolonization (1914–1991 CE)

Status: queued

Wars, occupations, border settlements, independence transitions, Cold War blocs and non-aligned states; explicit distinction between de facto and internationally recognized control.

### B10 — Contemporary baseline (1991–present)

Status: queued

Internationally recognized borders, disputed territories, major treaties/conflicts/institutions. No speculative future records.

## Workstream C — Historical consistency validation

Begins once B2 has a first-pass spine; expands with every batch.

Checks:

- chronology overlap/contradiction
- ruler lifetime/reign consistency
- polity existence at event date
- city/settlement existence at event date
- technology availability/anachronism
- conflict belligerent consistency
- treaty participant consistency
- border/polity consistency
- predecessor/successor continuity
- source conflicts and unsupported precision
- map resolution and boundary uncertainty
- spatial subject completeness
- culture/language/ethnicity geometry semantics
- dateline and multipart-geometry correctness

Output is a finding/proposal, never an automatic canonical rewrite.

## Workstream D — Cause/effect layer

**Threshold reached once B6 execution verification is clean.** Formal implementation may begin in parallel with continued history densification, but it must remain downstream of the evidence-backed baseline and consistency checks.

Typed relations must distinguish:

- direct cause
- contributing condition
- trigger
- enabling condition
- constraint
- consequence
- correlation
- disputed interpretation

The Human History Simulator may supply architecture and candidate mechanisms only after baseline separation is maintained.

## Workstream E — Timeline / Continuum Agency research

**Blocked from implementation, research may begin after baseline spine is stable.**

Build a source corpus across science fiction, literature, television, film and games. Known starting examples include Star Trek, Continuum and Rick and Morty, but the survey must be broad rather than copying one franchise model.

For each fictional agency record:

- universe / work
- creator and publication/broadcast chronology
- fictional setting chronology
- canonical agency name
- mandate and authority
- intervention threshold
- methods/technology
- paradox/branch model
- correction policy
- attitude to alternate timelines
- ethics and failure modes
- notable cases/stories
- primary episode/book/game sources where available

These records feed both the science-fiction publication timeline and fictional-setting timeline before any Atlas-native policing agent is designed.

## Workstream F — Continuum gameplay

Blocked until D and E.

Sequence:

baseline state → player action → divergence measurement → cause/effect constraints → Continuum case → voluntary correction OR contest → game outcome → alternate branch if successfully defended.

Advanced Infinite Board + Quantum + 4D tesseract + 5D integration remains a separate task. It must be playable in the current/"now" region without requiring timeline mechanics until divergence triggers them.

## Completion gate for History Baseline v0.1

Do not declare baseline complete until:

- every era has meaningful coverage in all 11 world regions or an explicit evidence gap;
- major polity/event chains have continuity links;
- major boundaries have source/confidence metadata;
- every empire/state/polity, documented culture, language group and ethnicity is spatially represented or explicitly unresolved;
- culture/language/ethnicity distributions are not encoded as sovereign borders;
- every canonical record passes the validator;
- approximate chronology is not silently represented as exact;
- imported simulator material is independently sourced before promotion;
- disputed claims remain queryable as disputes;
- the gap report shows no unexplained high-priority holes;
- baseline queries can feed games, Diplomacy and Civilization without using simulator-owned truth.
