// Lanezel Havenwood — Level 9 Aasimar Aberrant Sorcerer
// Hardcoded character data from LANEZEL.md, SORCERER.md, SPECIES.md, SPELLS.md, CREATURES.md

export const CHARACTER = {
  name: 'Lanezel Havenwood',
  class: 'Sorcerer',
  subclass: 'Aberrant Sorcery',
  level: 9,
  background: 'Merchant',
  species: 'Aasimar',
  size: 'Medium',
  speed: 30,
  proficiencyBonus: 4,
  passivePerception: 15,

  ac: 18,         // Fine Mithril 17 + Cloak +1
  maxHp: 56,
  hitDice: { count: 9, die: 6 },
  initiative: 2,  // DEX mod

  abilities: {
    STR: { score: 8,  mod: -1, save: 0  },
    DEX: { score: 14, mod: 2,  save: 3  },
    CON: { score: 15, mod: 2,  save: 7  },
    INT: { score: 10, mod: 0,  save: 1  },
    WIS: { score: 12, mod: 1,  save: 2  },
    CHA: { score: 18, mod: 4,  save: 9  },
  },

  skills: {
    Deception: 8,
    Intimidation: 8,
    Perception: 5,
    Persuasion: 8,
    Religion: 4,
    Survival: 5,
  },

  spellcasting: {
    ability: 'CHA',
    saveDC: 16,
    attackBonus: 8,
  },

  spellSlots: {
    1: 4,
    2: 3,
    3: 3,
    4: 3,
    5: 1,
  },

  sorceryPoints: 9,

  metamagic: ['Careful Spell', 'Empowered Spell'],

  feats: ['Lucky', 'Shadow Touched', 'Warcaster'],

  resistances: ['Necrotic', 'Radiant', 'Psychic', 'Cold', 'Force'],

  languages: ['Common', 'Deep Speech', 'Celestial', 'Undercommon', 'Netherese'],
};

export const ATTUNEMENT = {
  max: 3,
  items: [
    { name: 'Cloak of Protection', effect: '+1 AC, +1 all saves' },
    { name: 'Sapphire of Power', effect: 'Regain 1 spell slot (3rd or lower), 1/dawn' },
    { name: 'Brooch of Shielding', effect: 'Resist Force, immune to Magic Missile' },
  ],
};

export const ABILITY_DETAILS = {
  STR: { profSave: false, saveBreakdown: '-1 mod + 1 Cloak' },
  DEX: { profSave: false, saveBreakdown: '+2 mod + 1 Cloak' },
  CON: { profSave: true,  saveBreakdown: '+2 mod + 4 prof + 1 Cloak' },
  INT: { profSave: false, saveBreakdown: '0 mod + 1 Cloak' },
  WIS: { profSave: false, saveBreakdown: '+1 mod + 1 Cloak' },
  CHA: { profSave: true,  saveBreakdown: '+4 mod + 4 prof + 1 Cloak' },
};

export const TINKER_RECIPES = [
  { name: 'Bell',              hours: 2,  description: 'A small brass bell.' },
  { name: 'Bullseye Lantern',  hours: 8,  description: 'Casts bright light in a 60-ft cone and dim light for an additional 60 ft. Burns 6 hours on a flask of oil.' },
  { name: 'Flask',             hours: 2,  description: 'A small glass or metal container for liquids.' },
  { name: 'Hooded Lantern',    hours: 6,  description: 'Casts bright light in a 30-ft radius and dim light for an additional 30 ft. Can be dimmed to 5 ft. Burns 6 hours on a flask of oil.' },
  { name: 'Hunting Trap',      hours: 6,  description: 'When set, a creature stepping on the plate must make a DC 13 DEX save or take 1d4 Piercing damage and have its Speed reduced to 0. DC 13 STR check to free.' },
  { name: 'Lock',              hours: 10, description: 'A key is provided with the lock. Without the key, a creature can pick the lock with a successful DC 15 DEX check using Thieves\' Tools.' },
  { name: 'Manacles',          hours: 4,  description: 'Metal restraints that can bind a Small or Medium creature. Escaping requires a DC 20 DEX check. Breaking requires a DC 26 STR check.' },
  { name: 'Mirror',            hours: 6,  description: 'A small steel mirror. Useful for looking around corners or checking for vampires.' },
  { name: 'Shovel',            hours: 4,  description: 'A sturdy digging implement.' },
  { name: 'Signal Whistle',    hours: 2,  description: 'A shrill whistle audible out to 600 feet.' },
  { name: 'Tinderbox',         hours: 2,  description: 'A flint, fire steel, and tinder for starting fires.' },
];

export const WEAPONS = [
  { name: 'Dagger',          atkBonus: 6, damage: '1d4+2',  notes: 'Finesse, Light, Nick, Thrown' },
  { name: 'Quarterstaff',    atkBonus: 3, damage: '1d6-1',  notes: '1d8-1 versatile' },
  { name: 'Sorcerous Burst', atkBonus: 8, damage: '2d8',    notes: 'V,S, 120 ft. Exploding 8s' },
  { name: 'Chromatic Orb',   atkBonus: 8, damage: '3d8',    notes: '90 ft. Choose type. Leaps on doubles', spellLevel: 1 },
];

