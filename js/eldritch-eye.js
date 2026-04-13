// Beholder Eye — floating cursor-tracking eye with personality
// Smooth lerp tracking, pupil dilation, blink, slime trail, madness integration

import { onMadnessChange, getMadness } from './madness.js?v=4';

// ── Configuration ──
const EYE_SIZE = 80;
const LERP_BASE = 0.06;
const PUPIL_CHECK_INTERVAL = 200;
const TRAIL_INTERVAL = 80;
const MAX_TRAIL = 15;
const BLINK_MIN = 3000;
const BLINK_MAX = 8000;

// ── State ──
let eyeEl = null;
let pupilEl = null;
let irisEl = null;
let veinsGroup = null;
let lidUpper = null;
let lidLower = null;

const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
const current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
const lastTrailPos = { x: 0, y: 0 };
let lerp = LERP_BASE;
let pupilDilation = 0.35; // narrow slit default
let targetDilation = 0.35;
let isBlinking = false;
let trailElements = [];
let lastTrailTime = 0;
let lastPupilCheck = 0;
let madnessTier = 0;
let jitterX = 0;
let jitterY = 0;

// ── SVG Construction ──
function buildEyeSVG() {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 80 80');
  svg.setAttribute('width', EYE_SIZE);
  svg.setAttribute('height', EYE_SIZE);

  // Defs
  const defs = document.createElementNS(ns, 'defs');

  // Sclera gradient
  const scleraGrad = document.createElementNS(ns, 'radialGradient');
  scleraGrad.id = 'beholder-sclera';
  addStop(scleraGrad, ns, '0%', '#e8e4d0', '1');
  addStop(scleraGrad, ns, '60%', '#c9c4a8', '1');
  addStop(scleraGrad, ns, '85%', '#8a9a6c', '0.9');
  addStop(scleraGrad, ns, '100%', '#4a5a3c', '0.8');
  defs.appendChild(scleraGrad);

  // Iris gradient
  const irisGrad = document.createElementNS(ns, 'radialGradient');
  irisGrad.id = 'beholder-iris';
  addStop(irisGrad, ns, '0%', '#050a05', '1');
  addStop(irisGrad, ns, '30%', '#0a1f0a', '1');
  addStop(irisGrad, ns, '55%', '#39ff14', '0.9');
  addStop(irisGrad, ns, '75%', '#9b30ff', '0.7');
  addStop(irisGrad, ns, '100%', '#1f0a3d', '0.9');
  defs.appendChild(irisGrad);

  // Vein gradient
  const veinGrad = document.createElementNS(ns, 'linearGradient');
  veinGrad.id = 'beholder-vein';
  veinGrad.setAttribute('x1', '0');
  veinGrad.setAttribute('y1', '0');
  veinGrad.setAttribute('x2', '1');
  veinGrad.setAttribute('y2', '0');
  addStop(veinGrad, ns, '0%', '#cc3333', '0.6');
  addStop(veinGrad, ns, '50%', '#39ff14', '0.3');
  addStop(veinGrad, ns, '100%', '#cc3333', '0');
  defs.appendChild(veinGrad);

  svg.appendChild(defs);

  // Sclera (main eye shape)
  const sclera = document.createElementNS(ns, 'ellipse');
  sclera.setAttribute('cx', '40');
  sclera.setAttribute('cy', '40');
  sclera.setAttribute('rx', '36');
  sclera.setAttribute('ry', '22');
  sclera.setAttribute('fill', 'url(#beholder-sclera)');
  sclera.setAttribute('stroke', '#39ff14');
  sclera.setAttribute('stroke-width', '1.5');
  sclera.setAttribute('stroke-opacity', '0.5');
  svg.appendChild(sclera);

  // Veins
  veinsGroup = document.createElementNS(ns, 'g');
  veinsGroup.setAttribute('opacity', '0.4');
  const veinPaths = [
    'M10,38 Q20,35 30,38',
    'M12,43 Q22,46 32,42',
    'M8,36 Q15,30 25,34',
    'M50,38 Q60,35 70,38',
    'M48,43 Q58,46 68,42',
    'M55,36 Q65,30 72,34',
    'M15,32 Q25,28 35,35',
    'M45,35 Q55,28 65,32',
  ];
  for (const d of veinPaths) {
    const path = document.createElementNS(ns, 'path');
    path.setAttribute('d', d);
    path.setAttribute('stroke', 'url(#beholder-vein)');
    path.setAttribute('stroke-width', '0.8');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-linecap', 'round');
    veinsGroup.appendChild(path);
  }
  svg.appendChild(veinsGroup);

  // Iris
  irisEl = document.createElementNS(ns, 'circle');
  irisEl.setAttribute('cx', '40');
  irisEl.setAttribute('cy', '40');
  irisEl.setAttribute('r', '14');
  irisEl.setAttribute('fill', 'url(#beholder-iris)');
  svg.appendChild(irisEl);

  // Iris detail rings
  const ring1 = document.createElementNS(ns, 'circle');
  ring1.setAttribute('cx', '40');
  ring1.setAttribute('cy', '40');
  ring1.setAttribute('r', '11');
  ring1.setAttribute('fill', 'none');
  ring1.setAttribute('stroke', 'rgba(57,255,20,0.25)');
  ring1.setAttribute('stroke-width', '0.5');
  svg.appendChild(ring1);

  const ring2 = document.createElementNS(ns, 'circle');
  ring2.setAttribute('cx', '40');
  ring2.setAttribute('cy', '40');
  ring2.setAttribute('r', '8');
  ring2.setAttribute('fill', 'none');
  ring2.setAttribute('stroke', 'rgba(155,48,255,0.2)');
  ring2.setAttribute('stroke-width', '0.5');
  svg.appendChild(ring2);

  // Pupil (vertical slit)
  pupilEl = document.createElementNS(ns, 'ellipse');
  pupilEl.setAttribute('cx', '40');
  pupilEl.setAttribute('cy', '40');
  pupilEl.setAttribute('rx', '4');
  pupilEl.setAttribute('ry', '16');
  pupilEl.setAttribute('fill', '#050a05');
  pupilEl.style.transition = 'rx 0.4s ease';
  svg.appendChild(pupilEl);

  // Highlight / sheen
  const highlight = document.createElementNS(ns, 'ellipse');
  highlight.setAttribute('cx', '34');
  highlight.setAttribute('cy', '33');
  highlight.setAttribute('rx', '5');
  highlight.setAttribute('ry', '3');
  highlight.setAttribute('fill', 'rgba(255,255,255,0.2)');
  highlight.setAttribute('transform', 'rotate(-20 34 33)');
  svg.appendChild(highlight);

  // Upper lid
  lidUpper = document.createElementNS(ns, 'path');
  lidUpper.setAttribute('d', 'M4,40 Q40,5 76,40');
  lidUpper.setAttribute('fill', '#1a2a1a');
  lidUpper.setAttribute('stroke', '#39ff14');
  lidUpper.setAttribute('stroke-width', '0.8');
  lidUpper.setAttribute('stroke-opacity', '0.4');
  lidUpper.style.transformOrigin = '40px 40px';
  lidUpper.style.transition = 'transform 0.15s ease';
  lidUpper.style.transform = 'translateY(-22px)';
  svg.appendChild(lidUpper);

  // Lower lid
  lidLower = document.createElementNS(ns, 'path');
  lidLower.setAttribute('d', 'M4,40 Q40,75 76,40');
  lidLower.setAttribute('fill', '#1a2a1a');
  lidLower.setAttribute('stroke', '#39ff14');
  lidLower.setAttribute('stroke-width', '0.8');
  lidLower.setAttribute('stroke-opacity', '0.4');
  lidLower.style.transformOrigin = '40px 40px';
  lidLower.style.transition = 'transform 0.15s ease';
  lidLower.style.transform = 'translateY(22px)';
  svg.appendChild(lidLower);

  return svg;
}

