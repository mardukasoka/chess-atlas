# Chess Atlas agent harness

The harness is deliberately browser-first and dependency-free.

## Flow

`task -> read-only research -> verification -> proposal -> optional action`

Research may discover page tools from the WebMCP model-context API. It prefers `document.modelContext` and retains the older `navigator.modelContext` path as a compatibility fallback.

## Safety contract

- Auto-research is read-only by default.
- Only tools explicitly annotated as read-only are eligible for autonomous research.
- Research calls are bounded (`maxCalls`, hard cap 12).
- The harness returns a proposal by default.
- Side effects require both an `act` implementation and `allowWrite: true` for that run.
- The Atlas remains authoritative for game legality, historical provenance, and repository state.

## Intended roles

The same contract can host small local models, remote Council members, browser agents, or MCP/WebMCP tools without coupling the Atlas to one provider.

Typical pipeline:

1. Researcher gathers sources/resources.
2. Verifier checks evidence and contradictions.
3. Planner produces a bounded change proposal.
4. Implementer acts only after the caller explicitly enables writes.
5. Tests/CI remain the final gate for code changes.

This is infrastructure, not a claim that every browser currently exposes the same WebMCP surface. Adapters should feature-detect the available model-context API and degrade to no tools rather than fail the page.