export const SPELLS = [
  // Cantrips
  { level: 0, name: 'Friends',           source: 'Ythryn Goblet', school: 'Enchantment', target: 'single', damageType: null, castTime: 'Action', range: '10 ft.', damage: null, concentration: true, description: 'Advantage on CHA checks vs one creature. 1 minute. Target knows afterward.' },
  { level: 0, name: 'Light',            source: 'Aasimar',   school: 'Evocation',    target: 'utility', damageType: null, castTime: 'Action', range: 'Touch',  damage: null, concentration: false, description: 'Object sheds bright light 20 ft, dim 20 ft more. 1 hour.' },
  { level: 0, name: 'Mage Hand',        source: 'Sorcerer',  school: 'Conjuration',  target: 'utility', damageType: null, castTime: 'Action', range: '30 ft.', damage: null, concentration: false, description: 'Spectral hand manipulates objects. 1 minute.' },
  { level: 0, name: 'Mending',          source: 'Sorcerer',  school: 'Transmutation', target: 'utility', damageType: null, castTime: '1 min',  range: 'Touch',  damage: null, concentration: false, description: 'Repair single break/tear up to 1 ft.' },
  { level: 0, name: 'Mind Sliver',      source: 'Aberrant',  school: 'Enchantment',  target: 'single', damageType: ['Psychic'], castTime: 'Action', range: '60 ft.', damage: '2d6 Psychic', concentration: false, description: 'INT save. -1d4 next save. 1 round.' },
  { level: 0, name: 'Minor Illusion',   source: 'Sorcerer',  school: 'Illusion',     target: 'utility', damageType: null, castTime: 'Action', range: '30 ft.', damage: null, concentration: false, description: 'Sound or image of object, 5-ft cube. 1 minute.' },
  { level: 0, name: 'Prestidigitation', source: 'Sorcerer',  school: 'Transmutation', target: 'utility', damageType: null, castTime: 'Action', range: '10 ft.', damage: null, concentration: false, description: 'Minor magical trick. Up to 3 effects.' },
  { level: 0, name: 'Sorcerous Burst',  source: 'Sorcerer',  school: 'Evocation',    target: 'single', damageType: ['Acid','Cold','Fire','Lightning','Poison','Psychic','Thunder'], castTime: 'Action', range: '120 ft.', damage: '2d8', concentration: false, description: 'Ranged spell attack. Choose damage type. Exploding 8s (up to +4d8).' },

  // 1st Level
  { level: 1, name: 'Chromatic Orb',        source: 'Sorcerer',  school: 'Evocation',    target: 'single', damageType: ['Acid','Cold','Fire','Lightning','Poison','Thunder'], castTime: 'Action', range: '90 ft.', damage: '3d8', concentration: false, description: 'Choose damage type. Ranged spell attack. Leaps on doubles.', upcast: { dieSides: 8, perLevel: 1 } },
  { level: 1, name: 'Dissonant Whispers',   source: 'Aberrant',  school: 'Enchantment',  target: 'single', damageType: ['Psychic'], castTime: 'Action', range: '60 ft.', damage: '3d6 Psychic', concentration: false, spCast: 1, description: 'WIS save. Target flees on fail. 1 SP psionic cast.', upcast: { dieSides: 6, perLevel: 1 } },
  { level: 1, name: 'Shield',               source: 'Sorcerer',  school: 'Abjuration',   target: 'self',   damageType: null, castTime: 'Reaction', range: 'Self', damage: null, concentration: false, description: '+5 AC until start of next turn. Blocks Magic Missile.' },
  { level: 1, name: 'Sleep',                source: 'Aberrant',  school: 'Enchantment',  target: 'area',   damageType: null, castTime: 'Action', range: '60 ft.', damage: null, concentration: true, spCast: 1, description: '5-ft sphere. WIS save or Incapacitated/Unconscious.' },

  // 2nd Level
  { level: 2, name: "Auril's Binding Ice", source: 'Auril',  school: 'Evocation',    target: 'area',   damageType: ['Cold'], castTime: 'Action', range: 'Self (30-ft cone)', damage: '3d8 Cold', concentration: false, freeCast: true, description: 'CON save. Half dmg on success. Fail: speed 0 for 1 min. Free 1/day.', upcast: { dieSides: 8, perLevel: 1 } },
  { level: 2, name: 'Detect Thoughts',  source: 'Aberrant',  school: 'Divination',   target: 'self',   damageType: null, castTime: 'Action', range: 'Self',   damage: null, concentration: true, spCast: 2, description: 'Sense/read thoughts within 30 ft. 2 SP psionic cast.' },
  { level: 2, name: 'Invisibility',     source: 'Sorcerer',  school: 'Illusion',     target: 'ally',   damageType: null, castTime: 'Action', range: 'Touch',  damage: null, concentration: true, description: 'Invisible until attack/damage/cast.' },
  { level: 2, name: 'Mind Whip',        source: 'Sorcerer',  school: 'Enchantment',  target: 'single', damageType: ['Psychic'], castTime: 'Action', range: '90 ft.', damage: '3d6 Psychic', concentration: false, description: 'INT save. Limits actions on fail.', upcast: { dieSides: 6, perLevel: 1 } },
  { level: 2, name: 'Mirror Image',     source: 'Sorcerer',  school: 'Illusion',     target: 'self',   damageType: null, castTime: 'Action', range: 'Self',   damage: null, concentration: false, description: '3 duplicates. d6 absorbs hits on 3+. 1 minute.' },
  { level: 2, name: 'Suggestion',       source: 'Aberrant',  school: 'Enchantment',  target: 'single', damageType: null, castTime: 'Action', range: '30 ft.', damage: null, concentration: true, spCast: 2, description: 'WIS save. 25-word suggestion. Charmed 8 hrs.' },
  { level: 2, name: 'Web',              source: 'Sorcerer',  school: 'Conjuration',  target: 'area',   damageType: null, castTime: 'Action', range: '60 ft.', damage: null, concentration: true, description: '20-ft cube. Difficult terrain. DEX save or Restrained.' },

  // 3rd Level
  { level: 3, name: 'Counterspell',     source: 'Sorcerer',  school: 'Abjuration',   target: 'single', damageType: null, castTime: 'Reaction', range: '60 ft.', damage: null, concentration: false, description: 'Interrupt spell. Target makes CON save.' },
  { level: 3, name: 'Fear',             source: 'Sorcerer',  school: 'Illusion',     target: 'area',   damageType: null, castTime: 'Action', range: 'Self (30-ft cone)', damage: null, concentration: true, description: 'WIS save or Frightened. Must Dash away.' },
  { level: 3, name: 'Fireball',         source: 'Sorcerer',  school: 'Evocation',    target: 'area',   damageType: ['Fire'], castTime: 'Action', range: '150 ft.', damage: '8d6 Fire', concentration: false, description: '20-ft sphere. DEX save. Half on success.', upcast: { dieSides: 6, perLevel: 1 } },
  { level: 3, name: 'Haste',            source: 'Sorcerer',  school: 'Transmutation', target: 'ally',   damageType: null, castTime: 'Action', range: '30 ft.', damage: null, concentration: true, description: 'Willing creature: +2 AC, double speed, extra action. 1 min. Lethargy when ends.' },
  { level: 3, name: 'Sending',          source: 'Aberrant',  school: 'Divination',   target: 'utility', damageType: null, castTime: 'Action', range: 'Unlimited', damage: null, concentration: false, description: '25-word message to known creature. Any plane.' },
  { level: 3, name: 'Void of Torment',  source: 'Aberrant',  school: 'Conjuration',  target: 'area',   damageType: ['Cold','Acid'], castTime: 'Action', range: '150 ft.', damage: '2d6 Cold + 2d6 Acid', concentration: true, description: '20-ft sphere darkness. Cold start, Acid end of turn.', upcast: { dieSides: 6, perLevel: 1, note: 'Cold or Acid' } },

  // 4th Level
  { level: 4, name: 'Backlash',             source: 'Sorcerer',  school: 'Abjuration',   target: 'self',   damageType: ['Force'], castTime: 'Reaction', range: '60 ft.', damage: '4d6 Force', concentration: false, description: 'Reduce damage by 4d6+CHA mod. If from creature in range, CON save: 4d6 Force (half on success).', upcast: { dieSides: 6, perLevel: 1 } },
  { level: 4, name: 'Dimension Door',       source: 'Sorcerer',  school: 'Conjuration',  target: 'utility', damageType: null, castTime: 'Action', range: '500 ft.', damage: null, concentration: false, description: 'Teleport self + 1 willing creature.' },
  { level: 4, name: 'Otherworldly Tentacles', source: 'Aberrant', school: 'Conjuration', target: 'area',   damageType: ['Bludgeoning'], castTime: 'Action', range: '90 ft.', damage: '3d6 Bludgeoning', concentration: true, description: '20-ft square. STR save. Restrained on fail.' },
  { level: 4, name: 'Polymorph',            source: 'Sorcerer',  school: 'Transmutation', target: 'single',  damageType: null, castTime: 'Action', range: '60 ft.', damage: null, concentration: true, description: 'Transform creature into beast of equal or lower CR.' },
  { level: 4, name: 'Summon Aberration',     source: 'Aberrant',  school: 'Conjuration',  target: 'ally',  damageType: null, castTime: 'Action', range: '90 ft.', damage: null, concentration: true, description: 'Summon Beholderkin, Mind Flayer, or Slaad spirit.' },

  // 5th Level
  { level: 5, name: "Bigby's Hand",         source: 'Sorcerer',  school: 'Evocation',    target: 'single', damageType: ['Force','Bludgeoning'], castTime: 'Action', range: '120 ft.', damage: '4d8 Force', concentration: true, description: 'Large spectral hand (AC 20, HP = your max). Bonus action: Fist (4d8 Force attack), Push (STR contest), Grapple (2d6+4 crush), or Interpose (half cover).', upcast: { dieSides: 8, perLevel: 2, note: 'Fist +2d8, Crush +2d6 per level' } },
  { level: 5, name: 'Telekinesis',          source: 'Aberrant',  school: 'Transmutation', target: 'single', damageType: null, castTime: 'Action', range: '60 ft.', damage: null, concentration: true, description: 'Move creature (STR contest) or object up to 1000 lbs. Bonus action sustain.' },
  { level: 5, name: 'Telepathic Bond',      source: 'Aberrant',  school: 'Divination',   target: 'ally',  damageType: null, castTime: 'Action', range: '30 ft.', damage: null, concentration: false, description: 'Up to 8 willing creatures share telepathic link. 1 hour.' },
];

