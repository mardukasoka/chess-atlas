"use strict";

require("./history-baseline-selfcheck.js");

const Propagation = require("./history-causal-propagation.js");
const Divergence = require("./history-divergence.js");
const ContinuumCase = require("./history-continuum-case.js");
const ContestGameplay = require("./history-contest-gameplay.js");
const Adjudication = require("./history-branch-adjudication.js");
const ClassicalSpatial = require("./history-spatial-classical.js");
const ClassicalContinuitySpatial = require("./history-spatial-classical-continuity.js");

let failures = 0;
function fail(message) { failures += 1; console.error(`FAIL: ${message}`); }
function pass(message) { console.log(`PASS: ${message}`); }

const propagation = Propagation.propagate({
  branchId:"sample-roman-divergence",
  actorId:"polity-roman-empire-principate",
  year:117,
  action:{
    type:"annex",
    targetId:"hypothetical-undocumented-town",
    distanceFromCoreKm:900,
    documentedConflict:false,
    hostileNeighborCount:3,
    tradeDependency:0.7,
    localPopulation:25000,
    highIntensityConflict:true
  }
}, {});

const divergence = Divergence.evaluateDivergence({
  subjectId:"polity-roman-empire-principate",
  year:117,
  proposedPoints:[[75,35]],
  spatialRecords:[...ClassicalSpatial.records, ...ClassicalContinuitySpatial.records],
  overrideToleranceKm:50
});

const openCase = ContinuumCase.createCase({
  caseId:"continuum-sample-roman-117",
  branchId:"sample-roman-divergence",
  subjectId:"polity-roman-empire-principate",
  year:117,
  divergence,
  propagation
});
const contestedCase = ContinuumCase.choose(openCase, "CONTEST", "Self-check contest branch");
const contest = ContestGameplay.createContest(contestedCase);
let wonContest = contest;
for (const item of contest.objectives) {
  wonContest = ContestGameplay.recordProgress(wonContest, item.id, item.threshold, "self-check completes objective");
}

const accepted = Adjudication.adjudicate({
  contest:wonContest,
  caseObject:contestedCase,
  decision:"alternate-branch-accepted",
  note:"Self-check accepts alternate timeline after all constraints and final review."
});
if (!accepted.ok || accepted.status !== "alternate-preserved" || accepted.branchAccepted !== true || accepted.canonicalHistoryChanged !== false || !accepted.alternateTimeline || accepted.alternateTimeline.canonical !== false || accepted.alternateTimeline.immutable !== true) {
  fail("accepted alternate must be preserved as a separate immutable non-canonical timeline");
} else pass("accepted alternate remains separate immutable timeline");

const failedContest = ContestGameplay.concede(contest, "Self-check failed contest");
const failed = Adjudication.adjudicate({
  contest:failedContest,
  caseObject:contestedCase,
  decision:"branch-failed",
  note:"Self-check closes failed alternate branch."
});
if (!failed.ok || failed.status !== "branch-closed-failed" || failed.branchFailed !== true || failed.branchAccepted !== false || failed.alternateTimeline !== null || failed.canonicalHistoryChanged !== false) {
  fail("failed branch must close without canonical mutation or alternate acceptance");
} else pass("failed branch remains historical record without acceptance");

const returned = Adjudication.adjudicate({
  contest,
  caseObject:contestedCase,
  decision:"return-to-baseline",
  note:"Self-check returns play to evidence-backed baseline."
});
if (!returned.ok || returned.status !== "baseline-restored" || returned.returnedToBaseline !== true || returned.branchAccepted !== false || returned.alternateTimeline !== null || returned.canonicalHistoryChanged !== false) {
  fail("return-to-baseline must resolve branch without rewriting canonical history");
} else pass("return-to-baseline resolves branch without rewriting history");

if (accepted.history.length <= contestedCase.history.length || failed.history.length <= contestedCase.history.length || returned.history.length <= contestedCase.history.length) {
  fail("final adjudication must preserve and append branch decision history");
} else pass("final adjudication preserves branch decision history");

const limits = Adjudication.limits();
if (limits.canonicalMutationAllowed || limits.acceptedAlternateBecomesCanonical || limits.acceptedAlternateStoredSeparately !== true || limits.immutableTimelineRequired !== true || limits.failedBranchHistoryPreserved !== true || limits.baselineReturnDoesNotRewriteHistory !== true) {
  fail("branch adjudication boundary is invalid");
} else pass("branch adjudication keeps canonical and alternate timelines separate");

if (failures) {
  console.error(`\nBranch adjudication self-check failed: ${failures} issue(s).`);
  process.exitCode = 1;
} else {
  console.log("\nBranch adjudication self-check passed.");
}
