"use strict";

require("./library-data.js");

const Libraries = globalThis.AtlasLibraryData;

describe("historical library evidence model", () => {
  test("contains the six dossier seed institutions", () => {
    expect(Libraries.sites).toHaveLength(6);
    expect(Libraries.get("ugarit_ras_shamra").overallConfidence).toBe("high");
    expect(Libraries.get("bayt_al_hikma_baghdad").overallConfidence).toBe("very_low");
  });

  test("uncertain reconstructions stay explicitly qualified or prohibited", () => {
    expect(Libraries.get("alexandria_ancient_library").prohibited).toContain("exact plan");
    expect(Libraries.get("nalanda_mahavihara").prohibited).toContain("specific excavated library without proof");
    expect(Libraries.get("saint_catherines_sinai").qualified).toContain("historical library room");
  });

  test("relationship matrix is complete for six sites", () => {
    expect(Libraries.links).toHaveLength(15);
  });

  test("thematic relationships are not silently promoted to direct transmission", () => {
    expect(Libraries.links.some(link => link.classification === Libraries.TRANSMISSION.DIRECT)).toBe(false);
    expect(Libraries.linkBetween("ugarit_ras_shamra", "ashurbanipal_nineveh").classification)
      .toBe(Libraries.TRANSMISSION.TRADITION);
    expect(Libraries.linkBetween("alexandria_ancient_library", "bayt_al_hikma_baghdad").classification)
      .toBe(Libraries.TRANSMISSION.INDIRECT);
  });

  test("open-ended institutions remain active after their start", () => {
    expect(Libraries.activeAt(2026).map(site => site.id)).toContain("saint_catherines_sinai");
  });
});
