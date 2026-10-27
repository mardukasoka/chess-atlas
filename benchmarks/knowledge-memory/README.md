# Indigo Knowledge Memory Benchmark — Preflight

Status: preparation only; no benchmark runs or accuracy claims.

## Candidates
- Cognee: CPU small-model and local embedding options; first integration candidate.
- LightRAG: graph-enhanced retrieval comparator.
- Graphiti: temporal graph and provenance comparator; graph backend required.
- Letta: the fork's README points to current source at letta-ai/letta-code; audit current source before testing.

## Initial dataset
Use a small public, version-pinned sample of nuclides/exotic atoms from existing Indigo repositories. Do not copy private ClickUp or customer data.

## Tests
1. Ingest same source snapshots; report coverage and errors.
2. Ask same factual, relational, temporal, and unanswerable questions.
3. Score exactness, source attribution, abstention, update/correction handling, persistence, runtime, and cost.
4. Separate mock-based integration tests from real-model accuracy tests.

## GitHub Actions safety gates
- Manual workflow dispatch initially; no schedules or always-on services.
- Set explicit job timeout, minimal read permissions, and concurrency cancellation.
- No paid APIs or hosted inference without approval.
- Pin dependencies and third-party actions; review licenses/security before installing.
- Do not publish secrets, private content, or full raw logs.
- Store only sanitized reports as artifacts; static dashboard only after validation.

## Next steps
1. Identify exact public dataset paths and freeze source commit SHAs.
2. Check each candidate's current installation docs, model options, storage, and license.
3. Implement a bounded Cognee smoke test and a no-model baseline.
4. Run workflow and inspect actual output before claiming success.
