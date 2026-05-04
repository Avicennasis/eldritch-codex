// Entry point — wires all modules together
import { initUI, renderAll } from './ui.js?v=39';
import { getState, update, initState } from './state.js?v=19';
import { initMadness, onMadnessChange, getMadness, setMadness, refreshMadnessCSS } from './madness.js?v=6';
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

function createNoopBeholder() {
  return {
    initBeholder() {},
    updateBeholder() {},
  };
}

async function loadBeholderModule() {
  try {
    return await import('./beholder-3d.js?v=1');
  } catch (e) {
    console.warn('Beholder module failed to load; continuing without 3D eye', e);
    return createNoopBeholder();
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  let updateBeholderFrame = () => {};
  const beholderModulePromise = loadBeholderModule();

  // State change callback re-renders UI + syncs madness
  window._onStateChange = () => { renderAll(); syncMadnessDOM(); };

  // Initialize systems — state must load before madness so suppression class is set
  await initState();
  syncMadnessDOM();
  await initMadness();
  initUI();
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
  // Click = toggle on/off, Long press = level picker menu
  const madnessBtn = document.getElementById('btn-madness-toggle');
  madnessBtn.textContent = '\uD83E\uDDE0'; // 🧠
  syncMadnessDOM();

  let pressTimer = null;
  let didLongPress = false;
  let pressAborted = false;
  let cleanupMadnessMenu = null;

  const MADNESS_TIERS = [
    { name: 'Calm', max: 15, set: 0 },
    { name: 'Uneasy', max: 35, set: 25 },
    { name: 'Disturbed', max: 55, set: 45 },
    { name: 'Unhinged', max: 80, set: 68 },
    { name: 'Singularity', max: 100, set: 90 },
  ];

  function showMadnessMenu() {
    closeMadnessMenu();

    const previousFocus = document.activeElement;
    const overlay = document.createElement('div');
    overlay.id = 'madness-menu-overlay';
    overlay.className = 'modal-overlay';

    const menu = document.createElement('div');
    menu.id = 'madness-menu';
    menu.className = 'modal';
    menu.setAttribute('role', 'dialog');
    menu.setAttribute('aria-modal', 'true');
    menu.setAttribute('aria-labelledby', 'madness-menu-title');

    const closeMenu = () => {
      cleanupMadnessMenu?.();
      overlay.remove();
      previousFocus?.focus?.();
    };

    const title = document.createElement('div');
    title.id = 'madness-menu-title';
    title.textContent = 'Set Madness Level';
    title.style.cssText = 'color: #39ff14; font-weight: bold; margin-bottom: 10px; text-align: center;';
    menu.appendChild(title);

    const current = getMadness();
    const buttons = [];

    MADNESS_TIERS.forEach(tier => {
      const btn = document.createElement('button');
      btn.className = 'btn';
      btn.textContent = `${tier.name} (${tier.set}%)`;
      btn.style.cssText = `
        display: block;
        width: 100%;
        padding: 8px 12px;
        margin: 4px 0;
        background: ${current.tierName === tier.name.toLowerCase() ? 'rgba(57, 255, 20, 0.2)' : 'transparent'};
        border: 1px solid rgba(57, 255, 20, 0.3);
        border-radius: 4px;
        color: #c8e6c9;
        cursor: pointer;
        text-align: left;
      `;
      btn.addEventListener('click', () => {
        setMadness(tier.set);
        closeMenu();
      });
      btn.addEventListener('mouseenter', () => {
        btn.style.background = 'rgba(57, 255, 20, 0.3)';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.background = current.tierName === tier.name.toLowerCase() ? 'rgba(57, 255, 20, 0.2)' : 'transparent';
      });
      menu.appendChild(btn);
      buttons.push(btn);
    });

    const closeBtn = document.createElement('button');
    closeBtn.className = 'btn';
    closeBtn.textContent = 'Cancel';
    closeBtn.style.cssText = `
      display: block;
      width: 100%;
      padding: 8px 12px;
      margin-top: 8px;
      background: transparent;
      border: 1px solid rgba(255, 100, 100, 0.3);
      border-radius: 4px;
      color: #ff6b6b;
      cursor: pointer;
    `;
    closeBtn.addEventListener('click', closeMenu);
    menu.appendChild(closeBtn);
    buttons.push(closeBtn);

    function onKeyDown(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeMenu();
        return;
      }
      if (e.key === 'Tab') {
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeMenu();
    });
    overlay.addEventListener('keydown', onKeyDown);
    overlay.appendChild(menu);
    document.body.appendChild(overlay);

    cleanupMadnessMenu = () => {
      overlay.removeEventListener('keydown', onKeyDown);
      cleanupMadnessMenu = null;
    };

    buttons[0]?.focus();
  }

  function closeMadnessMenu() {
    cleanupMadnessMenu?.();
    document.getElementById('madness-menu-overlay')?.remove();
  }

  function cancelMadnessPress() {
    clearTimeout(pressTimer);
    pressTimer = null;
  }

  function abortMadnessPress() {
    cancelMadnessPress();
    pressAborted = true;
  }

  madnessBtn.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    didLongPress = false;
    pressAborted = false;
    cancelMadnessPress();
    pressTimer = setTimeout(() => {
      didLongPress = true;
      showMadnessMenu();
    }, 500); // 500ms hold = long press
  });

  madnessBtn.addEventListener('pointerup', () => {
    cancelMadnessPress();
    if (pressAborted) {
      pressAborted = false;
      return;
    }
    if (!didLongPress) {
      // Normal click - toggle suppression
      update('madnessSuppressed', !getState().madnessSuppressed);
      syncMadnessDOM();
      refreshMadnessCSS();
    }
  });

  madnessBtn.addEventListener('pointerleave', abortMadnessPress);
  madnessBtn.addEventListener('pointercancel', abortMadnessPress);

  // Tentacle cursor-zone reactivity
  initTentacleZones();

  // Reality warp at tier 3+
  initRealityWarp();

  // ── Shared rAF engine ──
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function tick(timestamp) {
    if (!reducedMotion && document.visibilityState !== 'hidden') {
      updateBeholderFrame(timestamp);
      updateParticles(timestamp);
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  initCollapsiblePanels();

  beholderModulePromise.then(({ initBeholder, updateBeholder }) => {
    initBeholder();
    updateBeholderFrame = updateBeholder;
  });
});

