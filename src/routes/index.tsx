import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight, Check, Phone, MessageCircle,
} from "lucide-react";
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
      <ClientPortalPhone />
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
      <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-14 px-6 pb-28 pt-36 md:grid-cols-[minmax(0,460px)_minmax(0,1fr)] md:gap-12 md:pb-36 md:pt-44 lg:gap-20">
        {/* Left: copy */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-[var(--surface)] px-3 py-1 text-[12px] text-foreground/90">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)] live-dot" />
            Now in private beta with 12 agencies
          </div>

          <h1 className="mt-7 text-[44px] font-semibold leading-[1.04] tracking-[-0.03em] text-foreground sm:text-[54px] md:text-[60px]">
            Client portals for ad agencies.
          </h1>

          <p className="mt-6 max-w-[460px] text-[16px] leading-[1.65] text-foreground/85 md:text-[16.5px]">
            One branded place for ad reporting, leads, approvals, invoices, and monthly updates — so clients can see what they are paying for.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/book-demo" className="inline-flex h-11 items-center gap-1.5 rounded-lg bg-foreground px-5 text-[13.5px] font-medium text-background hover:bg-foreground/90 transition-colors">
              Book a demo <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/product" className="inline-flex h-11 items-center gap-1.5 rounded-lg border border-border bg-[var(--surface)] px-5 text-[13.5px] font-medium text-foreground hover:bg-[var(--surface-2)] transition-colors">
              View product
            </Link>
          </div>

          <p className="mt-7 text-[12px] text-[var(--text-faint)]">Sample data shown throughout. Real Meta and Google Ads connections.</p>
        </motion.div>

        {/* Right: dashboard bleeding off the edge */}
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
      {/* top bar */}
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

      <div className="p-7 md:p-8">
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--text-faint)]">Overview · April</div>
            <div className="mt-1.5 text-[22px] font-semibold tracking-tight">Portfolio health</div>
          </div>
          <div className="flex items-center gap-1.5 text-[12px] text-foreground/75">
            <MetaMark /> Meta <span className="text-foreground/40">·</span> <GoogleMark /> Google
          </div>
        </div>

        {/* status group — one outer hairline container, dividers between tiles (no nested boxes) */}
        <div className="mt-7 grid grid-cols-3 divide-x divide-border rounded-xl border border-border">
          <StatusTile eyebrow="Lead flow" word="Good" tone="var(--success)" detail="+38% Hartland" />
          <StatusTile eyebrow="Spend pacing" word="Steady" tone="var(--accent)" detail="9 of 11 on budget" />
          <StatusTile eyebrow="Approvals" word="2 open" tone="var(--warning)" detail="Waiting on Apex" />
        </div>

        {/* hero number — flat, no nested card */}
        <div className="mt-8">
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

        {/* mini client row — top hairline only, no outer box */}
        <div className="mt-8 border-t border-border">
          {[
            ["Hartland Plumbing", "63", "$67.94", "good"],
            ["Coastal HVAC", "112", "$41.20", "good"],
            ["Apex Remodeling", "47", "$128.10", "watch"],
          ].map(([name, leads, cpl, tone], i, arr) => (
            <div key={name as string} className={`flex items-center py-3 text-[13px] ${i < arr.length - 1 ? "border-b border-border" : ""}`}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: tone === "good" ? "var(--success)" : "var(--warning)" }} />
              <span className="ml-3 flex-1 truncate font-medium text-foreground/95">{name}</span>
              <span className="mono w-12 text-right text-foreground/85">{leads}</span>
              <span className="mono w-20 text-right text-foreground/70">{cpl}</span>
            </div>
          ))}
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

/* ---------------- Problem (left-aligned, asymmetric) ---------------- */

