import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  Boxes,
  Check,
  ChevronDown,
  CircleDot,
  ClipboardList,
  CreditCard,
  Database,
  FileSignature,
  FileText,
  Gauge,
  KeyRound,
  Layers,
  Lock,
  type LucideIcon,
  Megaphone,
  Plus,
  Search,
  Send,
  Server,
  Settings,
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
      { title: "Orvio — The agency operating system" },
      {
        name: "description",
        content:
          "Orvio is the agency OS for client delivery and AI campaign production. One workspace for reports, contracts, billing, creative, approvals, and a white-labeled client portal.",
      },
    ],
  }),
});

/* ============================================================
   PRIMITIVES
   ============================================================ */

function Reveal({ children, delay = 0, y = 16 }: { children: React.ReactNode; delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 mono-eyebrow text-indigo">
      <span className="h-px w-5 bg-indigo/60" />
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
      <Reveal><Eyebrow>{eyebrow}</Eyebrow></Reveal>
      <Reveal delay={0.04}>
        <h2 className="mt-3 text-[clamp(1.75rem,3.4vw,2.6rem)] font-semibold leading-[1.1] tracking-[-0.02em]">
          {title}
        </h2>
      </Reveal>
      {sub && (
        <Reveal delay={0.08}>
          <p className={`mt-4 text-[15.5px] leading-relaxed text-text-muted ${center ? "mx-auto" : ""}`}>{sub}</p>
        </Reveal>
      )}
    </div>
  );
}

function PrimaryCTA({ children, to = "/signup" }: { children: React.ReactNode; to?: "/signup" | "/demo" }) {
  return (
    <Link
      to={to}
      className="group inline-flex h-11 items-center gap-2 rounded-lg bg-indigo px-5 text-[13.5px] font-medium text-white transition-all hover:bg-[#4F46E5] shadow-[0_10px_36px_-12px_rgba(99,102,241,0.7)]"
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
      className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-surface/60 px-5 text-[13.5px] font-medium text-foreground backdrop-blur transition-all hover:border-indigo/40 hover:bg-surface-elevated"
    >
      {children}
    </Link>
  );
}

function StatusPill({ tone = "muted", children }: { tone?: "good" | "warn" | "bad" | "indigo" | "muted"; children: React.ReactNode }) {
  const tones: Record<string, string> = {
    good: "bg-success/10 text-success border-success/30",
    warn: "bg-warning/10 text-warning border-warning/30",
    bad: "bg-danger/10 text-danger border-danger/30",
    indigo: "bg-indigo/10 text-indigo border-indigo/30",
    muted: "bg-surface-elevated text-text-muted border-border",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 mono text-[10px] uppercase tracking-wider ${tones[tone]}`}>
      {children}
    </span>
  );
}

function Stat({ label, value, delta, tone, mono: monoVal = true }: { label: string; value: string; delta?: string; tone?: "good" | "warn" | "bad"; mono?: boolean }) {
  const toneCls = tone === "good" ? "text-success" : tone === "warn" ? "text-warning" : tone === "bad" ? "text-danger" : "text-text-muted";
  return (
    <div className="rounded-[10px] border border-border bg-surface-elevated px-3 py-2.5">
      <div className="text-[10.5px] text-text-muted">{label}</div>
      <div className="mt-1 flex items-baseline gap-1.5">
        <span className={`${monoVal ? "mono" : ""} text-[16px] font-semibold tracking-tight text-foreground`}>{value}</span>
        {delta && <span className={`mono text-[10.5px] ${toneCls}`}>{delta}</span>}
      </div>
    </div>
  );
}

function Sparkline({ values, tone = "indigo" }: { values: number[]; tone?: "indigo" | "amber" | "success" }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const w = 100, h = 28;
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / Math.max(1, max - min)) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const stroke = tone === "amber" ? "#D97706" : tone === "success" ? "#10B981" : "#6366F1";
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-7 w-full" preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={`0,${h} ${pts} ${w},${h}`} fill={stroke} opacity="0.08" />
    </svg>
  );
}

function MiniBars({ heights = [40, 62, 48, 78, 56, 84, 72, 90, 66, 95, 80, 88], tone = "indigo" }: { heights?: number[]; tone?: "indigo" | "amber" }) {
  const grad = tone === "amber" ? "from-amber/30 to-amber" : "from-indigo/30 to-indigo";
  return (
    <div className="flex h-14 items-end gap-1">
      {heights.map((h, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          whileInView={{ height: `${h}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: i * 0.03, ease: [0.22, 1, 0.36, 1] }}
          className={`flex-1 rounded-[2px] bg-gradient-to-t ${grad}`}
        />
      ))}
    </div>
  );
}

/* ============================================================
   SHARED APP CHROME (used in hero + tabbed showcase)
   ============================================================ */

function BrowserFrame({ url, brand = "orvio", children, badge }: { url: string; brand?: "orvio" | "client"; children: React.ReactNode; badge?: React.ReactNode }) {
  return (
    <div className="surface-card overflow-hidden shadow-soft">
      <div className="flex items-center gap-2 border-b border-border bg-surface-elevated/60 px-3.5 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#3b3f55]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#3b3f55]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#3b3f55]" />
        </div>
        <div className="ml-2 flex items-center gap-2 rounded-md border border-border bg-background/60 px-2.5 py-1">
          <Lock className="h-3 w-3 text-text-faint" />
          <span className="mono text-[10.5px] text-text-muted">{url}</span>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          {badge}
          <StatusPill tone="good"><span className="h-1.5 w-1.5 rounded-full bg-success live-dot" /> Live</StatusPill>
        </div>
        {brand === "client" ? null : null}
      </div>
      {children}
    </div>
  );
}