export const CREATURES = {
  beholderkin: {
    name: 'Aberrant Spirit (Beholderkin)',
    size: 'Medium', type: 'Aberration',
    ac: '15 (11 + spell level)',
    hp: '40 (+ 10/level above 4th)',
    speed: '30 ft., fly 30 ft. (hover)',
    abilities: { STR: 16, DEX: 10, CON: 15, INT: 16, WIS: 10, CHA: 6 },
    immunities: 'Psychic',
    attacks: [{ name: 'Eye Ray', type: 'Ranged', bonus: '+8', damage: '1d8+3+4 Psychic', range: '150 ft.' }],
    multiattack: 2,
    notes: 'Attacks = half spell level (round down)',
  },
  mindFlayer: {
    name: 'Aberrant Spirit (Mind Flayer)',
    size: 'Medium', type: 'Aberration',
    ac: '15 (11 + spell level)',
    hp: '40 (+ 10/level above 4th)',
    speed: '30 ft.',
    abilities: { STR: 16, DEX: 10, CON: 15, INT: 16, WIS: 10, CHA: 6 },
    immunities: 'Psychic',
    attacks: [{ name: 'Psychic Slam', type: 'Melee', bonus: '+8', damage: '1d8+3+4 Psychic', range: '5 ft.' }],
    multiattack: 2,
    aura: 'Whispering Aura: DC 16 WIS save, 2d6 Psychic to creatures within 5 ft.',
    notes: 'Attacks = half spell level (round down)',
  },
  slaad: {
    name: 'Aberrant Spirit (Slaad)',
    size: 'Medium', type: 'Aberration',
    ac: '15 (11 + spell level)',
    hp: '40 (+ 10/level above 4th)',
    speed: '30 ft.',
    abilities: { STR: 16, DEX: 10, CON: 15, INT: 16, WIS: 10, CHA: 6 },
    immunities: 'Psychic',
    attacks: [{ name: 'Claw', type: 'Melee', bonus: '+8', damage: '1d10+3+4 Slashing', range: '5 ft.' }],
    multiattack: 2,
    regen: 5,
    notes: 'Regeneration 5 HP/turn. Anti-healing on hit. Attacks = half spell level.',
  },
  xanthrid: {
    name: 'Xanthrid',
    size: 'Large', type: 'Aberration',
    ac: '12', hp: '19 (3d10+3)',
    speed: '5 ft., fly 60 ft.',
    abilities: { STR: 13, DEX: 15, CON: 12, INT: 10, WIS: 14, CHA: 10 },
    resistances: 'Acid, Psychic',
    attacks: [{ name: 'Slashing Tail', type: 'Melee', bonus: '+4', damage: '1d10+2 Slashing', range: '5 ft.' }],
    traits: ['Flyby: No opportunity attacks when flying out of reach'],
    spells: ['At will: Detect Evil and Good, Detect Magic', '1/day: Clairvoyance'],
  },
};

