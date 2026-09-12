"use strict";
const Identity=require("./history-identity-subjects.js");

const unresolved=Object.freeze(Identity.subjects.map(subject=>Object.freeze({
  id:subject.id,
  kind:subject.kind,
  spatialStatus:"unresolved",
  reason:subject.kind==="language-group"
    ? "A defensible language distribution requires sourced, time-indexed linguistic geography. State borders and broad family extents are not acceptable proxies."
    : "A defensible ethnicity distribution requires sourced, time-indexed settlement/identity evidence with explicit overlap and mobility. State borders and language areas are not acceptable proxies.",
  spatialCaveat:subject.spatialCaveat,
  sources:subject.sources
})));

function all(){return [...unresolved];}
function get(id){return unresolved.find(record=>record.id===id)||null;}
module.exports=Object.freeze({unresolved,all,get});
