// DOM rendering, event binding, panel updates
import { CHARACTER, WEAPONS, SPELLS, CONDITIONS, SPELL_SLOT_COSTS, DAMAGE_TYPES, STORE_POTIONS, RESOURCE_LIMITS, INVENTORY, RESOURCE_DESCRIPTIONS, STAT_DESCRIPTIONS, SKILL_DESCRIPTIONS, PANEL_DESCRIPTIONS, LANGUAGE_DESCRIPTIONS, RESISTANCE_DESCRIPTIONS, CONDITION_DESCRIPTIONS, ABERRANT_SPIRIT, XANTHRID_COMPANION, POLYMORPH_FORMS, ABILITY_DETAILS, ATTUNEMENT, TINKER_RECIPES } from './data.js?v=30';
import { getState, update, updateNested, resetAll } from './state.js?v=19';
import * as dice from './dice.js?v=5';
import { logRoll, renderLog, doClearLog } from './log.js?v=5';
import { shortRest, longRest } from './rest.js?v=14';
import { SPELL_FULL_TEXT } from './spelltext.js?v=6';
import { fireMadnessEvent, triggerScreenShake, triggerDamageFlash } from './madness.js?v=4';

// Cache DOM refs
let els = {};

// Track last damage roll for Empower
let lastDamageRoll = null; // { dmg config, result }

// Spell UI state (not persisted — resets each session load)
let expandedSpells = new Set(); // per-card expansion
let allExpanded = false;        // expand full text on all cards
let spellSearch = '';           // text search
let spellSort = 'level';       // sort field
let spellFilters = { level: [], castTime: [], target: [], flags: [], school: [], source: [], damageType: [] };
let filtersVisible = false;

export function initUI() {
  cacheElements();
  renderAll();
  bindEvents();
  initResourceDescriptions();
  initStatDescriptions();
  initNotes();
  initTinker();
}

function cacheElements() {
  els = {
    hpFill: document.getElementById('hp-fill'),
    hpText: document.getElementById('hp-text'),
    hpTempBar: document.getElementById('hp-temp-bar'),
    hpInput: document.getElementById('hp-input'),
    tempHpInput: document.getElementById('temp-hp-input'),
    acValue: document.getElementById('ac-value'),
    speedValue: document.getElementById('speed-value'),
    initValue: document.getElementById('init-value'),
    conditionGrid: document.getElementById('condition-grid'),
    exhaustionTrack: document.getElementById('exhaustion-track'),
    concSelect: document.getElementById('conc-select'),
    deathSuccesses: document.getElementById('death-successes'),
    deathFailures: document.getElementById('death-failures'),
    spellSlotsContainer: document.getElementById('spell-slots'),
    spDisplay: document.getElementById('sp-display'),
    hitDiceContainer: document.getElementById('hit-dice'),
    luckyContainer: document.getElementById('lucky-pips'),
    innateSorceryContainer: document.getElementById('innate-sorcery-pips'),
    healingHandsPip: document.getElementById('healing-hands-pip'),
    celestialRevPip: document.getElementById('celestial-rev-pip'),
    sorcRestorationPip: document.getElementById('sorc-restoration-pip'),
    sapphirePip: document.getElementById('sapphire-pip'),
    rimesPip: document.getElementById('rimes-free-pip'),
    wandSecretsPips: document.getElementById('wand-secrets-pips'),
    wandMmPips: document.getElementById('wand-mm-pips'),
    xanthridPip: document.getElementById('xanthrid-pip'),
    aurilsAbodePip: document.getElementById('aurils-abode-pip'),
    inspirationStar: document.getElementById('inspiration-star'),
    diceResult: document.getElementById('dice-result'),
    diceBreakdown: document.getElementById('dice-breakdown'),
    diceLabel: document.getElementById('dice-label'),
    diceDisplay: document.getElementById('dice-display'),
    luckyDie1: document.getElementById('lucky-die-1'),
    luckyDie2: document.getElementById('lucky-die-2'),
    luckyDisplay: document.getElementById('lucky-display'),
    saveButtons: document.getElementById('save-buttons'),
    attackButtons: document.getElementById('attack-buttons'),
    damageButtons: document.getElementById('damage-buttons'),
    rollLog: document.getElementById('roll-log'),
    spellGrid: document.getElementById('spell-grid'),
    spellCount: document.getElementById('spell-count'),
    diceStage: document.getElementById('dice-stage'),
    diceActions: document.getElementById('dice-actions'),
    spConversion: document.getElementById('sp-conversion'),
    expandAllBtn: document.getElementById('btn-expand-all'),
    skillsList: document.getElementById('skills-list'),
    languagesList: document.getElementById('languages-list'),
    resistancesList: document.getElementById('resistances-list'),
    inventoryContainer: document.getElementById('inventory-container'),
    // Aberrant Spirit
    spiritPanel: document.getElementById('aberrant-spirit-panel'),
    spiritFormSelector: document.getElementById('spirit-form-selector'),
    spiritStats: document.getElementById('spirit-stats'),
    spiritHpFill: document.getElementById('spirit-hp-fill'),
    spiritHpText: document.getElementById('spirit-hp-text'),
    spiritHpTempBar: document.getElementById('spirit-hp-temp-bar'),
    spiritHpInput: document.getElementById('spirit-hp-input'),
    spiritTempHpInput: document.getElementById('spirit-temp-hp-input'),
    spiritRegenRow: document.getElementById('spirit-regen-row'),
    spiritAuraRow: document.getElementById('spirit-aura-row'),
    spiritAttacks: document.getElementById('spirit-attacks'),
    spiritTraits: document.getElementById('spirit-traits'),
    // Xanthrid Companion
    xanthridPanel: document.getElementById('xanthrid-panel'),
    xanthridStats: document.getElementById('xanthrid-stats'),
    xanthridHpFill: document.getElementById('xanthrid-hp-fill'),
    xanthridHpText: document.getElementById('xanthrid-hp-text'),
    xanthridHpTempBar: document.getElementById('xanthrid-hp-temp-bar'),
    xanthridHpInput: document.getElementById('xanthrid-hp-input'),
    xanthridTempHpInput: document.getElementById('xanthrid-temp-hp-input'),
    xanthridAttacks: document.getElementById('xanthrid-attacks'),
    xanthridSpells: document.getElementById('xanthrid-spells'),
    xanthridTraits: document.getElementById('xanthrid-traits'),
    // Polymorph
    polymorphPanel: document.getElementById('polymorph-panel'),
    polymorphFormSelector: document.getElementById('polymorph-form-selector'),
    polymorphStats: document.getElementById('polymorph-stats'),
    polymorphAbilities: document.getElementById('polymorph-abilities'),
    polymorphThpFill: document.getElementById('polymorph-thp-fill'),
    polymorphThpText: document.getElementById('polymorph-thp-text'),
    polymorphDmgInput: document.getElementById('polymorph-dmg-input'),
    polymorphAttacks: document.getElementById('polymorph-attacks'),
    polymorphSpecials: document.getElementById('polymorph-specials'),
    polymorphBonusActions: document.getElementById('polymorph-bonus-actions'),
    polymorphTraits: document.getElementById('polymorph-traits'),
  };
}

export function renderAll() {
  renderHp();
  renderStats();
  renderAbilityScores();
  renderAttunement();
  renderStaticChips();
  renderConditions();
  renderExhaustion();
  renderConcentration();
  renderDeathSaves();
  renderSpellSlots();
  renderSorceryPoints();
  renderHitDice();
  renderResources();
  renderInspiration();
  renderXanthridToggle();
  renderAberrantToggle();
  renderPolymorphToggle();
  renderStoreToggle();
  renderLog(els.rollLog);
  renderLuckyButton();
  renderInventory();
  renderTinker();
  renderAberrantSpirit();
  renderXanthridCompanion();
  renderPolymorphForm();
  renderSpellCards();
  renderDiceMode();
}

function renderLuckyButton() {
  const btn = document.getElementById('btn-lucky-roll');
  if (!btn) return;
  const s = getState();
  btn.textContent = `Lucky Roll (2d20) — ${s.lucky} left`;
  btn.disabled = s.lucky <= 0;
  btn.style.opacity = s.lucky <= 0 ? '0.3' : '1';
}

// ─── HP ──────────────────────────────────────────
function renderHp() {
  const s = getState();
  const pct = Math.max(0, Math.min(100, (s.hp / CHARACTER.maxHp) * 100));

  els.hpFill.style.width = pct + '%';
  els.hpFill.className = 'hp-bar-fill';
  if (pct > 50) els.hpFill.classList.add('hp-high');
  else if (pct > 25) els.hpFill.classList.add('hp-mid');
  else if (pct > 10) els.hpFill.classList.add('hp-low');
  else els.hpFill.classList.add('hp-critical');

  const tempStr = s.tempHp > 0 ? ` +${s.tempHp}` : '';
  els.hpText.textContent = `${s.hp}/${CHARACTER.maxHp}${tempStr}`;

  if (s.tempHp > 0) {
    const tempPct = (s.tempHp / (CHARACTER.maxHp + s.tempHp)) * 100;
    els.hpTempBar.style.width = tempPct + '%';
    els.hpTempBar.style.display = 'block';
  } else {
    els.hpTempBar.style.display = 'none';
  }
}

// ─── Damage Type Dropdowns ───────────────────────
function populateDmgTypeSelect(selectId) {
  const sel = document.getElementById(selectId);
  if (!sel || sel.options.length > 1) return;
  for (const t of DAMAGE_TYPES) {
    const opt = document.createElement('option');
    opt.value = t;
    opt.textContent = t;
    sel.appendChild(opt);
  }
}

function adjustForDefenses(amount, dmgType, resistances, immunities) {
  if (!dmgType) return { final: amount, tag: '' };
  const immuneList = Array.isArray(immunities) ? immunities : (immunities ? immunities.split(/,\s*/) : []);
  const resistList = Array.isArray(resistances) ? resistances : (resistances ? resistances.split(/,\s*/) : []);
  if (immuneList.includes(dmgType)) return { final: 0, tag: ` [${dmgType} — IMMUNE]` };
  if (resistList.includes(dmgType)) return { final: Math.floor(amount / 2), tag: ` [${dmgType} — resisted, ${amount}→${Math.floor(amount / 2)}]` };
  return { final: amount, tag: ` [${dmgType}]` };
}

function applyDamage(rawAmount, dmgType) {
  const allResistances = [...CHARACTER.resistances, ...(getState().tempResistances || [])];
  const { final: amount, tag } = adjustForDefenses(rawAmount, dmgType, allResistances, []);
  if (amount === 0) {
    logRoll('damage', `${rawAmount} ${dmgType} damage — IMMUNE`);
    renderLog(els.rollLog);
    return;
  }
  const s = getState();
  let remaining = amount;
  let newTemp = s.tempHp;
  let newHp = s.hp;

  if (newTemp > 0) {
    if (remaining >= newTemp) {
      remaining -= newTemp;
      newTemp = 0;
    } else {
      newTemp -= remaining;
      remaining = 0;
    }
  }
  newHp = Math.max(0, newHp - remaining);
  update({ hp: newHp, tempHp: newTemp });
  logRoll('damage', `Takes ${amount} damage${tag} (${newHp} HP remaining)`);
  renderLog(els.rollLog);
  fireMadnessEvent('damage', { amount, maxHp: CHARACTER.maxHp, hp: newHp });
  triggerDamageFlash();
  if (amount >= CHARACTER.maxHp * 0.3) triggerScreenShake();
}

function applyHealing(amount) {
  const s = getState();
  const newHp = Math.min(CHARACTER.maxHp, s.hp + amount);
  update({ hp: newHp });
}

// ─── Stats ───────────────────────────────────────
function renderStats() {
  els.acValue.textContent = CHARACTER.ac;
  els.speedValue.textContent = CHARACTER.speed + ' ft.';
  els.initValue.textContent = '+' + CHARACTER.initiative;
}

// ─── Ability Scores ─────────────────────────────
function renderAbilityScores() {
  const container = document.getElementById('ability-scores');
  if (!container || container.children.length) return;
  const grid = document.createElement('div');
  grid.className = 'ability-grid';
  for (const [name, ability] of Object.entries(CHARACTER.abilities)) {
    const details = ABILITY_DETAILS[name];
    const card = document.createElement('div');
    card.className = 'ability-card';
    if (details.profSave) card.classList.add('prof-save');

    const nameEl = document.createElement('div');
    nameEl.className = 'ability-name';
    nameEl.textContent = name;

    const scoreEl = document.createElement('div');
    scoreEl.className = 'ability-score';
    scoreEl.textContent = ability.score;

    const modEl = document.createElement('div');
    modEl.className = 'ability-mod';
    modEl.textContent = ability.mod >= 0 ? `+${ability.mod}` : `${ability.mod}`;

    const saveEl = document.createElement('div');
    saveEl.className = 'ability-save';
    saveEl.textContent = `Save: ${ability.save >= 0 ? '+' : ''}${ability.save}`;

    const breakdownEl = document.createElement('div');
    breakdownEl.className = 'ability-save-breakdown';
    breakdownEl.textContent = details.saveBreakdown;

    card.append(nameEl, scoreEl, modEl, saveEl, breakdownEl);
    grid.appendChild(card);
  }
  container.appendChild(grid);
}

// ─── Attunement ─────────────────────────────────
function renderAttunement() {
  const container = document.getElementById('attunement-slots');
  if (!container || container.children.length) return;

  const header = document.createElement('div');
  header.style.cssText = 'font-family:var(--font-mono);font-size:0.75rem;color:var(--text-muted);margin-bottom:6px';
  header.textContent = `${ATTUNEMENT.items.length} / ${ATTUNEMENT.max} slots`;
  container.appendChild(header);

  for (const item of ATTUNEMENT.items) {
    const row = document.createElement('div');
    row.className = 'attunement-row';

    const icon = document.createElement('span');
    icon.className = 'attunement-icon';
    icon.textContent = '\uD83D\uDD17'; // 🔗

    const info = document.createElement('div');
    info.className = 'attunement-info';

    const name = document.createElement('div');
    name.className = 'attunement-name';
    name.textContent = item.name;

    const effect = document.createElement('div');
    effect.className = 'attunement-effect';
    effect.textContent = item.effect;

    info.append(name, effect);
    row.append(icon, info);
    container.appendChild(row);
  }
}

// ─── Notes ──────────────────────────────────────
let notesTimeout = null;
function initNotes() {
  const textarea = document.getElementById('notes-textarea');
  if (!textarea) return;
  textarea.value = getState().notes || '';
  textarea.addEventListener('input', () => {
    clearTimeout(notesTimeout);
    notesTimeout = setTimeout(() => {
      update('notes', textarea.value);
    }, 500);
  });
}

// ─── Tinker's Tools ─────────────────────────────
function renderTinker() {
  const s = getState();
  const hoursEl = document.getElementById('tinker-hours');
  const projectsEl = document.getElementById('tinker-projects');
  if (!hoursEl || !projectsEl) return;

  // Hours available badge
  hoursEl.textContent = '';
  const badge = document.createElement('span');
  badge.className = 'tinker-hours-badge';
  badge.textContent = `${s.tinkerHoursAvailable || 0}`;
  hoursEl.appendChild(badge);
  const label = document.createElement('span');
  label.textContent = 'hrs available this rest';
  hoursEl.appendChild(label);

  // Active projects
  projectsEl.textContent = '';
  const projects = s.tinkerProjects || {};
  for (const [name, proj] of Object.entries(projects)) {
    const recipe = TINKER_RECIPES.find(r => r.name === name);
    if (!recipe) continue;
    const pct = Math.min(100, (proj.hoursSpent / recipe.hours) * 100);

    const div = document.createElement('div');
    div.className = 'tinker-project';

    const header = document.createElement('div');
    header.className = 'tinker-project-header';
    const nameSpan = document.createElement('span');
    nameSpan.className = 'tinker-project-name';
    nameSpan.textContent = name;
    const timeSpan = document.createElement('span');
    timeSpan.className = 'tinker-project-time';
    timeSpan.textContent = `${proj.hoursSpent}/${recipe.hours} hrs`;
    header.append(nameSpan, timeSpan);

    const bar = document.createElement('div');
    bar.className = 'tinker-progress-bar';
    const fill = document.createElement('div');
    fill.className = 'tinker-progress-fill';
    fill.style.width = pct + '%';
    bar.appendChild(fill);

    const actions = document.createElement('div');
    actions.className = 'tinker-project-actions';

    const workBtn = document.createElement('button');
    workBtn.className = 'tinker-work-btn';
    const canWork = (s.tinkerHoursAvailable || 0) > 0;
    const hoursLeft = recipe.hours - proj.hoursSpent;
    const hoursToAdd = Math.min(s.tinkerHoursAvailable || 0, hoursLeft);
    workBtn.textContent = canWork ? `Work ${hoursToAdd} hr${hoursToAdd !== 1 ? 's' : ''}` : 'No hours left';
    workBtn.disabled = !canWork;
    workBtn.addEventListener('click', () => {
      const st = getState();
      const avail = st.tinkerHoursAvailable || 0;
      if (avail <= 0) return;
      const projs = { ...st.tinkerProjects };
      const r = TINKER_RECIPES.find(x => x.name === name);
      if (!r || !projs[name]) return;
      const left = r.hours - projs[name].hoursSpent;
      const spend = Math.min(avail, left);
      projs[name] = { ...projs[name], hoursSpent: projs[name].hoursSpent + spend };
      update('tinkerProjects', projs);
      update('tinkerHoursAvailable', avail - spend);
      logRoll('resource', `Tinker's Tools: worked ${spend} hr${spend !== 1 ? 's' : ''} on ${name} (${projs[name].hoursSpent}/${r.hours})`);
      // Auto-complete if done
      if (projs[name].hoursSpent >= r.hours) {
        const p2 = { ...getState().tinkerProjects };
        delete p2[name];
        update('tinkerProjects', p2);
        const inv = { ...getState().inventory };
        inv[name] = (inv[name] || 0) + 1;
        update('inventory', inv);
        logRoll('resource', `Tinker's Tools: completed ${name} — added to inventory!`);
      }
      renderLog(els.rollLog);
    });

    const abandonBtn = document.createElement('button');
    abandonBtn.className = 'tinker-abandon-btn';
    abandonBtn.textContent = 'Abandon';
    abandonBtn.addEventListener('click', () => {
      if (!confirm(`Abandon ${name}? (${proj.hoursSpent} hrs of progress will be lost)`)) return;
      const projs = { ...getState().tinkerProjects };
      delete projs[name];
      update('tinkerProjects', projs);
      logRoll('resource', `Tinker's Tools: abandoned ${name}`);
      renderLog(els.rollLog);
    });

    actions.append(workBtn, abandonBtn);
    div.append(header, bar, actions);
    projectsEl.appendChild(div);
  }

  if (Object.keys(projects).length === 0) {
    const empty = document.createElement('div');
    empty.style.cssText = 'font-size:0.8rem;color:var(--text-muted);padding:4px 0';
    empty.textContent = 'No active projects. Start one below.';
    projectsEl.appendChild(empty);
  }
}