export const ABERRANT_SPIRIT = {
  baseAC: 11,
  baseHp: 40,
  hpPerLevel: 10,
  baseLevel: 4,
  profBonus: 4,
  abilities: { STR: { score: 16, mod: 3 }, DEX: { score: 10, mod: 0 }, CON: { score: 15, mod: 2 }, INT: { score: 16, mod: 3 }, WIS: { score: 10, mod: 0 }, CHA: { score: 6, mod: -2 } },
  immunities: ['Psychic'],
  spellAttackBonus: 8,
  spellSaveDC: 16,
  forms: {
    beholderkin: {
      label: 'Beholderkin',
      speed: '30 ft., fly 30 ft. (hover)',
      attack: { name: 'Eye Ray', type: 'Ranged Spell Attack', bonus: 8, range: '150 ft.', dieSides: 8, dieCount: 1, damageType: 'Psychic' },
      traits: [],
    },
    slaad: {
      label: 'Slaad',
      speed: '30 ft.',
      attack: { name: 'Claws', type: 'Melee Weapon Attack', bonus: 8, range: '5 ft.', dieSides: 10, dieCount: 1, damageType: 'Slashing' },
      traits: ['Regeneration: regains 5 HP at start of turn if it has at least 1 HP.', 'Anti-healing: target hit can\'t regain HP until start of aberration\'s next turn.'],
    },
    mindflayer: {
      label: 'Mind Flayer',
      speed: '30 ft.',
      attack: { name: 'Psychic Slam', type: 'Melee Spell Attack', bonus: 8, range: '5 ft.', dieSides: 8, dieCount: 1, damageType: 'Psychic' },
      traits: ['Whispering Aura: at start of each turn, each creature within 5 ft. must succeed on WIS save (DC 16) or take 2d6 psychic damage.'],
    },
  },
  getAC(castLevel) { return this.baseAC + castLevel; },
  getMaxHp(castLevel) { return this.baseHp + Math.max(0, castLevel - this.baseLevel) * this.hpPerLevel; },
  getMultiattack(castLevel) { return Math.floor(castLevel / 2); },
  getAttackDamage(form, castLevel) {
    const atk = this.forms[form].attack;
    return { count: atk.dieCount, sides: atk.dieSides, modifier: 3 + castLevel, type: atk.damageType };
  },
};

export const XANTHRID_COMPANION = {
  name: 'Xanthrid',
  size: 'Large',
  type: 'Aberration',
  ac: 12,
  maxHp: 19,
  speed: '5 ft., fly 60 ft.',
  abilities: { STR: { score: 13, mod: 1 }, DEX: { score: 15, mod: 2 }, CON: { score: 12, mod: 1 }, INT: { score: 10, mod: 0 }, WIS: { score: 14, mod: 2 }, CHA: { score: 10, mod: 0 } },
  skills: 'Perception +6, Stealth +6',
  resistances: ['Acid', 'Psychic'],
  senses: 'Darkvision 120 ft., passive Perception 16',
  languages: 'Undercommon',
  attack: { name: 'Slashing Tail', type: 'Melee', bonus: 4, range: '5 ft.', dieCount: 1, dieSides: 10, modifier: 2, damageType: 'Slashing' },
  traits: ['Flyby: Doesn\'t provoke Opportunity Attacks when flying out of reach.'],
  spells: {
    atWill: ['Detect Evil and Good', 'Detect Magic'],
    daily: [{ name: 'Clairvoyance', uses: 1 }],
  },
};

