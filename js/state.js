// Session state model with server + localStorage persistence
import { CHARACTER, INVENTORY } from './data.js?v=30';

const STORAGE_KEY = 'dnd-lanezel-session';
const STATE_VERSION = 1;
const API_URL = 'api.php';

function createDefaultState() {
  return {
    version: STATE_VERSION,
    hp: CHARACTER.maxHp,
    tempHp: 0,
    spellSlots: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 1 },
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
    wandOfMagicMissiles: 7,
    xanthrid: 1,
    aurilsAbode: 1,
    heroicInspiration: true,
    concentration: '',
    conditions: [],
    exhaustion: 0,
    deathSaves: { successes: 0, failures: 0 },
    rollLog: [],
    physicalDice: false,
    madnessSuppressed: false,
    storeOpen: false,
    tempResistances: [],
    collapsedPanels: [],
    notes: '',
    collapsedCategories: [],
    customItems: {},
    tinkerProjects: {},
    tinkerHoursAvailable: 2,
    inventory: Object.fromEntries(INVENTORY.map(i => [i.name, i.qty])),
    aberrantSpirit: {
      active: false,
      form: 'beholderkin',
      castLevel: 4,
      hp: 40,
      maxHp: 40,
      tempHp: 0,
    },
    xanthridCompanion: {
      active: false,
      hp: 19,
      maxHp: 19,
      tempHp: 0,
      clairvoyanceUsed: false,
    },
    polymorphForm: {
      active: false,
      form: 'greatYeti',
      thp: 0,
    },
  };
}

let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.version === STATE_VERSION) {
        // Migrate: add new fields if missing (pre-feature sessions)
        if (!parsed.inventory) {
          parsed.inventory = Object.fromEntries(INVENTORY.map(i => [i.name, i.qty]));
        }
        if (parsed.rimesBindingIceFree === undefined) {
          parsed.rimesBindingIceFree = 1;
        }
        if (parsed.healingHands === undefined) parsed.healingHands = 1;
        if (parsed.wandOfSecrets === undefined) parsed.wandOfSecrets = 3;
        if (parsed.wandOfMagicMissiles === undefined) parsed.wandOfMagicMissiles = 7;
        if (parsed.xanthrid === undefined) parsed.xanthrid = 1;
        if (parsed.aurilsAbode === undefined) parsed.aurilsAbode = 1;
        if (parsed.physicalDice === undefined) parsed.physicalDice = false;
        if (parsed.madnessSuppressed === undefined) parsed.madnessSuppressed = false;
        if (parsed.storeOpen === undefined) parsed.storeOpen = false;
        if (!parsed.tempResistances) parsed.tempResistances = [];
        if (!parsed.collapsedPanels) parsed.collapsedPanels = [];
        if (parsed.notes === undefined) parsed.notes = '';
        if (!parsed.collapsedCategories) parsed.collapsedCategories = [];
        if (!parsed.customItems) parsed.customItems = {};
        if (!parsed.tinkerProjects) parsed.tinkerProjects = {};
        if (parsed.tinkerHoursAvailable === undefined) parsed.tinkerHoursAvailable = 2;
        // Migrate inventory: add new items, remove old ones
        for (const item of INVENTORY) {
          if (parsed.inventory[item.name] === undefined) parsed.inventory[item.name] = item.qty;
        }
        // Remove exploded Explorer's Pack
        if (parsed.inventory["Explorer's Pack"] !== undefined) {
          delete parsed.inventory["Explorer's Pack"];
        }
        if (!parsed.aberrantSpirit) parsed.aberrantSpirit = { active: false, form: 'beholderkin', castLevel: 4, hp: 40, maxHp: 40, tempHp: 0 };
        if (!parsed.xanthridCompanion) parsed.xanthridCompanion = { active: false, hp: 19, maxHp: 19, tempHp: 0, clairvoyanceUsed: false };
        if (!parsed.polymorphForm) parsed.polymorphForm = { active: false, form: 'greatYeti', thp: 0 };
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load state, using defaults', e);
  }
  return createDefaultState();
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save state', e);
  }
  // Fire-and-forget server save
  fetch(`${API_URL}?key=state`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(state),
  }).catch(() => {});
}