function initTinker() {
  // Populate recipe dropdown
  const sel = document.getElementById('tinker-recipe-select');
  if (!sel) return;
  for (const recipe of TINKER_RECIPES) {
    const opt = document.createElement('option');
    opt.value = recipe.name;
    opt.textContent = `${recipe.name} (${recipe.hours} hrs)`;
    sel.appendChild(opt);
  }

  // Start button
  document.getElementById('btn-tinker-start').addEventListener('click', () => {
    const name = sel.value;
    if (!name) return;
    const s = getState();
    const projects = { ...s.tinkerProjects };
    if (projects[name]) return; // already in progress
    projects[name] = { hoursSpent: 0 };
    update('tinkerProjects', projects);
    logRoll('resource', `Tinker's Tools: started crafting ${name}`);
    renderLog(els.rollLog);
    sel.value = '';
  });
}

// ─── Conditions ──────────────────────────────────
function renderStaticChips() {
  fillSkills(els.skillsList, CHARACTER.skills);
  fillChips(els.languagesList, CHARACTER.languages, LANGUAGE_DESCRIPTIONS);
  renderResistanceChips();
}

function fillSkills(container, skills) {
  if (!container || container.children.length) return;
  for (const [name, bonus] of Object.entries(skills)) {
    const row = document.createElement('div');
    row.className = 'stat-row';
    const label = document.createElement('span');
    label.className = 'stat-label';
    label.textContent = name;
    const value = document.createElement('span');
    value.className = 'stat-value';
    value.textContent = `+${bonus}`;
    row.appendChild(label);
    row.appendChild(value);
    container.appendChild(row);
  }
}

function fillChips(container, items, descriptions) {
  if (!container || container.children.length) return; // render once
  for (const item of items) {
    const desc = descriptions && descriptions[item];
    if (desc) {
      const wrapper = document.createElement('div');
      wrapper.className = 'chip-wrapper';
      const chip = document.createElement('span');
      chip.className = 'chip-static';
      chip.textContent = item;
      const { btn, descDiv } = addInfoToggle(wrapper, 'chip:' + item, desc);
      wrapper.appendChild(btn);
      wrapper.appendChild(chip);
      wrapper.appendChild(descDiv);
      container.appendChild(wrapper);
    } else {
      const chip = document.createElement('span');
      chip.className = 'chip-static';
      chip.textContent = item;
      container.appendChild(chip);
    }
  }
}

function renderResistanceChips() {
  const container = els.resistancesList;
  if (!container) return;
  container.textContent = '';
  const s = getState();
  const tempRes = s.tempResistances || [];

  // Permanent resistances
  for (const item of CHARACTER.resistances) {
    const desc = RESISTANCE_DESCRIPTIONS[item];
    if (desc) {
      const wrapper = document.createElement('div');
      wrapper.className = 'chip-wrapper';
      const chip = document.createElement('span');
      chip.className = 'chip-static';
      chip.textContent = item;
      const { btn, descDiv } = addInfoToggle(wrapper, 'chip:' + item, desc);
      wrapper.appendChild(btn);
      wrapper.appendChild(chip);
      wrapper.appendChild(descDiv);
      container.appendChild(wrapper);
    } else {
      const chip = document.createElement('span');
      chip.className = 'chip-static';
      chip.textContent = item;
      container.appendChild(chip);
    }
  }

  // Temporary resistances (from potions)
  for (const item of tempRes) {
    if (CHARACTER.resistances.includes(item)) continue; // already permanent
    const wrapper = document.createElement('div');
    wrapper.className = 'chip-wrapper';
    const chip = document.createElement('span');
    chip.className = 'chip-static chip-temp';
    chip.textContent = item;
    chip.title = 'Temporary (potion)';
    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn btn-icon chip-remove';
    removeBtn.textContent = '\u00D7';
    removeBtn.title = `Remove ${item} resistance`;
    removeBtn.addEventListener('click', () => {
      const cur = getState().tempResistances || [];
      update('tempResistances', cur.filter(r => r !== item));
    });
    wrapper.appendChild(chip);
    wrapper.appendChild(removeBtn);
    container.appendChild(wrapper);
  }
}

function renderConditions() {
  const s = getState();
  els.conditionGrid.textContent = '';
  for (const cond of CONDITIONS) {
    const desc = CONDITION_DESCRIPTIONS[cond];
    const wrapper = document.createElement('div');
    wrapper.className = 'condition-wrapper';

    const chip = document.createElement('button');
    chip.className = 'condition-chip';
    if (s.conditions.includes(cond)) {
      chip.classList.add('active', 'condition-active');
    }
    chip.textContent = cond;
    chip.addEventListener('click', () => toggleCondition(cond));

    if (desc) {
      const { btn, descDiv } = addInfoToggle(wrapper, 'cond:' + cond, desc);
      wrapper.appendChild(btn);
      wrapper.appendChild(chip);
      wrapper.appendChild(descDiv);
    } else {
      wrapper.appendChild(chip);
    }

    els.conditionGrid.appendChild(wrapper);
  }
}

function toggleCondition(cond) {
  const s = getState();
  const conditions = [...s.conditions];
  const idx = conditions.indexOf(cond);
  if (idx >= 0) conditions.splice(idx, 1);
  else conditions.push(cond);
  update('conditions', conditions);
}

// ─── Exhaustion ──────────────────────────────────
function renderExhaustion() {
  const s = getState();
  els.exhaustionTrack.textContent = '';
  for (let i = 1; i <= 6; i++) {
    const pip = document.createElement('button');
    pip.className = 'exhaustion-pip';
    pip.setAttribute('aria-label', `Exhaustion level ${i}`);
    if (i <= s.exhaustion) pip.classList.add('active');
    pip.textContent = i;
    pip.addEventListener('click', () => {
      const current = getState().exhaustion;
      update('exhaustion', current === i ? i - 1 : i);
    });
    els.exhaustionTrack.appendChild(pip);
  }
}

// ─── Concentration ───────────────────────────────
function renderConcentration() {
  const s = getState();
  els.concSelect.textContent = '';

  const noneOpt = document.createElement('option');
  noneOpt.value = '';
  noneOpt.textContent = '-- None --';
  els.concSelect.appendChild(noneOpt);

  const concSpells = SPELLS.filter(sp => sp.concentration);
  for (const sp of concSpells) {
    const opt = document.createElement('option');
    opt.value = sp.name;
    opt.textContent = sp.name;
    if (s.concentration === sp.name) opt.selected = true;
    els.concSelect.appendChild(opt);
  }

  const panel = els.concSelect.closest('.panel');
  if (panel) {
    panel.classList.toggle('concentrating', !!s.concentration);
  }
}

// ─── Death Saves ─────────────────────────────────
function renderDeathSaves() {
  const s = getState();
  renderDeathPips(els.deathSuccesses, s.deathSaves.successes, 'death-success');
  renderDeathPips(els.deathFailures, s.deathSaves.failures, 'death-fail');
}

function renderDeathPips(container, count, className) {
  container.textContent = '';
  const type = className === 'death-success' ? 'success' : 'failure';
  for (let i = 0; i < 3; i++) {
    const pip = document.createElement('button');
    pip.className = `death-save-pip ${className}`;
    pip.setAttribute('aria-label', `Death save ${type} ${i + 1} of 3`);
    if (i < count) pip.classList.add('active');
    pip.addEventListener('click', () => {
      const key = className === 'death-success' ? 'successes' : 'failures';
      const current = getState().deathSaves[key];
      const newVal = current === i + 1 ? i : i + 1;
      updateNested(`deathSaves.${key}`, newVal);
      if (newVal > current) {
        fireMadnessEvent('deathSave', { type: key === 'successes' ? 'success' : 'failure' });
        if (key === 'failures') triggerScreenShake();
      }
    });
    container.appendChild(pip);
  }
}

// ─── Spell Slots ─────────────────────────────────
function renderSpellSlots() {
  const s = getState();
  els.spellSlotsContainer.textContent = '';

  for (const [level, baseMax] of Object.entries(CHARACTER.spellSlots)) {
    const remaining = s.spellSlots[level] || 0;
    const totalSlots = Math.max(baseMax, remaining);
    const used = totalSlots - remaining;

    const row = document.createElement('div');
    row.className = 'slot-row';

    const label = document.createElement('span');
    label.className = 'slot-level';
    label.textContent = level + getSuffix(parseInt(level));
    row.appendChild(label);

    const checks = document.createElement('div');
    checks.className = 'slot-checks';

    for (let i = 0; i < totalSlots; i++) {
      const check = document.createElement('button');
      check.className = 'slot-check';
      const isTemp = i >= baseMax;
      if (isTemp) check.classList.add('slot-temp');
      check.setAttribute('aria-label', `Level ${level} slot ${i + 1} of ${totalSlots}${isTemp ? ' (temporary)' : ''}, ${i < used ? 'used' : 'available'}`);
      if (i < used) check.classList.add('used');
      check.addEventListener('click', () => {
        const current = getState().spellSlots[level] || 0;
        const total = Math.max(baseMax, current);
        const curUsed = total - current;
        if (i < curUsed) {
          // Clicking a used pip: restore one slot
          updateNested(`spellSlots.${level}`, current + 1);
        } else {
          // Clicking an available pip: use one slot
          updateNested(`spellSlots.${level}`, Math.max(0, current - 1));
        }
      });
      checks.appendChild(check);
    }

    row.appendChild(checks);
    els.spellSlotsContainer.appendChild(row);
  }
}

function getSuffix(n) {
  if (n === 1) return 'st';
  if (n === 2) return 'nd';
  if (n === 3) return 'rd';
  return 'th';
}

// ─── Sorcery Points ─────────────────────────────
function renderSorceryPoints() {
  els.spDisplay.textContent = getState().sorceryPoints;
  renderSPConversion();
}

function renderSPConversion() {
  const container = els.spConversion;
  if (!container) return;
  container.textContent = '';

  const s = getState();

  // SP → Slot
  const toSlotRow = document.createElement('div');
  toSlotRow.className = 'sp-conv-row';
  const toSlotLabel = document.createElement('span');
  toSlotLabel.className = 'sp-conv-label';
  toSlotLabel.textContent = 'SP \u2192 Slot';
  toSlotRow.appendChild(toSlotLabel);

  for (const [level, cost] of Object.entries(SPELL_SLOT_COSTS)) {
    const lv = parseInt(level);
    const max = CHARACTER.spellSlots[lv] || 0;
    const current = s.spellSlots[lv] || 0;
    const btn = document.createElement('button');
    btn.className = 'btn-conv to-slot';
    btn.textContent = `${lv}${getSuffix(lv)} (${cost} SP)`;
    btn.disabled = s.sorceryPoints < cost;
    btn.addEventListener('click', () => {
      const st = getState();
      if (st.sorceryPoints >= cost) {
        const cur = st.spellSlots[lv] || 0;
        const isTemp = cur >= max;
        update('sorceryPoints', st.sorceryPoints - cost);
        updateNested(`spellSlots.${lv}`, cur + 1);
        logRoll('resource', `Created ${lv}${getSuffix(lv)}-level ${isTemp ? 'temporary ' : ''}slot (spent ${cost} SP)`);
        renderLog(els.rollLog);
      }
    });
    toSlotRow.appendChild(btn);
  }
  container.appendChild(toSlotRow);

  // Slot → SP
  const toSPRow = document.createElement('div');
  toSPRow.className = 'sp-conv-row';
  const toSPLabel = document.createElement('span');
  toSPLabel.className = 'sp-conv-label';
  toSPLabel.textContent = 'Slot \u2192 SP';
  toSPRow.appendChild(toSPLabel);

  for (const level of Object.keys(CHARACTER.spellSlots)) {
    const lv = parseInt(level);
    const current = s.spellSlots[lv] || 0;
    const btn = document.createElement('button');
    btn.className = 'btn-conv to-sp';
    btn.textContent = `${lv}${getSuffix(lv)} (+${lv} SP)`;
    btn.disabled = current <= 0 || s.sorceryPoints >= CHARACTER.sorceryPoints;
    btn.addEventListener('click', () => {
      const st = getState();
      const cur = st.spellSlots[lv] || 0;
      if (cur > 0 && st.sorceryPoints < CHARACTER.sorceryPoints) {
        updateNested(`spellSlots.${lv}`, cur - 1);
        update('sorceryPoints', Math.min(CHARACTER.sorceryPoints, st.sorceryPoints + lv));
        logRoll('resource', `Converted ${lv}${getSuffix(lv)}-level slot \u2192 ${lv} SP`);
        renderLog(els.rollLog);
      }
    });
    toSPRow.appendChild(btn);
  }
  container.appendChild(toSPRow);
}

// ─── Hit Dice ────────────────────────────────────
function renderHitDice() {
  const s = getState();
  els.hitDiceContainer.textContent = '';

  for (let i = 0; i < CHARACTER.hitDice.count; i++) {
    const check = document.createElement('button');
    check.className = 'hd-check';
    const isUsed = i >= s.hitDiceRemaining;
    check.setAttribute('aria-label', `Hit die ${i + 1} of ${CHARACTER.hitDice.count}, ${isUsed ? 'used' : 'available'}`);
    if (isUsed) check.classList.add('used');
    check.textContent = 'd6';
    check.addEventListener('click', () => {
      const current = getState().hitDiceRemaining;
      if (i < current) {
        update('hitDiceRemaining', i);
      } else {
        update('hitDiceRemaining', i + 1);
      }
    });
    els.hitDiceContainer.appendChild(check);
  }
}

// ─── Resource Descriptions (expand/collapse) ─────
const expandedResources = new Set();
const RESOURCE_KEY_MAP = {
  'lucky-pips': 'lucky',
  'innate-sorcery-pips': 'innateSorcery',
  'healing-hands-pip': 'healingHands',
  'celestial-rev-pip': 'celestialRevelation',
  'sorc-restoration-pip': 'sorcerousRestoration',
  'sapphire-pip': 'sapphireRecharge',
  'rimes-free-pip': 'rimesBindingIceFree',
  'wand-secrets-pips': 'wandOfSecrets',
  'wand-mm-pips': 'wandOfMagicMissiles',
  'xanthrid-pip': 'xanthrid',
  'aurils-abode-pip': 'aurilsAbode',
};

function initResourceDescriptions() {
  for (const [elId, key] of Object.entries(RESOURCE_KEY_MAP)) {
    const desc = RESOURCE_DESCRIPTIONS[key];
    if (!desc) continue;
    const el = document.getElementById(elId);
    if (!el) continue;
    const row = el.closest('.resource-row');
    if (!row) continue;

    const nameEl = row.querySelector('.resource-name');
    if (!nameEl) continue;

    const btn = document.createElement('button');
    btn.className = 'spell-expand-toggle resource-expand-toggle';
    btn.textContent = '+';
    row.insertBefore(btn, nameEl);

    const descDiv = document.createElement('div');
    descDiv.className = 'resource-desc';
    descDiv.textContent = desc;
    descDiv.style.display = 'none';
    row.appendChild(descDiv);

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (expandedResources.has(key)) {
        expandedResources.delete(key);
        descDiv.style.display = 'none';
        btn.textContent = '+';
      } else {
        expandedResources.add(key);
        descDiv.style.display = '';
        btn.textContent = '\u2212';
      }
    });
  }
}

// ─── Expandable Info Blocks ──────────────────────
const expandedInfo = new Set();

function addInfoToggle(container, key, desc) {
  const btn = document.createElement('button');
  btn.className = 'spell-expand-toggle resource-expand-toggle';
  btn.textContent = expandedInfo.has(key) ? '\u2212' : '+';

  const descDiv = document.createElement('div');
  descDiv.className = 'resource-desc';
  descDiv.textContent = desc;
  descDiv.style.display = expandedInfo.has(key) ? '' : 'none';

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (expandedInfo.has(key)) {
      expandedInfo.delete(key);
      descDiv.style.display = 'none';
      btn.textContent = '+';
    } else {
      expandedInfo.add(key);
      descDiv.style.display = '';
      btn.textContent = '\u2212';
    }
  });

  return { btn, descDiv };
}

function initStatDescriptions() {
  // Combat stats and skills — row-level info
  document.querySelectorAll('.stat-row').forEach(row => {
    const label = row.querySelector('.stat-label');
    if (!label) return;
    const name = label.textContent.trim();
    const desc = STAT_DESCRIPTIONS[name] || SKILL_DESCRIPTIONS[name];
    if (!desc) return;

    const { btn, descDiv } = addInfoToggle(row, 'stat:' + name, desc);
    row.insertBefore(btn, label);
    row.style.flexWrap = 'wrap';
    row.appendChild(descDiv);
  });

  // Panel-level info (HP, Exhaustion, Concentration, etc.)
  document.querySelectorAll('.panel').forEach(panel => {
    const h2 = panel.querySelector('h2');
    if (!h2) return;
    const name = h2.textContent.trim();
    const desc = PANEL_DESCRIPTIONS[name];
    if (!desc) return;

    const { btn, descDiv } = addInfoToggle(panel, 'panel:' + name, desc);
    btn.classList.add('panel-info-btn');
    h2.appendChild(btn);
    // Insert description right after the panel-header
    const header = panel.querySelector('.panel-header');
    header.insertAdjacentElement('afterend', descDiv);
  });
}

