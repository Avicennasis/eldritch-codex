// Entry point — wires all modules together
import { initUI, renderAll } from './ui.js?v=37';
import { getState, update, initState } from './state.js?v=18';
import { initMadness, onMadnessChange, getMadness, refreshMadnessCSS } from './madness.js?v=4';
import { initEye, updateEye } from './eldritch-eye.js?v=9';
import { initParticles, updateParticles, spawnPortal } from './particles.js?v=6';

// Hook dice stage for portal particles
// Observe the dice stage — when children are added (dice appear), spawn portal
function hookDicePortal() {
  const stage = document.getElementById('dice-stage');
  if (!stage) return;
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.addedNodes.length > 0) {
        const rect = stage.getBoundingClientRect();
        spawnPortal(rect);
        stage.classList.add('portal-active');
        setTimeout(() => stage.classList.remove('portal-active'), 800);
        break;
      }
    }
  });
  observer.observe(stage, { childList: true });
}


function syncMadnessDOM() {
  const suppressed = getState().madnessSuppressed;
  const btn = document.getElementById('btn-madness-toggle');
  document.body.classList.toggle('madness-suppressed', suppressed);
  if (btn) btn.classList.toggle('madness-off', suppressed);
}

document.addEventListener('DOMContentLoaded', async () => {
  // State change callback re-renders UI + syncs madness
  window._onStateChange = () => { renderAll(); syncMadnessDOM(); };

  // Initialize systems — state must load before madness so suppression class is set
  await initState();
  syncMadnessDOM();
  await initMadness();
  initUI();
  initEye();
  initParticles();
  hookDicePortal();

  // Migrate old localStorage madness toggle to server state
  const oldMadness = localStorage.getItem('dnd-madness-suppressed');
  if (oldMadness === 'true' && !getState().madnessSuppressed) {
    update('madnessSuppressed', true);
    localStorage.removeItem('dnd-madness-suppressed');
  } else if (oldMadness !== null) {
    localStorage.removeItem('dnd-madness-suppressed');
  }

  // Madness effects toggle (persisted server-side)
  const madnessBtn = document.getElementById('btn-madness-toggle');
  madnessBtn.textContent = '\uD83E\uDDE0'; // 🧠
  syncMadnessDOM();
  madnessBtn.addEventListener('click', () => {
    update('madnessSuppressed', !getState().madnessSuppressed);
    syncMadnessDOM();
    refreshMadnessCSS();
  });

  // Tentacle cursor-zone reactivity
  initTentacleZones();

  // Reality warp at tier 3+
  initRealityWarp();

  // ── Shared rAF engine ──
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function tick(timestamp) {
    if (!reducedMotion && document.visibilityState !== 'hidden') {
      updateEye(timestamp);
      updateParticles(timestamp);
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // ── Mobile collapsible panels ──
  // Restore collapsed state from server
  const collapsed = getState().collapsedPanels || [];
  document.querySelectorAll('.panel:not(.panel-critical)').forEach(panel => {
    const h2 = panel.querySelector('h2');
    if (!h2) return;
    const name = h2.textContent.trim();
    if (collapsed.includes(name)) {
      panel.classList.add('collapsed');
      panel.querySelector('.panel-header')?.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('click', (e) => {
    if (!window.matchMedia('(max-width: 900px)').matches) return;
    const header = e.target.closest('.panel-header');
    if (!header) return;
    const panel = header.closest('.panel');
    if (!panel || panel.classList.contains('panel-critical')) return;
    panel.classList.toggle('collapsed');
    header.setAttribute('aria-expanded', String(!panel.classList.contains('collapsed')));

    // Save collapsed state
    const current = [];
    document.querySelectorAll('.panel.collapsed').forEach(p => {
      const h2 = p.querySelector('h2');
      if (h2) current.push(h2.textContent.trim());
    });
    update('collapsedPanels', current);
  });
});

// ── Tentacle cursor-zone reactivity ──
function initTentacleZones() {
  if (window.matchMedia('(max-width: 900px)').matches) return;

  const tentacles = document.querySelectorAll('.tentacle-svg');
  let lastZone = '';

  // Map tentacles to their responsive zones
  const zoneMap = {
    'left-top': ['left', 'top-left'],
    'right-top': ['right', 'top-right'],
    'left-mid': ['left', 'center-left'],
    'right-mid': ['right', 'center-right'],
    'left-bottom': ['left', 'bottom-left'],
    'right-bottom': ['right', 'bottom-right'],
    'top-center': ['top', 'center-top'],
    'bottom-center': ['bottom', 'bottom-center'],
  };

  function getZone(x, y) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const col = x < w * 0.33 ? 'left' : x > w * 0.66 ? 'right' : 'center';
    const row = y < h * 0.33 ? 'top' : y > h * 0.66 ? 'bottom' : 'center';
    return `${row}-${col}`;
  }

  let throttleTimer = 0;
  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - throttleTimer < 100) return;
    throttleTimer = now;

    const zone = getZone(e.clientX, e.clientY);
    if (zone === lastZone) return;
    lastZone = zone;

    tentacles.forEach((t) => {
      // Remove all reaching classes
      t.classList.remove('tentacle-reaching');

      // Check if this tentacle should reach toward cursor zone
      const classes = [...t.classList];
      for (const [tentacleClass, zones] of Object.entries(zoneMap)) {
        if (classes.some(c => c === tentacleClass)) {
          // Tentacle reaches when cursor is in an adjacent zone
          const isNearby = zones.some(z => zone.includes(z.split('-')[0]));
          if (isNearby) {
            t.classList.add('tentacle-reaching');
          }
        }
      }
    });
  }, { passive: true });
}

// ── Reality warp at tier 3+ ──
function initRealityWarp() {
  const mainGrid = document.querySelector('.main-grid');
  const spellSection = document.querySelector('.spell-section');
  const warpDisp = document.getElementById('warp-displacement');
  if (!mainGrid || !warpDisp) return;

  const warpTargets = [mainGrid, spellSection].filter(Boolean);

  onMadnessChange((data) => {
    if (data.tier >= 4) {
      warpTargets.forEach(el => el.classList.add('reality-warped'));
      warpDisp.setAttribute('scale', '6');
    } else if (data.tier >= 3) {
      warpTargets.forEach(el => el.classList.add('reality-warped'));
      warpDisp.setAttribute('scale', '2');
    } else {
      warpTargets.forEach(el => el.classList.remove('reality-warped'));
      warpDisp.setAttribute('scale', '0');
    }
  });

  // Set initial state
  const m = getMadness();
  if (m.tier >= 4) {
    warpTargets.forEach(el => el.classList.add('reality-warped'));
    warpDisp.setAttribute('scale', '6');
  } else if (m.tier >= 3) {
    warpTargets.forEach(el => el.classList.add('reality-warped'));
    warpDisp.setAttribute('scale', '2');
  }
}