function initCollapsiblePanels() {
  const collapsed = new Set(getState().collapsedPanels || []);

  document.querySelectorAll('.panel:not(.panel-critical)').forEach((panel, index) => {
    const header = panel.querySelector(':scope > .panel-header');
    const heading = header?.querySelector(':scope > h2');
    if (!header || !heading) return;

    let toggle = header.querySelector(':scope > .panel-toggle');
    const panelKey = panel.dataset.panelKey || `panel-${index}`;
    panel.dataset.panelKey = panelKey;
    if (!toggle) {
      toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'panel-toggle';
      toggle.setAttribute('aria-expanded', 'true');

      const regionId = panel.id || `panel-section-${index}`;
      if (!panel.id) panel.id = regionId;
      toggle.setAttribute('aria-controls', regionId);

      toggle.appendChild(heading);
      header.prepend(toggle);
    }

    const isCollapsed = collapsed.has(panelKey);
    panel.classList.toggle('collapsed', isCollapsed);
    toggle.setAttribute('aria-expanded', String(!isCollapsed));

    if (toggle.dataset.bound === 'true') return;
    toggle.dataset.bound = 'true';
    toggle.addEventListener('click', () => {
      if (!window.matchMedia('(max-width: 900px)').matches) return;
      panel.classList.toggle('collapsed');
      toggle.setAttribute('aria-expanded', String(!panel.classList.contains('collapsed')));
      saveCollapsedPanels();
    });
  });
}

function saveCollapsedPanels() {
  const current = [];
  document.querySelectorAll('.panel.collapsed').forEach((panel) => {
    const key = panel.dataset.panelKey;
    if (key) current.push(key);
  });
  update('collapsedPanels', current);
}

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