// ─── Resources ───────────────────────────────────
function renderResources() {
  renderPips(els.luckyContainer, 'lucky', RESOURCE_LIMITS.lucky);
  renderPips(els.innateSorceryContainer, 'innateSorcery', 2);
  renderToggle(els.healingHandsPip, 'healingHands');
  renderToggle(els.celestialRevPip, 'celestialRevelation');
  renderToggle(els.sorcRestorationPip, 'sorcerousRestoration');
  renderToggle(els.sapphirePip, 'sapphireRecharge');
  renderToggle(els.rimesPip, 'rimesBindingIceFree');
  renderPips(els.wandSecretsPips, 'wandOfSecrets', 3);
  renderPips(els.wandMmPips, 'wandOfMagicMissiles', 7);
  renderToggle(els.xanthridPip, 'xanthrid');
  renderToggle(els.aurilsAbodePip, 'aurilsAbode');
}

function renderPips(container, stateKey, max) {
  container.textContent = '';
  const remaining = getState()[stateKey];
  const used = max - remaining;
  for (let i = 0; i < max; i++) {
    const pip = document.createElement('button');
    pip.className = 'resource-pip';
    pip.setAttribute('aria-label', `${stateKey} use ${i + 1} of ${max}`);
    pip.setAttribute('aria-pressed', String(i < used));
    if (i < used) pip.classList.add('used');
    pip.addEventListener('click', () => {
      const curRemaining = getState()[stateKey];
      const curUsed = max - curRemaining;
      if (i < curUsed) {
        // Clicking a used pip: restore it and all after it
        update(stateKey, max - i);
      } else {
        // Clicking an unused pip: use it and all before it
        update(stateKey, max - i - 1);
      }
    });
    container.appendChild(pip);
  }
}

function renderToggle(el, stateKey) {
  const used = getState()[stateKey] === 0;
  el.className = 'resource-toggle';
  el.setAttribute('aria-label', `Toggle ${stateKey}`);
  el.setAttribute('aria-pressed', String(!used));
  if (used) el.classList.add('used');
}

// ─── Inventory ──────────────────────────────────
const expandedItems = new Set();

function buildScrollConfirm(spellName, spell) {
  if (!spell) return `Use Scroll of ${spellName}?`;
  const lvl = `${spell.level}${getSuffix(spell.level)} level`;
  const header = `${spellName} \u2014 Scroll (${lvl})`;
  const saveMatch = spell.description.match(/(STR|DEX|CON|INT|WIS|CHA) save/);
  const dc = CHARACTER.spellcasting.saveDC;
  const atkBonus = CHARACTER.spellcasting.attackBonus;
  if (saveMatch && spell.damage) {
    return `${header}\n${saveMatch[0]} DC ${dc} | ${spell.damage} | Half on success`;
  }
  if (saveMatch && !spell.damage) {
    return `${header}\n${saveMatch[0]} DC ${dc} | ${spell.description}`;
  }
  if (spell.description.toLowerCase().includes('spell attack') || spell.description.toLowerCase().includes('ranged spell')) {
    return `${header}\nSpell attack +${atkBonus} | ${spell.damage || spell.description}`;
  }
  if (spell.damage) {
    return `${header}\n${spell.damage}`;
  }
  return `${header}\n${spell.description}`;
}

function consumeInventoryItem(name, amount = 1) {
  const cur = getState().inventory[name] ?? 0;
  if (cur < amount) return false;
  const inv = { ...getState().inventory, [name]: cur - amount };
  update('inventory', inv);
  return true;
}

function resolveSpellCast(spell, castLevel, options = {}) {
  const slotLevel = castLevel || spell.level;
  const source = options.source || 'slot';
  const s = getState();

  if (source === 'scroll') {
    fireMadnessEvent('spellCast', { slotLevel });
    return { ok: true, note: ' (scroll)' };
  }

  if (spell.level === 0) {
    fireMadnessEvent('spellCast', { slotLevel: 0 });
    return { ok: true, note: '' };
  }

  const canUseFreeCast = source === 'slot'
    && spell.freeCast
    && slotLevel === spell.level
    && (s.rimesBindingIceFree || 0) > 0;

  if (canUseFreeCast) {
    update('rimesBindingIceFree', Math.max(0, (s.rimesBindingIceFree || 0) - 1));
    fireMadnessEvent('spellCast', { slotLevel });
    return { ok: true, note: ' (free cast)' };
  }

  const available = s.spellSlots[slotLevel] || 0;
  if (available <= 0) return { ok: false, note: '' };
  updateNested(`spellSlots.${slotLevel}`, available - 1);
  fireMadnessEvent('spellCast', { slotLevel });
  return { ok: true, note: '' };
}

async function castSpellFromScroll(scrollName, spell) {
  if (!spell) {
    if (!consumeInventoryItem(scrollName)) return;
    logRoll('cast', `${scrollName} removed`);
    renderLog(els.rollLog);
    return;
  }

  if (!checkAndSetConcentration(spell)) return;
  if (!consumeInventoryItem(scrollName)) return;

  if (spell.damage) {
    await rollSpellDice(spell, spell.level, { source: 'scroll', skipConcentrationCheck: true });
  } else {
    castNoDamageSpell(spell, spell.level, { source: 'scroll', skipConcentrationCheck: true });
  }
}

function renderInventory() {
  const container = els.inventoryContainer;
  if (!container) return;
  const s = getState();
  if (!s.inventory) return;
  container.textContent = '';

  // Group items by category
  const categories = {};
  for (const item of INVENTORY) {
    if (!categories[item.category]) categories[item.category] = [];
    categories[item.category].push(item);
  }

  // Inject custom items into their categories
  const customItems = s.customItems || {};
  for (const [name, meta] of Object.entries(customItems)) {
    const cat = meta.category || 'Miscellaneous';
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push({ name, category: cat, qty: 0, description: meta.description || '', _custom: true });
  }

  // Inject store-bought potions into the Potions category
  const staticNames = new Set(INVENTORY.map(i => i.name));
  const storePotionNames = new Set(STORE_POTIONS.map(p => p.name));
  const dynamicPotionEntries = Object.entries(s.inventory)
    .filter(([name, qty]) => !staticNames.has(name) && !name.startsWith('Scroll of ') && storePotionNames.has(name) && qty > 0)
    .sort(([a], [b]) => a.localeCompare(b));
  for (const [name] of dynamicPotionEntries) {
    if (!categories['Potions']) categories['Potions'] = [];
    categories['Potions'].push({ name, category: 'Potions', qty: 0, _dynamic: true });
  }

  const collapsedCats = s.collapsedCategories || [];

  for (const [cat, items] of Object.entries(categories)) {
    const visibleItems = items.filter(item => item._dynamic || item._custom || (s.inventory[item.name] ?? 0) > 0);
    if (visibleItems.length === 0) continue;

    const isCatCollapsed = collapsedCats.includes(cat);
    const catHeader = document.createElement('div');
    catHeader.className = 'inv-category inv-category-toggle';
    if (isCatCollapsed) catHeader.classList.add('collapsed');
    catHeader.innerHTML = `<span>${cat}</span><span class="inv-category-arrow">${isCatCollapsed ? '\u25B6' : '\u25BC'}</span>`;
    catHeader.addEventListener('click', () => {
      const cur = getState().collapsedCategories || [];
      if (cur.includes(cat)) {
        update('collapsedCategories', cur.filter(c => c !== cat));
      } else {
        update('collapsedCategories', [...cur, cat]);
      }
      renderInventory();
    });
    container.appendChild(catHeader);

    if (isCatCollapsed) continue;

    for (const item of visibleItems) {
      // Enrich dynamic items with store potion data
      const storeEntry = item._dynamic ? STORE_POTIONS.find(p => p.name === item.name) : null;
      const notes = item.notes || (storeEntry && storeEntry.notes);
      const healing = item.healing || (storeEntry && storeEntry.healing);
      const description = item.description;
      const qty = s.inventory[item.name] ?? 0;
      const isExpanded = expandedItems.has(item.name);

      const wrapper = document.createElement('div');
      wrapper.className = 'inv-item-wrapper';

      const row = document.createElement('div');
      row.className = 'inv-row';

      const nameEl = document.createElement('span');
      nameEl.className = 'inv-name';
      nameEl.textContent = item.name;
      if (notes) {
        const notesEl = document.createElement('span');
        notesEl.className = 'inv-notes';
        notesEl.textContent = notes;
        nameEl.appendChild(notesEl);
      }

      // Expand toggle — prepend before name
      let expandBtn = null;
      if (description) {
        expandBtn = document.createElement('button');
        expandBtn.className = 'spell-expand-toggle resource-expand-toggle';
        expandBtn.textContent = isExpanded ? '\u2212' : '+';
        expandBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (expandedItems.has(item.name)) expandedItems.delete(item.name);
          else expandedItems.add(item.name);
          renderInventory();
        });
      }

      const controls = document.createElement('div');
      controls.className = 'inv-controls';

      const minus = document.createElement('button');
      minus.className = 'btn btn-icon inv-btn';
      minus.textContent = '\u2212';
      minus.setAttribute('aria-label', `Decrease ${item.name}`);
      minus.disabled = qty <= 0;
      minus.addEventListener('click', () => {
        if (!consumeInventoryItem(item.name)) return;
        logRoll('resource', `Removed ${item.name} from inventory`);
        renderLog(els.rollLog);
      });

      const qtyEl = document.createElement('span');
      qtyEl.className = 'inv-qty';
      qtyEl.textContent = qty;

      const plus = document.createElement('button');
      plus.className = 'btn btn-icon inv-btn';
      plus.textContent = '+';
      plus.setAttribute('aria-label', `Increase ${item.name}`);
      plus.addEventListener('click', () => {
        const cur = getState().inventory[item.name] ?? 0;
        const inv = { ...getState().inventory, [item.name]: cur + 1 };
        update('inventory', inv);
      });

      controls.appendChild(minus);
      controls.appendChild(qtyEl);
      controls.appendChild(plus);

      if (expandBtn) row.appendChild(expandBtn);
      row.appendChild(nameEl);
      row.appendChild(controls);
      wrapper.appendChild(row);

      // Description
      if (item.description && isExpanded) {
        const descDiv = document.createElement('div');
        descDiv.className = 'resource-desc';
        descDiv.textContent = item.description;
        wrapper.appendChild(descDiv);
      }

      container.appendChild(wrapper);
    }
  }

  // Dynamic scroll items
  const scrollItems = Object.entries(s.inventory)
    .filter(([name, qty]) => name.startsWith('Scroll of ') && qty > 0)
    .sort(([a], [b]) => a.localeCompare(b));

  if (scrollItems.length > 0) {
    const scrollHeader = document.createElement('div');
    scrollHeader.className = 'inv-category';
    scrollHeader.textContent = 'Scrolls';
    container.appendChild(scrollHeader);

    for (const [scrollName, qty] of scrollItems) {
      const spellName = scrollName.replace('Scroll of ', '');
      const spell = SPELLS.find(sp => sp.name === spellName);

      const wrapper = document.createElement('div');
      wrapper.className = 'inv-item-wrapper';

      const row = document.createElement('div');
      row.className = 'inv-row';

      const nameEl = document.createElement('span');
      nameEl.className = 'inv-name';
      nameEl.textContent = scrollName;
      if (spell) {
        const notesEl = document.createElement('span');
        notesEl.className = 'inv-notes';
        notesEl.textContent = `${spell.level}${getSuffix(spell.level)} level`;
        nameEl.appendChild(notesEl);
      }

      const controls = document.createElement('div');
      controls.className = 'inv-controls';

      const minus = document.createElement('button');
      minus.className = 'btn btn-icon inv-btn';
      minus.textContent = '\u2212';
      minus.addEventListener('click', async () => {
        const cur = getState().inventory[scrollName] ?? 0;
        if (cur <= 0) return;
        const shouldCast = confirm(`${buildScrollConfirm(spellName, spell)}\n\nPress OK to cast from the scroll. Press Cancel to remove the scroll without casting.`);
        if (shouldCast) {
          await castSpellFromScroll(scrollName, spell);
          renderLog(els.rollLog);
          return;
        }

        if (!consumeInventoryItem(scrollName)) return;
        logRoll('resource', `Removed ${scrollName} from inventory`);
        renderLog(els.rollLog);
      });

      const qtyEl = document.createElement('span');
      qtyEl.className = 'inv-qty';
      qtyEl.textContent = qty;

      const plus = document.createElement('button');
      plus.className = 'btn btn-icon inv-btn';
      plus.textContent = '+';
      plus.addEventListener('click', () => {
        const inv = { ...getState().inventory, [scrollName]: (getState().inventory[scrollName] ?? 0) + 1 };
        update('inventory', inv);
      });

      controls.appendChild(minus);
      controls.appendChild(qtyEl);
      controls.appendChild(plus);

      row.appendChild(nameEl);
      row.appendChild(controls);
      wrapper.appendChild(row);
      container.appendChild(wrapper);
    }
  }
}

async function rollHealingPotion(item) {
  if (getState().physicalDice) {
    logRoll('resource', `${item.name}: Roll ${item.healing.count}d${item.healing.sides}+${item.healing.bonus} healing`);
    renderLog(els.rollLog);
    return;
  }
  const { count, sides, bonus } = item.healing;
  const rolls = [];
  for (let i = 0; i < count; i++) {
    rolls.push(Math.floor(Math.random() * sides) + 1);
  }
  const total = rolls.reduce((a, b) => a + b, 0) + bonus;

  clearDiceActions();
  await dice.animateDice(els.diceStage, rolls.map(v => ({ sides, result: v })));
  await dice.animateRoll(els.diceResult, total, sides);
  els.diceBreakdown.textContent = `[${rolls.join(', ')}] + ${bonus}`;
  els.diceLabel.textContent = `${item.name}`;
  logRoll('healing', `${item.name}: [${rolls.join(',')}]+${bonus} = ${total}`);
  renderLog(els.rollLog);
}

// ─── Healing Hands (Aasimar racial) ─────────────
async function rollHealingHandsAction() {
  if (getState().physicalDice) {
    logRoll('healing', `Healing Hands: Roll ${CHARACTER.proficiencyBonus}d4 healing`);
    renderLog(els.rollLog);
    return;
  }

  clearDiceActions();
  const result = dice.rollHealingHands(CHARACTER.proficiencyBonus);
  const diceSpec = result.dice.map(v => ({ sides: 4, result: v }));
  await dice.animateDice(els.diceStage, diceSpec);
  await dice.animateRoll(els.diceResult, result.total, 4);
  els.diceBreakdown.textContent = `[${result.dice.join(', ')}]`;
  els.diceLabel.textContent = 'Healing Hands';
  logRoll('healing', `Healing Hands: [${result.dice.join(',')}] = ${result.total}`);
  renderLog(els.rollLog);
}

// ─── Inspiration ─────────────────────────────────
function renderInspiration() {
  const s = getState();
  els.inspirationStar.textContent = '\u2B50';
  els.inspirationStar.setAttribute('aria-label', 'Heroic Inspiration');
  els.inspirationStar.setAttribute('aria-pressed', String(!!s.heroicInspiration));
  els.inspirationStar.className = 'inspiration-star header-star';
  if (s.heroicInspiration) {
    els.inspirationStar.classList.add('inspiration-active');
  } else {
    els.inspirationStar.classList.add('inactive');
  }
}

// ─── Xanthrid Header Toggle ──────────────────────
function renderXanthridToggle() {
  const s = getState();
  const btn = document.getElementById('btn-xanthrid-toggle');
  if (!btn) return;
  btn.textContent = '\uD83E\uDEBD'; // 🪽 wing
  btn.setAttribute('aria-label', 'Summon/Dismiss Xanthrid');
  btn.className = 'header-star xanthrid-toggle';
  if (s.xanthridCompanion.active) {
    btn.classList.add('xanthrid-active');
  }
}

// ─── Aberrant Spirit Header Toggle ───────────────
function renderAberrantToggle() {
  const s = getState();
  const btn = document.getElementById('btn-aberrant-toggle');
  if (!btn) return;
  btn.textContent = '\uD83E\uDDEB'; // 🧫
  btn.setAttribute('aria-label', 'Summon/Dismiss Aberrant Spirit');
  btn.className = 'header-star aberrant-toggle';
  if (s.aberrantSpirit && s.aberrantSpirit.active) {
    btn.classList.add('aberrant-active');
  }
}

// ─── Polymorph Header Toggle ─────────────────────
function renderPolymorphToggle() {
  const s = getState();
  const btn = document.getElementById('btn-polymorph-toggle');
  if (!btn) return;
  btn.textContent = '\uD83D\uDC3B'; // 🐻
  btn.setAttribute('aria-label', 'Activate/End Polymorph');
  btn.className = 'header-star polymorph-toggle';
  if (s.polymorphForm && s.polymorphForm.active) {
    btn.classList.add('polymorph-active');
  }
}

// ─── Store Header Toggle ─────────────────────────
function renderStoreToggle() {
  const s = getState();
  const btn = document.getElementById('btn-store-toggle');
  if (!btn) return;
  btn.textContent = '\uD83D\uDED2'; // 🛒
  btn.className = 'header-star store-toggle';
  if (s.storeOpen) {
    btn.classList.add('store-active');
  }
  const panel = document.getElementById('store-panel');
  if (panel) panel.style.display = s.storeOpen ? '' : 'none';
}

// ─── Spell Cards ─────────────────────────────────

function parseSpellDice(damageStr) {
  if (!damageStr) return null;
  // "3x 2d6 Fire" → rays pattern
  const rayMatch = damageStr.match(/^(\d+)x\s+(\d+)d(\d+)/);
  if (rayMatch) return { count: parseInt(rayMatch[2]), sides: parseInt(rayMatch[3]), rays: parseInt(rayMatch[1]) };
  // Find all NdN groups
  const groups = [];
  for (const m of damageStr.matchAll(/(\d+)d(\d+)/g)) {
    groups.push({ count: parseInt(m[1]), sides: parseInt(m[2]) });
  }
  if (groups.length === 0) return null;
  if (groups.length === 1) return groups[0];
  return { multi: groups };
}

