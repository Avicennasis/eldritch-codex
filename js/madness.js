// Madness Engine — player-triggered horror escalation
// Intensity 0-100 drives CSS custom properties that control all visual effects

const STORAGE_KEY = 'dnd-lanezel-madness';
const API_URL = 'api.php';

// ── Tier thresholds ──
const TIERS = [
  { max: 15, name: 'calm', label: 'Calm' },
  { max: 35, name: 'uneasy', label: 'Uneasy' },
  { max: 55, name: 'disturbed', label: 'Disturbed' },
  { max: 80, name: 'unhinged', label: 'Unhinged' },
  { max: 100, name: 'singularity', label: 'Singularity' },
];

// ── State ──
let intensity = 0;
let tier = 0;
const listeners = [];

// ── Persistence ──
function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== null) intensity = Math.max(0, Math.min(100, parseFloat(raw) || 0));
  } catch (e) { /* ignore */ }
}

let saveTimeout = null;
function save() {
  try {
    localStorage.setItem(STORAGE_KEY, intensity.toFixed(2));
  } catch (e) { /* ignore */ }
  // Debounced fire-and-forget server save
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    fetch(`${API_URL}?key=madness`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ intensity }),
    }).catch(() => {});
  }, 500);
}

// ── Tier calculation ──
function calcTier(val) {
  for (let i = 0; i < TIERS.length; i++) {
    if (val <= TIERS[i].max) return i;
  }
  return TIERS.length - 1;
}

// ── CSS custom property bridge ──
function updateCSS() {
  const suppressed = document.body.classList.contains('madness-suppressed');
  const m = suppressed ? 0 : intensity / 100; // 0-1
  const root = document.documentElement;

  root.style.setProperty('--madness', m.toFixed(3));
  root.style.setProperty('--madness-tier', suppressed ? 0 : tier);
  root.style.setProperty('--madness-shake', (m * 8).toFixed(1) + 'px');
  root.style.setProperty('--madness-hue-shift', (m * 25).toFixed(1) + 'deg');
  root.style.setProperty('--madness-saturation', (1 + m * 0.4).toFixed(2));
  root.style.setProperty('--madness-aberration', (m * 3).toFixed(1) + 'px');
  root.style.setProperty('--madness-vignette-opacity', (0.75 + m * 0.25).toFixed(2));
  root.style.setProperty('--tentacle-opacity', (0.25 + m * 0.6).toFixed(2));
  root.style.setProperty('--vein-opacity', (m * 0.4).toFixed(2));
  root.style.setProperty('--spore-intensity', (1 + m * 3).toFixed(1));
  root.style.setProperty('--membrane-speed', Math.max(2, 6 - m * 4).toFixed(1) + 's');

  // Tier class on body
  const body = document.body;
  for (const t of TIERS) body.classList.remove(`madness-${t.name}`);
  body.classList.add(`madness-${TIERS[tier].name}`);
}

// ── Notify subscribers ──
function notify(eventType, delta) {
  const data = { intensity, tier, delta, eventType, tierName: TIERS[tier].name };
  for (const fn of listeners) {
    try { fn(data); } catch (e) { console.warn('Madness listener error:', e); }
  }
}

// ── Apply intensity change ──
function shift(delta, eventType) {
  const oldTier = tier;
  const oldIntensity = intensity;

  intensity = Math.max(0, Math.min(100, intensity + delta));
  tier = calcTier(intensity);
  save();
  updateCSS();

  const actualDelta = intensity - oldIntensity;
  notify(eventType, actualDelta);

  // Log tier transitions
  if (tier !== oldTier) {
    console.log(`[Madness] Tier ${oldTier}→${tier}: ${TIERS[tier].label} (${intensity.toFixed(1)}%)`);
  }
}

// ── Public API ──

export function fireMadnessEvent(type, payload = {}) {
  switch (type) {
    case 'damage': {
      const maxHp = payload.maxHp || 50;
      const amount = payload.amount || 0;
      const delta = (amount / maxHp) * 40;
      shift(delta, 'damage');
      break;
    }
    case 'spellCast': {
      const level = payload.slotLevel || 0;
      const delta = level === 0 ? 1 : level * 2.5;
      shift(delta, 'spellCast');
      break;
    }
    case 'critFail':
      shift(15, 'critFail');
      break;
    case 'deathSave': {
      const delta = payload.type === 'failure' ? 20 : 5;
      shift(delta, 'deathSave');
      break;
    }
    case 'shortRest':
      // Reduce to 60% of current
      shift(-(intensity * 0.4), 'shortRest');
      break;
    case 'longRest':
      shift(-intensity, 'longRest');
      break;
    default:
      console.warn(`[Madness] Unknown event: ${type}`);
  }
}

export function onMadnessChange(callback) {
  listeners.push(callback);
}

export function getMadness() {
  return { intensity, tier, tierName: TIERS[tier].name };
}

export function setMadness(newIntensity) {
  const oldTier = tier;
  intensity = Math.max(0, Math.min(100, newIntensity));
  tier = calcTier(intensity);
  save();
  updateCSS();
  notify('manual', intensity);
  if (tier !== oldTier) {
    console.log(`[Madness] Set to ${TIERS[tier].label} (${intensity.toFixed(1)}%)`);
  }
}

export function refreshMadnessCSS() {
  updateCSS();
}

// Trigger screen shake (called by other modules)
export function triggerScreenShake() {
  const body = document.body;
  body.classList.remove('screen-shake');
  // Force reflow to restart animation
  void body.offsetWidth;
  body.classList.add('screen-shake');
  setTimeout(() => body.classList.remove('screen-shake'), 400);
}

// Trigger damage flash
export function triggerDamageFlash() {
  const body = document.body;
  body.classList.remove('damage-flash');
  void body.offsetWidth;
  body.classList.add('damage-flash');
  setTimeout(() => body.classList.remove('damage-flash'), 500);
}

// ── Initialization ──
export async function initMadness() {
  load(); // localStorage first (instant)
  // Try server
  try {
    const res = await fetch(`${API_URL}?key=madness`);
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data.intensity === 'number') {
        intensity = Math.max(0, Math.min(100, data.intensity));
        localStorage.setItem(STORAGE_KEY, intensity.toFixed(2));
      }
    }
  } catch (e) {
    console.warn('Server madness load failed, using localStorage', e);
  }
  tier = calcTier(intensity);
  updateCSS();
  console.log(`[Madness] Initialized: ${TIERS[tier].label} (${intensity.toFixed(1)}%)`);
}
