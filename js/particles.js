// Canvas particle system — spores, sparks, runes, portal fx, wisps
// Object pool, additive blending, shared rAF, zero GC

import { onMadnessChange, getMadness } from './madness.js?v=4';

const MAX_PARTICLES = 200;
const RUNE_CHARS = ['᛭', 'ᚱ', 'ᛟ', 'ᚨ', 'ᛞ', 'ᛉ', 'ᚲ', 'ᛏ', '☍', '⍟', '⎊', '◬', '⏣', '⌬'];

// ── Particle types ──
const TYPE = { SPORE: 0, SPARK: 1, RUNE: 2, PORTAL: 3, WISP: 4 };

// ── State ──
let canvas = null;
let ctx = null;
let particles = [];
let madnessTier = 0;
let madnessIntensity = 0;
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let lastSporeTime = 0;
let lastRuneTime = 0;
let lastWispTime = 0;
let dpr = 1;

// ── Particle pool ──
function createParticle() {
  return {
    active: false, type: 0,
    x: 0, y: 0, vx: 0, vy: 0,
    life: 0, maxLife: 0,
    size: 0, rotation: 0, rotationSpeed: 0,
    r: 0, g: 0, b: 0, alpha: 0,
    runeChar: '',
    // Portal-specific
    centerX: 0, centerY: 0, angle: 0, radius: 0, radiusSpeed: 0,
  };
}

function getInactive() {
  for (const p of particles) {
    if (!p.active) return p;
  }
  return null;
}

// ── Spawn functions ──

function spawnSpore() {
  const p = getInactive();
  if (!p) return;
  p.active = true;
  p.type = TYPE.SPORE;
  p.x = Math.random() * canvas.width / dpr;
  p.y = canvas.height / dpr + 5;
  p.vx = (Math.random() - 0.5) * 0.3;
  p.vy = -(0.3 + Math.random() * 0.5);
  p.size = 2 + Math.random() * 4;
  p.maxLife = 600 + Math.random() * 400;
  p.life = 0;
  p.rotation = 0;
  p.rotationSpeed = 0;
  // Alternate green/purple
  if (Math.random() < 0.6) {
    p.r = 57; p.g = 255; p.b = 20;
  } else {
    p.r = 155; p.g = 48; p.b = 255;
  }
}

export function spawnSparks(x, y, count = 12) {
  for (let i = 0; i < count; i++) {
    const p = getInactive();
    if (!p) return;
    p.active = true;
    p.type = TYPE.SPARK;
    p.x = x;
    p.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 3;
    p.vx = Math.cos(angle) * speed;
    p.vy = Math.sin(angle) * speed;
    p.size = 1 + Math.random() * 2;
    p.maxLife = 30 + Math.random() * 40;
    p.life = 0;
    p.rotation = 0;
    p.rotationSpeed = 0;
    // Bright green or cyan
    if (Math.random() < 0.5) {
      p.r = 57; p.g = 255; p.b = 20;
    } else {
      p.r = 0; p.g = 229; p.b = 255;
    }
  }
}

function spawnRune() {
  const p = getInactive();
  if (!p) return;
  p.active = true;
  p.type = TYPE.RUNE;
  p.x = Math.random() * canvas.width / dpr;
  p.y = Math.random() * canvas.height / dpr;
  p.vx = (Math.random() - 0.5) * 0.15;
  p.vy = -(0.05 + Math.random() * 0.15);
  p.size = 14 + Math.random() * 10;
  p.maxLife = 200 + Math.random() * 300;
  p.life = 0;
  p.rotation = Math.random() * Math.PI * 2;
  p.rotationSpeed = (Math.random() - 0.5) * 0.01;
  p.runeChar = RUNE_CHARS[Math.floor(Math.random() * RUNE_CHARS.length)];
  p.r = 155; p.g = 48; p.b = 255;
}

export function spawnPortal(rect) {
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const count = 30 + Math.floor(madnessIntensity / 100 * 20);

  for (let i = 0; i < count; i++) {
    const p = getInactive();
    if (!p) return;
    p.active = true;
    p.type = TYPE.PORTAL;
    p.centerX = cx;
    p.centerY = cy;
    p.angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
    p.radius = 60 + Math.random() * 40;
    p.radiusSpeed = -(p.radius / 50); // spiral inward over ~50 frames
    p.x = cx + Math.cos(p.angle) * p.radius;
    p.y = cy + Math.sin(p.angle) * p.radius;
    p.vx = 0;
    p.vy = 0;
    p.size = 2 + Math.random() * 3;
    p.maxLife = 50 + Math.random() * 30;
    p.life = 0;
    p.rotation = 0;
    p.rotationSpeed = 0.05 + Math.random() * 0.05;
    // Cyan to purple gradient
    if (Math.random() < 0.5) {
      p.r = 0; p.g = 229; p.b = 255;
    } else {
      p.r = 155; p.g = 48; p.b = 255;
    }
  }
}

function spawnWisp() {
  const p = getInactive();
  if (!p) return;
  p.active = true;
  p.type = TYPE.WISP;
  p.x = Math.random() * canvas.width / dpr;
  p.y = Math.random() * canvas.height / dpr;
  p.vx = (Math.random() - 0.5) * 0.5;
  p.vy = (Math.random() - 0.5) * 0.5;
  p.size = 3 + Math.random() * 5;
  p.maxLife = 300 + Math.random() * 200;
  p.life = 0;
  p.rotation = Math.random() * Math.PI;
  p.rotationSpeed = (Math.random() - 0.5) * 0.02;
  p.r = 57; p.g = 255; p.b = 20;
}