function canCastSpell(spell) {
  const s = getState();
  if (spell.level === 0) return true;
  if (spell.freeCast && (s.rimesBindingIceFree || 0) > 0) return true;
  // Can cast via spell slot
  const maxSlotLevel = Math.max(...Object.keys(CHARACTER.spellSlots).map(Number));
  for (let lvl = spell.level; lvl <= maxSlotLevel; lvl++) {
    if ((s.spellSlots[lvl] || 0) > 0) return true;
  }
  // Can cast via Psionic Sorcery (SP)
  if (spell.spCast && s.sorceryPoints >= spell.spCast) return true;
  return false;
}

function canCastPsionic(spell) {
  return spell.spCast && getState().sorceryPoints >= spell.spCast;
}

function castPsionic(spell) {
  const s = getState();
  if (!spell.spCast || s.sorceryPoints < spell.spCast) return;
  if (!checkAndSetConcentration(spell)) return;
  update('sorceryPoints', s.sorceryPoints - spell.spCast);
  fireMadnessEvent('spellCast', { slotLevel: spell.level });
  logRoll('cast', `${spell.name} (Psionic: ${spell.spCast} SP, no V/S)`);

  // Handle Summon Aberration via psionic
  if (spell.name === 'Summon Aberration') {
    const castLevel = spell.level;
    const maxHp = ABERRANT_SPIRIT.getMaxHp(castLevel);
    update('aberrantSpirit', {
      active: true,
      form: getState().aberrantSpirit.form || 'beholderkin',
      castLevel,
      hp: maxHp,
      maxHp: maxHp,
      tempHp: 0,
    });
    logRoll('cast', `Aberrant Spirit summoned (${ABERRANT_SPIRIT.forms[getState().aberrantSpirit.form].label}, ${castLevel}${getSuffix(castLevel)} level)`);
  }

  renderLog(els.rollLog);
}

async function rollSpellDicePsionic(spell) {
  const s = getState();
  if (!spell.spCast || s.sorceryPoints < spell.spCast) return;
  if (!checkAndSetConcentration(spell)) return;
  update('sorceryPoints', s.sorceryPoints - spell.spCast);
  fireMadnessEvent('spellCast', { slotLevel: spell.level });

  if (getState().physicalDice) {
    logRoll('cast', `${spell.name} (Psionic: ${spell.spCast} SP, no V/S)`);
    renderLog(els.rollLog);
    return;
  }

  clearDiceActions();
  const parsed = parseSpellDice(spell.damage);
  if (!parsed) return;

  const result = dice.rollDamage(parsed.count, parsed.sides, parsed.modifier || 0);
  const diceSpec = result.dice.map(v => ({ sides: parsed.sides, result: v }));
  await dice.animateDice(els.diceStage, diceSpec);
  await dice.animateRoll(els.diceResult, result.total, parsed.sides);
  const modStr = result.modifier > 0 ? `+${result.modifier}` : '';
  els.diceBreakdown.textContent = `[${result.dice.join(', ')}]${modStr}`;
  els.diceLabel.textContent = `${spell.name} (Psionic)`;
  logRoll('damage', `${spell.name} (Psionic ${spell.spCast} SP): [${result.dice.join(',')}]${modStr} = ${result.total}`);

  if (result.dice.length > 1) {
    lastDamageRoll = { dmg: { name: spell.name, sides: parsed.sides }, result };
    showEmpowerButton();
  }
  renderLog(els.rollLog);
}

function renderSpellCards() {
  const s = getState();

  if (els.expandAllBtn) {
    els.expandAllBtn.textContent = allExpanded ? 'Expand All \u2713' : 'Expand All';
    els.expandAllBtn.classList.toggle('active', allExpanded);
  }

  // Apply filters
  const searchLower = spellSearch.toLowerCase();
  const filtered = SPELLS.filter(sp => {
    // Text search
    if (searchLower && !sp.name.toLowerCase().includes(searchLower) && !sp.description.toLowerCase().includes(searchLower)) return false;
    // Level
    if (spellFilters.level.length && !spellFilters.level.includes(String(sp.level))) return false;
    // Cast time
    if (spellFilters.castTime.length && !spellFilters.castTime.includes(sp.castTime)) return false;
    // Target
    if (spellFilters.target.length && !spellFilters.target.includes(sp.target)) return false;
    // School
    if (spellFilters.school.length && !spellFilters.school.includes(sp.school)) return false;
    // Source
    if (spellFilters.source.length && !spellFilters.source.includes(sp.source)) return false;
    // Damage type (damageType is an array or null — match if any selected type is in the spell's array)
    if (spellFilters.damageType.length) {
      if (!sp.damageType || !spellFilters.damageType.some(t => sp.damageType.includes(t))) return false;
    }
    // Flags
    if (spellFilters.flags.length) {
      for (const flag of spellFilters.flags) {
        if (flag === 'conc' && !sp.concentration) return false;
        if (flag === 'psionic' && !sp.spCast) return false;
        if (flag === 'damage' && !sp.damage) return false;
        if (flag === 'nodamage' && sp.damage) return false;
      }
    }
    return true;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (spellSort === 'name') return a.name.localeCompare(b.name);
    if (spellSort === 'castTime') {
      const order = { 'Reaction': 0, 'Action': 1, '1 min': 2 };
      return (order[a.castTime] ?? 9) - (order[b.castTime] ?? 9) || a.level - b.level;
    }
    return a.level - b.level || a.name.localeCompare(b.name); // default: level
  });

  // Show count
  if (els.spellCount) {
    const total = SPELLS.length;
    els.spellCount.textContent = sorted.length === total ? `${total} spells` : `${sorted.length} of ${total} spells`;
  }

  els.spellGrid.textContent = '';

  // Group by level with subheaders when sorted by level
  let lastLevel = -1;

  for (const spell of sorted) {
    // Level subheader when sorted by level
    if (spellSort === 'level' && spell.level !== lastLevel) {
      lastLevel = spell.level;
      const subheader = document.createElement('div');
      subheader.className = 'spell-level-header';
      subheader.textContent = spell.level === 0 ? 'Cantrips' : `${spell.level}${getSuffix(spell.level)} Level`;
      subheader.style.gridColumn = '1 / -1';
      els.spellGrid.appendChild(subheader);
    }

    const isExpanded = allExpanded || expandedSpells.has(spell.name);
    const hasDice = !!parseSpellDice(spell.damage);
    const castable = canCastSpell(spell);

    const card = document.createElement('div');
    card.className = 'spell-card';
    card.dataset.source = spell.source;
    if (isExpanded) card.classList.add('expanded');

    // Header row
    const header = document.createElement('div');
    header.className = 'spell-card-header';

    const nameRow = document.createElement('div');
    nameRow.className = 'spell-name-row';

    const nameEl = document.createElement('span');
    nameEl.className = 'spell-name';
    if (spell.concentration) nameEl.classList.add('spell-name-conc');
    nameEl.textContent = spell.name;
    nameRow.appendChild(nameEl);

    // Die icon for spells with damage, cast icon for non-damage leveled spells
    if (hasDice || spell.level > 0) {
      const btn = document.createElement('button');

      if (hasDice) {
        btn.className = 'spell-roll-die';
        btn.textContent = '\uD83C\uDFB2'; // 🎲
        btn.title = `Roll ${spell.damage}`;
      } else {
        btn.className = 'spell-roll-die spell-cast-btn';
        const icon = document.createElement('i');
        icon.className = 'fa-solid fa-wand-sparkles';
        btn.appendChild(icon);
        btn.title = 'Cast (use spell slot)';
      }

      if (!castable) {
        btn.classList.add('disabled');
        btn.title = 'No spell slots available';
      }

      // Upcast picker for leveled spells
      let upcastSelect = null;
      if (spell.level >= 1) {
        const picker = document.createElement('span');
        picker.className = 'upcast-picker';
        upcastSelect = document.createElement('select');
        upcastSelect.title = 'Cast at higher level';
        const maxSlotLevel = Math.max(...Object.keys(CHARACTER.spellSlots).map(Number));
        for (let lvl = spell.level; lvl <= maxSlotLevel; lvl++) {
          const opt = document.createElement('option');
          opt.value = lvl;
          opt.textContent = lvl === spell.level ? `${lvl}` : `${lvl}\u2191`;
          const slotsAvail = s.spellSlots[lvl] || 0;
          const hasFreeCast = spell.freeCast && lvl === spell.level && (s.rimesBindingIceFree || 0) > 0;
          if (slotsAvail <= 0 && !hasFreeCast) opt.disabled = true;
          upcastSelect.appendChild(opt);
        }
        upcastSelect.addEventListener('click', (e) => e.stopPropagation());
        picker.appendChild(upcastSelect);
        nameRow.appendChild(picker);
      }

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const castLevel = upcastSelect ? parseInt(upcastSelect.value) : spell.level;
        if (hasDice) {
          rollSpellDice(spell, castLevel);
        } else {
          castNoDamageSpell(spell, castLevel);
        }
      });
      nameRow.appendChild(btn);

      // Psionic Sorcery button for Aberrant spells with spCast
      if (spell.spCast) {
        const psiBtn = document.createElement('button');
        psiBtn.className = 'spell-psi-btn';
        psiBtn.textContent = `\u03A8${spell.spCast}`;
        psiBtn.title = `Psionic Sorcery: cast for ${spell.spCast} SP (no V/S components)`;
        if (!canCastPsionic(spell)) psiBtn.classList.add('disabled');
        psiBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (!canCastPsionic(spell)) return;
          if (hasDice) {
            rollSpellDicePsionic(spell);
          } else {
            castPsionic(spell);
          }
        });
        nameRow.appendChild(psiBtn);
      }
    }

    const rightSide = document.createElement('div');
    rightSide.className = 'spell-header-right';

    const sourceEl = document.createElement('span');
    sourceEl.className = 'spell-source';
    sourceEl.textContent = spell.source;
    rightSide.appendChild(sourceEl);

    // Per-card expand toggle
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'spell-expand-toggle';
    toggleBtn.textContent = isExpanded ? '\u2212' : '+';
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (expandedSpells.has(spell.name)) {
        expandedSpells.delete(spell.name);
      } else {
        expandedSpells.add(spell.name);
      }
      renderSpellCards();
    });
    rightSide.appendChild(toggleBtn);

    header.appendChild(nameRow);
    header.appendChild(rightSide);

    // Meta row
    const meta = document.createElement('div');
    meta.className = 'spell-meta';
    const castEl = document.createElement('span');
    castEl.textContent = spell.castTime;
    const rangeEl = document.createElement('span');
    rangeEl.textContent = spell.range;
    meta.appendChild(castEl);
    meta.appendChild(rangeEl);

    if (spell.damage) {
      const dmgEl = document.createElement('span');
      dmgEl.className = 'spell-damage';
      dmgEl.textContent = spell.damage;
      meta.appendChild(dmgEl);
    }

    if (spell.concentration) {
      const concEl = document.createElement('span');
      concEl.className = 'spell-concentration';
      concEl.textContent = 'C';
      meta.appendChild(concEl);
    }

    // Short description (always visible)
    const desc = document.createElement('div');
    desc.className = 'spell-desc';
    desc.textContent = spell.description;

    card.appendChild(header);
    card.appendChild(meta);
    card.appendChild(desc);

    // Full handbook text (shown when expanded)
    const fullTextHtml = SPELL_FULL_TEXT[spell.name];
    if (fullTextHtml) {
      const fullDiv = document.createElement('div');
      fullDiv.className = 'spell-full-text';
      // Safe: SPELL_FULL_TEXT is our own static data, not user input
      fullDiv.innerHTML = fullTextHtml; // eslint-disable-line no-unsanitized/property
      card.appendChild(fullDiv);
    }

    els.spellGrid.appendChild(card);
  }
}

// ─── Concentration Guard ─────────────────────────
// Returns false if the user cancelled casting. Sets concentration if applicable.
function checkAndSetConcentration(spell) {
  const s = getState();
  if (!spell.concentration) return true;
  if (s.concentration && s.concentration !== spell.name) {
    if (!confirm(`You are concentrating on ${s.concentration}.\nDrop it and concentrate on ${spell.name} instead?`)) {
      return false;
    }
    // Dismiss spirit if dropping Summon Aberration concentration
    if (s.concentration === 'Summon Aberration' && s.aberrantSpirit && s.aberrantSpirit.active) {
      update('aberrantSpirit', { ...s.aberrantSpirit, active: false });
    }
    // Dismiss polymorph if dropping Polymorph concentration
    if (s.concentration === 'Polymorph' && s.polymorphForm && s.polymorphForm.active) {
      update('polymorphForm', { ...s.polymorphForm, active: false, thp: 0 });
    }
  }
  update('concentration', spell.name);
  return true;
}

// ─── Spell Die Rolling ──────────────────────────
async function rollSpellDice(spell, castLevel, options = {}) {
  const slotLevel = castLevel || spell.level;

  // Concentration guard — ask before replacing
  if (!options.skipConcentrationCheck && !checkAndSetConcentration(spell)) return;

  const resource = resolveSpellCast(spell, slotLevel, options);
  if (!resource.ok) return;

  // Physical dice mode — slot consumed, skip animation
  if (getState().physicalDice) return;

  clearDiceActions();

  // Handle Sorcerous Burst specially (exploding 8s)
  if (spell.name === 'Sorcerous Burst') {
    const rolls = dice.rollSorcerousBurst();
    const total = rolls.reduce((a, b) => a + b, 0);
    await dice.animateDice(els.diceStage, rolls.map(v => ({ sides: 8, result: v })));
    await dice.animateRoll(els.diceResult, total, 8);
    els.diceBreakdown.textContent = `[${rolls.join(', ')}]`;
    els.diceLabel.textContent = `${spell.name}`;
    logRoll('damage', `${spell.name}: [${rolls.join(',')}] = ${total}`);
    lastDamageRoll = { dmg: { name: spell.name, sides: 8 }, result: { dice: rolls, total, modifier: 0 } };
    showEmpowerButton();
    renderLog(els.rollLog);
    return;
  }

  const parsed = parseSpellDice(spell.damage);
  if (!parsed) return;

  // Calculate upcast bonus dice/rays
  const upcastLevels = slotLevel - spell.level;
  const upcast = spell.upcast;

  let result;
  let primarySides;

  if (parsed.rays) {
    // Multiple rays (Scorching Ray: 3x 2d6)
    const rayCount = parsed.rays + (upcast && upcast.rays ? upcastLevels * upcast.perLevel : 0);
    let allDice = [];
    let total = 0;
    for (let r = 0; r < rayCount; r++) {
      const roll = dice.rollDamage(parsed.count, parsed.sides, 0);
      allDice.push(...roll.dice);
      total += roll.total;
    }
    result = { dice: allDice, total, modifier: 0 };
    primarySides = parsed.sides;
  } else if (parsed.multi) {
    // Multiple groups (Void of Torment: 2d6 + 2d6)
    // Upcast adds dice to first group only (player's choice which type)
    let allDice = [];
    let total = 0;
    const extraDice = upcast && !upcast.rays ? upcastLevels * upcast.perLevel : 0;
    parsed.multi.forEach((g, i) => {
      const bonus = i === 0 ? extraDice : 0;
      const roll = dice.rollDamage(g.count + bonus, g.sides, 0);
      allDice.push(...roll.dice);
      total += roll.total;
    });
    result = { dice: allDice, total, modifier: 0 };
    primarySides = parsed.multi[0].sides;
  } else {
    const extraDice = upcast && !upcast.rays ? upcastLevels * upcast.perLevel : 0;
    result = dice.rollDamage(parsed.count + extraDice, parsed.sides, 0);
    primarySides = parsed.sides;
  }

  // Animate dice
  const diceSpec = result.dice.map(v => ({ sides: primarySides, result: v }));
  await dice.animateDice(els.diceStage, diceSpec);

  // Chromatic Orb: check for doubles (leap mechanic)
  let hasDoubles = false;
  if (spell.name === 'Chromatic Orb') {
    hasDoubles = checkForDoubles(result.dice);
    if (hasDoubles) highlightDoubles(result.dice, primarySides);
  }

  await dice.animateRoll(els.diceResult, result.total, primarySides);

  const upcastTag = slotLevel > spell.level ? ` (${slotLevel}${getSuffix(slotLevel)} slot)` : '';
  const leapTag = hasDoubles ? ' LEAPS!' : '';
  els.diceBreakdown.textContent = `[${result.dice.join(', ')}]${leapTag}`;
  els.diceLabel.textContent = spell.name + upcastTag;

  const isHealing = spell.damage.includes('Healing');
  const logType = isHealing ? 'healing' : 'damage';
  const slotNote = spell.level > 0 && options.source !== 'scroll' ? ` (${slotLevel}${getSuffix(slotLevel)} slot)` : '';
  const sourceNote = resource.note || '';
  const resourceNote = slotNote;
  logRoll(logType, `${spell.name}: [${result.dice.join(',')}] = ${result.total}${resourceNote}${sourceNote}${leapTag}`);

  // Show leap alert in actions area
  if (hasDoubles) showLeapAlert(slotLevel);

  // Offer Empower for multi-die damage rolls
  if (!isHealing && result.dice.length > 1) {
    lastDamageRoll = { dmg: { name: spell.name, sides: primarySides }, result };
    showEmpowerButton();
  }

  renderLog(els.rollLog);
}

// Cast a non-damage spell (just consume slot + log)
function castNoDamageSpell(spell, castLevel, options = {}) {
  if (!options.skipConcentrationCheck && !checkAndSetConcentration(spell)) return;
  const slotLevel = castLevel || spell.level;
  const resource = resolveSpellCast(spell, slotLevel, options);
  if (!resource.ok) return;
  const upcastTag = slotLevel > spell.level && options.source !== 'scroll' ? ` (${slotLevel}${getSuffix(slotLevel)} slot)` : '';
  logRoll('cast', `${spell.name}${upcastTag}${resource.note || ''}`);

  // Summon Aberration — activate the Aberrant Spirit companion
  if (spell.name === 'Summon Aberration') {
    const maxHp = ABERRANT_SPIRIT.getMaxHp(slotLevel);
    update('aberrantSpirit', {
      active: true,
      form: getState().aberrantSpirit.form || 'beholderkin',
      castLevel: slotLevel,
      hp: maxHp,
      maxHp: maxHp,
      tempHp: 0,
    });
    logRoll('cast', `Aberrant Spirit summoned (${ABERRANT_SPIRIT.forms[getState().aberrantSpirit.form].label}, ${slotLevel}${getSuffix(slotLevel)} level)`);
  }

  // Polymorph — activate the polymorph companion card
  if (spell.name === 'Polymorph') {
    const curForm = getState().polymorphForm.form || 'greatYeti';
    const formConfig = POLYMORPH_FORMS[curForm];
    update('polymorphForm', {
      active: true,
      form: curForm,
      thp: formConfig.thp,
    });
    logRoll('cast', `Polymorphed into ${formConfig.label} (${formConfig.thp} THP)`);
  }

  renderLog(els.rollLog);
}