function addStop(gradient, ns, offset, color, opacity) {
  const stop = document.createElementNS(ns, 'stop');
  stop.setAttribute('offset', offset);
  stop.setAttribute('stop-color', color);
  stop.setAttribute('stop-opacity', opacity);
  gradient.appendChild(stop);
}

// ── Blink ──
function doBlink(duration = 200) {
  if (isBlinking) return;
  isBlinking = true;

  lidUpper.style.transition = `transform ${duration / 2}ms ease-in`;
  lidLower.style.transition = `transform ${duration / 2}ms ease-in`;
  lidUpper.style.transform = 'translateY(0px)';
  lidLower.style.transform = 'translateY(0px)';

  setTimeout(() => {
    lidUpper.style.transition = `transform ${duration / 2}ms ease-out`;
    lidLower.style.transition = `transform ${duration / 2}ms ease-out`;
    lidUpper.style.transform = 'translateY(-22px)';
    lidLower.style.transform = 'translateY(22px)';
    setTimeout(() => { isBlinking = false; }, duration / 2);
  }, duration / 2);
}

let blinkTimeout = null;
function scheduleBlink() {
  if (blinkTimeout) clearTimeout(blinkTimeout);
  // Blink rate increases with madness
  const minMs = madnessTier >= 3 ? 1500 : BLINK_MIN;
  const maxMs = madnessTier >= 3 ? 4000 : BLINK_MAX;
  const delay = minMs + Math.random() * (maxMs - minMs);

  blinkTimeout = setTimeout(() => {
    if (!eyeEl) return;

    // Occasional double blink at tier 4 (check first so it isn't shadowed by tier 3)
    if (madnessTier >= 4 && Math.random() < 0.15) {
      doBlink(150);
      setTimeout(() => doBlink(150), 300);
    }
    // Occasional slow blink at high madness
    else if (madnessTier >= 3 && Math.random() < 0.2) {
      doBlink(600);
    } else {
      doBlink(200);
    }

    scheduleBlink();
  }, delay);
}

