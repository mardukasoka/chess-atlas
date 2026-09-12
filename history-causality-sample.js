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
    confidence: 0.72,
    temporalOrder: "uncertain",
    rationale: "The end of Late Bronze Age palace systems is treated as a contested multicausal problem rather than assigned one canonical cause. Recent synthesis and network research both reject a simplistic single-factor explanation.",
    alternatives: Object.freeze([
      "warfare/invasion and political conflict",
      "internal political-economic instability",
      "climate/environmental stress",
      "trade-network disruption and cascading system failure"
    ]),
    sources: Object.freeze([
      { label: "Middleton — Getting closer to the Late Bronze Age collapse (Antiquity, 2024)", url: "https://www.cambridge.org/core/journals/antiquity/article/getting-closer-to-the-late-bronze-age-collapse-in-the-aegean-and-eastern-mediterranean-c-1200-bc/482564326A668899FF183DD949FC520F" },
      { label: "Are civilizations destined to collapse? Lessons from the Mediterranean Bronze Age (Global Environmental Change, 2024)", url: "https://www.sciencedirect.com/science/article/pii/S0959378023001589" }
    ])
  })
]);

function all() { return [...relations]; }
module.exports = Object.freeze({ relations, all });
