"use strict";

require("./site-data.js");

const Sites = global.AtlasSiteData;

describe("Atlas archaeological site data", () => {
  test("Göbekli Tepe preserves the UNESCO monumental phase and sourced point", () => {
    const site = Sites.get("gobekli-tepe");
    expect(site.phase.startYear).toBe(-9600);
    expect(site.phase.endYear).toBe(-8200);
    expect(site.location.coordinateConfidence).toMatch(/high/);
    expect(site.sources.some(source => source.url.includes("whc.unesco.org"))).toBe(true);
  });

  test("Taş Tepeler is encoded as a research network, not a territorial culture", () => {
    const network = Sites.siteNetworks["tas-tepeler-upper-mesopotamia"];
    expect(network.mapMeaning).toMatch(/not a political or ethnic territory/i);
    expect(network.relatedSiteNames).toEqual(expect.arrayContaining([
      "Göbekli Tepe", "Karahantepe", "Sayburç", "Sefertepe", "Çakmaktepe"
    ]));
  });

  test("site points remain distinct from cities and political regions", () => {
    for (const site of Sites.sites) {
      expect(site.siteType).not.toBe("city");
      expect(site.evidenceType).toBe("archaeological");
      expect(site.sources.length).toBeGreaterThan(0);
      expect(Number.isFinite(site.location.lat)).toBe(true);
      expect(Number.isFinite(site.location.lon)).toBe(true);
      expect(site.phase.startYear).toBeLessThanOrEqual(site.phase.endYear);
    }
  });

  test("activeAt returns only sites whose represented phase contains the year", () => {
    expect(Sites.activeAt(-9000).map(site => site.slug)).toEqual(expect.arrayContaining([
      "gobekli-tepe", "karahantepe", "cakmaktepe"
    ]));
    expect(Sites.activeAt(-7500).map(site => site.slug)).toContain("sefertepe");
    expect(Sites.activeAt(-7500).map(site => site.slug)).not.toContain("gobekli-tepe");
  });

  test("network membership is queryable independently from chronology", () => {
    const members = Sites.inNetwork("tas-tepeler-upper-mesopotamia");
    expect(members).toHaveLength(4);
    expect(members.every(site => site.network === "tas-tepeler-upper-mesopotamia")).toBe(true);
  });
});