export const POLYMORPH_FORMS = {
  greatYeti: {
    label: 'Great Yeti',
    size: 'Huge',
    ac: 12,
    thp: 168,
    speed: '40 ft., climb 40 ft.',
    abilities: { STR: { score: 23, mod: 6 }, DEX: { score: 14, mod: 2 }, CON: { score: 18, mod: 4 }, INT: { score: 7, mod: -2 }, WIS: { score: 12, mod: 1 }, CHA: { score: 7, mod: -2 } },
    skills: 'Athletics +9, Perception +4, Survival +4',
    saves: null,
    immunities: null,
    senses: null,
    multiattack: { count: 2, label: '2 Claw attacks' },
    attacks: [
      { name: 'Claw', type: 'Melee', bonus: 9, reach: '10 ft.', dieCount: 3, dieSides: 10, modifier: 6, damageType: 'Slashing', notes: null },
    ],
    specials: [
      { name: 'Hurl Ice', recharge: '6', type: 'action', description: '90 ft range, DEX save DC 17, 5-ft sphere, 7d6 Bludgeoning. Large or smaller Prone on fail, half on success.', dieCount: 7, dieSides: 6, modifier: 0, damageType: 'Bludgeoning', saveDC: 17, saveAbility: 'DEX' },
    ],
    bonusActions: [
      { name: 'Leap', description: 'Jump up to 30 ft by spending 10 ft of movement.' },
    ],
    traits: [],
  },
  frostSalamander: {
    label: 'Frost Salamander',
    size: 'Huge',
    ac: 13,
    thp: 136,
    speed: '50 ft.',
    abilities: { STR: { score: 25, mod: 7 }, DEX: { score: 10, mod: 0 }, CON: { score: 19, mod: 4 }, INT: { score: 2, mod: -4 }, WIS: { score: 12, mod: 1 }, CHA: { score: 9, mod: -1 } },
    skills: 'Perception +4',
    saves: 'STR +10, WIS +4',
    immunities: null,
    senses: null,
    multiattack: { count: 2, label: '1 Claws + 1 Tail Sweep' },
    attacks: [
      { name: 'Claws', type: 'Melee', bonus: 10, reach: '10 ft.', dieCount: 4, dieSides: 12, modifier: 7, damageType: 'Slashing', notes: 'Grapple DC 17 on hit' },
      { name: 'Tail Sweep', type: 'Melee', bonus: 10, reach: '15 ft.', dieCount: 4, dieSides: 8, modifier: 7, damageType: 'Bludgeoning', notes: 'Prone if Huge or smaller' },
    ],
    specials: [],
    bonusActions: [],
    traits: [],
  },
  grickAncient: {
    label: 'Grick Ancient',
    size: 'Large',
    ac: 18,
    thp: 135,
    speed: '30 ft., climb 30 ft.',
    abilities: { STR: { score: 18, mod: 4 }, DEX: { score: 16, mod: 3 }, CON: { score: 15, mod: 2 }, INT: { score: 4, mod: -3 }, WIS: { score: 14, mod: 2 }, CHA: { score: 9, mod: -1 } },
    skills: 'Stealth +6',
    saves: null,
    immunities: null,
    senses: 'Darkvision 60 ft.',
    multiattack: { count: 3, label: '1 Beak + 1 Slam + 1 Tentacles' },
    attacks: [
      { name: 'Beak', type: 'Melee', bonus: 7, reach: '10 ft.', dieCount: 4, dieSides: 8, modifier: 4, damageType: 'Piercing', notes: null },
      { name: 'Slam', type: 'Melee', bonus: 7, reach: '10 ft.', dieCount: 1, dieSides: 6, modifier: 4, damageType: 'Bludgeoning', notes: 'Prone if Large or smaller' },
      { name: 'Tentacles', type: 'Melee', bonus: 7, reach: '10 ft.', dieCount: 2, dieSides: 10, modifier: 4, damageType: 'Slashing', notes: 'Grapple DC 14 if Large or smaller' },
    ],
    specials: [],
    bonusActions: [],
    traits: [],
  },
  frostGiant: {
    label: 'Frost Giant',
    size: 'Huge',
    ac: 15,
    thp: 149,
    speed: '40 ft.',
    abilities: { STR: { score: 23, mod: 6 }, DEX: { score: 9, mod: -1 }, CON: { score: 21, mod: 5 }, INT: { score: 9, mod: -1 }, WIS: { score: 10, mod: 0 }, CHA: { score: 12, mod: 1 } },
    skills: 'Athletics +9, Perception +3',
    saves: 'CON +8, WIS +3, CHA +4',
    immunities: 'Cold',
    senses: null,
    multiattack: { count: 2, label: '2 attacks (Greataxe or Great Bow)' },
    attacks: [
      { name: 'Greataxe', type: 'Melee', bonus: 9, reach: '10 ft.', dieCount: 2, dieSides: 12, modifier: 6, damageType: 'Slashing', extraDice: { count: 2, sides: 8, type: 'Cold' }, notes: '+2d8 Cold' },
      { name: 'Great Bow', type: 'Ranged', bonus: 9, range: '150/600 ft.', dieCount: 2, dieSides: 10, modifier: 6, damageType: 'Piercing', extraDice: { count: 2, sides: 6, type: 'Cold' }, notes: '+2d6 Cold, target speed -10 ft' },
    ],
    specials: [
      { name: 'War Cry', recharge: '5-6', type: 'action', description: 'One creature gains 2d10+5 Temp HP + Advantage on attacks until start of giant\'s next turn.', dieCount: 2, dieSides: 10, modifier: 5, damageType: 'Temp HP', saveDC: null, saveAbility: null },
    ],
    bonusActions: [],
    traits: [],
  },
};

export const RESOURCE_LIMITS = {
  lucky: 4,
  innateSorcery: 2,
  healingHands: 1,
  celestialRevelation: 1,
  sorcerousRestoration: 1,  // 1 use per long rest
  sapphireRecharge: 1,
  rimesBindingIceFree: 1,
  wandOfSecrets: 3,
  wandOfMagicMissiles: 7,
  xanthrid: 1,
  aurilsAbode: 1,
};

export const CONDITIONS = [
  'Blinded', 'Charmed', 'Deafened', 'Frightened', 'Grappled',
  'Incapacitated', 'Invisible', 'Paralyzed', 'Petrified',
  'Poisoned', 'Prone', 'Restrained', 'Stunned', 'Unconscious',
];

export const STORE_POTIONS = [
  { name: 'Healing Potion',               notes: '2d4+2 HP',          healing: { count: 2, sides: 4, bonus: 2 } },
  { name: 'Greater Healing Potion',       notes: '4d4+4 HP',          healing: { count: 4, sides: 4, bonus: 4 } },
  { name: 'Superior Healing Potion',      notes: '8d4+8 HP',          healing: { count: 8, sides: 4, bonus: 8 } },
  { name: 'Supreme Healing Potion',       notes: '10d4+20 HP',        healing: { count: 10, sides: 4, bonus: 20 } },
  { name: 'Potion of Acid Resistance',    notes: 'Resist Acid, 1 hr' },
  { name: 'Potion of Cold Resistance',    notes: 'Resist Cold, 1 hr' },
  { name: 'Potion of Fire Resistance',    notes: 'Resist Fire, 1 hr' },
  { name: 'Potion of Force Resistance',   notes: 'Resist Force, 1 hr' },
  { name: 'Potion of Lightning Resistance', notes: 'Resist Lightning, 1 hr' },
  { name: 'Potion of Necrotic Resistance', notes: 'Resist Necrotic, 1 hr' },
  { name: 'Potion of Poison Resistance',  notes: 'Resist Poison, 1 hr' },
  { name: 'Potion of Psychic Resistance', notes: 'Resist Psychic, 1 hr' },
  { name: 'Potion of Radiant Resistance', notes: 'Resist Radiant, 1 hr' },
  { name: 'Potion of Thunder Resistance', notes: 'Resist Thunder, 1 hr' },
  { name: 'Potion of Flying',             notes: 'Fly 60 ft, 1 hr' },
  { name: 'Potion of Invisibility',       notes: 'Invisible, 1 hr' },
  { name: 'Potion of Speed',              notes: 'Haste, 1 min' },
  { name: 'Potion of Giant Strength (Hill)',   notes: 'STR 21, 1 hr' },
  { name: 'Potion of Giant Strength (Frost)',  notes: 'STR 23, 1 hr' },
  { name: 'Potion of Giant Strength (Fire)',   notes: 'STR 25, 1 hr' },
  { name: 'Potion of Heroism',            notes: '10 temp HP, Bless, 1 hr' },
  { name: 'Potion of Mind Reading',       notes: 'Detect Thoughts, 1 min' },
  { name: 'Potion of Water Breathing',    notes: 'Breathe underwater, 1 hr' },
];

