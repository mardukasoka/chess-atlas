"use strict";

require("./culture-data.js");

const Cultures = globalThis.AtlasCultureData;

describe("deep-time cultural overlays", () => {
  test("Natufian is active at 12,500 BCE but Yamnaya is not", () => {
    expect(Cultures.activeAt(-12500).map(item => item.slug)).toEqual(["natufian"]);
  });

  test("Yamnaya is active at 2,900 BCE", () => {
    expect(Cultures.activeAt(-2900).map(item => item.slug)).toEqual(["yamnaya"]);
  });

  test("cultures carry provenance and epistemic map meaning", () => {
    Cultures.cultures.forEach(culture => {
      expect(culture.geometry.length).toBeGreaterThan(3);
      expect(culture.evidenceType).toBe("archaeological");
      expect(culture.mapMeaning).toMatch(/not (territory|a state border)/i);
      expect(culture.sources.length).toBeGreaterThan(0);
    });
  });
});
