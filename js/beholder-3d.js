// Beholder 3D — WebGL cursor-tracking beholder with madness scaling
// Replaces 2D SVG eye with 3D model, retains behavioral quirks

import { onMadnessChange, getMadness } from './madness.js?v=6';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// ── Configuration ──
const CANVAS_SIZE = 900; // Viewport size for the beholder
const LERP_BASE = 0.06;
const TRAIL_INTERVAL = 80;
const MAX_TRAIL = 15;
const BLINK_DURATION = 200;
const BLINK_MIN = 3000;
const BLINK_MAX = 8000;

// Scale range: 30% at 0 madness → 100% at max madness
const SCALE_MIN = 0.3;
const SCALE_MAX = 1.0;

// ── State ──
let container = null;
let renderer = null;
let scene = null;
let camera = null;
let beholder = null;
let isLoaded = false;
let baseScale = 1; // Stored normalization scale

const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
const current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
const lastTrailPos = { x: 0, y: 0 };

let madnessTier = 0;
let madnessIntensity = 0;
let currentScale = SCALE_MIN;
let targetScale = SCALE_MIN;

let jitterX = 0;
let jitterY = 0;
let lastTrailTime = 0;
let trailElements = [];

// Blink state
let isBlinking = false;
let blinkProgress = 0;
let blinkTimeout = null;

// Bob animation
let bobTime = 0;

// ── Three.js Setup ──
function initThree() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 5.5;

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'low-power'
  });
  renderer.setSize(CANVAS_SIZE, CANVAS_SIZE);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  // Critical for proper texture colors
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  // Lighting - bright enough to show textures
  const ambient = new THREE.AmbientLight(0xffffff, 1.5);
  scene.add(ambient);

  const key = new THREE.DirectionalLight(0xffffff, 1.5);
  key.position.set(2, 3, 4);
  scene.add(key);

  const fill = new THREE.DirectionalLight(0xffffff, 0.8);
  fill.position.set(-2, 1, 3);
  scene.add(fill);

  return renderer.domElement;
}

function loadBeholder() {
  const loader = new GLTFLoader();

  loader.load('./assets/beholder.glb', (gltf) => {
    beholder = gltf.scene;

    // Center and scale the model
    const box = new THREE.Box3().setFromObject(beholder);
    const center = box.getCenter(new THREE.Vector3());
    beholder.position.sub(center);

    // Normalize size and store base scale
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    baseScale = 2.0 / maxDim; // Store for reuse in update loop
    beholder.scale.setScalar(baseScale * SCALE_MIN);

    // Rotate to face camera (no rotation needed - model already faces +Z)
    beholder.rotation.y = 0;

    scene.add(beholder);
    isLoaded = true;

    console.log('[Beholder3D] Model loaded');
  }, undefined, (err) => {
    console.error('[Beholder3D] Failed to load model:', err);
  });
}

// ── Blink (squish animation) ──
function doBlink(duration = BLINK_DURATION) {
  if (isBlinking || !beholder) return;
  isBlinking = true;
  blinkProgress = 0;

  const startTime = performance.now();
  const halfDuration = duration / 2;

  function animateBlink(timestamp) {
    const elapsed = timestamp - startTime;

    if (elapsed < halfDuration) {
      // Squish down
      blinkProgress = elapsed / halfDuration;
    } else if (elapsed < duration) {
      // Expand back
      blinkProgress = 1 - ((elapsed - halfDuration) / halfDuration);
    } else {
      blinkProgress = 0;
      isBlinking = false;
      return;
    }

    requestAnimationFrame(animateBlink);
  }

  requestAnimationFrame(animateBlink);
}

function scheduleBlink() {
  if (blinkTimeout) clearTimeout(blinkTimeout);

  // Blink rate increases with madness
  const minMs = madnessTier >= 3 ? 1500 : BLINK_MIN;
  const maxMs = madnessTier >= 3 ? 4000 : BLINK_MAX;
  const delay = minMs + Math.random() * (maxMs - minMs);

  blinkTimeout = setTimeout(() => {
    if (!beholder) return;

    // Occasional double blink at tier 4
    if (madnessTier >= 4 && Math.random() < 0.15) {
      doBlink(150);
      setTimeout(() => doBlink(150), 300);
    }
    // Occasional slow blink at high madness
    else if (madnessTier >= 3 && Math.random() < 0.2) {
      doBlink(600);
    } else {
      doBlink(BLINK_DURATION);
    }

    scheduleBlink();
  }, delay);
}

