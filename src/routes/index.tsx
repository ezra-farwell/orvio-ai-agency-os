import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight, Check, BarChart3, Inbox, MessageSquare, Palette, CreditCard,
  ShieldCheck, Sparkles, Users, Building2, Zap, ChevronRight,
} from "lucide-react";
import { MarketingShell } from "@/components/shells/MarketingShell";
import { campaigns, currentAgency } from "@/mock/data";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Orvio — White-label client portals for agencies that run ads" },
      { name: "description", content: "Orvio is the operating system for marketing agencies running Meta and Google Ads for local service businesses. White-label portals, ad reporting, leads, payments, and a content studio." },
      { property: "og:title", content: "Orvio — White-label client portals for agencies that run ads" },
      { property: "og:description", content: "The agency OS for paid ads, client portals, lead tracking, content approvals, and payments." },
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
      <ProductDeepDive />
      <Stats />
      <PricingPreview />
      <FAQ />
      <FinalCTA />
    </MarketingShell>
  );
}

/* ---------------- Hero ---------------- */

function Hero() {
  return (
    <section className="hero-bg relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="relative mx-auto max-w-[1240px] px-6 pb-24 pt-36 md:pt-40">
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <Link to="/product" className="chip-indigo">
            <Sparkles className="h-3 w-3" /> Now with AI ad copy and brand memory
            <ChevronRight className="h-3 w-3" />
          </Link>
          <h1 className="mt-6 text-[44px] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[60px]">
            White-label client portals for agencies that <span className="text-gradient-indigo">run ads.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-[15.5px] leading-relaxed text-muted-foreground md:text-[17px]">
            Orvio is the operating system for marketing agencies running Meta &amp; Google Ads for plumbers, roofers, HVAC, electricians, and remodelers. One branded workspace for ad reporting, leads, content approvals, and payments.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link to="/book-demo" className="inline-flex h-11 items-center gap-1.5 rounded-lg bg-foreground px-5 text-[14px] font-medium text-background hover:bg-foreground/90">
              Book a demo <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/app" className="inline-flex h-11 items-center gap-1.5 rounded-lg border border-border bg-background px-5 text-[14px] font-medium text-foreground hover:bg-[var(--surface-2)]">
              View the product
            </Link>
          </div>
          <div className="mt-4 text-[12.5px] text-muted-foreground">
            14-day trial · No credit card · Cancel anytime
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
          className="relative mx-auto mt-14 max-w-[1180px]"
        >
          <DashboardMock />
        </motion.div>
      </div>
    </section>
  );
}

