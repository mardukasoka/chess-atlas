# Indigo knowledge-memory comparison — evaluation gate v1

This gate separates operational success from scientific accuracy.

## Current evidence
- Cognee: successful CPU-only ingestion/retrieval smoke; inspect per-question output before claiming answer accuracy.
- LightRAG: storage initialization/finalization only; **not** yet a retrieval benchmark.
- Shared fixture: `fixtures/isotopes-v1.json` contains four individually identified synthetic source statements and four questions (three answerable, one intentionally unsupported).

## Required parity test
1. Ingest the **same four individually identified documents** into each engine; retain their source IDs.
2. Retrieve for each of the four questions. Record raw retrieved passages and source IDs; do not substitute keyword matches for generated answers.
3. For answerable questions, score factual correctness separately from source attribution. A correct token in a long passage is not a correct generated answer.
4. For q4 (helium-4 half-life), require an explicit unsupported/unknown response based **only on supplied fixture evidence**. Do not grade external-world scientific knowledge as fixture evidence.
5. Reinitialize each engine and verify the same sources remain retrievable from persisted storage.
6. Record elapsed time, peak memory, package versions, model name, CPU-only inference, and any paid API usage.

## Guardrails
- GitHub Actions only, bounded run duration, no credentials, no external inference APIs.
- The fixture is synthetic and **not** a verified nuclide source of record.
- A mock embedding or mock LLM may verify integration plumbing, but cannot establish semantic retrieval quality.
- Mark missing capabilities `not_tested`, never `passed`.
- Keep changes on `indigo/knowledge-memory-benchmark`; do not merge or deploy without review.

## Next implementation
Implement a bounded CPU-only local embedding + extraction setup for LightRAG, then run the four-question parity test. If the runner cannot support it within the limit, report a resource blocker rather than replacing the test with a storage smoke.
