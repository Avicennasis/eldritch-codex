# Eldritch Codex

A D&D 5e (2024) digital character sheet and session tracker with a Far Realm cosmic horror aesthetic. Pure HTML/CSS/JS — no frameworks, no build tools, no dependencies beyond Font Awesome (CDN).

Built for an Aasimar Aberrant Mind Sorcerer running *Icewind Dale: Rime of the Frostmaiden*, but the architecture is adaptable to other characters with some data editing.

![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

## Features

- **Hit Points** — damage/heal/temp HP with animated health bar, damage type dropdown with auto-resistance (half) and immunity (zero)
- **Ability Scores** — 3x2 grid with scores, modifiers, saves, and save breakdowns
- **Spell Slots** — 1st through 5th level with pip toggles, supports temporary slots above base max (Font of Magic)
- **Sorcery Points** — SP pool with +/- controls and SP-to-slot conversion (temporary slots vanish on long rest)
- **Psionic Sorcery** — cast Aberrant Mind spells using SP instead of spell slots
- **Dice Roller** — SVG polyhedral dice with tumble animations, saving throws, attack rolls (auto-roll damage, doubled on crit)
- **Spell Cards** — per-level tabs with short descriptions, expandable full text, "Show All" and "Expand All" toggles
- **Inventory** — items across 6 categories with quantity controls, collapsible headers, and an in-app Store for purchasing potions and spell scrolls
- **Companions** — Aberrant Spirit (Summon Aberration) with form selection, HP tracking, multiattack, and regeneration; familiar companion with spell tracking; Polymorph form tracker with beast stat blocks
- **Conditions & Exhaustion** — toggle grid for all 14 standard conditions + 6-level exhaustion track
- **Concentration** — active spell dropdown with Warcaster advantage on CON saves
- **Death Saves** — success/failure pip tracking
- **Roll Log** — timestamped history of all rolls (capped at 100)
- **Notes** — free-text textarea, persisted server-side
- **Madness Engine** — 5-tier horror escalation system with visual effects (reality warping, screen shake, hue shift, chromatic aberration)
- **Beholder Eye** — cursor-tracking SVG eye with pupil dilation, blink cycle, and slime trail
- **Particle System** — canvas-based spore/rune/wisp/portal particles, time-based spawning
- **Session Persistence** — all state saved to localStorage + optional PHP server backend
- **Mobile Responsive** — single-column layout at 900px, collapsible panels, touch-friendly targets
- **Accessibility** — aria-expanded on collapsible panels, aria-pressed on toggles, :focus-visible keyboard support

## Screenshot

<!-- TODO: add a screenshot -->

## Theme

Far Realm cosmic horror aesthetic:

- Toxic bioluminescent green (`#39ff14`) / Far Realm purple (`#9b30ff`) / psionic cyan (`#00e5ff`)
- 8 animated SVG tentacles with cursor-zone reactivity
- Floating spore particle field with madness-scaled runes and wisps
- feTurbulence grain overlay with soft-light blending
- Slime drip animations on panel edges
- Animated beholder eye that tracks the cursor
- Fonts: Uncial Antiqua / IM Fell English SC / Alegreya / Victor Mono

## Setup

### Static (no server persistence)

Open `index.html` in a browser. State saves to localStorage only — works fine for single-device use.

### With PHP backend

Serve the directory with Apache/Nginx + PHP. The included `api.php` provides a simple JSON read/write backend:

1. Ensure the `data/` directory exists and is writable by your web server user:
   ```bash
   mkdir -p data
   chown www-data:www-data data
   ```
2. The `data/.htaccess` file blocks direct HTTP access to the JSON files (Apache with `AllowOverride` enabled).
3. State auto-syncs to the server on every change.

### Customizing for your character

Character data lives in `js/data.js` — ability scores, spells, inventory items, and resource definitions are all defined there. `js/rest.js` handles short/long rest logic. Edit these to match your character.

## Architecture

```
dnd/
├── index.html          # Structure and layout
├── api.php             # Server-side persistence (reads/writes JSON by key)
├── data/               # Server-persisted JSON (web server writable)
│   ├── .htaccess       # Deny direct HTTP access
│   ├── state.json      # Runtime game state (gitignored)
│   └── madness.json    # Madness tier state (gitignored)
├── css/
│   ├── theme.css       # Design tokens, typography, background layers
│   ├── layout.css      # Grid system, responsive breakpoints
│   ├── components.css  # Panels, buttons, modals, spell cards, inventory
│   ├── dice.css        # 3D dice stage and animations
│   ├── effects.css     # Spores, grain, glow effects
│   └── eldritch.css    # Madness visual effects (warping, aberration)
├── js/
│   ├── app.js          # Entry point — wires modules, rAF loop, tentacle zones
│   ├── data.js         # Static character data, spells, inventory definitions
│   ├── state.js        # localStorage + server persistence, state management
│   ├── ui.js           # DOM rendering, event binding, panel updates
│   ├── dice.js         # Dice rolling logic, SVG animations
│   ├── rest.js         # Short rest / long rest logic
│   ├── log.js          # Roll log management
│   ├── spelltext.js    # Full spell description HTML
│   ├── madness.js      # Horror escalation engine
│   ├── particles.js    # Canvas particle system
│   └── eldritch-eye.js # Animated beholder eye
├── img/
│   ├── favicon.svg
│   └── tentacle-border.svg
└── docs/               # Reference documents (species, spells, items, etc.)
```

All JS uses ES modules with `?v=N` cache-bust params. When editing a JS file, bump its version in all files that import it.

## License

[MIT](LICENSE) — Léon "Avic" Simmons
