# Chess Atlas — Upstream Integration Architecture

## Purpose

Chess Atlas uses external open-source projects as references, dependencies,
and selectively adapted components.

The integration principle is:

**reference → adapter → selective integration**

An upstream project being registered by Chess Atlas does not mean its source
code has been copied into this repository.

The canonical registry is:

`references/upstream.json`

## Integration policy

Each upstream project should first be studied as an independent system.

Chess Atlas should then expose only the capabilities it needs through an
Atlas-owned adapter.

Code should be copied or modified only when a direct dependency or adapter
cannot provide the required functionality.

This keeps the Atlas architecture independent from the implementation details
of any single upstream project.

## Provenance

Every integration must preserve:

- upstream project name
- original repository URL
- upstream version or commit when pinned
- licence
- Atlas integration strategy
- whether upstream code has been modified
- attribution required by the upstream licence

The upstream registry must be updated whenever an external project becomes a
real dependency.

## Current upstream projects

### Infinite Chess

Repository:

https://github.com/Infinite-Chess/infinitechess.org

Atlas role:

Reference for infinite spatial boards, board navigation, rendering, coordinate
systems, and interaction on an effectively unbounded chess surface.

Initial integration status:

Reference only.

### 5D Chess Designer

Repository:

https://github.com/adri326/5dchess-designer

Atlas role:

Reference for multidimensional chess, branching timelines, alternate board
states, and representation of moves across time.

Initial integration status:

Reference only.

### Karpathy LLM Council

Repository:

https://github.com/karpathy/llm-council

Atlas role:

Reference architecture for independent model responses, peer comparison,
deliberation, and chairman synthesis.

Initial integration status:

Reference and possible selective adaptation.

### Galaxy of Nuclides

Repository:

https://github.com/Frencil/galaxy_of_nuclides

Atlas role:

Reference for transitions between different structured maps — specifically
periodic-table, element, isotope, and nuclide views — using interactive
visualisation.

This is especially relevant to the Atlas principle that one knowledge space
should be able to transform continuously into another rather than appearing
as disconnected diagrams.

Initial integration status:

Reference and possible selective adaptation.

### WorldDynamics.jl

Repository:

https://github.com/worlddynamics/WorldDynamics.jl

Atlas role:

Executable quantitative modelling framework for integrated assessment,
Earth-system, civilisation, and system-dynamics models.

Initial integration status:

Candidate Julia dependency with an Atlas adapter.

## Atlas epistemic boundary

External software must fit within the Atlas epistemic architecture:

Reality
→ Observation
→ Knowledge Graph
→ Julia
→ AI Council
→ Inform7
→ Interface

The layers must remain distinguishable.

**Facts are not simulations. Simulations are not judgments. Judgments are not
laws. Laws are not interfaces.**

An upstream visualisation is therefore not automatically an authoritative
dataset.

A simulation is not an observation.

An AI synthesis is not a physical model.

An interface representation is not the underlying knowledge itself.

## Adapter principle

Adapters belong in:

`adapters/`

An adapter should provide a narrow interface between Chess Atlas and an
external project.

Adapters should avoid exposing upstream implementation details throughout the
rest of the Atlas codebase.

For example:

```text
Atlas
  |
  +-- adapters/infinite-chess/
  |       |
  |       +-- Infinite Chess
  |
  +-- adapters/five-d-chess/
  |       |
  |       +-- 5D Chess
  |
  +-- adapters/llm-council/
  |       |
  |       +-- LLM Council
  |
  +-- adapters/galaxy-nuclides/
  |       |
  |       +-- Galaxy of Nuclides
  |
  +-- adapters/worlddynamics/
          |
          +-- WorldDynamics.jl