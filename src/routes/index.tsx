import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { MarketingShell } from "@/components/shells/MarketingShell";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Orvio, white-label client portals for ad agencies" },
      { name: "description", content: "Orvio is the white-label client portal and reporting platform for agencies running Meta and Google ads for local service businesses." },
      { property: "og:title", content: "Orvio, white-label client portals for ad agencies" },
      { property: "og:description", content: "One branded place for ad reporting, leads, approvals, invoices, and monthly updates." },
    ],
  }),
});

function Home() {
  return (
    <MarketingShell>
      <Hero />
      <Problem />
      <CoreProduct />
      <ProductTour />
      <WhiteLabel />
      <Pricing />
      <FAQ />
      <FinalCTA />
    </MarketingShell>
  );
}

/* ---------------- Brand marks ---------------- */

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

/* ---------------- Hero ---------------- */

function Hero() {
  return (
    <section className="relative overflow-hidden beam-bg">
      <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-16 px-6 pb-32 pt-44 md:grid-cols-[minmax(0,460px)_minmax(0,1fr)] md:gap-14 md:pb-40 md:pt-56 lg:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-[var(--surface)] px-3 py-1 text-[12px] text-foreground/90">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)] live-dot" />
            Now in private beta with 12 agencies
          </div>

          <h1 className="mt-8 text-[44px] font-semibold leading-[1.04] tracking-[-0.03em] text-foreground sm:text-[56px] md:text-[64px]">
            Client portals for ad agencies.
          </h1>

          <p className="mt-7 max-w-[440px] text-[16px] leading-[1.65] text-foreground/80">
            One branded place for reporting, leads, approvals, and invoices.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link to="/book-demo" className="inline-flex h-11 items-center gap-1.5 rounded-lg bg-foreground px-5 text-[13.5px] font-medium text-background hover:bg-foreground/90 transition-colors">
              Book a demo <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/product" className="inline-flex h-11 items-center gap-1.5 rounded-lg border border-border bg-[var(--surface)] px-5 text-[13.5px] font-medium text-foreground hover:bg-[var(--surface-2)] transition-colors">
              View product
            </Link>
          </div>

          <p className="mt-8 text-[12px] text-[var(--text-faint)]">Sample data shown. Real Meta and Google Ads connections.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.15 }}
          className="relative md:-mr-[140px] lg:-mr-[180px] xl:-mr-[220px]"
        >
          <HeroDashboard />
        </motion.div>
      </div>
    </section>
  );
}

function HeroDashboard() {
  return (
    <div className="relative rounded-[14px] border border-border bg-[var(--surface)] shadow-pop">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--surface-2)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--surface-2)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--surface-2)]" />
        </div>
        <div className="ml-3 text-[12px] text-foreground/70">Northstar · Agency portal</div>
        <div className="ml-auto flex items-center gap-2 text-[12px] text-foreground/75">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" /> Live
        </div>
      </div>

      <div className="p-7 md:p-9">
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--text-faint)]">Overview · April</div>
            <div className="mt-1.5 text-[22px] font-semibold tracking-tight">Portfolio health</div>
          </div>
          <div className="flex items-center gap-1.5 text-[12px] text-foreground/75">
            <MetaMark /> Meta <span className="text-foreground/40">·</span> <GoogleMark /> Google
          </div>
        </div>

        <div className="mt-8 grid grid-cols-3 divide-x divide-border rounded-xl border border-border">
          <StatusTile eyebrow="Lead flow" word="Good" tone="var(--success)" detail="+38% Hartland" />
          <StatusTile eyebrow="Spend pacing" word="Steady" tone="var(--accent)" detail="9 of 11 on budget" />
          <StatusTile eyebrow="Approvals" word="2 open" tone="var(--warning)" detail="Waiting on Apex" />
        </div>

        <div className="mt-10">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--text-faint)]">Leads generated</div>
              <div className="mt-2 flex items-baseline gap-2.5">
                <span className="text-[40px] font-semibold leading-none tracking-tight">847</span>
                <span className="text-[13px] text-[var(--success)]">+14.2%</span>
              </div>
            </div>
            <div className="text-[12px] text-foreground/70">Last 12 weeks</div>
          </div>
          <HeroChart />
        </div>
      </div>
    </div>
  );
}

