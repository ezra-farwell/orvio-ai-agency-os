import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Check, Phone, Mail, MessageSquare, FileSpreadsheet, Video, CreditCard, PhoneCall, ArrowDown } from "lucide-react";
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
      <IntegrationsStrip />
      <Problem />
      <Positioning />
      <FeatureReporting />
      <FeatureLeads />
      <FeatureApprovals />
      <FeaturePortal />
      <WhiteLabel />
      <WhoItsFor />
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

function StripeMark({ className = "h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 25" className={className} aria-label="Stripe">
      <path fill="#9CA3FF" d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 0 1-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.04 1.26-.06 1.48zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.25c0-1.85-1.07-2.58-2.08-2.58zM40.95 20.3c-1.44 0-2.32-.6-2.91-1.04l-.02 4.63-4.24.9V5.57h3.74l.22 1.05a4.79 4.79 0 0 1 3.37-1.32c3.02 0 5.87 2.72 5.87 7.4 0 5.11-2.82 7.6-6.03 7.6zM39.96 9.05c-.97 0-1.58.35-2.02.84l.02 6.12c.41.44 1 .78 1.99.78 1.57 0 2.62-1.7 2.62-3.9 0-2.14-1.07-3.84-2.61-3.84zM28.24 5.85h4.26v14.25h-4.26V5.85zm0-4.7L32.5.24v3.46l-4.26.9V1.15zm-4.43 9.42v9.53H19.6V5.85h3.61l.26 1.2c.98-1.8 2.93-1.39 3.49-1.2v3.9c-.54-.17-2.18-.41-3.15.83zm-8.16 4.7c0 2.51 2.68 1.73 3.22 1.51v3.36c-.56.3-1.58.55-2.96.55a4.2 4.2 0 0 1-4.5-4.46l.02-13.89 4.15-.88v3.71h3.29V9.4h-3.3l.08 5.88zm-4.91.7c0 2.96-2.37 4.66-5.83 4.66a11.6 11.6 0 0 1-4.43-.93v-4.05c1.38.75 3.13 1.31 4.43 1.31.88 0 1.51-.24 1.51-.97 0-1.87-6.13-1.17-6.13-5.64 0-2.91 2.23-4.66 5.6-4.66 1.36 0 2.72.2 4.07.74v4c-1.24-.66-2.83-1.04-4.07-1.04-.83 0-1.34.24-1.34.85 0 1.76 6.19.92 6.19 5.73z"/>
    </svg>
  );
}

function CallRailMark({ className = "h-4" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className="grid h-5 w-5 place-items-center rounded-md bg-[#45B26B]">
        <PhoneCall className="h-3 w-3 text-white" />
      </span>
      <span className="text-[14px] font-semibold tracking-tight text-foreground/85">CallRail</span>
    </div>
  );
}

/* ---------------- Hero ---------------- */

