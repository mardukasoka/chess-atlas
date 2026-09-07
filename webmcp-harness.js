"use strict";

(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.ChessAtlasWebMcpHarness = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function modelContext(root) {
    root = root || (typeof globalThis !== "undefined" ? globalThis : {});
    return (root.document && root.document.modelContext) ||
      (root.navigator && root.navigator.modelContext) || null;
  }

  async function listTools(context) {
    if (!context) return [];
    if (typeof context.getTools === "function") return (await context.getTools()) || [];
    if (typeof context.listTools === "function") return (await context.listTools()) || [];
    return [];
  }

  function toolName(tool) {
    return tool && (tool.name || tool.toolName || tool.id) || "";
  }

  function isReadOnly(tool) {
    if (!tool) return false;
    if (tool.readOnly === true) return true;
    const a = tool.annotations || {};
    return a.readOnlyHint === true || a.readOnly === true;
  }

  async function executeTool(context, tool, input) {
    if (!context) throw new Error("WebMCP model context unavailable");
    if (tool && typeof tool.execute === "function") return tool.execute(input);
    const name = toolName(tool);
    if (!name) throw new Error("Tool has no name");
    if (typeof context.executeTool === "function") return context.executeTool(name, input);
    if (typeof context.callTool === "function") return context.callTool(name, input);
    throw new Error("WebMCP context cannot execute tools");
  }

  async function research(query, options) {
    options = options || {};
    const context = options.context || modelContext(options.root);
    const maxCalls = Math.max(1, Math.min(options.maxCalls || 4, 12));
    const tools = (options.tools || await listTools(context)).filter(isReadOnly);
    const select = options.selectTool || ((available) => available[0] || null);
    const results = [];

    for (let i = 0; i < maxCalls; i += 1) {
      const tool = await select(tools, { query, results, callIndex: i });
      if (!tool) break;
      const input = options.makeInput ?
        await options.makeInput(tool, { query, results, callIndex: i }) : { query };
      const output = await executeTool(context, tool, input);
      results.push({ tool: toolName(tool), input, output });
      if (options.stopWhen && await options.stopWhen(results)) break;
    }
    return { query, results };
  }

  function createHarness(options) {
    options = options || {};
    const researcher = options.researcher || research;
    const verify = options.verify || (async ({ research: r }) => ({ ok: true, evidence: r.results }));
    const plan = options.plan || (async ({ task, verification }) => ({ task, verification }));
    const act = options.act || null;

    return Object.freeze({
      async run(task, runOptions) {
        runOptions = runOptions || {};
        const researchResult = await researcher(task, runOptions.research);
        const verification = await verify({ task, research: researchResult });
        const proposal = await plan({ task, research: researchResult, verification });
        if (!runOptions.allowWrite || !act) {
          return { status: "proposal", research: researchResult, verification, proposal };
        }
        const action = await act({ task, research: researchResult, verification, proposal });
        return { status: "acted", research: researchResult, verification, proposal, action };
      }
    });
  }

  return Object.freeze({ modelContext, listTools, toolName, isReadOnly, executeTool, research, createHarness });
});
