import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight, Check, Palette, BarChart3, Inbox, FileCheck,
  Phone, MessageCircle, CreditCard, Sparkles,
} from "lucide-react";
import { MarketingShell } from "@/components/shells/MarketingShell";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Orvio — Branded client portals for ad agencies" },
      { name: "description", content: "Orvio is the white-label client portal and reporting OS for agencies running Meta and Google ads for local service businesses." },
      { property: "og:title", content: "Orvio — Branded client portals for ad agencies" },
      { property: "og:description", content: "Give every ad client a branded portal that proves your agency's work." },
    ],
  }),
});

function Home() {
  return (
    <MarketingShell>
      <Hero />
      <BeforeAfter />
      <MobileShowcase />
      <Features />
      <Pricing />
      <FAQ />
      <FinalCTA />
    </MarketingShell>
  );
}

/* ------------------------------------------------------------------ */
/*  Brand marks                                                        */
/* ------------------------------------------------------------------ */

function MetaMark({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" className={className} aria-label="Meta">
      <defs>
        <linearGradient id="mG" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#0064E1" />
          <stop offset="100%" stopColor="#19AFFF" />
        </linearGradient>
      </defs>
      <path fill="url(#mG)" d="M6.4 22.7c0 2 .9 3.5 2.4 3.5 1.2 0 2-.6 3.7-3.1L14.9 19c2.6-4.1 4-6.3 6.6-6.3 2.5 0 4.5 1.8 5.8 5l-1.7 1c-.9-2.3-2.2-3.5-3.8-3.5-1.6 0-2.7 1.2-4.7 4.4l-2.4 3.8c-2 3.1-3.7 4.4-6 4.4-3 0-4.9-2.4-4.9-6.2 0-5.7 3.8-11 8.6-11 2.3 0 4.3 1.1 6 3l-1.3 1.5c-1.5-1.5-3-2.4-4.7-2.4-3.2 0-6 4-6 8.5l.1 1.5z" />
    </svg>
  );
}

