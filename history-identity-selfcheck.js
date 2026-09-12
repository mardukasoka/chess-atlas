"use strict";

require("./history-substrate-selfcheck.js");

const Coverage=require("./history-baseline-coverage.js");
const SpatialCoverage=require("./history-spatial-coverage.js");
const Identity=require("./history-identity-subjects.js");
const Unresolved=require("./history-spatial-identity-unresolved.js");

let failures=0;
function fail(message){failures+=1;console.error(`FAIL: ${message}`);}
function pass(message){console.log(`PASS: ${message}`);}

const ids=Identity.subjects.map(subject=>subject.id);
const duplicateIds=ids.filter((id,index)=>ids.indexOf(id)!==index);
if(duplicateIds.length) fail(`duplicate identity subject IDs: ${[...new Set(duplicateIds)].join(",")}`);
else pass(`identity subject IDs unique (${ids.length})`);

const language=Identity.byKind("language-group");
const ethnicity=Identity.byKind("ethnicity");
if(!language.length) fail("language-group registry is empty"); else pass(`language-group subjects (${language.length})`);
if(!ethnicity.length) fail("ethnicity registry is empty"); else pass(`ethnicity subjects (${ethnicity.length})`);

const regionSet=new Set(Identity.subjects.flatMap(subject=>subject.coverageRegions||[]));
const missingRegions=Coverage.REGIONS.filter(region=>!regionSet.has(region));
if(missingRegions.length) fail(`identity registry missing regions: ${missingRegions.join(",")}`);
else pass("identity registry covers all standard world regions");

const subjects=Identity.subjects.map(subject=>({id:subject.id,kind:subject.kind}));
const report=SpatialCoverage.spatialCoverageReport(subjects,[],Unresolved.unresolved);
if(!report.complete) fail(`identity spatial inventory incomplete: missing=${JSON.stringify(report.missing)} invalid=${JSON.stringify(report.invalidPolygons)}`);
else pass(`identity spatial inventory complete (${report.explicitlyUnresolved}/${report.totalSubjects} explicitly unresolved)`);

if(report.represented!==0) fail("identity first-pass registry unexpectedly inherited polygon representation");
else pass("identity layers do not inherit political/cultural polygons");

const badEthnicity=ethnicity.filter(subject=>typeof subject.spatialCaveat!=="string"||!subject.spatialCaveat.trim());
if(badEthnicity.length) fail(`ethnicity subjects missing spatial caveat: ${badEthnicity.map(subject=>subject.id).join(",")}`);
else pass("all ethnicity subjects preserve overlap/mobility caveats");

const unresolvedIds=new Set(Unresolved.unresolved.map(record=>record.id));
const missingUnresolved=Identity.subjects.filter(subject=>!unresolvedIds.has(subject.id));
if(missingUnresolved.length) fail(`identity subjects missing unresolved record: ${missingUnresolved.map(subject=>subject.id).join(",")}`);
else pass("every identity subject has explicit spatial status");

if(failures){
  console.error(`\nIdentity spatial self-check failed: ${failures} issue(s).`);
  process.exitCode=1;
}else{
  console.log("\nIdentity spatial self-check passed.");
}