export const DAMAGE_TYPES = [
  'Acid', 'Bludgeoning', 'Cold', 'Fire', 'Force', 'Lightning',
  'Necrotic', 'Piercing', 'Poison', 'Psychic', 'Radiant', 'Slashing', 'Thunder',
];

export const SPELL_SLOT_COSTS = {
  1: 2, 2: 3, 3: 5, 4: 6, 5: 7,
};

export const PANEL_DESCRIPTIONS = {
  'Hit Points': 'Your current Hit Points. Take damage to reduce, heal to restore. When you reach 0 HP, you fall Unconscious and start making Death Saves. Temp HP is a buffer that absorbs damage first but cannot be healed — it stacks by replacement (higher value wins), not addition.',
  'Exhaustion': 'Exhaustion is measured in levels (1-6). While you have 1+ levels, you subtract your exhaustion level from every d20 Test. At 6 levels, you die. You lose 1 level when you finish a Long Rest with food and drink.',
  'Concentration': 'Some spells require Concentration to maintain. You can only concentrate on one spell at a time. Taking damage forces a CON save (DC = 10 or half damage, whichever is higher) to maintain it. Being Incapacitated or killed ends Concentration automatically.',
  'Death Saves': 'At 0 HP, roll a d20 at the start of each turn. 10+ = success, 9 or lower = failure. 3 successes = stabilize at 0 HP. 3 failures = death. Natural 20 = regain 1 HP. Natural 1 = 2 failures. Taking damage at 0 HP = automatic failure (crit = 2 failures).',
  'Spell Slots': 'Spell slots are expended to cast leveled spells. You can cast a lower-level spell using a higher-level slot (upcasting), often with increased effect. All slots restore on a Long Rest.',
  'Sorcery Points': 'Sorcery Points fuel Metamagic and Psionic Sorcery. Font of Magic (Bonus Action): spend SP to create a spell slot, or expend a slot to gain SP equal to its level. Created slots are temporary — they can exceed your base maximum but vanish on Long Rest. Costs: 1st=2 SP, 2nd=3 SP, 3rd=5 SP, 4th=6 SP, 5th=7 SP. Max 9 SP, restored on Long Rest.',
  'Hit Dice (d6)': 'During a Short Rest, you can spend Hit Dice to heal. Roll 1d6 + CON modifier (+2) per die spent. You have 9 total (one per level). All are restored on a Long Rest.',
};

export const LANGUAGE_DESCRIPTIONS = {
  Common: 'The trade language spoken by most humanoids across Faerûn.',
  'Deep Speech': 'The language of aberrations — mind flayers, beholders, and other entities from the Far Realm.',
  Celestial: 'The language of celestials — angels, couatls, and other beings of the Upper Planes.',
  Undercommon: 'A trade language used throughout the Underdark, derived from Elvish and adapted by drow, duergar, and other subterranean peoples.',
  Netherese: 'An ancient language of the fallen empire of Netheril, used in arcane texts and old magical inscriptions.',
};

export const RESISTANCE_DESCRIPTIONS = {
  Necrotic: 'You take half damage from Necrotic sources. From Celestial heritage (Aasimar).',
  Radiant: 'You take half damage from Radiant sources. From Celestial heritage (Aasimar).',
  Psychic: 'You take half damage from Psychic sources. From Aberrant Mind Sorcerer subclass (Psionic Resilience).',
  Cold: 'You take half damage from Cold sources. From Ring of Cold Resistance (requires Attunement).',
  Force: 'You take half damage from Force sources. From Brooch of Shielding (requires Attunement). Also grants immunity to damage from the Magic Missile spell.',
};

export const CONDITION_DESCRIPTIONS = {
  Blinded: "You can't see. Attack rolls against you have Advantage. Your attack rolls have Disadvantage.",
  Charmed: "You can't attack the charmer or target them with harmful abilities or magic. The charmer has Advantage on Charisma checks to interact with you.",
  Deafened: "You can't hear. You automatically fail any ability check that requires hearing.",
  Frightened: "You have Disadvantage on ability checks and attack rolls while the source of fear is within line of sight. You can't willingly move closer to the source.",
  Grappled: "Your Speed becomes 0 and you can't benefit from any bonus to Speed. The condition ends if the grappler is Incapacitated or you are moved outside the grapple's range.",
  Incapacitated: "You can't take Actions, Bonus Actions, or Reactions.",
  Invisible: "You're impossible to see without magic or a special sense. You are heavily obscured. Attack rolls against you have Disadvantage, and your attacks have Advantage.",
  Paralyzed: "You are Incapacitated and can't move or speak. Attack rolls against you have Advantage. Any hit from within 5 feet is a Critical Hit. You auto-fail STR and DEX saves.",
  Petrified: "You are transformed into a solid inanimate substance. You are Incapacitated, can't move or speak, and are unaware. Attack rolls against you have Advantage. You auto-fail STR and DEX saves. Resistance to all damage. Immune to poison and disease.",
  Poisoned: "You have Disadvantage on attack rolls and ability checks.",
  Prone: "Your only movement option is to crawl (half speed). You have Disadvantage on attack rolls. Attacks within 5 ft have Advantage against you; attacks beyond 5 ft have Disadvantage.",
  Restrained: "Your Speed becomes 0. Attack rolls against you have Advantage. Your attack rolls have Disadvantage. You have Disadvantage on DEX saves.",
  Stunned: "You are Incapacitated, can't move, and can speak only falteringly. Attack rolls against you have Advantage. You auto-fail STR and DEX saves.",
  Unconscious: "You are Incapacitated, can't move or speak, and are unaware. You drop what you're holding and fall Prone. Attack rolls against you have Advantage. Hits from within 5 ft are Critical Hits. You auto-fail STR and DEX saves.",
};