function StatusTile({ eyebrow, word, tone, detail }: { eyebrow: string; word: string; tone: string; detail: string }) {
  return (
    <div className="px-5 py-5">
      <div className="text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--text-faint)]">{eyebrow}</div>
      <div className="mt-2 text-[24px] font-semibold leading-none tracking-tight">{word}</div>
      <div className="mt-4 flex items-center gap-2 text-[12.5px]">
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: tone }} />
        <span className="truncate text-foreground/80">{detail}</span>
      </div>
    </div>
  );
}

function HeroChart() {
  const data = [22, 28, 24, 31, 38, 34, 44, 48, 42, 52, 56, 61];
  const w = 100, h = 32;
  const max = Math.max(...data);
  const step = w / (data.length - 1);
  const line = data.map((p, i) => `${i === 0 ? "M" : "L"}${(i * step).toFixed(2)},${(h - (p / max) * h).toFixed(2)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="mt-4 h-20 w-full">
      <defs>
        <linearGradient id="hG" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#6366F1" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line} L${w},${h} L0,${h} Z`} fill="url(#hG)" />
      <motion.path d={line} fill="none" stroke="#818CF8" strokeWidth="1.2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2 }} />
    </svg>
  );
}

/* ---------------- Problem ---------------- */

function Problem() {
  return (
    <section className="hairline-t py-32 md:py-44">
      <div className="mx-auto max-w-[1180px] px-6">
        <div className="grid gap-16 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:gap-24">
          <div className="md:sticky md:top-28 md:self-start">
            <div className="text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--text-faint)]">The problem</div>
            <h2 className="mt-3 text-[32px] font-semibold leading-[1.08] tracking-[-0.025em] text-foreground md:text-[40px]">
              Clients churn when they can&apos;t see the work.
            </h2>
            <p className="mt-6 max-w-md text-[15.5px] leading-[1.7] text-foreground/80">
              Most agencies deliver across five tools. Clients only remember one — invoice day. Orvio puts everything in front of them, branded as you.
            </p>
          </div>

          <div className="border-t border-border">
            {[
              ["Reports", "Buried in Sheets, sent monthly."],
              ["Updates", "Looms that never get watched."],
              ["Approvals", "Email threads with screenshots."],
              ["Invoices", "Stripe link in a separate inbox."],
              ["Leads", "Forms, calls, texts — spread everywhere."],
            ].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[140px_1fr] items-center gap-4 border-b border-border py-6">
                <span className="text-[12px] font-medium uppercase tracking-[0.12em] text-foreground/70">{k}</span>
                <span className="text-[15px] text-foreground/85">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Core product — text only, hairline list ---------------- */

function CoreProduct() {
  const surfaces: [string, string, string][] = [
    ["Reporting", "Meta + Google in one view", "Spend, leads, and CPL explained in plain English — not a Sheets dump."],
    ["Lead inbox", "Form fills and calls in one place", "Status, assign, follow up. Clients see the same list you do."],
    ["Approvals", "Sign-off without an email thread", "Send creative for approval. Clients tap once, you keep moving."],
    ["Invoices", "Payment lives inside the portal", "Stripe Connect under your brand. No separate billing inbox."],
  ];
  return (
    <section className="hairline-t py-32 md:py-44">
      <div className="mx-auto max-w-[1180px] px-6">
        <div className="max-w-2xl">
          <div className="text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--text-faint)]">Core product</div>
          <h2 className="mt-3 text-[32px] font-semibold leading-[1.08] tracking-[-0.025em] md:text-[40px]">
            Four surfaces your clients actually open.
          </h2>
        </div>

        <div className="mt-20 border-t border-border">
          {surfaces.map(([label, title, body]) => (
            <div key={label} className="grid grid-cols-1 gap-6 border-b border-border py-10 md:grid-cols-[200px_minmax(0,1fr)] md:gap-16 md:py-12">
              <div className="text-[12px] font-medium uppercase tracking-[0.14em] text-foreground/75">{label}</div>
              <div>
                <h3 className="text-[22px] font-semibold leading-[1.2] tracking-tight md:text-[26px]">{title}</h3>
                <p className="mt-3 max-w-[520px] text-[15px] leading-[1.7] text-foreground/75">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Product tour ---------------- */

function ProductTour() {
  const steps: [string, string, string][] = [
    ["01", "Add a client", "Set their brand, domain, and which ad accounts to connect."],
    ["02", "Client signs in", "They open the portal at your domain — reports, leads, approvals, invoices, all in one place."],
    ["03", "Send the monthly update", "A clean PDF or shared link with what changed and what is next."],
  ];
  return (
    <section className="hairline-t py-32 md:py-44">
      <div className="mx-auto max-w-[1180px] px-6">
        <div className="max-w-2xl">
          <div className="text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--text-faint)]">Product tour</div>
          <h2 className="mt-3 text-[32px] font-semibold leading-[1.08] tracking-[-0.025em] md:text-[40px]">
            From new client to monthly report.
          </h2>
        </div>

        <div className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
          {steps.map(([n, title, body]) => (
            <div key={n} className="bg-[var(--surface)] p-10 md:p-12">
              <div className="mono text-[12px] text-[var(--text-faint)]">{n}</div>
              <h3 className="mt-6 text-[20px] font-semibold tracking-tight">{title}</h3>
              <p className="mt-3 text-[14px] leading-[1.7] text-foreground/75">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- White-label ---------------- */

function WhiteLabel() {
  const brands = [
    { brand: "Northstar", letter: "N", color: "#4F46E5", domain: "portal.northstar.io", line: "HVAC and plumbing in the Midwest." },
    { brand: "Tidewater", letter: "T", color: "#0EA5E9", domain: "clients.tidewater.co", line: "Coastal home services agency." },
    { brand: "Foundry", letter: "F", color: "#F97316", domain: "app.foundrylocal.com", line: "Remodelers and trades, nationwide." },
  ];
  return (
    <section className="hairline-t py-32 md:py-44">
      <div className="mx-auto max-w-[1180px] px-6">
        <div className="max-w-2xl">
          <div className="text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--text-faint)]">White-label</div>
          <h2 className="mt-3 text-[32px] font-semibold leading-[1.08] tracking-[-0.025em] md:text-[40px]">
            Your logo. Your domain. Your software.
          </h2>
          <p className="mt-6 max-w-lg text-[15.5px] leading-[1.7] text-foreground/80">
            Clients sign into your product at your domain. Orvio stays invisible.
          </p>
        </div>

        <div className="mt-20 grid gap-5 md:grid-cols-3">
          {brands.map(b => (
            <div key={b.brand} className="rounded-2xl border border-border bg-[var(--surface)] p-7">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-md text-[14px] font-bold text-white" style={{ background: b.color }}>{b.letter}</span>
                <div className="leading-tight">
                  <div className="text-[14px] font-semibold tracking-tight">{b.brand}</div>
                  <div className="mono text-[12px] text-foreground/65">{b.domain}</div>
                </div>
              </div>
              <p className="mt-6 text-[13.5px] leading-relaxed text-foreground/75">{b.line}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Pricing ---------------- */

const tiers = [
  {
    name: "Starter",
    price: 97,
    sub: "Up to 3 clients",
    best: "For solo agencies starting with client portals.",
    features: ["Branded client portal", "Reporting", "Lead inbox", "Monthly reports"],
    pop: false,
  },
  {
    name: "Growth",
    price: 297,
    sub: "Up to 10 clients",
    best: "For agencies managing active client delivery.",
    features: ["Everything in Starter", "Custom domain", "Approvals", "Invoices"],
    pop: true,
  },
  {
    name: "Pro",
    price: 497,
    sub: "Up to 25 clients",
    best: "For agencies that need advanced delivery tools.",
    features: ["Everything in Growth", "Client health signals", "Stripe Connect", "More team seats"],
    pop: false,
  },
];

function Pricing() {
  return (
    <section id="pricing" className="hairline-t py-32 md:py-44">
      <div className="mx-auto max-w-[1180px] px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--text-faint)]">Pricing</div>
          <h2 className="mt-3 text-[32px] font-semibold leading-[1.08] tracking-[-0.025em] md:text-[40px]">
            Flat pricing per agency.
          </h2>
          <p className="mx-auto mt-5 max-w-md text-[15px] leading-[1.7] text-foreground/80">
            No per-client fees. 14-day trial on every plan.
          </p>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {tiers.map(t => (
            <div key={t.name} className={`flex flex-col rounded-2xl border bg-[var(--surface)] p-7 ${t.pop ? "border-foreground" : "border-border"}`}>
              <div className="flex items-center justify-between">
                <div className="text-[13px] font-medium text-foreground/75">{t.name}</div>
                {t.pop && <span className="rounded-full bg-foreground px-2 py-0.5 text-[12px] font-semibold uppercase tracking-wider text-background">Popular</span>}
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-[40px] font-semibold tracking-[-0.02em]">${t.price}</span>
                <span className="text-[13px] text-foreground/70">/mo</span>
              </div>
              <div className="mt-1 text-[13px] text-foreground/70">{t.sub}</div>
              <p className="mt-4 text-[13px] leading-relaxed text-foreground/70">{t.best}</p>
              <Link to="/book-demo" className={`mt-6 flex h-10 items-center justify-center rounded-lg text-[13px] font-medium ${t.pop ? "bg-foreground text-background hover:bg-foreground/90" : "border border-border bg-[var(--surface)] hover:bg-[var(--surface-2)]"}`}>
                Start 14-day trial
              </Link>
              <ul className="mt-6 space-y-2.5">
                {t.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-[13px]">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-foreground/60" />
                    <span className="text-foreground/85">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-[var(--surface)] px-6 py-5">
          <div>
            <div className="text-[14px] font-semibold">Enterprise</div>
            <div className="text-[12.5px] text-foreground/70">For 50+ clients, SSO, API access, custom onboarding, and dedicated support.</div>
          </div>
          <Link to="/book-demo" className="inline-flex h-9 items-center rounded-lg border border-border bg-[var(--surface)] px-4 text-[13px] font-medium hover:bg-[var(--surface-2)]">
            Talk to sales <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */

function FAQ() {
  const faqs: [string, string][] = [
    ["Is Orvio white-label?", "Yes. Your logo, custom domain, brand color, and email sender. Clients never see Orvio branding."],
    ["Which ad platforms do you support?", "Meta Ads (Facebook and Instagram) and Google Ads, including Search, Performance Max, and Demand Gen."],
    ["How does data come in?", "Connect Meta and Google via OAuth where available, or import CSVs and enter spend manually."],
    ["Do you run the campaigns for us?", "No. Orvio is software. Your team runs the campaigns. Orvio is where you deliver and report on them."],
    ["What is client health?", "A simple signal showing which clients are trending up, flat, or at risk based on lead volume, CPL stability, and portal engagement."],
  ];
  return (
    <section className="hairline-t py-32 md:py-40">
      <div className="mx-auto max-w-[820px] px-6">
        <div className="text-center">
          <div className="text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--text-faint)]">FAQ</div>
          <h2 className="mt-3 text-[32px] font-semibold leading-[1.08] tracking-[-0.025em] md:text-[40px]">Common questions</h2>
        </div>
        <div className="mt-14 divide-y divide-border">
          {faqs.map(([q, a]) => (
            <details key={q} className="group py-6 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-[15px] font-medium">
                {q}
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-border text-foreground/70 transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 max-w-[680px] text-[14px] leading-[1.7] text-foreground/75">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Final CTA ---------------- */

function FinalCTA() {
  return (
    <section className="hairline-t relative overflow-hidden py-36 md:py-48">
      <div className="relative mx-auto max-w-[860px] px-6 text-center">
        <h2 className="text-[36px] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[48px] md:text-[58px]">
          A portal that looks like your agency built it.
        </h2>
        <p className="mx-auto mt-6 max-w-md text-[15.5px] leading-[1.7] text-foreground/80">
          One branded place for reports, leads, approvals, and invoices.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link to="/book-demo" className="inline-flex h-11 items-center gap-1.5 rounded-lg bg-foreground px-5 text-[14px] font-medium text-background hover:bg-foreground/90">
            Book a demo <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/product" className="inline-flex h-11 items-center gap-1.5 rounded-lg border border-border bg-[var(--surface)] px-5 text-[14px] font-medium hover:bg-[var(--surface-2)]">
            View product
          </Link>
        </div>
      </div>
    </section>
  );
}
