import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight, Check, Palette, BarChart3, Inbox, FileCheck,
  Phone, MessageCircle, Sparkles,
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
      <Problem />
      <Features />
      <ProductTour />
      <WhiteLabel />
      <MobilePortal />
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
      <div className="relative mx-auto max-w-[1180px] px-6 pb-24 pt-32 md:pt-40">
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="mx-auto max-w-[820px] text-center"
        >
          <h1 className="text-[40px] font-semibold leading-[1.04] tracking-[-0.035em] sm:text-[52px] md:text-[64px]">
            Give every ad client a branded portal that{" "}
            <span className="text-gradient-indigo">proves your work.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-[640px] text-[16px] leading-relaxed text-muted-foreground md:text-[17.5px]">
            Orvio helps agencies running Meta and Google ads for local service businesses deliver reports, leads, approvals, invoices, and campaign updates inside one white-labeled client portal.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/book-demo" className="inline-flex h-11 items-center gap-1.5 rounded-lg bg-foreground px-5 text-[14px] font-medium text-background hover:bg-foreground/90">
              Book a demo <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/product" className="inline-flex h-11 items-center gap-1.5 rounded-lg border border-border bg-background px-5 text-[14px] font-medium text-foreground hover:bg-[var(--surface-2)]">
              View product
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
          {/* Sidebar */}
          <div className="hidden w-[210px] shrink-0 border-r border-border bg-background p-4 md:block">
            <div className="flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-md bg-foreground"><span className="h-1.5 w-1.5 rounded-full bg-background" /></span>
              <span className="text-[13px] font-semibold tracking-tight">Northstar</span>
            </div>
            <div className="mt-6 space-y-0.5 text-[12px]">
              {["Overview", "Clients", "Reporting", "Leads", "Approvals", "Invoices", "Settings"].map((l, i) => (
                <div key={l} className={`flex items-center gap-2 rounded-md px-2 py-1.5 ${i === 2 ? "bg-[var(--surface-2)] font-medium text-foreground" : "text-muted-foreground"}`}>
                  <span className="h-1 w-1 rounded-full bg-current opacity-50" /> {l}
                </div>
              ))}
            </div>
          </div>

          {/* Main */}
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
/*  Problem / Before vs After                                          */
/* ------------------------------------------------------------------ */