function Hero() {
  return (
    <section className="relative overflow-hidden beam-bg">
      <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-14 px-6 pb-20 pt-28 md:grid-cols-[minmax(0,460px)_minmax(0,1fr)] md:gap-14 md:pb-24 md:pt-36 lg:gap-20">
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

          <p className="mt-7 max-w-[65ch] text-[16px] leading-[1.65] text-foreground/90">
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

function WindowChrome({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-border px-4 py-3">
      <div className="flex gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--surface-2)]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--surface-2)]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--surface-2)]" />
      </div>
      <div className="ml-3 text-[12px] text-foreground/70">{label}</div>
      <div className="ml-auto flex items-center gap-2 text-[12px] text-foreground/85">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" /> Live
      </div>
    </div>
  );
}

function HeroDashboard() {
  return (
    <div className="relative rounded-[14px] border border-border bg-[var(--surface)] shadow-pop">
      <WindowChrome label="Northstar · Agency portal" />
      <div className="p-7 md:p-9">
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--text-faint)]">Overview · April</div>
            <div className="mt-1.5 text-[22px] font-semibold tracking-tight">Portfolio health</div>
          </div>
          <div className="flex items-center gap-1.5 text-[12px] text-foreground/85">
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
        <span className="truncate text-foreground/90">{detail}</span>
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

/* ---------------- Integrations strip ---------------- */

function IntegrationsStrip() {
  return (
    <section className="hairline-t py-10 md:py-12">
      <div className="mx-auto max-w-[1180px] px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:gap-10">
          <p className="text-[12.5px] uppercase tracking-[0.18em] text-[var(--text-faint)] md:max-w-[200px] md:text-left">
            Connects the tools you already run
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 md:gap-x-16">
            <div className="flex items-center gap-2.5 text-foreground/90">
              <MetaMark className="h-6 w-6" />
              <span className="text-[17px] font-semibold tracking-tight">Meta Ads</span>
            </div>
            <div className="flex items-center gap-2.5 text-foreground/90">
              <GoogleMark className="h-6 w-6" />
              <span className="text-[17px] font-semibold tracking-tight">Google Ads</span>
            </div>
            <StripeMark className="h-7" />
            <CallRailMark className="h-5" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Problem ---------------- */

function Problem() {
  const scattered = [
    { icon: FileSpreadsheet, label: "Google Sheets", note: "Monthly reports" },
    { icon: Video, label: "Loom", note: "Update videos" },
    { icon: CreditCard, label: "Stripe links", note: "Invoicing" },
    { icon: PhoneCall, label: "CallRail tabs", note: "Call tracking" },
    { icon: MessageSquare, label: "Email and texts", note: "Approvals" },
  ];
  return (
    <section className="hairline-t bg-[var(--surface)]/40 py-32 md:py-40">
      <div className="mx-auto max-w-[1180px] px-6">
        <div className="max-w-2xl">
          <div className="text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--text-faint)]">The problem</div>
          <h2 className="mt-4 text-[32px] font-semibold leading-[1.08] tracking-[-0.025em] md:text-[44px]">
            Clients churn when they can't see the work.
          </h2>
          <p className="mt-6 max-w-[60ch] text-[15.5px] leading-[1.7] text-foreground/90">
            Reports live in Sheets. Updates live in Loom. Approvals live in email. Invoices live in Stripe. Call data lives in CallRail. The client lives in the dark, and at month three they start asking what they're paying for.
          </p>
        </div>

        <div className="mt-14 grid gap-3 sm:grid-cols-2 md:grid-cols-5">
          {scattered.map(s => (
            <div key={s.label} className="flex items-center gap-3 rounded-xl border border-border bg-[var(--surface)] px-4 py-4">
              <span className="grid h-9 w-9 place-items-center rounded-md border border-border bg-[var(--surface-2)] text-foreground/80">
                <s.icon className="h-4 w-4" />
              </span>
              <div>
                <div className="text-[13px] font-medium text-foreground/95">{s.label}</div>
                <div className="text-[11.5px] text-[var(--text-faint)]">{s.note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Positioning ---------------- */

function Positioning() {
  return (
    <section className="hairline-t py-28 md:py-36">
      <div className="mx-auto max-w-[1000px] px-6">
        <div className="text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--text-faint)]">The shift</div>
        <h2 className="mt-4 text-[30px] font-semibold leading-[1.1] tracking-[-0.025em] md:text-[40px]">
          <span className="text-foreground">The operating layer for paid-ad agencies.</span>{" "}
          <span className="text-foreground/55">One branded portal for reporting, leads, approvals, and invoices.</span>
        </h2>
        <p className="mt-6 max-w-[62ch] text-[15px] leading-[1.7] text-foreground/85">
          Dashboards, sign-offs, and billing run inside the same product, on your domain. The client sees one place. You stop stitching tools together every month.
        </p>
      </div>
    </section>
  );
}

/* ---------------- Feature deep-dive scaffold ---------------- */

function FeatureSection({
  align, tag, title, body, children,
}: {
  align: "left" | "right";
  tag: string;
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  const imgFirst = align === "left";
  return (
    <section className="hairline-t py-32 md:py-44">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-14 px-6 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] md:gap-20">
        <div className={imgFirst ? "md:order-1" : "md:order-2"}>{children}</div>
        <div className={imgFirst ? "md:order-2" : "md:order-1"}>
          <div className="inline-flex items-center rounded-full border border-border bg-[var(--surface)] px-2.5 py-1 text-[12px] uppercase tracking-[0.12em] text-foreground/75">
            {tag}
          </div>
          <h3 className="mt-5 text-[32px] font-semibold leading-[1.08] tracking-[-0.025em] md:text-[42px]">
            {title}
          </h3>
          <p className="mt-5 max-w-[52ch] text-[15.5px] leading-[1.7] text-foreground/90">{body}</p>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Feature A: Ad Reporting ---------------- */

function FeatureReporting() {
  return (
    <FeatureSection
      align="left"
      tag="Ad reporting"
      title="Meta and Google, explained in plain English."
      body="Spend, leads, and CPL pulled live from the ad accounts. Status words instead of spreadsheets, so clients know how things are going without reading a chart."
    >
      <ReportingMockup />
    </FeatureSection>
  );
}

function ReportingMockup() {
  return (
    <div className="relative rounded-[14px] border border-border bg-[var(--surface)] shadow-pop">
      <WindowChrome label="Apex Plumbing · Reporting · April" />
      <div className="p-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--text-faint)]">Performance summary</div>
            <div className="mt-2 text-[22px] font-semibold tracking-tight">Lead flow is <span className="text-[var(--success)]">Good</span>.</div>
            <p className="mt-2 max-w-[48ch] text-[13.5px] leading-[1.6] text-foreground/85">
              Cost per lead is down 14% month over month. Search is doing the heavy lifting.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[12px] text-foreground/85">
            <MetaMark /> Meta <span className="text-foreground/40">·</span> <GoogleMark /> Google
          </div>
        </div>

        <div className="mt-8 grid grid-cols-4 divide-x divide-border rounded-xl border border-border">
          {[
            ["Spend", "$8,420", "+3%"],
            ["Leads", "214", "+22%"],
            ["CPL", "$39.34", "-14%"],
            ["Booked", "61", "+18%"],
          ].map(([k, v, d]) => (
            <div key={k} className="px-4 py-4">
              <div className="text-[12px] uppercase tracking-[0.12em] text-[var(--text-faint)]">{k}</div>
              <div className="mt-1.5 text-[22px] font-semibold tracking-tight">{v}</div>
              <div className={`mt-1 text-[12px] ${d.startsWith("-") || d.startsWith("+") && k !== "Spend" ? "text-[var(--success)]" : "text-foreground/70"}`}>{d}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-border p-5">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[12px] uppercase tracking-[0.14em] text-[var(--text-faint)]">Leads by week</div>
              <div className="mt-1.5 text-[20px] font-semibold tracking-tight">214 leads</div>
            </div>
            <div className="flex items-center gap-3 text-[12px] text-foreground/75">
              <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-3 rounded-full bg-[#6366F1]" /> Meta</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-3 rounded-full bg-[#34D399]" /> Google</span>
            </div>
          </div>
          <div className="mt-5 flex h-32 items-end gap-2">
            {[40, 55, 48, 62, 71, 58, 78, 84, 72, 90, 95, 88].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col-reverse gap-px">
                <div style={{ height: `${h * 0.55}%` }} className="rounded-sm bg-[#6366F1]/80" />
                <div style={{ height: `${h * 0.45}%` }} className="rounded-sm bg-[#34D399]/80" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Feature B: Lead Inbox / Pipeline ---------------- */

function FeatureLeads() {
  return (
    <FeatureSection
      align="right"
      tag="Lead inbox"
      title="Every form fill and call in one place."
      body="Phone calls, web forms, and click-to-text all land in a single inbox. Move them through New, Contacted, Booked, and Won — the client sees the same board you do."
    >
      <LeadsMockup />
    </FeatureSection>
  );
}

function LeadsMockup() {
  const cols: { title: string; tone: string; cards: { name: string; city: string; src: "call" | "form"; t: string }[] }[] = [
    { title: "New", tone: "var(--accent)", cards: [
      { name: "Lauren M.", city: "Hartland, WI", src: "call", t: "2m" },
      { name: "Devon R.", city: "Pewaukee, WI", src: "form", t: "14m" },
      { name: "Marco S.", city: "Brookfield, WI", src: "call", t: "38m" },
    ]},
    { title: "Contacted", tone: "var(--warning)", cards: [
      { name: "Priya K.", city: "Wauwatosa, WI", src: "form", t: "1h" },
      { name: "Tom B.", city: "Mequon, WI", src: "call", t: "3h" },
    ]},
    { title: "Booked", tone: "var(--accent)", cards: [
      { name: "Jess A.", city: "Cedarburg, WI", src: "form", t: "Tue" },
      { name: "Ravi P.", city: "Elm Grove, WI", src: "call", t: "Wed" },
    ]},
    { title: "Won", tone: "var(--success)", cards: [
      { name: "Karen L.", city: "Delafield, WI", src: "form", t: "$1,840" },
    ]},
  ];
  return (
    <div className="relative rounded-[14px] border border-border bg-[var(--surface)] shadow-pop">
      <WindowChrome label="Apex Plumbing · Leads" />
      <div className="p-6 md:p-7">
        <div className="flex items-center justify-between">
          <div className="text-[22px] font-semibold tracking-tight">Pipeline</div>
          <div className="flex items-center gap-2 text-[12px] text-foreground/80">
            <span className="chip-success">12 new today</span>
            <span className="chip">214 this month</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {cols.map(col => (
            <div key={col.title} className="rounded-xl border border-border bg-[var(--surface)]/60 p-3">
              <div className="flex items-center justify-between px-1 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: col.tone }} />
                  <span className="text-[12px] font-medium uppercase tracking-[0.12em] text-foreground/85">{col.title}</span>
                </div>
                <span className="text-[12px] text-[var(--text-faint)]">{col.cards.length}</span>
              </div>
              <div className="space-y-2">
                {col.cards.map(c => (
                  <div key={c.name} className="rounded-lg border border-border bg-[var(--surface-2)] p-3">
                    <div className="flex items-center justify-between">
                      <div className="text-[13px] font-medium text-foreground/95">{c.name}</div>
                      <div className="text-[12px] text-[var(--text-faint)]">{c.t}</div>
                    </div>
                    <div className="mt-1 text-[12px] text-foreground/75">{c.city}</div>
                    <div className="mt-2.5 inline-flex items-center gap-1.5 text-[12px] text-foreground/80">
                      {c.src === "call" ? <Phone className="h-3 w-3" /> : <Mail className="h-3 w-3" />}
                      {c.src === "call" ? "Phone call" : "Web form"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Feature C: Approvals ---------------- */

function FeatureApprovals() {
  return (
    <FeatureSection
      align="left"
      tag="Content approvals"
      title="Sign-off without the email thread."
      body="Send creative for approval, leave inline comments, get a one-tap yes. The client never opens Drive, you never chase a reply."
    >
      <ApprovalsMockup />
    </FeatureSection>
  );
}

function ApprovalsMockup() {
  return (
    <div className="relative rounded-[14px] border border-border bg-[var(--surface)] shadow-pop">
      <WindowChrome label="Hartland HVAC · Spring Tune-Up · Review" />
      <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr]">
        <div className="border-b border-border p-7 md:border-b-0 md:border-r">
          <div className="flex items-center justify-between">
            <div className="text-[12px] uppercase tracking-[0.14em] text-[var(--text-faint)]">Creative · v3</div>
            <span className="chip-warning">Awaiting client</span>
          </div>
          <div className="relative mt-5 aspect-[4/5] overflow-hidden rounded-xl border border-border bg-gradient-to-br from-[#1F2A6B] via-[#4F46E5] to-[#0EA5E9]">
            <div className="absolute inset-x-6 top-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80">Hartland HVAC</div>
            <div className="absolute inset-x-6 bottom-24 text-[28px] font-semibold leading-[1.05] tracking-tight text-white">
              Spring tune-up<br />from $89.
            </div>
            <div className="absolute inset-x-6 bottom-12 text-[12px] text-white/85">Book this week. Local techs. No surprise fees.</div>
            <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between text-[11px] text-white/70">
              <span>9:16 · Reels</span>
              <span>0:00 / 0:15</span>
            </div>
            <div className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-md border border-white/30 bg-white/10 px-2 py-0.5 text-[11px] text-white/90 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-white/90" /> Preview
            </div>
          </div>
        </div>

        <div className="p-7">
          <div className="text-[12px] uppercase tracking-[0.14em] text-[var(--text-faint)]">Comments</div>
          <div className="mt-4 space-y-4">
            {[
              { who: "Sarah · Northstar", t: "10:14", msg: "Hook line is strong. Push the price up so it reads in 1s.", tone: "border-border" },
              { who: "Dan · Hartland HVAC", t: "10:42", msg: "Looks great. Can we add \"Locally owned\" near the bottom?", tone: "border-[var(--accent)]/40" },
              { who: "Sarah · Northstar", t: "10:48", msg: "Updated in v3. Ready for your sign-off.", tone: "border-border" },
            ].map(c => (
              <div key={c.t} className={`rounded-lg border ${c.tone} bg-[var(--surface-2)] p-3.5`}>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="font-medium text-foreground/90">{c.who}</span>
                  <span className="text-[var(--text-faint)]">{c.t}</span>
                </div>
                <p className="mt-1.5 text-[13px] leading-relaxed text-foreground/85">{c.msg}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-2.5">
            <button className="h-10 rounded-lg bg-[var(--success)] text-[13px] font-semibold text-[#03210F]">Approve</button>
            <button className="h-10 rounded-lg border border-border bg-[var(--surface)] text-[13px] font-medium text-foreground/90">Request changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Feature D: Client Portal phone ---------------- */

function FeaturePortal() {
  return (
    <FeatureSection
      align="right"
      tag="Client portal"
      title="A clean home for your client, on every device."
      body="Reports, leads, approvals, and invoices — all at your domain. Clients open it on their phone between jobs and know exactly where things stand."
    >
      <PortalPhone />
    </FeatureSection>
  );
}

function PortalPhone() {
  return (
    <div className="relative mx-auto flex max-w-[440px] items-center justify-center">
      <div
        className="pointer-events-none absolute -inset-12 -z-10 rounded-[60px] opacity-60 blur-3xl"
        style={{ background: "radial-gradient(60% 50% at 50% 40%, rgba(99,102,241,0.35), transparent 70%)" }}
        aria-hidden
      />
      <div className="relative w-[300px] rounded-[44px] border border-border bg-[#0B0B0D] p-2.5 shadow-pop sm:w-[340px]">
        <div className="rounded-[36px] border border-border bg-[var(--surface)] p-5">
          <div className="flex items-center justify-between text-[11px] text-foreground/70">
            <span>9:41</span>
            <span>•••</span>
          </div>
          <div className="mt-5 flex items-center justify-between">
            <div>
              <div className="text-[12px] text-[var(--text-faint)]">Apex Plumbing</div>
              <div className="text-[18px] font-semibold tracking-tight">Hi, Marcus</div>
            </div>
            <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] text-[12px] font-bold text-white">A</div>
          </div>

          <div className="mt-5 rounded-2xl border border-[var(--success)]/30 bg-[var(--success-soft)] p-4">
            <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--success)]">This week</div>
            <div className="mt-1 text-[20px] font-semibold tracking-tight text-foreground">Lead flow is Good.</div>
            <div className="mt-1 text-[12px] text-foreground/80">+22% vs last week</div>
          </div>

          <div className="mt-3 grid grid-cols-3 divide-x divide-border rounded-2xl border border-border">
            {[["52", "Leads"], ["$39", "CPL"], ["18", "Booked"]].map(([v, l]) => (
              <div key={l} className="px-2 py-3 text-center">
                <div className="text-[16px] font-semibold tracking-tight">{v}</div>
                <div className="text-[11px] text-[var(--text-faint)]">{l}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-2">
            {[
              { l: "Approve · Spring tune-up v3", t: "Today", tone: "chip-warning" as const },
              { l: "April invoice paid", t: "Apr 28", tone: "chip-success" as const },
              { l: "12 new leads", t: "Apr 27", tone: "chip-indigo" as const },
            ].map(r => (
              <div key={r.l} className="flex items-center justify-between rounded-xl border border-border bg-[var(--surface-2)] px-3.5 py-2.5">
                <div className="text-[12.5px] text-foreground/90">{r.l}</div>
                <span className={r.tone}>{r.t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
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
          <h2 className="text-[32px] font-semibold leading-[1.08] tracking-[-0.025em] md:text-[42px]">
            Your logo. Your domain. Your software.
          </h2>
          <p className="mt-6 max-w-[65ch] text-[15.5px] leading-[1.7] text-foreground/90">
            Same product, three agencies. Clients sign into yours at your domain. Orvio stays invisible.
          </p>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {brands.map(b => (
            <div key={b.brand} className="rounded-2xl border border-border bg-[var(--surface)] p-7">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-md text-[14px] font-bold text-white" style={{ background: b.color }}>{b.letter}</span>
                <div className="leading-tight">
                  <div className="text-[14px] font-semibold tracking-tight">{b.brand}</div>
                  <div className="mono text-[12px] text-foreground/75">{b.domain}</div>
                </div>
              </div>
              <div className="mt-6 rounded-xl border border-border bg-[var(--surface-2)] p-4">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: b.color }} />
                  <div className="text-[12px] uppercase tracking-[0.12em] text-[var(--text-faint)]">This month</div>
                </div>
                <div className="mt-2 text-[20px] font-semibold tracking-tight">Lead flow · Good</div>
                <div className="mt-1 text-[12px] text-foreground/75">Spend pacing · Steady</div>
              </div>
              <p className="mt-5 text-[13.5px] leading-relaxed text-foreground/85">{b.line}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- What it replaces ---------------- */

function WhatItReplaces() {
  const stack = [
    { icon: FileSpreadsheet, label: "Google Sheets", note: "Monthly reports" },
    { icon: Video, label: "Loom", note: "Update videos" },
    { icon: CreditCard, label: "Stripe links", note: "Invoicing" },
    { icon: PhoneCall, label: "CallRail tabs", note: "Call tracking" },
    { icon: MessageSquare, label: "Email + texts", note: "Approvals" },
  ];
  return (
    <section className="hairline-t py-32 md:py-44">
      <div className="mx-auto max-w-[1180px] px-6">
        <div className="max-w-2xl">
          <div className="text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--text-faint)]">What it replaces</div>
          <h2 className="mt-3 text-[32px] font-semibold leading-[1.08] tracking-[-0.025em] md:text-[42px]">
            Five tabs, one portal.
          </h2>
          <p className="mt-5 max-w-[60ch] text-[15px] leading-[1.7] text-foreground/90">
            Agencies cobble client delivery out of five tools. Orvio collapses them into one branded place.
          </p>
        </div>

        <div className="mt-16 grid items-center gap-10 md:grid-cols-[1.1fr_auto_1fr]">
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-1">
            {stack.map(s => (
              <div key={s.label} className="flex items-center gap-3 rounded-xl border border-border bg-[var(--surface)] px-4 py-3.5">
                <span className="grid h-9 w-9 place-items-center rounded-md border border-border bg-[var(--surface-2)] text-foreground/80">
                  <s.icon className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-[13.5px] font-medium text-foreground/95">{s.label}</div>
                  <div className="text-[12px] text-[var(--text-faint)]">{s.note}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center text-foreground/40">
            <ArrowRight className="hidden h-7 w-7 md:block" />
            <ArrowDown className="h-7 w-7 md:hidden" />
          </div>

          <div className="rounded-2xl border border-border bg-[var(--surface)] p-7 shadow-pop">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-md bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] text-[14px] font-bold text-white">O</span>
              <div>
                <div className="text-[14px] font-semibold tracking-tight">Orvio portal</div>
                <div className="mono text-[12px] text-foreground/75">portal.northstar.io</div>
              </div>
            </div>
            <div className="mt-6 space-y-2">
              {["Reporting", "Lead inbox", "Approvals", "Invoices", "Monthly update"].map(x => (
                <div key={x} className="flex items-center justify-between border-b border-border pb-2 text-[13px]">
                  <span className="text-foreground/90">{x}</span>
                  <Check className="h-3.5 w-3.5 text-[var(--success)]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Who it's for ---------------- */

function WhoItsFor() {
  const verticals: [string, string][] = [
    ["Plumbing", "Emergency calls and inspections."],
    ["HVAC", "Tune-ups, replacements, and maintenance plans."],
    ["Roofing", "Storm leads and free inspections."],
    ["Remodeling", "Higher-ticket consults and design booking."],
    ["Electrical", "Service calls and panel upgrades."],
  ];
  return (
    <section className="hairline-t py-32 md:py-44">
      <div className="mx-auto max-w-[1180px] px-6">
        <div className="max-w-2xl">
          <h2 className="text-[32px] font-semibold leading-[1.08] tracking-[-0.025em] md:text-[42px]">
            Built for agencies serving local trades.
          </h2>
          <p className="mt-5 max-w-[60ch] text-[15px] leading-[1.7] text-foreground/90">
            If your clients answer the phone in a truck, Orvio fits.
          </p>
        </div>

        <div className="mt-14 border-t border-border">
          {verticals.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[160px_1fr] items-center gap-4 border-b border-border py-6 md:grid-cols-[220px_1fr]">
              <span className="text-[14px] font-medium uppercase tracking-[0.12em] text-foreground/85">{k}</span>
              <span className="text-[15px] text-foreground/85">{v}</span>
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
          <h2 className="mt-3 text-[32px] font-semibold leading-[1.08] tracking-[-0.025em] md:text-[42px]">
            Flat pricing per agency.
          </h2>
          <p className="mx-auto mt-5 max-w-[65ch] text-[15px] leading-[1.7] text-foreground/90">
            No per-client fees. 14-day trial on every plan.
          </p>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {tiers.map(t => (
            <div key={t.name} className={`flex flex-col rounded-2xl border bg-[var(--surface)] p-7 ${t.pop ? "border-foreground" : "border-border"}`}>
              <div className="flex items-center justify-between">
                <div className="text-[13px] font-medium text-foreground/85">{t.name}</div>
                {t.pop && <span className="rounded-full bg-foreground px-2 py-0.5 text-[12px] font-semibold uppercase tracking-wider text-background">Popular</span>}
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-[40px] font-semibold tracking-[-0.02em]">${t.price}</span>
                <span className="text-[13px] text-foreground/80">/mo</span>
              </div>
              <div className="mt-1 text-[13px] text-foreground/80">{t.sub}</div>
              <p className="mt-4 text-[13px] leading-relaxed text-foreground/80">{t.best}</p>
              <Link to="/book-demo" className={`mt-6 flex h-10 items-center justify-center rounded-lg text-[13px] font-medium ${t.pop ? "bg-foreground text-background hover:bg-foreground/90" : "border border-border bg-[var(--surface)] hover:bg-[var(--surface-2)]"}`}>
                Start 14-day trial
              </Link>
              <ul className="mt-6 space-y-2.5">
                {t.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-[13px]">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-foreground/70" />
                    <span className="text-foreground/90">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-[var(--surface)] px-6 py-5">
          <div>
            <div className="text-[14px] font-semibold">Enterprise</div>
            <div className="text-[12.5px] text-foreground/80">For 50+ clients, SSO, API access, custom onboarding, and dedicated support.</div>
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
          <h2 className="text-[32px] font-semibold leading-[1.08] tracking-[-0.025em] md:text-[42px]">Common questions</h2>
        </div>
        <div className="mt-14 divide-y divide-border">
          {faqs.map(([q, a]) => (
            <details key={q} className="group py-6 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-[15px] font-medium">
                {q}
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-border text-foreground/70 transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 max-w-[65ch] text-[14px] leading-[1.7] text-foreground/85">{a}</p>
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
        <p className="mx-auto mt-6 max-w-[65ch] text-[15.5px] leading-[1.7] text-foreground/90">
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