// ── Update ──
function updateParticle(p) {
  p.life++;
  if (p.life >= p.maxLife) {
    p.active = false;
    return;
  }

  switch (p.type) {
    case TYPE.SPORE:
      p.x += p.vx + Math.sin(p.life * 0.02) * 0.2;
      p.y += p.vy;
      break;

    case TYPE.SPARK:
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.96;
      p.vy *= 0.96;
      break;

    case TYPE.RUNE:
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      break;

    case TYPE.PORTAL:
      p.angle += p.rotationSpeed;
      p.radius = Math.max(0, p.radius + p.radiusSpeed);
      p.x = p.centerX + Math.cos(p.angle) * p.radius;
      p.y = p.centerY + Math.sin(p.angle) * p.radius;
      break;

    case TYPE.WISP: {
      // Attracted to cursor
      const dx = mouseX - p.x;
      const dy = mouseY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      p.vx += (dx / dist) * 0.03;
      p.vy += (dy / dist) * 0.03;
      p.vx *= 0.98;
      p.vy *= 0.98;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      break;
    }
  }
}

// ── Render ──
function renderParticle(p) {
  const lifePct = p.life / p.maxLife;
  // Fade in first 10%, fade out last 20%
  let alpha;
  if (lifePct < 0.1) alpha = lifePct / 0.1;
  else if (lifePct > 0.8) alpha = (1 - lifePct) / 0.2;
  else alpha = 1;

  // Scale alpha by type
  switch (p.type) {
    case TYPE.SPORE: alpha *= 0.5; break;
    case TYPE.SPARK: alpha *= 0.9; break;
    case TYPE.RUNE: alpha *= 0.25; break;
    case TYPE.PORTAL: alpha *= 0.7; break;
    case TYPE.WISP: alpha *= 0.35; break;
  }

  ctx.globalAlpha = alpha;

  if (p.type === TYPE.RUNE) {
    ctx.save();
    ctx.translate(p.x * dpr, p.y * dpr);
    ctx.rotate(p.rotation);
    ctx.font = `${p.size * dpr}px serif`;
    ctx.fillStyle = `rgb(${p.r}, ${p.g}, ${p.b})`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(p.runeChar, 0, 0);
    ctx.restore();
  } else if (p.type === TYPE.WISP) {
    // Elongated ellipse
    ctx.save();
    ctx.translate(p.x * dpr, p.y * dpr);
    ctx.rotate(p.rotation);
    ctx.beginPath();
    ctx.ellipse(0, 0, p.size * 2 * dpr, p.size * dpr, 0, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, 0.4)`;
    ctx.fill();
    ctx.restore();
  } else {
    // Circle with glow
    const s = p.size * dpr;
    ctx.beginPath();
    ctx.arc(p.x * dpr, p.y * dpr, s, 0, Math.PI * 2);
    ctx.fillStyle = `rgb(${p.r}, ${p.g}, ${p.b})`;
    ctx.fill();
  }
}

// ── Main update (called from shared rAF loop) ──
export function updateParticles(timestamp) {
  if (!canvas || !ctx) return;

  // Reset spawn timers after long gap (e.g. tab was hidden) to prevent burst
  if (timestamp - lastSporeTime > 2000) {
    lastSporeTime = timestamp;
    lastRuneTime = timestamp;
    lastWispTime = timestamp;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = 'screen';

  // Spawn spores (time-based: rate in ms, normalized to 60fps frame counts)
  const sporeRateMs = Math.max(5, 30 - madnessTier * 6) * (1000 / 60);
  if (timestamp - lastSporeTime >= sporeRateMs) {
    spawnSpore();
    lastSporeTime = timestamp;
  }

  // Spawn runes at tier 2+
  if (madnessTier >= 2) {
    const runeRateMs = Math.max(30, 80 - madnessTier * 12) * (1000 / 60);
    if (timestamp - lastRuneTime >= runeRateMs) {
      spawnRune();
      lastRuneTime = timestamp;
    }
  }

  // Spawn wisps at tier 3+
  if (madnessTier >= 3) {
    const wispRateMs = Math.max(40, 100 - madnessTier * 15) * (1000 / 60);
    if (timestamp - lastWispTime >= wispRateMs) {
      spawnWisp();
      lastWispTime = timestamp;
    }
  }

  // Update & render
  for (const p of particles) {
    if (!p.active) continue;
    updateParticle(p);
    if (p.active) renderParticle(p);
  }

  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
}

// ── Resize ──
function resize() {
  if (!canvas) return;
  dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
}

// ── Madness subscription ──
function onMadnessUpdate(data) {
  madnessTier = data.tier;
  madnessIntensity = data.intensity;

  // Spawn sparks on damage/crit events
  if (data.eventType === 'damage' || data.eventType === 'critFail') {
    spawnSparks(mouseX, mouseY, 15 + madnessTier * 5);
  }
}

// ── Init ──
export function initParticles() {
  canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  ctx = canvas.getContext('2d', { willReadFrequently: false });
  resize();

  // Pre-allocate pool
  for (let i = 0; i < MAX_PARTICLES; i++) {
    particles.push(createParticle());
  }

  // Track mouse for wisps and sparks
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  // Resize handler
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resize, 250);
  });

  // Subscribe to madness
  onMadnessChange(onMadnessUpdate);
  const m = getMadness();
  madnessTier = m.tier;
  madnessIntensity = m.intensity;
}