// ── Slime Trail (reuse existing CSS) ──
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

  container.parentElement.appendChild(drop);
  trailElements.push(drop);

  drop.addEventListener('animationend', () => {
    drop.remove();
    const idx = trailElements.indexOf(drop);
    if (idx >= 0) trailElements.splice(idx, 1);
  });

  while (trailElements.length > MAX_TRAIL) {
    const old = trailElements.shift();
    old.remove();
  }
}

// ── Main Update Loop ──
export function updateBeholder(timestamp) {
  if (!isLoaded || !beholder || !renderer || !container) return;

  // Hide when madness is suppressed
  const suppressed = document.body.classList.contains('madness-suppressed');
  container.style.display = suppressed ? 'none' : 'block';
  if (suppressed) return;

  // Lerp speed scales with madness
  const currentLerp = LERP_BASE + madnessTier * 0.025;

  // Jitter at tier 3+
  if (madnessTier >= 3) {
    const jitterIntensity = madnessTier >= 4 ? 3 : 1.5;
    jitterX += (Math.random() - 0.5) * jitterIntensity;
    jitterY += (Math.random() - 0.5) * jitterIntensity;
    jitterX *= 0.9;
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

  // Position container (offset so it's beside cursor)
  const posX = current.x + 40 + jitterX;
  const posY = current.y - 40 + jitterY;
  container.style.transform = `translate3d(${posX - CANVAS_SIZE/2}px, ${posY - CANVAS_SIZE/2}px, 0)`;

  // Smooth scale interpolation
  targetScale = SCALE_MIN + (madnessIntensity / 100) * (SCALE_MAX - SCALE_MIN);
  currentScale += (targetScale - currentScale) * 0.05;

  // Apply scale with blink squish
  const blinkSquish = 1 - (blinkProgress * 0.6); // Squish to 40% at peak
  beholder.scale.setScalar(baseScale * currentScale);
  beholder.scale.y *= blinkSquish;

  // Rotate to look toward cursor (relative to center of canvas)
  const lookX = (target.x - posX) / window.innerWidth;
  const lookY = (target.y - posY) / window.innerHeight;

  // Rotate toward cursor - dramatic movement to show 3D depth
  beholder.rotation.x = -lookY * 2.5;
  beholder.rotation.y = lookX * 3.0;
  beholder.rotation.z = -lookX * 0.8; // Roll for organic feel

  // Gentle bob animation
  bobTime += 0.02;
  beholder.position.y = Math.sin(bobTime) * 0.1;

  // Slime trail
  if (timestamp - lastTrailTime > TRAIL_INTERVAL) {
    const dx = current.x - lastTrailPos.x;
    const dy = current.y - lastTrailPos.y;
    if (dx * dx + dy * dy > 25) {
      spawnTrailDrop(posX, posY + CANVAS_SIZE * 0.4);
      lastTrailPos.x = current.x;
      lastTrailPos.y = current.y;
      lastTrailTime = timestamp;
    }
  }

  // Render
  renderer.render(scene, camera);
}

// ── Madness Subscription ──
function onMadnessUpdate(data) {
  madnessTier = data.tier;
  madnessIntensity = data.intensity;
}

// ── Initialization ──
export function initBeholder() {
  // Don't init on narrow screens
  if (window.matchMedia('(max-width: 900px)').matches) return;

  container = document.getElementById('beholder-eye-container');
  if (!container) return;

  // Clear any existing content (2D eye)
  container.innerHTML = '';

  // Setup Three.js
  const canvas = initThree();
  canvas.style.pointerEvents = 'none';
  container.appendChild(canvas);

  // Style the container for 3D
  container.style.width = CANVAS_SIZE + 'px';
  container.style.height = CANVAS_SIZE + 'px';

  // Load the model
  loadBeholder();

  // Mouse tracking
  document.addEventListener('mousemove', (e) => {
    target.x = e.clientX;
    target.y = e.clientY;
  }, { passive: true });

  // Subscribe to madness
  onMadnessChange(onMadnessUpdate);
  const m = getMadness();
  madnessTier = m.tier;
  madnessIntensity = m.intensity;

  // Start blink cycle
  scheduleBlink();

  console.log('[Beholder3D] Initialized');
}

// ── Cleanup ──
export function destroyBeholder() {
  if (blinkTimeout) clearTimeout(blinkTimeout);
  if (renderer) {
    renderer.dispose();
    renderer = null;
  }
  if (scene) {
    scene.clear();
    scene = null;
  }
  beholder = null;
  isLoaded = false;
}
