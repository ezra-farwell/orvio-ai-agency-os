# Orvio — Full Marketing Site, Demo, Pricing, Signup, Portal Preview

A complete dark-themed, deploy-ready multi-page site built to the exact spec. No vibe-coded shortcuts: every section uses real copy, custom CSS/HTML mockups (no stock images), and considered motion. Interactive demo runs entirely client-side.

## Stack adaptation

Spec calls for `react-router-dom`; this project uses **TanStack Start** with file-based routing under `src/routes/`. I'll use TanStack `<Link>` + per-route `head()` for unique SEO meta. Framer Motion handles all animation. No backend calls anywhere.

## Routes

```text
src/routes/
  __root.tsx           → loads fonts, wraps everything in <Nav /> + <Footer />
  index.tsx            → / — 14-section landing
  demo.tsx             → /demo — full Studio + Structure/Landing/Audit tabs
  pricing.tsx          → /pricing — pricing + credit calculator
  signup.tsx           → /signup — split-layout form
  portal-preview.tsx   → /portal-preview — branded client portal
```

Each route ships unique `title`, `description`, `og:title`, `og:description`.

## Design tokens (added to `src/styles.css` via `@theme inline`)

- Colors: background `#0A0B0F`, surface `#13151F`, surface-elevated `#1C1F30`, border `#252840`, indigo `#6366F1`, amber `#D97706`, success `#10B981`, warning `#F59E0B`, danger `#EF4444`, text `#F1F5F9` / `#94A3B8` / `#475569`. Gradient indigo→violet→amber.
- Fonts loaded via Google Fonts `<link>` in `__root.tsx`: **Bricolage Grotesque 800** (display), **Inter 400/500/600/700** (body), **JetBrains Mono 400/500/600** (data).
- Custom utilities: `.text-gradient-orvio`, `.glow-indigo`, `.glow-amber`, `.surface-card`, `.surface-elev`, `.marquee`, `.pulse-amber`, `.grid-dots`.
- Dark-only (no toggle). Radius 12 cards, 8 buttons.

## Shared components — `src/components/orvio/`

- `primitives.tsx` — `Reveal` (IntersectionObserver via Framer `whileInView`), `CountUp` (rAF, eased), `StatusBadge`, `MetricCard`, `Diamond`, `Wordmark`.
- `Nav.tsx` — fixed, blur backdrop after 50px, mobile full-screen overlay, TanStack `<Link>`.
- `Footer.tsx` — three-column.
- `mockups.tsx` — `DashboardMockup` (hero, perspective tilt), `ReportMockup`, `ModelDropdownMockup`, `PortalMockup`. All pure CSS/HTML.
- `StudioDemo.tsx` — the full interactive brief→generate→cards flow with custom Dropdown, animated progress bar, per-card approve/reject states, success toast.

## Landing page — 14 sections, exact spec copy

1. **Nav** (fixed, blur on scroll).
2. **Hero** — staggered fade-up 3-line headline, eyebrow pill, subhead, two CTAs, proof row, tilted `DashboardMockup`.
3. **Social proof strip** — infinite-marquee industry list + CPL stat.
4. **Problem** — 2×3 card grid.
5. **Two Layers** — Client OS (indigo border) + Creative Studio (amber border), 8 bullets each.
6. **Interactive Demo** (`#demo`) — embedded `StudioDemo`.
7. **Three feature deep-dives** — alternating rows with `ReportMockup`, `ModelDropdownMockup`, `PortalMockup`.
8. **Stats strip** — four `CountUp` stats.
9. **Model marketplace** — 3×2 grid of 6 model cards with tier badges.
10. **Pricing** (`#pricing`) — monthly/annual toggle (20% off), 3 tier cards (Professional highlighted), 4 credit top-up packs row.
11. **Comparison table** — Orvio column highlighted indigo.
12. **FAQ** — 8 accordion items (shadcn `Accordion`).
13. **Final CTA** — gradient wash background, two CTAs.
14. **Footer**.

## /demo

Reuses `StudioDemo` and adds `Tabs` (shadcn) for **Creatives / Structure / Landing / Audit**, each with the exact content listed in the spec (campaign structure skeleton, generated landing page block, audit with 3 flags + 84/100 score). Bottom CTA → `/signup`.

## /pricing

Full pricing section + a **Credit Calculator** widget using shadcn `Slider`s: clients (1–20), briefs/client/mo (1–5), reports/client/mo (1), audits/client/mo (0–2), primary tier (Standard/Premium/Maximum). Recomputes monthly credit estimate live and compares against tier inclusion ("You're covered ✓" / "You'll need X more credits").

## /signup

Split 40/60. Left = value reminder (Wordmark + 3 proof bullets). Right = form (name, work email, password, agency name, client count select). React-only validation; submit shows inline "Account created (demo) — this is a UI preview" success state. No backend.

## /portal-preview

Simulated branded GrowthDesk portal: header, "Welcome back, Summit Roofing Co.", four plain-English metric cards, green health banner, recent reports list with Download PDF buttons (no-op), invoices list, bottom CTA back to `/signup`.

## Interactive demo state machine (client-only)

`useState` controls phase (`idle | generating | ready`), progress (rAF over 2.5s), four card states (`idle | approved | rejected`). Strategy + image model dropdowns update credit estimate live. Approving a card shows a toast bottom-right: "N of 4 approved · Push to Meta when ready →". Custom dropdown component avoids native `<select>` styling.

## Motion rules

- Hero stagger 60ms via Framer variants.
- Scroll reveals via `whileInView` + `viewport={{ once: true }}` (IntersectionObserver under the hood — never scroll listeners).
- Count-ups via rAF on first intersection.
- Nav backdrop transitions at `scrollY > 50`.
- No floating particles, mesh, or generic gradient blobs.

## Responsive

- 12-col grid, max-width 1200px.
- Section padding 120px desktop / 64px mobile.
- Mobile: stacks, hamburger nav overlay, demo cards scroll-snap horizontally on narrow viewports.
- Tested mentally at 375 / 768 / 1280 / 1920.

## Dependencies

- `framer-motion` (install via `bun add`).
- Everything else (Tailwind v4, shadcn Accordion / Tabs / Slider, lucide-react, TanStack Router) already in template.

## Out of scope (per spec)

No blog, testimonials, team page, social links, cookie banner, chat widget, newsletter, stock photography, lorem ipsum, light mode.

## Deliverable

Five fully implemented routes with the exact spec copy, an interactive Studio demo, a live credit calculator, polished motion, and a custom dark visual system. Deploy-ready.
