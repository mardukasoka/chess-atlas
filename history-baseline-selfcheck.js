"use strict";

const Baseline = require("./history-baseline.js");
const Spatial = require("./history-spatial.js");
const SpatialCoverage = require("./history-spatial-coverage.js");
const Continuity = require("./history-continuity.js");
const Causality = require("./history-causality.js");
const CausalSamples = require("./history-causality-sample.js");
const Propagation = require("./history-causal-propagation.js");
const Divergence = require("./history-divergence.js");
const ContinuumCase = require("./history-continuum-case.js");
const Neolithic = require("./history-baseline-neolithic.js");
const Bronze = require("./history-baseline-bronze.js");
const Iron = require("./history-baseline-iron.js");
const Classical = require("./history-baseline-classical.js");
const ClassicalContinuity = require("./history-baseline-classical-continuity.js");
const ClassicalRelations = require("./history-continuity-classical.js");
const LateAntiquity = require("./history-baseline-late-antiquity.js");
const LateAntiquityContinuity = require("./history-baseline-late-antiquity-continuity.js");
const LateAntiquityRelations = require("./history-continuity-late-antiquity.js");
const Medieval = require("./history-baseline-medieval.js");
const MedievalRelations = require("./history-continuity-medieval.js");
const NeolithicSpatial = require("./history-spatial-neolithic.js");
const BronzeSpatial = require("./history-spatial-bronze.js");
const IronSpatial = require("./history-spatial-iron.js");
const ClassicalSpatial = require("./history-spatial-classical.js");
const ClassicalContinuitySpatial = require("./history-spatial-classical-continuity.js");
const LateAntiquitySpatial = require("./history-spatial-late-antiquity.js");
const LateAntiquityContinuitySpatial = require("./history-spatial-late-antiquity-continuity.js");
const MedievalSpatial = require("./history-spatial-medieval.js");
const ExistingCultures = require("./history-spatial-existing-cultures.js");

let failures = 0;
function fail(message) { failures += 1; console.error(`FAIL: ${message}`); }
function pass(message) { console.log(`PASS: ${message}`); }

function checkBaselineBatch(name, batch) {
  const errors = [];
  for (const record of batch.records) {
    const result = Baseline.validateBaselineRecord(record);
    if (!result.ok) errors.push(`${record.id}: ${result.errors.join(" | ")}`);
  }
  if (errors.length) errors.forEach(error => fail(`${name} baseline ${error}`));
  else pass(`${name} baseline records (${batch.records.length})`);
}

function checkSpatialRecords(name, spatialBatch) {
  const errors = [];
  for (const record of spatialBatch.records) {
    const result = Spatial.validatePolygonRecord(record);
    if (!result.ok) errors.push(`${record.id}: ${result.errors.join(" | ")}`);
  }
  if (errors.length) errors.forEach(error => fail(`${name} spatial ${error}`));
  else pass(`${name} spatial records (${spatialBatch.records.length})`);
}

function checkSpatialCompleteness(name, baselineBatch, spatialBatch) {
  const required = baselineBatch.records.filter(record => record.type === "culture" || record.type === "polity");
  const spatialBySubject = new Map(spatialBatch.records.map(record => [record.subjectId, record]));
  const subjects = required.map(record => ({
    id: record.id,
    kind: spatialBySubject.get(record.id)?.subjectKind || (record.type === "culture" ? "culture" : "polity")
  }));
  const report = SpatialCoverage.spatialCoverageReport(subjects, spatialBatch.records);
  if (!report.complete) fail(`${name} spatial completeness: missing=${JSON.stringify(report.missing)} invalid=${JSON.stringify(report.invalidPolygons)}`);
  else pass(`${name} spatial completeness (${report.represented}/${report.totalSubjects} represented)`);
}

function checkContinuity(name, relations, knownSubjectIds) {
  const validationErrors = [];
  for (const relation of relations) {
    const result = Continuity.validateContinuityRelation(relation);
    if (!result.ok) validationErrors.push(`${relation.id}: ${result.errors.join(" | ")}`);
  }
  if (validationErrors.length) validationErrors.forEach(error => fail(`${name} continuity ${error}`));
  else pass(`${name} continuity relations (${relations.length})`);
  const dangling = Continuity.danglingRelations(relations, knownSubjectIds);
  if (dangling.length) fail(`${name} dangling continuity subjects: ${JSON.stringify(dangling)}`);
  else pass(`${name} continuity subject references`);
}

function checkCausality(name, relations, knownSubjectIds) {
  const validationErrors = [];
  for (const relation of relations) {
    const result = Causality.validateCausalRelation(relation);
    if (!result.ok) validationErrors.push(`${relation.id}: ${result.errors.join(" | ")}`);
  }
  if (validationErrors.length) validationErrors.forEach(error => fail(`${name} causality ${error}`));
  else pass(`${name} causal relations (${relations.length})`);
  const dangling = Causality.danglingRelations(relations, knownSubjectIds);
  if (dangling.length) fail(`${name} dangling causal subjects: ${JSON.stringify(dangling)}`);
  else pass(`${name} causal subject references`);
}

