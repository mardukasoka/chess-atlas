"use strict";

/* Knowledge/world-system anchors for B7 Early Modern history (1500–1800 CE). */
(function (root) {
  const records = Object.freeze([
    Object.freeze({
      id:"event-age-of-exploration-b7",
      type:"event",
      name:"Age of Exploration / sustained European transoceanic expansion",
      time:Object.freeze({startYear:1488,endYear:1700,precision:"range"}),
      epistemicClass:"documented",
      status:"reviewed",
      confidence:0.98,
      confidenceRationale:"The Age of Exploration is a broad process rather than a single event. The Met places the great period of European exploration from the latter half of the fifteenth through the sixteenth century, with major navigation/cartography advances and sustained oceanic routes. The Atlas extends the anchor into the seventeenth century to cover continued Pacific charting and the consolidation of global maritime trade networks. This record does not imply that inhabited lands were literally 'discovered'; it tracks European maritime expansion, sustained contact, conquest/colonization, and global route integration.",
      coverageRegions:Object.freeze(["europe","middle-east-north-africa","sub-saharan-africa","south-asia","east-asia","southeast-asia","north-america","central-america-caribbean","south-america","oceania-pacific"]),
      sources:Object.freeze([
        {label:"Metropolitan Museum — Europe and the Age of Exploration",type:"academic-secondary",reference:"Age of Exploration from later 15th through 16th century; navigation, cartography, anatomy and optics advances",url:"https://www.metmuseum.org/ja/essays/europe-and-the-age-of-exploration"},
        {label:"Library of Congress — 1492: An Ongoing Voyage",type:"institutional-dataset",reference:"Sustained contact, exploration, conquest and acculturation in the Americas after 1492",url:"https://www.loc.gov/exhibits/1492/"},
        {label:"Metropolitan Museum — European Exploration of the Pacific, 1600–1800",type:"academic-secondary",reference:"Seventeenth- and eighteenth-century continuation of European Pacific exploration and charting",url:"https://www.metmuseum.org/it/essays/european-exploration-of-the-pacific-1600-1800"}
      ])
    }),
    Object.freeze({
      id:"event-copernican-revolution-1543",
      type:"event",
      name:"Copernican Revolution — publication of De revolutionibus",
      time:Object.freeze({year:1543,precision:"year"}),
      epistemicClass:"documented",
      status:"reviewed",
      confidence:0.99,
      confidenceRationale:"The Library of Congress records the 1543 publication of Nicolaus Copernicus's De revolutionibus orbium coelestium, which presented a full heliocentric theory. The Atlas treats 1543 as a documentary anchor for the Copernican Revolution, not as a claim that the broader scientific transformation began or ended in a single year.",
      coverageRegions:Object.freeze(["europe"]),
      sources:Object.freeze([{label:"Library of Congress — De revolutionibus orbium coelestium",type:"primary-source",reference:"Nuremberg publication, 1543; full heliocentric theory",url:"https://www.loc.gov/exhibits/exploring-the-early-americas/documenting-new-knowledge.html#obj11"}])
    }),
    Object.freeze({
      id:"event-enlightenment-b7",
      type:"event",
      name:"Enlightenment intellectual movement — broad early-modern phase",
      time:Object.freeze({startYear:1650,endYear:1800,precision:"range"}),
      epistemicClass:"scholarly-reconstruction",
      status:"reviewed",
      confidence:0.93,
      confidenceRationale:"The Enlightenment has no universally exact start date. The Stanford Encyclopedia of Philosophy describes it broadly as emerging from the Scientific Revolution of the sixteenth and seventeenth centuries and reaching characteristic political and philosophical expression in the eighteenth century. The Atlas therefore uses a deliberately broad 1650–1800 phase anchor rather than a false exact date.",
      coverageRegions:Object.freeze(["europe","north-america"]),
      sources:Object.freeze([{label:"Stanford Encyclopedia of Philosophy — Enlightenment",type:"academic-secondary",reference:"Broad Enlightenment; origins in the Scientific Revolution and major eighteenth-century political/philosophical development",url:"https://plato.stanford.edu/entries/enlightenment/"}])
    })
  ]);
  function all(){ return [...records]; }
  function get(id){ return records.find(r=>r.id===id)||null; }
  const api=Object.freeze({records,all,get});
  root.AtlasHistoryEarlyModernKnowledge=api;
  if(typeof module==="object"&&module.exports) module.exports=api;
})(typeof globalThis!=="undefined"?globalThis:this);