function GoogleMark({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-label="Google">
      <path fill="#4285F4" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.8 2.7 30.3.5 24 .5 14.8.5 6.9 5.8 3.1 13.4l7.8 6.1C12.7 13.7 17.9 9.5 24 9.5z" />
      <path fill="#34A853" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.6-4.9 7.3l7.6 5.9c4.4-4.1 7.1-10.1 7.1-17.7z" />
      <path fill="#FBBC05" d="M10.9 28.4c-.5-1.5-.8-3-.8-4.6s.3-3.1.8-4.6l-7.8-6.1C1.4 16.6.5 20.2.5 24s.9 7.4 2.6 10.5l7.8-6.1z" />
      <path fill="#EA4335" d="M24 47.5c6.3 0 11.6-2.1 15.4-5.7l-7.6-5.9c-2.1 1.4-4.8 2.3-7.8 2.3-6.1 0-11.3-4.2-13.1-9.9l-7.8 6.1C6.9 42.2 14.8 47.5 24 47.5z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section className="hero-bg relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="relative mx-auto max-w-[1180px] px-6 pb-20 pt-32 md:pt-40">
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="mx-auto max-w-[820px] text-center"
        >
          <h1 className="text-[40px] font-semibold leading-[1.04] tracking-[-0.035em] sm:text-[52px] md:text-[64px]">
            Give every ad client a branded portal that{" "}
            <span className="text-gradient-indigo">proves your work.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-[620px] text-[16px] leading-relaxed text-muted-foreground md:text-[17.5px]">
            The white-label client portal and reporting OS for agencies running Meta and Google ads for local service businesses.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/book-demo" className="inline-flex h-11 items-center gap-1.5 rounded-lg bg-foreground px-5 text-[14px] font-medium text-background hover:bg-foreground/90">
              Book a demo <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/product" className="inline-flex h-11 items-center gap-1.5 rounded-lg border border-border bg-background px-5 text-[14px] font-medium text-foreground hover:bg-[var(--surface-2)]">
              See the product
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }}
          className="relative mx-auto mt-16 max-w-[1080px]"
        >
          <HeroMockup />
          <p className="mt-4 text-center text-[11.5px] text-muted-foreground">
            Product screens shown with sample data.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function HeroMockup() {
  return (
    <div className="relative rounded-[20px] border border-border bg-background p-2 shadow-pop">
      <div className="overflow-hidden rounded-[14px] border border-border bg-[var(--surface-2)]/60">
        <div className="flex">
          <div className="hidden w-[210px] shrink-0 border-r border-border bg-background p-4 md:block">
            <div className="flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-md bg-foreground"><span className="h-1.5 w-1.5 rounded-full bg-background" /></span>
              <span className="text-[13px] font-semibold tracking-tight">Northstar</span>
            </div>
            <div className="mt-6 space-y-0.5 text-[12px]">
              {["Overview", "Clients", "Reporting", "Leads", "Approvals", "Invoices"].map((l, i) => (
                <div key={l} className={`flex items-center gap-2 rounded-md px-2 py-1.5 ${i === 2 ? "bg-[var(--surface-2)] font-medium text-foreground" : "text-muted-foreground"}`}>
                  <span className="h-1 w-1 rounded-full bg-current opacity-50" /> {l}
                </div>
              ))}
            </div>
          </div>

          <div className="min-w-0 flex-1 p-5 md:p-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Reporting · April</div>
                <div className="mt-0.5 truncate text-[17px] font-semibold tracking-tight">Hartland Plumbing</div>
              </div>
              <div className="flex shrink-0 items-center gap-1.5 text-[11.5px] text-muted-foreground">
                <MetaMark /> <span className="font-medium text-foreground">Meta</span>
                <span className="mx-1 text-border">·</span>
                <GoogleMark /> <span className="font-medium text-foreground">Google</span>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {[
                ["Spend", "$4,280"],
                ["Leads", "63"],
                ["CPL", "$67.94"],
                ["Booked", "18"],
              ].map(([l, v]) => (
                <div key={l} className="rounded-lg border border-border bg-background p-3">
                  <div className="text-[10.5px] text-muted-foreground">{l}</div>
                  <div className="mt-1 text-[18px] font-semibold tracking-tight">{v}</div>
                </div>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-[1.6fr_1fr]">
              <div className="rounded-lg border border-border bg-background p-4">
                <div className="flex items-center justify-between">
                  <div className="text-[12px] font-medium">Leads by week</div>
                  <div className="text-[11px] text-muted-foreground">Last 4 weeks</div>
                </div>
                <HeroChart />
              </div>
              <div className="rounded-lg border border-border bg-background p-4">
                <div className="text-[12px] font-medium">From your agency</div>
                <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">
                  Roof Replacement scaled this month — booked calls up 38% week over week.
                </p>
                <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-[var(--success-soft)] px-2 py-0.5 text-[10.5px] font-semibold text-[var(--success)]">
                  <span className="h-1 w-1 rounded-full bg-current" /> On track
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute -bottom-8 left-1/2 h-16 w-2/3 -translate-x-1/2 rounded-full bg-[var(--accent)]/15 blur-3xl" />
    </div>
  );
}

function HeroChart() {
  const data = [22, 28, 24, 31, 38, 34, 44, 48, 42, 52, 56, 61];
  const w = 100, h = 36;
  const max = Math.max(...data);
  const step = w / (data.length - 1);
  const line = data.map((p, i) => `${i === 0 ? "M" : "L"}${(i * step).toFixed(2)},${(h - (p / max) * h).toFixed(2)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-3 h-20 w-full">
      <defs>
        <linearGradient id="hG" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line} L${w},${h} L0,${h} Z`} fill="url(#hG)" />
      <motion.path d={line} fill="none" stroke="#4F46E5" strokeWidth="1.4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.3 }} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Before vs After                                                    */
/* ------------------------------------------------------------------ */

function BeforeAfter() {
  return (
    <section className="py-28 md:py-36">
      <div className="mx-auto max-w-[1040px] px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[32px] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[38px] md:text-[44px]">
            Clients churn when they can't see the work.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15.5px] leading-relaxed text-muted-foreground">
            You run the campaigns. They see scattered sheets, Looms, and Stripe links. Orvio puts everything in one branded place.
          </p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-background p-7">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Before Orvio</div>
            <p className="mt-3 text-[17px] font-semibold leading-snug tracking-[-0.01em]">
              Sheets, Looms, screenshots, Stripe links — approvals lost in email.
            </p>
            <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">
              Every client month is a new patchwork. By month three, they forget what they're paying for.
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--accent)]/30 bg-gradient-to-br from-[var(--accent-soft)] to-background p-7">
            <div className="text-[11px] uppercase tracking-wider text-[var(--accent)]">After Orvio</div>
            <p className="mt-3 text-[17px] font-semibold leading-snug tracking-[-0.01em]">
              One branded portal for leads, reports, approvals, and invoices.
            </p>
            <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">
              Clients log in, see what you delivered, and renew because the value is obvious.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Mobile portal — central, large                                     */
/* ------------------------------------------------------------------ */

function MobileShowcase() {
  return (
    <section className="hairline-t bg-[var(--surface-2)]/40 py-28 md:py-36">
      <div className="mx-auto max-w-[1180px] px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="chip">For contractors on the job</div>
          <h2 className="mt-3 text-[32px] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[38px] md:text-[44px]">
            Built for the phone in their truck.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15.5px] leading-relaxed text-muted-foreground">
            Plumbers, roofers, HVAC techs check the portal between jobs. Leads, approvals, and call shortcuts — exactly where they need them.
          </p>
        </div>

        <div className="mt-16 grid items-center gap-12 md:grid-cols-[1fr_1.05fr] md:gap-16">
          <ul className="space-y-5">
            {[
              ["Spend, leads & CPL at a glance", "What you invested in ads, how many leads came in, and what each one cost."],
              ["Booked appointments", "See which leads actually turned into work on the calendar."],
              ["Approvals in one tap", "Approve or request changes on ad copy without an email thread."],
              ["Call & text directly", "Tap a lead to call or text — no copying numbers between apps."],
              ["Monthly update from your agency", "A plain-English note on what changed and what's next."],
            ].map(([t, b]) => (
              <li key={t} className="flex gap-3">
                <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                  <Check className="h-3 w-3" />
                </span>
                <div>
                  <div className="text-[15px] font-semibold tracking-tight">{t}</div>
                  <div className="mt-0.5 text-[13.5px] leading-relaxed text-muted-foreground">{b}</div>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex justify-center md:justify-end">
            <BigPhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

function BigPhoneMockup() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-10 -z-10 rounded-[60px] bg-[var(--accent)]/10 blur-3xl" />
      <div className="w-[320px] rounded-[44px] border-[10px] border-foreground/90 bg-foreground/90 p-2 shadow-pop sm:w-[400px] md:w-[460px]">
        <div className="overflow-hidden rounded-[32px] bg-background">
          {/* Status bar */}
          <div className="flex items-center justify-between px-6 pt-3 pb-1 text-[11px] font-medium">
            <span>9:41</span>
            <span className="flex items-center gap-1 text-foreground/70">
              <span className="h-2 w-2 rounded-full bg-foreground/60" />
              <span className="h-2 w-2 rounded-full bg-foreground/60" />
              <span className="h-2.5 w-4 rounded-sm border border-foreground/60" />
            </span>
          </div>

          {/* Brand header */}
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-md bg-[var(--accent)] text-[12px] font-bold text-white">N</span>
              <div className="leading-tight">
                <div className="text-[13px] font-semibold">Northstar</div>
                <div className="text-[10.5px] text-muted-foreground">portal</div>
              </div>
            </div>
            <div className="grid h-8 w-8 place-items-center rounded-full bg-[var(--surface-2)] text-[11px] font-semibold">HP</div>
          </div>

          <div className="p-5">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Hartland Plumbing</div>
            <div className="mt-0.5 text-[20px] font-semibold tracking-tight">April performance</div>

            {/* Metrics grid */}
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              {[
                ["Spend", "$4,280", "Ad investment"],
                ["Leads", "63", "Form fills + calls"],
                ["CPL", "$67.94", "Cost per lead"],
                ["Booked", "18", "On the calendar"],
              ].map(([l, v, h]) => (
                <div key={l} className="rounded-xl border border-border bg-[var(--surface-2)]/40 p-3">
                  <div className="text-[10.5px] uppercase tracking-wider text-muted-foreground">{l}</div>
                  <div className="mt-1 text-[20px] font-semibold tracking-tight">{v}</div>
                  <div className="mt-0.5 text-[10px] text-muted-foreground">{h}</div>
                </div>
              ))}
            </div>

            {/* New lead card */}
            <div className="mt-4 rounded-xl border border-border bg-background p-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[13px] font-semibold">Brian Connors</div>
                  <div className="text-[11px] text-muted-foreground">Burst pipe · Detroit · 9:14am</div>
                </div>
                <span className="rounded-full bg-[var(--warning-soft)] px-2 py-0.5 text-[10px] font-semibold text-[var(--warning)]">New</span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-foreground text-[12px] font-medium text-background">
                  <Phone className="h-3.5 w-3.5" /> Call
                </button>
                <button className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-border text-[12px] font-medium">
                  <MessageCircle className="h-3.5 w-3.5" /> Text
                </button>
              </div>
            </div>

            {/* Approval row */}
            <div className="mt-3 rounded-xl border border-border bg-background p-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[13px] font-semibold">Awaiting your approval</div>
                  <div className="text-[11px] text-muted-foreground">Emergency Plumbing — primary v3</div>
                </div>
                <span className="rounded-full bg-[var(--accent-soft)] px-2 py-0.5 text-[10px] font-semibold text-[var(--accent)]">2</span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-[var(--success)] text-[12px] font-medium text-white">
                  <Check className="h-3.5 w-3.5" /> Approve
                </button>
                <button className="inline-flex h-9 items-center justify-center rounded-lg border border-border text-[12px] font-medium">
                  Request changes
                </button>
              </div>
            </div>

            {/* Agency note */}
            <div className="mt-3 rounded-xl border border-[var(--accent)]/30 bg-[var(--accent-soft)] p-3.5">
              <div className="text-[10.5px] uppercase tracking-wider text-[var(--accent)]">Update from Northstar</div>
              <p className="mt-1 text-[12.5px] leading-relaxed text-foreground/85">
                Roof Replacement scaled this month — booked calls up 38% week over week. CPL settled at $67.94.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Features — 5 items, one consistent style                           */
/* ------------------------------------------------------------------ */

function Features() {
  const items = [
    { icon: Palette, title: "White-label portal", body: "Your logo, your domain, your colors. Clients sign in to your software, not Orvio." },
    { icon: BarChart3, title: "Plain-English reporting", body: "Spend, leads, CPL, and CTR explained next to every number — for clients who don't speak ads." },
    { icon: Inbox, title: "Lead inbox", body: "Every form fill and inbound call in one place. Status, assign, follow up. Nothing lost." },
    { icon: FileCheck, title: "Approvals", body: "Clients approve creative inside the portal. No more email threads, no more guesswork." },
    { icon: CreditCard, title: "Invoices & payments", body: "Send invoices and collect payment in the same place clients see the work." },
  ];
  return (
    <section className="hairline-t py-28 md:py-36">
      <div className="mx-auto max-w-[1180px] px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[32px] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[38px] md:text-[44px]">
            One product. Five things your clients actually use.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            No bloat. No half-finished modules. Just what makes a contractor renew.
          </p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map(it => (
            <div key={it.title} className="rounded-2xl border border-border bg-background p-6 transition-shadow hover:shadow-soft">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
                <it.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-[16px] font-semibold tracking-tight">{it.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">{it.body}</p>
            </div>
          ))}
          <div className="flex flex-col justify-between rounded-2xl border border-dashed border-border bg-[var(--surface-2)]/40 p-6">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-background px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">
                <Sparkles className="h-3 w-3" /> Roadmap
              </div>
              <h3 className="mt-4 text-[16px] font-semibold tracking-tight">AI report summaries, brand memory & more</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
                Optional AI features, financing links, multi-brand white-label, contracts & e-sign, and API access — shipping through 2026.
              </p>
            </div>
            <Link to="/product" className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground hover:underline">
              See the roadmap <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Pricing                                                            */
/* ------------------------------------------------------------------ */

const tiers = [
  {
    name: "Starter",
    price: 97,
    sub: "Up to 3 clients · 1 seat",
    best: "Solo agencies starting with client portals",
    features: ["Branded client portal", "Reporting + lead inbox", "Monthly reports", "Email support"],
    pop: false,
  },
  {
    name: "Growth",
    price: 297,
    sub: "Up to 10 clients · 3 seats",
    best: "Agencies managing active client delivery",
    features: ["Everything in Starter", "Custom domain", "Approvals + invoices", "Priority support"],
    pop: true,
  },
  {
    name: "Pro",
    price: 497,
    sub: "Up to 25 clients · 8 seats",
    best: "Growing agencies that want more automation",
    features: ["Everything in Growth", "AI report summaries", "Client health signals", "Stripe Connect"],
    pop: false,
  },
];

function Pricing() {
  return (
    <section id="pricing" className="hairline-t py-28 md:py-36">
      <div className="mx-auto max-w-[1180px] px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[32px] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[38px] md:text-[44px]">
            Pricing
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
            Flat monthly pricing per agency. No per-client fees. 14-day trial on every plan.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {tiers.map(t => (
            <div key={t.name} className={`flex flex-col rounded-2xl border bg-background p-7 ${t.pop ? "border-foreground shadow-pop" : "border-border"}`}>
              <div className="flex items-center justify-between">
                <div className="text-[13px] font-medium text-muted-foreground">{t.name}</div>
                {t.pop && <span className="rounded-full bg-foreground px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-background">Popular</span>}
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-[40px] font-semibold tracking-[-0.02em]">${t.price}</span>
                <span className="text-[13px] text-muted-foreground">/mo</span>
              </div>
              <div className="mt-1 text-[13px] text-muted-foreground">{t.sub}</div>
              <p className="mt-4 text-[12.5px] leading-relaxed text-foreground/70">{t.best}</p>
              <Link to="/book-demo" className={`mt-6 flex h-10 items-center justify-center rounded-lg text-[13px] font-medium ${t.pop ? "bg-foreground text-background hover:bg-foreground/90" : "border border-border bg-background hover:bg-[var(--surface-2)]"}`}>
                Start 14-day trial
              </Link>
              <ul className="mt-6 space-y-2.5">
                {t.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-[13px]">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--accent)]" />
                    <span className="text-foreground/85">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-dashed border-border bg-background px-6 py-4">
          <div className="flex items-center gap-3">
            <Sparkles className="h-4 w-4 text-[var(--accent)]" />
            <div>
              <div className="text-[14px] font-semibold">Enterprise — custom</div>
              <div className="text-[12.5px] text-muted-foreground">50+ clients, SSO, custom onboarding, dedicated support.</div>
            </div>
          </div>
          <Link to="/book-demo" className="inline-flex h-9 items-center rounded-lg border border-border bg-background px-4 text-[13px] font-medium hover:bg-[var(--surface-2)]">
            Talk to sales <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  FAQ                                                                */
/* ------------------------------------------------------------------ */

function FAQ() {
  const faqs: [string, string][] = [
    ["Is Orvio actually white-label?", "Yes. Your logo, custom domain, brand color, and email sender. Clients never see Orvio branding."],
    ["Which ad platforms do you support?", "Meta Ads (Facebook + Instagram) and Google Ads — Search, Performance Max, and Demand Gen."],
    ["How does data come in today?", "Connect Meta and Google via OAuth where available, or import CSVs and enter spend manually. Direct API sync continues to expand."],
    ["Do you run the campaigns for us?", "No. Orvio is software. Your team runs the campaigns. Orvio is the operating system that makes delivering and reporting them easier."],
    ["What's on the roadmap?", "AI report summaries, brand memory, financing links, multi-brand white-label, contracts & e-sign, and API access are rolling out through 2026."],
  ];
  return (
    <section className="hairline-t py-28 md:py-36">
      <div className="mx-auto max-w-[820px] px-6">
        <h2 className="text-center text-[30px] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[36px]">Common questions</h2>
        <div className="mt-12 divide-y divide-border">
          {faqs.map(([q, a]) => (
            <details key={q} className="group py-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-[15px] font-medium">
                {q}
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 max-w-[680px] text-[13.5px] leading-relaxed text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Final CTA                                                          */
/* ------------------------------------------------------------------ */

function FinalCTA() {
  return (
    <section className="hairline-t hero-bg relative overflow-hidden py-28 md:py-36">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="relative mx-auto max-w-[860px] px-6 text-center">
        <h2 className="text-[34px] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[44px] md:text-[56px]">
          Give every client a portal that proves your work.
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-[15.5px] leading-relaxed text-muted-foreground">
          Built for agencies managing paid ads, reporting, and client delivery across local service accounts.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/book-demo" className="inline-flex h-11 items-center gap-1.5 rounded-lg bg-foreground px-5 text-[14px] font-medium text-background hover:bg-foreground/90">
            Book a demo <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/product" className="inline-flex h-11 items-center gap-1.5 rounded-lg border border-border bg-background px-5 text-[14px] font-medium hover:bg-[var(--surface-2)]">
            See the product
          </Link>
        </div>
      </div>
    </section>
  );
}
