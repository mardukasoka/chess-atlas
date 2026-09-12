"use strict";
const B7=require("./history-baseline-early-modern.js");
const B8=require("./history-baseline-industrial.js");
function source(batch,id){const r=batch.get(id);return Object.freeze(r.sources.map(s=>Object.freeze({label:s.label,url:s.url})));}
const relations=Object.freeze([
Object.freeze({id:"continuity-ottoman-b7-b8",type:"territorial-phase",from:Object.freeze(["polity-ottoman-empire-b7"]),to:Object.freeze(["polity-ottoman-empire-b8"]),year:1800,epistemicClass:"documented",confidence:0.99,rationale:"The Ottoman polity crosses the B7/B8 batching boundary; this is an Atlas phase boundary, not a refoundation.",sources:source(B8,"polity-ottoman-empire-b8")}),
Object.freeze({id:"continuity-qing-b7-b8",type:"territorial-phase",from:Object.freeze(["polity-qing-dynasty-b7"]),to:Object.freeze(["polity-qing-dynasty-b8"]),year:1800,epistemicClass:"documented",confidence:0.99,rationale:"The Qing polity crosses the B7/B8 batching boundary; later nineteenth-century crises and reforms are internal to the phase until the 1911–12 dynastic end.",sources:source(B8,"polity-qing-dynasty-b8")}),
Object.freeze({id:"continuity-new-spain-mexico",type:"political-reunification",from:Object.freeze(["polity-viceroyalty-new-spain-b7"]),to:Object.freeze(["polity-mexico-b8"]),year:1821,epistemicClass:"documented",confidence:0.96,rationale:"Mexican independence in 1821 ends Spanish viceregal rule in the core territory and creates a new sovereign polity; the relation does not imply all former New Spain territory became modern Mexico unchanged.",sources:source(B8,"polity-mexico-b8")}),
Object.freeze({id:"continuity-hre-german-unification",type:"political-reunification",from:Object.freeze(["polity-holy-roman-empire-b7"]),to:Object.freeze(["polity-german-empire-b8"]),year:1871,epistemicClass:"scholarly-reconstruction",confidence:0.86,rationale:"The Holy Roman Empire dissolves in 1806; German unification follows through later confederations, wars and state restructuring. This relation marks long-run political reconfiguration and explicitly not direct immediate succession.",sources:source(B8,"polity-german-empire-b8")})
]);
function all(){return [...relations];}
module.exports=Object.freeze({relations,all});
