// Session state model with server + localStorage persistence
import { CHARACTER, INVENTORY } from './data.js?v=32';

const STORAGE_KEY = 'dnd-lanezel-session';
// Subscribers notified after any state mutation (pub/sub, FR-160/162).
const _stateListeners = [];

/** Register a callback invoked after every state change. */
export function onStateChange(fn) {
  _stateListeners.push(fn);
}

function _notifyStateChange() {
  for (const fn of _stateListeners) fn();
}

const STATE_VERSION = 1;
const API_URL = 'api.php';
const SERVER_SAVE_DELAY_MS = 150;
// Persistent-failure backoff for flushServerSave. Bounds the retry loop so a
// server outage during rapid edits can't spin the network hot or grow an
// unbounded async chain; localStorage still holds the data, and the next real
// state change re-arms the flush.
const SERVER_SAVE_MAX_RETRIES = 5;
const SERVER_SAVE_RETRY_BASE_MS = 500;

function createDefaultState() {
  return {
    version: STATE_VERSION,
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
let saveTimer = null;
let saveInFlight = false;
let queuedSnapshot = null;

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.version === STATE_VERSION) {
        return migrateState(parsed);
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
  scheduleServerSave();
}

function scheduleServerSave() {
  queuedSnapshot = JSON.stringify(state);
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    flushServerSave();
  }, SERVER_SAVE_DELAY_MS);
}

async function flushServerSave() {
  if (saveInFlight || queuedSnapshot === null) return;
  saveInFlight = true;

  let failures = 0;
  try {
    // Drain the queue in a loop rather than re-calling ourselves in `finally`
    // (the old recursion could chain unbounded under a persistent outage).
    while (queuedSnapshot !== null && failures < SERVER_SAVE_MAX_RETRIES) {
      const snapshot = queuedSnapshot;
      queuedSnapshot = null;
      try {
        const res = await fetch(`${API_URL}?key=state`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: snapshot,
        });
        if (!res.ok) throw new Error(`server save failed: ${res.status}`);
        failures = 0; // success resets the backoff
      } catch (_) {
        // Persistent failure: keep the snapshot (unless a newer one arrived)
        // and back off exponentially instead of hot-looping the network.
        failures += 1;
        if (queuedSnapshot === null) queuedSnapshot = snapshot;
        if (failures < SERVER_SAVE_MAX_RETRIES) {
          await new Promise(r => setTimeout(r, SERVER_SAVE_RETRY_BASE_MS * 2 ** (failures - 1)));
        }
      }
    }
    // Gave up after MAX_RETRIES: localStorage still holds the data, and the
    // next state change re-arms flushServerSave via scheduleServerSave.
  } finally {
    saveInFlight = false;
  }
}

function migrateState(data) {
  // Bring an older session up to the current schema. Shared by loadState()
  // (localStorage) and initState() (server), which previously duplicated this
  // block verbatim (FR-156/158/153).
  if (!data.inventory) {
    data.inventory = Object.fromEntries(INVENTORY.map(i => [i.name, i.qty]));
  }
  if (data.rimesBindingIceFree === undefined) data.rimesBindingIceFree = 1;
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
  return data;
}

// Async server load — call once at startup, merges server state over localStorage
export async function initState() {
  try {
    const res = await fetch(`${API_URL}?key=state`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.version === STATE_VERSION) {
        state = migrateState(data);
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
  _notifyStateChange();
}

export function updateNested(path, value) {
  const keys = path.split('.');
  let obj = state;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    // Prototype-pollution guard, checked per key at the point of use.
    // With '__proto__' here, obj[key] is not undefined, the auto-create
    // branch below is skipped, obj becomes Object.prototype, and the final
    // assignment pollutes every object in the page.
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      return;
    }
    // Auto-create missing intermediate objects instead of dereferencing
    // undefined (which threw a TypeError and could break UI updates).
    if (obj[key] === undefined || obj[key] === null) {
      obj[key] = {};
    }
    obj = obj[key];
  }
  const last = keys[keys.length - 1];
  if (last === '__proto__' || last === 'constructor' || last === 'prototype') {
    return;
  }
  obj[last] = value;
  saveState();
  _notifyStateChange();
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
  _notifyStateChange();
}

export function clearLog() {
  state.rollLog = [];
  saveState();
  _notifyStateChange();
}

export function resetAll() {
  state = createDefaultState();
  saveState();
  _notifyStateChange();
}
