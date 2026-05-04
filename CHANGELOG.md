# Changelog

All notable changes to `dnd` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project scaffolding.
- HP-based madness intensity floor: damage events now ratchet madness
  up to at least `(1 - hp/maxHp) * 100`, so a near-death character is
  guaranteed Singularity-tier madness regardless of how the damage
  was distributed.
- `'heal'` madness event: applying healing reduces intensity by
  `(amount / maxHp) * 30` — comparable to a short rest's 40% trim,
  so binding wounds calms the eldritch noise but doesn't replace
  resting. Only fires for actual HP gained (overheal at full HP is
  a no-op).

### Changed
- Damage event scaling factor bumped 40 → 100 so cumulative damage
  equal to maxHp produces full madness intensity (was capped at ~40%
  no matter how many hits you took).
- Xanthrid dismiss now preserves `clairvoyanceUsed` so dismiss/
  re-summon can't bypass the once-per-summon clairvoyance limit.
  Summon branch still resets the flag — a fresh summon gets a fresh
  charge.
- Madness toggle long-press handler tightened: `pointerleave` /
  `pointercancel` now abort the gesture, so press → drag off →
  release no longer fires the toggle.

### Fixed
- `initBeholder()` ReferenceError in `js/app.js` that silently broke
  the madness toggle, particle system, dice portal hook, localStorage
  → server madness migration, tentacle cursor zones, reality warp,
  collapsible panels, the shared rAF tick loop, and the deferred
  beholder init. The static import was removed in 6c10ae1 but the
  bare call site survived; deleted that line — beholder still inits
  via the dynamic-import `.then(...)` chain.
- Split-module-instance bug: ESM modules cache by URL including the
  query string, so `madness.js?v=4`, `?v=6`, and `?v=7` produced
  separate module instances each with their own `intensity` and
  `listeners` array. `beholder-3d.js` and `particles.js` were
  subscribed to one instance's listeners while `ui.js`/`rest.js`
  fired events into another, so the beholder never received madness
  updates and didn't scale with intensity. All live importers now
  align on `madness.js?v=8`.
