import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronDown,
  CircleDot,
  ClipboardList,
  CreditCard,
  FileSignature,
  FileText,
  Gauge,
  LineChart,
  Lock,
  type LucideIcon,
  Megaphone,
  MessageSquare,
  Plus,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Wand2,
  Zap,
} from "lucide-react";
import { Nav } from "@/components/orvio/Nav";
import { Footer } from "@/components/orvio/Footer";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "Orvio — The agency OS for client delivery and AI campaign production" },
      {
        name: "description",
        content:
          "Orvio is the white-label agency OS that combines client delivery, reporting, billing, and an AI creative studio that ships campaigns to Meta — in one workspace.",
      },
    ],
  }),
});

/* ---------- Primitives ---------- */

function Reveal({ children, delay = 0, y = 24 }: { children: React.ReactNode; delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 mono-eyebrow text-indigo">
      <span className="h-px w-6 bg-indigo/60" />
      {children}
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  sub,
  center,
}: {
  eyebrow: string;
  title: React.ReactNode;
  sub?: React.ReactNode;
  center?: boolean;
}) {
  return (
    <div className={`max-w-3xl ${center ? "mx-auto text-center" : ""}`}>
      <Reveal>
        <Eyebrow>{eyebrow}</Eyebrow>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="mt-4 text-[clamp(2rem,4.2vw,3.4rem)] font-semibold leading-[1.05] tracking-tight">
          {title}
        </h2>
      </Reveal>
      {sub && (
        <Reveal delay={0.1}>
          <p className="mt-5 text-[17px] leading-relaxed text-text-muted">{sub}</p>
        </Reveal>
      )}
    </div>
  );
}

