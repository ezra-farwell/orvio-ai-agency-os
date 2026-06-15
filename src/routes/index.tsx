import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  ArrowRight, Check, BarChart3, Inbox, MessageSquare, Palette, CreditCard,
  Sparkles, ChevronRight, Phone, MessageCircle, FileText, UserPlus, Globe,
  Info, AlertTriangle, Smartphone, Lock, Upload, Map as MapIcon, X,
} from "lucide-react";
import { MarketingShell } from "@/components/shells/MarketingShell";
import { currentAgency } from "@/mock/data";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Orvio — White-label client portals for agencies that run ads" },
      { name: "description", content: "Orvio is the white-label client portal and reporting OS for marketing agencies running Meta and Google Ads for local service businesses." },
      { property: "og:title", content: "Orvio — White-label client portals for agencies that run ads" },
      { property: "og:description", content: "White-label portals, ad reporting, leads, content approvals — built for agencies serving plumbers, roofers, HVAC, electricians, and remodelers." },
    ],
  }),
});

function Home() {
  return (
    <MarketingShell>
      <Hero />
      <Logos />
      <Problem />
      <FeatureGrid />
      <WorkflowDemos />
      <ProductDeepDive />
      <Testimonials />
      <ProductTruthStrip />
      <Roadmap />
      <PricingPreview />
      <FAQ />
      <FinalCTA />
    </MarketingShell>
  );
}

/* ---------------- Brand marks (Meta Ads & Google Ads) ---------------- */

function MetaMark({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" className={className} aria-label="Meta">
      <defs>
        <linearGradient id="metaG1" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#0064E1" />
          <stop offset="50%" stopColor="#0082FB" />
          <stop offset="100%" stopColor="#19AFFF" />
        </linearGradient>
      </defs>
      <path fill="url(#metaG1)" d="M6.4 22.7c0 2 .9 3.5 2.4 3.5 1.2 0 2-.6 3.7-3.1L14.9 19c2.6-4.1 4-6.3 6.6-6.3 2.5 0 4.5 1.8 5.8 5l-1.7 1c-.9-2.3-2.2-3.5-3.8-3.5-1.6 0-2.7 1.2-4.7 4.4l-2.4 3.8c-2 3.1-3.7 4.4-6 4.4-3 0-4.9-2.4-4.9-6.2 0-5.7 3.8-11 8.6-11 2.3 0 4.3 1.1 6 3l-1.3 1.5c-1.5-1.5-3-2.4-4.7-2.4-3.2 0-6 4-6 8.5l.1 1.5z" />
    </svg>
  );
}

function GoogleMark({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-label="Google">
      <path fill="#4285F4" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.8 2.7 30.3.5 24 .5 14.8.5 6.9 5.8 3.1 13.4l7.8 6.1C12.7 13.7 17.9 9.5 24 9.5z" />
      <path fill="#34A853" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.6-4.9 7.3l7.6 5.9c4.4-4.1 7.1-10.1 7.1-17.7z" />
      <path fill="#FBBC05" d="M10.9 28.4c-.5-1.5-.8-3-.8-4.6s.3-3.1.8-4.6l-7.8-6.1C1.4 16.6.5 20.2.5 24s.9 7.4 2.6 10.5l7.8-6.1z" />
      <path fill="#EA4335" d="M24 47.5c6.3 0 11.6-2.1 15.4-5.7l-7.6-5.9c-2.1 1.4-4.8 2.3-7.8 2.3-6.1 0-11.3-4.2-13.1-9.9l-7.8 6.1C6.9 42.2 14.8 47.5 24 47.5z" />
    </svg>
  );
}

function MetaAdsChip({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border border-border bg-background px-2 py-0.5 text-[10.5px] font-medium ${className}`}>
      <MetaMark className="h-3 w-3" /> Meta Ads
    </span>
  );
}
function GoogleAdsChip({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border border-border bg-background px-2 py-0.5 text-[10.5px] font-medium ${className}`}>
      <GoogleMark className="h-3 w-3" /> Google Ads
    </span>
  );
}


/* ---------------- Demo-data badge ---------------- */

