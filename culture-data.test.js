"use strict";

require("./culture-data.js");

const Cultures = globalThis.AtlasCultureData;

describe("deep-time cultural overlays", () => {
  test("Natufian is active at 12,500 BCE but later horizons are not", () => {
    expect(Cultures.activeAt(-12500).map(item => item.slug)).toEqual(["natufian"]);
  });

  test("Neolithic layers activate in their evidence windows", () => {
    expect(Cultures.activeAt(-7000).map(item => item.slug)).toContain("catalhoyuk");
    expect(Cultures.activeAt(-5300).map(item => item.slug)).toEqual(expect.arrayContaining(["catalhoyuk", "lbk"]));
    expect(Cultures.activeAt(-4100).map(item => item.slug)).toContain("cucuteni-trypillia");
  });

  test("Yamnaya and Cucuteni–Trypillia can overlap without implying identity", () => {
    expect(Cultures.activeAt(-3200).map(item => item.slug)).toEqual(expect.arrayContaining(["cucuteni-trypillia", "yamnaya"]));
  });

  test("Corded Ware is active at 2,600 BCE while Yamnaya reaches its end boundary", () => {
    expect(Cultures.activeAt(-2600).map(item => item.slug)).toEqual(expect.arrayContaining(["yamnaya", "corded-ware"]));
  });

  test("cultures carry provenance and non-territorial epistemic map meaning", () => {
    Cultures.cultures.forEach(culture => {
      expect(culture.geometry.length).toBeGreaterThan(3);
      expect(culture.evidenceType).toBe("archaeological");
      expect(culture.mapMeaning).toMatch(/not.*(territory|state border|polity|regional culture boundary)/i);
      expect(culture.sources.length).toBeGreaterThan(0);
    });
  });

  test("new culture entries are retrievable by slug and id", () => {
    expect(Cultures.get("lbk").id).toBe("culture-lbk");
    expect(Cultures.get("culture-corded-ware").slug).toBe("corded-ware");
  });
});