// Check if any two dice share the same value
function checkForDoubles(diceResults) {
  const seen = new Set();
  for (const v of diceResults) {
    if (seen.has(v)) return true;
    seen.add(v);
  }
  return false;
}

// Find which dice values are doubled and highlight them in the stage
function highlightDoubles(diceResults, sides) {
  const counts = {};
  for (const v of diceResults) counts[v] = (counts[v] || 0) + 1;
  const doubledValues = new Set(Object.entries(counts).filter(([, c]) => c >= 2).map(([v]) => parseInt(v)));

  // Re-render dice in stage with doubled ones highlighted
  const dieSize = diceResults.length > 6 ? 32 : 44;
  els.diceStage.textContent = '';
  els.diceStage.classList.add('active');
  diceResults.forEach((val, i) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'die-svg landed';
    if (doubledValues.has(val)) wrapper.classList.add('doubled');
    const svg = dice.createDieSVG(sides, val, dieSize);
    wrapper.appendChild(svg);
    els.diceStage.appendChild(wrapper);
  });
}

// Show a "LEAPS!" alert badge with re-roll button
function showLeapAlert(slotLevel, leapsUsed = 0) {
  const remaining = slotLevel - leapsUsed;
  const totalDice = 3 + (slotLevel - 1);

  const container = document.createElement('div');
  container.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:4px;width:100%';

  const badge = document.createElement('span');
  badge.className = 'doubles-alert';
  badge.textContent = `\u26A1 DOUBLES \u2014 Orb leaps! (${remaining} of ${slotLevel} remaining)`;
  container.appendChild(badge);

  if (remaining > 0) {
    const leapBtn = document.createElement('button');
    leapBtn.className = 'btn btn-small btn-leap';
    leapBtn.textContent = `Roll leap damage (${totalDice}d8)`;
    leapBtn.addEventListener('click', () => rollLeapDamage(slotLevel, leapsUsed + 1));
    container.appendChild(leapBtn);
  }

  els.diceActions.prepend(container);
}

// Re-roll Chromatic Orb damage for a leap — no slot consumed
async function rollLeapDamage(slotLevel, leapsUsed) {
  clearDiceActions();

  const totalDice = 3 + (slotLevel - 1);
  const result = dice.rollDamage(totalDice, 8, 0);

  const diceSpec = result.dice.map(v => ({ sides: 8, result: v }));
  await dice.animateDice(els.diceStage, diceSpec);

  // Check for another leap
  const hasDoubles = checkForDoubles(result.dice);
  if (hasDoubles) highlightDoubles(result.dice, 8);

  await dice.animateRoll(els.diceResult, result.total, 8);

  const leapTag = hasDoubles && leapsUsed < slotLevel ? ' LEAPS AGAIN!' : '';
  els.diceBreakdown.textContent = `[${result.dice.join(', ')}]${leapTag}`;
  els.diceLabel.textContent = `Chromatic Orb Leap ${leapsUsed}/${slotLevel} (no slot)`;
  logRoll('damage', `Chromatic Orb Leap ${leapsUsed}/${slotLevel}: [${result.dice.join(',')}] = ${result.total}${leapTag}`);

  if (hasDoubles) showLeapAlert(slotLevel, leapsUsed);

  // Offer Empower on leap damage too
  if (result.dice.length > 1) {
    lastDamageRoll = { dmg: { name: 'Chromatic Orb', sides: 8 }, result };
    showEmpowerButton();
  }

  renderLog(els.rollLog);
}

// ─── Aberrant Spirit Companion ──────────────────
let spiritEventsbound = false;

function renderAberrantSpirit() {
  const s = getState();
  const spirit = s.aberrantSpirit;
  if (!spirit || !els.spiritPanel) return;

  // Show/hide panel
  els.spiritPanel.style.display = spirit.active ? '' : 'none';
  if (!spirit.active) return;

  const formConfig = ABERRANT_SPIRIT.forms[spirit.form];
  const castLevel = spirit.castLevel;
  const ac = ABERRANT_SPIRIT.getAC(castLevel);
  const multiattack = ABERRANT_SPIRIT.getMultiattack(castLevel);
  const dmg = ABERRANT_SPIRIT.getAttackDamage(spirit.form, castLevel);

  // Form selector (radios)
  els.spiritFormSelector.textContent = '';
  for (const [key, form] of Object.entries(ABERRANT_SPIRIT.forms)) {
    const label = document.createElement('label');
    label.className = 'spirit-form-label';
    if (key === spirit.form) label.classList.add('active');

    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'spirit-form';
    radio.value = key;
    radio.checked = key === spirit.form;
    radio.addEventListener('change', () => {
      const cur = getState().aberrantSpirit;
      update('aberrantSpirit', { ...cur, form: key });
    });

    const span = document.createElement('span');
    span.textContent = form.label;
    label.appendChild(radio);
    label.appendChild(span);
    els.spiritFormSelector.appendChild(label);
  }

  // Stat summary
  els.spiritStats.textContent = '';
  const stats = [
    ['AC', ac],
    ['Speed', formConfig.speed],
    ['Multiattack', multiattack + 'x'],
    ['Prof', '+' + ABERRANT_SPIRIT.profBonus],
    ['Immunities', ABERRANT_SPIRIT.immunities.join(', ')],
  ];
  for (const [label, value] of stats) {
    const row = document.createElement('div');
    row.className = 'spirit-stat-row';
    const lbl = document.createElement('span');
    lbl.className = 'spirit-stat-label';
    lbl.textContent = label;
    const val = document.createElement('span');
    val.className = 'spirit-stat-value';
    val.textContent = value;
    row.appendChild(lbl);
    row.appendChild(val);
    els.spiritStats.appendChild(row);
  }

  // HP bar
  const maxHp = spirit.maxHp;
  const pct = Math.max(0, Math.min(100, (spirit.hp / maxHp) * 100));
  els.spiritHpFill.style.width = pct + '%';
  els.spiritHpFill.className = 'hp-bar-fill';
  if (pct > 50) els.spiritHpFill.classList.add('hp-high');
  else if (pct > 25) els.spiritHpFill.classList.add('hp-mid');
  else if (pct > 10) els.spiritHpFill.classList.add('hp-low');
  else els.spiritHpFill.classList.add('hp-critical');

  const tempStr = spirit.tempHp > 0 ? ` +${spirit.tempHp}` : '';
  els.spiritHpText.textContent = `${spirit.hp}/${maxHp}${tempStr}`;

  if (spirit.tempHp > 0) {
    const tempPct = (spirit.tempHp / (maxHp + spirit.tempHp)) * 100;
    els.spiritHpTempBar.style.width = tempPct + '%';
    els.spiritHpTempBar.style.display = 'block';
  } else {
    els.spiritHpTempBar.style.display = 'none';
  }

  // Slaad regen button
  els.spiritRegenRow.style.display = spirit.form === 'slaad' ? '' : 'none';

  // Mind Flayer aura button
  els.spiritAuraRow.style.display = spirit.form === 'mindflayer' ? '' : 'none';

  // Attack buttons
  els.spiritAttacks.textContent = '';
  const atkLabel = `${formConfig.attack.name} +${formConfig.attack.bonus} (${dmg.count}d${dmg.sides}+${dmg.modifier} ${dmg.type})`;
  for (let i = 0; i < multiattack; i++) {
    const btn = document.createElement('button');
    btn.className = 'btn btn-small spirit-attack-btn';
    btn.textContent = `${formConfig.attack.name} ${i + 1}`;
    btn.title = atkLabel;
    btn.addEventListener('click', () => rollSpiritAttack(spirit.form, castLevel));
    els.spiritAttacks.appendChild(btn);
  }

  // Traits
  els.spiritTraits.textContent = '';
  if (formConfig.traits.length > 0) {
    for (const trait of formConfig.traits) {
      const div = document.createElement('div');
      div.className = 'spirit-trait';
      div.textContent = trait;
      els.spiritTraits.appendChild(div);
    }
  }

  // Bind events once
  if (!spiritEventsbound) {
    bindSpiritEvents();
    spiritEventsbound = true;
  }
}

function bindSpiritEvents() {
  // Dismiss
  document.getElementById('btn-dismiss-spirit').addEventListener('click', () => {
    const cur = getState().aberrantSpirit;
    update('aberrantSpirit', { ...cur, active: false, hp: 0 });
    // Clear concentration if it was Summon Aberration
    if (getState().concentration === 'Summon Aberration') {
      update('concentration', '');
    }
    logRoll('cast', 'Aberrant Spirit dismissed');
    renderLog(els.rollLog);
  });

  // Damage
  populateDmgTypeSelect('spirit-dmg-type');
  document.getElementById('btn-spirit-damage').addEventListener('click', () => {
    const val = parseInt(els.spiritHpInput.value) || 0;
    const dmgType = document.getElementById('spirit-dmg-type').value;
    if (val > 0) {
      applySpiritDamage(val, dmgType);
      els.spiritHpInput.value = '';
    }
  });

  // Heal
  document.getElementById('btn-spirit-heal').addEventListener('click', () => {
    const val = parseInt(els.spiritHpInput.value) || 0;
    if (val > 0) {
      applySpiritHealing(val);
      els.spiritHpInput.value = '';
    }
  });

  // Temp HP
  document.getElementById('btn-spirit-temp-hp').addEventListener('click', () => {
    const val = parseInt(els.spiritTempHpInput.value) || 0;
    const cur = getState().aberrantSpirit;
    update('aberrantSpirit', { ...cur, tempHp: Math.max(cur.tempHp, val) });
    els.spiritTempHpInput.value = '';
  });

  // Regen
  document.getElementById('btn-spirit-regen').addEventListener('click', () => {
    const cur = getState().aberrantSpirit;
    if (cur.hp <= 0) return; // must have at least 1 HP
    const newHp = Math.min(cur.maxHp, cur.hp + 5);
    const healed = newHp - cur.hp;
    if (healed > 0) {
      update('aberrantSpirit', { ...cur, hp: newHp });
      logRoll('healing', `Aberrant Spirit (Slaad) regenerates +${healed} HP`);
      renderLog(els.rollLog);
    }
  });

  // Whispering Aura
  document.getElementById('btn-spirit-aura').addEventListener('click', () => rollSpiritAura());

  // Enter key on spirit inputs
  els.spiritHpInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('btn-spirit-damage').click();
  });
  els.spiritTempHpInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('btn-spirit-temp-hp').click();
  });
}

function applySpiritDamage(rawAmount, dmgType) {
  const { final: amount, tag } = adjustForDefenses(rawAmount, dmgType, [], ABERRANT_SPIRIT.immunities);
  if (amount === 0) {
    logRoll('damage', `Aberrant Spirit: ${rawAmount} ${dmgType} damage — IMMUNE`);
    renderLog(els.rollLog);
    return;
  }
  const cur = getState().aberrantSpirit;
  let remaining = amount;
  let newTemp = cur.tempHp;
  let newHp = cur.hp;

  if (newTemp > 0) {
    if (remaining >= newTemp) {
      remaining -= newTemp;
      newTemp = 0;
    } else {
      newTemp -= remaining;
      remaining = 0;
    }
  }
  newHp = Math.max(0, newHp - remaining);
  update('aberrantSpirit', { ...cur, hp: newHp, tempHp: newTemp });
  logRoll('damage', `Aberrant Spirit takes ${amount} damage${tag} (${newHp} HP remaining)`);
  renderLog(els.rollLog);
}

function applySpiritHealing(amount) {
  const cur = getState().aberrantSpirit;
  const newHp = Math.min(cur.maxHp, cur.hp + amount);
  update('aberrantSpirit', { ...cur, hp: newHp });
}

async function rollSpiritAttack(form, castLevel) {
  const formConfig = ABERRANT_SPIRIT.forms[form];
  const atk = formConfig.attack;
  const dmg = ABERRANT_SPIRIT.getAttackDamage(form, castLevel);

  if (getState().physicalDice) {
    logRoll('attack', `${atk.name}: Roll d20+${atk.bonus} to hit, ${dmg.count}d${dmg.sides}+${dmg.modifier} ${dmg.type}`);
    renderLog(els.rollLog);
    return;
  }

  clearDiceActions();

  // Roll attack
  const atkResult = dice.rollD20(atk.bonus);
  const isCrit = atkResult.nat20;

  // Roll damage
  const diceCount = isCrit ? dmg.count * 2 : dmg.count;
  const dmgResult = dice.rollDamage(diceCount, dmg.sides, dmg.modifier);

  // Animate
  const allDiceSpec = [{ sides: 20, result: atkResult.die }];
  allDiceSpec.push(...dmgResult.dice.map(v => ({ sides: dmg.sides, result: v })));
  await dice.animateDice(els.diceStage, allDiceSpec);
  await dice.animateRoll(els.diceResult, atkResult.total);

  if (atkResult.nat20) { els.diceResult.classList.add('nat20'); triggerScreenShake(); }
  else if (atkResult.nat1) { els.diceResult.classList.add('nat1'); fireMadnessEvent('critFail'); triggerScreenShake(); }

  const critTag = isCrit ? ' CRIT!' : '';
  const modStr = dmg.modifier > 0 ? '+' + dmg.modifier : '';
  const atkText = `d20(${atkResult.die})+${atk.bonus}=${atkResult.total}${critTag}`;
  const dmgText = `[${dmgResult.dice.join(',')}]${modStr}=${dmgResult.total}`;
  els.diceBreakdown.textContent = `${atkText} | Dmg: ${dmgText}`;
  els.diceLabel.textContent = `${atk.name} (Spirit)`;
  logRoll('attack', `Spirit ${atk.name}: ${atkText} | Dmg: ${dmgText} ${dmg.type}`);
  renderLog(els.rollLog);
}

async function rollSpiritAura() {
  if (getState().physicalDice) {
    logRoll('damage', `Whispering Aura: Roll 2d6 Psychic (DC ${ABERRANT_SPIRIT.spellSaveDC} WIS save)`);
    renderLog(els.rollLog);
    return;
  }

  clearDiceActions();
  const result = dice.rollDamage(2, 6, 0);
  const diceSpec = result.dice.map(v => ({ sides: 6, result: v }));
  await dice.animateDice(els.diceStage, diceSpec);
  await dice.animateRoll(els.diceResult, result.total, 6);
  els.diceBreakdown.textContent = `[${result.dice.join(', ')}]`;
  els.diceLabel.textContent = `Whispering Aura (DC ${ABERRANT_SPIRIT.spellSaveDC} WIS)`;
  logRoll('damage', `Whispering Aura: [${result.dice.join(',')}] = ${result.total} Psychic (DC ${ABERRANT_SPIRIT.spellSaveDC} WIS)`);
  renderLog(els.rollLog);
}

// ─── Xanthrid Companion ────────────────────────────
let xanthridEventsBound = false;

function renderXanthridCompanion() {
  const s = getState();
  const xan = s.xanthridCompanion;
  if (!xan || !els.xanthridPanel) return;

  // Show/hide panel
  els.xanthridPanel.style.display = xan.active ? '' : 'none';
  if (!xan.active) return;

  const atk = XANTHRID_COMPANION.attack;

  // Stat summary
  els.xanthridStats.textContent = '';
  const stats = [
    ['AC', XANTHRID_COMPANION.ac],
    ['Speed', XANTHRID_COMPANION.speed],
    ['Skills', XANTHRID_COMPANION.skills],
    ['Resistances', XANTHRID_COMPANION.resistances.join(', ')],
    ['Senses', XANTHRID_COMPANION.senses],
    ['Languages', XANTHRID_COMPANION.languages],
  ];
  for (const [label, value] of stats) {
    const row = document.createElement('div');
    row.className = 'spirit-stat-row';
    const lbl = document.createElement('span');
    lbl.className = 'spirit-stat-label';
    lbl.textContent = label;
    const val = document.createElement('span');
    val.className = 'spirit-stat-value';
    val.textContent = value;
    row.appendChild(lbl);
    row.appendChild(val);
    els.xanthridStats.appendChild(row);
  }

  // HP bar
  const maxHp = xan.maxHp;
  const pct = Math.max(0, Math.min(100, (xan.hp / maxHp) * 100));
  els.xanthridHpFill.style.width = pct + '%';
  els.xanthridHpFill.className = 'hp-bar-fill';
  if (pct > 50) els.xanthridHpFill.classList.add('hp-high');
  else if (pct > 25) els.xanthridHpFill.classList.add('hp-mid');
  else if (pct > 10) els.xanthridHpFill.classList.add('hp-low');
  else els.xanthridHpFill.classList.add('hp-critical');

  const tempStr = xan.tempHp > 0 ? ` +${xan.tempHp}` : '';
  els.xanthridHpText.textContent = `${xan.hp}/${maxHp}${tempStr}`;

  if (xan.tempHp > 0) {
    const tempPct = (xan.tempHp / (maxHp + xan.tempHp)) * 100;
    els.xanthridHpTempBar.style.width = tempPct + '%';
    els.xanthridHpTempBar.style.display = 'block';
  } else {
    els.xanthridHpTempBar.style.display = 'none';
  }

  // Attack button
  els.xanthridAttacks.textContent = '';
  const atkBtn = document.createElement('button');
  atkBtn.className = 'btn btn-small xanthrid-attack-btn';
  atkBtn.textContent = `${atk.name} (+${atk.bonus}, ${atk.dieCount}d${atk.dieSides}+${atk.modifier})`;
  atkBtn.addEventListener('click', () => rollXanthridAttack());
  els.xanthridAttacks.appendChild(atkBtn);

  // Spellcasting section
  els.xanthridSpells.textContent = '';

  // At-will spells
  for (const spellName of XANTHRID_COMPANION.spells.atWill) {
    const label = document.createElement('div');
    label.className = 'xanthrid-spell-label';
    label.textContent = spellName;
    const tag = document.createElement('span');
    tag.className = 'at-will-tag';
    tag.textContent = '(at will)';
    label.appendChild(tag);
    els.xanthridSpells.appendChild(label);
  }

  // Daily spells
  for (const spell of XANTHRID_COMPANION.spells.daily) {
    const btn = document.createElement('button');
    btn.className = 'btn btn-small xanthrid-spell-btn';
    if (xan.clairvoyanceUsed) btn.classList.add('used');
    btn.textContent = xan.clairvoyanceUsed ? `${spell.name} (used)` : `${spell.name} (1/day)`;
    btn.addEventListener('click', () => {
      if (xan.clairvoyanceUsed) return;
      const cur = getState().xanthridCompanion;
      update('xanthridCompanion', { ...cur, clairvoyanceUsed: true });
      logRoll('cast', 'Xanthrid casts Clairvoyance');
      renderLog(els.rollLog);
    });
    els.xanthridSpells.appendChild(btn);
  }

  // Traits
  els.xanthridTraits.textContent = '';
  for (const trait of XANTHRID_COMPANION.traits) {
    const div = document.createElement('div');
    div.className = 'spirit-trait';
    div.textContent = trait;
    els.xanthridTraits.appendChild(div);
  }

  // Bind events once
  if (!xanthridEventsBound) {
    bindXanthridEvents();
    xanthridEventsBound = true;
  }
}

