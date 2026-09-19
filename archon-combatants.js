"use strict";

// Original Archon combat identities, kept separate from the strategy-state
// module so the future arena renderer can consume them directly.
(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.ChessAtlasArchonCombatants = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const combatants = Object.freeze({
    light: Object.freeze({
      wizard: Object.freeze({ attack: "fireball", movement: "teleport", range: 3, spellcaster: true }),
      unicorn: Object.freeze({ attack: "energy-bolt", movement: "ground", range: 4 }),
      archer: Object.freeze({ attack: "arrow", movement: "ground", range: 3 }),
      golem: Object.freeze({ attack: "boulder", movement: "ground", range: 3 }),
      valkyrie: Object.freeze({ attack: "returning-spear", movement: "fly", range: 3 }),
      djinni: Object.freeze({ attack: "whirlwind", movement: "fly", range: 4 }),
      phoenix: Object.freeze({ attack: "fiery-explosion", movement: "fly", range: 5, special: "invulnerable-during-fire-form" }),
      knight: Object.freeze({ attack: "sword", movement: "ground", range: 3, melee: true })
    }),
    dark: Object.freeze({
      sorceress: Object.freeze({ attack: "lightning-bolt", movement: "teleport", range: 3, spellcaster: true }),
      basilisk: Object.freeze({ attack: "eye-beam", movement: "ground", range: 3 }),
      manticore: Object.freeze({ attack: "quills", movement: "ground", range: 3 }),
      troll: Object.freeze({ attack: "boulder", movement: "ground", range: 3 }),
      shapeshifter: Object.freeze({ attack: "mirror-opponent", movement: "fly", range: 5, special: "copy-opponent-form-and-abilities" }),
      dragon: Object.freeze({ attack: "fiery-breath", movement: "fly", range: 4 }),
      banshee: Object.freeze({ attack: "life-draining-wail", movement: "fly", range: 3, special: "area-attack" }),
      goblin: Object.freeze({ attack: "club", movement: "ground", range: 3, melee: true })
    })
  });

  const spells = Object.freeze([
    "teleport", "heal", "shift-time", "exchange",
    "summon-elemental", "revive", "imprison"
  ]);

  function profile(side, type) {
    return combatants[side] && combatants[side][type] || null;
  }

  function arenaProfile(side, type, opponentSide, opponentType) {
    const base = profile(side, type);
    if (!base) return null;
    if (type !== "shapeshifter") return base;
    const opponent = profile(opponentSide, opponentType);
    return opponent ? Object.freeze({ ...opponent, copiedBy: "shapeshifter" }) : base;
  }

  return Object.freeze({ combatants, spells, profile, arenaProfile });
});