// ── Slime Trail ──
function spawnTrailDrop(x, y) {
  const drop = document.createElement('div');
  drop.className = 'slime-drop';

  // Size scales with madness
  const size = 6 + madnessTier * 2;
  drop.style.width = size + 'px';
  drop.style.height = size + 'px';
  drop.style.left = (x - size / 2) + 'px';
  drop.style.top = (y - size / 2) + 'px';

  // Purple drops at high madness
  if (madnessTier >= 3 && Math.random() < 0.3) {
    drop.classList.add('purple');
  }

  eyeEl.parentElement.appendChild(drop);
  trailElements.push(drop);

  // Cleanup
  drop.addEventListener('animationend', () => {
    drop.remove();
    const idx = trailElements.indexOf(drop);
    if (idx >= 0) trailElements.splice(idx, 1);
  });

  // Cap trail length
  while (trailElements.length > MAX_TRAIL) {
    const old = trailElements.shift();
    old.remove();
  }
}

// ── Pupil dilation check ──
function checkPupilDilation(timestamp) {
  if (timestamp - lastPupilCheck < PUPIL_CHECK_INTERVAL) return;
  lastPupilCheck = timestamp;

  try {
    const elementsAtCursor = document.elementsFromPoint(target.x, target.y);
    const nearInteractive = elementsAtCursor.some(el =>
      el.tagName === 'BUTTON' || el.tagName === 'INPUT' || el.tagName === 'SELECT' ||
      el.classList.contains('roll-btn') || el.classList.contains('spell-card') ||
      el.classList.contains('slot-check') || el.classList.contains('resource-pip') ||
      el.classList.contains('resource-toggle') || el.classList.contains('death-save-pip')
    );
    targetDilation = nearInteractive ? 10 : 4;

    // Random dilation at tier 3+
    if (madnessTier >= 3 && Math.random() < 0.05) {
      targetDilation = 3 + Math.random() * 8;
    }
  } catch (e) {
    // elementsFromPoint can fail on edge cases
  }
}