function AppSidebar({
  brand = "GrowthDesk",
  brandColor = "from-indigo to-[#4F46E5]",
  initials = "GD",
  active = "Dashboard",
  showCredits = true,
  items,
}: {
  brand?: string;
  brandColor?: string;
  initials?: string;
  active?: string;
  showCredits?: boolean;
  items?: { l: string; icon: LucideIcon }[];
}) {
  const defaultItems: { l: string; icon: LucideIcon }[] = [
    { l: "Dashboard", icon: Gauge },
    { l: "Clients", icon: Users },
    { l: "Creative Studio", icon: Wand2 },
    { l: "Reports", icon: FileText },
    { l: "Contracts", icon: FileSignature },
    { l: "Billing", icon: CreditCard },
    { l: "Settings", icon: Settings },
  ];
  const list = items ?? defaultItems;
  return (
    <div className="border-r border-border bg-background/40 p-3">
      <div className="mono text-[9.5px] font-semibold uppercase tracking-[0.18em] text-text-faint">Workspace</div>
      <div className="mt-2 flex items-center gap-2 rounded-md bg-surface-elevated px-2 py-1.5">
        <span className={`grid h-5 w-5 place-items-center rounded bg-gradient-to-br ${brandColor} text-[8.5px] font-bold text-white`}>{initials}</span>
        <span className="text-[11.5px] font-medium">{brand}</span>
        <ChevronDown className="ml-auto h-3 w-3 text-text-faint" />
      </div>
      <ul className="mt-3 space-y-0.5">
        {list.map((i) => {
          const a = i.l === active;
          return (
            <li
              key={i.l}
              className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-[11.5px] ${a ? "bg-indigo/15 text-foreground" : "text-text-muted hover:text-foreground"}`}
            >
              <i.icon className={`h-3.5 w-3.5 ${a ? "text-indigo" : "text-text-faint"}`} />
              {i.l}
            </li>
          );
        })}
      </ul>
      {showCredits && (
        <div className="mt-4 rounded-md border border-border bg-surface-elevated p-2.5">
          <div className="mono text-[9.5px] uppercase tracking-[0.16em] text-text-faint">Studio credits</div>
          <div className="mt-1 mono text-[14px] font-semibold">847 <span className="mono text-[10px] text-text-muted">/ 1,000</span></div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-background">
            <div className="h-full w-[85%] rounded-full bg-gradient-to-r from-indigo to-[#4F46E5]" />
          </div>
        </div>
      )}
    </div>
  );
}

function AppTopBar({
  title,
  subtitle,
  client = "Apex HVAC · Tampa",
  showWorkspaceMeta = false,
}: {
  title: string;
  subtitle?: string;
  client?: string;
  showWorkspaceMeta?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border bg-background/40 px-4 py-2.5">
      <div className="min-w-0">
        <div className="text-[12.5px] font-semibold">{title}</div>
        {subtitle && <div className="mono text-[10px] text-text-muted">{subtitle}</div>}
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-1.5 rounded-md border border-border bg-surface-elevated px-2 py-1 sm:flex">
          <Search className="h-3 w-3 text-text-faint" />
          <span className="mono text-[10px] text-text-muted">{client}</span>
          <ChevronDown className="h-3 w-3 text-text-faint" />
        </div>
        {showWorkspaceMeta && (
          <>
            <div className="hidden items-center gap-1.5 rounded-md border border-border bg-surface-elevated px-2 py-1 mono text-[10px] text-text-muted md:flex">
              <Sparkles className="h-3 w-3 text-indigo" />
              <span>847 / 1,000</span>
            </div>
            <div className="hidden items-center gap-1.5 rounded-md border border-success/30 bg-success/10 px-2 py-1 mono text-[10px] text-success md:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-success live-dot" />
              Live
            </div>
          </>
        )}
        <span className="grid h-6 w-6 place-items-center rounded-md border border-border bg-surface-elevated text-text-muted">
          <Bell className="h-3 w-3" />
        </span>
        <span className="h-6 w-6 rounded-full bg-gradient-to-br from-amber to-[#B45309]" />
      </div>
    </div>
  );
}

/* ============================================================
   HERO MOCKUP — full app shell
   ============================================================ */

function HeroMockup() {
  const clients = [
    { n: "Apex HVAC", h: 94, t: "good" as const },
    { n: "Sunbelt Remodelers", h: 88, t: "good" as const },
    { n: "Northshore Movers", h: 64, t: "bad" as const },
  ];

  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-20 -z-10">
        <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo/30 blur-[120px]" />
        <div className="absolute right-0 bottom-0 h-56 w-56 rounded-full bg-amber/15 blur-[120px]" />
      </div>

      <BrowserFrame url="app.orvio.io/dashboard">
        <div className="grid grid-cols-[160px_1fr_180px]">
          <AppSidebar />

          <div>
            <AppTopBar title="GrowthDesk · Agency overview" subtitle="last 30 days · all clients" showWorkspaceMeta />

            <div className="p-4">
              <div className="grid grid-cols-4 gap-2">
                <Stat label="Spend" value="$24,840" delta="+12.4%" tone="good" />
                <Stat label="Leads" value="612" delta="+18.0%" tone="good" />
                <Stat label="CPL" value="$40.59" delta="-5.2%" tone="good" />
                <Stat label="Booked calls" value="84" delta="+9.8%" tone="good" />
              </div>

              <div className="mt-3 surface-elev p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11.5px] font-medium">Campaign performance</span>
                  <span className="mono text-[10px] text-success">+12.4% MoM</span>
                </div>
                <div className="mt-2">
                  <Sparkline values={[34, 42, 48, 44, 56, 62, 60, 68, 74, 82, 88, 94]} />
                </div>
              </div>

              <div className="mt-3 grid grid-cols-[1fr_1fr] gap-2.5">
                <div className="surface-elev p-3">
                  <div className="mono text-[9.5px] uppercase tracking-[0.18em] text-text-faint">Client health</div>
                  <div className="mt-2 space-y-1.5">
                    {clients.map((c) => (
                      <div key={c.n} className="flex items-center justify-between text-[11px]">
                        <span>{c.n}</span>
                        <span className="flex items-center gap-1.5">
                          <span className="mono text-text-muted">{c.h}</span>
                          <span className="h-1 w-10 overflow-hidden rounded-full bg-background">
                            <span
                              className={`block h-full ${c.t === "good" ? "bg-success" : "bg-danger"}`}
                              style={{ width: `${c.h}%` }}
                            />
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="surface-elev p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11.5px] font-medium">Pending approval</span>
                    <StatusPill tone="warn">awaiting</StatusPill>
                  </div>
                  <div className="mt-2 text-[11px] leading-snug text-text-muted">
                    Apex HVAC — Fall tune-up, concept 03
                  </div>
                  <div className="mt-1 mono text-[10px] text-text-faint">Audit 94 · Sonnet · 4 variants</div>
                  <button className="mt-2.5 inline-flex items-center gap-1.5 rounded-md bg-amber px-2.5 py-1 text-[10.5px] font-medium text-white">
                    <Check className="h-3 w-3" /> Approve & push
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right activity panel */}
          <div className="border-l border-border bg-background/40 p-3">
            <div className="mono text-[9.5px] font-semibold uppercase tracking-[0.18em] text-text-faint">Activity</div>
            <div className="mt-3 space-y-1.5">
              {[
                { who: "Maya · AM", t: "Report sent to Apex HVAC", d: "2m" },
                { who: "Jordan", t: "Creative approved · concept 03", d: "12m" },
                { who: "Billing", t: "Invoice paid · INV-2031", d: "1h" },
                { who: "System", t: "Meta Ads synced", d: "3h" },
              ].map((n) => (
                <div key={n.t} className="rounded-md border border-border bg-surface-elevated px-2 py-1.5">
                  <div className="flex items-center justify-between">
                    <span className="mono text-[9.5px] text-text-muted">{n.who}</span>
                    <span className="mono text-[9.5px] text-text-faint">{n.d}</span>
                  </div>
                  <p className="mt-0.5 text-[10.5px] leading-snug">{n.t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </BrowserFrame>
    </div>
  );
}

/* ============================================================
   HERO
   ============================================================ */

function Hero() {
  return (
    <section className="relative overflow-hidden hero-bg pt-32 pb-20 sm:pt-36 sm:pb-24">
      <div className="absolute inset-0 grid-bg" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo/40 to-transparent" />

      <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 gap-10 px-6 sm:px-8 lg:grid-cols-[0.95fr_1.1fr] lg:items-center">
        <div>
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1.5 backdrop-blur">
              <Sparkles className="h-3 w-3 text-indigo" />
              <span className="mono text-[10.5px] uppercase tracking-[0.18em] text-text-muted">Agency operating system</span>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="mt-5 text-[clamp(2.2rem,4.4vw,3.6rem)] font-semibold leading-[1.04] tracking-[-0.03em]">
              The operating system for{" "}
              <span className="text-gradient-orvio">modern ad agencies.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-5 max-w-xl text-[15.5px] leading-relaxed text-text-muted">
              Manage clients, reports, billing, approvals, campaign data, and AI creative production from one white-labeled workspace.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <PrimaryCTA>Start free trial</PrimaryCTA>
              <SecondaryCTA>Watch product tour</SecondaryCTA>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-7 flex flex-wrap gap-2">
              {[
                "White-label portals",
                "Client OS + Creative Studio",
                "Shared workspace credits",
              ].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/60 px-3 py-1 text-[11.5px] text-text-muted backdrop-blur">
                  <Check className="h-3 w-3 text-indigo" />
                  {t}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1} y={24}>
          <HeroMockup />
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   ZONE 02 — OS overview (3 surfaces)
   ============================================================ */

function SurfaceCard({
  title,
  desc,
  chips,
  preview,
  tone = "indigo",
  icon: Icon,
}: {
  title: string;
  desc: string;
  chips: string[];
  preview: React.ReactNode;
  tone?: "indigo" | "amber" | "emerald";
  icon: LucideIcon;
}) {
  const glow = tone === "amber" ? "from-amber/20" : tone === "emerald" ? "from-emerald-400/20" : "from-indigo/25";
  const iconCls =
    tone === "amber"
      ? "bg-amber/10 text-amber"
      : tone === "emerald"
        ? "bg-emerald-500/10 text-emerald-300"
        : "bg-indigo/10 text-indigo";
  const chipCls =
    tone === "amber"
      ? "border-amber/30 bg-amber/10 text-amber"
      : tone === "emerald"
        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
        : "border-indigo/30 bg-indigo/10 text-indigo";
  return (
    <div className="group relative h-full overflow-hidden surface-card transition-all hover:-translate-y-1 hover:border-indigo/40">
      <div className={`pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-gradient-to-br ${glow} to-transparent blur-3xl opacity-70`} />
      <div className="relative p-6">
        <div className="flex items-center gap-2.5">
          <span className={`grid h-8 w-8 place-items-center rounded-md ${iconCls}`}>
            <Icon className="h-4 w-4" />
          </span>
          <h3 className="text-[18px] font-semibold tracking-tight">{title}</h3>
        </div>
        <p className="mt-3 text-[13.5px] leading-relaxed text-text-muted">{desc}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {chips.map((c) => (
            <span key={c} className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10.5px] font-medium ${chipCls}`}>
              {c}
            </span>
          ))}
        </div>
      </div>
      <div className="relative mx-6 mb-6 overflow-hidden rounded-[10px] border border-border bg-background/40">
        {preview}
      </div>
    </div>
  );
}