export const STAT_DESCRIPTIONS = {
  'Armor Class': 'How hard you are to hit. 17 base (Fine Mithril) + 1 (Cloak of Protection) = 18.',
  'Speed': 'Distance you can move on your turn.',
  'Initiative': 'Added to a d20 roll to determine turn order. Based on DEX modifier (+2).',
  'Proficiency': 'Bonus added to attacks, saves, and skills you are proficient in. Based on character level.',
  'Spell Save DC': '8 + proficiency (+4) + CHA (+4) = 16. The DC enemies must beat on your spell saves.',
  'Spell Attack': 'Proficiency (+4) + CHA (+4) = +8. Added to d20 when making spell attack rolls.',
};

export const SKILL_DESCRIPTIONS = {
  Deception: 'CHA. Convincingly hide the truth through words or actions.',
  Intimidation: 'CHA. Influence someone through overt threats, hostile actions, or physical violence.',
  Perception: 'WIS. Spot, hear, or otherwise detect the presence of something.',
  Persuasion: 'CHA. Influence someone with tact, social graces, or good nature.',
  Religion: 'INT. Recall lore about deities, rites, prayers, religious hierarchies, and holy symbols.',
  Survival: 'WIS. Follow tracks, hunt wild game, guide your group through wilderness, predict weather, or avoid quicksand.',
};

export const RESOURCE_DESCRIPTIONS = {
  lucky: 'You have inexplicable luck. You have 4 Luck Points. Whenever you make a d20 Test, you can spend a Luck Point to roll an additional d20 and choose which one to use. You regain expended Luck Points when you finish a Long Rest.',
  innateSorcery: 'As a Bonus Action, you can unleash the sorcery within. For 1 minute, your spell save DC and spell attack bonus each increase by 1. You can use this feature twice, regaining all uses on a Long Rest.',
  healingHands: 'As a Magic action, you touch a creature and roll a number of d4s equal to your Proficiency Bonus (+4 = 4d4). The creature regains Hit Points equal to the total rolled. Once per Long Rest.',
  celestialRevelation: 'As a Bonus Action, you gain one of: Inner Radiance (bright light 10 ft, dim 20 ft; once per turn deal extra Radiant damage equal to proficiency), Heavenly Wings (fly speed equal to walk speed), or Unearthly Visage (advantage on Charisma checks). Lasts 1 minute. Once per Long Rest.',
  sorcerousRestoration: 'During a Short Rest, you can regain expended Sorcery Points equal to half your Sorcerer level (rounded down). Once per Long Rest.',
  sapphireRecharge: 'Sapphire of Power. While this sapphire is on your person, you can speak its command word to regain one expended spell slot of 3rd level or lower. Once used, it can\'t be used again until the next dawn. Requires Attunement by a spellcaster.',
  rimesBindingIceFree: 'You can cast Auril\'s Binding Ice once without using a spell slot. Recharges on a Long Rest.',
  wandOfSecrets: 'While holding this wand, you can take a Magic action to expend 1 charge. If a secret door or trap is within 30 feet of you, the wand pulses and points to the closest one. 3 charges, regains all daily at dawn.',
  wandOfMagicMissiles: 'This wand has 7 charges. While holding it, you can expend charges to cast Magic Missile: 1 charge for 1st level (3 darts), 2 charges for 2nd level (4 darts), 3 charges for 3rd level (5 darts). Each dart deals 1d4+1 Force damage. The wand regains 1d6+1 charges daily at dawn. If you expend the last charge, roll a d20 — on a 1, the wand crumbles to dust.',
  xanthrid: 'Xanthrid — Celestial Ray companion. Once per Long Rest.',
  aurilsAbode: 'This shard of ice never melts, always chilling whatever it touches. As a Magic Action, it transforms into a protective shelter within 30 feet of you. The shelter must fit in a 40-foot Cube. It has one door and up to four windows, which only you can open or close. It has a floor and a roof and maintains a comfortable temperature inside. The shelter has AC 15, 30 Hit Points, and immunity to poison and psychic damage. The shelter lasts for 24 hours, until you dismiss it as a Magic Action, or until it is reduced to 0 Hit Points. Once used, it can\'t transform again until the next dawn.',
};

