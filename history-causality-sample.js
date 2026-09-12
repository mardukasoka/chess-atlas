"use strict";

const relations = Object.freeze([
  Object.freeze({
    id: "cause-sasanian-collapse-arab-conquest",
    type: "direct-cause",
    from: Object.freeze(["polity-rashidun-caliphate"]),
    to: Object.freeze(["polity-sasanian-empire-b5"]),
    epistemicClass: "documented",
    confidence: 0.93,
    temporalOrder: "before",
    mechanism: "Military conquest and political defeat ended Sasanian imperial rule by 651 CE.",
    rationale: "The relation records the documented political termination of Sasanian imperial rule without claiming that conquest alone explains every social or economic transformation in former Sasanian territories.",
    sources: Object.freeze([{ label: "Metropolitan Museum — The Sasanian Empire (224–651 A.D.)", url: "https://www.metmuseum.org/de/essays/the-sasanian-empire-224-651-a-d" }])
  }),
  Object.freeze({
    id: "cause-silk-road-kushan-exchange",
    type: "enabling-condition",
    from: Object.freeze(["polity-kushan-empire"]),
    to: Object.freeze(["polity-kushan-empire"]),
    epistemicClass: "scholarly-reconstruction",
    confidence: 0.8,
    temporalOrder: "overlap",
    mechanism: "Control of transregional corridors enabled intensified exchange among South Asia, Central Asia, Iran, and the wider Silk Road system.",
    rationale: "This is an enabling condition rather than a deterministic cause of Kushan prosperity, cultural change, or political durability.",
    sources: Object.freeze([{ label: "Metropolitan Museum — Central and North Asia, 1–500 A.D.", url: "https://82nd-and-fifth.metmuseum.org/toah/ht/05/nc.html" }])
  }),
  Object.freeze({
    id: "cause-bronze-collapse-multicausal-dispute",
    type: "disputed-interpretation",
    from: Object.freeze(["culture-mycenaean-greece"]),
    to: Object.freeze(["culture-mycenaean-greece"]),
    epistemicClass: "disputed",
    confidence: 0.7,
    temporalOrder: "uncertain",
    rationale: "The end of Late Bronze Age palace systems is treated as a multicausal scholarly problem rather than assigned a single canonical cause.",
    alternatives: Object.freeze([
      "warfare/invasion and political conflict",
      "internal political-economic instability",
      "climate/environmental stress",
      "trade-network disruption and cascading system failure"
    ]),
    sources: Object.freeze([{ label: "Atlas Bronze Age collapse research queue", url: "https://github.com/mardukasoka/chess-atlas" }])
  })
]);

function all() { return [...relations]; }
module.exports = Object.freeze({ relations, all });
