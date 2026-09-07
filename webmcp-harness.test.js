"use strict";

const assert = require("assert");
const Harness = require("./webmcp-harness.js");

test("research uses only read-only tools and stays bounded", async () => {
  const calls = [];
  const readTool = { name: "search", annotations: { readOnlyHint: true } };
  const writeTool = { name: "delete", annotations: { readOnlyHint: false } };
  const context = {
    async getTools() { return [writeTool, readTool]; },
    async executeTool(name, input) {
      calls.push({ name, input });
      return { ok: true, n: calls.length };
    }
  };

  const result = await Harness.research("Natufian chronology", {
    context,
    maxCalls: 2
  });

  assert.strictEqual(result.results.length, 2);
  assert.deepStrictEqual(calls.map(c => c.name), ["search", "search"]);
});

test("harness proposes by default and writes only when explicitly allowed", async () => {
  let writes = 0;
  const harness = Harness.createHarness({
    researcher: async task => ({ query: task, results: [{ tool: "search", output: "evidence" }] }),
    verify: async ({ research }) => ({ ok: research.results.length === 1 }),
    plan: async ({ task }) => ({ next: `implement ${task}` }),
    act: async ({ proposal }) => { writes += 1; return proposal; }
  });

  const dry = await harness.run("Makruk rules");
  assert.strictEqual(dry.status, "proposal");
  assert.strictEqual(writes, 0);

  const live = await harness.run("Makruk rules", { allowWrite: true });
  assert.strictEqual(live.status, "acted");
  assert.strictEqual(writes, 1);
});

test("modelContext prefers document API and supports navigator fallback", () => {
  const documentContext = {};
  const navigatorContext = {};
  assert.strictEqual(Harness.modelContext({ document: { modelContext: documentContext }, navigator: { modelContext: navigatorContext } }), documentContext);
  assert.strictEqual(Harness.modelContext({ navigator: { modelContext: navigatorContext } }), navigatorContext);
});
