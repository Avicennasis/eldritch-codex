# Contributing to Eldritch Codex

Thanks for considering a contribution. Bug reports, docs fixes, and small
improvements are all welcome.

## Dev setup

```bash
git clone https://github.com/Avicennasis/eldritch-codex.git
cd eldritch-codex
python3 -m http.server 8000   # or any static server
```

No build step and no dependencies — it is pure HTML/CSS/JS (Font Awesome is
loaded from a CDN). Open `http://localhost:8000/`.

## Code style

Plain ES modules under `js/`. Keep changes in the file that owns the concern
(`state.js` for state, `ui.js` for rendering, `madness.js` for the horror
escalation). Match the existing formatting.

## PR checklist

- [ ] Tested in a browser.
- [ ] `README.md` updated if public behavior changed.
- [ ] `CHANGELOG.md` entry added under `[Unreleased]`.
- [ ] Bumped the `?v=N` cache-busting query on any changed asset and its importers.

## Code of Conduct

Be respectful; assume good faith.