function bindXanthridEvents() {
  // Dismiss
  document.getElementById('btn-dismiss-xanthrid').addEventListener('click', () => {
    const cur = getState().xanthridCompanion;
    update('xanthridCompanion', { ...cur, active: false, hp: 0 });
    logRoll('cast', 'Xanthrid dismissed');
    renderLog(els.rollLog);
  });

  // Damage
  populateDmgTypeSelect('xanthrid-dmg-type');
  document.getElementById('btn-xanthrid-damage').addEventListener('click', () => {
    const val = parseInt(els.xanthridHpInput.value) || 0;
    const dmgType = document.getElementById('xanthrid-dmg-type').value;
    if (val > 0) {
      applyXanthridDamage(val, dmgType);
      els.xanthridHpInput.value = '';
    }
  });

  // Heal
  document.getElementById('btn-xanthrid-heal').addEventListener('click', () => {
    const val = parseInt(els.xanthridHpInput.value) || 0;
    if (val > 0) {
      applyXanthridHealing(val);
      els.xanthridHpInput.value = '';
    }
  });

  // Temp HP
  document.getElementById('btn-xanthrid-temp-hp').addEventListener('click', () => {
    const val = parseInt(els.xanthridTempHpInput.value) || 0;
    const cur = getState().xanthridCompanion;
    update('xanthridCompanion', { ...cur, tempHp: Math.max(cur.tempHp, val) });
    els.xanthridTempHpInput.value = '';
  });

  // Enter key on xanthrid inputs
  els.xanthridHpInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('btn-xanthrid-damage').click();
  });
  els.xanthridTempHpInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('btn-xanthrid-temp-hp').click();
  });
}

function applyXanthridDamage(rawAmount, dmgType) {
  const { final: amount, tag } = adjustForDefenses(rawAmount, dmgType, XANTHRID_COMPANION.resistances, []);
  if (amount === 0) {
    logRoll('damage', `Xanthrid: ${rawAmount} ${dmgType} damage — IMMUNE`);
    renderLog(els.rollLog);
    return;
  }
  const cur = getState().xanthridCompanion;
  let remaining = amount;
  let newTemp = cur.tempHp;
  let newHp = cur.hp;

  if (newTemp > 0) {
    if (remaining >= newTemp) {
      remaining -= newTemp;
      newTemp = 0;
    } else {
      newTemp -= remaining;
      remaining = 0;
    }
  }
  newHp = Math.max(0, newHp - remaining);
  update('xanthridCompanion', { ...cur, hp: newHp, tempHp: newTemp });
  logRoll('damage', `Xanthrid takes ${amount} damage${tag} (${newHp} HP remaining)`);
  renderLog(els.rollLog);
}

function applyXanthridHealing(amount) {
  const cur = getState().xanthridCompanion;
  const newHp = Math.min(cur.maxHp, cur.hp + amount);
  update('xanthridCompanion', { ...cur, hp: newHp });
}

async function rollXanthridAttack() {
  const atk = XANTHRID_COMPANION.attack;

  if (getState().physicalDice) {
    logRoll('attack', `${atk.name}: Roll d20+${atk.bonus} to hit, ${atk.dieCount}d${atk.dieSides}+${atk.modifier} ${atk.damageType}`);
    renderLog(els.rollLog);
    return;
  }

  clearDiceActions();

  // Roll attack
  const atkResult = dice.rollD20(atk.bonus);
  const isCrit = atkResult.nat20;

  // Roll damage
  const diceCount = isCrit ? atk.dieCount * 2 : atk.dieCount;
  const dmgResult = dice.rollDamage(diceCount, atk.dieSides, atk.modifier);

  // Animate
  const allDiceSpec = [{ sides: 20, result: atkResult.die }];
  allDiceSpec.push(...dmgResult.dice.map(v => ({ sides: atk.dieSides, result: v })));
  await dice.animateDice(els.diceStage, allDiceSpec);
  await dice.animateRoll(els.diceResult, atkResult.total);

  if (atkResult.nat20) { els.diceResult.classList.add('nat20'); triggerScreenShake(); }
  else if (atkResult.nat1) { els.diceResult.classList.add('nat1'); fireMadnessEvent('critFail'); triggerScreenShake(); }

  const critTag = isCrit ? ' CRIT!' : '';
  const modStr = atk.modifier > 0 ? '+' + atk.modifier : '';
  const atkText = `d20(${atkResult.die})+${atk.bonus}=${atkResult.total}${critTag}`;
  const dmgText = `[${dmgResult.dice.join(',')}]${modStr}=${dmgResult.total}`;
  els.diceBreakdown.textContent = `${atkText} | Dmg: ${dmgText}`;
  els.diceLabel.textContent = `${atk.name} (Xanthrid)`;
  logRoll('attack', `Xanthrid ${atk.name}: ${atkText} | Dmg: ${dmgText} ${atk.damageType}`);
  renderLog(els.rollLog);
}

// ─── Polymorph Companion ────────────────────────
let polymorphEventsBound = false;

function renderPolymorphForm() {
  const s = getState();
  const poly = s.polymorphForm;
  if (!poly || !els.polymorphPanel) return;

  // Show/hide panel
  els.polymorphPanel.style.display = poly.active ? '' : 'none';
  if (!poly.active) return;

  const formConfig = POLYMORPH_FORMS[poly.form];
  if (!formConfig) return;

  // Form selector (radios)
  els.polymorphFormSelector.textContent = '';
  for (const [key, form] of Object.entries(POLYMORPH_FORMS)) {
    const label = document.createElement('label');
    label.className = 'spirit-form-label';
    if (key === poly.form) label.classList.add('active');

    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'polymorph-form';
    radio.value = key;
    radio.checked = key === poly.form;
    radio.addEventListener('change', () => {
      const newForm = POLYMORPH_FORMS[key];
      update('polymorphForm', { active: true, form: key, thp: newForm.thp });
      logRoll('cast', `Polymorph form changed to ${newForm.label} (${newForm.thp} THP)`);
      renderLog(els.rollLog);
    });

    const span = document.createElement('span');
    span.textContent = form.label;
    label.appendChild(radio);
    label.appendChild(span);
    els.polymorphFormSelector.appendChild(label);
  }

  // Stat summary
  els.polymorphStats.textContent = '';
  const statRows = [
    ['AC', formConfig.ac],
    ['Speed', formConfig.speed],
    ['Size', formConfig.size],
    ['Multiattack', formConfig.multiattack.label],
  ];
  if (formConfig.skills) statRows.push(['Skills', formConfig.skills]);
  if (formConfig.saves) statRows.push(['Saves', formConfig.saves]);
  if (formConfig.immunities) statRows.push(['Immunities', formConfig.immunities]);
  if (formConfig.senses) statRows.push(['Senses', formConfig.senses]);

  for (const [label, value] of statRows) {
    const row = document.createElement('div');
    row.className = 'spirit-stat-row';
    const lbl = document.createElement('span');
    lbl.className = 'spirit-stat-label';
    lbl.textContent = label;
    const val = document.createElement('span');
    val.className = 'spirit-stat-value';
    val.textContent = value;
    row.appendChild(lbl);
    row.appendChild(val);
    els.polymorphStats.appendChild(row);
  }

  // Ability scores
  els.polymorphAbilities.textContent = '';
  for (const [ab, data] of Object.entries(formConfig.abilities)) {
    const cell = document.createElement('div');
    cell.className = 'polymorph-ability';
    const lbl = document.createElement('div');
    lbl.className = 'polymorph-ability-label';
    lbl.textContent = ab;
    const mod = document.createElement('div');
    mod.className = 'polymorph-ability-mod';
    mod.textContent = data.mod >= 0 ? '+' + data.mod : '' + data.mod;
    const score = document.createElement('div');
    score.className = 'polymorph-ability-score';
    score.textContent = data.score;
    cell.appendChild(lbl);
    cell.appendChild(mod);
    cell.appendChild(score);
    els.polymorphAbilities.appendChild(cell);
  }

  // THP bar
  const maxThp = formConfig.thp;
  const thpPct = Math.max(0, Math.min(100, (poly.thp / maxThp) * 100));
  els.polymorphThpFill.style.width = thpPct + '%';

  els.polymorphThpText.textContent = `${poly.thp}/${maxThp} THP`;

  // Attack buttons
  els.polymorphAttacks.textContent = '';
  for (const atk of formConfig.attacks) {
    const btn = document.createElement('button');
    btn.className = 'btn btn-small polymorph-attack-btn';
    const reachOrRange = atk.reach || atk.range;
    btn.textContent = `${atk.name} +${atk.bonus}`;
    btn.title = `${atk.type} +${atk.bonus}, ${reachOrRange}, ${atk.dieCount}d${atk.dieSides}+${atk.modifier} ${atk.damageType}${atk.notes ? ' — ' + atk.notes : ''}`;
    btn.addEventListener('click', () => rollPolymorphAttack(atk, formConfig));
    els.polymorphAttacks.appendChild(btn);
  }

  // Special abilities
  els.polymorphSpecials.textContent = '';
  for (const special of formConfig.specials) {
    const btn = document.createElement('button');
    btn.className = 'btn btn-small polymorph-special-btn';
    btn.textContent = `${special.name} (Recharge ${special.recharge})`;
    btn.title = special.description;
    btn.addEventListener('click', () => rollPolymorphSpecial(special, formConfig));
    els.polymorphSpecials.appendChild(btn);
  }

  // Bonus actions
  els.polymorphBonusActions.textContent = '';
  for (const ba of formConfig.bonusActions) {
    const div = document.createElement('div');
    div.className = 'polymorph-bonus-action';
    const strong = document.createElement('strong');
    strong.textContent = `Bonus: ${ba.name} — `;
    div.appendChild(strong);
    div.appendChild(document.createTextNode(ba.description));
    els.polymorphBonusActions.appendChild(div);
  }

  // Traits
  els.polymorphTraits.textContent = '';
  for (const trait of formConfig.traits) {
    const div = document.createElement('div');
    div.className = 'spirit-trait';
    div.textContent = trait;
    els.polymorphTraits.appendChild(div);
  }

  // Bind events once
  if (!polymorphEventsBound) {
    bindPolymorphEvents();
    polymorphEventsBound = true;
  }
}

function bindPolymorphEvents() {
  // Dismiss
  document.getElementById('btn-dismiss-polymorph').addEventListener('click', () => {
    update('polymorphForm', { active: false, form: getState().polymorphForm.form, thp: 0 });
    // Clear concentration if it was Polymorph
    if (getState().concentration === 'Polymorph') {
      update('concentration', '');
    }
    logRoll('cast', 'Polymorph ended');
    renderLog(els.rollLog);
  });

  // Damage
  populateDmgTypeSelect('polymorph-dmg-type');
  document.getElementById('btn-polymorph-damage').addEventListener('click', () => {
    const val = parseInt(els.polymorphDmgInput.value) || 0;
    const dmgType = document.getElementById('polymorph-dmg-type').value;
    if (val > 0) {
      applyPolymorphDamage(val, dmgType);
      els.polymorphDmgInput.value = '';
    }
  });

  // Enter key on damage input
  els.polymorphDmgInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('btn-polymorph-damage').click();
  });
}

function applyPolymorphDamage(rawAmount, dmgType) {
  const cur = getState().polymorphForm;
  const formConfig = POLYMORPH_FORMS[cur.form];
  const { final: amount, tag } = adjustForDefenses(rawAmount, dmgType, [], formConfig.immunities || []);
  if (amount === 0) {
    logRoll('damage', `${formConfig.label}: ${rawAmount} ${dmgType} damage — IMMUNE`);
    renderLog(els.rollLog);
    return;
  }
  let newThp = Math.max(0, cur.thp - amount);

  if (newThp <= 0) {
    // Polymorph ends — any overflow damage goes to the character
    const overflow = amount - cur.thp;
    update('polymorphForm', { ...cur, active: false, thp: 0 });
    // Clear concentration
    if (getState().concentration === 'Polymorph') {
      update('concentration', '');
    }
    logRoll('damage', `${formConfig.label} takes ${amount} damage${tag} — Polymorph ends!${overflow > 0 ? ` ${overflow} overflow to Lanezel.` : ''}`);
    if (overflow > 0) {
      applyDamage(overflow, dmgType);
    }
  } else {
    update('polymorphForm', { ...cur, thp: newThp });
    logRoll('damage', `${formConfig.label} takes ${amount} damage${tag} (${newThp} THP remaining)`);
  }
  renderLog(els.rollLog);
}

async function rollPolymorphAttack(atk, formConfig) {
  if (getState().physicalDice) {
    let msg = `${atk.name}: Roll d20+${atk.bonus} to hit, ${atk.dieCount}d${atk.dieSides}+${atk.modifier} ${atk.damageType}`;
    if (atk.extraDice) msg += ` + ${atk.extraDice.count}d${atk.extraDice.sides} ${atk.extraDice.type}`;
    if (atk.notes) msg += ` (${atk.notes})`;
    logRoll('attack', msg);
    renderLog(els.rollLog);
    return;
  }

  clearDiceActions();

  // Roll attack
  const atkResult = dice.rollD20(atk.bonus);
  const isCrit = atkResult.nat20;

  // Roll primary damage
  const diceCount = isCrit ? atk.dieCount * 2 : atk.dieCount;
  const dmgResult = dice.rollDamage(diceCount, atk.dieSides, atk.modifier);

  // Roll extra dice if any (e.g. +2d8 Cold)
  let extraResult = null;
  if (atk.extraDice) {
    const extraCount = isCrit ? atk.extraDice.count * 2 : atk.extraDice.count;
    extraResult = dice.rollDamage(extraCount, atk.extraDice.sides, 0);
  }

  // Animate
  const allDiceSpec = [{ sides: 20, result: atkResult.die }];
  allDiceSpec.push(...dmgResult.dice.map(v => ({ sides: atk.dieSides, result: v })));
  if (extraResult) {
    allDiceSpec.push(...extraResult.dice.map(v => ({ sides: atk.extraDice.sides, result: v })));
  }
  await dice.animateDice(els.diceStage, allDiceSpec);
  await dice.animateRoll(els.diceResult, atkResult.total);

  if (atkResult.nat20) { els.diceResult.classList.add('nat20'); triggerScreenShake(); }
  else if (atkResult.nat1) { els.diceResult.classList.add('nat1'); fireMadnessEvent('critFail'); triggerScreenShake(); }

  const critTag = isCrit ? ' CRIT!' : '';
  const modStr = atk.modifier > 0 ? '+' + atk.modifier : atk.modifier < 0 ? '' + atk.modifier : '';
  const atkText = `d20(${atkResult.die})+${atk.bonus}=${atkResult.total}${critTag}`;
  let dmgText = `[${dmgResult.dice.join(',')}]${modStr}=${dmgResult.total} ${atk.damageType}`;
  if (extraResult) {
    dmgText += ` + [${extraResult.dice.join(',')}]=${extraResult.total} ${atk.extraDice.type}`;
  }
  const totalDmg = dmgResult.total + (extraResult ? extraResult.total : 0);
  els.diceBreakdown.textContent = `${atkText} | Dmg: ${dmgText} (${totalDmg} total)`;
  els.diceLabel.textContent = `${atk.name} (${formConfig.label})`;
  let logMsg = `${formConfig.label} ${atk.name}: ${atkText} | Dmg: ${dmgText}`;
  if (atk.notes) logMsg += ` (${atk.notes})`;
  logRoll('attack', logMsg);
  renderLog(els.rollLog);
}

async function rollPolymorphSpecial(special, formConfig) {
  if (getState().physicalDice) {
    let msg = `${special.name}: ${special.description}`;
    if (special.dieCount) msg = `${special.name}: Roll ${special.dieCount}d${special.dieSides}${special.modifier ? '+' + special.modifier : ''} ${special.damageType}`;
    logRoll('damage', msg);
    renderLog(els.rollLog);
    return;
  }

  clearDiceActions();

  if (special.dieCount) {
    const result = dice.rollDamage(special.dieCount, special.dieSides, special.modifier);
    const diceSpec = result.dice.map(v => ({ sides: special.dieSides, result: v }));
    await dice.animateDice(els.diceStage, diceSpec);
    await dice.animateRoll(els.diceResult, result.total, special.dieSides);

    const modStr = special.modifier > 0 ? '+' + special.modifier : '';
    els.diceBreakdown.textContent = `[${result.dice.join(', ')}]${modStr} = ${result.total}`;
    els.diceLabel.textContent = `${special.name} (${formConfig.label})`;

    let logMsg = `${formConfig.label} ${special.name}: [${result.dice.join(',')}]${modStr} = ${result.total} ${special.damageType}`;
    if (special.saveDC) logMsg += ` (DC ${special.saveDC} ${special.saveAbility} save)`;
    logRoll('damage', logMsg);
  } else {
    logRoll('cast', `${formConfig.label} ${special.name}: ${special.description}`);
  }
  renderLog(els.rollLog);
}