checkBaselineBatch("Neolithic", Neolithic);
checkBaselineBatch("Bronze", Bronze);
checkBaselineBatch("Iron/Axial", Iron);
checkBaselineBatch("Hellenistic/Roman/Han", Classical);
checkBaselineBatch("B4 continuity phases", ClassicalContinuity);
checkBaselineBatch("Late Antiquity/early medieval", LateAntiquity);
checkBaselineBatch("B5 continuity phases", LateAntiquityContinuity);
checkBaselineBatch("Medieval connected world", Medieval);

checkSpatialRecords("Neolithic", NeolithicSpatial);
checkSpatialRecords("Bronze", BronzeSpatial);
checkSpatialRecords("Iron/Axial", IronSpatial);
checkSpatialRecords("Hellenistic/Roman/Han", ClassicalSpatial);
checkSpatialRecords("B4 continuity phases", ClassicalContinuitySpatial);
checkSpatialRecords("Late Antiquity/early medieval", LateAntiquitySpatial);
checkSpatialRecords("B5 continuity phases", LateAntiquityContinuitySpatial);
checkSpatialRecords("Medieval connected world", MedievalSpatial);
checkSpatialRecords("legacy culture migration", ExistingCultures);

checkSpatialCompleteness("Neolithic", Neolithic, NeolithicSpatial);
checkSpatialCompleteness("Bronze", Bronze, BronzeSpatial);
checkSpatialCompleteness("Iron/Axial", Iron, IronSpatial);
checkSpatialCompleteness("Hellenistic/Roman/Han", Classical, ClassicalSpatial);
checkSpatialCompleteness("B4 continuity phases", ClassicalContinuity, ClassicalContinuitySpatial);
checkSpatialCompleteness("Late Antiquity/early medieval", LateAntiquity, LateAntiquitySpatial);
checkSpatialCompleteness("B5 continuity phases", LateAntiquityContinuity, LateAntiquityContinuitySpatial);
checkSpatialCompleteness("Medieval connected world", Medieval, MedievalSpatial);

const knownSubjectIds = new Set([
  ...Bronze.records,
  ...Iron.records,
  ...Classical.records,
  ...ClassicalContinuity.records,
  ...LateAntiquity.records,
  ...LateAntiquityContinuity.records,
  ...Medieval.records
].map(record => record.id));
checkContinuity("B4", ClassicalRelations.relations, knownSubjectIds);
checkContinuity("B5", LateAntiquityRelations.relations, knownSubjectIds);
checkContinuity("B6", MedievalRelations.relations, knownSubjectIds);
checkCausality("v0.1", CausalSamples.relations, knownSubjectIds);

const causalLimits = Causality.limits();
if (causalLimits.simulationAllowed || causalLimits.canonicalMutationAllowed || causalLimits.automaticCorrectionAllowed) fail("causality boundary must remain read-only with respect to canonical history");
else pass("causality/canonical-history separation");

const propagationLimits = Propagation.limits();
if (!propagationLimits.proposalOnly || propagationLimits.canonicalMutationAllowed || propagationLimits.automaticBranchAcceptance || propagationLimits.automaticTimelineCorrection) {
  fail("causal propagation must remain proposal-only and non-mutating");
} else pass("causal propagation proposal-only boundary");

const samplePropagation = Propagation.propagate({
  branchId: "sample-roman-divergence",
  actorId: "polity-roman-empire-principate",
  year: 117,
  action: {
    type: "annex",
    targetId: "hypothetical-undocumented-town",
    distanceFromCoreKm: 900,
    documentedConflict: false,
    hostileNeighborCount: 3,
    tradeDependency: 0.7,
    localPopulation: 25000,
    highIntensityConflict: true
  }
}, {
  logisticsEvidenceIds: ["cause-silk-road-kushan-exchange"],
  diplomacyEvidenceIds: [],
  manpowerEvidenceIds: [],
  tradeEvidenceIds: ["cause-silk-road-kushan-exchange"],
  economyEvidenceIds: [],
  institutionEvidenceIds: [],
  demographyEvidenceIds: [],
  divergenceEvidenceIds: []
});
if (!samplePropagation.ok || samplePropagation.mode !== "proposal-only" || samplePropagation.writesCanonicalHistory !== false || samplePropagation.requiresReview !== true) {
  fail("sample causal propagation output contract");
} else {
  const domains = new Set(samplePropagation.effects.map(effect => effect.domain));
  const requiredDomains = ["logistics","diplomacy","manpower","trade","economy","institutions","demography"];
  const missingDomains = requiredDomains.filter(domain => !domains.has(domain));
  if (missingDomains.length) fail(`sample causal propagation missing domains: ${missingDomains.join(",")}`);
  else pass("sample causal propagation covers all consequence domains");
  if (samplePropagation.effects.some(effect => effect.canonicalMutation !== false)) fail("sample causal propagation attempted canonical mutation");
  else pass("sample causal effects are non-mutating");
  if (!samplePropagation.effects.some(effect => effect.kind === "historical-divergence-signal")) fail("undocumented conquest must emit historical divergence signal");
  else pass("undocumented conquest divergence signal");
}

