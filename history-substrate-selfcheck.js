"use strict";

require("./history-contemporary-selfcheck.js");

const Claims=require("./history-claim-conflicts.js");
const Query=require("./history-query.js");
const B10=require("./history-baseline-contemporary.js");
const B10Spatial=require("./history-spatial-contemporary.js");
const B10Continuity=require("./history-continuity-contemporary.js");

let failures=0;
function fail(message){failures+=1;console.error(`FAIL: ${message}`);}
function pass(message){console.log(`PASS: ${message}`);}

const first=B10.records[0];
const second=B10.records[1]||B10.records[0];

const sampleConflict=Object.freeze({
  id:"conflict-selfcheck-sample",
  claimType:"interpretation",
  time:Object.freeze({startYear:1991,endYear:2026}),
  resolutionState:"open",
  summary:"Synthetic self-check conflict used only to verify preservation of competing claims.",
  claims:Object.freeze([
    Object.freeze({
      id:"claim-selfcheck-a",
      subjectIds:Object.freeze([first.id]),
      assertion:"Synthetic interpretation A.",
      epistemicClass:"disputed",
      confidence:0.5,
      sources:Object.freeze([{label:"Synthetic self-check source A",reference:"Test fixture only"}])
    }),
    Object.freeze({
      id:"claim-selfcheck-b",
      subjectIds:Object.freeze([first.id,second.id]),
      assertion:"Synthetic interpretation B.",
      epistemicClass:"disputed",
      confidence:0.5,
      sources:Object.freeze([{label:"Synthetic self-check source B",reference:"Test fixture only"}])
    })
  ])
});

const validation=Claims.validateConflict(sampleConflict);
if(!validation.ok) fail(`claim conflict validation: ${validation.errors.join(" | ")}`);
else pass("Claim-conflict schema preserves competing claims");

const invalidPreferred={...sampleConflict,preferredClaimId:"claim-selfcheck-a"};
const invalidValidation=Claims.validateConflict(invalidPreferred);
if(invalidValidation.ok) fail("open claim conflict incorrectly allowed preferredClaimId");
else pass("Open disputes cannot silently select a preferred claim");

const limits=Claims.limits();
if(limits.mutatesBaseline!==false||limits.autoResolution!==false||limits.competingClaimsPreserved!==true) fail("claim-conflict safety limits changed");
else pass("Claim-conflict layer remains read-only and non-resolving");

const query=Query.createHistoryQuery({
  baselineBatches:[B10],
  spatialBatches:[B10Spatial],
  continuityBatches:[B10Continuity.relations],
  claimConflicts:[sampleConflict]
});

const subject=query.subject(first.id);
if(!subject.baseline||subject.baseline.id!==first.id) fail("subject query did not return baseline record");
else if(!subject.spatial.length) fail("subject query did not join spatial records");
else if(!subject.disputes.length) fail("subject query did not join claim conflicts");
else pass("Subject query joins baseline, spatial and disputes");

const range=Query.timeRange(first);
const year=range ? range[0] : 1991;
const region=Array.isArray(first.coverageRegions)&&first.coverageRegions.length ? first.coverageRegions[0] : null;
const atYear=query.atYear(year,region?{region}:{});
if(!atYear.baseline.some(record=>record.id===first.id)) fail("year query omitted active baseline record");
else pass("Year query respects chronology and region filtering");

const deduped=Query.uniqueById([first,first,second]);
if(new Set(deduped.map(record=>record.id)).size!==deduped.length) fail("query facade failed to deduplicate ids");
else pass("Query facade deduplicates repeated record ids");

const stats=query.stats();
if(stats.baselineRecords!==B10.records.length) fail(`query stats baseline count ${stats.baselineRecords} != ${B10.records.length}`);
else pass("Query facade reports deterministic collection counts");

if(failures){
  console.error(`\nHistory substrate self-check failed: ${failures} issue(s).`);
  process.exitCode=1;
}else{
  console.log("\nHistory substrate self-check passed.");
}
