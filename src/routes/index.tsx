import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Nav } from "@/components/orvio/Nav";
import { Footer } from "@/components/orvio/Footer";
import { CountUp, Reveal, SectionHeader } from "@/components/orvio/primitives";
import { ModelDropdownMockup, PortalMockup, ReportMockup } from "@/components/orvio/mockups";
import { StudioDemo } from "@/components/orvio/StudioDemo";
import { ArrowIcon, GlyphEcho, Hairline, MonoEyebrow, PillCTA, SkyBand } from "@/components/orvio/lattice";
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
      <Hero />
      <Nav />
      <main>
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
  return (
    <section className="sky-hero relative isolate flex h-screen min-h-[760px] w-full flex-col overflow-hidden">
      {/* Soft cloud band near horizon */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[55%] cloud-drift"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 30% 80%, rgba(255,220,190,0.55), transparent 60%), radial-gradient(ellipse 60% 50% at 75% 70%, rgba(255,200,210,0.5), transparent 60%), radial-gradient(ellipse 90% 40% at 50% 100%, rgba(255,240,220,0.7), transparent 70%)",
          filter: "blur(20px)",
        }}
      />
      {/* subtle vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 30%, transparent 40%, rgba(7,8,12,0.35) 100%)" }}
      />

      {/* Top label bar — omniworld style */}
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 flex items-center justify-between px-6 pt-7 sm:px-12 sm:pt-9"
      >
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.28em] text-white/85">
          <span className="grid h-1.5 w-1.5 place-items-center rounded-full bg-[#5EEAD4] shadow-[0_0_10px_rgba(94,234,212,0.9)] live-dot" />
          Orvio
        </div>
        <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/85">
          Agency&nbsp;Edition
        </div>
      </motion.header>

      {/* Centerpiece glyph */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="glyph-float relative"
        >
          <CinematicGlyph />
        </motion.div>
      </div>

      {/* Floating glass action pill */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto mb-12 flex w-fit max-w-[94vw] items-center gap-1 rounded-full glass-pill p-1.5 sm:mb-16"
      >
        <PillLink to="/demo" icon="sparkles">Studio</PillLink>
        <PillLink to="/portal-preview" icon="arrow">Portal</PillLink>
        <PillLink to="/signup" icon="box" primary>Explore</PillLink>
      </motion.div>

      {/* Bottom caption */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
        className="relative z-10 mx-auto mb-8 max-w-xl px-6 text-center"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/75">
          The white-label operating system for lead-gen agencies
        </p>
      </motion.div>
    </section>
  );
}

function CinematicGlyph() {
  return (
    <div className="relative" aria-hidden>
      {/* outer aura */}
      <div
        className="absolute -inset-32 -z-10 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(94,234,212,0.28), rgba(124,140,255,0.18) 35%, transparent 65%)",
          filter: "blur(40px)",
        }}
      />
      <svg
        viewBox="0 0 360 460"
        className="h-[58vh] max-h-[520px] w-auto drop-shadow-[0_0_30px_rgba(94,234,212,0.45)]"
      >
        <defs>
          <linearGradient id="cg-stroke" x1="0" y1="0" x2="0" y2="460" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#7DF9E3" />
            <stop offset="0.5" stopColor="#5EEAD4" />
            <stop offset="1" stopColor="#A8C0FF" />
          </linearGradient>
          <filter id="cg-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* outer ellipse */}
        <motion.ellipse
          cx="180" cy="230" rx="150" ry="200"
          fill="none"
          stroke="url(#cg-stroke)"
          strokeWidth="2"
          filter="url(#cg-glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* inner ellipse */}
        <motion.ellipse
          cx="180" cy="230" rx="92" ry="142"
          fill="none"
          stroke="url(#cg-stroke)"
          strokeWidth="1.6"
          opacity="0.85"
          filter="url(#cg-glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.85 }}
          transition={{ duration: 2, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* thin shimmer */}
        <motion.ellipse
          cx="180" cy="230" rx="150" ry="200"
          fill="none"
          stroke="#E8FFFA"
          strokeWidth="0.6"
          opacity="0.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 1], opacity: [0, 0.8, 0.4] }}
          transition={{ duration: 4, delay: 0.5, repeat: Infinity, repeatDelay: 2 }}
        />
      </svg>
    </div>
  );
}

