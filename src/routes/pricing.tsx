import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Nav } from "@/components/orvio/Nav";
import { Footer } from "@/components/orvio/Footer";
import { Reveal, SectionHeader } from "@/components/orvio/primitives";
import { GlyphEcho, SkyBand } from "@/components/orvio/lattice";
import { PricingBlock, tierData } from "./index";
import { CheckCircle2, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Orvio" },
      { name: "description", content: "Flat monthly subscription. Credits for AI usage. No per-seat fees. Starter $97/mo, Professional $197/mo, Enterprise custom." },
      { property: "og:title", content: "Orvio pricing — $97 to start" },
      { property: "og:description", content: "Starter $97/mo · Professional $197/mo · Enterprise custom. Credits never expire. Shared across your team." },
    ],
  }),
  component: PricingPage,
});

const TIER_COSTS = {
  Standard: 25,
  Premium: 60,
  Maximum: 75,
} as const;

type TierKey = keyof typeof TIER_COSTS;

function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />

      <SkyBand variant="full" className="pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="mx-auto max-w-[1280px] px-6 text-center sm:px-10">
          <Reveal>
            <div className="flex justify-center">
              <GlyphEcho size={96} />
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="mono-eyebrow mt-8 flex items-center justify-center gap-3 text-white/85">
              <span className="text-[#171717]">01</span>
              <span>—</span>
              <span>Pricing</span>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1
              className="mt-6 font-display font-extrabold leading-[1.02] tracking-tight text-white"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
            >
              Simple pricing.<br /><span className="italic">No surprises.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mx-auto mt-6 max-w-2xl text-base text-white/85 sm:text-lg">
              Flat monthly subscription. Credits for AI usage. No per-seat fees. Cancel anytime.
            </p>
          </Reveal>
        </div>
      </SkyBand>

      <main>
        <section className="mx-auto -mt-12 max-w-[1280px] px-6 sm:px-10">
          <Reveal>
            <PricingBlock />
          </Reveal>
        </section>

        <section className="mx-auto mt-32 max-w-[1280px] px-6 pb-32 sm:px-10">
          <Reveal>
            <SectionHeader
              center={false}
              index="02"
              eyebrow="Credit calculator"
              title={<>How many credits<br />will you actually use?</>}
              subtitle="Pick numbers that match how you work. We'll estimate."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <CreditCalculator />
          </Reveal>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function CreditCalculator() {
  const [clients, setClients] = useState(5);
  const [briefs, setBriefs] = useState(2);
  const [reports, setReports] = useState(1);
  const [audits, setAudits] = useState(1);
  const [tier, setTier] = useState<TierKey>("Premium");

  const REPORT_COST = 30;
  const AUDIT_COST = 20;

  const monthly = useMemo(() => {
    const briefCost = briefs * (TIER_COSTS[tier] + 15);
    const reportCost = reports * REPORT_COST;
    const auditCost = audits * AUDIT_COST;
    return clients * (briefCost + reportCost + auditCost);
  }, [clients, briefs, reports, audits, tier]);

  const recommended =
    monthly <= 300 ? tierData[0] : monthly <= 1000 ? tierData[1] : tierData[2];
  const included = recommended.name === "Starter" ? 300 : recommended.name === "Professional" ? 1000 : monthly;
  const covered = monthly <= included;
  const shortage = covered ? 0 : monthly - included;

  return (
    <div className="mt-16 grid gap-12 hairline-t hairline-b py-12 lg:grid-cols-[1fr_400px] lg:gap-20">
      <div className="space-y-9">
        <SliderRow label="Number of clients" min={1} max={20} value={clients} onChange={setClients} suffix={` ${clients === 1 ? "client" : "clients"}`} />
        <SliderRow label="Campaign briefs / client / month" min={1} max={5} value={briefs} onChange={setBriefs} suffix={` ${briefs === 1 ? "brief" : "briefs"}`} />
        <SliderRow label="Reports / client / month" min={0} max={3} value={reports} onChange={setReports} suffix={` ${reports === 1 ? "report" : "reports"}`} />
        <SliderRow label="Audits / client / month" min={0} max={2} value={audits} onChange={setAudits} suffix={` ${audits === 1 ? "audit" : "audits"}`} />

        <div>
          <div className="mono-eyebrow mb-3 text-text-muted">Primary model tier</div>
          <div className="flex gap-2">
            {(Object.keys(TIER_COSTS) as TierKey[]).map((k) => (
              <button
                key={k}
                onClick={() => setTier(k)}
                className={`flex-1 rounded-full border px-4 py-2.5 text-sm font-medium transition-all ${
                  tier === k
                    ? "border-[#171717] bg-[#171717]/10 text-[#171717]"
                    : "border-border bg-transparent text-text-muted hover:text-foreground"
                }`}
              >
                {k}
                <span className="ml-2 font-mono text-xs opacity-70">{TIER_COSTS[k]}cr</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-pill rounded-2xl p-8" style={{ background: "rgba(20,22,32,0.6)" }}>
        <div className="mono-eyebrow text-text-muted">Estimated monthly usage</div>
        <div className="mt-4 font-mono text-6xl font-semibold text-foreground tracking-tight">{monthly.toLocaleString()}</div>
        <div className="mono-eyebrow mt-2 text-text-muted">credits / month</div>

        <div className="mt-10 hairline-t pt-6">
          <div className="flex items-center justify-between">
            <span className="mono-eyebrow text-text-muted">Recommended plan</span>
            <span className="mono-eyebrow text-[#171717]">{recommended.name}</span>
          </div>
          <div className="mt-3 text-sm text-text-muted">
            Includes <span className="font-mono text-foreground">{recommended.name === "Enterprise" ? "custom" : `${included.toLocaleString()}`}</span> credits/month
          </div>
        </div>

        <div className={`mt-6 flex items-start gap-3 rounded-xl border p-4 text-sm ${
          covered
            ? "border-success/30 bg-success/10 text-success"
            : "border-warning/30 bg-warning/10 text-warning"
        }`}>
          {covered ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />}
          <span>
            {covered
              ? "You're covered. Your plan includes more credits than you'll use."
              : <>You'll need <span className="font-mono font-semibold">{shortage.toLocaleString()}</span> more credits — add a top-up pack.</>}
          </span>
        </div>
      </div>
    </div>
  );
}

function SliderRow({
  label, min, max, value, onChange, suffix,
}: {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
  suffix?: string;
}) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="mono-eyebrow text-foreground">{label}</div>
        <div className="font-mono text-base text-amber">
          {value}
          <span className="text-text-muted">{suffix}</span>
        </div>
      </div>
      <Slider
        min={min}
        max={max}
        step={1}
        value={[value]}
        onValueChange={(v) => onChange(v[0] ?? min)}
      />
    </div>
  );
}