function PrimaryCTA({ children, to = "/signup" }: { children: React.ReactNode; to?: "/signup" | "/demo" }) {
  return (
    <Link
      to={to}
      className="group inline-flex h-11 items-center gap-2 rounded-lg bg-indigo px-5 text-[14px] font-medium text-white transition-all hover:bg-indigo/90 shadow-[0_10px_40px_-10px_rgba(99,102,241,0.7)]"
    >
      {children}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

function SecondaryCTA({ children, to = "/demo" }: { children: React.ReactNode; to?: "/signup" | "/demo" }) {
  return (
    <Link
      to={to}
      className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-surface/60 px-5 text-[14px] font-medium text-foreground backdrop-blur transition-all hover:border-indigo/40 hover:bg-surface"
    >
      {children}
    </Link>
  );
}

/* ---------- Hero Mockup ---------- */

function StatTile({
  label,
  value,
  delta,
  tone = "default",
  icon: Icon,
}: {
  label: string;
  value: string;
  delta?: string;
  tone?: "default" | "good" | "warn" | "bad";
  icon: LucideIcon;
}) {
  const toneCls =
    tone === "good"
      ? "text-success"
      : tone === "warn"
        ? "text-warning"
        : tone === "bad"
          ? "text-danger"
          : "text-text-muted";
  return (
    <div className="surface-elev p-3.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-text-muted">{label}</span>
        <Icon className="h-3.5 w-3.5 text-text-faint" />
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="mono text-[20px] font-semibold tracking-tight text-foreground">{value}</span>
        {delta && <span className={`mono text-[11px] ${toneCls}`}>{delta}</span>}
      </div>
    </div>
  );
}

function MiniBars() {
  const heights = [40, 62, 48, 78, 56, 84, 72, 90, 66, 95, 80, 88];
  return (
    <div className="flex h-16 items-end gap-1">
      {heights.map((h, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: `${h}%` }}
          transition={{ duration: 0.9, delay: 0.4 + i * 0.04, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 rounded-sm bg-gradient-to-t from-indigo/30 to-indigo"
        />
      ))}
    </div>
  );
}

function HeroMockup() {
  return (
    <div className="relative">
      {/* Glow */}
      <div className="pointer-events-none absolute -inset-20 -z-10">
        <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo/30 blur-[120px]" />
        <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-orange/20 blur-[120px]" />
      </div>

      {/* Browser chrome */}
      <div className="surface-card overflow-hidden shadow-soft">
        <div className="flex items-center gap-2 border-b border-border bg-surface-elevated/60 px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#3b3f55]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#3b3f55]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#3b3f55]" />
          </div>
          <div className="ml-3 flex items-center gap-2 rounded-md border border-border bg-background/60 px-2.5 py-1">
            <Lock className="h-3 w-3 text-text-faint" />
            <span className="mono text-[11px] text-text-muted">app.orvio.io/dashboard</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="chip-neutral mono text-[10px]"><span className="h-1.5 w-1.5 rounded-full bg-success live-dot" /> Live</span>
          </div>
        </div>

        {/* App body */}
        <div className="grid grid-cols-[180px_1fr]">
          {/* Sidebar */}
          <div className="border-r border-border bg-background/40 p-3">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-text-faint">Workspace</div>
            <div className="mt-2 flex items-center gap-2 rounded-md bg-surface-elevated px-2 py-1.5">
              <span className="h-5 w-5 rounded bg-gradient-to-br from-indigo to-indigo/50" />
              <span className="text-[12px] font-medium">GrowthDesk</span>
            </div>
            <ul className="mt-4 space-y-0.5 text-[12px]">
              {[
                { l: "Dashboard", a: true },
                { l: "Clients" },
                { l: "Reports" },
                { l: "Creative Studio" },
                { l: "Contracts" },
                { l: "Billing" },
                { l: "Team" },
              ].map((i) => (
                <li
                  key={i.l}
                  className={`rounded px-2 py-1.5 ${i.a ? "bg-indigo/15 text-foreground" : "text-text-muted hover:text-foreground"}`}
                >
                  {i.l}
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-md border border-border bg-surface-elevated p-2.5">
              <div className="text-[10px] uppercase tracking-wider text-text-faint">Studio credits</div>
              <div className="mt-1 mono text-[15px] font-semibold">847</div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-background">
                <div className="h-full w-[58%] rounded-full bg-gradient-to-r from-indigo to-indigo/60" />
              </div>
            </div>
          </div>

          {/* Main */}
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] text-text-muted">Agency overview</div>
                <div className="text-[15px] font-semibold">Last 30 days</div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="chip text-[10px]"><Sparkles className="h-3 w-3" /> AI digest ready</span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-4 gap-2.5">
              <StatTile label="Clients" value="24" delta="+3" tone="good" icon={Users} />
              <StatTile label="Health" value="92%" delta="+4" tone="good" icon={Gauge} />
              <StatTile label="Approvals" value="6" delta="pending" tone="warn" icon={ClipboardList} />
              <StatTile label="Churn risk" value="2" delta="watch" tone="bad" icon={Target} />
            </div>

            <div className="mt-3 grid grid-cols-[1.4fr_1fr] gap-2.5">
              <div className="surface-elev p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-text-muted">Total ad spend</span>
                  <span className="mono text-[10px] text-success">+18.4%</span>
                </div>
                <div className="mt-1 flex items-baseline gap-3">
                  <span className="mono text-[22px] font-semibold tracking-tight">$184,720</span>
                  <span className="mono text-[11px] text-text-muted">3,412 leads · $54.12 CPL</span>
                </div>
                <div className="mt-3">
                  <MiniBars />
                </div>
              </div>

              <div className="surface-elev p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-text-muted">Booked calls</span>
                  <LineChart className="h-3.5 w-3.5 text-text-faint" />
                </div>
                <div className="mt-1 mono text-[22px] font-semibold">412</div>
                <div className="mt-2 space-y-1.5 text-[11px]">
                  <div className="flex justify-between"><span className="text-text-muted">HVAC clients</span><span className="mono">186</span></div>
                  <div className="flex justify-between"><span className="text-text-muted">Remodelers</span><span className="mono">98</span></div>
                  <div className="flex justify-between"><span className="text-text-muted">Movers</span><span className="mono">128</span></div>
                </div>
              </div>
            </div>

            {/* Creative approval card */}
            <div className="mt-3 surface-elev p-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-md bg-indigo/15 text-indigo">
                    <Wand2 className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <div className="text-[12px] font-medium">Summer HVAC promo — concept 03</div>
                    <div className="mono text-[10px] text-text-muted">Sonnet · 4 variants · audit 91/100</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="chip-neutral mono text-[10px] text-warning">awaiting AM</span>
                  <button className="rounded-md bg-indigo px-2.5 py-1 text-[11px] font-medium text-white">Approve</button>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-1.5">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="aspect-[4/5] rounded-md border border-border bg-gradient-to-br from-surface-elevated to-background"
                  >
                    <div className="flex h-full flex-col justify-between p-1.5">
                      <span className="mono text-[9px] text-text-faint">0{i}</span>
                      <span className="mono text-[9px] text-success">{[91, 88, 94, 86][i - 1]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating side card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="absolute -right-4 -bottom-6 hidden w-60 glass-card p-3.5 lg:block"
      >
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-danger/15 text-danger">
            <CircleDot className="h-3.5 w-3.5" />
          </span>
          <div className="text-[12px] font-medium">Churn alert</div>
        </div>
        <div className="mt-2 text-[11.5px] text-text-muted leading-relaxed">
          <span className="text-foreground font-medium">Northshore Movers</span> — CPL up 31%, portal logins down. Health 64.
        </div>
        <button className="mt-2.5 inline-flex items-center gap-1 text-[11px] text-indigo hover:text-indigo/80">
          Open client <ArrowUpRight className="h-3 w-3" />
        </button>
      </motion.div>
    </div>
  );
}

/* ---------- Hero ---------- */

function Hero() {
  return (
    <section className="relative overflow-hidden hero-bg pt-32 pb-24 sm:pt-40 sm:pb-32">
      <div className="absolute inset-0 grid-bg" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo/40 to-transparent" />

      <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 gap-12 px-6 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-10">
        <div>
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1.5 backdrop-blur">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo/70 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-indigo" />
              </span>
              <span className="text-[12px] font-medium text-foreground">v1.0 · now in private beta</span>
              <span className="text-[12px] text-text-faint">·</span>
              <span className="mono text-[11px] text-text-muted">Built for agencies</span>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="mt-6 text-[clamp(2.4rem,5.6vw,4.4rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
              The agency OS for{" "}
              <span className="text-gradient-orvio">client delivery</span> and AI campaign{" "}
              <span className="text-foreground/70">production.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-text-muted">
              Orvio helps agencies manage clients, prove performance, generate reports, build ad creative,
              approve assets, and deliver a white-labeled client portal — from one workspace.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <PrimaryCTA>Start free trial</PrimaryCTA>
              <SecondaryCTA>Book a demo</SecondaryCTA>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-2 max-w-lg">
              {[
                "White-label client portals",
                "Built for agencies",
                "Shared workspace credits",
                "Client data stays organized",
              ].map((t) => (
                <div key={t} className="flex items-center gap-2 text-[13px] text-text-muted">
                  <Check className="h-3.5 w-3.5 text-indigo" />
                  {t}
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1} y={32}>
          <HeroMockup />
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Problem ---------- */

function ProblemSection() {
  const items = [
    { icon: FileText, title: "Reports take too long", body: "Hours rebuilding the same monthly story across Meta, Google, GA4, and a spreadsheet." },
    { icon: Wand2, title: "Creative approvals get lost", body: "Slack threads, drive folders, and DMs replace a real review workflow." },
    { icon: ShieldCheck, title: "Portals aren't truly white-labeled", body: "Most tools leak their own branding the moment a client logs in." },
    { icon: ClipboardList, title: "Campaign history is scattered", body: "No clean record of briefs, creatives, audits, and approvals per client." },
  ];
  return (
    <section className="relative border-t border-border py-28">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-8">
        <SectionHeading
          eyebrow="01 — The Problem"
          title="Agencies are held together by too many tools."
          sub="Reports in one place, contracts in another, briefs in a third, approvals in a thread. Orvio collapses all of it into a single workspace built for agency operators."
        />
        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 0.06}>
              <div className="group surface-card h-full p-6 transition-all hover:border-indigo/40 hover:-translate-y-0.5">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-indigo/10 text-indigo">
                  <it.icon className="h-4.5 w-4.5" />
                </span>
                <h3 className="mt-5 text-[16px] font-semibold">{it.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-text-muted">{it.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Two layers ---------- */

function TwoLayers() {
  return (
    <section id="product" className="relative border-t border-border py-28">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-8">
        <SectionHeading
          eyebrow="02 — Product"
          title={<>One workspace. <span className="text-gradient-orvio">Two operating layers.</span></>}
          sub="Client OS runs the relationship after the sale. Creative Studio builds the work that fuels it. Both share one client record, one credit pool, and one team."
        />

        <div className="relative mt-14 grid gap-5 lg:grid-cols-2">
          {/* Connector */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-px w-24 -translate-x-1/2 -translate-y-1/2 lg:block">
            <svg viewBox="0 0 100 8" className="h-full w-full">
              <line x1="0" y1="4" x2="100" y2="4" stroke="rgba(99,102,241,0.5)" strokeWidth="1" strokeDasharray="4 4" className="flow-line" />
            </svg>
          </div>

          <Reveal>
            <LayerCard
              tone="indigo"
              kicker="Layer 01"
              title="Client OS"
              desc="Run the client relationship after the sale."
              chips={["Campaign dashboards", "AI reports", "Contracts", "Invoices", "Onboarding", "Lead speed", "Churn risk"]}
              icon={Users}
            />
          </Reveal>
          <Reveal delay={0.08}>
            <LayerCard
              tone="orange"
              kicker="Layer 02"
              title="Creative Studio"
              desc="Build, audit, approve, and ship campaign creative."
              chips={["Campaign briefs", "AI copy", "Image concepts", "Audit scores", "Approval workflow", "Review links", "Push to Meta"]}
              icon={Wand2}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function LayerCard({
  tone,
  kicker,
  title,
  desc,
  chips,
  icon: Icon,
}: {
  tone: "indigo" | "orange";
  kicker: string;
  title: string;
  desc: string;
  chips: string[];
  icon: LucideIcon;
}) {
  const accent = tone === "indigo" ? "from-indigo/20 to-transparent" : "from-orange/20 to-transparent";
  const ring = tone === "indigo" ? "ring-indigo/30" : "ring-orange/30";
  const iconBg = tone === "indigo" ? "bg-indigo/15 text-indigo" : "bg-orange/15 text-orange";
  return (
    <div className="group relative h-full overflow-hidden surface-card p-8 transition-all hover:-translate-y-0.5">
      <div className={`pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-br ${accent} blur-3xl opacity-60`} />
      <div className="relative">
        <div className="flex items-center justify-between">
          <span className="mono-eyebrow">{kicker}</span>
          <span className={`grid h-10 w-10 place-items-center rounded-lg ${iconBg} ring-1 ${ring}`}>
            <Icon className="h-4.5 w-4.5" />
          </span>
        </div>
        <h3 className="mt-5 text-[28px] font-semibold tracking-tight">{title}</h3>
        <p className="mt-2 text-[15px] text-text-muted">{desc}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {chips.map((c) => (
            <span key={c} className="chip-neutral">
              {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Workflow ---------- */

const WORKFLOW = [
  { n: "01", title: "Add client", body: "Spin up a sub-account with branding, contacts, and integrations.", icon: Plus },
  { n: "02", title: "Generate onboarding checklist", body: "AI scaffolds onboarding tasks scoped to the client's industry.", icon: ClipboardList },
  { n: "03", title: "Pull campaign metrics", body: "Live Meta and Google Ads data into a single dashboard.", icon: BarChart3 },
  { n: "04", title: "Generate monthly report", body: "Turn metrics into a plain-English client update.", icon: FileText },
  { n: "05", title: "Create campaign brief", body: "Briefs pre-filled from the client record.", icon: Megaphone },
  { n: "06", title: "Generate ad concepts", body: "4–8 concepts with copy, image prompts, and audit scores.", icon: Wand2 },
  { n: "07", title: "Approve creative", body: "Media Buyer → AM → Owner. Branded client review links.", icon: Check },
  { n: "08", title: "Push to Meta", body: "One click ships approved assets to Meta Ads Manager.", icon: Send },
  { n: "09", title: "Track performance & churn risk", body: "CPL, response time, portal activity, payment health.", icon: Gauge },
];

function Workflow() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const lineLength = useTransform(scrollYProgress, [0.1, 0.9], [0, 1]);

  return (
    <section ref={ref} className="relative border-t border-border py-28">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-8">
        <SectionHeading
          eyebrow="03 — Workflow"
          title="From new client to live campaign — without context switching."
          sub="Every step lives in the same workspace. Every artifact attaches to the same client record."
        />

        <div className="relative mt-16">
          {/* Vertical line */}
          <div className="pointer-events-none absolute left-6 top-0 bottom-0 hidden w-px bg-border lg:left-1/2 lg:block" />
          <motion.div
            style={{ scaleY: lineLength }}
            className="pointer-events-none absolute left-6 top-0 bottom-0 hidden w-px origin-top bg-gradient-to-b from-indigo via-indigo/60 to-transparent lg:left-1/2 lg:block"
          />

          <div className="space-y-10">
            {WORKFLOW.map((step, i) => {
              const right = i % 2 === 1;
              return (
                <Reveal key={step.n} delay={0.04} y={28}>
                  <div className={`grid items-center gap-6 lg:grid-cols-2 ${right ? "lg:[&>*:first-child]:order-2" : ""}`}>
                    <div className={right ? "lg:pl-12" : "lg:pr-12 lg:text-right"}>
                      <span className="mono-eyebrow text-indigo">Step {step.n}</span>
                      <h4 className="mt-2 text-[22px] font-semibold tracking-tight">{step.title}</h4>
                      <p className="mt-2 text-[14.5px] text-text-muted">{step.body}</p>
                    </div>
                    <div className={right ? "lg:pr-12 lg:text-right" : "lg:pl-12"}>
                      <WorkflowMiniCard step={step} />
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function WorkflowMiniCard({ step }: { step: (typeof WORKFLOW)[number] }) {
  return (
    <div className="surface-card p-4 inline-block min-w-[260px] text-left shadow-soft">
      <div className="flex items-center gap-2.5">
        <span className="grid h-8 w-8 place-items-center rounded-md bg-indigo/15 text-indigo">
          <step.icon className="h-4 w-4" />
        </span>
        <div>
          <div className="mono text-[10px] text-text-faint">orvio.workflow / {step.n}</div>
          <div className="text-[13px] font-medium">{step.title}</div>
        </div>
        <span className="ml-auto chip mono text-[10px]"><Zap className="h-3 w-3" /> auto</span>
      </div>
      <div className="mt-3 flex items-center gap-1.5">
        {[0, 1, 2, 3].map((j) => (
          <div key={j} className="h-1 flex-1 rounded-full bg-border">
            <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-indigo to-indigo/40" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Client OS deep dive ---------- */

function ClientOSDeepDive() {
  const [tab, setTab] = useState("reports");
  const tabs = [
    { id: "reports", label: "Reports" },
    { id: "contracts", label: "Contracts" },
    { id: "invoices", label: "Invoices" },
    { id: "onboarding", label: "Onboarding" },
    { id: "notes", label: "Notes" },
    { id: "creative", label: "Creative" },
  ];
  return (
    <section id="use-cases" className="relative border-t border-border py-28">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-8">
        <SectionHeading
          eyebrow="04 — Client OS"
          title="Client delivery without the messy backend."
          sub="A single client record holds the campaign, the reports, the contracts, the invoices, the onboarding, and the creative history."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          <div className="surface-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="h-8 w-8 rounded-md bg-gradient-to-br from-indigo to-indigo/50" />
                <div>
                  <div className="text-[13px] font-medium">Apex HVAC of Tampa</div>
                  <div className="mono text-[10.5px] text-text-muted">Client · since Mar 2025 · health 94</div>
                </div>
              </div>
              <span className="chip-neutral mono text-[10px] text-success"><span className="h-1.5 w-1.5 rounded-full bg-success" /> Active</span>
            </div>
            <div className="flex gap-1 border-b border-border bg-background/40 px-2 py-2 overflow-x-auto">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`whitespace-nowrap rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors ${
                    tab === t.id ? "bg-surface-elevated text-foreground" : "text-text-muted hover:text-foreground"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="p-4">
              {tab === "reports" && <ReportsPanel />}
              {tab === "contracts" && <ContractsPanel />}
              {tab === "invoices" && <InvoicesPanel />}
              {tab === "onboarding" && <OnboardingPanel />}
              {tab === "notes" && <NotesPanel />}
              {tab === "creative" && <CreativeHistoryPanel />}
            </div>
          </div>

          <div className="space-y-3">
            <FeatureCard
              icon={ShieldCheck}
              title="White-label portals"
              body="Your clients see your brand, your domain, and your reporting experience. Orvio stays invisible."
            />
            <FeatureCard
              icon={FileText}
              title="AI monthly reports"
              body="Turn campaign metrics into plain-English client updates. Edit, brand, and send."
            />
            <FeatureCard
              icon={FileSignature}
              title="Contracts & billing"
              body="Send contracts, collect signatures, invoice clients, and manage recurring billing."
            />
            <FeatureCard
              icon={Target}
              title="Churn risk detection"
              body="Declining performance, late payments, slow lead response, low portal activity — flagged before clients leave."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon: Icon, title, body }: { icon: LucideIcon; title: string; body: string }) {
  return (
    <Reveal>
      <div className="group surface-card p-5 transition-all hover:border-indigo/40">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-indigo/10 text-indigo">
            <Icon className="h-4 w-4" />
          </span>
          <div>
            <h4 className="text-[15px] font-semibold">{title}</h4>
            <p className="mt-1 text-[13.5px] text-text-muted leading-relaxed">{body}</p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function ReportsPanel() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[13px] font-medium">November 2025 performance report</div>
          <div className="mono text-[10.5px] text-text-muted">Generated · 30 credits · Sonnet</div>
        </div>
        <button className="rounded-md bg-indigo px-3 py-1.5 text-[11px] font-medium text-white">Send to client</button>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <Stat sm label="Spend" value="$24,840" delta="+12%" tone="good" />
        <Stat sm label="Leads" value="612" delta="+18%" tone="good" />
        <Stat sm label="CPL" value="$40.59" delta="−5%" tone="good" />
      </div>
      <div className="mt-3 rounded-md border border-border bg-background/40 p-3 text-[12.5px] leading-relaxed text-text-muted">
        “Apex HVAC ran a strong November. Lead volume climbed 18% month-over-month while CPL dropped to $40.59,
        driven by the new fall tune-up offer and tightened geo targeting...”
      </div>
    </div>
  );
}
function ContractsPanel() {
  return (
    <div className="space-y-2">
      {[
        { name: "MSA — Retainer", status: "Signed", tone: "good" },
        { name: "Q1 SOW — Meta + Google", status: "Awaiting client", tone: "warn" },
        { name: "Creative addendum", status: "Draft", tone: "muted" },
      ].map((c) => (
        <div key={c.name} className="flex items-center justify-between rounded-md border border-border bg-background/40 px-3 py-2.5">
          <div className="flex items-center gap-2.5">
            <FileSignature className="h-4 w-4 text-text-muted" />
            <span className="text-[13px]">{c.name}</span>
          </div>
          <span className={`chip-neutral mono text-[10px] ${c.tone === "good" ? "text-success" : c.tone === "warn" ? "text-warning" : "text-text-muted"}`}>{c.status}</span>
        </div>
      ))}
    </div>
  );
}
function InvoicesPanel() {
  return (
    <div className="space-y-2">
      {[
        { id: "INV-2031", amount: "$3,500", status: "Paid", tone: "good" },
        { id: "INV-2032", amount: "$3,500", status: "Due Dec 1", tone: "warn" },
        { id: "INV-2033", amount: "$8,200", status: "Scheduled", tone: "muted" },
      ].map((c) => (
        <div key={c.id} className="flex items-center justify-between rounded-md border border-border bg-background/40 px-3 py-2.5">
          <div className="flex items-center gap-2.5">
            <CreditCard className="h-4 w-4 text-text-muted" />
            <span className="mono text-[12.5px]">{c.id}</span>
            <span className="mono text-[12.5px] text-foreground">{c.amount}</span>
          </div>
          <span className={`chip-neutral mono text-[10px] ${c.tone === "good" ? "text-success" : c.tone === "warn" ? "text-warning" : "text-text-muted"}`}>{c.status}</span>
        </div>
      ))}
    </div>
  );
}
function OnboardingPanel() {
  return (
    <ul className="space-y-2 text-[13px]">
      {[
        { l: "Connect Meta Ads account", d: true },
        { l: "Connect Google Ads", d: true },
        { l: "Upload brand assets", d: true },
        { l: "Set lead-routing destination", d: false },
        { l: "Confirm offer & tracking", d: false },
      ].map((i) => (
        <li key={i.l} className="flex items-center gap-3 rounded-md border border-border bg-background/40 px-3 py-2">
          <span className={`grid h-4 w-4 place-items-center rounded-sm border ${i.d ? "bg-success/20 border-success/40 text-success" : "border-border text-transparent"}`}>
            <Check className="h-3 w-3" />
          </span>
          <span className={i.d ? "text-text-muted line-through" : ""}>{i.l}</span>
        </li>
      ))}
    </ul>
  );
}
function NotesPanel() {
  return (
    <div className="space-y-2">
      {[
        { who: "Maya · AM", t: "Client wants to test fall tune-up offer at $89.", d: "2d" },
        { who: "Jordan · Buyer", t: "Pausing the wide audience — CTR dropped after Oct 28.", d: "4d" },
        { who: "Owner", t: "Renewed retainer through Q1.", d: "1w" },
      ].map((n) => (
        <div key={n.t} className="rounded-md border border-border bg-background/40 px-3 py-2.5">
          <div className="flex items-center justify-between">
            <span className="mono text-[10.5px] text-text-muted">{n.who}</span>
            <span className="mono text-[10.5px] text-text-faint">{n.d}</span>
          </div>
          <p className="mt-1 text-[13px]">{n.t}</p>
        </div>
      ))}
    </div>
  );
}
function CreativeHistoryPanel() {
  return (
    <div className="grid grid-cols-3 gap-2">
      {[
        { n: "Fall tune-up · 04 variants", s: 94 },
        { n: "Emergency repair · 06 variants", s: 88 },
        { n: "Maintenance plan · 04 variants", s: 91 },
        { n: "Summer cooling · 06 variants", s: 89 },
        { n: "Smart thermostat · 04 variants", s: 92 },
        { n: "Financing offer · 04 variants", s: 86 },
      ].map((c) => (
        <div key={c.n} className="rounded-md border border-border bg-background/40 p-2.5">
          <div className="aspect-[4/3] rounded bg-gradient-to-br from-surface-elevated to-background" />
          <div className="mt-2 text-[11.5px]">{c.n}</div>
          <div className="mt-1 mono text-[10.5px] text-success">audit {c.s}/100</div>
        </div>
      ))}
    </div>
  );
}
function Stat({ label, value, delta, tone, sm }: { label: string; value: string; delta?: string; tone?: "good" | "warn" | "bad"; sm?: boolean }) {
  const toneCls = tone === "good" ? "text-success" : tone === "warn" ? "text-warning" : tone === "bad" ? "text-danger" : "text-text-muted";
  return (
    <div className={`surface-elev ${sm ? "p-3" : "p-4"}`}>
      <div className="text-[11px] text-text-muted">{label}</div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className={`mono ${sm ? "text-[16px]" : "text-[20px]"} font-semibold`}>{value}</span>
        {delta && <span className={`mono text-[11px] ${toneCls}`}>{delta}</span>}
      </div>
    </div>
  );
}

/* ---------- Creative Studio ---------- */

function StudioSection() {
  return (
    <section className="relative border-t border-border py-28">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-8">
        <SectionHeading
          eyebrow="05 — Creative Studio"
          title="Campaign production built into the client workflow."
          sub="Briefs attach to a client record. Concepts come back scored. Approvals route through real roles. Approved creative ships to Meta in one click."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div className="space-y-3">
            <FeatureCard icon={Target} title="Client-scoped briefs" body="Every brief is attached to a client record. Offer, geo, audience, prior winners — already filled in." />
            <FeatureCard icon={Sparkles} title="AI creative generation" body="Generate hooks, copy, image prompts, and concepts with Haiku, Sonnet, or Opus." />
            <FeatureCard icon={ShieldCheck} title="Audit scoring" body="Score every concept for offer clarity, policy risk, CTA alignment, and quality." />
            <FeatureCard icon={Users} title="Approval workflow" body="Media buyers, account managers, and owners review before anything goes live." />
          </div>

          <div className="surface-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <Wand2 className="h-4 w-4 text-indigo" />
                <span className="text-[13px] font-medium">Creative Studio · New brief</span>
              </div>
              <span className="chip mono text-[10px]">Apex HVAC of Tampa</span>
            </div>
            <div className="grid grid-cols-[1fr_auto] gap-4 p-4">
              <div className="space-y-3">
                <Field label="Campaign goal" value="Fall tune-up · lead form" />
                <Field label="Offer" value="$89 full system tune-up · ends Nov 30" />
                <Field label="Audience" value="Tampa metro · homeowners 35–65" />
              </div>
              <div className="w-44 space-y-3">
                <div>
                  <div className="mono-eyebrow">Model</div>
                  <div className="mt-2 space-y-1.5">
                    {[
                      { l: "Haiku", c: "10" },
                      { l: "Sonnet", c: "25", active: true },
                      { l: "Opus", c: "60" },
                    ].map((m) => (
                      <div
                        key={m.l}
                        className={`flex items-center justify-between rounded-md border px-2.5 py-1.5 ${m.active ? "border-indigo/50 bg-indigo/10" : "border-border bg-background/40"}`}
                      >
                        <span className="text-[12px]">{m.l}</span>
                        <span className="mono text-[10.5px] text-text-muted">{m.c} cr</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-md border border-border bg-background/40 p-2.5">
                  <div className="mono-eyebrow">Credits required</div>
                  <div className="mt-1 mono text-[18px] font-semibold">85</div>
                  <div className="mono text-[10px] text-text-muted">brief 25 · 4 images 60</div>
                </div>
                <button className="w-full rounded-md bg-indigo py-2 text-[12px] font-medium text-white">Generate 4 concepts</button>
              </div>
            </div>
            <div className="border-t border-border p-4">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium">Generated concepts</span>
                <span className="chip-neutral mono text-[10px] text-warning">3 awaiting AM</span>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {[
                  { s: 94, st: "approved" },
                  { s: 91, st: "pending" },
                  { s: 88, st: "pending" },
                  { s: 86, st: "pending" },
                ].map((c, i) => (
                  <div key={i} className="rounded-md border border-border bg-background/40 p-2">
                    <div className="aspect-[4/5] rounded bg-gradient-to-br from-surface-elevated to-background" />
                    <div className="mt-2 flex items-center justify-between">
                      <span className="mono text-[10px] text-text-muted">0{i + 1}</span>
                      <span className={`mono text-[10px] ${c.s >= 90 ? "text-success" : "text-warning"}`}>{c.s}</span>
                    </div>
                    <div className="mt-1 mono text-[9.5px] text-text-faint capitalize">{c.st}</div>
                  </div>
                ))}
              </div>
              <button className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-orange/40 bg-orange/10 px-3 py-1.5 text-[12px] font-medium text-orange">
                <Send className="h-3.5 w-3.5" /> Push approved to Meta
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-background/40 px-3 py-2">
      <div className="mono-eyebrow">{label}</div>
      <div className="mt-1 text-[13px]">{value}</div>
    </div>
  );
}

/* ---------- White label ---------- */

function WhiteLabel() {
  return (
    <section className="relative border-t border-border py-28">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-8">
        <SectionHeading
          eyebrow="06 — White label"
          title={<>Your clients <span className="text-gradient-orvio">never see Orvio.</span></>}
          sub="Brand the portal with your logo, platform name, color, and custom domain. Reports, contracts, invoices, and dashboards — all yours."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          <Reveal>
            <PortalCard
              label="Agency side · Orvio"
              brand="ORVIO"
              role="Workspace"
              name="GrowthDesk team"
              tone="indigo"
              footer="Internal · agency team only"
            />
          </Reveal>
          <Reveal delay={0.08}>
            <PortalCard
              label="Client side · white-labeled"
              brand="GROWTHDESK"
              role="Client portal"
              name="Apex HVAC of Tampa"
              tone="brand"
              footer="growthdesk.app/clients/apex"
            />
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="mt-6 grid gap-2 md:grid-cols-2 lg:grid-cols-4">
            {[
              "Agency logo",
              "Platform name",
              "Brand color",
              "Custom domain",
              "Client-facing reports",
              "Contracts",
              "Invoices",
              "Campaign dashboard",
            ].map((t) => (
              <div key={t} className="flex items-center gap-2 surface-card px-3.5 py-2.5 text-[13px]">
                <Check className="h-3.5 w-3.5 text-indigo" />
                {t}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function PortalCard({
  label,
  brand,
  role,
  name,
  tone,
  footer,
}: {
  label: string;
  brand: string;
  role: string;
  name: string;
  tone: "indigo" | "brand";
  footer: string;
}) {
  const accent = tone === "indigo" ? "from-indigo/30" : "from-emerald-400/30";
  const dot = tone === "indigo" ? "bg-indigo" : "bg-emerald-400";
  return (
    <div className="relative overflow-hidden surface-card p-6 shadow-soft">
      <div className={`pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-gradient-to-br ${accent} to-transparent blur-3xl`} />
      <div className="relative">
        <div className="flex items-center justify-between">
          <span className="mono-eyebrow">{label}</span>
          <span className={`h-2 w-2 rounded-full ${dot}`} />
        </div>
        <div className="mt-5 flex items-center gap-2.5">
          <span className={`grid h-9 w-9 place-items-center rounded-md ${tone === "indigo" ? "bg-indigo" : "bg-emerald-400/80"} text-white text-[13px] font-bold tracking-tight`}>
            {brand.slice(0, 2)}
          </span>
          <div>
            <div className="text-[15px] font-semibold tracking-tight">{brand}</div>
            <div className="mono text-[10.5px] text-text-muted">{role}</div>
          </div>
        </div>

        <div className="mt-5 rounded-lg border border-border bg-background/50 p-4">
          <div className="text-[13px] font-medium">{name}</div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <MiniStat l="Spend" v="$24.8k" />
            <MiniStat l="Leads" v="612" />
            <MiniStat l="CPL" v="$40.59" />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-border">
              <div className={`h-full w-3/4 ${tone === "indigo" ? "bg-indigo" : "bg-emerald-400"}`} />
            </div>
            <span className="mono text-[10px] text-text-muted">monthly pacing</span>
          </div>
        </div>

        <div className="mt-4 mono text-[10.5px] text-text-faint">{footer}</div>
      </div>
    </div>
  );
}
function MiniStat({ l, v }: { l: string; v: string }) {
  return (
    <div className="rounded-md border border-border bg-surface-elevated px-2.5 py-2">
      <div className="text-[10px] text-text-muted">{l}</div>
      <div className="mono mt-0.5 text-[13px] font-semibold">{v}</div>
    </div>
  );
}

/* ---------- Credits ---------- */

function CreditsSection() {
  const items = [
    { l: "Generate campaign brief · Haiku", c: 10 },
    { l: "Generate campaign brief · Sonnet", c: 25 },
    { l: "Generate campaign brief · Opus", c: 60 },
    { l: "Generate image concept", c: 15 },
    { l: "Run campaign audit", c: 20 },
    { l: "Generate monthly report", c: 30 },
    { l: "Run churn assessment", c: 15 },
  ];
  return (
    <section className="relative border-t border-border py-28">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-8">
        <SectionHeading
          eyebrow="07 — Credits"
          title="Shared credits for AI work."
          sub="Credits belong to the agency workspace and are shared across team members. No per-seat AI surprises."
        />
        <div className="mt-14 grid gap-2 md:grid-cols-2">
          {items.map((i, idx) => (
            <Reveal key={i.l} delay={idx * 0.03}>
              <div className="flex items-center justify-between surface-card px-5 py-4 transition-colors hover:border-indigo/40">
                <span className="text-[14px]">{i.l}</span>
                <span className="mono text-[14px] font-semibold text-indigo">{i.c} cr</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Pricing ---------- */

const PLANS = [
  {
    name: "Starter",
    price: "$97",
    cadence: "/month",
    desc: "Run client delivery for a focused book of clients.",
    cta: "Start free trial",
    href: "signup" as const,
    features: [
      "Up to 5 client sub-accounts",
      "White-label client portal",
      "Live Meta & Google campaign dashboard",
      "AI monthly report generator",
      "Contracts & e-sign",
      "Client invoicing & recurring billing",
      "Onboarding checklists",
      "Lead speed tracker",
      "Client communication log",
      "AI churn risk detector",
      "1 team seat",
      "300 Studio credits/month",
      "Email support",
    ],
  },
  {
    name: "Professional",
    price: "$197",
    cadence: "/month",
    desc: "Full Client OS + Creative Studio for growing agencies.",
    cta: "Start free trial",
    href: "signup" as const,
    popular: true,
    features: [
      "Up to 20 client sub-accounts",
      "Everything in Starter",
      "Custom domain",
      "Up to 5 team seats",
      "Advanced team roles",
      "AI campaign auditor",
      "Full Creative Studio access",
      "1,000 Studio credits/month",
      "Creative approval workflow",
      "Client review links",
      "Push approved creatives to Meta Ads Manager",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "",
    desc: "Unlimited scale with custom controls and SLAs.",
    cta: "Contact Sales",
    href: "mailto:ezra@scaledsolutions.net?subject=Orvio Enterprise Inquiry&body=Hi,%0A%0AI'm interested in Orvio's Enterprise plan.%0A%0AAgency Name:%20%0AEstimated Clients:%20%0ATeam Size:%20%0AAdditional Requirements:%20%0A",
    features: [
      "Unlimited client sub-accounts",
      "Unlimited team seats",
      "Advanced AI model controls",
      "Custom credit allocation",
      "API access",
      "Custom onboarding",
      "Dedicated account manager",
      "SLA & uptime guarantee",
      "Custom contract terms",
      "White-glove Meta Business Manager setup",
    ],
  },
];

function PricingSection() {
  return (
    <section className="relative border-t border-border py-28">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-8">
        <SectionHeading
          eyebrow="08 — Pricing"
          title="Simple plans. Real agency scale."
          sub="Start small, upgrade when you bring on Creative Studio and a real team."
          center
        />
        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {PLANS.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.06}>
              <PlanCard plan={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function PlanCard({ plan }: { plan: (typeof PLANS)[number] }) {
  const popular = plan.popular;
  return (
    <div className={`relative h-full overflow-hidden rounded-2xl border p-7 transition-all ${popular ? "border-indigo/50 bg-gradient-to-b from-indigo/10 to-surface shadow-[0_30px_80px_-20px_rgba(99,102,241,0.45)]" : "border-border bg-surface"}`}>
      {popular && (
        <div className="absolute top-5 right-5">
          <span className="chip mono text-[10px]"><Sparkles className="h-3 w-3" /> Most popular</span>
        </div>
      )}
      <div className="mono-eyebrow">{plan.name}</div>
      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-[42px] font-semibold tracking-tight">{plan.price}</span>
        {plan.cadence && <span className="text-text-muted text-[14px]">{plan.cadence}</span>}
      </div>
      <p className="mt-2 text-[14px] text-text-muted">{plan.desc}</p>

      {plan.href === "signup" ? (
        <Link
          to="/signup"
          className={`mt-6 inline-flex h-10 w-full items-center justify-center rounded-lg text-[13.5px] font-medium transition-all ${popular ? "bg-indigo text-white hover:bg-indigo/90" : "border border-border bg-surface-elevated text-foreground hover:border-indigo/40"}`}
        >
          {plan.cta}
        </Link>
      ) : (
        <a
          href={plan.href}
          className="mt-6 inline-flex h-10 w-full items-center justify-center rounded-lg border border-orange/40 bg-orange/10 text-[13.5px] font-medium text-orange transition-colors hover:bg-orange/20"
        >
          {plan.cta}
        </a>
      )}

      <ul className="mt-7 space-y-2.5">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-[13.5px] text-foreground/85">
            <Check className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${popular ? "text-indigo" : "text-text-muted"}`} />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Security ---------- */

function SecuritySection() {
  const items = [
    { i: Lock, t: "Encrypted API credentials" },
    { i: ShieldCheck, t: "Separate agency & client experiences" },
    { i: Users, t: "White-label portal controls" },
    { i: CreditCard, t: "Stripe-powered billing" },
    { i: FileSignature, t: "DocuSign-ready contracts" },
    { i: Check, t: "Role-based approvals" },
    { i: ShieldCheck, t: "Workspace-level access control" },
  ];
  return (
    <section className="relative border-t border-border py-28">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-8">
        <SectionHeading
          eyebrow="09 — Trust"
          title="Built for sensitive agency and client data."
          sub="Agency credentials, client billing, contracts, and creative history. Treated as infrastructure — not a vibe."
          center
        />
        <div className="mx-auto mt-14 grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <Reveal key={it.t} delay={i * 0.04}>
              <div className="flex items-center gap-3 surface-card px-5 py-4">
                <span className="grid h-9 w-9 place-items-center rounded-md bg-indigo/10 text-indigo">
                  <it.i className="h-4 w-4" />
                </span>
                <span className="text-[14px]">{it.t}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */

const FAQ = [
  { q: "What is Orvio?", a: "Orvio is a white-label operating system for marketing agencies. It combines client delivery (portal, reports, contracts, billing, churn risk) with an AI Creative Studio (briefs, copy, image concepts, audits, approvals, push to Meta)." },
  { q: "Who is Orvio for?", a: "Agencies serving local service businesses — HVAC, remodelers, movers, gyms, law firms, real estate, contractors, and similar." },
  { q: "Do my clients see Orvio?", a: "No. The client portal is fully white-labeled with your logo, platform name, brand color, and custom domain on Professional and above." },
  { q: "Does Orvio replace GoHighLevel?", a: "Orvio replaces the parts of GHL that matter for paid-media agencies: white-label client portal, campaign dashboards, reports, contracts, billing, churn risk, and creative production. It's purpose-built for ad agencies." },
  { q: "How do credits work?", a: "Credits live at the workspace level and are shared across your team. Each AI action — brief, image, audit, report, churn assessment — has a fixed credit cost." },
  { q: "Can I use my own domain?", a: "Yes, on Professional and Enterprise. Point a custom domain at your portal so clients see your brand end-to-end." },
  { q: "Can my team approve creatives?", a: "Yes. Approval routes through Media Buyer → Account Manager → Agency Owner. You can also send branded client review links." },
  { q: "Can Orvio push creatives to Meta?", a: "Yes. Approved concepts push directly into Meta Ads Manager from the Creative Studio." },
  { q: "What's the difference between Starter and Professional?", a: "Starter runs Client OS for up to 5 clients with one seat and 300 credits. Professional unlocks Creative Studio, custom domain, up to 20 clients, 5 seats, 1,000 credits, and the approval workflow." },
  { q: "Is Enterprise self-serve?", a: "No. Enterprise is contracted with a custom credit allocation, API access, dedicated account manager, and SLA. Email ezra@scaledsolutions.net to start." },
];

function FAQItem({ q, a, i }: { q: string; a: string; i: number }) {
  const [open, setOpen] = useState(i === 0);
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-6 py-5 text-left"
      >
        <span className="text-[15.5px] font-medium">{q}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-text-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden"
      >
        <p className="pb-6 pr-10 text-[14px] leading-relaxed text-text-muted">{a}</p>
      </motion.div>
    </div>
  );
}

function FAQSection() {
  return (
    <section className="relative border-t border-border py-28">
      <div className="mx-auto max-w-[860px] px-6 sm:px-8">
        <SectionHeading eyebrow="10 — FAQ" title="Questions, answered." center />
        <div className="mt-14">
          {FAQ.map((f, i) => (
            <FAQItem key={f.q} q={f.q} a={f.a} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Final CTA ---------- */

function FinalCTA() {
  return (
    <section className="relative overflow-hidden border-t border-border">
      <div className="absolute inset-0 hero-bg" />
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="relative mx-auto max-w-[1100px] px-6 py-28 text-center sm:px-8 sm:py-36">
        <Reveal>
          <Eyebrow>Run it from one workspace</Eyebrow>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mx-auto mt-5 max-w-3xl text-[clamp(2.2rem,4.6vw,3.6rem)] font-semibold leading-[1.05] tracking-tight">
            Run your agency from one{" "}
            <span className="text-gradient-orvio">operating system.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-5 max-w-2xl text-[16px] leading-relaxed text-text-muted">
            Bring client delivery, reporting, billing, creative production, approvals, and campaign history
            into one white-labeled workspace.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <PrimaryCTA>Start free trial</PrimaryCTA>
            <SecondaryCTA>Book a demo</SecondaryCTA>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Page ---------- */

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        <Hero />
        <ProblemSection />
        <TwoLayers />
        <Workflow />
        <ClientOSDeepDive />
        <StudioSection />
        <WhiteLabel />
        <CreditsSection />
        <PricingSection />
        <SecuritySection />
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

void MessageSquare;

// Re-exports consumed by /pricing route
export const tierData = PLANS.map((p) => ({
  name: p.name,
  price: p.price,
  cadence: p.cadence,
  description: p.desc,
  features: p.features,
  cta: p.cta,
  href: p.href,
  popular: !!(p as { popular?: boolean }).popular,
}));

export function PricingBlock() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {PLANS.map((p) => (
        <PlanCard key={p.name} plan={p} />
      ))}
    </div>
  );
}