function DashboardMock() {
  return (
    <div className="relative rounded-2xl border border-border bg-background p-2 shadow-pop">
      <div className="overflow-hidden rounded-xl border border-border bg-[var(--surface-2)]">
        {/* mock app shell */}
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
          <div className="min-w-0 flex-1 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] text-muted-foreground">Ad reporting · Last 30 days</div>
                <div className="text-[15px] font-semibold">All clients · Meta + Google</div>
              </div>
              <div className="flex gap-1.5">
                <span className="chip">Meta Ads</span>
                <span className="chip">Google Ads</span>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {[
                ["Spend","$24,840","+8.2%"],
                ["Leads","612","+12.4%"],
                ["CPL","$40.59","-4.1%"],
                ["CTR","2.8%","+0.3pp"],
              ].map(([l,v,d]) => (
                <div key={l} className="rounded-lg border border-border bg-background p-2.5">
                  <div className="text-[10.5px] text-muted-foreground">{l}</div>
                  <div className="mt-0.5 text-[15px] font-semibold tracking-tight">{v}</div>
                  <div className="text-[10px] text-[var(--success)]">{d}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-3">
              <div className="md:col-span-2 rounded-lg border border-border bg-background p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-[11.5px] font-medium">Spend vs Leads</div>
                  <div className="text-[10.5px] text-muted-foreground">30d</div>
                </div>
                <ChartMini />
              </div>
              <div className="rounded-lg border border-border bg-background p-3">
                <div className="text-[11.5px] font-medium">Best campaign</div>
                <div className="mt-1 text-[13px] font-semibold">Roof Replacement</div>
                <div className="text-[10.5px] text-muted-foreground">38 leads · $78 CPL</div>
                <div className="mt-3 text-[11.5px] font-medium">Worst campaign</div>
                <div className="mt-1 text-[13px] font-semibold">Kitchen Remodel</div>
                <div className="text-[10.5px] text-muted-foreground">22 leads · $146 CPL</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute -bottom-6 left-1/2 h-12 w-3/4 -translate-x-1/2 rounded-full bg-[var(--accent)]/15 blur-3xl" />
    </div>
  );
}

function ChartMini() {
  const pts = [12,18,16,22,28,26,34,32,40,42,38,48,52,49,58];
  const max = Math.max(...pts);
  const w = 100, h = 38;
  const step = w / (pts.length - 1);
  const line = pts.map((p,i) => `${i===0?"M":"L"}${(i*step).toFixed(2)},${(h - (p/max)*h).toFixed(2)}`).join(" ");
  const area = `${line} L${w},${h} L0,${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-20 w-full">
      <defs><linearGradient id="g1" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#4F46E5" stopOpacity="0.25" /><stop offset="100%" stopColor="#4F46E5" stopOpacity="0" /></linearGradient></defs>
      <path d={area} fill="url(#g1)" />
      <path d={line} fill="none" stroke="#4F46E5" strokeWidth="1.4" />
    </svg>
  );
}

/* ---------------- Logos / trust ---------------- */

function Logos() {
  return (
    <section className="hairline-b py-10">
      <div className="mx-auto max-w-[1240px] px-6">
        <div className="text-center text-[12px] uppercase tracking-wider text-muted-foreground">
          Trusted by agencies running ads for local service businesses
        </div>
        <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-4 text-center text-[15px] font-semibold tracking-tight text-foreground/60 sm:grid-cols-3 md:grid-cols-6">
          {["Northstar Growth","Tidewater","Foundry Local","Bluefield","Pinecrest","Sable & Co."].map(n => (
            <div key={n}>{n}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Problem ---------------- */

function Problem() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-[1240px] px-6">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <div className="chip">The agency problem</div>
            <h2 className="mt-3 text-[34px] font-semibold leading-[1.1] tracking-[-0.02em] md:text-[40px]">
              Clients churn when they can't see the work.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              You're running solid campaigns. But every month you ship a Google Sheet, a Loom, and a Stripe link. The contractor doesn't know what CTR means, doesn't see the leads in real time, and forgets why they're paying you. Then they cancel.
            </p>
            <ul className="mt-6 space-y-2.5 text-[14px]">
              {["Reports buried in PDFs and screenshots","Leads scattered across Meta forms, CallRail, email","No place to approve creative without endless threads","Payments tracked in three different tools"].map(t => (
                <li key={t} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--danger)]" />
                  <span className="text-foreground/80">{t}</span>
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
      </div>
    </section>
  );
}
function Bubble({ side, children }: { side: "left" | "right"; children: React.ReactNode }) {
  const right = side === "right";
  return (
    <div className={`flex ${right ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-[13px] leading-snug ${right ? "bg-foreground text-background" : "bg-[var(--surface-2)] text-foreground"}`}>{children}</div>
    </div>
  );
}

/* ---------------- Feature grid ---------------- */

const features = [
  { icon: Palette, title: "White-label portals", body: "Your logo, your domain, your colors. Clients sign into a portal that looks like your software, not someone else's tool." },
  { icon: BarChart3, title: "Meta & Google reporting", body: "Spend, leads, CPL, CTR, CPM — pulled in real time, explained in plain English for the contractor." },
  { icon: Inbox, title: "Lead tracking", body: "Every form fill, call, and inbound message in one inbox. Assign, status, convert. No more lost leads." },
  { icon: Sparkles, title: "Content Studio with AI", body: "Generate ad copy, headlines, landing page angles, and emails grounded in each client's brand memory." },
  { icon: MessageSquare, title: "Content approvals", body: "Ship creative, get approve / request-changes feedback inside the portal. No more endless email threads." },
  { icon: CreditCard, title: "Payments & financing", body: "Invoices, Stripe Connect, and financing links — so getting paid feels like part of the product, not a chore." },
];
function FeatureGrid() {
  return (
    <section className="hairline-t py-24">
      <div className="mx-auto max-w-[1240px] px-6">
        <div className="max-w-2xl">
          <div className="chip-indigo">One workspace</div>
          <h2 className="mt-3 text-[34px] font-semibold leading-[1.1] tracking-[-0.02em] md:text-[40px]">Everything your agency runs, in one branded portal.</h2>
          <p className="mt-3 text-[15px] text-muted-foreground">Replace the patchwork of Sheets, Loom, Slack threads, and Stripe pages with a single product that's actually built for agencies running paid ads.</p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="group rounded-2xl border border-border bg-background p-5 transition-shadow hover:shadow-soft">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
                <f.icon className="h-4.5 w-4.5" />
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

/* ---------------- Product deep dive (3 stacked sections w/ visuals) ---------------- */

function ProductDeepDive() {
  return (
    <section className="hairline-t py-24">
      <div className="mx-auto max-w-[1240px] space-y-28 px-6">
        <DeepRow
          flip={false}
          eyebrow="Agency portal"
          title="Run every client account from one workspace."
          body="The agency portal is where you actually do the work. Manage every contractor account, invite team members, assign leads, build campaigns in the Studio, and ship monthly reports — all without switching tools."
          bullets={["Multi-client overview with revenue, spend, and churn signals","Unified leads inbox across Meta, Google, calls","Kanban pipeline from new lead → won job","Stripe Connect payments and invoice tracking"]}
          cta={["Tour the agency portal","/app"]}
          visual={<AgencyVisual />}
        />
        <DeepRow
          flip
          eyebrow="Client portal"
          title="A portal contractors actually log into."
          body="Your client sees what they paid for — in plain English. No marketing jargon. Booked appointments, leads, what their ad spend turned into, and what's pending their approval."
          bullets={["Ad spend, leads, CPL with a one-line helper next to every metric","Lead list with call/text shortcuts","Pending content approvals with one-click approve","Monthly reports they can read on their phone"]}
          cta={["See the client view","/portal"]}
          visual={<ClientVisual />}
        />
        <DeepRow
          flip={false}
          eyebrow="Content Studio"
          title="AI creative grounded in each client's brand."
          body="The Studio writes ads, social posts, landing page copy, and emails — using a brand memory for every client. Approved claims, words to avoid, services, offers, testimonials. Output that actually sounds like the brand."
          bullets={["Ad Builder with Meta and Google previews","Brand memory per client","Approval flow built into the asset","Status: Draft → In Review → Approved → Scheduled"]}
          cta={["Explore the Studio","/app/studio"]}
          visual={<StudioVisual />}
        />
      </div>
    </section>
  );
}

function DeepRow({ flip, eyebrow, title, body, bullets, cta, visual }: {
  flip?: boolean; eyebrow: string; title: string; body: string; bullets: string[]; cta: [string, string]; visual: React.ReactNode;
}) {
  return (
    <div className={`grid items-center gap-12 md:grid-cols-2 ${flip ? "md:[&>div:first-child]:order-2" : ""}`}>
      <div>
        <div className="chip">{eyebrow}</div>
        <h3 className="mt-3 text-[28px] font-semibold leading-[1.15] tracking-[-0.02em] md:text-[34px]">{title}</h3>
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
  return (
    <div className="rounded-2xl border border-border bg-background p-3 shadow-soft">
      <div className="rounded-xl bg-[var(--surface-2)] p-4">
        <div className="mb-3 text-[11px] uppercase tracking-wider text-muted-foreground">Active clients</div>
        <div className="space-y-2">
          {[
            ["Hartland Plumbing","$4,280","63 leads","Active"],
            ["Northside Roofing","$6,420","81 leads","Active"],
            ["Apex Remodeling","$8,910","47 leads","Active"],
            ["Brighton HVAC","$3,140","28 leads","At-risk"],
          ].map(([n,s,l,st]) => (
            <div key={n as string} className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2.5">
              <div className="text-[13px] font-medium">{n}</div>
              <div className="flex items-center gap-3 text-[12px] text-muted-foreground">
                <span className="mono">{s}</span>
                <span>{l}</span>
                <span className={st === "At-risk" ? "chip-warning" : "chip-success"}>{st}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ClientVisual() {
  return (
    <div className="rounded-2xl border border-border bg-background p-3 shadow-soft">
      <div className="rounded-xl bg-[var(--surface-2)] p-4">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{currentAgency.name} · Client view</div>
        <div className="mt-1 text-[14px] font-semibold">Hartland Plumbing</div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {[
            ["This month's ad spend","$4,280","what you invested in ads"],
            ["Leads generated","63","new potential customers"],
            ["Cost per lead","$67.94","what each lead costs you"],
            ["Booked appointments","18","calls already on the calendar"],
          ].map(([l,v,h]) => (
            <div key={l as string} className="rounded-lg border border-border bg-background p-2.5">
              <div className="text-[10.5px] text-muted-foreground">{l}</div>
              <div className="mt-0.5 text-[16px] font-semibold">{v}</div>
              <div className="text-[10px] text-muted-foreground">{h}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-lg border border-[var(--accent)]/30 bg-[var(--accent-soft)] px-3 py-2 text-[12px] text-[var(--accent)]">
          <span className="font-medium">Update from your agency:</span> Roof Replacement campaign is up 22% this week. Scaling budget.
        </div>
      </div>
    </div>
  );
}

function StudioVisual() {
  return (
    <div className="rounded-2xl border border-border bg-background p-3 shadow-soft">
      <div className="rounded-xl bg-[var(--surface-2)] p-4">
        <div className="flex items-center gap-1.5">
          <span className="chip-indigo"><Sparkles className="h-3 w-3" /> Generate ad</span>
          <span className="chip">Hartland Plumbing</span>
          <span className="chip">Meta Ads</span>
        </div>
        <div className="mt-3 rounded-lg border border-border bg-background p-3">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Primary text · v3</div>
          <div className="mt-1 text-[13px] leading-relaxed">
            Burst pipe at 11pm? Hartland Plumbing dispatches a licensed plumber to Detroit Metro homes in under 60 minutes — no overtime fees.
          </div>
          <div className="mt-3 flex gap-2">
            <button className="chip-success">Approve</button>
            <button className="chip-warning">Request changes</button>
            <button className="chip">Regenerate</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Stats ---------------- */

function Stats() {
  const stats = [
    ["3.4x", "more client retention", "vs running ads in Sheets + Slack"],
    ["41 min", "saved per client per week", "on reporting and creative reviews"],
    ["$1.2M+", "in monthly client ad spend", "tracked through Orvio portals"],
    ["98%", "of clients log in monthly", "to their white-labeled portal"],
  ];
  return (
    <section className="hairline-t hairline-b bg-[var(--surface-2)]/40 py-16">
      <div className="mx-auto grid max-w-[1240px] grid-cols-2 gap-8 px-6 md:grid-cols-4">
        {stats.map(([v,l,sub]) => (
          <div key={l} className="text-center md:text-left">
            <div className="text-[36px] font-semibold tracking-tight md:text-[42px]">{v}</div>
            <div className="mt-1 text-[13px] font-medium text-foreground">{l}</div>
            <div className="text-[12px] text-muted-foreground">{sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Pricing ---------------- */

function PricingPreview() {
  const tiers = [
    { name: "Starter", price: "$97", sub: "Solo / 1-3 clients", pop: false, features: ["1 agency seat","Up to 3 client accounts","Meta + Google reporting","Client portals","Email support"] },
    { name: "Growth", price: "$297", sub: "Most agencies", pop: true, features: ["5 agency seats","Up to 25 client accounts","Content Studio with AI","White-label domain","Stripe Connect payments","Priority support"] },
    { name: "Scale", price: "$697", sub: "Multi-team agencies", pop: false, features: ["Unlimited seats","Unlimited client accounts","Multi-brand white-label","Brand memory + custom AI","API access","Dedicated CSM"] },
  ];
  return (
    <section id="pricing" className="hairline-t py-24">
      <div className="mx-auto max-w-[1240px] px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="chip">Pricing</div>
          <h2 className="mt-3 text-[34px] font-semibold leading-[1.1] tracking-[-0.02em] md:text-[40px]">Priced for agencies, not enterprises.</h2>
          <p className="mt-3 text-[15px] text-muted-foreground">Flat monthly pricing per agency. No per-client fees. No per-seat upsells on the growth plan.</p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {tiers.map(t => (
            <div key={t.name} className={`rounded-2xl border bg-background p-6 ${t.pop ? "border-foreground shadow-pop" : "border-border"}`}>
              {t.pop && <div className="mb-3 inline-flex chip-indigo">Most popular</div>}
              <div className="text-[13px] font-medium text-muted-foreground">{t.name}</div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-[40px] font-semibold tracking-tight">{t.price}</span>
                <span className="text-[13px] text-muted-foreground">/mo</span>
              </div>
              <div className="mt-1 text-[12.5px] text-muted-foreground">{t.sub}</div>
              <Link to="/book-demo" className={`mt-5 flex h-10 items-center justify-center rounded-lg text-[13.5px] font-medium ${t.pop ? "bg-foreground text-background hover:bg-foreground/90" : "border border-border bg-background text-foreground hover:bg-[var(--surface-2)]"}`}>
                Start 14-day trial
              </Link>
              <ul className="mt-5 space-y-2">
                {t.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-[13px]">
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
            <div className="text-[14px] font-semibold">Enterprise</div>
            <div className="text-[12.5px] text-muted-foreground">Custom pricing for agencies with 50+ clients, SSO, custom contracts, and dedicated infrastructure.</div>
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
  const faqs = [
    ["Is Orvio actually white-label?","Yes. Your logo, domain (portal.youragency.com), brand colors, and email sender. Your clients never see Orvio branding."],
    ["Which ad platforms do you support?","Meta Ads (Facebook + Instagram) and Google Ads, including Search, Performance Max, and Demand Gen."],
    ["Do you do the work for us?","No. Orvio is software. Your team runs the campaigns. Orvio is the operating system that makes running and reporting them easier."],
    ["What about payments?","Stripe Connect — invoices, recurring subscriptions, and financing links flow through your account directly. We never touch the money."],
    ["Can clients log in on mobile?","Yes. The client portal is fully responsive. Contractors check leads and approvals from their truck."],
  ];
  return (
    <section className="hairline-t py-24">
      <div className="mx-auto max-w-[800px] px-6">
        <div className="text-center">
          <div className="chip">FAQ</div>
          <h2 className="mt-3 text-[32px] font-semibold leading-[1.1] tracking-[-0.02em]">Common questions</h2>
        </div>
        <div className="mt-10 divide-y divide-border rounded-2xl border border-border bg-background">
          {faqs.map(([q,a]) => (
            <details key={q} className="group px-5 py-4 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between text-[14.5px] font-medium">
                {q}
                <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-90" />
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
    <section className="hairline-t hero-bg relative overflow-hidden py-24">
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="relative mx-auto max-w-[900px] px-6 text-center">
        <h2 className="text-[36px] font-semibold leading-[1.1] tracking-[-0.025em] md:text-[48px]">
          Give every client a portal that proves your work.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-[15px] text-muted-foreground">
          14-day trial. White-label your account in under 20 minutes. Cancel anytime.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link to="/book-demo" className="inline-flex h-11 items-center gap-1.5 rounded-lg bg-foreground px-5 text-[14px] font-medium text-background hover:bg-foreground/90">
            Book a demo <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/app" className="inline-flex h-11 items-center gap-1.5 rounded-lg border border-border bg-background px-5 text-[14px] font-medium hover:bg-[var(--surface-2)]">
            See the product
          </Link>
        </div>
      </div>
    </section>
  );
}