function Problem() {
  return (
    <section className="py-28 md:py-36">
      <div className="mx-auto max-w-[1080px] px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[32px] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[38px] md:text-[44px]">
            Clients churn when they can't see the work.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15.5px] leading-relaxed text-muted-foreground">
            You're running the campaigns. They're seeing a Google Sheet, a Loom, and a Stripe link. Orvio puts everything in one branded place.
          </p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-background p-7">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Before Orvio</div>
            <p className="mt-3 text-[17px] font-semibold leading-snug tracking-[-0.01em]">
              Sheets, Looms, screenshots, Stripe links — and approvals lost in email threads.
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
/*  Features                                                           */
/* ------------------------------------------------------------------ */

function Features() {
  return (
    <section className="hairline-t py-28 md:py-36">
      <div className="mx-auto max-w-[1180px] px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[32px] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[38px] md:text-[44px]">
            Everything an agency owner needs. Nothing more.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            Four surfaces that replace the patchwork of tools you use to deliver client work today.
          </p>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2">
          <FeatureCard
            icon={Palette}
            title="White-label client portal"
            body="Your logo, your domain, your colors. Clients sign in to your software, not Orvio."
            visual={<FVPortal />}
          />
          <FeatureCard
            icon={BarChart3}
            title="Plain-English ad reporting"
            body="Spend, leads, CPL, and CTR explained next to every number — for clients who don't speak ads."
            visual={<FVReport />}
          />
          <FeatureCard
            icon={Inbox}
            title="Lead inbox and follow-up tracking"
            body="Every form fill and inbound call in one place. Status, assign, follow up. No more lost leads."
            visual={<FVLeads />}
          />
          <FeatureCard
            icon={FileCheck}
            title="Approvals and invoices"
            body="Clients approve creative and pay invoices inside the portal. No more email threads."
            visual={<FVApprove />}
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon: Icon, title, body, visual }: { icon: any; title: string; body: string; visual: React.ReactNode }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-background transition-shadow hover:shadow-soft">
      <div className="border-b border-border bg-[var(--surface-2)]/40 p-6">
        <div className="h-[160px]">{visual}</div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-[var(--accent)]" />
          <h3 className="text-[16px] font-semibold tracking-tight">{title}</h3>
        </div>
        <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">{body}</p>
      </div>
    </div>
  );
}

function FVPortal() {
  return (
    <div className="mx-auto h-full max-w-[260px] overflow-hidden rounded-xl border border-border bg-background shadow-soft">
      <div className="flex items-center gap-2 border-b border-border px-3 py-2">
        <span className="grid h-5 w-5 place-items-center rounded text-[10px] font-bold text-white" style={{ background: "#4F46E5" }}>N</span>
        <span className="text-[11.5px] font-semibold">Northstar</span>
      </div>
      <div className="p-3">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Welcome</div>
        <div className="text-[13px] font-semibold">Hartland Plumbing</div>
        <div className="mt-3 h-1.5 w-full rounded-full bg-[var(--surface-2)]">
          <div className="h-full w-3/4 rounded-full bg-[var(--accent)]" />
        </div>
        <div className="mt-3 grid grid-cols-3 gap-1.5">
          {["Leads", "CPL", "Booked"].map((l, i) => (
            <div key={l} className="rounded border border-border p-1.5">
              <div className="text-[8.5px] text-muted-foreground">{l}</div>
              <div className="text-[10.5px] font-semibold">{["63", "$67", "18"][i]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FVReport() {
  return (
    <div className="grid h-full place-items-center">
      <svg viewBox="0 0 200 80" className="w-full max-w-[280px]">
        <defs>
          <linearGradient id="rg" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M0,60 L20,52 L40,55 L60,42 L80,38 L100,28 L120,30 L140,20 L160,16 L180,14 L200,8 L200,80 L0,80 Z" fill="url(#rg)" />
        <path d="M0,60 L20,52 L40,55 L60,42 L80,38 L100,28 L120,30 L140,20 L160,16 L180,14 L200,8" fill="none" stroke="#4F46E5" strokeWidth="1.6" />
        {[15, 30, 45, 60, 75].map(x => <circle key={x} cx={x * 2.66} cy={[52, 42, 28, 20, 14][Math.floor(x / 15) - 1]} r="2" fill="#4F46E5" />)}
      </svg>
    </div>
  );
}

function FVLeads() {
  const leads = [
    { name: "Brian Connors", note: "Burst pipe · Detroit", tag: "New", tone: "warning" },
    { name: "Whitney Park", note: "Roof estimate · Minneapolis", tag: "Contacted", tone: "accent" },
    { name: "Marcus Hill", note: "Kitchen remodel · Phoenix", tag: "Booked", tone: "success" },
  ];
  return (
    <div className="space-y-1.5">
      {leads.map(l => (
        <div key={l.name} className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2">
          <div className="min-w-0">
            <div className="truncate text-[11.5px] font-semibold">{l.name}</div>
            <div className="truncate text-[10px] text-muted-foreground">{l.note}</div>
          </div>
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9.5px] font-semibold ${l.tone === "success" ? "bg-[var(--success-soft)] text-[var(--success)]" : l.tone === "accent" ? "bg-[var(--accent-soft)] text-[var(--accent)]" : "bg-[var(--warning-soft)] text-[var(--warning)]"}`}>{l.tag}</span>
        </div>
      ))}
    </div>
  );
}

function FVApprove() {
  return (
    <div className="rounded-xl border border-border bg-background p-3">
      <div className="rounded-md bg-[var(--surface-2)]/60 p-2.5 text-[11px] leading-snug text-foreground/80">
        "Burst pipe at 11pm? Hartland Plumbing dispatches a licensed plumber in under 60 minutes."
      </div>
      <div className="mt-2.5 grid grid-cols-2 gap-1.5">
        <div className="inline-flex h-7 items-center justify-center gap-1 rounded-md bg-[var(--success)] text-[10.5px] font-medium text-white">
          <Check className="h-3 w-3" /> Approve
        </div>
        <div className="inline-flex h-7 items-center justify-center gap-1 rounded-md border border-border text-[10.5px] font-medium">
          Request changes
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between rounded-md border border-border bg-[var(--surface-2)]/40 px-2.5 py-1.5">
        <span className="text-[10.5px] text-muted-foreground">Invoice · INV-04812</span>
        <span className="mono text-[10.5px] font-semibold">$2,400.00</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Product tour                                                       */
/* ------------------------------------------------------------------ */

function ProductTour() {
  const steps = [
    {
      n: "01",
      title: "Add a client",
      body: "Invite a contractor in under a minute. Their portal goes live with your logo and brand color.",
      visual: <TourAddClient />,
    },
    {
      n: "02",
      title: "Client sees leads, reports, and approvals",
      body: "They log in to one place — every lead, the month's reporting, and any creative awaiting their nod.",
      visual: <TourClientView />,
    },
    {
      n: "03",
      title: "Stay aligned every month",
      body: "Send invoices, share monthly reports, and surface accounts that need attention before they cancel.",
      visual: <TourMonthly />,
    },
  ];
  return (
    <section className="hairline-t bg-[var(--surface-2)]/30 py-28 md:py-36">
      <div className="mx-auto max-w-[1180px] px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[32px] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[38px] md:text-[44px]">
            From cluttered tools to one calm workflow.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            Three steps from agency setup to a client renewal conversation that runs itself.
          </p>
        </div>

        <div className="mt-16 space-y-20 md:space-y-28">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className={`grid items-center gap-10 md:grid-cols-2 md:gap-16 ${i % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""}`}
            >
              <div>
                <div className="mono text-[12px] tracking-wider text-[var(--accent)]">{s.n}</div>
                <h3 className="mt-2 text-[24px] font-semibold leading-[1.15] tracking-[-0.02em] md:text-[30px]">{s.title}</h3>
                <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
              <div>{s.visual}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TourAddClient() {
  return (
    <div className="rounded-2xl border border-border bg-background p-5 shadow-soft">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Invite client</div>
      <div className="mt-3 space-y-2.5">
        {[
          ["Business name", "Hartland Plumbing"],
          ["Owner", "Mike Hartland"],
          ["Email", "mike@hartlandplumbing.com"],
        ].map(([l, v]) => (
          <div key={l} className="rounded-lg border border-border bg-[var(--surface-2)]/40 px-3 py-2">
            <div className="text-[10.5px] text-muted-foreground">{l}</div>
            <div className="text-[13px] font-medium">{v}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-[var(--accent)]/30 bg-[var(--accent-soft)] px-3 py-2.5">
        <div className="text-[12px] font-medium text-[var(--accent)]">Portal ready in ~20 seconds</div>
        <ArrowRight className="h-4 w-4 text-[var(--accent)]" />
      </div>
    </div>
  );
}

function TourClientView() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-soft">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded text-[10px] font-bold text-white" style={{ background: "#4F46E5" }}>N</span>
          <span className="text-[12.5px] font-semibold">Northstar · Client Portal</span>
        </div>
        <span className="text-[10.5px] text-muted-foreground">portal.northstar.io</span>
      </div>
      <div className="grid grid-cols-3 gap-2 p-4">
        {[
          ["Spend", "$4,280"],
          ["Leads", "63"],
          ["Booked", "18"],
        ].map(([l, v]) => (
          <div key={l} className="rounded-lg border border-border bg-[var(--surface-2)]/40 p-2.5">
            <div className="text-[10px] text-muted-foreground">{l}</div>
            <div className="text-[15px] font-semibold tracking-tight">{v}</div>
          </div>
        ))}
      </div>
      <div className="px-4 pb-4">
        <div className="rounded-lg border border-border bg-background p-3">
          <div className="text-[11px] font-medium">Awaiting your approval · 2</div>
          <div className="mt-2 flex items-center justify-between gap-2 rounded-md border border-border bg-[var(--surface-2)]/40 px-2.5 py-1.5">
            <span className="text-[11.5px]">Emergency Plumbing — primary v3</span>
            <Check className="h-3.5 w-3.5 text-[var(--accent)]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function TourMonthly() {
  return (
    <div className="rounded-2xl border border-border bg-background p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Monthly summary</div>
        <span className="text-[11px] text-muted-foreground">April 2026</span>
      </div>
      <h4 className="mt-2 text-[17px] font-semibold tracking-tight">Best month yet for Hartland Plumbing</h4>
      <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
        Roof Replacement scaled, booked calls up 38% week over week, and CPL settled at $67.94.
      </p>
      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4">
        {[
          ["+38%", "Booked"],
          ["-12%", "CPL"],
          ["$4.2k", "Spend"],
        ].map(([v, l]) => (
          <div key={l}>
            <div className="text-[18px] font-semibold tracking-tight">{v}</div>
            <div className="text-[10.5px] uppercase tracking-wider text-muted-foreground">{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  White-label                                                        */
/* ------------------------------------------------------------------ */

function WhiteLabel() {
  const brands = [
    { name: "Northstar Growth", domain: "portal.northstargrowth.com", letter: "N", color: "#4F46E5" },
    { name: "Tidewater Media", domain: "clients.tidewater.io", letter: "T", color: "#0EA5E9" },
    { name: "Foundry Local", domain: "app.foundry.co", letter: "F", color: "#F97316" },
  ];
  return (
    <section className="hairline-t py-28 md:py-36">
      <div className="mx-auto max-w-[1180px] px-6">
        <div className="grid items-center gap-12 md:grid-cols-[1fr_1.3fr] md:gap-16">
          <div>
            <h2 className="text-[30px] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[36px] md:text-[40px]">
              The agency gets the credit. Not Orvio.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              Your logo, your color, your domain. Clients only ever see your brand — from the login screen to every report.
            </p>
            <ul className="mt-6 space-y-3 text-[14px]">
              {[
                "Upload a logo and pick a primary color",
                "Connect a custom domain in minutes",
                "Branded login, reports, invoices, and email",
              ].map(t => (
                <li key={t} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
                  <span className="text-foreground/85">{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {brands.map(b => (
              <div key={b.name} className="overflow-hidden rounded-2xl border border-border bg-background shadow-soft">
                <div className="flex items-center gap-2 px-3 py-2.5" style={{ background: `${b.color}10` }}>
                  <span className="grid h-6 w-6 place-items-center rounded text-[10px] font-bold text-white" style={{ background: b.color }}>{b.letter}</span>
                  <div className="min-w-0">
                    <div className="truncate text-[11.5px] font-semibold">{b.name}</div>
                    <div className="truncate text-[9.5px] mono text-muted-foreground">{b.domain}</div>
                  </div>
                </div>
                <div className="p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">April</div>
                  <div className="text-[12.5px] font-semibold">Hartland Plumbing</div>
                  <div className="mt-2.5 grid grid-cols-2 gap-1.5">
                    {[["Leads", "63"], ["CPL", "$67"], ["Spend", "$4.2k"], ["Booked", "18"]].map(([l, v]) => (
                      <div key={l} className="rounded border border-border p-1.5">
                        <div className="text-[8.5px] text-muted-foreground">{l}</div>
                        <div className="text-[11px] font-semibold">{v}</div>
                      </div>
                    ))}
                  </div>
                  <button className="mt-2.5 w-full rounded-md py-1.5 text-[10.5px] font-medium text-white" style={{ background: b.color }}>
                    View this month
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Mobile portal                                                      */
/* ------------------------------------------------------------------ */

function MobilePortal() {
  return (
    <section className="hairline-t bg-[var(--surface-2)]/30 py-28 md:py-36">
      <div className="mx-auto max-w-[1180px] px-6">
        <div className="grid items-center gap-14 md:grid-cols-[1fr_1fr]">
          <div>
            <h2 className="text-[30px] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[36px] md:text-[40px]">
              Built for contractors checking their phone between jobs.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              The client portal works on a phone screen. Leads, approvals, and call/text shortcuts — exactly where contractors need them.
            </p>
            <div className="mt-7 grid grid-cols-3 gap-3 text-[12.5px]">
              {[
                ["Leads", "real time"],
                ["Approvals", "one tap"],
                ["Call & text", "in-app"],
              ].map(([l, v]) => (
                <div key={l} className="rounded-lg border border-border bg-background p-3">
                  <div className="font-semibold">{l}</div>
                  <div className="text-muted-foreground">{v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <div className="w-[280px] rounded-[34px] border-[6px] border-foreground/90 bg-foreground/90 p-1.5 shadow-pop">
              <div className="overflow-hidden rounded-[24px] bg-background">
                <div className="flex items-center justify-between border-b border-border px-3.5 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="grid h-5 w-5 place-items-center rounded bg-[var(--accent)]"><span className="h-1 w-1 rounded-full bg-white" /></span>
                    <span className="text-[12px] font-semibold">Northstar</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">portal</span>
                </div>
                <div className="p-4">
                  <div className="text-[10.5px] uppercase tracking-wider text-muted-foreground">Hartland Plumbing</div>
                  <div className="text-[15px] font-semibold">April</div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {[["Leads", "63"], ["CPL", "$67"], ["Spend", "$4.2k"], ["Booked", "18"]].map(([l, v]) => (
                      <div key={l} className="rounded-lg border border-border bg-[var(--surface-2)]/40 p-2">
                        <div className="text-[9.5px] text-muted-foreground">{l}</div>
                        <div className="mt-0.5 text-[14px] font-semibold">{v}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 rounded-lg border border-border bg-background p-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[11.5px] font-semibold">Brian Connors</div>
                        <div className="text-[10px] text-muted-foreground">Burst pipe · 9:14am</div>
                      </div>
                      <span className="rounded-full bg-[var(--warning-soft)] px-1.5 py-0.5 text-[9px] font-semibold text-[var(--warning)]">New</span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-1.5">
                      <div className="inline-flex h-7 items-center justify-center gap-1 rounded bg-foreground text-[10px] font-medium text-background">
                        <Phone className="h-3 w-3" /> Call
                      </div>
                      <div className="inline-flex h-7 items-center justify-center gap-1 rounded border border-border text-[10px] font-medium">
                        <MessageCircle className="h-3 w-3" /> Text
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
    sub: "Up to 3 clients",
    best: "Best for solo agencies starting with client portals",
    features: ["Branded client portal", "Reporting + lead inbox", "Monthly reports", "Email support"],
    pop: false,
  },
  {
    name: "Growth",
    price: 297,
    sub: "Up to 10 clients",
    best: "Best for agencies managing active client delivery",
    features: ["Everything in Starter", "Custom domain", "Approvals + invoices", "Team seats", "Priority support"],
    pop: true,
  },
  {
    name: "Pro",
    price: 497,
    sub: "Up to 25 clients",
    best: "Best for growing agencies that want more automation",
    features: ["Everything in Growth", "AI report summaries", "Advanced client health", "Stripe Connect", "More team seats"],
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
              <div className="text-[12.5px] text-muted-foreground">50+ clients, SSO, API access, custom onboarding, dedicated support.</div>
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
    ["How does data come in?", "Connect Meta and Google via OAuth, or import CSVs and enter spend manually. Direct API sync is available on most accounts."],
    ["Where does my data live?", "Encrypted at rest in US-based infrastructure. Your client data is scoped to your workspace. We never sell or train on it."],
    ["Do you run the campaigns for us?", "No. Orvio is software. Your team runs the campaigns. Orvio is the operating system that makes running and reporting them easier."],
    ["How do AI credits work?", "Credits are used only for optional AI features (report summaries, ad copy drafts). Core reporting, leads, approvals, invoices, and white-label settings are included."],
    ["What's client health?", "A signal that highlights accounts that may need attention based on lead volume, CPL movement, and portal engagement."],
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
            View product
          </Link>
        </div>
      </div>
    </section>
  );
}
