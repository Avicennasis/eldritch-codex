// Dice engine: roll logic, Lucky, animation

export function rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

export function rollDice(count, sides) {
  const results = [];
  for (let i = 0; i < count; i++) {
    results.push(rollDie(sides));
  }
  return results;
}

// Sorcerous Burst: exploding d8s (max extra = CHA mod = 4)
export function rollSorcerousBurst() {
  const results = [rollDie(8), rollDie(8)];
  let extras = 0;
  let i = 0;
  while (i < results.length && extras < 4) {
    if (results[i] === 8) {
      results.push(rollDie(8));
      extras++;
    }
    i++;
  }
  return results;
}

// Standard d20 roll with modifier
export function rollD20(modifier = 0) {
  const die = rollDie(20);
  return { die, modifier, total: die + modifier, nat20: die === 20, nat1: die === 1 };
}

// Advantage (Warcaster CON save, etc)
export function rollAdvantage(modifier = 0) {
  const d1 = rollDie(20);
  const d2 = rollDie(20);
  const best = Math.max(d1, d2);
  return { dice: [d1, d2], best, modifier, total: best + modifier, nat20: best === 20, nat1: best === 1 };
}

// Lucky: roll 2d20, pick best
export function rollLucky(modifier = 0) {
  const d1 = rollDie(20);
  const d2 = rollDie(20);
  const best = Math.max(d1, d2);
  const winner = d1 >= d2 ? 0 : 1;
  return { dice: [d1, d2], best, winner, modifier, total: best + modifier, nat20: best === 20, nat1: best === 1 };
}

// Damage roll: e.g., rollDamage(8, 6, 0) for 8d6 fireball
export function rollDamage(count, sides, modifier = 0) {
  const dice = rollDice(count, sides);
  const sum = dice.reduce((a, b) => a + b, 0);
  return { dice, sum, modifier, total: sum + modifier };
}

// Hit dice: 1d6+CON mod
export function rollHitDie(conMod = 2) {
  const die = rollDie(6);
  const total = Math.max(1, die + conMod);
  return { die, modifier: conMod, total };
}

// Healing Hands: PB d4s (Aasimar racial)
export function rollHealingHands(profBonus = 4) {
  const dice = rollDice(profBonus, 4);
  const total = dice.reduce((a, b) => a + b, 0);
  return { dice, total };
}

// Animation: rapid cycling for 600ms, then snap to result
const ANIM_DURATION = 600;
const ANIM_INTERVAL = 50;

// Track active intervals to prevent pile-up on rapid clicks
let activeRollInterval = null;
let activeLuckyInterval = null;

export function animateRoll(displayEl, finalValue, sides = 20) {
  if (activeRollInterval) clearInterval(activeRollInterval);
  return new Promise(resolve => {
    displayEl.classList.add('rolling', 'dice-rolling');
    displayEl.classList.remove('nat20', 'nat1');

    activeRollInterval = setInterval(() => {
      displayEl.textContent = rollDie(sides);
    }, ANIM_INTERVAL);

    setTimeout(() => {
      clearInterval(activeRollInterval);
      activeRollInterval = null;
      displayEl.classList.remove('rolling', 'dice-rolling');
      displayEl.textContent = finalValue;

      const container = displayEl.closest('.dice-display');
      if (container) {
        container.classList.add('flash');
        setTimeout(() => container.classList.remove('flash'), 600);
      }

      resolve();
    }, ANIM_DURATION);
  });
}

export function animateLucky(die1El, die2El, result) {
  if (activeLuckyInterval) clearInterval(activeLuckyInterval);
  return new Promise(resolve => {
    die1El.classList.remove('winner', 'loser');
    die2El.classList.remove('winner', 'loser');
    die1El.classList.add('dice-rolling');
    die2El.classList.add('dice-rolling');

    activeLuckyInterval = setInterval(() => {
      die1El.textContent = rollDie(20);
      die2El.textContent = rollDie(20);
    }, ANIM_INTERVAL);

    setTimeout(() => {
      clearInterval(activeLuckyInterval);
      activeLuckyInterval = null;
      die1El.classList.remove('dice-rolling');
      die2El.classList.remove('dice-rolling');
      die1El.textContent = result.dice[0];
      die2El.textContent = result.dice[1];

      if (result.winner === 0) {
        die1El.classList.add('winner');
        die2El.classList.add('loser');
      } else {
        die2El.classList.add('winner');
        die1El.classList.add('loser');
      }
      resolve();
    }, ANIM_DURATION);
  });
}