function Problem() {
  return (
    <section className="hairline-t py-24 md:py-32">
      <div className="mx-auto max-w-[1180px] px-6">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:gap-16">
          <div className="md:sticky md:top-28 md:self-start">
            <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--text-faint)]">The problem</div>
            <h2 className="mt-3 text-[32px] font-semibold leading-[1.08] tracking-[-0.025em] text-foreground md:text-[40px]">
              Clients churn when they can&apos;t see the work.
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-[1.65] text-foreground/70">
              Most agencies deliver across five tools. Clients only remember one — invoice day. Orvio puts everything in front of them, branded as you.
            </p>
          </div>

          <div className="space-y-px overflow-hidden rounded-xl border border-border">
            {[
              ["Reports", "Buried in Sheets, sent monthly."],
              ["Updates", "Looms that never get watched."],
              ["Approvals", "Email threads with screenshots."],
              ["Invoices", "Stripe link in a separate inbox."],
              ["Leads", "Forms, calls, texts — spread everywhere."],
            ].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[120px_1fr] items-center bg-[var(--surface)] px-5 py-4">
                <span className="text-[12px] font-medium uppercase tracking-[0.1em] text-foreground/55">{k}</span>
                <span className="text-[14px] text-foreground/85">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Core product (bento, real UI) ---------------- */

function CoreProduct() {
  return (
    <section className="hairline-t py-24 md:py-32">
      <div className="mx-auto max-w-[1180px] px-6">
        <div className="max-w-2xl">
          <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--text-faint)]">Core product</div>
          <h2 className="mt-3 text-[32px] font-semibold leading-[1.08] tracking-[-0.025em] md:text-[40px]">
            Four surfaces your clients actually open.
          </h2>
          <p className="mt-4 max-w-lg text-[15px] leading-[1.65] text-foreground/70">
            Every tile below is the real component from the portal, just smaller. Nothing is a stock illustration.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-6 md:grid-rows-2">
          {/* Reporting — large */}
          <div className="md:col-span-4 md:row-span-1 rounded-2xl border border-border bg-[var(--surface)] p-6">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--text-faint)]">Ad reporting</div>
                <h3 className="mt-2 text-[19px] font-semibold tracking-tight">Spend, leads, CPL — explained.</h3>
                <p className="mt-2 max-w-sm text-[13.5px] leading-relaxed text-foreground/70">
                  Meta + Google rolled into one view, with plain-English notes from your team.
                </p>
              </div>
              <div className="hidden items-center gap-1.5 text-[11px] text-foreground/55 md:flex">
                <MetaMark /> Meta <span className="text-foreground/30">·</span> <GoogleMark /> Google
              </div>
            </div>
            <div className="mt-5 grid grid-cols-4 gap-2">
              {[["Spend", "$4,280"], ["Leads", "63"], ["CPL", "$67.94"], ["Booked", "18"]].map(([l, v]) => (
                <div key={l} className="rounded-lg border border-border bg-background p-3">
                  <div className="text-[10px] uppercase tracking-wider text-foreground/55">{l}</div>
                  <div className="mt-1 text-[17px] font-semibold tracking-tight">{v}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-lg border border-border bg-background p-3">
              <HeroChart />
            </div>
          </div>

          {/* Lead inbox — tall */}
          <div className="md:col-span-2 md:row-span-2 rounded-2xl border border-border bg-[var(--surface)] p-6">
            <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--text-faint)]">Lead inbox</div>
            <h3 className="mt-2 text-[19px] font-semibold tracking-tight">Form fills and calls, one place.</h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-foreground/70">
              Status, assign, follow up. Clients see the same list you do.
            </p>
            <div className="mt-5 space-y-2">
              {[
                ["Brian Connors", "Burst pipe, Detroit", "New", "warning"],
                ["Sarah Liu", "Roof inspection, Royal Oak", "Booked", "success"],
                ["Marcus T.", "AC install quote", "Contacted", "neutral"],
                ["Ana Reyes", "Drain backup, Ferndale", "New", "warning"],
              ].map(([name, ctx, status, tone]) => (
                <div key={name as string} className="rounded-lg border border-border bg-background p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-[12.5px] font-medium">{name}</span>
                    <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9.5px] font-semibold ${tone === "warning" ? "bg-[var(--warning-soft)] text-[var(--warning)]" : tone === "success" ? "bg-[var(--success-soft)] text-[var(--success)]" : "bg-[var(--surface-2)] text-foreground/70"}`}>
                      {status}
                    </span>
                  </div>
                  <div className="mt-1 text-[10.5px] text-foreground/55">{ctx}</div>
                </div>
              ))}
            </div>
          </div>

          {/* White-label — wide short */}
          <div className="md:col-span-2 rounded-2xl border border-border bg-[var(--surface)] p-6">
            <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--text-faint)]">White-label</div>
            <h3 className="mt-2 text-[17px] font-semibold tracking-tight">Your domain, your logo.</h3>
            <div className="mt-5 flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
              <span className="grid h-6 w-6 place-items-center rounded bg-[var(--accent)] text-[11px] font-bold text-white">N</span>
              <span className="mono text-[12px] text-foreground/85">portal.northstar.io</span>
              <span className="ml-auto chip-success !py-0.5">Live</span>
            </div>
          </div>

          {/* Approvals & invoices */}
          <div className="md:col-span-2 rounded-2xl border border-border bg-[var(--surface)] p-6">
            <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--text-faint)]">Approvals & invoices</div>
            <h3 className="mt-2 text-[17px] font-semibold tracking-tight">Sign-off and payment, in the portal.</h3>
            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2">
                <span className="text-[12px] font-medium">Creative — Primary v3</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--success-soft)] px-1.5 py-0.5 text-[9.5px] font-semibold text-[var(--success)]">
                  <Check className="h-2.5 w-2.5" /> Approved
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2">
                <span className="text-[12px] font-medium">Invoice · April</span>
                <span className="mono text-[12px] text-foreground/80">$2,400</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Product tour ---------------- */

function ProductTour() {
  const steps = [
    {
      n: "01",
      title: "Add a client",
      body: "Set their brand, domain, and which ad accounts to connect.",
      mock: (
        <div className="space-y-2.5">
          <Field label="Client name" value="Hartland Plumbing" />
          <Field label="Brand color" value="#4F46E5" swatch />
          <Field label="Portal domain" value="portal.northstar.io" />
        </div>
      ),
    },
    {
      n: "02",
      title: "Client views the portal",
      body: "They sign into your software. Reports, leads, approvals, invoices, all in one place.",
      mock: (
        <div className="space-y-2.5">
          <div className="grid grid-cols-3 gap-2">
            {[["Spend", "$4,280"], ["Leads", "63"], ["CPL", "$67"]].map(([l, v]) => (
              <div key={l} className="rounded-md border border-border bg-background p-2">
                <div className="text-[10px] text-muted-foreground">{l}</div>
                <div className="text-[14px] font-semibold tracking-tight">{v}</div>
              </div>
            ))}
          </div>
          <div className="rounded-md border border-border bg-background p-2.5">
            <div className="text-[11px] font-medium">Brian Connors</div>
            <div className="text-[10px] text-muted-foreground">Burst pipe, Detroit</div>
          </div>
        </div>
      ),
    },
    {
      n: "03",
      title: "Send the monthly report",
      body: "A clean PDF or shared link with what changed and what is next.",
      mock: (
        <div className="space-y-2">
          <div className="rounded-md border border-border bg-background px-3 py-2.5">
            <div className="text-[11px] font-semibold">April performance</div>
            <div className="text-[10px] text-muted-foreground">Sent to client, April 30</div>
          </div>
          <div className="rounded-md border border-border bg-[var(--surface-2)]/50 px-3 py-2 text-[10.5px] text-muted-foreground">
            Booked calls up 38% WoW. CPL settled at $67.94.
          </div>
        </div>
      ),
    },
  ];
  return (
    <section className="hairline-t py-24 md:py-32">
      <div className="mx-auto max-w-[1180px] px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground">Product tour</div>
          <h2 className="mt-3 text-[30px] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[36px] md:text-[42px]">
            From new client to monthly report.
          </h2>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {steps.map(s => (
            <div key={s.n} className="rounded-2xl border border-border bg-background p-6">
              <div className="text-[11px] font-mono text-muted-foreground">{s.n}</div>
              <h3 className="mt-2 text-[16px] font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{s.body}</p>
              <div className="mt-5 rounded-lg border border-border bg-[var(--surface-2)]/40 p-3">
                {s.mock}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Field({ label, value, swatch }: { label: string; value: string; swatch?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border bg-background px-2.5 py-2">
      <span className="text-[10.5px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="inline-flex items-center gap-1.5 text-[11.5px] font-medium">
        {swatch && <span className="h-3 w-3 rounded" style={{ background: value }} />}
        {value}
      </span>
    </div>
  );
}

/* ---------------- White-label ---------------- */

function WhiteLabel() {
  const brands = [
    {
      brand: "Northstar",
      letter: "N",
      color: "#4F46E5",
      domain: "portal.northstar.io",
      client: "Hartland Plumbing",
      tagline: "April performance",
      metrics: [["Leads", "63"], ["CPL", "$67"], ["Booked", "18"]] as const,
      note: "Roof Replacement scaled. Booked calls up 38% WoW.",
    },
    {
      brand: "Tidewater",
      letter: "T",
      color: "#0EA5E9",
      domain: "clients.tidewater.co",
      client: "Coastal HVAC",
      tagline: "Spring tune-up push",
      metrics: [["Leads", "112"], ["CPL", "$41"], ["Booked", "34"]] as const,
      note: "Search CPL down 14% after negative keyword sweep.",
    },
    {
      brand: "Foundry",
      letter: "F",
      color: "#F97316",
      domain: "app.foundrylocal.com",
      client: "Apex Remodeling",
      tagline: "Kitchen leads, Q2",
      metrics: [["Leads", "47"], ["CPL", "$128"], ["Booked", "9"]] as const,
      note: "Carousel v3 outperforming v1 by 2.1x CTR.",
    },
  ];
  return (
    <section className="hairline-t py-24 md:py-32">
      <div className="mx-auto max-w-[1180px] px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground">White-label</div>
          <h2 className="mt-3 text-[30px] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[36px] md:text-[42px]">
            Your logo. Your domain. Your client experience.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            Clients sign into your software at your domain. Orvio stays invisible.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {brands.map(b => <BrandPortalPreview key={b.brand} {...b} />)}
        </div>
      </div>
    </section>
  );
}

function BrandPortalPreview({
  brand, color, letter, domain, client, tagline, metrics, note,
}: {
  brand: string; color: string; letter: string; domain: string;
  client: string; tagline: string;
  metrics: readonly (readonly [string, string])[]; note: string;
}) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-border bg-background transition-shadow hover:shadow-pop">
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
        <div className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-border" />
          <span className="h-2 w-2 rounded-full bg-border" />
          <span className="h-2 w-2 rounded-full bg-border" />
        </div>
        <div className="ml-2 truncate rounded-md bg-[var(--surface-2)] px-2 py-1 text-[10.5px] text-muted-foreground">{domain}</div>
      </div>
      <div className="relative p-6">
        <div className="absolute inset-x-0 top-0 h-[2px]" style={{ background: color }} />
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-md text-[13px] font-bold text-white" style={{ background: color }}>{letter}</span>
          <div className="leading-tight">
            <div className="text-[13px] font-semibold tracking-tight">{brand}</div>
            <div className="text-[10.5px] text-muted-foreground">Client portal</div>
          </div>
        </div>

        <div className="mt-6 text-[10.5px] uppercase tracking-wider text-muted-foreground">{tagline}</div>
        <div className="mt-0.5 text-[15px] font-semibold tracking-tight">{client}</div>

        <div className="mt-4 space-y-1.5">
          {metrics.map(([l, v]) => (
            <div key={l} className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{l}</span>
              <span className="text-[14px] font-semibold tracking-tight">{v}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-md bg-[var(--surface-2)]/50 p-3 text-[11.5px] leading-relaxed text-muted-foreground">
          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: color }} />
          {note}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Client portal phone ---------------- */

function ClientPortalPhone() {
  return (
    <section className="hairline-t bg-[var(--surface-2)]/40 py-24 md:py-32">
      <div className="mx-auto max-w-[1180px] px-6">
        <div className="grid items-center gap-12 md:grid-cols-[1fr_auto] md:gap-20">
          <div className="max-w-xl">
            <div className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground">Client portal</div>
            <h2 className="mt-3 text-[30px] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[36px] md:text-[42px]">
              Built for the phone in their truck.
            </h2>
            <p className="mt-5 text-[15.5px] leading-relaxed text-muted-foreground">
              Contractors do not need an analytics dashboard. They need to see who came in, what it cost, what needs approval, and what happened this month.
            </p>
            <ul className="mt-7 space-y-3.5">
              {[
                "Spend, leads, CPL at a glance",
                "Booked appointments on the calendar",
                "Call and text leads in one tap",
                "Approve creative without an email thread",
                "A plain note from the agency each month",
              ].map(t => (
                <li key={t} className="flex items-start gap-3 text-[14px]">
                  <span className="mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-foreground text-background">
                    <Check className="h-2.5 w-2.5" />
                  </span>
                  <span className="text-foreground/85">{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex w-full justify-center md:w-auto md:justify-end">
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

function PhoneMockup() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-8 -z-10 rounded-[48px] bg-[var(--accent)]/8 blur-3xl" />
      <div className="w-[88vw] max-w-[380px] rounded-[40px] border-[10px] border-foreground/90 bg-foreground/90 p-1.5 shadow-pop md:w-[380px]">
        <div className="overflow-hidden rounded-[30px] bg-background">
          <div className="flex items-center justify-between px-5 pt-3 pb-1 text-[11px] font-medium">
            <span>9:41</span>
            <span className="flex items-center gap-1 text-foreground/70">
              <span className="h-2 w-2 rounded-full bg-foreground/60" />
              <span className="h-2.5 w-4 rounded-sm border border-foreground/60" />
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-md bg-[var(--accent)] text-[12px] font-bold text-white">N</span>
              <div className="leading-tight">
                <div className="text-[13px] font-semibold">Northstar</div>
                <div className="text-[10.5px] text-muted-foreground">portal</div>
              </div>
            </div>
            <div className="grid h-7 w-7 place-items-center rounded-full bg-[var(--surface-2)] text-[10.5px] font-semibold">HP</div>
          </div>

          <div className="p-5">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Hartland Plumbing</div>
            <div className="mt-0.5 text-[18px] font-semibold tracking-tight">April performance</div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {[
                ["Leads", "63"],
                ["CPL", "$67.94"],
                ["Spend", "$4,280"],
                ["Booked", "18"],
              ].map(([l, v]) => (
                <div key={l} className="rounded-xl border border-border bg-[var(--surface-2)]/40 p-2.5">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{l}</div>
                  <div className="mt-0.5 text-[17px] font-semibold tracking-tight">{v}</div>
                </div>
              ))}
            </div>

            <div className="mt-3 rounded-xl border border-border bg-background p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[12.5px] font-semibold">Brian Connors</div>
                  <div className="text-[10.5px] text-muted-foreground">Burst pipe, Detroit</div>
                </div>
                <span className="rounded-full bg-[var(--warning-soft)] px-1.5 py-0.5 text-[9.5px] font-semibold text-[var(--warning)]">New</span>
              </div>
              <div className="mt-2.5 grid grid-cols-2 gap-1.5">
                <button className="inline-flex h-8 items-center justify-center gap-1 rounded-lg bg-foreground text-[11px] font-medium text-background">
                  <Phone className="h-3 w-3" /> Call
                </button>
                <button className="inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-border text-[11px] font-medium">
                  <MessageCircle className="h-3 w-3" /> Text
                </button>
              </div>
            </div>

            <div className="mt-2.5 flex items-center justify-between rounded-xl border border-border bg-background px-3 py-2.5">
              <div>
                <div className="text-[12px] font-semibold">Awaiting approval</div>
                <div className="text-[10.5px] text-muted-foreground">Primary v3</div>
              </div>
              <span className="rounded-full bg-[var(--accent-soft)] px-1.5 py-0.5 text-[9.5px] font-semibold text-[var(--accent)]">2 pending</span>
            </div>

            <div className="mt-2.5 rounded-xl border border-border bg-[var(--surface-2)]/40 p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">From Northstar</div>
              <p className="mt-1 text-[11.5px] leading-relaxed text-foreground/80">
                Roof Replacement scaled this month. Booked calls up 38% week over week.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
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
    <section id="pricing" className="hairline-t py-24 md:py-32">
      <div className="mx-auto max-w-[1180px] px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground">Pricing</div>
          <h2 className="mt-3 text-[30px] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[36px] md:text-[42px]">
            Flat pricing per agency.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
            No per-client fees. 14-day trial on every plan.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {tiers.map(t => (
            <div key={t.name} className={`flex flex-col rounded-2xl border bg-background p-7 ${t.pop ? "border-foreground" : "border-border"}`}>
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
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-foreground/60" />
                    <span className="text-foreground/85">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-background px-6 py-5">
          <div>
            <div className="text-[14px] font-semibold">Enterprise</div>
            <div className="text-[12.5px] text-muted-foreground">For 50+ clients, SSO, API access, custom onboarding, and dedicated support.</div>
          </div>
          <Link to="/book-demo" className="inline-flex h-9 items-center rounded-lg border border-border bg-background px-4 text-[13px] font-medium hover:bg-[var(--surface-2)]">
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
    <section className="hairline-t py-24 md:py-32">
      <div className="mx-auto max-w-[820px] px-6">
        <div className="text-center">
          <div className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground">FAQ</div>
          <h2 className="mt-3 text-[30px] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[36px]">Common questions</h2>
        </div>
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

/* ---------------- Final CTA ---------------- */

function FinalCTA() {
  return (
    <section className="hairline-t relative overflow-hidden py-28 md:py-36">
      <div className="relative mx-auto max-w-[860px] px-6 text-center">
        <h2 className="text-[34px] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[44px] md:text-[54px]">
          Give every client a portal that looks like your agency built it.
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-[15.5px] leading-relaxed text-muted-foreground">
          One branded place for reports, leads, approvals, invoices, and monthly updates.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/book-demo" className="inline-flex h-11 items-center gap-1.5 rounded-lg bg-foreground px-5 text-[14px] font-medium text-background hover:bg-foreground/90">
            Book a demo <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/product" className="inline-flex h-11 items-center gap-1.5 rounded-lg border border-border bg-background px-5 text-[14px] font-medium hover:bg-[var(--surface-2)]">
            View product
          </Link>
        </div>
      </div>
    </section>
  );
}
