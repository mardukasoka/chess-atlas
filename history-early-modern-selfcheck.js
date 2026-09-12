"use strict";

require("./history-branch-adjudication-selfcheck.js");

const Baseline=require("./history-baseline.js");
const Spatial=require("./history-spatial.js");
const SpatialCoverage=require("./history-spatial-coverage.js");
const Continuity=require("./history-continuity.js");
const Coverage=require("./history-baseline-coverage.js");
const B6=require("./history-baseline-medieval.js");
const B7=require("./history-baseline-early-modern.js");
const B7Spatial=require("./history-spatial-early-modern.js");
const B7Continuity=require("./history-continuity-early-modern.js");

let failures=0;
function fail(message){failures+=1;console.error(`FAIL: ${message}`);}
function pass(message){console.log(`PASS: ${message}`);}

const baselineErrors=[];
for(const record of B7.records){
  const result=Baseline.validateBaselineRecord(record);
  if(!result.ok) baselineErrors.push(`${record.id}: ${result.errors.join(" | ")}`);
}
if(baselineErrors.length) baselineErrors.forEach(error=>fail(`B7 baseline ${error}`));
else pass(`B7 early-modern baseline records (${B7.records.length})`);

const spatialErrors=[];
for(const record of B7Spatial.records){
  const result=Spatial.validatePolygonRecord(record);
  if(!result.ok) spatialErrors.push(`${record.id}: ${result.errors.join(" | ")}`);
}
if(spatialErrors.length) spatialErrors.forEach(error=>fail(`B7 spatial ${error}`));
else pass(`B7 early-modern spatial records (${B7Spatial.records.length})`);

const required=B7.records.filter(record=>record.type==="culture"||record.type==="polity");
const spatialBySubject=new Map(B7Spatial.records.map(record=>[record.subjectId,record]));
const subjects=required.map(record=>({id:record.id,kind:spatialBySubject.get(record.id)?.subjectKind||(record.type==="culture"?"culture":"polity")}));
const spatialReport=SpatialCoverage.spatialCoverageReport(subjects,B7Spatial.records);
if(!spatialReport.complete) fail(`B7 spatial completeness: missing=${JSON.stringify(spatialReport.missing)} invalid=${JSON.stringify(spatialReport.invalidPolygons)}`);
else pass(`B7 spatial completeness (${spatialReport.represented}/${spatialReport.totalSubjects} represented)`);

const regionSet=new Set(B7.records.flatMap(record=>record.coverageRegions||[]));
const missingRegions=Coverage.WORLD_REGIONS.map(region=>region.id).filter(id=>!regionSet.has(id));
if(missingRegions.length) fail(`B7 global coverage missing regions: ${missingRegions.join(",")}`);
else pass("B7 first-pass spine covers all standard world regions");

const relationErrors=[];
for(const relation of B7Continuity.relations){
  const result=Continuity.validateContinuityRelation(relation);
  if(!result.ok) relationErrors.push(`${relation.id}: ${result.errors.join(" | ")}`);
}
if(relationErrors.length) relationErrors.forEach(error=>fail(`B7 continuity ${error}`));
else pass(`B7 continuity relations (${B7Continuity.relations.length})`);

const knownIds=new Set([...B6.records,...B7.records].map(record=>record.id));
const dangling=Continuity.danglingRelations(B7Continuity.relations,knownIds);
if(dangling.length) fail(`B7 dangling continuity subjects: ${JSON.stringify(dangling)}`);
else pass("B7 continuity subject references");

const polynesia=B7Spatial.get("culture-classical-polynesian-b7");
if(!polynesia||polynesia.geometryType!=="MultiPolygon") fail("B7 Polynesian cultural distribution must remain multipart");
else {
  const spansDateline=polynesia.geometry.some(ring=>{
    const xs=ring.map(point=>point[0]);
    return Math.max(...xs)-Math.min(...xs)>30;
  });
  if(spansDateline) fail("B7 Polynesian cultural polygon contains an ocean-spanning/dateline ring");
  else pass("B7 Polynesian distribution preserves separate archipelago envelopes");
}

if(failures){
  console.error(`\nEarly-modern history self-check failed: ${failures} issue(s).`);
  process.exitCode=1;
}else{
  console.log("\nEarly-modern history self-check passed.");
}
