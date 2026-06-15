# Orvio Rebuild Plan (revised)

Rebuild Orvio into a premium SaaS experience. Three portals plus a public marketing site, all clickable with mock data. Inspired by SaaSSpace (marketing only) and ClientHub (client portal layout only). Tone: Vercel / Mercury / Linear.

## Structure

1. **Public Marketing Website** — SaaSSpace visual direction
2. **Master Admin Portal** — Orvio internal team
3. **Agency Portal** — main paid product; **Content Studio is a module inside it** at `/app/studio/*`
4. **Client Portal** — contractor-facing, ClientHub layout inspiration only

## Build priority (depth-of-polish order)

1. Marketing homepage
2. Agency Portal overview
3. Agency Ad Reporting (strongest product screen)
4. Client Portal overview
5. Content Studio (Ads tab, Ad Builder, Brand Memory, approvals)
6. Master Admin Portal (functional, lighter polish)
7. Secondary pages (leads, pipeline, messages, payments, reports, white-label, marketing sub-pages)

## Design system

- Tailwind v4 tokens in `src/styles.css`
- Near-white surfaces (`#FAFAFA`), near-black text, restrained indigo/violet accent
- Rounded-2xl cards, soft shadows, generous whitespace, strong typography (Geist/Inter Display + Inter)
- Recharts, lucide-react, shadcn primitives, status badges
- Shared shells: `MarketingShell`, `AdminShell`, `AgencyShell`, `ClientShell` — responsive
- Mock data in `src/mock/` (agencies, clients, campaigns, leads, invoices, content, brand memory)

## Route map

```text
/                          Marketing home
/product /solutions
/pricing /demo /book-demo /login

/admin                     Overview
/admin/agencies            Agency accounts
/admin/agencies/$id        Agency detail
/admin/billing /admin/integrations /admin/settings

/app                       Agency overview
/app/clients               List + create modal
/app/clients/$id           Client detail
/app/reporting             Ad reporting (priority screen)
/app/leads /app/pipeline /app/messages /app/payments
/app/studio                Studio home (tabs)
/app/studio/ads/new        Ad Builder
/app/studio/brand/$id      Brand Memory
/app/reports
/app/settings/white-label

/portal                    Client overview (ad-perf focused)
/portal/campaigns          Meta/Google tabs
/portal/leads /portal/messages
/portal/approvals          Content approval flow
/portal/payments /portal/reports
```

## Screen-level details

**Marketing home (SaaSSpace inspired):** sticky navbar (Product, Solutions, Pricing, Demo, Login, Book Demo), hero headline + sub + dual CTA, large dashboard mockup, trust row, problem → solution, six product sections with screenshots (White-label portals, Meta/Google reporting, Lead tracking, Onboarding, Content Studio, Payments/Financing), pricing 3 tiers + enterprise, FAQ, final CTA, footer.

**Agency overview:** active clients, total ad spend, leads generated, avg CPL, avg CPC, avg CTR, conversion rate, open leads, follow-up rate, revenue tracked, churn risk; recent activity feed; per-client snapshot grid.

**Agency Ad Reporting (priority):** filters for client, date range, Meta/Google platform. KPI strip: spend, leads, CPL, CPC, CTR, CPM, impressions, clicks, conversion rate. Trend chart (spend vs leads). Campaign comparison table. Best/worst campaign cards. AI-style insight summary with mock narrative ("Roof Replacement Campaign drove 38% of leads at $52 CPL — scale budget +20%").

**Client Portal overview (contractor-friendly, ad-perf focused):** KPI cards — this month's ad spend, leads generated, cost per lead, booked appointments, calls/messages, CTR, campaign status, pending content approvals, latest agency recommendation. Each marketing term gets a one-line plain-English helper ("CTR — how often people clicked your ad after seeing it"). Recent leads list, agency update card.

**Content Studio:** client selector in header, tabs (Ads, Social Posts, Landing Pages, Emails, Reports, Brand Assets), status filters (Draft, In Review, Approved, Scheduled, Published), asset grid, right-side AI assistant panel with mock prompts/responses.

**Ad Builder:** form (client, platform, objective, service, offer, location, pain point, audience, tone, CTA) → generated primary text / headline / description / CTA variations + creative notes + landing page angle + compliance warning. Live Meta feed-ad preview card and Google search-ad preview card.

**Brand Memory:** per-client editor — description, services, service areas, offers, tone, testimonials, before/after photos, objections, approved claims, words to avoid, competitors, agency notes.

**Client Approvals:** pending/approved/changes-requested columns, asset preview, comment box, approve / request-changes buttons.

**Master Admin:** total agencies, total client accounts, total ad spend tracked, total leads, avg CPL, MRR, churn-risk; agencies table with subscription, white-label domain, Stripe, Meta/Google health.

## Mock data anchors

Clients: Hartland Plumbing, Northside Roofing, Apex Remodeling, Brighton HVAC Pros, Lakeside Electric.
Campaigns: Emergency Plumbing Leads, Kitchen Remodel Estimate Requests, Roof Replacement Campaign, HVAC Tune-Up Offer, Electrical Panel Upgrade Leads.
Metrics: Spend $4,280 · Leads 63 · CPL $67.94 · CPC $3.21 · CTR 2.8% · 148.2K impressions · 4,150 clicks · 12.6% conversion.

## Technical notes

- TanStack Start file-based routes, flat dot convention
- Layout routes (`app.tsx`, `portal.tsx`, `admin.tsx`) render `<Outlet />`
- Each route exports unique `head()` meta; og:image only at leaves with hero imagery
- Recharts for charts; shadcn Dialog/Sheet for modals/drawers; shadcn Table for tables
- No auth, no server functions, no real integrations — login decorative
- Existing `/signup`, `/portal-preview`, `/demo`, `/pricing` are replaced/repurposed; index hero rebuilt
- Reasonable SaaS defaults applied throughout — no blocking questions

## Out of scope

Real Meta/Google/Stripe integrations, auth, persistence, AI generation, email/SMS.
