"use strict";

require("./history-industrial-selfcheck.js");

const Baseline=require("./history-baseline.js");
const Spatial=require("./history-spatial.js");
const SpatialCoverage=require("./history-spatial-coverage.js");
const Continuity=require("./history-continuity.js");
const Coverage=require("./history-baseline-coverage.js");
const B8=require("./history-baseline-industrial.js");
const B9=require("./history-baseline-modern.js");
const B9Knowledge=require("./history-baseline-modern-knowledge.js");
const B9Spatial=require("./history-spatial-modern.js");
const B9Continuity=require("./history-continuity-modern.js");

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

validateBatch("B9 world-wars/decolonization baseline",B9);
validateBatch("B9 science/world-system",B9Knowledge);

const spatialErrors=[];
for(const record of B9Spatial.records){
  const result=Spatial.validatePolygonRecord(record);
  if(!result.ok) spatialErrors.push(`${record.id}: ${result.errors.join(" | ")}`);
}
if(spatialErrors.length) spatialErrors.forEach(error=>fail(`B9 spatial ${error}`));
else pass(`B9 spatial records (${B9Spatial.records.length})`);

const required=B9.records.filter(record=>record.type==="culture"||record.type==="polity");
const spatialBySubject=new Map(B9Spatial.records.map(record=>[record.subjectId,record]));
const subjects=required.map(record=>({id:record.id,kind:spatialBySubject.get(record.id)?.subjectKind||(record.type==="culture"?"culture":"polity")}));
const report=SpatialCoverage.spatialCoverageReport(subjects,B9Spatial.records);
if(!report.complete) fail(`B9 spatial completeness: missing=${JSON.stringify(report.missing)} invalid=${JSON.stringify(report.invalidPolygons)}`);
else pass(`B9 spatial completeness (${report.represented}/${report.totalSubjects} represented)`);

const regionSet=new Set(B9.records.flatMap(record=>record.coverageRegions||[]));
const missingRegions=Coverage.REGIONS.filter(id=>!regionSet.has(id));
if(missingRegions.length) fail(`B9 global coverage missing regions: ${missingRegions.join(",")}`);
else pass("B9 first-pass political spine covers all standard world regions");

const relationErrors=[];
for(const relation of B9Continuity.relations){
  const result=Continuity.validateContinuityRelation(relation);
  if(!result.ok) relationErrors.push(`${relation.id}: ${result.errors.join(" | ")}`);
}
if(relationErrors.length) relationErrors.forEach(error=>fail(`B9 continuity ${error}`));
else pass(`B9 continuity relations (${B9Continuity.relations.length})`);

const knownIds=new Set([...B8.records,...B9.records].map(record=>record.id));
const dangling=Continuity.danglingRelations(B9Continuity.relations,knownIds);
if(dangling.length) fail(`B9 dangling continuity subjects: ${JSON.stringify(dangling)}`);
else pass("B9 continuity subject references");

const requiredKnowledgeIds=[
  "event-world-war-i-b9",
  "event-world-war-ii-b9",
  "institution-united-nations-1945",
  "event-decolonization-b9",
  "technology-nuclear-weapons-1945",
  "technology-electronic-computing-b9",
  "event-dna-double-helix-1953",
  "technology-spaceflight-b9",
  "institution-human-rights-1948",
  "technology-internet-origins-b9"
];
const missingKnowledge=requiredKnowledgeIds.filter(id=>!B9Knowledge.get(id));
if(missingKnowledge.length) fail(`B9 missing science/world-system anchors: ${missingKnowledge.join(",")}`);
else pass("B9 science/world-system milestone set present");

const west=B9Spatial.get("polity-west-germany-b9");
const east=B9Spatial.get("polity-east-germany-b9");
if(!west||!east||west.subjectId===east.subjectId) fail("B9 German partition must remain represented as separate FRG/GDR spatial subjects");
else pass("B9 German partition remains spatially distinct");

const indonesia=B9Spatial.get("polity-indonesia-b9");
if(!indonesia||indonesia.geometryType!=="MultiPolygon") fail("B9 Indonesia must remain multipart archipelago geometry");
else pass("B9 Indonesia preserves archipelago geometry");

const japan=B9Spatial.get("polity-japan-b9");
if(!japan||japan.geometryMeaning!=="core-area") fail("B9 Japan spatial record must remain home-island core rather than wartime occupation territory");
else pass("B9 Japan excludes wartime occupation from persistent sovereign core");

if(failures){
  console.error(`\nModern history self-check failed: ${failures} issue(s).`);
  process.exitCode=1;
}else{
  console.log("\nModern history self-check passed.");
}
