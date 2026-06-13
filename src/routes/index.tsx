import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Nav } from "@/components/orvio/Nav";
import { Footer } from "@/components/orvio/Footer";
import { CountUp, Reveal, SectionHeader, StatusBadge } from "@/components/orvio/primitives";
import { DashboardMockup, ModelDropdownMockup, PortalMockup, ReportMockup } from "@/components/orvio/mockups";
import { StudioDemo } from "@/components/orvio/StudioDemo";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Orvio — Run your agency. Ship your clients' campaigns." },
      { name: "description", content: "The white-label operating system for lead-gen agencies. Client portals, AI reports, contracts, billing, and an AI creative studio that pushes campaigns to Meta." },
      { property: "og:title", content: "Orvio — The agency OS with AI built in" },
      { property: "og:description", content: "Client portals, AI reports, contracts, billing, and an AI creative studio that pushes campaigns to Meta — all under your brand." },
    ],
  }),
  component: Landing,
});

const industries = [
  "Roofing", "HVAC", "Remodeling", "Moving", "Real Estate",
  "Med Spa", "Gym", "Law", "Junk Removal", "Landscaping",
];

const problems = [
  {
    t: "Reports take 2 hours each",
    d: "Pull numbers from Meta. Format in a doc. Write the summary. Email a PDF. Every client. Every month. That's time you don't have.",
  },
  {
    t: "Contracts live in a Google Drive folder",
    d: "You paste a client name into a Word doc, email it for signature, chase them for a week, and save the PDF somewhere you'll never find it again.",
  },
  {
    t: "Creative briefs happen in Slack threads",
    d: "Media buyer asks for direction. You write notes. Two days later, nobody remembers what was approved or why.",
  },
  {
    t: "GHL costs $500 before you've signed anyone",
    d: "Built for every industry, optimized for none of yours. And the onboarding alone takes a month.",
  },
  {
    t: "Clients don't know what they're paying for",
    d: "You send a monthly email with three screenshots and a CPL number. They nod. But when results dip, they cancel.",
  },
  {
    t: "Creative refresh is always a bottleneck",
    d: "Same ads for 45 days. CPL creeping up. You know you need fresh creative but generating it takes time you don't have.",
  },
];

const clientOS = [
  "White-label client portal under your brand",
  "Live Meta + Google campaign dashboard",
  "AI monthly reports, generated in one click",
  "Contracts + e-sign, AI-prefilled scope",
  "Client invoicing and recurring billing",
  "Onboarding checklists, auto-generated",
  "Lead speed tracker vs. 5-min benchmark",
  "AI churn risk detection, every 30 days",
];

const studio = [
  "Client-scoped briefs that pre-fill from history",
  "Choose your model: Free → Standard → Premium → Maximum",
  "Generate 4–8 ad creative concepts per brief",
  "Per-creative audit score and Meta policy check",
  "Role-based approval: Buyer → Manager → Owner",
  "Client review links — branded, no platform UI",
  "Push approved creatives to client's Meta account",
  "Creative history with winning hook tracking",
];

const models = [
  { name: "Gemini 2.5 Flash", tier: "Free", tone: "green", credits: 5, copy: "Fast drafts and bulk generation. Use for testing angles and rapid iteration." },
  { name: "Gemini 2.5 Pro", tier: "Standard", tone: "indigo", credits: 20, copy: "Solid all-around quality. Good for most client campaigns without overspending." },
  { name: "Command R+", tier: "Standard", tone: "indigo", credits: 25, copy: "Research-backed copy. Strong on grounded, factual output for local businesses." },
  { name: "Mistral Large", tier: "Standard", tone: "indigo", credits: 30, copy: "Precise structured reasoning. Best for audits, contracts, and analytical tasks." },
  { name: "Claude Opus 4.8", tier: "Premium", tone: "purple", credits: 60, copy: "Deep reasoning for complex campaigns and high-stakes creative direction." },
  { name: "GPT-5.5", tier: "Maximum", tone: "amber", credits: 75, copy: "OpenAI's frontier model. For campaigns where nothing less will do." },
] as const;