// Async server load — call once at startup, merges server state over localStorage
export async function initState() {
  try {
    const res = await fetch(`${API_URL}?key=state`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.version === STATE_VERSION) {
        if (!data.inventory) {
          data.inventory = Object.fromEntries(INVENTORY.map(i => [i.name, i.qty]));
        }
        if (data.rimesBindingIceFree === undefined) {
          data.rimesBindingIceFree = 1;
        }
        if (data.healingHands === undefined) data.healingHands = 1;
        if (data.wandOfSecrets === undefined) data.wandOfSecrets = 3;
        if (data.wandOfMagicMissiles === undefined) data.wandOfMagicMissiles = 7;
        if (data.xanthrid === undefined) data.xanthrid = 1;
        if (data.aurilsAbode === undefined) data.aurilsAbode = 1;
        if (data.physicalDice === undefined) data.physicalDice = false;
        if (data.madnessSuppressed === undefined) data.madnessSuppressed = false;
        if (data.storeOpen === undefined) data.storeOpen = false;
        if (!data.tempResistances) data.tempResistances = [];
        if (!data.collapsedPanels) data.collapsedPanels = [];
        if (data.notes === undefined) data.notes = '';
        if (!data.collapsedCategories) data.collapsedCategories = [];
        if (!data.customItems) data.customItems = {};
        if (!data.tinkerProjects) data.tinkerProjects = {};
        if (data.tinkerHoursAvailable === undefined) data.tinkerHoursAvailable = 2;
        for (const item of INVENTORY) {
          if (data.inventory[item.name] === undefined) data.inventory[item.name] = item.qty;
        }
        if (data.inventory["Explorer's Pack"] !== undefined) {
          delete data.inventory["Explorer's Pack"];
        }
        if (!data.aberrantSpirit) data.aberrantSpirit = { active: false, form: 'beholderkin', castLevel: 4, hp: 40, maxHp: 40, tempHp: 0 };
        if (!data.xanthridCompanion) data.xanthridCompanion = { active: false, hp: 19, maxHp: 19, tempHp: 0, clairvoyanceUsed: false };
        if (!data.polymorphForm) data.polymorphForm = { active: false, form: 'greatYeti', thp: 0 };
        state = data;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      }
    }
  } catch (e) {
    console.warn('Server state load failed, using localStorage', e);
  }
}

export function getState() {
  return state;
}

export function update(key, value) {
  if (typeof key === 'object') {
    Object.assign(state, key);
  } else {
    state[key] = value;
  }
  saveState();
  if (typeof window._onStateChange === 'function') {
    window._onStateChange();
  }
}

export function updateNested(path, value) {
  const keys = path.split('.');
  let obj = state;
  for (let i = 0; i < keys.length - 1; i++) {
    obj = obj[keys[i]];
  }
  obj[keys[keys.length - 1]] = value;
  saveState();
  if (typeof window._onStateChange === 'function') {
    window._onStateChange();
  }
}

export function addLogEntry(entry) {
  state.rollLog.unshift({
    ...entry,
    timestamp: Date.now(),
  });
  if (state.rollLog.length > 100) {
    state.rollLog.length = 100;
  }
  saveState();
  if (typeof window._onStateChange === 'function') {
    window._onStateChange();
  }
}

export function clearLog() {
  state.rollLog = [];
  saveState();
  if (typeof window._onStateChange === 'function') {
    window._onStateChange();
  }
}

export function resetAll() {
  state = createDefaultState();
  saveState();
  if (typeof window._onStateChange === 'function') {
    window._onStateChange();
  }
}