function DemoBadge({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border border-border bg-background/90 px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-wider text-muted-foreground backdrop-blur ${className}`}>
      <span className="h-1 w-1 rounded-full bg-[var(--accent)]" /> Demo data
    </span>
  );
}

/* ---------------- Hero ---------------- */

function Hero() {
  return (
    <section className="hero-bg relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="relative mx-auto max-w-[1240px] px-6 pb-20 pt-32 md:pt-40">
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <Link to="/product" className="chip-indigo">
            <Sparkles className="h-3 w-3" /> Built for agencies running paid ads
            <ChevronRight className="h-3 w-3" />
          </Link>
          <h1 className="mt-6 text-[36px] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[44px] md:text-[60px]">
            White-label client portals for agencies that <span className="text-gradient-indigo">run ads.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground md:text-[17px]">
            Orvio gives your agency one branded workspace for Meta &amp; Google ad reporting, leads, content approvals, and monthly reports — so clients can finally see what they're paying for.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link to="/book-demo" className="inline-flex h-11 items-center gap-1.5 rounded-lg bg-foreground px-5 text-[14px] font-medium text-background hover:bg-foreground/90">
              Book a demo <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/demo" className="inline-flex h-11 items-center gap-1.5 rounded-lg border border-border bg-background px-5 text-[14px] font-medium text-foreground hover:bg-[var(--surface-2)]">
              Explore the live demo
            </Link>
          </div>
          <div className="mt-4 text-[12.5px] text-muted-foreground">
            14-day trial · No credit card · Cancel anytime
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
          className="relative mx-auto mt-12 max-w-[1180px] md:mt-14"
        >
          <DashboardMock />
        </motion.div>
      </div>
    </section>
  );
}

/* Animated hero dashboard with rotating metrics */
function DashboardMock() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick(x => x + 1), 2200);
    return () => clearInterval(t);
  }, []);

  const series = [
    { spend: "$24,840", leads: 612, cpl: "$40.59", ctr: "2.8%", trend: [12,18,16,22,28,26,34,32,40,42,38,48,52,49,58] },
    { spend: "$25,180", leads: 624, cpl: "$40.35", ctr: "2.9%", trend: [14,20,17,24,29,28,35,34,41,43,40,49,54,51,60] },
    { spend: "$25,540", leads: 638, cpl: "$40.03", ctr: "3.0%", trend: [15,22,19,26,30,30,37,36,43,45,42,51,56,54,63] },
  ];
  const cur = series[tick % series.length];

  return (
    <div className="relative rounded-2xl border border-border bg-background p-2 shadow-pop">
      <DemoBadge className="absolute right-4 top-4 z-10" />
      <div className="overflow-hidden rounded-xl border border-border bg-[var(--surface-2)]">
        <div className="flex">
          <div className="hidden w-[200px] shrink-0 border-r border-border bg-background p-3 md:block">
            <div className="flex items-center gap-2">
              <span className="grid h-5 w-5 place-items-center rounded bg-foreground"><span className="h-1 w-1 rounded-full bg-background" /></span>
              <span className="text-[12px] font-semibold">Orvio</span>
            </div>
            <div className="mt-4 space-y-1 text-[11.5px]">
              {["Overview","Clients","Ad Reporting","Leads","Pipeline","Messages","Payments","Content Studio"].map((l,i) => (
                <div key={l} className={`flex items-center gap-2 rounded px-2 py-1.5 ${i===2 ? "bg-[var(--surface-2)] font-medium text-foreground" : "text-muted-foreground"}`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" /> {l}
                </div>
              ))}
            </div>
          </div>
          <div className="min-w-0 flex-1 p-3 md:p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="text-[10.5px] text-muted-foreground md:text-[11px]">Ad reporting · Last 30 days</div>
                <div className="truncate text-[13px] font-semibold md:text-[15px]">All clients · Meta + Google</div>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <span className="chip text-[10px] md:text-[11px]">Meta</span>
                <span className="chip text-[10px] md:text-[11px]">Google</span>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                ["Spend",cur.spend,"+8.2%"],
                ["Leads",String(cur.leads),"+12.4%"],
                ["CPL",cur.cpl,"-4.1%"],
                ["CTR",cur.ctr,"+0.3pp"],
              ].map(([l,v,d]) => (
                <motion.div
                  key={l as string}
                  className="rounded-lg border border-border bg-background p-2.5"
                >
                  <div className="text-[10px] text-muted-foreground md:text-[10.5px]">{l}</div>
                  <motion.div
                    key={`${l}-${tick}`}
                    initial={{ opacity: 0, y: -3 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-0.5 text-[14px] font-semibold tracking-tight md:text-[15px]"
                  >
                    {v}
                  </motion.div>
                  <div className="text-[9.5px] text-[var(--success)] md:text-[10px]">{d}</div>
                </motion.div>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-3">
              <div className="md:col-span-2 rounded-lg border border-border bg-background p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-[11px] font-medium md:text-[11.5px]">Best vs worst campaign · 30d</div>
                  <div className="text-[10px] text-muted-foreground md:text-[10.5px]">Updating live</div>
                </div>
                <DualChart trend={cur.trend} />
                <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground md:text-[10.5px]">
                  <span className="inline-flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" /> Roof Replacement</span>
                  <span className="inline-flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-[var(--danger)]" /> Kitchen Remodel</span>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-background p-3">
                <div className="text-[11px] font-medium md:text-[11.5px]">Best campaign</div>
                <div className="mt-1 text-[13px] font-semibold">Roof Replacement</div>
                <div className="text-[10px] text-muted-foreground md:text-[10.5px]">38 leads · $78 CPL</div>
                <div className="mt-3 text-[11px] font-medium md:text-[11.5px]">Worst campaign</div>
                <div className="mt-1 text-[13px] font-semibold">Kitchen Remodel</div>
                <div className="text-[10px] text-muted-foreground md:text-[10.5px]">22 leads · $146 CPL</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute -bottom-6 left-1/2 h-12 w-3/4 -translate-x-1/2 rounded-full bg-[var(--accent)]/15 blur-3xl" />
    </div>
  );
}

function DualChart({ trend }: { trend: number[] }) {
  const good = trend;
  const bad = trend.map((p, i) => Math.max(4, p * 0.45 + (i % 3) * 1.5));
  const w = 100, h = 38;
  const max = Math.max(...good);
  const step = w / (good.length - 1);
  const toPath = (arr: number[]) => arr.map((p, i) => `${i === 0 ? "M" : "L"}${(i * step).toFixed(2)},${(h - (p / max) * h).toFixed(2)}`).join(" ");
  const goodLine = toPath(good);
  const badLine = toPath(bad);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-20 w-full">
      <defs>
        <linearGradient id="gGood" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${goodLine} L${w},${h} L0,${h} Z`} fill="url(#gGood)" />
      <motion.path d={goodLine} fill="none" stroke="#10B981" strokeWidth="1.4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2 }} />
      <motion.path d={badLine} fill="none" stroke="#EF4444" strokeWidth="1.2" strokeDasharray="2 2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: 0.15 }} />
    </svg>
  );
}

/* ---------------- Logos / trust ---------------- */