// ── Main update (called from shared rAF loop) ──
export function updateEye(timestamp) {
  if (!eyeEl) return;

  // Lerp speed scales with madness
  const currentLerp = LERP_BASE + madnessTier * 0.025;

  // Jitter at tier 3+
  if (madnessTier >= 3) {
    const jitterIntensity = madnessTier >= 4 ? 3 : 1.5;
    jitterX += (Math.random() - 0.5) * jitterIntensity;
    jitterY += (Math.random() - 0.5) * jitterIntensity;
    jitterX *= 0.9; // dampen
    jitterY *= 0.9;
  } else {
    jitterX = 0;
    jitterY = 0;
  }

  // Occasional snap to random position at tier 4
  if (madnessTier >= 4 && Math.random() < 0.002) {
    current.x = Math.random() * window.innerWidth;
    current.y = Math.random() * window.innerHeight;
  }

  // Smooth lerp toward cursor
  current.x += (target.x - current.x) * currentLerp;
  current.y += (target.y - current.y) * currentLerp;

  // Position eye (offset so it's beside the cursor, not on it)
  const eyeX = current.x + 40 + jitterX;
  const eyeY = current.y - 50 + jitterY;
  eyeEl.style.transform = `translate3d(${eyeX}px, ${eyeY}px, 0)`;

  // Pupil tracks cursor relative to eye center
  const eyeCenterX = eyeX + EYE_SIZE / 2;
  const eyeCenterY = eyeY + EYE_SIZE / 2;
  const dx = target.x - eyeCenterX;
  const dy = target.y - eyeCenterY;
  const maxOffset = 7;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const offsetX = (dx / dist) * Math.min(dist * 0.05, maxOffset);
  const offsetY = (dy / dist) * Math.min(dist * 0.05, maxOffset);

  irisEl.setAttribute('cx', (40 + offsetX).toFixed(1));
  irisEl.setAttribute('cy', (40 + offsetY).toFixed(1));
  pupilEl.setAttribute('cx', (40 + offsetX).toFixed(1));
  pupilEl.setAttribute('cy', (40 + offsetY).toFixed(1));

  // Smooth pupil dilation
  pupilDilation += (targetDilation - pupilDilation) * 0.1;
  pupilEl.setAttribute('rx', pupilDilation.toFixed(1));

  // Pupil dilation proximity check
  checkPupilDilation(timestamp);

  // Slime trail
  if (timestamp - lastTrailTime > TRAIL_INTERVAL) {
    const dx2 = current.x - lastTrailPos.x;
    const dy2 = current.y - lastTrailPos.y;
    if (dx2 * dx2 + dy2 * dy2 > 25) {
      spawnTrailDrop(eyeX + EYE_SIZE / 2, eyeY + EYE_SIZE);
      lastTrailPos.x = current.x;
      lastTrailPos.y = current.y;
      lastTrailTime = timestamp;
    }
  }
}

// ── Madness subscription ──
function onMadnessUpdate(data) {
  madnessTier = data.tier;

  // Vein intensity
  if (veinsGroup) {
    veinsGroup.setAttribute('opacity', (0.3 + data.intensity / 100 * 0.6).toFixed(2));
  }

  // Iris color shift at tier 4
  if (data.tier >= 4 && irisEl) {
    irisEl.setAttribute('fill', 'url(#beholder-iris)');
    irisEl.style.filter = 'hue-rotate(40deg) saturate(1.5)';
  } else if (irisEl) {
    irisEl.style.filter = '';
  }
}

// ── Init ──
export function initEye() {
  // Don't init on narrow screens
  if (window.matchMedia('(max-width: 900px)').matches) return;

  const container = document.getElementById('beholder-eye-container');
  if (!container) return;

  eyeEl = document.createElement('div');
  eyeEl.className = 'beholder-eye';
  eyeEl.appendChild(buildEyeSVG());
  container.appendChild(eyeEl);

  // Mouse tracking
  document.addEventListener('mousemove', (e) => {
    target.x = e.clientX;
    target.y = e.clientY;
  }, { passive: true });

  // Subscribe to madness
  onMadnessChange(onMadnessUpdate);
  const m = getMadness();
  madnessTier = m.tier;

  // Start blink cycle
  scheduleBlink();
}