function OSOverview() {
  return (
    <section id="platform" className="relative border-t border-border py-20">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-8">
        <SectionHeading
          eyebrow="Platform"
          title={<>One operating system. <span className="text-gradient-orvio">Three connected surfaces.</span></>}
          sub="Agency work, creative production, and client delivery stay attached to the same client record."
        />

        <div className="relative mt-12 grid gap-4 lg:grid-cols-3">
          {/* Connector lines */}
          <div className="pointer-events-none absolute inset-x-12 top-1/2 hidden h-px -translate-y-1/2 lg:block">
            <div className="h-full w-full bg-gradient-to-r from-transparent via-indigo/40 to-transparent" />
          </div>

          <Reveal>
            <SurfaceCard
              kicker="Surface 01"
              title="Agency Workspace"
              desc="Internal team dashboard for clients, reports, campaigns, billing, notes, approvals, and credits."
              chips={["Clients", "Reports", "Billing"]}
              preview={<AgencyPreview />}
            />
          </Reveal>
          <Reveal delay={0.06}>
            <SurfaceCard
              kicker="Surface 02"
              title="Creative Studio"
              desc="Client-scoped briefs, AI concepts, audit scores, approval workflow, and push to Meta."
              chips={["Briefs", "Approvals", "Meta push"]}
              preview={<StudioPreview />}
              tone="amber"
            />
          </Reveal>
          <Reveal delay={0.12}>
            <SurfaceCard
              kicker="Surface 03"
              title="Client Portal"
              desc="White-labeled portal for client-facing reports, invoices, contracts, and campaign dashboards."
              chips={["Reports", "Invoices", "Contracts"]}
              preview={<PortalPreview />}
              tone="emerald"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function AgencyPreview() {
  return (
    <div className="p-3">
      <div className="flex items-center justify-between text-[10px]">
        <span className="mono text-text-muted">24 clients</span>
        <StatusPill tone="good"><span className="h-1 w-1 rounded-full bg-success" /> healthy</StatusPill>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        <Stat label="Spend" value="$184k" delta="+12%" tone="good" />
        <Stat label="CPL" value="$54.12" delta="-5%" tone="good" />
      </div>
      <div className="mt-2 rounded-md border border-border bg-surface-elevated p-2">
        <div className="mono text-[9px] text-text-faint">Pending approvals · 6</div>
        <div className="mt-1.5 space-y-1">
          {["Apex HVAC", "Northshore Movers", "Reliant Roofing"].map((c) => (
            <div key={c} className="flex items-center justify-between text-[10px]">
              <span>{c}</span>
              <StatusPill tone="warn">review</StatusPill>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StudioPreview() {
  return (
    <div className="p-3">
      <div className="flex items-center justify-between text-[10px]">
        <span className="mono text-text-muted">Brief · Fall tune-up</span>
        <StatusPill tone="indigo">Sonnet · 85 cr</StatusPill>
      </div>
      <div className="mt-2 space-y-1">
        {[
          { hook: "Problem→Solution", score: 94, st: "approved", tone: "good" as const },
          { hook: "Social proof", score: 91, st: "pending", tone: "warn" as const },
          { hook: "Offer-first", score: 88, st: "pending", tone: "warn" as const },
        ].map((c) => (
          <div key={c.hook} className="flex items-center justify-between rounded border border-border bg-surface-elevated px-2 py-1.5 text-[10px]">
            <div className="flex items-center gap-2 min-w-0">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded bg-gradient-to-br from-amber/40 to-amber/10 mono text-[8px] text-amber">{c.score}</span>
              <span className="truncate">{c.hook}</span>
            </div>
            <StatusPill tone={c.tone}>{c.st}</StatusPill>
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between rounded-md border border-amber/30 bg-amber/5 px-2 py-1.5">
        <span className="mono text-[9.5px] text-amber">push to Meta</span>
        <Send className="h-3 w-3 text-amber" />
      </div>
    </div>
  );
}

function PortalPreview() {
  return (
    <div className="p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="grid h-4 w-4 place-items-center rounded bg-emerald-500/90 text-[7px] font-bold text-white">GD</span>
          <span className="mono text-[9.5px] font-semibold">GROWTHDESK</span>
        </div>
        <span className="mono text-[9px] text-text-faint">portal.growthdesk.co</span>
      </div>
      <div className="mt-2 rounded-md border border-border bg-surface-elevated p-2">
        <div className="text-[10.5px] font-medium">November report</div>
        <div className="mt-1.5 grid grid-cols-3 gap-1.5">
          <Stat label="Spend" value="$24.8k" />
          <Stat label="Leads" value="612" />
          <Stat label="CPL" value="$40" />
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between text-[10px]">
        <span className="text-text-muted">INV-2032 · $3,500</span>
        <StatusPill tone="good">paid</StatusPill>
      </div>
    </div>
  );
}

/* ============================================================
   ZONE 03 — Tabbed product showcase
   ============================================================ */

const SHOWCASE_TABS = [
  { id: "agency", label: "Agency Dashboard", icon: Gauge },
  { id: "clientos", label: "Client OS", icon: Users },
  { id: "studio", label: "Creative Studio", icon: Wand2 },
  { id: "portal", label: "Client Portal", icon: Layers },
  { id: "admin", label: "Admin", icon: Server },
] as const;

function ProductShowcase() {
  const [tab, setTab] = useState<(typeof SHOWCASE_TABS)[number]["id"]>("agency");

  return (
    <section id="client-os" className="relative border-t border-border py-20">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-8">
        <SectionHeading
          eyebrow="Product tour"
          title="A guided look at every surface in the system."
          sub="Switch between the agency dashboard, client record, creative studio, white-labeled client portal, and platform admin — all sharing one design system."
        />

        <div className="mt-10 overflow-x-auto">
          <div className="inline-flex min-w-full justify-center">
            <div className="inline-flex gap-1 rounded-xl border border-border bg-surface p-1">
              {SHOWCASE_TABS.map((t) => {
                const active = tab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-[12.5px] font-medium transition-all ${
                      active
                        ? "bg-surface-elevated text-foreground shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
                        : "text-text-muted hover:text-foreground"
                    }`}
                  >
                    <t.icon className={`h-3.5 w-3.5 ${active ? "text-indigo" : "text-text-faint"}`} />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="relative mt-8">
          <div className="pointer-events-none absolute -inset-x-10 -inset-y-10 -z-10">
            <div className="absolute left-1/2 top-1/2 h-72 w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo/15 blur-[120px]" />
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {tab === "agency" && <AgencyDashboardPanel />}
              {tab === "clientos" && <ClientOSPanel />}
              {tab === "studio" && <CreativeStudioPanel />}
              {tab === "portal" && <ClientPortalPanel />}
              {tab === "admin" && <AdminPanel />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function AgencyDashboardPanel() {
  return (
    <BrowserFrame url="app.orvio.io/clients">
      <div className="grid grid-cols-[180px_1fr]">
        <AppSidebar active="Clients" />
        <div>
          <AppTopBar title="All clients" subtitle="24 active · 2 at risk · 6 pending approval" />
          <div className="p-4">
            <div className="grid grid-cols-4 gap-2">
              <Stat label="Active clients" value="24" />
              <Stat label="At-risk clients" value="2" tone="bad" />
              <Stat label="Pending approvals" value="6" tone="warn" />
              <Stat label="Credits used" value="153" delta="this month" />
            </div>

            <div className="mt-3 overflow-hidden rounded-[10px] border border-border bg-surface-elevated">
              <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_0.6fr] gap-2 border-b border-border px-3 py-2 mono text-[10px] uppercase tracking-wider text-text-faint">
                <span>Client</span>
                <span>Spend</span>
                <span>CPL</span>
                <span>Health</span>
                <span>Last report</span>
                <span></span>
              </div>
              {[
                { n: "Apex HVAC of Tampa", s: "$24,840", c: "$40.59", h: 94, d: "2d ago", t: "good" as const },
                { n: "Reliant Roofing", s: "$18,420", c: "$52.10", h: 88, d: "5d ago", t: "good" as const },
                { n: "Northshore Movers", s: "$12,310", c: "$84.20", h: 64, d: "14d ago", t: "bad" as const },
                { n: "Sunbelt Remodelers", s: "$31,210", c: "$48.80", h: 91, d: "1d ago", t: "good" as const },
                { n: "Pacific Gyms", s: "$9,840", c: "$62.40", h: 76, d: "8d ago", t: "warn" as const },
              ].map((r) => (
                <div key={r.n} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_0.6fr] items-center gap-2 border-b border-border/60 px-3 py-2.5 text-[11.5px] last:border-b-0 transition-colors hover:bg-background/40">
                  <span className="font-medium">{r.n}</span>
                  <span className="mono">{r.s}</span>
                  <span className="mono">{r.c}</span>
                  <span className="flex items-center gap-1.5">
                    <span className="mono">{r.h}</span>
                    <span className={`h-1 w-12 overflow-hidden rounded-full bg-background`}>
                      <span className={`block h-full ${r.t === "good" ? "bg-success" : r.t === "warn" ? "bg-warning" : "bg-danger"}`} style={{ width: `${r.h}%` }} />
                    </span>
                  </span>
                  <span className="mono text-[10.5px] text-text-muted">{r.d}</span>
                  <span className="ml-auto"><ArrowUpRight className="h-3.5 w-3.5 text-text-faint" /></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

function ClientOSPanel() {
  return (
    <BrowserFrame url="app.orvio.io/clients/apex-hvac">
      <div className="grid grid-cols-[180px_1fr]">
        <AppSidebar active="Clients" />
        <div>
          <AppTopBar title="Apex HVAC of Tampa" subtitle="client · since Mar 2025 · health 94" />
          <div className="px-4 pt-3">
            <div className="flex gap-1 overflow-x-auto border-b border-border">
              {["Overview", "Campaigns", "Reports", "Contracts", "Invoices", "Onboarding", "Notes", "Creative"].map((t, i) => (
                <button
                  key={t}
                  className={`whitespace-nowrap rounded-t-md px-3 py-1.5 text-[11.5px] font-medium transition-colors ${
                    i === 0 ? "border-b-2 border-indigo text-foreground" : "text-text-muted hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-4 gap-2">
              <Stat label="Spend (Nov)" value="$24,840" delta="+12.4%" tone="good" />
              <Stat label="Leads" value="612" delta="+18.0%" tone="good" />
              <Stat label="CPL" value="$40.59" delta="-5.2%" tone="good" />
              <Stat label="Booked" value="186" delta="+9.4%" tone="good" />
            </div>
            <div className="mt-3 grid grid-cols-[1.4fr_1fr] gap-3">
              <div className="surface-elev p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-text-muted">November report</span>
                  <button className="rounded-md bg-indigo px-2.5 py-1 text-[10.5px] font-medium text-white">Send to client</button>
                </div>
                <p className="mt-2 text-[11.5px] leading-relaxed text-text-muted">
                  "Apex HVAC ran a strong November. Lead volume climbed 18% MoM while CPL dropped to $40.59, driven by the new fall tune-up offer and tightened geo targeting…"
                </p>
                <div className="mt-2 mono text-[9.5px] text-text-faint">generated · 30 credits · Sonnet · Nov 30 09:12</div>
              </div>
              <div className="surface-elev p-3">
                <div className="mono text-[9.5px] uppercase tracking-[0.18em] text-text-faint">Onboarding</div>
                <ul className="mt-2 space-y-1 text-[11px]">
                  {[
                    { l: "Connect Meta Ads", d: true },
                    { l: "Connect Google Ads", d: true },
                    { l: "Upload brand assets", d: true },
                    { l: "Set lead routing", d: false },
                    { l: "Confirm offer & tracking", d: false },
                  ].map((i) => (
                    <li key={i.l} className="flex items-center gap-2">
                      <span className={`grid h-3.5 w-3.5 place-items-center rounded-sm border ${i.d ? "border-success/40 bg-success/20 text-success" : "border-border text-transparent"}`}>
                        <Check className="h-2.5 w-2.5" />
                      </span>
                      <span className={i.d ? "text-text-muted line-through" : ""}>{i.l}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-background">
                  <div className="h-full w-3/5 rounded-full bg-gradient-to-r from-indigo to-[#4F46E5]" />
                </div>
                <div className="mt-1.5 mono text-[9.5px] text-text-muted">3 of 5 complete</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

function CreativeStudioPanel() {
  return (
    <BrowserFrame url="app.orvio.io/studio/brief" badge={<StatusPill tone="indigo"><Sparkles className="h-3 w-3" /> Studio</StatusPill>}>
      <div className="grid grid-cols-[180px_1fr]">
        <AppSidebar active="Creative Studio" />
        <div>
          <AppTopBar title="New brief · Fall tune-up" subtitle="client: Apex HVAC · model: Sonnet · 85 credits" />
          <div className="grid grid-cols-[1fr_220px] gap-4 p-4">
            <div className="space-y-2.5">
              {[
                { l: "Campaign goal", v: "Fall tune-up · lead form" },
                { l: "Offer", v: "$89 full system tune-up · ends Nov 30" },
                { l: "Audience", v: "Tampa metro · homeowners 35–65" },
                { l: "Prior winners", v: "Concept 14 (audit 94) · Concept 09 (audit 91)" },
              ].map((f) => (
                <div key={f.l} className="rounded-md border border-border bg-background/40 px-3 py-2">
                  <div className="mono text-[9.5px] uppercase tracking-[0.18em] text-text-faint">{f.l}</div>
                  <div className="mt-1 text-[12px]">{f.v}</div>
                </div>
              ))}

              <div className="mt-2 surface-elev p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-medium">Generated concepts · 4 of 4</span>
                  <StatusPill tone="warn">3 awaiting AM</StatusPill>
                </div>
                <div className="mt-2.5 grid grid-cols-2 gap-2">
                  {[
                    { hook: "Problem→Solution", head: "Cooling out before guests arrive?", s: 94, st: "approved", tone: "good" as const },
                    { hook: "Social proof", head: "Tampa's most-booked HVAC team", s: 91, st: "pending", tone: "warn" as const },
                    { hook: "Offer-first", head: "$89 full system tune-up — Nov only", s: 88, st: "pending", tone: "warn" as const },
                    { hook: "Urgency", head: "Beat the holiday rush — book this week", s: 86, st: "pending", tone: "warn" as const },
                  ].map((c) => (
                    <div key={c.hook} className="rounded-md border border-border bg-background/40 p-2">
                      <div className="flex items-center justify-between">
                        <span className="mono text-[9.5px] uppercase tracking-wider text-text-faint">{c.hook}</span>
                        <span className={`mono text-[9.5px] ${c.s >= 90 ? "text-success" : "text-warning"}`}>audit {c.s}</span>
                      </div>
                      <div className="mt-1 text-[10.5px] leading-snug">"{c.head}"</div>
                      <div className="mt-1.5 flex items-center justify-between">
                        <StatusPill tone={c.tone}>{c.st}</StatusPill>
                        <span className="mono text-[9px] text-text-faint">view details</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-amber/40 bg-amber/10 px-3 py-1.5 text-[11.5px] font-medium text-amber">
                  <Send className="h-3 w-3" /> Push approved to Meta
                </button>
              </div>
            </div>

            <div className="space-y-2.5">
              <div>
                <div className="mono-eyebrow">Model</div>
                <div className="mt-2 space-y-1.5">
                  {[
                    { l: "Haiku", c: 10 },
                    { l: "Sonnet", c: 25, active: true },
                    { l: "Opus", c: 60 },
                  ].map((m) => (
                    <div key={m.l} className={`flex items-center justify-between rounded-md border px-2.5 py-1.5 ${m.active ? "border-indigo/50 bg-indigo/10" : "border-border bg-background/40"}`}>
                      <span className="text-[11.5px]">{m.l}</span>
                      <span className="mono text-[10.5px] text-text-muted">{m.c} cr</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-md border border-border bg-background/40 p-2.5">
                <div className="mono-eyebrow">Credits required</div>
                <div className="mt-1 mono text-[18px] font-semibold">85</div>
                <div className="mono text-[9.5px] text-text-muted">brief 25 · 4 images 60</div>
              </div>
              <button className="w-full rounded-md bg-indigo py-2 text-[12px] font-medium text-white">Generate 4 concepts</button>
            </div>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

function ClientPortalPanel() {
  return (
    <div className="surface-card overflow-hidden shadow-soft">
      <div className="flex items-center gap-2 border-b border-border bg-emerald-950/40 px-3.5 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#3b3f55]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#3b3f55]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#3b3f55]" />
        </div>
        <div className="ml-2 flex items-center gap-2 rounded-md border border-emerald-500/20 bg-background/60 px-2.5 py-1">
          <Lock className="h-3 w-3 text-emerald-400" />
          <span className="mono text-[10.5px] text-emerald-300">portal.growthdesk.co/apex</span>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="grid h-5 w-5 place-items-center rounded bg-emerald-500/90 text-[8.5px] font-bold text-white">GD</span>
          <span className="mono text-[10.5px] font-semibold tracking-wider text-emerald-200">GROWTHDESK</span>
        </div>
      </div>
      <div className="grid grid-cols-[180px_1fr]">
        <div className="border-r border-border bg-emerald-950/20 p-3">
          <div className="mono text-[9.5px] font-semibold uppercase tracking-[0.18em] text-emerald-300/70">Client portal</div>
          <ul className="mt-3 space-y-0.5 text-[11.5px]">
            {[
              { l: "Dashboard", icon: Gauge, a: true },
              { l: "Reports", icon: FileText },
              { l: "Campaigns", icon: BarChart3 },
              { l: "Contracts", icon: FileSignature },
              { l: "Invoices", icon: CreditCard },
              { l: "Messages", icon: Bell },
            ].map((i) => (
              <li key={i.l} className={`flex items-center gap-2 rounded-md px-2 py-1.5 ${i.a ? "bg-emerald-500/15 text-foreground" : "text-text-muted"}`}>
                <i.icon className={`h-3.5 w-3.5 ${i.a ? "text-emerald-400" : "text-text-faint"}`} />
                {i.l}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="flex items-center justify-between border-b border-border bg-background/40 px-4 py-2.5">
            <div>
              <div className="text-[12.5px] font-semibold">Welcome back, Daniel</div>
              <div className="mono text-[10px] text-text-muted">November 2025 · Apex HVAC</div>
            </div>
            <span className="h-6 w-6 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-700" />
          </div>
          <div className="p-4">
            <div className="grid grid-cols-4 gap-2">
              <Stat label="Spend" value="$24,840" delta="+12.4%" tone="good" />
              <Stat label="Leads" value="612" delta="+18.0%" tone="good" />
              <Stat label="CPL" value="$40.59" delta="-5.2%" tone="good" />
              <Stat label="Booked calls" value="186" delta="+9.4%" tone="good" />
            </div>
            <div className="mt-3 grid grid-cols-[1.3fr_1fr] gap-3">
              <div className="surface-elev p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11.5px] font-medium">Performance · last 30 days</span>
                  <span className="mono text-[10px] text-success">+12.4%</span>
                </div>
                <div className="mt-2"><Sparkline values={[34, 42, 48, 41, 56, 62, 68, 64, 78, 82, 88, 94]} tone="success" /></div>
              </div>
              <div className="surface-elev p-3">
                <div className="mono text-[9.5px] uppercase tracking-[0.18em] text-text-faint">Invoices</div>
                <div className="mt-1.5 space-y-1.5 text-[11px]">
                  <div className="flex justify-between"><span className="mono">INV-2031</span><StatusPill tone="good">paid</StatusPill></div>
                  <div className="flex justify-between"><span className="mono">INV-2032</span><StatusPill tone="warn">due Dec 1</StatusPill></div>
                </div>
              </div>
            </div>
            <div className="mt-3 rounded-[10px] border border-border bg-surface-elevated px-3 py-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11.5px] font-medium">November performance report</span>
                <button className="rounded-md bg-emerald-500 px-2.5 py-1 text-[10.5px] font-medium text-white">View report</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminPanel() {
  return (
    <BrowserFrame url="admin.orvio.io/overview" badge={<StatusPill tone="indigo"><Server className="h-3 w-3" /> Platform admin</StatusPill>}>
      <div className="grid grid-cols-[180px_1fr]">
        <AppSidebar
          brand="Orvio · Admin"
          initials="OA"
          active="Overview"
          showCredits={false}
          items={[
            { l: "Overview", icon: Gauge },
            { l: "Agencies", icon: Users },
            { l: "Subscriptions", icon: CreditCard },
            { l: "Usage", icon: Activity },
            { l: "Integrations", icon: Database },
            { l: "Support", icon: KeyRound },
            { l: "System", icon: Server },
          ]}
        />
        <div>
          <AppTopBar title="Platform overview" subtitle="148 agencies · 3,210 clients · 14 incidents" client="all regions" />
          <div className="p-4">
            <div className="grid grid-cols-4 gap-2">
              <Stat label="Agencies" value="148" delta="+6" tone="good" />
              <Stat label="MRR" value="$48,210" delta="+11.2%" tone="good" />
              <Stat label="Credits used" value="2.41M" delta="+8.4%" tone="good" />
              <Stat label="Incidents" value="2" delta="open" tone="warn" />
            </div>

            <div className="mt-3 grid grid-cols-[1.3fr_1fr] gap-3">
              <div className="surface-elev p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11.5px] font-medium">Subscription tier mix</span>
                  <span className="mono text-[10px] text-text-muted">148 active</span>
                </div>
                <div className="mt-2 space-y-2 text-[11px]">
                  {[
                    { l: "Starter", v: 62, pct: 42 },
                    { l: "Professional", v: 71, pct: 48 },
                    { l: "Enterprise", v: 15, pct: 10 },
                  ].map((r) => (
                    <div key={r.l}>
                      <div className="flex justify-between"><span>{r.l}</span><span className="mono text-text-muted">{r.v} · {r.pct}%</span></div>
                      <div className="mt-1 h-1 overflow-hidden rounded-full bg-background">
                        <div className="h-full rounded-full bg-gradient-to-r from-indigo to-[#4F46E5]" style={{ width: `${r.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="surface-elev p-3">
                <div className="mono text-[9.5px] uppercase tracking-[0.18em] text-text-faint">Integration health</div>
                <div className="mt-2 space-y-1 text-[11px]">
                  {[
                    { l: "Meta Ads API", v: "operational", tone: "good" as const },
                    { l: "Google Ads API", v: "operational", tone: "good" as const },
                    { l: "Stripe", v: "operational", tone: "good" as const },
                    { l: "Email · Resend", v: "degraded", tone: "warn" as const },
                    { l: "Anthropic", v: "operational", tone: "good" as const },
                  ].map((r) => (
                    <div key={r.l} className="flex items-center justify-between">
                      <span className="text-text-muted">{r.l}</span>
                      <StatusPill tone={r.tone}>{r.v}</StatusPill>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-3 surface-elev p-3">
              <div className="flex items-center justify-between">
                <span className="text-[11.5px] font-medium">Support queue · 14 open</span>
                <span className="mono text-[10px] text-text-muted">avg resolution 4h 12m</span>
              </div>
              <div className="mt-2 space-y-1.5">
                {[
                  { id: "T-4821", t: "Meta token re-auth failing on Apex HVAC", p: "urgent", tone: "bad" as const },
                  { id: "T-4820", t: "GrowthDesk · custom domain SSL renewal", p: "high", tone: "warn" as const },
                  { id: "T-4819", t: "Report export missing footer logo", p: "normal", tone: "muted" as const },
                ].map((r) => (
                  <div key={r.id} className="flex items-center justify-between rounded-md border border-border bg-background/40 px-2.5 py-1.5 text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="mono text-[9.5px] text-text-faint">{r.id}</span>
                      <span>{r.t}</span>
                    </div>
                    <StatusPill tone={r.tone}>{r.p}</StatusPill>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

/* ============================================================
   ZONE 04 — Visual workflow
   ============================================================ */

const FLOW = [
  { l: "Client signed", icon: Users, pill: "synced" },
  { l: "Workspace setup", icon: Settings, pill: "ready" },
  { l: "Metrics", icon: BarChart3, pill: "live" },
  { l: "AI report", icon: FileText, pill: "draft" },
  { l: "Creative brief", icon: Megaphone, pill: "draft" },
  { l: "Approval", icon: Check, pill: "approved" },
  { l: "Client portal", icon: Layers, pill: "sent" },
  { l: "Meta push", icon: Send, pill: "live" },
] as const;

function pillTone(p: string): "good" | "warn" | "indigo" | "muted" {
  if (p === "live" || p === "approved" || p === "sent" || p === "synced") return "good";
  if (p === "draft") return "warn";
  if (p === "ready") return "indigo";
  return "muted";
}

function WorkflowFlow() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 30%"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={ref} id="studio" className="relative border-t border-border py-20">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-8">
        <SectionHeading
          eyebrow="Workflow"
          title="From signed client to live campaign — in one timeline."
          sub="Every step lives inside the same workspace. Every artifact attaches to the same client record."
        />

        <div className="mt-12">
          {/* Desktop horizontal flow */}
          <div className="relative hidden lg:block">
            <div className="absolute left-8 right-8 top-[42px] h-px bg-border" />
            <motion.div style={{ width: x }} className="absolute left-8 top-[42px] h-px bg-gradient-to-r from-indigo via-indigo/70 to-transparent" />
            <div className="relative grid grid-cols-8 gap-3">
              {FLOW.map((n, i) => (
                <Reveal key={n.l} delay={i * 0.04}>
                  <div className="flex flex-col items-center text-center">
                    <div className="relative z-10 grid h-[72px] w-full place-items-center surface-card transition-all hover:-translate-y-0.5 hover:border-indigo/40">
                      <span className="grid h-8 w-8 place-items-center rounded-md bg-indigo/15 text-indigo">
                        <n.icon className="h-4 w-4" />
                      </span>
                    </div>
                    <div className="mt-2.5 text-[12px] font-medium">{n.l}</div>
                    <div className="mt-1"><StatusPill tone={pillTone(n.pill)}>{n.pill}</StatusPill></div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Mobile vertical flow */}
          <div className="space-y-2.5 lg:hidden">
            {FLOW.map((n, i) => (
              <div key={n.l} className="flex items-center gap-3 surface-card px-4 py-3">
                <span className="grid h-9 w-9 place-items-center rounded-md bg-indigo/15 text-indigo">
                  <n.icon className="h-4 w-4" />
                </span>
                <div className="flex-1">
                  <div className="text-[13px] font-medium">{n.l}</div>
                </div>
                <StatusPill tone={pillTone(n.pill)}>{n.pill}</StatusPill>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   ZONE 05 — White-label split with brand-injection control
   ============================================================ */

function WhiteLabelSplit() {
  return (
    <section className="relative border-t border-border py-20">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-8">
        <SectionHeading
          eyebrow="White label"
          title={<>Your clients <span className="text-gradient-orvio">never see Orvio.</span></>}
          sub="Brand the portal with your logo, platform name, color, and custom domain. The same campaign data — wrapped in your identity."
        />

        <div className="mt-12 grid items-stretch gap-4 lg:grid-cols-[1fr_280px_1fr]">
          {/* Agency side */}
          <Reveal>
            <div className="surface-card overflow-hidden h-full">
              <div className="flex items-center justify-between border-b border-border bg-surface-elevated/60 px-3.5 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="grid h-5 w-5 place-items-center rounded bg-gradient-to-br from-indigo to-[#4F46E5] text-[8.5px] font-bold text-white">O</span>
                  <span className="mono text-[10.5px] font-semibold tracking-wider">ORVIO · AGENCY</span>
                </div>
                <span className="mono text-[10px] text-text-faint">app.orvio.io</span>
              </div>
              <div className="p-4">
                <div className="mono text-[9.5px] uppercase tracking-[0.18em] text-text-faint">Internal · agency team only</div>
                <div className="mt-2.5 text-[13px] font-medium">GrowthDesk · agency workspace</div>
                <div className="mt-3 grid grid-cols-3 gap-1.5">
                  <Stat label="Clients" value="24" />
                  <Stat label="Credits" value="847" />
                  <Stat label="Approvals" value="6" />
                </div>
                <div className="mt-3 rounded-md border border-border bg-surface-elevated p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium">Apex HVAC — Concept 03</span>
                    <StatusPill tone="warn">awaiting AM</StatusPill>
                  </div>
                  <div className="mt-1 mono text-[10px] text-text-muted">Internal note · Maya: client wants $89 offer pinned</div>
                </div>
                <div className="mt-2 mono text-[9.5px] text-text-faint">Health · credits · approvals · churn risk · team notes</div>
              </div>
            </div>
          </Reveal>

          {/* Brand injection control */}
          <Reveal delay={0.06}>
            <div className="relative h-full overflow-hidden surface-card p-5">
              <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-indigo/20 blur-3xl" />
              <div className="relative">
                <div className="mono-eyebrow">Brand injection</div>
                <div className="mt-2 text-[14px] font-semibold tracking-tight">White-label controls</div>
                <p className="mt-1 text-[12px] text-text-muted">Configure once. Applied across reports, contracts, invoices, and portal.</p>

                <div className="mt-4 space-y-2.5">
                  {[
                    { l: "Agency logo", v: "growthdesk-logo.svg", icon: Layers },
                    { l: "Portal name", v: "GrowthDesk", icon: Boxes },
                    { l: "Brand color", v: "#10B981", icon: CircleDot, color: true },
                    { l: "Custom domain", v: "portal.growthdesk.co", icon: Server },
                    { l: "Email sender", v: "team@growthdesk.co", icon: Send },
                  ].map((f) => (
                    <div key={f.l} className="rounded-md border border-border bg-background/40 px-2.5 py-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 mono text-[9.5px] uppercase tracking-[0.16em] text-text-faint">
                          <f.icon className="h-3 w-3" />
                          {f.l}
                        </div>
                        {f.color && <span className="h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-emerald-500/30" />}
                      </div>
                      <div className="mt-1 mono text-[11px]">{f.v}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between rounded-md border border-indigo/30 bg-indigo/10 px-2.5 py-2">
                  <span className="mono text-[10px] text-indigo">apply to all surfaces</span>
                  <ArrowRight className="h-3 w-3 text-indigo" />
                </div>
              </div>
            </div>
          </Reveal>

          {/* Client side */}
          <Reveal delay={0.12}>
            <div className="surface-card overflow-hidden h-full">
              <div className="flex items-center justify-between border-b border-emerald-500/20 bg-emerald-950/40 px-3.5 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="grid h-5 w-5 place-items-center rounded bg-emerald-500/90 text-[8.5px] font-bold text-white">GD</span>
                  <span className="mono text-[10.5px] font-semibold tracking-wider text-emerald-200">GROWTHDESK · CLIENT</span>
                </div>
                <span className="mono text-[10px] text-emerald-400/80">portal.growthdesk.co</span>
              </div>
              <div className="p-4">
                <div className="mono text-[9.5px] uppercase tracking-[0.18em] text-emerald-300/70">Client portal · Apex HVAC</div>
                <div className="mt-2.5 text-[13px] font-medium">Welcome back, Daniel</div>
                <div className="mt-3 grid grid-cols-3 gap-1.5">
                  <Stat label="Spend" value="$24.8k" delta="+12%" tone="good" />
                  <Stat label="Leads" value="612" delta="+18%" tone="good" />
                  <Stat label="CPL" value="$40.59" delta="-5%" tone="good" />
                </div>
                <div className="mt-3 rounded-md border border-border bg-surface-elevated p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium">November performance report</span>
                    <button className="rounded-md bg-emerald-500 px-2 py-0.5 text-[10px] font-medium text-white">View</button>
                  </div>
                  <div className="mt-1 mono text-[10px] text-text-muted">delivered Nov 30 · branded as GrowthDesk</div>
                </div>
                <div className="mt-2 mono text-[9.5px] text-text-faint">No Orvio branding anywhere · client-safe</div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   ZONE 06 — Pricing (compact)
   ============================================================ */

const PLANS = [
  {
    name: "Starter",
    price: "$97",
    cadence: "/month",
    desc: "Run client delivery for a focused book of clients.",
    cta: "Start free trial",
    href: "signup" as const,
    usage: ["5 clients", "1 seat", "300 credits/mo"],
    features: [
      "Up to 5 client sub-accounts",
      "White-label client portal",
      "Live Meta & Google dashboard",
      "AI monthly report generator",
      "Contracts & e-sign",
      "Client invoicing & recurring billing",
      "Onboarding checklists",
      "Lead speed tracker",
      "Client communication log",
      "AI churn risk detector",
      "1 team seat",
      "300 Studio credits / month",
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
    usage: ["20 clients", "5 seats", "1,000 credits/mo"],
    features: [
      "Up to 20 client sub-accounts",
      "Everything in Starter",
      "Custom domain",
      "Up to 5 team seats",
      "Advanced team roles",
      "AI campaign auditor",
      "Full Creative Studio access",
      "1,000 Studio credits / month",
      "Creative approval workflow",
      "Client review links",
      "Push approved creatives to Meta",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "",
    desc: "Unlimited scale with custom controls and SLAs.",
    cta: "Contact Sales",
    href: "mailto:ezra@scaledsolutions.net?subject=Orvio Enterprise Inquiry" as const,
    usage: ["Unlimited", "Custom seats", "SLA"],
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
      "White-glove Meta BM setup",
    ],
  },
];

function PlanCard({ plan }: { plan: (typeof PLANS)[number] }) {
  const popular = (plan as { popular?: boolean }).popular;
  const [open, setOpen] = useState(false);
  const visibleFeatures = open ? plan.features : plan.features.slice(0, 6);
  return (
    <div className={`relative h-full overflow-hidden rounded-[18px] border p-6 transition-all ${popular ? "border-indigo/50 bg-gradient-to-b from-indigo/10 to-surface shadow-[0_30px_80px_-30px_rgba(99,102,241,0.5)]" : "border-border bg-surface"}`}>
      {popular && (
        <div className="absolute top-5 right-5">
          <StatusPill tone="indigo"><Sparkles className="h-3 w-3" /> Most popular</StatusPill>
        </div>
      )}
      <div className="mono-eyebrow">{plan.name}</div>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-[36px] font-semibold tracking-[-0.02em]">{plan.price}</span>
        {plan.cadence && <span className="text-text-muted text-[13.5px]">{plan.cadence}</span>}
      </div>
      <p className="mt-2 text-[13px] text-text-muted">{plan.desc}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {plan.usage.map((u) => (
          <span key={u} className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-elevated px-2 py-0.5 mono text-[10px] text-text-muted">
            {u}
          </span>
        ))}
      </div>

      {plan.href === "signup" ? (
        <Link
          to="/signup"
          className={`mt-5 inline-flex h-10 w-full items-center justify-center rounded-lg text-[13px] font-medium transition-all ${popular ? "bg-indigo text-white hover:bg-[#4F46E5]" : "border border-border bg-surface-elevated text-foreground hover:border-indigo/40"}`}
        >
          {plan.cta}
        </Link>
      ) : (
        <a
          href={plan.href}
          className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-lg border border-amber/40 bg-amber/10 text-[13px] font-medium text-amber hover:bg-amber/20"
        >
          {plan.cta}
        </a>
      )}

      <ul className="mt-5 space-y-2 border-t border-border pt-5">
        {visibleFeatures.map((f) => (
          <li key={f} className="flex items-start gap-2 text-[12.5px] text-foreground/85">
            <Check className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${popular ? "text-indigo" : "text-text-muted"}`} />
            {f}
          </li>
        ))}
      </ul>
      {plan.features.length > 6 && (
        <button
          onClick={() => setOpen((v) => !v)}
          className="mt-3 inline-flex items-center gap-1 text-[11.5px] text-indigo hover:text-indigo/80"
        >
          {open ? "Show less" : `View all ${plan.features.length} features`} <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      )}
    </div>
  );
}

function PricingSection() {
  return (
    <section id="pricing" className="relative border-t border-border py-20">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-8">
        <SectionHeading
          eyebrow="Pricing"
          title="Simple plans. Real agency scale."
          sub="Start small. Upgrade when you bring on Creative Studio and a real team."
          center
        />
        <div className="mx-auto mt-12 grid max-w-[1100px] gap-4 lg:grid-cols-3">
          {PLANS.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.05}>
              <PlanCard plan={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   ZONE 07 — Trust + FAQ + CTA
   ============================================================ */

const FAQ = [
  { q: "What is Orvio?", a: "Orvio is a white-label operating system for marketing agencies. It combines client delivery — portal, reports, contracts, billing, churn risk — with an AI Creative Studio for briefs, copy, image concepts, audits, approvals, and push to Meta." },
  { q: "Do my clients see Orvio?", a: "No. The client portal is fully white-labeled with your logo, platform name, brand color, and custom domain on Professional and above." },
  { q: "How do credits work?", a: "Credits live at the workspace level and are shared across your team. Each AI action — brief, image, audit, report, churn assessment — has a fixed credit cost." },
  { q: "Can my team approve creatives?", a: "Yes. Approval routes through Media Buyer → Account Manager → Agency Owner. You can also send branded client review links." },
  { q: "Can Orvio push creatives to Meta?", a: "Yes. Approved concepts push directly into Meta Ads Manager from the Creative Studio." },
  { q: "Is Enterprise self-serve?", a: "No. Enterprise is contracted with a custom credit allocation, API access, dedicated account manager, and SLA. Email ezra@scaledsolutions.net to start." },
];

function FAQItem({ q, a, i }: { q: string; a: string; i: number }) {
  const [open, setOpen] = useState(i === 0);
  return (
    <div className="border-b border-border last:border-b-0">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between gap-6 py-4 text-left">
        <span className="text-[14.5px] font-medium">{q}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-text-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden"
      >
        <p className="pb-5 pr-8 text-[13.5px] leading-relaxed text-text-muted">{a}</p>
      </motion.div>
    </div>
  );
}

function TrustFAQ() {
  const trust = [
    { i: Lock, t: "Encrypted API credentials", d: "Meta, Google, Stripe tokens stored encrypted at rest." },
    { i: ShieldCheck, t: "Workspace roles", d: "Owner, Buyer, AM, Read-only — scoped per client." },
    { i: Layers, t: "White-label separation", d: "Clients can't see Orvio. Branding applies everywhere." },
    { i: CreditCard, t: "Stripe billing", d: "Subscriptions and invoicing run on Stripe." },
    { i: FileSignature, t: "Contracts ready", d: "Send, sign, and store contracts per client." },
    { i: Activity, t: "Integration health", d: "Live Meta, Google, GA4, and Stripe sync status." },
  ];

  return (
    <section className="relative border-t border-border py-20">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-8">
        <SectionHeading
          eyebrow="Trust"
          title="Built for sensitive agency and client data."
          sub="Agency credentials, client billing, contracts, and creative history — treated as infrastructure, not a vibe."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.05fr_1fr]">
          <Reveal>
            <div className="surface-card overflow-hidden">
              <div className="flex items-center justify-between border-b border-border bg-surface-elevated/60 px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <Server className="h-3.5 w-3.5 text-indigo" />
                  <span className="mono text-[10.5px] uppercase tracking-[0.18em] text-text-muted">Infrastructure</span>
                </div>
                <StatusPill tone="good"><span className="h-1.5 w-1.5 rounded-full bg-success live-dot" /> operational</StatusPill>
              </div>
              <div className="divide-y divide-border">
                {trust.map((it) => (
                  <div key={it.t} className="flex items-start gap-3 px-4 py-3.5">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-indigo/10 text-indigo">
                      <it.i className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[13.5px] font-medium">{it.t}</div>
                      <div className="mt-0.5 text-[12.5px] text-text-muted">{it.d}</div>
                    </div>
                    <Check className="ml-auto h-3.5 w-3.5 text-success" />
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div>
              <div className="mono-eyebrow">FAQ</div>
              <h3 className="mt-2 text-[22px] font-semibold tracking-tight">Common questions</h3>
              <div className="mt-4 rounded-[14px] border border-border bg-surface px-5">
                {FAQ.map((f, i) => <FAQItem key={f.q} q={f.q} a={f.a} i={i} />)}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="relative overflow-hidden border-t border-border">
      <div className="absolute inset-0 hero-bg" />
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="relative mx-auto max-w-[1100px] px-6 py-20 text-center sm:px-8">
        <Reveal><Eyebrow>Run it from one workspace</Eyebrow></Reveal>
        <Reveal delay={0.05}>
          <h2 className="mx-auto mt-4 max-w-3xl text-[clamp(2rem,3.8vw,3rem)] font-semibold leading-[1.05] tracking-[-0.02em]">
            Run your agency from one{" "}
            <span className="text-gradient-orvio">operating system.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-4 max-w-2xl text-[14.5px] leading-relaxed text-text-muted">
            Client delivery, reporting, billing, creative production, approvals, and campaign history — in one white-labeled workspace.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <PrimaryCTA>Start free trial</PrimaryCTA>
            <SecondaryCTA>Watch product tour</SecondaryCTA>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   PAGE
   ============================================================ */

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        <Hero />
        <OSOverview />
        <ProductShowcase />
        <WorkflowFlow />
        <WhiteLabelSplit />
        <PricingSection />
        <TrustFAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

// silence unused-icon TS checks for icons reserved for future surfaces
void Plus; void Target; void ClipboardList;

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