// ─── SVG Polyhedral Dice ─────────────────────────

// Polygon points for each die shape (centered in 60x60 viewBox)
const DIE_SHAPES = {
  4:  '30,4 56,52 4,52',                           // triangle (tetrahedron)
  6:  '30,2 56,16 56,44 30,58 4,44 4,16',          // hexagon (cube top-down)
  8:  '30,2 58,30 30,58 2,30',                      // diamond (octahedron)
  10: '30,2 54,22 48,56 12,56 6,22',               // pentagon (pentagonal trapezohedron)
  12: '30,2 52,12 58,36 42,56 18,56 2,36 8,12',    // heptagon (dodecahedron)
  20: '30,2 54,14 56,42 38,58 22,58 4,42 6,14',    // heptagon (icosahedron)
};

// Edge highlight lines for depth effect
const DIE_EDGES = {
  4:  ['30,4 30,52', '4,52 43,28'],
  6:  ['4,16 30,30 56,16', '30,30 30,58'],
  8:  ['2,30 58,30', '30,2 30,58'],
  10: ['6,22 48,56', '54,22 12,56', '30,2 30,36'],
  12: ['8,12 42,56', '52,12 18,56', '2,36 58,36'],
  20: ['6,14 38,58', '54,14 22,58', '4,42 56,42', '30,2 30,34'],
};

// Colors per die type (gradient stops)
const DIE_COLORS = {
  4:  ['#ef4444', '#991b1b'],  // red
  6:  ['#14b8a6', '#0f766e'],  // teal
  8:  ['#8b5cf6', '#5b21b6'],  // purple
  10: ['#f59e0b', '#92400e'],  // amber
  12: ['#10b981', '#047857'],  // emerald
  20: ['#06b6d4', '#0e7490'],  // cyan
};

export function createDieSVG(sides, value, size = 54) {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 60 60');
  svg.setAttribute('width', size);
  svg.setAttribute('height', size);
  svg.style.overflow = 'visible';

  const gradId = `dg${sides}-${Math.random().toString(36).slice(2, 6)}`;

  // Gradient
  const defs = document.createElementNS(ns, 'defs');
  const grad = document.createElementNS(ns, 'linearGradient');
  grad.id = gradId;
  grad.setAttribute('x1', '0%'); grad.setAttribute('y1', '0%');
  grad.setAttribute('x2', '100%'); grad.setAttribute('y2', '100%');
  const [c1, c2] = DIE_COLORS[sides] || DIE_COLORS[20];
  const s1 = document.createElementNS(ns, 'stop');
  s1.setAttribute('offset', '0%'); s1.setAttribute('stop-color', c1);
  const s2 = document.createElementNS(ns, 'stop');
  s2.setAttribute('offset', '100%'); s2.setAttribute('stop-color', c2);
  grad.appendChild(s1); grad.appendChild(s2);
  defs.appendChild(grad);

  // Drop shadow filter
  const filter = document.createElementNS(ns, 'filter');
  filter.id = gradId + 'sh';
  filter.setAttribute('x', '-20%'); filter.setAttribute('y', '-20%');
  filter.setAttribute('width', '140%'); filter.setAttribute('height', '140%');
  const shadow = document.createElementNS(ns, 'feDropShadow');
  shadow.setAttribute('dx', '0'); shadow.setAttribute('dy', '1');
  shadow.setAttribute('stdDeviation', '2');
  shadow.setAttribute('flood-color', c1); shadow.setAttribute('flood-opacity', '0.5');
  filter.appendChild(shadow);
  defs.appendChild(filter);
  svg.appendChild(defs);

  // Main polygon
  const poly = document.createElementNS(ns, 'polygon');
  poly.setAttribute('points', DIE_SHAPES[sides] || DIE_SHAPES[20]);
  poly.setAttribute('fill', `url(#${gradId})`);
  poly.setAttribute('stroke', 'rgba(255,255,255,0.25)');
  poly.setAttribute('stroke-width', '1.5');
  poly.setAttribute('filter', `url(#${gradId}sh)`);
  svg.appendChild(poly);

  // Edge highlight lines
  const edges = DIE_EDGES[sides] || [];
  for (const pts of edges) {
    const line = document.createElementNS(ns, 'polyline');
    line.setAttribute('points', pts);
    line.setAttribute('fill', 'none');
    line.setAttribute('stroke', 'rgba(255,255,255,0.12)');
    line.setAttribute('stroke-width', '0.8');
    svg.appendChild(line);
  }

  // Number text
  const text = document.createElementNS(ns, 'text');
  text.setAttribute('x', '30');
  text.setAttribute('y', sides === 4 ? '42' : '33');
  text.setAttribute('text-anchor', 'middle');
  text.setAttribute('dominant-baseline', 'central');
  text.setAttribute('font-family', "'DM Mono', monospace");
  text.setAttribute('font-weight', '700');
  const fontSize = value >= 10 ? '16' : '20';
  text.setAttribute('font-size', fontSize);
  text.setAttribute('fill', 'white');
  text.setAttribute('style', 'text-shadow: 0 1px 3px rgba(0,0,0,0.6);');
  // SVG doesn't support text-shadow, use a shadow text behind
  const shadow2 = document.createElementNS(ns, 'text');
  shadow2.setAttribute('x', '30');
  shadow2.setAttribute('y', sides === 4 ? '43' : '34');
  shadow2.setAttribute('text-anchor', 'middle');
  shadow2.setAttribute('dominant-baseline', 'central');
  shadow2.setAttribute('font-family', "'DM Mono', monospace");
  shadow2.setAttribute('font-weight', '700');
  shadow2.setAttribute('font-size', fontSize);
  shadow2.setAttribute('fill', 'rgba(0,0,0,0.5)');
  shadow2.textContent = value;
  svg.appendChild(shadow2);

  text.textContent = value;
  svg.appendChild(text);

  return svg;
}