export const INVENTORY = [
  { name: 'Healing Potion',             category: 'Potions',     qty: 1, notes: '2d4+2 HP', description: 'A character who drinks the magical red fluid in this vial regains 2d4+2 Hit Points. Drinking or administering a potion takes a Bonus Action.', healing: { count: 2, sides: 4, bonus: 2 } },
  { name: 'Greater Healing Potion',     category: 'Potions',     qty: 1, notes: '4d4+4 HP', description: 'A character who drinks the magical red fluid in this vial regains 4d4+4 Hit Points. Drinking or administering a potion takes a Bonus Action.', healing: { count: 4, sides: 4, bonus: 4 } },
  { name: 'Potion of Cold Resistance',  category: 'Potions',     qty: 1, notes: 'Resist Cold, 1 hr', description: 'When you drink this potion, you gain Resistance to Cold damage for 1 hour.' },
  { name: 'Wand of Secrets',            category: 'Magic Items', qty: 1, notes: '3/day — detects secret doors/traps within 30 ft', description: 'While holding this wand, you can take a Magic action to expend 1 charge. If a secret door or trap is within 30 feet of you, the wand pulses and points to the closest one. The wand has 3 charges and regains all expended charges daily at dawn.' },
  { name: 'Ring of Cold Resistance',    category: 'Magic Items', qty: 1, notes: 'Resist Cold (attune)', description: 'While wearing this ring, you have Resistance to Cold damage. Requires Attunement.' },
  { name: 'Cloak of Protection',       category: 'Magic Items', qty: 1, notes: '+1 AC, +1 saves (attune)', description: 'While wearing this cloak, you gain a +1 bonus to AC and saving throws. Requires Attunement.' },
  { name: 'Wand of Magic Missiles',    category: 'Magic Items', qty: 1, notes: '7 charges — Magic Missile up to 3rd level', description: 'This wand has 7 charges. Expend 1-3 charges to cast Magic Missile at 1st-3rd level (3-5 darts, 1d4+1 Force each). Regains 1d6+1 charges at dawn. If last charge spent, roll d20 — on a 1 the wand is destroyed.' },
  { name: 'Brooch of Shielding',       category: 'Magic Items', qty: 1, notes: 'Resist Force, immune to Magic Missile (attune)', description: 'While wearing this brooch, you have Resistance to Force damage, and you are immune to damage from the Magic Missile spell. Requires Attunement.' },
  { name: 'Sapphire of Power',        category: 'Magic Items', qty: 1, notes: 'Regain 1 spell slot (3rd or lower), 1/dawn (attune)', description: 'While this sapphire is on your person, you can speak its command word to regain one expended spell slot of 3rd level or lower. Once used, it can\'t be used again until the next dawn. Requires Attunement by a spellcaster.' },
  { name: 'Dagger',                     category: 'Weapons',     qty: 2, description: 'Finesse, Light, Thrown (range 20/60). 1d4 Piercing damage.' },
  { name: 'Quarterstaff',               category: 'Weapons',     qty: 1, description: 'Versatile. 1d6 Bludgeoning (1d8 two-handed).' },
  { name: 'Sling',                      category: 'Weapons',     qty: 1, description: 'Ammunition (range 30/120). 1d4 Bludgeoning damage.' },
  { name: 'Backpack',                    category: 'Gear',        qty: 1, description: 'A sturdy pack for carrying equipment.' },
  { name: 'Bedroll',                    category: 'Gear',        qty: 1, description: 'A padded sleeping roll.' },
  { name: 'Mess Kit',                   category: 'Gear',        qty: 1, description: 'A tin box containing a cup, utensils, and a small pot.' },
  { name: 'Tinderbox',                  category: 'Gear',        qty: 1, description: 'A flint, fire steel, and tinder for starting fires.' },
  { name: 'Torch',                      category: 'Gear',        qty: 10, description: 'Bright light 20 ft, dim light 20 ft more. Burns for 1 hour. 1 Fire damage as improvised weapon.' },
  { name: 'Rations',                    category: 'Gear',        qty: 10, notes: 'days', description: 'Dried food sufficient for one day of sustenance.' },
  { name: 'Waterskin',                  category: 'Gear',        qty: 1, description: 'Holds 4 pints of liquid.' },
  { name: 'Hempen Rope',               category: 'Gear',        qty: 1, notes: '50 ft', description: '50 feet of hempen rope. Has 2 HP and can be burst with a DC 17 STR check.' },
  { name: 'Manacles',                   category: 'Gear',        qty: 1, description: 'Metal restraints that can bind a Small or Medium creature. Escaping requires a DC 20 DEX check. Breaking requires a DC 26 STR check.' },
  { name: 'Tent',                       category: 'Gear',        qty: 1, description: 'A simple two-person canvas shelter.' },
  { name: 'Dice Gaming Set',            category: 'Tools',       qty: 1, description: 'A set of polyhedral dice for games of chance. Proficiency allows adding proficiency bonus to ability checks using this set.' },
  { name: 'Fine Mithril Armour',        category: 'Armor',       qty: 1, notes: 'AC 17', description: 'Lightweight mithril armor providing AC 17. No Stealth disadvantage. No Strength requirement.' },
  { name: "Tinker's Tools",             category: 'Tools',       qty: 1, notes: 'DEX, 2 hrs/long rest crafting', description: "Tinker's Tools (DEX). Utilize: Assemble a Tiny scrap item that falls apart in 1 minute (DC 20). Craft (2 hrs/long rest): Bell, Bullseye Lantern, Flask, Hooded Lantern, Hunting Trap, Lock, Manacles, Mirror, Shovel, Signal Whistle, Tinderbox." },
  { name: "Traveler's Clothes",         category: 'Clothing',    qty: 1, description: 'Boots, a pair of trousers or a skirt, a tunic, and a cloak.' },
  { name: 'Parka',                      category: 'Clothing',    qty: 1, description: 'Heavy winter coat for extreme cold environments.' },
  { name: 'Snowshoes',                  category: 'Clothing',    qty: 1, description: 'Prevents sinking into deep snow. Allows normal movement over snowy terrain.' },
  { name: 'White Dragon Scale',         category: 'Miscellaneous', qty: 1, description: 'A shimmering scale from a white dragon. Cold to the touch.' },
  { name: 'Basilisk Eye',              category: 'Miscellaneous', qty: 2, description: 'A cloudy, preserved eye from a basilisk. Alchemical reagent.' },
  { name: 'Goat Bone',                  category: 'Miscellaneous', qty: 4, description: 'Bones from a mountain goat. Could be useful for crafting or rituals.' },
  { name: 'Frozen Goat Cheese',         category: 'Miscellaneous', qty: 1, description: 'A wheel of goat cheese, frozen solid in the Icewind Dale cold.' },
  { name: 'Feather',                    category: 'Miscellaneous', qty: 10, description: 'Assorted feathers collected from various birds.' },
];