// ─── Dice Mode Toggle ────────────────────────────
const DICE_PANEL_NAMES = ['Dice', 'Roll Log'];

function renderDiceMode() {
  const physical = getState().physicalDice;
  const btn = document.getElementById('btn-dice-mode');
  if (btn) {
    btn.textContent = '\uD83C\uDFB2'; // 🎲
    btn.className = 'header-star dice-toggle';
    btn.title = physical ? 'Physical dice mode — click to switch to digital' : 'Digital dice mode — click to switch to physical';
    if (!physical) {
      btn.classList.add('dice-active');
    }
  }
  // Show/hide dice-related panels
  document.querySelectorAll('.panel').forEach(panel => {
    const h2 = panel.querySelector('h2');
    if (!h2) return;
    const nameNode = [...h2.childNodes].find(n => n.nodeType === Node.TEXT_NODE);
    const name = nameNode ? nameNode.textContent.trim() : '';
    if (DICE_PANEL_NAMES.includes(name)) {
      panel.style.display = physical ? 'none' : '';
    }
  });
}

// ─── Event Binding ───────────────────────────────
function bindEvents() {
  // Dice mode toggle
  document.getElementById('btn-dice-mode').addEventListener('click', () => {
    update('physicalDice', !getState().physicalDice);
  });

  // HP controls
  populateDmgTypeSelect('hp-dmg-type');
  document.getElementById('btn-damage').addEventListener('click', () => {
    const val = parseInt(els.hpInput.value) || 0;
    const dmgType = document.getElementById('hp-dmg-type').value;
    if (val > 0) { applyDamage(val, dmgType); els.hpInput.value = ''; }
  });
  document.getElementById('btn-heal').addEventListener('click', () => {
    const val = parseInt(els.hpInput.value) || 0;
    if (val > 0) { applyHealing(val); els.hpInput.value = ''; }
  });
  document.getElementById('btn-temp-hp').addEventListener('click', () => {
    const val = parseInt(els.tempHpInput.value) || 0;
    const s = getState();
    update('tempHp', Math.max(s.tempHp, val));
    els.tempHpInput.value = '';
  });

  // Enter key on HP inputs
  els.hpInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('btn-damage').click();
  });
  els.tempHpInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('btn-temp-hp').click();
  });

  // Concentration
  els.concSelect.addEventListener('change', () => {
    const oldConc = getState().concentration;
    const newConc = els.concSelect.value;
    update('concentration', newConc);
    // Dismiss spirit if concentration dropped from Summon Aberration
    if (oldConc === 'Summon Aberration' && newConc !== 'Summon Aberration') {
      const cur = getState().aberrantSpirit;
      if (cur && cur.active) {
        update('aberrantSpirit', { ...cur, active: false });
      }
    }
    // Dismiss polymorph if concentration dropped from Polymorph
    if (oldConc === 'Polymorph' && newConc !== 'Polymorph') {
      const cur = getState().polymorphForm;
      if (cur && cur.active) {
        update('polymorphForm', { ...cur, active: false, thp: 0 });
      }
    }
  });

  // Sorcery Points +/-
  document.getElementById('sp-minus').addEventListener('click', () => {
    const s = getState();
    if (s.sorceryPoints > 0) update('sorceryPoints', s.sorceryPoints - 1);
  });
  document.getElementById('sp-plus').addEventListener('click', () => {
    const s = getState();
    if (s.sorceryPoints < CHARACTER.sorceryPoints) update('sorceryPoints', s.sorceryPoints + 1);
  });

  // Resource toggles
  // Sapphire Recharge — custom handler
  document.getElementById('sapphire-pip').addEventListener('click', () => {
    const s = getState();
    if (s.sapphireRecharge > 0) {
      // Using it — find highest slot to restore (3 > 2 > 1)
      const slots = s.spellSlots;
      const max3 = CHARACTER.spellSlots[3] || 0;
      const max2 = CHARACTER.spellSlots[2] || 0;
      const max1 = CHARACTER.spellSlots[1] || 0;

      if ((slots[3] || 0) < max3) {
        update('sapphireRecharge', 0);
        updateNested('spellSlots.3', (slots[3] || 0) + 1);
        logRoll('cast', 'Sapphire of Power: restored 1 level 3 spell slot');
        renderLog(els.rollLog);
      } else if ((slots[2] || 0) < max2) {
        update('sapphireRecharge', 0);
        updateNested('spellSlots.2', (slots[2] || 0) + 1);
        logRoll('cast', 'Sapphire of Power: restored 1 level 2 spell slot');
        renderLog(els.rollLog);
      } else if ((slots[1] || 0) < max1) {
        if (confirm('Your higher-level slots are all full — really burn this on a 1st level slot?')) {
          update('sapphireRecharge', 0);
          updateNested('spellSlots.1', (slots[1] || 0) + 1);
          logRoll('cast', 'Sapphire of Power: restored 1 level 1 spell slot');
          renderLog(els.rollLog);
        }
      }
    } else {
      // Restoring the pip (un-using it)
      update('sapphireRecharge', 1);
    }
  });

  // Healing Hands — custom handler: rolls 4d4 healing when consumed
  document.getElementById('healing-hands-pip').addEventListener('click', () => {
    const s = getState();
    if (s.healingHands > 0) {
      update('healingHands', 0);
      rollHealingHandsAction();
    } else {
      update('healingHands', 1);
    }
  });

  const toggleMap = {
    'celestial-rev-pip': 'celestialRevelation',
    'sorc-restoration-pip': 'sorcerousRestoration',
    'rimes-free-pip': 'rimesBindingIceFree',
    'xanthrid-pip': 'xanthrid',
    'aurils-abode-pip': 'aurilsAbode',
  };
  for (const [id, key] of Object.entries(toggleMap)) {
    document.getElementById(id).addEventListener('click', () => {
      const current = getState()[key];
      const newVal = current > 0 ? 0 : 1;
      update(key, newVal);
      // Xanthrid: activate companion when resource is consumed
      if (key === 'xanthrid' && newVal === 0) {
        update('xanthridCompanion', {
          active: true,
          hp: XANTHRID_COMPANION.maxHp,
          maxHp: XANTHRID_COMPANION.maxHp,
          tempHp: 0,
          clairvoyanceUsed: false,
        });
        logRoll('cast', 'Xanthrid summoned');
        renderLog(els.rollLog);
      }
      // Xanthrid: dismiss companion when resource is restored
      if (key === 'xanthrid' && newVal === 1) {
        const cur = getState().xanthridCompanion;
        if (cur && cur.active) {
          update('xanthridCompanion', { ...cur, active: false });
        }
      }
    });
  }

  // Inspiration
  els.inspirationStar.addEventListener('click', () => {
    update('heroicInspiration', !getState().heroicInspiration);
  });

  // Xanthrid header toggle — always works as summon/dismiss regardless of resource
  document.getElementById('btn-xanthrid-toggle').addEventListener('click', () => {
    const s = getState();
    if (s.xanthridCompanion.active) {
      // Dismiss — preserve clairvoyanceUsed so dismiss/re-summon can't reset the once-per-summon limit
      update('xanthridCompanion', { active: false, hp: 19, maxHp: 19, tempHp: 0, clairvoyanceUsed: !!s.xanthridCompanion.clairvoyanceUsed });
    } else {
      // Summon — consume resource if available; fresh summon gets a fresh clairvoyance charge
      if (s.xanthrid > 0) update('xanthrid', 0);
      update('xanthridCompanion', { active: true, hp: 19, maxHp: 19, tempHp: 0, clairvoyanceUsed: false });
    }
  });

  // Aberrant Spirit header toggle — peek at panel without casting
  document.getElementById('btn-aberrant-toggle').addEventListener('click', () => {
    const s = getState();
    const spirit = s.aberrantSpirit || { active: false, form: 'beholderkin', castLevel: 4, hp: 40, maxHp: 40, tempHp: 0 };
    update('aberrantSpirit', { ...spirit, active: !spirit.active });
  });

  // Polymorph header toggle — peek at panel without casting
  document.getElementById('btn-polymorph-toggle').addEventListener('click', () => {
    const s = getState();
    const poly = s.polymorphForm || { active: false, form: 'greatYeti', thp: 0 };
    update('polymorphForm', { ...poly, active: !poly.active });
  });

  // Store header toggle
  document.getElementById('btn-store-toggle').addEventListener('click', () => {
    update('storeOpen', !getState().storeOpen);
  });

  // Store — populate potion dropdown
  const potionSel = document.getElementById('store-potion-select');
  if (potionSel && potionSel.options.length <= 1) {
    for (const p of STORE_POTIONS) {
      const opt = document.createElement('option');
      opt.value = p.name;
      opt.textContent = `${p.name} (${p.notes})`;
      potionSel.appendChild(opt);
    }
  }

  // Store — potion Add button
  document.getElementById('btn-add-potion').addEventListener('click', () => {
    const sel = document.getElementById('store-potion-select');
    const qtyInput = document.getElementById('store-potion-qty');
    const potionName = sel.value;
    if (!potionName) return;
    const qty = Math.max(1, parseInt(qtyInput.value) || 1);
    const inv = { ...getState().inventory };
    inv[potionName] = (inv[potionName] || 0) + qty;
    update('inventory', inv);
    logRoll('resource', `Purchased ${potionName}${qty > 1 ? ` x${qty}` : ''}`);
    renderLog(els.rollLog);
    sel.value = '';
    qtyInput.value = '1';
  });

  // Store — scroll Add button
  document.getElementById('btn-add-scroll').addEventListener('click', () => {
    const sel = document.getElementById('store-scroll-select');
    const qtyInput = document.getElementById('store-scroll-qty');
    const spellName = sel.value;
    if (!spellName) return;
    const qty = Math.max(1, parseInt(qtyInput.value) || 1);
    const scrollName = `Scroll of ${spellName}`;
    const inv = { ...getState().inventory };
    inv[scrollName] = (inv[scrollName] || 0) + qty;
    update('inventory', inv);
    logRoll('resource', `Purchased ${scrollName}${qty > 1 ? ` x${qty}` : ''}`);
    renderLog(els.rollLog);
    sel.value = '';
    qtyInput.value = '1';
  });

  // Store — custom item Add button
  document.getElementById('btn-add-custom').addEventListener('click', () => {
    const nameInput = document.getElementById('store-custom-name');
    const qtyInput = document.getElementById('store-custom-qty');
    const catSelect = document.getElementById('store-custom-category');
    const descInput = document.getElementById('store-custom-desc');
    const itemName = nameInput.value.trim();
    if (!itemName) return;
    const qty = Math.max(1, parseInt(qtyInput.value) || 1);
    const category = catSelect.value;
    const description = descInput.value.trim();

    // Save metadata for custom items
    const customs = { ...getState().customItems };
    customs[itemName] = { category, description };
    update('customItems', customs);

    // Add to inventory
    const inv = { ...getState().inventory };
    inv[itemName] = (inv[itemName] || 0) + qty;
    update('inventory', inv);

    logRoll('resource', `Added ${itemName}${qty > 1 ? ` x${qty}` : ''} (${category})`);
    renderLog(els.rollLog);
    nameInput.value = '';
    qtyInput.value = '1';
    descInput.value = '';
  });

  // Store — populate scroll dropdown
  const scrollSel = document.getElementById('store-scroll-select');
  if (scrollSel && scrollSel.options.length <= 1) {
    for (const spell of SPELLS.filter(s => s.level > 0)) {
      const opt = document.createElement('option');
      opt.value = spell.name;
      opt.textContent = `${spell.name} (${spell.level}${getSuffix(spell.level)})`;
      scrollSel.appendChild(opt);
    }
  }

  // Saving throw buttons
  buildSaveButtons();
  buildAttackButtons();
  buildDamageButtons();

  // Rest buttons
  document.getElementById('btn-short-rest').addEventListener('click', showShortRestModal);
  document.getElementById('btn-long-rest').addEventListener('click', showLongRestModal);

  // Reset
  document.getElementById('btn-reset').addEventListener('click', () => {
    showConfirmModal('Reset Session', 'Reset all state to defaults? This cannot be undone.', () => {
      resetAll();
      fireMadnessEvent('longRest');
    });
  });

  // Lucky roll
  document.getElementById('btn-lucky-roll').addEventListener('click', rollLucky);

  // Concentration check
  document.getElementById('btn-conc-check').addEventListener('click', rollConcentrationCheck);

  // Clear log
  document.getElementById('btn-clear-log').addEventListener('click', () => {
    doClearLog();
    renderLog(els.rollLog);
  });

  // Expand full text on all visible spells
  els.expandAllBtn.addEventListener('click', () => {
    allExpanded = !allExpanded;
    if (!allExpanded) expandedSpells.clear();
    renderSpellCards();
  });

  // Spell search
  const searchInput = document.getElementById('spell-search');
  let searchTimeout;
  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      spellSearch = searchInput.value;
      renderSpellCards();
    }, 200);
  });

  // Spell sort
  document.getElementById('spell-sort').addEventListener('change', (e) => {
    spellSort = e.target.value;
    renderSpellCards();
  });

  // Filter toggle
  const filterBtn = document.getElementById('btn-spell-filters');
  const filtersDiv = document.getElementById('spell-filters');
  filterBtn.addEventListener('click', () => {
    filtersVisible = !filtersVisible;
    filtersDiv.style.display = filtersVisible ? '' : 'none';
  });

  // Filter pills
  filtersDiv.addEventListener('click', (e) => {
    const pill = e.target.closest('.filter-pill');
    if (!pill) return;
    const group = pill.closest('.filter-pills').dataset.filter;
    const value = pill.dataset.value;
    pill.classList.toggle('active');
    if (pill.classList.contains('active')) {
      if (!spellFilters[group]) spellFilters[group] = [];
      spellFilters[group].push(value);
    } else {
      spellFilters[group] = (spellFilters[group] || []).filter(v => v !== value);
    }
    updateFilterBadge();
    renderSpellCards();
  });

  // Clear all filters
  document.getElementById('btn-clear-filters').addEventListener('click', () => {
    for (const key of Object.keys(spellFilters)) spellFilters[key] = [];
    filtersDiv.querySelectorAll('.filter-pill.active').forEach(p => p.classList.remove('active'));
    searchInput.value = '';
    spellSearch = '';
    updateFilterBadge();
    renderSpellCards();
  });

  function updateFilterBadge() {
    const count = Object.values(spellFilters).reduce((sum, arr) => sum + arr.length, 0);
    filterBtn.textContent = count > 0 ? `Filters (${count})` : 'Filters';
    filterBtn.classList.toggle('has-filters', count > 0);
  }
}

// ─── Save Buttons ────────────────────────────────
function buildSaveButtons() {
  const container = els.saveButtons;
  container.textContent = '';
  for (const [ab, data] of Object.entries(CHARACTER.abilities)) {
    const btn = document.createElement('button');
    btn.className = 'roll-btn';
    const sign = data.save >= 0 ? '+' : '';
    btn.textContent = `${ab} ${sign}${data.save}`;
    btn.addEventListener('click', () => rollSave(ab, data.save));
    container.appendChild(btn);
  }
}

async function rollSave(ability, modifier) {
  const s = getState();
  const isConSave = ability === 'CON';
  const isConcentrating = !!s.concentration;
  const useAdvantage = isConSave && isConcentrating; // Warcaster

  clearDiceActions();
  let result;
  if (useAdvantage) {
    result = dice.rollAdvantage(modifier);
    await dice.animateDice(els.diceStage, [
      { sides: 20, result: result.dice[0] },
      { sides: 20, result: result.dice[1] },
    ]);
    await dice.animateRoll(els.diceResult, result.total);
    els.diceBreakdown.textContent = `[${result.dice[0]}, ${result.dice[1]}] best ${result.best} + ${modifier}`;
    els.diceLabel.textContent = `${ability} Save (Warcaster Adv)`;
    logRoll('save', `${ability} Save (Warcaster): [${result.dice[0]}, ${result.dice[1]}*] + ${modifier} = ${result.total}`);
  } else {
    result = dice.rollD20(modifier);
    await dice.animateDice(els.diceStage, [{ sides: 20, result: result.die }]);
    await dice.animateRoll(els.diceResult, result.total);
    els.diceBreakdown.textContent = `d20(${result.die}) + ${modifier}`;
    els.diceLabel.textContent = `${ability} Save`;
    logRoll('save', `${ability} Save: ${result.die} + ${modifier} = ${result.total}`);
  }

  if (result.nat20) { els.diceResult.classList.add('nat20'); triggerScreenShake(); }
  else if (result.nat1) { els.diceResult.classList.add('nat1'); fireMadnessEvent('critFail'); triggerScreenShake(); }

  renderLog(els.rollLog);
}

// ─── Attack Buttons ──────────────────────────────

function parseWeaponDamage(damageStr) {
  const match = damageStr.match(/(\d+)d(\d+)([+-]\d+)?/);
  if (!match) return null;
  return { count: parseInt(match[1]), sides: parseInt(match[2]), mod: match[3] ? parseInt(match[3]) : 0 };
}

function buildAttackButtons() {
  const container = els.attackButtons;
  container.textContent = '';
  for (const wpn of WEAPONS) {
    const btn = document.createElement('button');
    btn.className = 'roll-btn';
    btn.textContent = `${wpn.name} +${wpn.atkBonus}`;
    btn.addEventListener('click', () => rollAttack(wpn));
    container.appendChild(btn);
  }
}

