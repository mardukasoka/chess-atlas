"use strict";

require("./history-early-modern-selfcheck.js");

const Baseline=require("./history-baseline.js");
const Spatial=require("./history-spatial.js");
const SpatialCoverage=require("./history-spatial-coverage.js");
const Continuity=require("./history-continuity.js");
const Coverage=require("./history-baseline-coverage.js");
const B7=require("./history-baseline-early-modern.js");
const B8=require("./history-baseline-industrial.js");
const B8Knowledge=require("./history-baseline-industrial-knowledge.js");
const B8Spatial=require("./history-spatial-industrial.js");
const B8Continuity=require("./history-continuity-industrial.js");

let failures=0;
function fail(message){failures+=1;console.error(`FAIL: ${message}`);}
function pass(message){console.log(`PASS: ${message}`);}

function validateBatch(name,batch){
  const errors=[];
  for(const record of batch.records){
    const result=Baseline.validateBaselineRecord(record);
    if(!result.ok) errors.push(`${record.id}: ${result.errors.join(" | ")}`);
  }
  if(errors.length) errors.forEach(error=>fail(`${name} ${error}`));
  else pass(`${name} records (${batch.records.length})`);
}

validateBatch("B8 industrial-imperial baseline",B8);
validateBatch("B8 science/technology",B8Knowledge);

const spatialErrors=[];
for(const record of B8Spatial.records){
  const result=Spatial.validatePolygonRecord(record);
  if(!result.ok) spatialErrors.push(`${record.id}: ${result.errors.join(" | ")}`);
}
if(spatialErrors.length) spatialErrors.forEach(error=>fail(`B8 spatial ${error}`));
else pass(`B8 spatial records (${B8Spatial.records.length})`);

const required=B8.records.filter(record=>record.type==="culture"||record.type==="polity");
const spatialBySubject=new Map(B8Spatial.records.map(record=>[record.subjectId,record]));
const subjects=required.map(record=>({id:record.id,kind:spatialBySubject.get(record.id)?.subjectKind||(record.type==="culture"?"culture":"polity")}));
const report=SpatialCoverage.spatialCoverageReport(subjects,B8Spatial.records);
if(!report.complete) fail(`B8 spatial completeness: missing=${JSON.stringify(report.missing)} invalid=${JSON.stringify(report.invalidPolygons)}`);
else pass(`B8 spatial completeness (${report.represented}/${report.totalSubjects} represented)`);

const regionSet=new Set(B8.records.flatMap(record=>record.coverageRegions||[]));
const missingRegions=Coverage.REGIONS.filter(id=>!regionSet.has(id));
if(missingRegions.length) fail(`B8 global coverage missing regions: ${missingRegions.join(",")}`);
else pass("B8 first-pass political spine covers all standard world regions");

const relationErrors=[];
for(const relation of B8Continuity.relations){
  const result=Continuity.validateContinuityRelation(relation);
  if(!result.ok) relationErrors.push(`${relation.id}: ${result.errors.join(" | ")}`);
}
if(relationErrors.length) relationErrors.forEach(error=>fail(`B8 continuity ${error}`));
else pass(`B8 continuity relations (${B8Continuity.relations.length})`);

const knownIds=new Set([...B7.records,...B8.records].map(record=>record.id));
const dangling=Continuity.danglingRelations(B8Continuity.relations,knownIds);
if(dangling.length) fail(`B8 dangling continuity subjects: ${JSON.stringify(dangling)}`);
else pass("B8 continuity subject references");

const requiredKnowledgeIds=[
  "event-industrial-revolution-b8",
  "technology-railway-telegraph-b8",
  "event-darwin-origin-1859",
  "event-germ-theory-b8",
  "technology-electric-power-b8",
  "technology-telephone-b8",
  "technology-automobile-b8",
  "technology-powered-flight-1903",
  "event-modern-physics-1895-1911"
];
const missingKnowledge=requiredKnowledgeIds.filter(id=>!B8Knowledge.get(id));
if(missingKnowledge.length) fail(`B8 missing science/technology anchors: ${missingKnowledge.join(",")}`);
else pass("B8 science/technology milestone set present");

const hawaii=B8Spatial.get("polity-hawaiian-kingdom-b8");
if(!hawaii||hawaii.geometryType!=="MultiPolygon") fail("Hawaiian Kingdom must remain multipart archipelago geometry");
else pass("B8 Hawaiian Kingdom preserves archipelago geometry");

if(failures){
  console.error(`\nIndustrial history self-check failed: ${failures} issue(s).`);
  process.exitCode=1;
}else{
  console.log("\nIndustrial history self-check passed.");
}