function PillLink({
  to, children, icon, primary,
}: {
  to: "/demo" | "/portal-preview" | "/signup";
  children: React.ReactNode;
  icon: "sparkles" | "arrow" | "box";
  primary?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-medium transition-all ${
        primary
          ? "bg-white text-[#1B2552] shadow-[0_8px_24px_-8px_rgba(255,255,255,0.6)] hover:shadow-[0_14px_36px_-8px_rgba(255,255,255,0.8)]"
          : "text-white/90 hover:bg-white/12 hover:text-white"
      }`}
    >
      <PillIcon name={icon} primary={primary} />
      <span>{children}</span>
    </Link>
  );
}

function PillIcon({ name, primary }: { name: "sparkles" | "arrow" | "box"; primary?: boolean }) {
  const stroke = primary ? "#1B2552" : "currentColor";
  if (name === "sparkles") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5EEAD4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
      </svg>
    );
  }
  if (name === "arrow") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12" />
    </svg>
  );
}

function SocialProof() {
  return (
    <section className="hairline-t hairline-b bg-background/60">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-5 px-6 py-8 sm:px-10 md:flex-row md:items-center md:justify-between md:gap-10">
        <MonoEyebrow className="shrink-0 text-text-muted">
          <span className="text-[#5EEAD4]">00</span>
          <span className="text-text-faint">—</span>
          Built for agencies serving
        </MonoEyebrow>
        <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="marquee flex w-max gap-10 whitespace-nowrap font-display text-base text-foreground/85">
            {[...industries, ...industries].map((label, i) => (
              <span key={i} className="flex items-center gap-10">
                {label}
                <span className="h-1 w-1 rounded-full bg-text-faint" />
              </span>
            ))}
          </div>
        </div>
        <div className="shrink-0 mono-eyebrow text-text-muted">
          <span className="font-mono text-[#5EEAD4]">$4.82</span>
          <span className="ml-2">avg CPL</span>
        </div>
      </div>
    </section>
  );
}

function Problem() {
  return (
    <section className="relative py-32 sm:py-48">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-10">
        <Reveal>
          <SectionHeader
            center={false}
            index="01"
            eyebrow="The problem"
            title={<>Your agency is held together<br />by <span className="text-danger">copy-paste</span> and prayer.</>}
          />
        </Reveal>

        <div className="mt-20 grid divide-y divide-border border-y border-border md:grid-cols-2 md:divide-x md:divide-y-0 lg:grid-cols-3">
          {problems.map((p, i) => (
            <Reveal key={p.t} delay={i * 0.05}>
              <div className="group relative h-full p-8 transition-colors hover:bg-surface/40">
                <div className="mono-eyebrow text-danger">
                  Issue · {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-4 font-display text-xl font-bold leading-tight">{p.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-text-muted">{p.d}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p
            className="mt-20 max-w-3xl font-display font-bold leading-[1.05]"
            style={{ fontSize: "clamp(1.75rem, 3.4vw, 2.75rem)" }}
          >
            There's a <span className="text-gradient-orvio">better way</span> to run an agency.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function TwoLayers() {
  const layers = [
    {
      num: "02",
      label: "Client OS",
      accent: "#5EEAD4",
      title: "Operations, reporting, and retention.",
      lede: "Everything that happens after you sign a client. Reports, contracts, billing, churn detection — all in one branded portal.",
      list: clientOS,
    },
    {
      num: "03",
      label: "Creative Studio",
      accent: "#FBBF24",
      title: "AI campaign production, from brief to Meta.",
      lede: "Generate, audit, and approve ad creatives. Push them live to your client's Meta account in one click.",
      list: studio,
    },
  ];
  return (
    <section id="two-layers" className="hairline-t py-32 sm:py-48">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-10">
        <Reveal>
          <SectionHeader
            center={false}
            index="01"
            eyebrow="The platform"
            title={<>One platform. Two modes.<br />Total control.</>}
            subtitle="Client OS handles everything after you sign a client. Creative Studio handles everything before a campaign goes live."
          />
        </Reveal>

        <div className="mt-20 grid divide-y divide-border border-y border-border md:grid-cols-2 md:divide-x md:divide-y-0">
          {layers.map((l, idx) => (
            <Reveal key={l.label} delay={idx * 0.08}>
              <div className="group relative h-full p-10 transition-colors hover:bg-surface/40">
                <div className="mono-eyebrow flex items-center gap-2.5" style={{ color: l.accent }}>
                  <span>{l.num}</span>
                  <span className="text-text-faint">—</span>
                  <span>{l.label}</span>
                </div>
                <h3
                  className="mt-6 font-display font-extrabold leading-[1.05]"
                  style={{ fontSize: "clamp(1.75rem, 2.6vw, 2.5rem)" }}
                >
                  {l.title}
                </h3>
                <p className="mt-5 max-w-md text-base text-text-muted">{l.lede}</p>
                <ul className="mt-8 grid grid-cols-1 gap-2.5">
                  {l.list.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: l.accent }} />
                      <span className="text-foreground/85">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function DemoSection() {
  return (
    <SkyBand className="py-32 sm:py-48" variant="soft">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-10">
        <Reveal>
          <SectionHeader
            center={false}
            index="02"
            eyebrow="Interactive demo"
            title={<>Watch it <span className="text-gradient-orvio">work</span>.</>}
            subtitle="Real AI output. Real campaign structure. Click through it — no account, no sign-up."
          />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-20">
            <StudioDemo />
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="mt-8 max-w-2xl mono-eyebrow text-text-muted">
            Output structure from real Claude API calls in the live product.
          </p>
        </Reveal>
      </div>
    </SkyBand>
  );
}

function FeatureDeepDives() {
  return (
    <section id="features" className="hairline-t py-32 sm:py-48">
      <div className="mx-auto max-w-[1280px] space-y-32 px-6 sm:px-10 sm:space-y-40">
        <FeatureRow
          mockup={<ReportMockup />}
          index="03a"
          eyebrow="AI Reports"
          title="Reports that write themselves."
          body="Tell Orvio to generate a report. In 30 seconds, the AI reads your client's campaign data and writes a plain-English performance summary — what worked, what didn't, what's next. Your logo on every page."
          bullets={[
            "Generated in under 30 seconds",
            "Adapts tone: Professional, Casual, Data-Heavy, Executive",
            "Branded PDF, auto-delivered to client",
            "Full report archive per client, forever",
          ]}
        />
        <FeatureRow
          reversed
          mockup={<ModelDropdownMockup />}
          index="03b"
          eyebrow="Model Selector"
          title="Six models. You pick the right one."
          body="Not every campaign needs your most expensive model. Use Flash for rapid draft cycles. Standard for most client work. Reserve Opus or GPT-5.5 for campaigns that have to convert."
          bullets={[
            "Six AI models across four tiers",
            "Credit cost shown before you generate",
            "Image models for static ad concepts",
            "Shared workspace credits — no per-user fragmentation",
          ]}
        />
        <FeatureRow
          mockup={<PortalMockup />}
          index="03c"
          eyebrow="White-label Portal"
          title="Your clients log in. They see you."
          body="Every client gets a branded portal under your name, your logo, your colors, your domain. They see their numbers in plain English, download reports, sign contracts, and pay invoices."
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
  index,
  title,
  body,
  bullets,
  reversed = false,
}: {
  mockup: React.ReactNode;
  eyebrow: string;
  index: string;
  title: string;
  body: string;
  bullets: string[];
  reversed?: boolean;
}) {
  return (
    <div className="grid items-center gap-12 md:grid-cols-2 md:gap-20">
      <Reveal className={reversed ? "md:order-2" : ""}>
        <div className="mono-eyebrow flex items-center gap-3">
          <span className="text-[#5EEAD4]">{index}</span>
          <span className="text-text-faint">—</span>
          <span>{eyebrow}</span>
        </div>
        <h3
          className="mt-5 font-display font-extrabold leading-[1.05]"
          style={{ fontSize: "clamp(1.875rem, 3.2vw, 3rem)" }}
        >
          {title}
        </h3>
        <p className="mt-5 text-base text-text-muted">{body}</p>
        <ul className="mt-7 space-y-3">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-3 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#5EEAD4]" />
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
    <SkyBand className="py-24" variant="soft">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-10">
        <div className="grid grid-cols-2 gap-y-12 gap-x-8 md:grid-cols-4">
          {[
            { v: <><span className="text-text-muted text-3xl">&lt;</span><CountUp to={20} /><span className="text-text-muted text-3xl ml-1">min</span></>, l: "Average client onboarding" },
            { v: <><span>$</span><CountUp to={97} /><span className="text-text-muted text-3xl">/mo</span></>, l: "vs $497+ for GHL white-label" },
            { v: <><CountUp to={30} /><span className="text-text-muted text-3xl ml-1">sec</span></>, l: "Avg. AI report generation" },
            { v: <><CountUp to={6} /><span className="text-text-muted text-3xl ml-1">models</span></>, l: "Pick the right one per task" },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <div>
                <div className="font-mono text-4xl font-semibold text-foreground sm:text-5xl">{s.v}</div>
                <div className="mt-3 mono-eyebrow text-text-muted">{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </SkyBand>
  );
}

function Marketplace() {
  const tone = (t: string) =>
    t === "Free" ? "text-success"
    : t === "Standard" ? "text-[#5EEAD4]"
    : t === "Premium" ? "text-[#A78BFA]"
    : "text-amber";

  return (
    <section className="hairline-t py-32 sm:py-48">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-10">
        <Reveal>
          <SectionHeader
            center={false}
            index="04"
            eyebrow="Model marketplace"
            title={<>The right model<br />for every job.</>}
            subtitle="Don't pay premium rates for every task. Route intelligently — six models across four tiers, one shared credit balance."
          />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-20 hairline-t hairline-b">
            <div className="hidden grid-cols-[2fr_1fr_120px_3fr] gap-6 py-4 mono-eyebrow text-text-muted md:grid">
              <span>Model</span>
              <span>Tier</span>
              <span className="text-right">Credits</span>
              <span>Best for</span>
            </div>
          </div>
          <div className="divide-y divide-border">
            {models.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.03}>
                <div className="grid grid-cols-1 gap-3 py-7 transition-colors hover:bg-surface/30 md:grid-cols-[2fr_1fr_120px_3fr] md:items-center md:gap-6 md:px-2">
                  <div className="font-display text-xl font-bold">{m.name}</div>
                  <div className={`mono-eyebrow ${tone(m.tier)}`}>{m.tier}</div>
                  <div className="font-mono text-base text-amber md:text-right">{m.credits} cr</div>
                  <p className="text-sm text-text-muted">{m.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-10 max-w-2xl mono-eyebrow text-text-muted">
            One balance, shared across your team. Credits never expire.
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

      <div className="mt-16">
        <div className="mono-eyebrow flex items-center gap-3 text-text-muted">
          <span className="text-[#5EEAD4]">06</span>
          <span className="text-text-faint">—</span>
          <span>Top-up packs</span>
        </div>
        <h3
          className="mt-4 font-display font-extrabold leading-tight"
          style={{ fontSize: "clamp(1.5rem, 2.4vw, 2rem)" }}
        >
          Need more credits? Top up anytime.
        </h3>
        <div className="mt-8 grid divide-y divide-border border-y border-border sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          {topUps.map((t) => (
            <div key={t.credits} className="relative p-6">
              {t.badge && (
                <span className="mono-eyebrow absolute right-6 top-6 text-[#5EEAD4]">
                  ★ {t.badge}
                </span>
              )}
              <div className="font-mono text-3xl font-semibold text-foreground">{t.credits}</div>
              <div className="mono-eyebrow mt-1 text-text-muted">credits</div>
              <div className="mt-4 font-mono text-xl font-semibold text-amber">{t.price}</div>
              <div className="font-mono text-xs text-text-faint">{t.per}</div>
            </div>
          ))}
        </div>
        <p className="mt-6 mono-eyebrow text-text-muted">
          Credits never expire · Shared across team · Roll over indefinitely
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
