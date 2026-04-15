// Short Rest / Long Rest logic
import { CHARACTER, TINKER_RECIPES } from './data.js?v=30';
import { getState, update } from './state.js?v=19';
import { rollHitDie } from './dice.js?v=5';
import { logRoll } from './log.js?v=5';
import { fireMadnessEvent } from './madness.js?v=4';

export function shortRest(hitDiceToSpend) {
  const s = getState();
  const results = [];
  let totalHealing = 0;

  const available = s.hitDiceRemaining;
  const toSpend = Math.min(hitDiceToSpend, available);

  for (let i = 0; i < toSpend; i++) {
    const roll = rollHitDie(CHARACTER.abilities.CON.mod);
    results.push(roll);
    totalHealing += roll.total;
  }

  const newHp = Math.min(s.hp + totalHealing, CHARACTER.maxHp);
  const actualHeal = newHp - s.hp;

  update({
    hp: newHp,
    hitDiceRemaining: available - toSpend,
  });

  if (toSpend > 0) {
    const rollTexts = results.map(r => `(${r.die}+${r.modifier}=${r.total})`).join(' ');
    logRoll('healing', `Short Rest: ${toSpend}d6+${CHARACTER.abilities.CON.mod} ${rollTexts} = +${actualHeal} HP`);
  }

  // Sorcerous Restoration: regain up to half level SP, once per long rest
  let spRestored = 0;
  const current = getState();
  if (current.sorcerousRestoration > 0) {
    const maxRestore = Math.floor(CHARACTER.level / 2);
    const spMissing = CHARACTER.sorceryPoints - current.sorceryPoints;
    spRestored = Math.min(maxRestore, spMissing);
    const updates = { sorcerousRestoration: 0 };
    if (spRestored > 0) updates.sorceryPoints = current.sorceryPoints + spRestored;
    update(updates);
    if (spRestored > 0) logRoll('healing', `Sorcerous Restoration: +${spRestored} SP`);
  }

  fireMadnessEvent('shortRest');
  return { toSpend, totalHealing: actualHeal, results, spRestored };
}

export function longRest() {
  const s = getState();
  const newExhaustion = Math.max(0, s.exhaustion - 1);

  update({
    hp: CHARACTER.maxHp,
    tempHp: 0,
    spellSlots: { ...CHARACTER.spellSlots },
    sorceryPoints: CHARACTER.sorceryPoints,
    hitDiceRemaining: CHARACTER.hitDice.count,
    lucky: 4,
    innateSorcery: 2,
    healingHands: 1,
    celestialRevelation: 1,
    sorcerousRestoration: 1,
    sapphireRecharge: 1,
    rimesBindingIceFree: 1,
    wandOfSecrets: 3,
    xanthrid: 1,
    aurilsAbode: 1,
    exhaustion: newExhaustion,
    concentration: '',
    conditions: [],
    tempResistances: [],
    deathSaves: { successes: 0, failures: 0 },
    aberrantSpirit: { active: false, form: 'beholderkin', castLevel: 4, hp: 40, maxHp: 40, tempHp: 0 },
    xanthridCompanion: { active: false, hp: 19, maxHp: 19, tempHp: 0, clairvoyanceUsed: false },
    polymorphForm: { active: false, form: 'greatYeti', thp: 0 },
    tinkerHoursAvailable: 2,
  });

  // Auto-complete tinker projects that reached their hour target
  const projects = { ...getState().tinkerProjects };
  const inv = { ...getState().inventory };
  const completed = [];
  for (const [name, proj] of Object.entries(projects)) {
    const recipe = TINKER_RECIPES.find(r => r.name === name);
    if (recipe && proj.hoursSpent >= recipe.hours) {
      inv[name] = (inv[name] || 0) + 1;
      completed.push(name);
      delete projects[name];
    }
  }
  if (completed.length > 0) {
    update('tinkerProjects', projects);
    update('inventory', inv);
    for (const name of completed) {
      logRoll('resource', `Tinker's Tools: completed ${name} — added to inventory`);
    }
  }

  // Wand of Magic Missiles: recharge 1d6+1, max 7
  const wandRecharge = Math.floor(Math.random() * 6) + 1 + 1;
  const wandBefore = getState().wandOfMagicMissiles || 0;
  const wandAfter = Math.min(7, wandBefore + wandRecharge);
  update('wandOfMagicMissiles', wandAfter);

  fireMadnessEvent('longRest');

  const wandGain = wandAfter - wandBefore;
  const wandMsg = wandGain > 0 ? ` Wand of MM: +${wandGain} charges (${wandBefore} -> ${wandAfter}).` : '';
  const msg = newExhaustion > 0
    ? `Long Rest: Full restore. Exhaustion ${s.exhaustion} -> ${newExhaustion}.${wandMsg}`
    : `Long Rest: Full restore.${wandMsg}`;
  logRoll('healing', msg);
}
