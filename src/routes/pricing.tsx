import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Nav } from "@/components/orvio/Nav";
import { Footer } from "@/components/orvio/Footer";
import { Reveal, SectionHeader } from "@/components/orvio/primitives";
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
      <main className="pt-32 pb-20 sm:pt-40">
        <section className="mx-auto max-w-[1200px] px-5 sm:px-8">
          <Reveal>
            <SectionHeader
              eyebrow="Pricing"
              title="Simple pricing. No surprises."
              subtitle="Flat monthly subscription. Credits for AI usage. No per-seat fees."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <PricingBlock />
          </Reveal>
        </section>

        <section className="mx-auto mt-24 max-w-[1200px] px-5 sm:px-8">
          <Reveal>
            <SectionHeader
              title="How many credits will I use per month?"
              subtitle="Pick numbers that match how you actually work. We'll estimate."
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
    const briefCost = briefs * (TIER_COSTS[tier] + 15); // strategy + image
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
    <div className="mt-10 grid gap-8 rounded-2xl border border-border bg-surface p-6 sm:p-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-7">
        <SliderRow label="Number of clients" min={1} max={20} value={clients} onChange={setClients} suffix={` ${clients === 1 ? "client" : "clients"}`} />
        <SliderRow label="Campaign briefs / client / month" min={1} max={5} value={briefs} onChange={setBriefs} suffix={` ${briefs === 1 ? "brief" : "briefs"}`} />
        <SliderRow label="Reports / client / month" min={0} max={3} value={reports} onChange={setReports} suffix={` ${reports === 1 ? "report" : "reports"}`} />
        <SliderRow label="Audits / client / month" min={0} max={2} value={audits} onChange={setAudits} suffix={` ${audits === 1 ? "audit" : "audits"}`} />

        <div>
          <div className="mb-2 text-[11px] font-medium uppercase tracking-wider text-text-muted">Primary model tier</div>
          <div className="flex gap-2">
            {(Object.keys(TIER_COSTS) as TierKey[]).map((k) => (
              <button
                key={k}
                onClick={() => setTier(k)}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                  tier === k
                    ? "border-indigo bg-indigo/10 text-indigo"
                    : "border-border bg-background text-text-muted hover:text-foreground"
                }`}
              >
                {k}
                <span className="ml-1 font-mono text-xs opacity-70">{TIER_COSTS[k]}cr</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-background p-6">
        <div className="text-xs uppercase tracking-wider text-text-muted">Estimated monthly usage</div>
        <div className="mt-2 font-mono text-5xl font-semibold text-foreground">{monthly.toLocaleString()}</div>
        <div className="text-sm text-text-muted">credits / month</div>

        <div className="mt-6 rounded-lg border border-border bg-surface p-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-muted">Recommended plan</span>
            <span className="font-medium text-indigo">{recommended.name}</span>
          </div>
          <div className="mt-2 text-xs text-text-muted">
            Includes <span className="font-mono text-foreground">{recommended.name === "Enterprise" ? "custom" : `${included.toLocaleString()}`}</span> credits/month
          </div>
        </div>

        <div className={`mt-4 flex items-start gap-2 rounded-lg border p-3 text-sm ${
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
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-medium text-foreground">{label}</div>
        <div className="font-mono text-sm text-amber">
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