function Logos() {
  const verticals = [
    { name: "Plumbing", Icon: WrenchIcon },
    { name: "Roofing", Icon: RoofIcon },
    { name: "HVAC", Icon: FlameIcon },
    { name: "Electrical", Icon: BoltIcon },
    { name: "Remodeling", Icon: HouseIcon },
    { name: "Landscaping", Icon: LeafIcon },
  ];
  return (
    <section className="hairline-b py-10">
      <div className="mx-auto max-w-[1240px] px-6">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-center md:justify-between md:gap-10">
          <div className="flex flex-col items-center gap-3 md:items-start">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Connects with</div>
            <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-[13px] font-semibold">
                <MetaMark className="h-4 w-4" /> Meta Ads
              </span>
              <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-[13px] font-semibold">
                <GoogleMark className="h-4 w-4" /> Google Ads
              </span>
              <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-[13px] font-semibold">
                <StripeMark className="h-4 w-4" /> Stripe
              </span>
            </div>
          </div>
          <div className="h-px w-full bg-border md:hidden" />
          <div className="flex flex-col items-center gap-3 md:items-end">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Built for</div>
            <div className="grid grid-cols-3 gap-x-5 gap-y-2 text-center text-[12.5px] font-medium tracking-tight text-foreground/70 sm:grid-cols-6">
              {verticals.map(({ name, Icon }) => (
                <div key={name} className="flex items-center justify-center gap-1.5">
                  <Icon className="h-3.5 w-3.5 text-foreground/40" />
                  <span>{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const StripeMark = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 32 32" className={className} aria-label="Stripe">
    <rect width="32" height="32" rx="6" fill="#635BFF" />
    <path fill="#fff" d="M14.6 12.2c0-.8.7-1.1 1.7-1.1 1.5 0 3.4.5 4.9 1.3v-4.6C19.6 7.3 18 7 16.3 7c-4 0-6.7 2.1-6.7 5.6 0 5.5 7.5 4.6 7.5 6.9 0 .9-.8 1.2-2 1.2-1.6 0-3.8-.7-5.6-1.6v4.7c1.9.8 3.9 1.2 5.6 1.2 4.1 0 7-2 7-5.6-.1-5.9-7.5-4.8-7.5-7.2z"/>
  </svg>
);



const WrenchIcon = (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.3 2.3-2-.4-.4-2 2.3-2.3z"/></svg>;
const RoofIcon = (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 11l9-7 9 7M5 10v10h14V10"/></svg>;
const FlameIcon = (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2s4 4 4 8a4 4 0 0 1-8 0c0-2 2-4 2-4s-2 6 2 6 4-3 4-6"/></svg>;
const BoltIcon = (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/></svg>;
const HouseIcon = (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 11l9-8 9 8v10H3z"/><path d="M9 21V12h6v9"/></svg>;
const LeafIcon = (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 4c-7 0-13 5-13 12 0 2 1 4 1 4s7 0 11-4 4-12 1-12z"/><path d="M8 20l8-8"/></svg>;

/* ---------------- Problem ---------------- */

const problemBullets = [
  { Icon: FileText, text: "Reports buried in PDFs and screenshots" },
  { Icon: Inbox, text: "Leads scattered across Meta forms, CallRail, email" },
  { Icon: MessageSquare, text: "Creative approvals lost in endless threads" },
  { Icon: CreditCard, text: "Payments tracked across three different tools" },
];

function Problem() {
  return (
    <section className="py-20 md:py-24">
      <div className="mx-auto max-w-[1240px] px-6">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <div className="chip">The agency problem</div>
            <h2 className="mt-3 text-[28px] font-semibold leading-[1.1] tracking-[-0.02em] sm:text-[34px] md:text-[40px]">
              Clients churn when they can't see the work.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              You're running solid campaigns. But every month you ship a Google Sheet, a Loom, and a Stripe link. The contractor doesn't know what CTR means, doesn't see the leads in real time, and forgets why they're paying you. Then they cancel.
            </p>
            <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {problemBullets.map(({ Icon, text }) => (
                <li key={text} className="flex items-start gap-2.5 rounded-lg border border-border bg-background p-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-[var(--danger-soft)] text-[var(--danger)]">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-[13px] leading-snug text-foreground/85">{text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="rounded-2xl border border-border bg-background p-5 shadow-soft">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Client text · Tuesday 9:14am</div>
              <div className="mt-3 space-y-3">
                <Bubble side="left">"Are the ads even running this week? Haven't seen a lead since Friday."</Bubble>
                <Bubble side="right">"Yes! Sending you the report shortly."</Bubble>
                <Bubble side="left">"Honestly I don't know what these numbers mean. What did I pay for?"</Bubble>
              </div>
              <div className="mt-4 rounded-lg border border-dashed border-[var(--danger)]/40 bg-[var(--danger-soft)]/40 px-3 py-2 text-[12.5px] text-[var(--danger)]">
                Account at risk · Cancellation likely in 14 days
              </div>
            </div>
          </div>
        </div>

        {/* Before / After */}
        <div className="mt-14 grid gap-4 md:grid-cols-2">
          <CompareCard
            label="Before Orvio"
            tone="danger"
            items={[
              "Monthly PDF + Loom + Slack messages",
              "Client emails: 'are the ads running?'",
              "Approvals over text and email threads",
              "Lost leads in form spreadsheets",
              "Churn after month 3",
            ]}
          />
          <CompareCard
            label="After Orvio"
            tone="success"
            items={[
              "Branded portal with live metrics 24/7",
              "Plain-English helper on every number",
              "One-click approve or request changes",
              "Single lead inbox with call/text shortcuts",
              "Clients stay because they see the work",
            ]}
          />
        </div>
      </div>
    </section>
  );
}

function CompareCard({ label, tone, items }: { label: string; tone: "danger" | "success"; items: string[] }) {
  const isGood = tone === "success";
  return (
    <div className={`rounded-2xl border bg-background p-5 ${isGood ? "border-[var(--success)]/30" : "border-border"}`}>
      <div className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${isGood ? "bg-[var(--success-soft)] text-[var(--success)]" : "bg-[var(--danger-soft)] text-[var(--danger)]"}`}>
        {isGood ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />} {label}
      </div>
      <ul className="mt-4 space-y-2.5">
        {items.map(t => (
          <li key={t} className="flex items-start gap-2 text-[13.5px]">
            {isGood
              ? <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--success)]" />
              : <X className="mt-0.5 h-4 w-4 shrink-0 text-[var(--danger)]/70" />}
            <span className="text-foreground/85">{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Bubble({ side, children }: { side: "left" | "right"; children: React.ReactNode }) {
  const right = side === "right";
  return (
    <div className={`flex ${right ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-[13px] leading-snug ${right ? "bg-foreground text-background" : "bg-[var(--surface-2)] text-foreground"}`}>{children}</div>
    </div>
  );
}

/* ---------------- Feature grid (shipped only) ---------------- */

const features = [
  { icon: Palette, title: "White-label portals", body: "Your logo, your domain, your colors. Clients sign into a portal that looks like your software, not someone else's tool." },
  { icon: BarChart3, title: "Meta & Google reporting", body: "Spend, leads, CPL, CTR — pulled from your accounts, explained in plain English next to every number." },
  { icon: Inbox, title: "Lead inbox", body: "Every form fill, call, and inbound message in one place. Assign, status, convert. No more lost leads." },
  { icon: MessageSquare, title: "Content approvals", body: "Ship creative, get approve / request-changes feedback inside the portal. No more email threads." },
  { icon: FileText, title: "Monthly reports", body: "One-page reports your clients actually read — plain-English metrics with explanatory tooltips." },
  { icon: CreditCard, title: "Stripe payments", body: "Invoices and recurring subscriptions through your own Stripe Connect account. We never touch the money." },
];

function FeatureGrid() {
  return (
    <section className="hairline-t py-20 md:py-24">
      <div className="mx-auto max-w-[1240px] px-6">
        <div className="max-w-2xl">
          <div className="chip-indigo">One workspace</div>
          <h2 className="mt-3 text-[28px] font-semibold leading-[1.1] tracking-[-0.02em] sm:text-[34px] md:text-[40px]">Everything your agency runs, in one branded portal.</h2>
          <p className="mt-3 text-[15px] text-muted-foreground">Replace the patchwork of Sheets, Loom, Slack threads, and Stripe pages with a single product built for agencies running paid ads.</p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-12 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="group rounded-2xl border border-border bg-background p-5 transition-shadow hover:shadow-soft">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
                <f.icon className="h-4 w-4" />
              </div>
              <h3 className="mt-4 text-[15.5px] font-semibold tracking-tight">{f.title}</h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Workflow demos ---------------- */

function WorkflowDemos() {
  const demos = [
    {
      tag: "1 · Agency onboarding",
      title: "Spin up your workspace in 4 steps",
      body: "Pick a name, brand color, custom domain, and add your first client. Your portal is live in under 20 minutes.",
      visual: <OnboardingDemo />,
    },
    {
      tag: "2 · Client invitation",
      title: "Contractor opens the portal on their phone",
      body: "They get a magic link, log in, and see a portal with your logo and colors — not Orvio's.",
      visual: <ClientInviteDemo />,
    },
    {
      tag: "3 · Lead handling",
      title: "Open a new lead, call or text in one tap",
      body: "Leads land in the inbox in real time. Contractor taps the lead, hits call or text, then updates status.",
      visual: <LeadDemo />,
    },
    {
      tag: "4 · Content approval",
      title: "Approve creative without the email thread",
      body: "The contractor sees the ad, taps Approve or Request changes. Your agency gets the update instantly.",
      visual: <ApprovalDemo />,
    },
    {
      tag: "5 · Monthly report",
      title: "A report the contractor actually reads",
      body: "Plain-English metrics with a tooltip on every number. No marketing jargon, no PDFs.",
      visual: <ReportDemo />,
    },
  ];
  return (
    <section className="hairline-t bg-[var(--surface-2)]/40 py-20 md:py-24">
      <div className="mx-auto max-w-[1240px] px-6">
        <div className="max-w-2xl">
          <div className="chip">How it works</div>
          <h2 className="mt-3 text-[28px] font-semibold leading-[1.1] tracking-[-0.02em] sm:text-[34px] md:text-[40px]">Five workflows your agency runs every week.</h2>
          <p className="mt-3 text-[15px] text-muted-foreground">Each card below shows the exact screen your team — or your client — would see. All visuals use demo data.</p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {demos.map((d) => (
            <div key={d.tag} className="overflow-hidden rounded-2xl border border-border bg-background">
              <div className="relative border-b border-border bg-[var(--surface-2)]/60 p-5 md:p-6">
                <DemoBadge className="absolute right-4 top-4" />
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{d.tag}</div>
                <div className="mt-1.5 text-[17px] font-semibold tracking-tight md:text-[19px]">{d.title}</div>
                <p className="mt-1.5 max-w-md text-[13px] leading-relaxed text-muted-foreground">{d.body}</p>
              </div>
              <div className="p-5 md:p-6">{d.visual}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function OnboardingDemo() {
  const steps = [
    { Icon: UserPlus, label: "Workspace", value: "Northstar Growth", done: true },
    { Icon: Palette, label: "Brand color", value: "#4F46E5", done: true, swatch: true },
    { Icon: Globe, label: "Custom domain", value: "portal.northstar.co", done: true },
    { Icon: UserPlus, label: "First client", value: "Hartland Plumbing", done: true },
  ];
  return (
    <div className="space-y-2">
      {steps.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, x: -6 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
          className="flex items-center gap-3 rounded-lg border border-border bg-background p-3"
        >
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-[var(--accent-soft)] text-[var(--accent)]"><s.Icon className="h-4 w-4" /></span>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
            <div className="flex items-center gap-2 truncate text-[13.5px] font-medium">
              {s.swatch && <span className="h-3 w-3 rounded-sm" style={{ background: s.value }} />}
              {s.value}
            </div>
          </div>
          <Check className="h-4 w-4 shrink-0 text-[var(--success)]" />
        </motion.div>
      ))}
    </div>
  );
}

function ClientInviteDemo() {
  return (
    <div className="flex justify-center">
      <div className="relative w-[220px] rounded-[28px] border-4 border-foreground/90 bg-foreground/90 p-1.5 shadow-pop">
        <div className="overflow-hidden rounded-[20px] bg-background">
          <div className="flex items-center justify-between border-b border-border px-3 py-2">
            <div className="flex items-center gap-1.5">
              <span className="grid h-4 w-4 place-items-center rounded bg-[var(--accent)]"><span className="h-1 w-1 rounded-full bg-white" /></span>
              <span className="text-[10.5px] font-semibold">Northstar</span>
            </div>
            <Smartphone className="h-3 w-3 text-muted-foreground" />
          </div>
          <div className="p-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Welcome</div>
            <div className="text-[13px] font-semibold">Hartland Plumbing</div>
            <div className="mt-3 grid grid-cols-2 gap-1.5">
              {[["Leads","63"],["CPL","$67"],["Spend","$4.2k"],["Booked","18"]].map(([l,v]) => (
                <div key={l} className="rounded-md border border-border bg-[var(--surface-2)]/50 p-1.5">
                  <div className="text-[8.5px] text-muted-foreground">{l}</div>
                  <div className="text-[12px] font-semibold">{v}</div>
                </div>
              ))}
            </div>
            <div className="mt-2.5 rounded-md bg-[var(--accent)] px-2 py-1.5 text-center text-[10.5px] font-medium text-white">
              View this month's leads
            </div>
            <div className="mt-1.5 rounded-md border border-border px-2 py-1.5 text-center text-[10.5px] font-medium">
              Approve 2 ads
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LeadDemo() {
  const [status, setStatus] = useState<"New"|"Contacted"|"Booked">("New");
  const tone = status === "Booked" ? "bg-[var(--success-soft)] text-[var(--success)]" : status === "Contacted" ? "bg-[var(--accent-soft)] text-[var(--accent)]" : "bg-[var(--warning-soft)] text-[var(--warning)]";
  return (
    <div className="rounded-xl border border-border bg-background">
      <div className="flex items-center justify-between border-b border-border p-3">
        <div className="min-w-0">
          <div className="text-[13px] font-semibold">Marcus Reilly</div>
          <div className="text-[11.5px] text-muted-foreground">Burst pipe · Detroit, MI · 9:14am</div>
        </div>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${tone}`}>{status}</span>
      </div>
      <div className="grid grid-cols-2 gap-2 p-3">
        <a href="#" onClick={(e)=>{e.preventDefault(); setStatus("Contacted");}} className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md bg-foreground text-[12.5px] font-medium text-background">
          <Phone className="h-3.5 w-3.5" /> Call
        </a>
        <a href="#" onClick={(e)=>{e.preventDefault(); setStatus("Contacted");}} className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-border bg-background text-[12.5px] font-medium">
          <MessageCircle className="h-3.5 w-3.5" /> Text
        </a>
      </div>
      <div className="border-t border-border p-3">
        <div className="text-[10.5px] uppercase tracking-wider text-muted-foreground">Update status</div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {(["New","Contacted","Booked"] as const).map(s => (
            <button key={s} onClick={()=>setStatus(s)} className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${status===s ? "bg-foreground text-background" : "border border-border bg-background text-foreground"}`}>{s}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ApprovalDemo() {
  const [state, setState] = useState<"pending"|"approved"|"changes">("pending");
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="flex items-center gap-1.5">
        <span className="chip-indigo text-[10.5px]">Meta Ads</span>
        <span className="chip text-[10.5px]">Primary text · v3</span>
      </div>
      <div className="mt-3 rounded-lg border border-border bg-[var(--surface-2)]/60 p-3 text-[12.5px] leading-relaxed">
        Burst pipe at 11pm? Hartland Plumbing dispatches a licensed plumber to Detroit Metro homes in under 60 minutes — no overtime fees.
      </div>
      {state === "pending" ? (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button onClick={()=>setState("approved")} className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md bg-[var(--success)] text-[12.5px] font-medium text-white"><Check className="h-3.5 w-3.5" /> Approve</button>
          <button onClick={()=>setState("changes")} className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-border bg-background text-[12.5px] font-medium"><MessageCircle className="h-3.5 w-3.5" /> Request changes</button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
          className={`mt-3 rounded-lg border px-3 py-2.5 text-[12px] font-medium ${state==="approved" ? "border-[var(--success)]/40 bg-[var(--success-soft)]/60 text-[var(--success)]" : "border-[var(--warning)]/40 bg-[var(--warning-soft)]/60 text-[var(--warning)]"}`}
        >
          {state === "approved" ? "✓ Approved · Northstar Growth notified" : "Changes requested · sent to your agency"}
        </motion.div>
      )}
    </div>
  );
}

function ReportDemo() {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="flex items-center justify-between">
        <div className="text-[12px] font-semibold">April 2024</div>
        <span className="chip text-[10.5px]">Monthly summary</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {[
          ["Spend","$4,280","what you invested in ads"],
          ["Leads","63","new potential customers"],
          ["CPL","$67.94","what each lead costs you"],
          ["Booked","18","calls on the calendar"],
        ].map(([l,v,h]) => (
          <div key={l} className="rounded-lg border border-border bg-[var(--surface-2)]/50 p-2.5">
            <div className="flex items-center gap-1 text-[10.5px] text-muted-foreground">{l} <Info className="h-3 w-3 opacity-60" /></div>
            <div className="mt-0.5 text-[14px] font-semibold">{v}</div>
            <div className="text-[10px] text-muted-foreground">{h}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-lg border border-[var(--accent)]/30 bg-[var(--accent-soft)] px-3 py-2 text-[12px] text-[var(--accent)]">
        <span className="font-medium">From your agency:</span> Best month yet — Roof Replacement scaled, booked calls up 38%.
      </div>
    </div>
  );
}

/* ---------------- Product deep dive ---------------- */

function ProductDeepDive() {
  return (
    <section className="hairline-t py-20 md:py-24">
      <div className="mx-auto max-w-[1240px] space-y-20 px-6 md:space-y-28">
        <DeepRow
          flip={false}
          eyebrow="Agency portal"
          title="Run every client account from one workspace."
          body="The agency portal is where your team actually does the work. Manage every contractor account, invite team members, assign leads, and ship monthly reports — all without switching tools."
          bullets={["Multi-client overview with revenue, spend, and at-risk signals","Unified leads inbox across Meta, Google, and inbound calls","Kanban pipeline from new lead → won job","Stripe Connect payments and invoice tracking"]}
          cta={["Tour the agency portal","/app"]}
          visual={<AgencyVisual />}
        />
        <DeepRow
          flip
          eyebrow="Client portal"
          title="A portal contractors actually log into — on their phone."
          body="Your client sees what they paid for, in plain English. Booked appointments, leads, what their ad spend turned into, and what's waiting on their approval."
          bullets={["Ad spend, leads, CPL with a one-line helper next to every metric","Lead list with call/text shortcuts","One-tap approve or request changes","Monthly reports that work on a phone screen"]}
          cta={["See the client view","/portal"]}
          visual={<ClientVisualMobile />}
        />
      </div>
    </section>
  );
}

function DeepRow({ flip, eyebrow, title, body, bullets, cta, visual }: {
  flip?: boolean; eyebrow: string; title: string; body: string; bullets: string[]; cta: [string, string]; visual: React.ReactNode;
}) {
  return (
    <div className={`grid items-center gap-10 md:grid-cols-2 md:gap-12 ${flip ? "md:[&>div:first-child]:order-2" : ""}`}>
      <div>
        <div className="chip">{eyebrow}</div>
        <h3 className="mt-3 text-[24px] font-semibold leading-[1.15] tracking-[-0.02em] sm:text-[28px] md:text-[34px]">{title}</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{body}</p>
        <ul className="mt-5 space-y-2.5">
          {bullets.map(b => (
            <li key={b} className="flex items-start gap-2 text-[14px]">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
              <span className="text-foreground/85">{b}</span>
            </li>
          ))}
        </ul>
        <Link to={cta[1] as any} className="mt-6 inline-flex items-center gap-1 text-[13.5px] font-medium text-[var(--accent)] hover:underline">
          {cta[0]} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <div>{visual}</div>
    </div>
  );
}

function AgencyVisual() {
  const clients = [
    ["Hartland Plumbing","$4,280","63 leads","Active"],
    ["Northside Roofing","$6,420","81 leads","Active"],
    ["Apex Remodeling","$8,910","47 leads","Active"],
    ["Brighton HVAC","$3,140","28 leads","At-risk"],
  ];
  return (
    <div className="relative rounded-2xl border border-border bg-background p-3 shadow-soft">
      <DemoBadge className="absolute right-4 top-4 z-10" />
      <div className="rounded-xl bg-[var(--surface-2)] p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Active clients</div>
          <div className="group relative inline-flex items-center gap-1 text-[10.5px] text-muted-foreground">
            <Info className="h-3 w-3" /> What is At-risk?
            <div className="pointer-events-none absolute right-0 top-full z-20 mt-1.5 w-64 rounded-lg border border-border bg-background p-3 text-left text-[11.5px] leading-snug text-foreground opacity-0 shadow-pop transition-opacity group-hover:opacity-100">
              <div className="font-semibold">At-risk client</div>
              <p className="mt-1 text-muted-foreground">Orvio flags a client as at-risk when CPL trends up, leads drop week-over-week, or they haven't logged into their portal in 14+ days.</p>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          {clients.map(([n,s,l,st]) => (
            <div key={n as string} className="flex items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 py-2.5">
              <div className="min-w-0 truncate text-[13px] font-medium">{n}</div>
              <div className="flex shrink-0 items-center gap-2 text-[11.5px] text-muted-foreground sm:gap-3 sm:text-[12px]">
                <span className="mono hidden sm:inline">{s}</span>
                <span className="hidden sm:inline">{l}</span>
                {st === "At-risk" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--warning-soft)] px-2 py-0.5 text-[10.5px] font-semibold text-[var(--warning)]">
                    <AlertTriangle className="h-3 w-3" /> At-risk
                  </span>
                ) : (
                  <span className="chip-success text-[10.5px]">Active</span>
                )}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[10.5px] text-muted-foreground">
          <span className="font-medium">At-risk</span> = CPL rising, leads falling, or 14+ days since last login.
        </p>
      </div>
    </div>
  );
}

function ClientVisualMobile() {
  return (
    <div className="relative flex justify-center md:justify-start">
      <DemoBadge className="absolute -top-2 right-0 z-10 md:right-1/4" />
      <div className="w-[260px] rounded-[34px] border-[6px] border-foreground/90 bg-foreground/90 p-1.5 shadow-pop sm:w-[280px]">
        <div className="overflow-hidden rounded-[24px] bg-background">
          <div className="flex items-center justify-between border-b border-border px-3.5 py-2.5">
            <div className="flex items-center gap-1.5">
              <span className="grid h-5 w-5 place-items-center rounded bg-[var(--accent)]"><span className="h-1 w-1 rounded-full bg-white" /></span>
              <span className="text-[12px] font-semibold">{currentAgency.name}</span>
            </div>
            <span className="text-[10px] text-muted-foreground">portal</span>
          </div>
          <div className="p-3.5">
            <div className="text-[10.5px] uppercase tracking-wider text-muted-foreground">Hartland Plumbing</div>
            <div className="text-[15px] font-semibold">April 2024</div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {[
                ["Ad spend","$4,280","what you invested"],
                ["Leads","63","new customers"],
                ["CPL","$67.94","cost per lead"],
                ["Booked","18","on the calendar"],
              ].map(([l,v,h]) => (
                <div key={l as string} className="rounded-lg border border-border bg-[var(--surface-2)]/60 p-2">
                  <div className="text-[9.5px] text-muted-foreground">{l}</div>
                  <div className="mt-0.5 text-[14px] font-semibold leading-tight">{v}</div>
                  <div className="text-[9px] text-muted-foreground">{h}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-lg border border-[var(--accent)]/30 bg-[var(--accent-soft)] px-2.5 py-2 text-[11px] text-[var(--accent)]">
              <span className="font-medium">From your agency:</span> Roof Replacement up 22% this week.
            </div>
            <div className="mt-2 flex gap-2">
              <button className="flex-1 rounded-md bg-foreground py-1.5 text-[11px] font-medium text-background">View leads</button>
              <button className="flex-1 rounded-md border border-border py-1.5 text-[11px] font-medium">Approvals · 2</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Product truth strip (replaces unverifiable stats) ---------------- */

function ProductTruthStrip() {
  const items = [
    { label: "Real-time", value: "Ad metrics", sub: "Spend, leads, CPL synced from Meta & Google." },
    { label: "Mobile-first", value: "Client portal", sub: "Built for contractors checking from a truck." },
    { label: "Plain English", value: "Reports", sub: "Helper text next to every marketing metric." },
    { label: "White-label", value: "End to end", sub: "Your logo, your domain, your brand." },
  ];
  return (
    <section className="hairline-t hairline-b bg-[var(--surface-2)]/40 py-14">
      <div className="mx-auto max-w-[1240px] px-6">
        <div className="text-center text-[11.5px] uppercase tracking-wider text-muted-foreground">What's actually in the product today</div>
        <div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {items.map(i => (
            <div key={i.value} className="text-center md:text-left">
              <div className="text-[10.5px] font-semibold uppercase tracking-wider text-[var(--accent)]">{i.label}</div>
              <div className="mt-1 text-[20px] font-semibold tracking-tight md:text-[22px]">{i.value}</div>
              <div className="mt-1 text-[12.5px] text-muted-foreground">{i.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Roadmap (coming soon) ---------------- */

function Roadmap() {
  const items = [
    { title: "AI Content Studio", body: "Ad copy and headlines grounded in each client's brand memory.", eta: "Q3 2026" },
    { title: "Brand Memory", body: "Per-client claims, offers, voice, and words to avoid.", eta: "Q3 2026" },
    { title: "Multi-brand white-label", body: "Run multiple agency brands from one Orvio account.", eta: "Q4 2026" },
    { title: "Financing links", body: "Embed home-service financing options directly in invoices.", eta: "Q4 2026" },
    { title: "Direct Meta & Google API", body: "Today: CSV import + manual entry. Soon: live API sync.", eta: "Q3 2026" },
    { title: "Public API & SSO", body: "Custom integrations and SAML for larger agencies.", eta: "Q4 2026" },
  ];
  return (
    <section className="py-20 md:py-24">
      <div className="mx-auto max-w-[1240px] px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="max-w-2xl">
            <div className="chip">Roadmap</div>
            <h2 className="mt-3 text-[26px] font-semibold leading-[1.15] tracking-[-0.02em] sm:text-[30px] md:text-[34px]">Coming soon — and honest about it.</h2>
            <p className="mt-3 text-[14.5px] text-muted-foreground">These are features we're shipping next. They aren't in the product yet, so we keep them out of the main feature list.</p>
          </div>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {items.map(r => (
            <div key={r.title} className="rounded-2xl border border-dashed border-border bg-background p-4">
              <div className="flex items-center justify-between">
                <div className="text-[13.5px] font-semibold tracking-tight">{r.title}</div>
                <span className="rounded-full bg-[var(--surface-2)] px-2 py-0.5 text-[10.5px] font-medium text-muted-foreground">{r.eta}</span>
              </div>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">{r.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Pricing (5 tiers) ---------------- */

const tiers = [
  { name: "Starter", price: 97, sub: "Up to 3 clients", pop: false, features: ["1 agency seat","Reporting + client portal","Meta + Google metrics","Email support"] },
  { name: "Growth", price: 297, sub: "Up to 10 clients", pop: false, features: ["3 agency seats","Lead inbox","Content approvals","Branded portal"] },
  { name: "Pro", price: 497, sub: "Up to 25 clients", pop: true, features: ["8 agency seats","Everything in Growth","AI Content Studio (beta)","Simple Stripe payments"] },
  { name: "Scale", price: 997, sub: "Unlimited clients", pop: false, features: ["20 agency seats","Advanced white-label","Custom domain + email","API access"] },
];

function PricingPreview() {
  return (
    <section id="pricing" className="hairline-t py-20 md:py-24">
      <div className="mx-auto max-w-[1240px] px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="chip">Pricing</div>
          <h2 className="mt-3 text-[28px] font-semibold leading-[1.1] tracking-[-0.02em] sm:text-[34px] md:text-[40px]">Priced for agencies, not enterprises.</h2>
          <p className="mt-3 text-[15px] text-muted-foreground">Flat monthly pricing per agency. Grow as you add clients — not as you add seats.</p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-12 lg:grid-cols-4">
          {tiers.map(t => (
            <div key={t.name} className={`flex flex-col rounded-2xl border bg-background p-5 ${t.pop ? "border-foreground shadow-pop" : "border-border"}`}>
              {t.pop ? <div className="mb-3 inline-flex w-fit chip-indigo">Most popular</div> : <div className="mb-3 h-[22px]" />}
              <div className="text-[13px] font-medium text-muted-foreground">{t.name}</div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-[34px] font-semibold tracking-tight md:text-[38px]">${t.price}</span>
                <span className="text-[13px] text-muted-foreground">/mo</span>
              </div>
              <div className="mt-1 text-[12.5px] text-muted-foreground">{t.sub}</div>
              <Link to="/book-demo" className={`mt-5 flex h-10 items-center justify-center rounded-lg text-[13px] font-medium ${t.pop ? "bg-foreground text-background hover:bg-foreground/90" : "border border-border bg-background text-foreground hover:bg-[var(--surface-2)]"}`}>
                Start 14-day trial
              </Link>
              <ul className="mt-5 space-y-2">
                {t.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-[12.5px]">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--success)]" />
                    <span className="text-foreground/85">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-dashed border-border bg-background p-5">
          <div>
            <div className="text-[14px] font-semibold">Enterprise · custom</div>
            <div className="text-[12.5px] text-muted-foreground">50+ clients, SSO, custom contracts, multi-brand white-label, dedicated infrastructure.</div>
          </div>
          <Link to="/book-demo" className="inline-flex h-10 items-center rounded-lg border border-border bg-background px-4 text-[13px] font-medium hover:bg-[var(--surface-2)]">Talk to sales <ArrowRight className="ml-1.5 h-3.5 w-3.5" /></Link>
        </div>
        <div className="mt-4 text-center"><Link to="/pricing" className="text-[13px] font-medium text-[var(--accent)] hover:underline">Compare plans →</Link></div>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */

function FAQ() {
  const faqs: [string, string, any?][] = [
    ["Is Orvio actually white-label?","Yes. Your logo, custom domain (portal.youragency.com), brand colors, and email sender. Clients never see Orvio branding."],
    ["Which ad platforms do you support?","Meta Ads (Facebook + Instagram) and Google Ads — Search, Performance Max, and Demand Gen.", BarChart3],
    ["How does data import work today?","You can connect Meta and Google through OAuth, or — if you'd rather stay manual to start — import CSVs and enter spend manually. Direct API sync is shipped for most accounts; full automation for every ad object is on our Q3 2026 roadmap.", Upload],
    ["Where does my agency and client data live?","All data is stored encrypted at rest in US-based infrastructure. Your client data is scoped to your workspace — other Orvio agencies can never see it. We never sell or share data, and we don't train models on it.", Lock],
    ["Do you do the work for us?","No. Orvio is software. Your team runs the campaigns. Orvio is the operating system that makes running and reporting them easier."],
    ["What's actually on the roadmap right now?","AI Content Studio with per-client brand memory, multi-brand white-label, financing links, public API, and SSO. See the roadmap section above for current ETAs.", MapIcon],
    ["What about payments?","Stripe Connect — invoices and recurring subscriptions flow through your account directly. We never touch the money. Financing links are coming Q4 2026.", CreditCard],
    ["Can clients log in on mobile?","Yes. The client portal is fully responsive. Contractors check leads and approvals from their truck.", Smartphone],
  ];
  return (
    <section className="hairline-t py-20 md:py-24">
      <div className="mx-auto max-w-[860px] px-6">
        <div className="text-center">
          <div className="chip">FAQ</div>
          <h2 className="mt-3 text-[26px] font-semibold leading-[1.1] tracking-[-0.02em] sm:text-[32px]">Common questions</h2>
        </div>
        <div className="mt-10 divide-y divide-border rounded-2xl border border-border bg-background">
          {faqs.map(([q,a,Icon]) => (
            <details key={q} className="group px-5 py-4 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between gap-3 text-[14px] font-medium md:text-[14.5px]">
                <span className="flex items-center gap-2">
                  {Icon ? <Icon className="h-4 w-4 shrink-0 text-[var(--accent)]" /> : null}
                  {q}
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
              </summary>
              <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">{a}</p>
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
    <section className="hairline-t hero-bg relative overflow-hidden py-20 md:py-24">
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="relative mx-auto max-w-[900px] px-6 text-center">
        <h2 className="text-[28px] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[36px] md:text-[48px]">
          Give every client a portal that proves your work.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-[15px] text-muted-foreground">
          14-day trial. White-label your account in under 20 minutes. Cancel anytime.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link to="/book-demo" className="inline-flex h-11 items-center gap-1.5 rounded-lg bg-foreground px-5 text-[14px] font-medium text-background hover:bg-foreground/90">
            Book a demo <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/demo" className="inline-flex h-11 items-center gap-1.5 rounded-lg border border-border bg-background px-5 text-[14px] font-medium hover:bg-[var(--surface-2)]">
            Explore the live demo
          </Link>
        </div>
      </div>
    </section>
  );
}
