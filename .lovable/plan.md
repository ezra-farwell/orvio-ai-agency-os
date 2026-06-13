# Orvio — Site-Wide Cohesion Pass

The home hero now has a strong identity (sky gradient, cyan outlined glyph, glass pill nav, monospace micro-labels). Right now the rest of the site doesn't match — the inner pages are dark-mode SaaS, the home is luminous and editorial. This pass aligns every route to one design language.

## Design language (locked)

Pulled from the sky hero + Skiff/Framer-906 references:

- **Surfaces**: light, atmospheric. Soft gradient washes (lavender → peach → cream) at section seams. Dark panels only for the product mockups themselves — never for whole sections.
- **Type scale**: Bricolage Grotesque, tight tracking, very large display sizes (clamp 56–96px on hero blocks). Monospace `[11px]/0.28em uppercase` for all eyebrow labels and section index numbers.
- **Section rhythm**: `01 — Studio`, `02 — Portal`, `03 — Pricing` index labels. Generous whitespace (160px+ vertical between sections at desktop).
- **Color**: cyan (#5EEAD4) + amber (#FBBF24) accents only. No purple/indigo gradients in copy. Glyph cyan stays the brand signal.
- **Motion**: slow draw-on (1.4–2s eased), 7s float on hero element, scroll-reveal `y: 24 → 0` with 0.8s ease. No bouncy springs, no parallax stacking.
- **Components**: glass pill = the universal CTA. Inline links use the `story-link` underline animation.

## Route-by-route changes

### `/` (index)
Hero already done. Below the fold, restructure into a Skiff-style scroll narrative:
- `01 — The Problem`: single-line headline + 6 problems as a horizontal scroll-snap rail (not a 3-col grid)
- `02 — Client OS`: split layout, big type left, PortalMockup right, sticky on scroll
- `03 — Creative Studio`: full-bleed StudioDemo with a sky-gradient backdrop band
- `04 — Models`: marketplace as a clean table, not cards
- `05 — Pricing`: 3 plans, lighter surfaces
- `06 — FAQ`: minimal accordion, no card chrome
- Final CTA: mini sky band echoing the hero

### `/demo`
Replace dark-mode tabs with a cinematic showcase: vertical scrollytelling. Each step (Brief → Generate → Approve → Push) gets a full viewport panel with the mockup pinned center and copy fading in. Same monospace eyebrow numbering.

### `/pricing`
Light atmospheric background. Hero pulls a smaller version of the sky gradient. Plan cards become tall vertical panels separated by hairlines instead of boxed cards. Credit calculator gets a glass-pill container matching the hero.

### `/signup`
Split-screen but the marketing side becomes the sky gradient with the glyph. Form side stays light/neutral. Mono labels on all inputs.

### `/portal-preview`
This is the *product showcase* — keep the dark dashboard chrome since it represents the actual product UI, but wrap it in a sky-band header announcing "What your clients see" with the same mono eyebrow + display headline.

### Shared chrome
- **Nav**: stays transparent-until-scroll. Add the monospace `ORVIO · AGENCY EDITION` lockup so it matches the hero corners on inner routes (hero corners hide it on `/`).
- **Footer**: drop the dark surface — use a thin sky-gradient band with mono links and a small cyan glyph echo.

## Technical details

- New shared primitives in `src/components/orvio/`:
  - `SectionIndex.tsx` — renders `01 — Label` mono eyebrow
  - `SkyBand.tsx` — reusable gradient section wrapper with optional cloud drift
  - `DisplayHeading.tsx` — locked clamp() type ramp
  - `ScrollPanel.tsx` — viewport-pinned scrollytelling panel for `/demo`
- Extend `src/styles.css`: add `--gradient-sky-soft` (lighter variant for inner pages), `.sky-band` utility, `.story-link` underline utility, mono eyebrow utility.
- Refactor `src/routes/index.tsx` sections to use `SectionIndex` + `SkyBand`.
- Rewrite `src/routes/demo.tsx` as scrollytelling.
- Rework `src/routes/pricing.tsx`, `signup.tsx`, `portal-preview.tsx` to the new surface system.
- Update `Nav.tsx` and `Footer.tsx` to the unified chrome.
- Remove now-unused dark-card styling paths; keep `surface-card` for product mockups only.
- Typecheck after each file batch.

## Out of scope

- No new product features or content copy beyond what's already written.
- No backend, no auth, no data wiring.
- No new fonts or asset generation — sticking with Bricolage + Inter + JetBrains Mono already loaded.

Approve and I'll execute the whole pass in one batch.