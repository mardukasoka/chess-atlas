"use strict";

require("./history-modern-selfcheck.js");

const Baseline=require("./history-baseline.js");
const Spatial=require("./history-spatial.js");
const SpatialCoverage=require("./history-spatial-coverage.js");
const Continuity=require("./history-continuity.js");
const Coverage=require("./history-baseline-coverage.js");
const B9=require("./history-baseline-modern.js");
const B10=require("./history-baseline-contemporary.js");
const B10Knowledge=require("./history-baseline-contemporary-knowledge.js");
const B10Spatial=require("./history-spatial-contemporary.js");
const B10Continuity=require("./history-continuity-contemporary.js");

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

validateBatch("B10 contemporary baseline",B10);
validateBatch("B10 knowledge/technology",B10Knowledge);

const spatialErrors=[];
for(const record of B10Spatial.records){
  const result=Spatial.validatePolygonRecord(record);
  if(!result.ok) spatialErrors.push(`${record.id}: ${result.errors.join(" | ")}`);
}
if(spatialErrors.length) spatialErrors.forEach(error=>fail(`B10 spatial ${error}`));
else pass(`B10 spatial records (${B10Spatial.records.length})`);

const required=B10.records.filter(record=>record.type==="culture"||record.type==="polity");
const spatialBySubject=new Map(B10Spatial.records.map(record=>[record.subjectId,record]));
const subjects=required.map(record=>({id:record.id,kind:spatialBySubject.get(record.id)?.subjectKind||(record.type==="culture"?"culture":"polity")}));
const report=SpatialCoverage.spatialCoverageReport(subjects,B10Spatial.records);
if(!report.complete) fail(`B10 spatial completeness: missing=${JSON.stringify(report.missing)} invalid=${JSON.stringify(report.invalidPolygons)}`);
else pass(`B10 spatial completeness (${report.represented}/${report.totalSubjects} represented)`);

const regionSet=new Set(B10.records.flatMap(record=>record.coverageRegions||[]));
const missingRegions=Coverage.REGIONS.filter(id=>!regionSet.has(id));
if(missingRegions.length) fail(`B10 global coverage missing regions: ${missingRegions.join(",")}`);
else pass("B10 first-pass political spine covers all standard world regions");

const relationErrors=[];
for(const relation of B10Continuity.relations){
  const result=Continuity.validateContinuityRelation(relation);
  if(!result.ok) relationErrors.push(`${relation.id}: ${result.errors.join(" | ")}`);
}
if(relationErrors.length) relationErrors.forEach(error=>fail(`B10 continuity ${error}`));
else pass(`B10 continuity relations (${B10Continuity.relations.length})`);

const knownIds=new Set([...B9.records,...B10.records].map(record=>record.id));
const dangling=Continuity.danglingRelations(B10Continuity.relations,knownIds);
if(dangling.length) fail(`B10 dangling continuity subjects: ${JSON.stringify(dangling)}`);
else pass("B10 continuity subject references");

const requiredKnowledgeIds=[
  "institution-european-union-b10",
  "institution-nato-enlargement-b10",
  "technology-world-wide-web-b10",
  "event-human-genome-project-2003",
  "technology-smartphone-platform-b10",
  "technology-crispr-gene-editing-b10",
  "technology-mrna-vaccines-b10",
  "event-ai-deep-learning-generative-b10",
  "technology-commercial-space-b10"
];
const missingKnowledge=requiredKnowledgeIds.filter(id=>!B10Knowledge.get(id));
if(missingKnowledge.length) fail(`B10 missing knowledge/technology anchors: ${missingKnowledge.join(",")}`);
else pass("B10 knowledge/technology milestone set present");

const reunification=B10Continuity.relations.find(r=>r.id==="continuity-german-reunification-b10");
if(!reunification||reunification.type!=="political-reunification"||reunification.from.length!==2||!reunification.from.includes("polity-west-germany-b9")||!reunification.from.includes("polity-east-germany-b9")) {
  fail("German reunification must preserve both FRG and GDR predecessor states");
} else pass("B10 German reunification preserves both predecessor states");

const indonesia=B10Spatial.get("polity-indonesia-b10");
if(!indonesia||indonesia.geometryType!=="MultiPolygon") fail("Contemporary Indonesia must remain multipart archipelago geometry");
else pass("B10 Indonesia preserves archipelago geometry");

const unitedStates=B10Spatial.get("polity-united-states-b10");
if(!unitedStates||unitedStates.geometryType!=="MultiPolygon") fail("Contemporary United States must keep Alaska/Hawaiʻi separate from contiguous geometry");
else pass("B10 United States preserves multipart geography");

for(const subjectId of ["polity-russian-federation-b10","polity-india-b10","polity-prc-b10","polity-japan-b10"]){
  const item=B10Spatial.get(subjectId);
  if(!item||typeof item.reconstructionMethod!=="string"||!/disput/i.test(item.reconstructionMethod)) fail(`${subjectId} must retain explicit disputed-territory caveat`);
}
if(!failures) pass("B10 disputed-control caveats remain explicit");

if(failures){
  console.error(`\nContemporary history self-check failed: ${failures} issue(s).`);
  process.exitCode=1;
}else{
  console.log("\nContemporary history self-check passed.");
}