async function rollAttack(weapon) {
  clearDiceActions();

  // Consume spell slot if this is a spell attack
  if (weapon.spellLevel) {
    const s = getState();
    const available = s.spellSlots[weapon.spellLevel] || 0;
    if (available <= 0) return;
    updateNested(`spellSlots.${weapon.spellLevel}`, available - 1);
    fireMadnessEvent('spellCast', { slotLevel: weapon.spellLevel });
  }

  // Roll attack
  const atkResult = dice.rollD20(weapon.atkBonus);
  const isCrit = atkResult.nat20;

  // Roll damage simultaneously
  let dmgResult = null;
  let dmgSides = 6;
  let dmgText = '';

  if (weapon.name === 'Sorcerous Burst') {
    const rolls = dice.rollSorcerousBurst();
    if (isCrit) rolls.push(...dice.rollSorcerousBurst());
    const total = rolls.reduce((a, b) => a + b, 0);
    dmgResult = { dice: rolls, total, modifier: 0 };
    dmgSides = 8;
    dmgText = `[${rolls.join(', ')}] = ${total}`;
  } else {
    const parsed = parseWeaponDamage(weapon.damage);
    if (parsed) {
      const diceCount = isCrit ? parsed.count * 2 : parsed.count;
      dmgResult = dice.rollDamage(diceCount, parsed.sides, parsed.mod);
      dmgSides = parsed.sides;
      const modStr = parsed.mod ? (parsed.mod > 0 ? ' + ' + parsed.mod : ' - ' + Math.abs(parsed.mod)) : '';
      dmgText = `[${dmgResult.dice.join(', ')}]${modStr} = ${dmgResult.total}`;
    }
  }

  // Animate attack d20 + damage dice together
  const allDiceSpec = [{ sides: 20, result: atkResult.die }];
  if (dmgResult) {
    allDiceSpec.push(...dmgResult.dice.map(v => ({ sides: dmgSides, result: v })));
  }
  await dice.animateDice(els.diceStage, allDiceSpec);
  await dice.animateRoll(els.diceResult, atkResult.total);

  if (atkResult.nat20) { els.diceResult.classList.add('nat20'); triggerScreenShake(); }
  else if (atkResult.nat1) { els.diceResult.classList.add('nat1'); fireMadnessEvent('critFail'); triggerScreenShake(); }

  // Chromatic Orb: check for doubles
  let leapTag = '';
  if (weapon.name === 'Chromatic Orb' && dmgResult && checkForDoubles(dmgResult.dice)) {
    leapTag = ' LEAPS!';
    highlightDoubles(dmgResult.dice, dmgSides);
    showLeapAlert(1);
  }

  // Show both attack and damage in breakdown
  const critTag = isCrit ? ' CRIT!' : '';
  const atkText = `d20(${atkResult.die}) + ${weapon.atkBonus} = ${atkResult.total}${critTag}`;
  els.diceBreakdown.textContent = dmgText ? `${atkText} \u2502 Dmg: ${dmgText}${leapTag}` : atkText;
  els.diceLabel.textContent = `${weapon.name} Attack`;

  logRoll('attack', `${weapon.name}: ${atkText}${dmgText ? ' | Dmg: ' + dmgText : ''}${leapTag}`);

  // Offer Empower on multi-die damage
  if (dmgResult && dmgResult.dice.length > 1) {
    lastDamageRoll = { dmg: { name: weapon.name, sides: dmgSides }, result: dmgResult };
    showEmpowerButton();
  }

  renderLog(els.rollLog);
}

// ─── Damage Buttons ──────────────────────────────
function buildDamageButtons() {
  const container = els.damageButtons;
  container.textContent = '';

  const damages = [
    { name: 'Dagger', dice: '1d4+2', count: 1, sides: 4, mod: 2 },
    { name: 'S. Burst', dice: '2d8', count: 2, sides: 8, mod: 0, burst: true },
    { name: 'Chromatic Orb', dice: '3d8', count: 3, sides: 8, mod: 0, spellLevel: 1 },
    { name: 'Dissonant Whispers', dice: '3d6', count: 3, sides: 6, mod: 0, spellLevel: 1 },
    { name: 'Mind Whip', dice: '3d6', count: 3, sides: 6, mod: 0, spellLevel: 2 },
    { name: "Auril's Ice", dice: '3d8', count: 3, sides: 8, mod: 0, spellLevel: 2 },
    { name: 'Mind Sliver', dice: '2d6', count: 2, sides: 6, mod: 0 },
    { name: 'Fireball', dice: '8d6', count: 8, sides: 6, mod: 0, spellLevel: 3 },
    { name: 'Void Torment', dice: '2d6+2d6', count: 2, sides: 6, mod: 0, double: true, spellLevel: 3 },
    { name: 'O. Tentacles', dice: '3d6', count: 3, sides: 6, mod: 0, spellLevel: 4 },
  ];

  for (const dmg of damages) {
    const btn = document.createElement('button');
    btn.className = 'roll-btn';
    btn.textContent = `${dmg.name} ${dmg.dice}`;
    btn.addEventListener('click', () => rollDamageBtn(dmg));
    container.appendChild(btn);
  }
}

async function rollDamageBtn(dmg) {
  clearDiceActions();

  // Consume spell slot if this is a leveled spell
  if (dmg.spellLevel) {
    const s = getState();
    const available = s.spellSlots[dmg.spellLevel] || 0;
    if (available <= 0) return;
    updateNested(`spellSlots.${dmg.spellLevel}`, available - 1);
    fireMadnessEvent('spellCast', { slotLevel: dmg.spellLevel });
  }

  let result;
  if (dmg.burst) {
    const rolls = dice.rollSorcerousBurst();
    const total = rolls.reduce((a, b) => a + b, 0);
    result = { dice: rolls, total, sum: total, modifier: 0 };
  } else if (dmg.double) {
    const r1 = dice.rollDamage(dmg.count, dmg.sides, 0);
    const r2 = dice.rollDamage(dmg.count, dmg.sides, 0);
    result = { dice: [...r1.dice, ...r2.dice], total: r1.total + r2.total, sum: r1.total + r2.total, modifier: 0 };
  } else {
    result = dice.rollDamage(dmg.count, dmg.sides, dmg.mod);
  }

  // 3D dice animation
  const diceSpec = result.dice.map(val => ({ sides: dmg.sides, result: val }));
  await dice.animateDice(els.diceStage, diceSpec);

  // Chromatic Orb: check for doubles
  let leapTag = '';
  if (dmg.name === 'Chromatic Orb' && checkForDoubles(result.dice)) {
    leapTag = ' LEAPS!';
    highlightDoubles(result.dice, dmg.sides);
    showLeapAlert(1);
  }

  await dice.animateRoll(els.diceResult, result.total, dmg.sides);
  els.diceBreakdown.textContent = `[${result.dice.join(', ')}]${result.modifier ? ' + ' + result.modifier : ''}${leapTag}`;
  els.diceLabel.textContent = `${dmg.name} Damage`;
  logRoll('damage', `${dmg.name}: [${result.dice.join(',')}]${result.modifier ? '+' + result.modifier : ''} = ${result.total}${leapTag}`);

  // Offer Empower if we have SP and multiple dice
  lastDamageRoll = { dmg, result };
  showEmpowerButton();

  renderLog(els.rollLog);
}

// ─── Dice Action Helpers ─────────────────────────

function clearDiceActions() {
  if (els.diceActions) els.diceActions.textContent = '';
  lastDamageRoll = null;
}

function showEmpowerButton() {
  if (!els.diceActions || !lastDamageRoll) return;
  const s = getState();
  if (s.sorceryPoints < 1) return;
  if (lastDamageRoll.result.dice.length < 1) return;

  const btn = document.createElement('button');
  btn.className = 'btn btn-small btn-empower';
  btn.textContent = 'Empower (1 SP) \u2014 click dice to reroll';
  btn.addEventListener('click', () => {
    const ctx = lastDamageRoll;
    if (!ctx) return;
    startEmpowerSelection(ctx.dmg, ctx.result);
  });
  els.diceActions.appendChild(btn);
}

// Interactive Empower: show dice in stage, let user click to select which to reroll
function startEmpowerSelection(dmg, originalResult) {
  const maxRerolls = Math.min(CHARACTER.abilities.CHA.mod, originalResult.dice.length);
  const selected = new Set();

  els.diceActions.textContent = '';
  els.diceStage.textContent = '';
  els.diceStage.classList.add('active');

  // Show all dice as clickable SVG polyhedrals
  const wrappers = originalResult.dice.map((val, i) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'die-svg landed empowerable';
    wrapper.style.position = 'relative';
    const svg = dice.createDieSVG(dmg.sides, val, 48);
    wrapper.appendChild(svg);
    wrapper.addEventListener('click', () => {
      if (selected.has(i)) {
        selected.delete(i);
        wrapper.classList.remove('selected');
      } else if (selected.size < maxRerolls) {
        selected.add(i);
        wrapper.classList.add('selected');
      }
      confirmBtn.textContent = selected.size > 0
        ? `Reroll ${selected.size} ${selected.size === 1 ? 'die' : 'dice'} (1 SP)`
        : 'Select dice to reroll';
      confirmBtn.disabled = selected.size === 0;
    });
    els.diceStage.appendChild(wrapper);
    return wrapper;
  });

  // Confirm / Cancel buttons
  const confirmBtn = document.createElement('button');
  confirmBtn.className = 'btn btn-small btn-empower';
  confirmBtn.textContent = 'Select dice to reroll';
  confirmBtn.disabled = true;
  confirmBtn.addEventListener('click', async () => {
    if (selected.size === 0) return;
    els.diceStage.classList.remove('active');
    els.diceStage.textContent = '';
    els.diceActions.textContent = '';
    await executeEmpower(dmg, originalResult, [...selected]);
  });

  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'btn btn-small';
  cancelBtn.textContent = 'Cancel';
  cancelBtn.addEventListener('click', () => {
    els.diceStage.classList.remove('active');
    els.diceStage.textContent = '';
    clearDiceActions();
  });

  const hint = document.createElement('span');
  hint.style.cssText = 'font-size:0.7rem;color:var(--text-muted)';
  hint.textContent = `Pick up to ${maxRerolls} dice`;

  els.diceActions.appendChild(hint);
  els.diceActions.appendChild(confirmBtn);
  els.diceActions.appendChild(cancelBtn);
}

async function executeEmpower(dmg, originalResult, selectedIndices) {
  const s = getState();
  if (s.sorceryPoints < 1) return;

  update('sorceryPoints', s.sorceryPoints - 1);

  const newDice = [...originalResult.dice];
  const rerolled = [];
  for (const i of selectedIndices) {
    const newVal = dice.rollDie(dmg.sides);
    rerolled.push({ from: newDice[i], to: newVal, idx: i });
    newDice[i] = newVal;
  }

  const newTotal = newDice.reduce((a, b) => a + b, 0) + (originalResult.modifier || 0);

  // Animate the rerolled dice
  const rerollSpec = rerolled.map(r => ({ sides: dmg.sides, result: r.to }));
  if (rerollSpec.length > 0) {
    await dice.animateDice(els.diceStage, rerollSpec);
  }

  await dice.animateRoll(els.diceResult, newTotal, dmg.sides);
  const rerollDesc = rerolled.map(r => `${r.from}\u2192${r.to}`).join(', ');
  els.diceBreakdown.textContent = `[${newDice.join(', ')}]${originalResult.modifier ? ' + ' + originalResult.modifier : ''} (rerolled: ${rerollDesc})`;
  els.diceLabel.textContent = `${dmg.name} Empowered`;
  logRoll('damage', `Empower ${dmg.name}: [${newDice.join(',')}] (${rerollDesc}) = ${newTotal}`);
  renderLog(els.rollLog);
  renderSorceryPoints();

  // House rule: allow repeated Empower if SP remains
  lastDamageRoll = { dmg, result: { dice: newDice, total: newTotal, modifier: originalResult.modifier || 0 } };
  showEmpowerButton();
}

// ─── Lucky Roll (standalone) ─────────────────────
async function rollLucky() {
  const s = getState();
  if (s.lucky <= 0) return;

  clearDiceActions();
  update('lucky', s.lucky - 1);
  const result = dice.rollLucky(0); // No modifier — raw 2d20, user applies context

  // SVG Lucky animation
  await dice.animateLuckyDice(els.diceStage, result);

  // Show lucky display (overlay, no layout shift)
  els.luckyDisplay.classList.add('active');
  els.diceDisplay.style.visibility = 'hidden';

  await dice.animateLucky(els.luckyDie1, els.luckyDie2, result);

  logRoll('lucky', `Lucky: [${result.dice[0]}, ${result.dice[1]}] \u2192 ${result.best}`);
  renderLog(els.rollLog);
  renderResources();

  setTimeout(() => {
    els.luckyDisplay.classList.remove('active');
    els.diceDisplay.style.visibility = '';
    els.diceResult.textContent = result.best;
    els.diceResult.classList.remove('nat20', 'nat1');
    if (result.nat20) { els.diceResult.classList.add('nat20'); triggerScreenShake(); }
    else if (result.nat1) { els.diceResult.classList.add('nat1'); fireMadnessEvent('critFail'); triggerScreenShake(); }
    els.diceBreakdown.textContent = `Lucky: [${result.dice[0]}, ${result.dice[1]}] best ${result.best}`;
    els.diceLabel.textContent = 'Lucky Roll';
  }, 2000);
}

// ─── Concentration Check ─────────────────────────
async function rollConcentrationCheck() {
  if (!getState().concentration) return;
  clearDiceActions();
  const modifier = CHARACTER.abilities.CON.save; // +7 (CON +2, prof +4, Cloak +1)
  const result = dice.rollAdvantage(modifier); // Warcaster = advantage

  await dice.animateDice(els.diceStage, [
    { sides: 20, result: result.dice[0] },
    { sides: 20, result: result.dice[1] },
  ]);
  await dice.animateRoll(els.diceResult, result.total);
  els.diceBreakdown.textContent = `[${result.dice[0]}, ${result.dice[1]}] best ${result.best} + ${modifier}`;
  els.diceLabel.textContent = 'Concentration Check (Warcaster Adv)';

  if (result.nat20) { els.diceResult.classList.add('nat20'); triggerScreenShake(); }
  else if (result.nat1) { els.diceResult.classList.add('nat1'); fireMadnessEvent('critFail'); triggerScreenShake(); }

  logRoll('save', `Conc Check (Warcaster): [${result.dice[0]}, ${result.dice[1]}*] + ${modifier} = ${result.total}`);
  renderLog(els.rollLog);
}

// ─── Rest Modals ─────────────────────────────────

function trapFocus(overlay, onDismiss) {
  const modal = overlay.querySelector('.modal');
  function getFocusable() {
    return [...modal.querySelectorAll('button, input, select, textarea, [tabindex]:not([tabindex="-1"])')];
  }
  function onKeyDown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      onDismiss();
      return;
    }
    if (e.key === 'Tab') {
      const focusable = getFocusable();
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  }
  overlay.addEventListener('keydown', onKeyDown);
  return function cleanup() {
    overlay.removeEventListener('keydown', onKeyDown);
  };
}

function showShortRestModal() {
  const previousFocus = document.activeElement;
  const s = getState();
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  let cleanup = () => {};
  const closeModal = () => {
    cleanup();
    overlay.remove();
    previousFocus?.focus?.();
  };

  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'modal-title-short-rest');

  const title = document.createElement('h2');
  title.id = 'modal-title-short-rest';
  title.textContent = 'Short Rest';

  const info = document.createElement('p');
  info.style.cssText = 'margin-bottom:12px;font-size:0.85rem;color:var(--text-secondary)';
  info.textContent = `Hit Dice available: ${s.hitDiceRemaining}/${CHARACTER.hitDice.count} (1d6+${CHARACTER.abilities.CON.mod} each)`;

  const label = document.createElement('label');
  label.style.cssText = 'display:flex;align-items:center;gap:8px;font-size:0.85rem;color:var(--text-secondary)';
  label.textContent = 'Spend hit dice: ';

  const input = document.createElement('input');
  input.type = 'number';
  input.min = '0';
  input.max = String(s.hitDiceRemaining);
  input.value = s.hitDiceRemaining > 0 ? '1' : '0';
  input.className = 'hp-input';
  label.appendChild(input);

  const srNote = document.createElement('p');
  srNote.style.cssText = 'margin-top:8px;font-size:0.8rem;color:var(--text-muted)';
  srNote.textContent = s.sorcerousRestoration > 0
    ? `Sorcerous Restoration available: regain up to ${Math.floor(CHARACTER.level / 2)} SP`
    : 'Sorcerous Restoration already used this long rest.';

  const actions = document.createElement('div');
  actions.className = 'modal-actions';

  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'btn';
  cancelBtn.textContent = 'Cancel';
  cancelBtn.addEventListener('click', closeModal);

  const restBtn = document.createElement('button');
  restBtn.className = 'btn btn-primary';
  restBtn.textContent = 'Rest';
  restBtn.addEventListener('click', () => {
    const dice = Math.max(0, Math.min(s.hitDiceRemaining, parseInt(input.value) || 0));
    shortRest(dice);
    closeModal();
  });

  actions.appendChild(cancelBtn);
  actions.appendChild(restBtn);
  modal.appendChild(title);
  modal.appendChild(info);
  modal.appendChild(label);
  modal.appendChild(srNote);
  modal.appendChild(actions);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  cleanup = trapFocus(overlay, closeModal);

  cancelBtn.focus();

  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });
}

function showLongRestModal() {
  showConfirmModal('Long Rest', 'Take a Long Rest? This will restore HP, spell slots, SP, and all resources. Exhaustion decreases by 1.', () => {
    longRest();
  });
}

function showConfirmModal(title, message, onConfirm) {
  const previousFocus = document.activeElement;
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  let cleanup = () => {};
  const closeModal = () => {
    cleanup();
    overlay.remove();
    previousFocus?.focus?.();
  };

  const modalId = 'modal-title-' + title.toLowerCase().replace(/\s+/g, '-');
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', modalId);

  const h2 = document.createElement('h2');
  h2.id = modalId;
  h2.textContent = title;

  const p = document.createElement('p');
  p.style.cssText = 'font-size:0.85rem;color:var(--text-secondary)';
  p.textContent = message;

  const actions = document.createElement('div');
  actions.className = 'modal-actions';

  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'btn';
  cancelBtn.textContent = 'Cancel';
  cancelBtn.addEventListener('click', closeModal);

  const confirmBtn = document.createElement('button');
  confirmBtn.className = 'btn btn-primary';
  confirmBtn.textContent = 'Confirm';
  confirmBtn.addEventListener('click', () => {
    onConfirm();
    closeModal();
  });

  actions.appendChild(cancelBtn);
  actions.appendChild(confirmBtn);
  modal.appendChild(h2);
  modal.appendChild(p);
  modal.appendChild(actions);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  cleanup = trapFocus(overlay, closeModal);

  cancelBtn.focus();

  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });
}