const classicalSpatialRecords = [...ClassicalSpatial.records, ...ClassicalContinuitySpatial.records];
const insideRome = Divergence.evaluateDivergence({
  subjectId:"polity-roman-empire-principate",
  year:117,
  proposedPoints:[[12.5,41.9]],
  spatialRecords:classicalSpatialRecords
});
if (!insideRome.ok || insideRome.outcome !== "within-tolerance" || insideRome.writesCanonicalHistory !== false) {
  fail("inside historical extent must remain within tolerance");
} else pass("divergence detector allows within-tolerance play");

const farRome = Divergence.evaluateDivergence({
  subjectId:"polity-roman-empire-principate",
  year:117,
  proposedPoints:[[75,35]],
  spatialRecords:classicalSpatialRecords,
  overrideToleranceKm:50
});
if (!farRome.ok || farRome.outcome !== "continuum-case-required" || farRome.requiresReview !== true) {
  fail("materially distant territorial proposal must require Continuum review");
} else pass("divergence detector opens Continuum case outside tolerance");

const divergenceLimits = Divergence.limits();
if (divergenceLimits.canonicalMutationAllowed || divergenceLimits.automaticCorrectionAllowed || divergenceLimits.continuumCaseIsProposal !== true) {
  fail("divergence detector must not mutate or automatically correct history");
} else pass("divergence detector is non-mutating and review-only");

const sampleCase = ContinuumCase.createCase({
  caseId:"continuum-sample-roman-117",
  branchId:"sample-roman-divergence",
  subjectId:"polity-roman-empire-principate",
  year:117,
  divergence:farRome,
  propagation:samplePropagation
});
if (!sampleCase.ok || sampleCase.status !== "open" || sampleCase.writesCanonicalHistory !== false || sampleCase.automaticEnforcement !== false || sampleCase.requiresPlayerChoice !== true) {
  fail("Continuum case open-state contract");
} else pass("Continuum case packages divergence and causal consequences");

const correctedCase = ContinuumCase.choose(sampleCase, "CORRECT", "Return branch proposal toward evidence-backed historical state.");
if (!correctedCase.ok || correctedCase.status !== "correction-proposed" || correctedCase.correctionApplied !== false || correctedCase.writesCanonicalHistory !== false || correctedCase.requiresReview !== true) {
  fail("CORRECT must remain a reviewable proposal without applying a canonical rewrite");
} else pass("Continuum CORRECT remains proposal-only");

const contestedCase = ContinuumCase.choose(sampleCase, "CONTEST", "Player elects to defend the alternate branch through gameplay.");
if (!contestedCase.ok || contestedCase.status !== "contested" || contestedCase.branchAccepted !== false || contestedCase.writesCanonicalHistory !== false || contestedCase.requiresReview !== true) {
  fail("CONTEST must preserve branch for review/gameplay without automatic acceptance");
} else pass("Continuum CONTEST preserves alternate branch without auto-acceptance");

if (correctedCase.history.length !== 2 || contestedCase.history.length !== 2 || sampleCase.history.length !== 1) {
  fail("Continuum case history must be immutable and append-only by returned case state");
} else pass("Continuum case preserves branch decision history");

const continuumLimits = ContinuumCase.limits();
if (continuumLimits.canonicalMutationAllowed || continuumLimits.automaticCorrectionAllowed || continuumLimits.automaticContestResolutionAllowed || continuumLimits.branchHistoryPreserved !== true) {
  fail("Continuum case limits must prohibit automatic enforcement and preserve branch history");
} else pass("Continuum case enforcement boundary");

const excluded = ExistingCultures.EXCLUDED_NON_CULTURE_OVERLAYS.map(item => item.id);
if (!excluded.includes("culture-catalhoyuk")) fail("Çatalhöyük settlement overlay must remain excluded from culture-distribution migration");
else pass("settlement/culture semantic separation");

const lapita = BronzeSpatial.get("culture-lapita");
if (!lapita || lapita.geometryType !== "MultiPolygon") fail("Lapita must remain multipart");
else {
  const badDatelineRing = lapita.geometry.some(ring => {
    const longitudes = ring.map(point => point[0]);
    return Math.max(...longitudes) - Math.min(...longitudes) > 30;
  });
  if (badDatelineRing) fail("Lapita contains a dateline-spanning ring");
  else pass("Lapita dateline split");
}

if (failures) {
  console.error(`\nHistory baseline self-check failed: ${failures} issue(s).`);
  process.exitCode = 1;
} else {
  console.log("\nHistory baseline self-check passed.");
}