const topUps = [
  { credits: "500", price: "$39", per: "$0.078/credit" },
  { credits: "1,500", price: "$99", per: "$0.066/credit", badge: "Best value" },
  { credits: "4,000", price: "$229", per: "$0.057/credit" },
  { credits: "10,000", price: "$499", per: "$0.050/credit" },
];

const faqs = [
  {
    q: "Is Orvio only for home service agencies?",
    a: "No. Orvio works for any lead-generation or marketing agency regardless of the industries they serve. Roofing, HVAC, moving, real estate, med spas, gyms, law firms, restaurants — the AI adapts its language and framing to each client's industry automatically.",
  },
  {
    q: "How does white-labeling work?",
    a: "You upload your logo, set your brand colors, name your platform, and connect your custom domain. Your clients log in at portal.youragency.com and see your brand everywhere — every report, contract, invoice, and page. Orvio never appears in the client experience.",
  },
  {
    q: "What are credits?",
    a: "Credits are a workspace resource shared across your team. You spend them generating ad creative, running campaign audits, and producing AI reports. Different models cost different amounts — Gemini Flash costs 5 credits, GPT-5.5 costs 75. Credits included in your plan refresh monthly. Top-up packs are available anytime and never expire.",
  },
  {
    q: "Does Orvio replace GoHighLevel?",
    a: "No — and it doesn't try to. GHL handles funnels, CRM, and SMS/email automation. Orvio handles client reporting, creative production, and the white-labeled portal. Many agencies use both. Orvio integrates with GHL to pull lead speed data.",
  },
  {
    q: "Which AI models can I use?",
    a: "Six models across four tiers: Gemini 2.5 Flash (free, 5 credits), Gemini 2.5 Pro (standard, 20), Command R+ (standard, 25), Mistral Large (standard, 30), Claude Opus 4.8 (premium, 60), GPT-5.5 (maximum, 75). Choose the right model for each task — bulk drafts on Flash, high-stakes campaigns on Opus or GPT-5.5.",
  },
  {
    q: "Can my clients see the AI models or credits?",
    a: "Never. Credits and model selection are internal agency tools. Clients see only their campaign results, reports, contracts, and invoices — all under your brand.",
  },
  {
    q: "What Meta Ads permissions does Orvio need?",
    a: "Orvio connects to your clients' Meta Business Manager via standard permissions. You request access once per client during onboarding. After that, Orvio reads campaign performance daily and can push approved creatives to the client's connected ad account.",
  },
  {
    q: "How does the approval workflow work?",
    a: "In the Creative Studio, generated concepts go through a role-based approval chain: Media Buyer generates → Account Manager reviews → Agency Owner approves → optionally sent to client for review via a branded link. Only approved creatives can be pushed to Meta.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        <Hero />
        <SocialProof />
        <Problem />
        <TwoLayers />
        <DemoSection />
        <FeatureDeepDives />
        <Stats />
        <Marketplace />
        <Pricing />
        <Comparison />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

function Hero() {
  const lines = ["Run your agency.", "Ship your clients' campaigns.", "From one platform."];
  return (
    <section className="relative overflow-hidden pt-32 sm:pt-40">
      <div className="absolute inset-0 grid-dots opacity-50" aria-hidden />
      <div
        className="absolute left-1/2 top-0 -z-10 h-[600px] w-[1000px] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.18), transparent 60%)" }}
        aria-hidden
      />

      <div className="mx-auto max-w-[1200px] px-5 text-center sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-indigo/30 bg-indigo/10 px-3.5 py-1 text-[12px] font-medium text-indigo"
        >
          <Sparkles className="h-3.5 w-3.5" />
          The agency OS with AI built in
        </motion.div>

        <h1 className="mt-6 font-display text-[40px] font-extrabold leading-[1.02] tracking-tight sm:text-[64px] lg:text-[80px]">
          {lines.map((line, i) => (
            <motion.span
              key={line}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="block"
            >
              {i === 2 ? <span className="text-gradient-orvio">{line}</span> : line}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mx-auto mt-6 max-w-2xl text-base text-text-muted sm:text-lg"
        >
          Orvio is the white-label operating system for lead-gen agencies — client portals, AI reports,
          contracts, billing, and an AI creative studio that generates Meta campaigns and pushes them live.
          All under your brand.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link
            to="/signup"
            className="inline-flex h-12 items-center justify-center rounded-lg bg-indigo px-6 text-sm font-semibold text-white shadow-[0_12px_40px_-12px_rgba(99,102,241,0.7)] transition-all hover:brightness-110 hover:shadow-[0_16px_48px_-12px_rgba(99,102,241,0.85)]"
          >
            Start free — 14 days
          </Link>
          <Link
            to="/"
            hash="demo"
            className="group inline-flex items-center gap-2 text-sm font-medium text-foreground"
          >
            See it in action
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-6 text-xs text-text-faint"
        >
          No credit card required · Cancel anytime · Setup in 20 minutes
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mt-16 max-w-[1200px] px-5 pb-12 sm:px-8"
      >
        <DashboardMockup />
      </motion.div>
    </section>
  );
}

function SocialProof() {
  return (
    <section className="border-y border-border bg-surface/50">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-4 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between md:gap-8">
        <div className="flex flex-1 items-center gap-6 overflow-hidden">
          <span className="shrink-0 text-xs uppercase tracking-wider text-text-muted">
            Built for agencies serving:
          </span>
          <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div className="marquee flex w-max gap-8 whitespace-nowrap text-sm text-foreground/70">
              {[...industries, ...industries].map((label, i) => (
                <span key={i} className="flex items-center gap-8">
                  {label}
                  <span className="text-text-faint">·</span>
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="shrink-0 text-sm font-medium text-indigo">
          <span className="font-mono">$4.82</span> avg CPL for home service campaigns
        </div>
      </div>
    </section>
  );
}

function Problem() {
  return (
    <section className="py-20 sm:py-32">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <Reveal>
          <SectionHeader title={<>Your agency is held together by <span className="text-danger">copy-paste</span> and prayer.</>} />
        </Reveal>

        <div className="mt-12 grid gap-4 sm:mt-16 md:grid-cols-2 lg:grid-cols-3">
          {problems.map((p, i) => (
            <Reveal key={p.t} delay={i * 0.05}>
              <div className="surface-card h-full p-6 transition-colors hover:border-danger/30">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-danger/10 text-danger">!</div>
                <h3 className="mt-4 font-display text-lg font-bold">{p.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{p.d}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-16 text-center">
            <span className="font-display text-2xl font-bold text-gradient-orvio sm:text-3xl">
              There's a better way.
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function TwoLayers() {
  return (
    <section id="two-layers" className="py-20 sm:py-32">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <Reveal>
          <SectionHeader
            title="One platform. Two modes. Total control."
            subtitle="Client OS handles everything after you sign a client. Creative Studio handles everything before a campaign goes live."
          />
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="surface-card relative h-full overflow-hidden p-7 pl-9">
              <div className="absolute inset-y-0 left-0 w-1.5 bg-indigo" />
              <div className="text-xs font-medium uppercase tracking-wider text-indigo">Client OS</div>
              <h3 className="mt-1 font-display text-2xl font-bold">Operations, reporting, and retention.</h3>
              <ul className="mt-6 space-y-3">
                {clientOS.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo" />
                    <span className="text-foreground/90">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="surface-card relative h-full overflow-hidden p-7 pl-9">
              <div className="absolute inset-y-0 left-0 w-1.5 bg-amber" />
              <div className="text-xs font-medium uppercase tracking-wider text-amber">Creative Studio</div>
              <h3 className="mt-1 font-display text-2xl font-bold">AI campaign production, from brief to Meta.</h3>
              <ul className="mt-6 space-y-3">
                {studio.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
                    <span className="text-foreground/90">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <p className="mx-auto mt-10 max-w-3xl text-center text-sm text-text-muted">
            Both layers share the same workspace. Every creative links to a client. Every brief syncs to
            campaign history. Credits are shared across your entire team.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function DemoSection() {
  return (
    <section id="demo" className="py-20 sm:py-32">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="Interactive demo"
            title="Watch it work."
            subtitle="Real AI output. Real campaign structure. Click through it."
          />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12">
            <StudioDemo />
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="mx-auto mt-6 max-w-2xl text-center text-xs text-text-faint">
            This output structure comes from real Claude API calls in the live product. Model, industry,
            and brief drive the output — you control all three.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function FeatureDeepDives() {
  return (
    <section id="features" className="py-20 sm:py-32">
      <div className="mx-auto max-w-[1200px] space-y-24 px-5 sm:px-8">
        <FeatureRow
          mockup={<ReportMockup />}
          eyebrow="AI Reports"
          title="Reports that write themselves."
          body="Tell Orvio to generate a report. In 30 seconds, the AI reads your client's campaign data and writes a plain-English performance summary — what worked, what didn't, what's next. Your logo on every page."
          bullets={[
            "Generated in under 30 seconds",
            "Adapts to your tone: Professional, Casual, Data-Heavy, Executive",
            "Branded PDF, auto-delivered to client",
            "Full report archive per client, forever",
          ]}
        />
        <FeatureRow
          reversed
          mockup={<ModelDropdownMockup />}
          eyebrow="Model Selector"
          title="Six models. You pick the right one."
          body="Not every campaign needs your most expensive model. Use Flash for rapid draft cycles. Use Standard models for most client work. Reserve Opus or GPT-5.5 for campaigns that have to convert. One credit balance, shared across your whole team."
          bullets={[
            "Six AI models across four tiers",
            "Credit cost shown before you generate",
            "Image model selection for static ad concepts",
            "Workspace credits shared — no per-user fragmentation",
          ]}
        />
        <FeatureRow
          mockup={<PortalMockup />}
          eyebrow="White-label Portal"
          title="Your clients log in. They see you."
          body="Every client gets a branded portal under your name, your logo, your colors, your domain. They see their numbers in plain English, download reports, sign contracts, and pay invoices. Orvio is invisible. You get the credit."
          bullets={[
            "Your brand on every pixel clients see",
            "Custom domain: portal.youragency.com",
            "Mobile-first — contractors check from job sites",
            "Clients sign contracts and pay in the same portal",
          ]}
        />
      </div>
    </section>
  );
}

function FeatureRow({
  mockup,
  eyebrow,
  title,
  body,
  bullets,
  reversed = false,
}: {
  mockup: React.ReactNode;
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
  reversed?: boolean;
}) {
  return (
    <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
      <Reveal className={reversed ? "md:order-2" : ""}>
        <div className="text-xs font-medium uppercase tracking-wider text-indigo">{eyebrow}</div>
        <h3 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">{title}</h3>
        <p className="mt-4 text-base text-text-muted">{body}</p>
        <ul className="mt-6 space-y-3">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-3 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo" />
              <span className="text-foreground/90">{b}</span>
            </li>
          ))}
        </ul>
      </Reveal>
      <Reveal delay={0.1} className={reversed ? "md:order-1" : ""}>
        {mockup}
      </Reveal>
    </div>
  );
}

function Stats() {
  return (
    <section className="border-y border-border bg-surface/50">
      <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-8 px-5 py-16 sm:px-8 md:grid-cols-4">
        {[
          { v: <><span className="text-text-muted text-3xl">&lt;</span> <CountUp to={20} /> <span className="text-text-muted text-3xl">min</span></>, l: "Average time to onboard a new client", c: "text-indigo" },
          { v: <><span>$</span><CountUp to={97} />/mo</>, l: "vs $497+ for GHL white-label", c: "text-success" },
          { v: <><CountUp to={30} /> sec</>, l: "Average AI report generation time", c: "text-indigo" },
          { v: <><CountUp to={6} /> models</>, l: "AI models. You choose the right one.", c: "text-amber" },
        ].map((s, i) => (
          <Reveal key={i} delay={i * 0.05}>
            <div>
              <div className={`font-mono text-4xl font-semibold sm:text-5xl ${s.c}`}>{s.v}</div>
              <div className="mt-2 text-xs text-text-muted">{s.l}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Marketplace() {
  const tone = (t: string) =>
    t === "Free" ? "border-success/30 bg-success/10 text-success"
    : t === "Standard" ? "border-indigo/30 bg-indigo/10 text-indigo"
    : t === "Premium" ? "border-[#8B5CF6]/30 bg-[#8B5CF6]/10 text-[#8B5CF6]"
    : "border-amber/30 bg-amber/10 text-amber";

  return (
    <section className="py-20 sm:py-32">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <Reveal>
          <SectionHeader
            title="The right model for every job."
            subtitle="Don't pay premium rates for every task. Route intelligently."
          />
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {models.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.04}>
              <div className="surface-card h-full p-6">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-display text-lg font-bold">{m.name}</h4>
                  <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${tone(m.tier)}`}>
                    {m.tier}
                  </span>
                </div>
                <div className="mt-1 font-mono text-sm text-amber">{m.credits} credits</div>
                <p className="mt-4 text-sm text-text-muted">{m.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-text-muted">
            Credits are purchased per workspace, not per user. One balance, shared across your entire team.
            They never expire.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export const tierData = [
  {
    name: "Starter",
    price: 97,
    annual: 78,
    blurb: "Up to 5 clients · 1 seat",
    credits: "300 credits/month",
    cta: "Start with Starter",
    featured: false,
    features: [
      { y: true, t: "Up to 5 client sub-accounts" },
      { y: true, t: "White-label client portal" },
      { y: true, t: "Live Meta + Google dashboard" },
      { y: true, t: "AI report generator (30 credits each)" },
      { y: true, t: "Contracts + e-sign" },
      { y: true, t: "Client invoicing + billing" },
      { y: true, t: "Onboarding checklists" },
      { y: true, t: "Lead speed tracker" },
      { y: true, t: "AI churn risk detection" },
      { y: true, t: "300 Studio credits/month" },
      { y: false, t: "Custom domain" },
      { y: false, t: "Creative Studio" },
      { y: false, t: "Team members" },
    ],
  },
  {
    name: "Professional",
    price: 197,
    annual: 158,
    blurb: "Up to 20 clients · 5 seats",
    credits: "1,000 credits/month",
    cta: "Start with Professional",
    featured: true,
    features: [
      { y: true, t: "Everything in Starter" },
      { y: true, t: "Up to 20 client sub-accounts" },
      { y: true, t: "Custom domain (portal.youragency.com)" },
      { y: true, t: "Up to 5 team member seats" },
      { y: true, t: "Advanced roles (Media Buyer, Account Manager)" },
      { y: true, t: "AI campaign auditor" },
      { y: true, t: "Creative Studio — full access" },
      { y: true, t: "All 6 AI models" },
      { y: true, t: "Image generation models" },
      { y: true, t: "Role-based approval workflow" },
      { y: true, t: "Client review links (branded)" },
      { y: true, t: "Push creatives to Meta Ads Manager" },
      { y: true, t: "1,000 Studio credits/month" },
      { y: true, t: "Priority support" },
    ],
  },
  {
    name: "Enterprise",
    price: null,
    annual: null,
    blurb: "Unlimited clients · Unlimited seats",
    credits: "Custom credit allocation",
    cta: "Contact us",
    featured: false,
    features: [
      { y: true, t: "Everything in Professional" },
      { y: true, t: "Unlimited client sub-accounts" },
      { y: true, t: "Unlimited team seats" },
      { y: true, t: "Advanced AI model controls" },
      { y: true, t: "API access" },
      { y: true, t: "Custom credit allocation" },
      { y: true, t: "Dedicated account manager" },
      { y: true, t: "SLA guarantee" },
      { y: true, t: "Custom onboarding" },
      { y: true, t: "White-glove Meta setup" },
    ],
  },
] as const;

export function PricingBlock() {
  const [annual, setAnnual] = useState(false);

  return (
    <>
      <div className="mt-10 flex items-center justify-center gap-3">
        <span className={`text-sm ${!annual ? "text-foreground" : "text-text-muted"}`}>Monthly</span>
        <button
          onClick={() => setAnnual((v) => !v)}
          className="relative h-7 w-12 rounded-full border border-border bg-surface transition-colors"
          aria-label="Toggle annual billing"
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-indigo transition-all ${
              annual ? "left-[26px]" : "left-0.5"
            }`}
          />
        </button>
        <span className={`text-sm ${annual ? "text-foreground" : "text-text-muted"}`}>
          Annual <span className="ml-1 rounded-full border border-success/30 bg-success/10 px-1.5 py-0.5 text-[10px] font-medium text-success">20% off</span>
        </span>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {tierData.map((t) => (
          <div
            key={t.name}
            className={`relative flex h-full flex-col p-7 ${
              t.featured
                ? "rounded-2xl border-2 border-indigo bg-gradient-to-b from-indigo/5 to-transparent shadow-[0_30px_80px_-30px_rgba(99,102,241,0.5)]"
                : "surface-card"
            }`}
          >
            {t.featured && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
                Most popular
              </div>
            )}
            <div className="text-xs font-medium uppercase tracking-wider text-text-muted">{t.name}</div>
            <div className="mt-3 flex items-baseline gap-1">
              {t.price === null ? (
                <span className="font-display text-4xl font-extrabold">Custom</span>
              ) : (
                <>
                  <span className="font-display text-5xl font-extrabold">${annual ? t.annual : t.price}</span>
                  <span className="text-sm text-text-muted">/mo</span>
                  {annual && (
                    <span className="ml-2 text-xs text-text-faint line-through">${t.price}</span>
                  )}
                </>
              )}
            </div>
            <div className="mt-1 text-sm text-text-muted">{t.blurb}</div>
            <div className="mt-4 rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm text-amber">
              {t.credits}
            </div>

            {t.name === "Enterprise" ? (
              <a
                href="mailto:ezra@scaledsolutions.net?subject=Orvio%20Enterprise%20Inquiry"
                className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-lg border border-foreground/30 text-sm font-medium hover:bg-foreground/5"
              >
                {t.cta}
              </a>
            ) : (
              <Link
                to="/signup"
                className={`mt-6 inline-flex h-11 w-full items-center justify-center rounded-lg text-sm font-semibold transition-all ${
                  t.featured
                    ? "bg-indigo text-white shadow-[0_8px_24px_-8px_rgba(99,102,241,0.7)] hover:brightness-110"
                    : "border border-indigo/50 text-indigo hover:bg-indigo/10"
                }`}
              >
                {t.cta}
              </Link>
            )}

            <ul className="mt-6 space-y-2.5 text-sm">
              {t.features.map((f) => (
                <li key={f.t} className="flex items-start gap-2.5">
                  {f.y ? (
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo" />
                  ) : (
                    <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center text-text-faint">✕</span>
                  )}
                  <span className={f.y ? "text-foreground/90" : "text-text-faint line-through"}>{f.t}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-14">
        <h3 className="font-display text-xl font-bold sm:text-2xl">Need more credits? Top up anytime.</h3>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {topUps.map((t) => (
            <div key={t.credits} className="surface-card relative p-5">
              {t.badge && (
                <StatusBadge tone="indigo">{t.badge}</StatusBadge>
              )}
              <div className="mt-2 font-mono text-2xl font-semibold">{t.credits}</div>
              <div className="text-xs text-text-muted">credits</div>
              <div className="mt-3 font-mono text-lg font-semibold text-amber">{t.price}</div>
              <div className="font-mono text-xs text-text-faint">{t.per}</div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-text-muted">
          Credits never expire. Shared across your team. Roll over indefinitely.
        </p>
      </div>
    </>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="py-20 sm:py-32">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <Reveal>
          <SectionHeader
            title="Simple pricing. No surprises."
            subtitle="Flat monthly subscription. Credits for AI usage. No per-seat fees."
          />
        </Reveal>
        <Reveal delay={0.1}>
          <PricingBlock />
        </Reveal>
      </div>
    </section>
  );
}

const compareRows = [
  ["White-label client portal", "✓", "✓", "✗", "✗"],
  ["AI report generation", "✓", "Add-on", "✗", "✗"],
  ["Creative Studio (AI ads)", "✓", "✗", "✗", "✗"],
  ["Six AI model options", "✓", "✗", "✗", "✗"],
  ["Client contracts + e-sign", "✓", "✓", "✗", "✗"],
  ["Client invoicing", "✓", "✓", "✗", "✗"],
  ["AI churn detection", "✓", "✗", "✗", "✗"],
  ["Lead speed tracker", "✓", "✗", "✗", "✗"],
  ["Push creatives to Meta", "✓", "✗", "✗", "✗"],
  ["Built for local service agencies", "✓", "✗", "✗", "✗"],
  ["White-label entry price", "$97/mo", "$497/mo*", "N/A", "—"],
  ["Setup time", "20 min", "2–4 weeks", "Varies", "—"],
];

function Comparison() {
  const cell = (v: string, isOrvio: boolean) => {
    if (v === "✓") return <span className={isOrvio ? "text-indigo" : "text-foreground/80"}>✓</span>;
    if (v === "✗") return <span className="text-text-faint">—</span>;
    return <span className={`text-sm ${isOrvio ? "font-mono text-indigo" : "text-text-muted"}`}>{v}</span>;
  };

  return (
    <section className="py-20 sm:py-32">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <Reveal>
          <SectionHeader title="Orvio vs. the alternatives" />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[700px] border-separate border-spacing-0 text-sm">
              <thead>
                <tr>
                  <th className="border-b border-border p-4 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
                    Feature
                  </th>
                  <th className="border-b-2 border-indigo bg-indigo/10 p-4 text-left font-display text-base font-bold text-indigo">
                    Orvio
                  </th>
                  <th className="border-b border-border p-4 text-left text-sm font-medium text-text-muted">
                    GoHighLevel
                  </th>
                  <th className="border-b border-border p-4 text-left text-sm font-medium text-text-muted">
                    Generic CRM
                  </th>
                  <th className="border-b border-border p-4 text-left text-sm font-medium text-text-muted">
                    Manual Stack
                  </th>
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row, i) => (
                  <tr key={i}>
                    <td className="border-b border-border/60 p-4 text-foreground/90">{row[0]}</td>
                    <td className="border-b border-border/60 bg-indigo/[0.04] p-4">{cell(row[1], true)}</td>
                    <td className="border-b border-border/60 p-4">{cell(row[2], false)}</td>
                    <td className="border-b border-border/60 p-4">{cell(row[3], false)}</td>
                    <td className="border-b border-border/60 p-4">{cell(row[4], false)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <p className="mt-6 text-xs text-text-faint">
          *GHL white-label requires the $497/month SaaS plan. Usage fees for SMS, email, and AI push real
          monthly cost to $600–$900+.
        </p>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section className="py-20 sm:py-32">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <Reveal>
          <SectionHeader title="Questions." />
        </Reveal>
        <Reveal delay={0.1}>
          <Accordion type="single" collapsible className="mt-12">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-border">
                <AccordionTrigger className="text-left font-display text-base font-semibold hover:no-underline sm:text-lg">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-text-muted">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div
        className="absolute inset-0 -z-10"
        style={{ background: "radial-gradient(ellipse at center, rgba(99,102,241,0.15), transparent 70%)" }}
        aria-hidden
      />
      <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        <Reveal>
          <h2 className="font-display text-4xl font-extrabold leading-tight sm:text-6xl">
            Your agency deserves <span className="text-gradient-orvio">better infrastructure</span>.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-2xl text-base text-text-muted sm:text-lg">
            Stop running on copy-paste reports, Google Drive contracts, and Slack brief threads. Orvio
            gives your agency the operating system it's been missing — and the creative studio to ship
            faster than ever.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/signup"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-indigo px-6 text-sm font-semibold text-white shadow-[0_12px_40px_-12px_rgba(99,102,241,0.7)] transition-all hover:brightness-110"
            >
              Start free — 14 days
            </Link>
            <a
              href="mailto:ezra@scaledsolutions.net"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-border px-6 text-sm font-medium text-foreground hover:bg-surface"
            >
              Talk to us first
            </a>
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-6 text-xs text-text-faint">
            No credit card required · Cancel anytime · Setup takes 20 minutes
          </p>
        </Reveal>
      </div>
    </section>
  );
}