export function animateDice(stage, diceSpec) {
  // diceSpec = [{sides, result}, ...]
  stage.textContent = '';
  stage.classList.add('active');

  // Limit visible dice for large rolls (e.g. 8d6 Fireball)
  const maxShow = 10;
  const shown = diceSpec.slice(0, maxShow);

  // Scale down dice when there are many so they fit in one row
  const baseSize = shown.length > 6 ? 32 : 44;
  const d20Size = shown.length > 6 ? 40 : 56;

  const dice = shown.map((spec, i) => {
    const size = spec.sides === 20 ? d20Size : baseSize;
    const svg = createDieSVG(spec.sides, spec.result, size);
    const wrapper = document.createElement('div');
    wrapper.className = 'die-svg';
    wrapper.style.setProperty('--tumble-delay', (i * 50) + 'ms');
    wrapper.appendChild(svg);
    stage.appendChild(wrapper);
    return wrapper;
  });

  // Trigger entrance animation
  requestAnimationFrame(() => {
    dice.forEach(d => d.classList.add('tumbling'));
  });

  return new Promise(resolve => {
    const totalTime = 900 + (shown.length * 50) + 50;
    setTimeout(() => {
      dice.forEach(d => {
        d.classList.remove('tumbling');
        d.classList.add('landed');
      });
      setTimeout(() => {
        stage.classList.remove('active');
        stage.textContent = '';
        resolve();
      }, 1200);
    }, totalTime);
  });
}

// Lucky: two d20s side by side, loser fades
export function animateLuckyDice(stage, result) {
  stage.textContent = '';
  stage.classList.add('active');

  const dice = result.dice.map((val, i) => {
    const svg = createDieSVG(20, val, 60);
    const wrapper = document.createElement('div');
    wrapper.className = 'die-svg';
    wrapper.style.setProperty('--tumble-delay', (i * 80) + 'ms');
    wrapper.appendChild(svg);
    stage.appendChild(wrapper);
    return { wrapper, index: i };
  });

  requestAnimationFrame(() => {
    dice.forEach(d => d.wrapper.classList.add('tumbling'));
  });

  return new Promise(resolve => {
    setTimeout(() => {
      dice.forEach(d => {
        d.wrapper.classList.remove('tumbling');
        d.wrapper.classList.add('landed');
        if (d.index === result.winner) {
          d.wrapper.classList.add('die-winner');
        } else {
          d.wrapper.classList.add('die-loser');
        }
      });
      setTimeout(() => {
        stage.classList.remove('active');
        stage.textContent = '';
        resolve();
      }, 1800);
    }, 1100);
  });
}
