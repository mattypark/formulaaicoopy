# formulaaicoopy

A from-scratch rebuild of the **fourmula.ai** landing page as a motion/layout study.

The goal is 1:1 fidelity on the things that are hard: grid, spacing, type scale, the light/dark
theme system, and every one of the ~17 animations — the preloader counter, the word-by-word hero
flash, the counter-rotating photo ring, the morphing menu pill, and the four pinned gradient slides
that tilt back into 3D as you scroll.

## What is and isn't here

| | |
|---|---|
| **Rebuilt 1:1** | layout, grid, spacing, type scale, theme tokens, every animation and its exact timing/easing |
| **Placeholders** | all imagery (exact intrinsic dimensions, so nothing reflows), the logo mark, and body copy (same string lengths, so line-wrap matches) |

Drop your own assets into `assets/` and your own copy into `index.html` — the layout does not move.

## Stack

Deliberately matches the original's shape: static HTML, hand-written CSS, vanilla ES modules.

- **GSAP 3.12.5** + ScrollTrigger + ScrambleTextPlugin
- **SplitType** for character-level hover effects
- Native scroll (no smooth-scroll library — the original doesn't use one)
- No build step, no framework, no bundler

## Run

```bash
python3 -m http.server 5180
open http://localhost:5180
```

## Layout

```
index.html          all 11 sections
css/
  tokens.css        design tokens, light/dark themes, responsive type scale
  base.css          reset + u-* utility classes
  *.css             one file per section
js/
  main.js           entry point
  *.js              one module per animation system
assets/placeholders/
```

## Notes

- Theme, preloader-seen state, and user zoom all persist to `localStorage`.
- `prefers-reduced-motion: reduce` disables autoplay video and the infinite marquees.
- Breakpoints: **991px** (tablet) and **767px** (mobile).
