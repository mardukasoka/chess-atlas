"use strict";

(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.ChessAtlasTimeState = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const NODE_PARAM = "atlasNode";
  const MODE_PARAM = "atlasMode";

  function read(search) {
    const params = new URLSearchParams(search || "");
    return {
      nodeId: params.get(NODE_PARAM) || null,
      mode: params.get(MODE_PARAM) || null
    };
  }

  function addToRoute(route, state = {}) {
    const [path, hash = ""] = String(route || "").split("#", 2);
    const [base, query = ""] = path.split("?", 2);
    const params = new URLSearchParams(query);
    if (state.nodeId) params.set(NODE_PARAM, state.nodeId);
    if (state.mode) params.set(MODE_PARAM, state.mode);
    const queryText = params.toString();
    return `${base}${queryText ? `?${queryText}` : ""}${hash ? `#${hash}` : ""}`;
  }

  function atlasUrl(state = {}) {
    return addToRoute("index.html", state);
  }

  function validMode(mode) {
    return ["games", "chess", "civilisation", "diplomacy"].includes(mode);
  }

  return Object.freeze({ read, addToRoute, atlasUrl, validMode, NODE_PARAM, MODE_PARAM });
});
