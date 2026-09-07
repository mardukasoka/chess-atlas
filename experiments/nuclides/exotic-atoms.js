"use strict";

(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.ChessAtlasExoticAtoms = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const SOURCES = Object.freeze({
    PSI_MUONIC_ATOMS: "https://www.psi.ch/en/muonic-atoms",
    NATURE_MUONIC_H: "https://www.nature.com/articles/nature09250",
    NATURE_MUONIC_HE4: "https://www.nature.com/articles/s41586-021-03183-1",
    PSI_PIONIC_HELIUM: "https://www.psi.ch/en/cnm/scientific-highlights/laser-focus-on-mesons",
    PSI_LTP_EXPERIMENTS: "https://www.psi.ch/en/ltp/experiments"
  });

  const systems = Object.freeze([
    Object.freeze({
      id: "muonic-hydrogen",
      name: "Muonic hydrogen",
      nucleus: "¹H nucleus (proton)",
      boundParticle: "μ−",
      family: "muonic atom",
      composition: "p + μ−",
      status: "observed",
      evidence: "precision laser spectroscopy",
      use: "proton charge radius; bound-state QED",
      lifetimeClass: "muon-limited",
      strangeness: 0,
      sources: Object.freeze([SOURCES.PSI_MUONIC_ATOMS, SOURCES.NATURE_MUONIC_H])
    }),
    Object.freeze({
      id: "muonic-deuterium",
      name: "Muonic deuterium",
      nucleus: "²H nucleus (deuteron)",
      boundParticle: "μ−",
      family: "muonic atom",
      composition: "d + μ−",
      status: "observed",
      evidence: "precision spectroscopy and muon-capture studies",
      use: "deuteron structure; few-body nuclear physics",
      lifetimeClass: "muon-limited",
      strangeness: 0,
      sources: Object.freeze([SOURCES.PSI_MUONIC_ATOMS, SOURCES.PSI_LTP_EXPERIMENTS])
    }),
    Object.freeze({
      id: "muonic-helium-3",
      name: "Muonic helium-3 ion",
      nucleus: "³He nucleus",
      boundParticle: "μ−",
      family: "muonic atom",
      composition: "³He nucleus + μ−",
      status: "observed",
      evidence: "laser spectroscopy",
      use: "helion charge radius; few-nucleon structure",
      lifetimeClass: "muon-limited",
      strangeness: 0,
      sources: Object.freeze([SOURCES.PSI_MUONIC_ATOMS])
    }),
    Object.freeze({
      id: "muonic-helium-4",
      name: "Muonic helium-4 ion",
      nucleus: "⁴He nucleus (alpha particle)",
      boundParticle: "μ−",
      family: "muonic atom",
      composition: "α + μ−",
      status: "observed",
      evidence: "2S–2P laser spectroscopy",
      use: "alpha-particle charge radius; nuclear-structure benchmark",
      lifetimeClass: "muon-limited",
      strangeness: 0,
      measured: Object.freeze({ chargeRadiusFm: 1.67824, uncertaintyFm: 0.00083 }),
      sources: Object.freeze([SOURCES.NATURE_MUONIC_HE4, SOURCES.PSI_MUONIC_ATOMS])
    }),
    Object.freeze({
      id: "pionic-hydrogen",
      name: "Pionic hydrogen",
      nucleus: "¹H nucleus (proton)",
      boundParticle: "π−",
      family: "pionic atom",
      composition: "p + π−",
      status: "observed",
      evidence: "X-ray spectroscopy",
      use: "low-energy pion-nucleon strong interaction",
      lifetimeClass: "strong-interaction limited",
      strangeness: 0,
      sources: Object.freeze([SOURCES.PSI_LTP_EXPERIMENTS])
    }),
    Object.freeze({
      id: "pionic-helium-4",
      name: "Pionic helium-4",
      nucleus: "⁴He nucleus (alpha particle)",
      boundParticle: "π− with one electron retained",
      family: "pionic atom",
      composition: "α + e− + π−",
      status: "observed",
      evidence: "laser spectroscopy of metastable states",
      use: "precision pion spectroscopy; charged-pion mass",
      lifetimeClass: "metastable nanosecond-scale state",
      strangeness: 0,
      sources: Object.freeze([SOURCES.PSI_PIONIC_HELIUM, SOURCES.PSI_LTP_EXPERIMENTS])
    }),
    Object.freeze({
      id: "tauonic-hydrogen",
      name: "Tauonic hydrogen",
      nucleus: "¹H nucleus (proton)",
      boundParticle: "τ−",
      family: "tauonic atom",
      composition: "p + τ−",
      status: "theoretical",
      evidence: "not established as an experimentally observed atomic bound state",
      use: "conceptual extreme-mass lepton atom",
      lifetimeClass: "tau lifetime severely limits formation/observation",
      strangeness: 0,
      sources: Object.freeze([])
    }),
    Object.freeze({
      id: "tauonic-helium",
      name: "Tauonic helium",
      nucleus: "helium nucleus",
      boundParticle: "τ−",
      family: "tauonic atom",
      composition: "He nucleus + τ−",
      status: "theoretical",
      evidence: "not established as an experimentally observed atomic bound state",
      use: "conceptual heavy-lepton atomic system",
      lifetimeClass: "tau lifetime severely limits formation/observation",
      strangeness: 0,
      sources: Object.freeze([])
    })
  ]);

  function list(options = {}) {
    const family = options.family || null;
    const status = options.status || null;
    return systems.filter(system =>
      (!family || system.family === family) &&
      (!status || system.status === status)
    );
  }

  function get(id) {
    return systems.find(system => system.id === id) || null;
  }

  function validateSystem(system) {
    if (!system || typeof system !== "object") return false;
    if (!system.id || !system.name || !system.family || !system.status) return false;
    if (system.strangeness !== 0) return false;
    if (!Array.isArray(system.sources)) return false;
    if (system.status === "observed" && system.sources.length === 0) return false;
    return true;
  }

  return Object.freeze({ SOURCES, systems, list, get, validateSystem });
});
