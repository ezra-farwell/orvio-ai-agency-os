import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingShell } from "@/components/shells/MarketingShell";
import { Check, ArrowRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  component: Pricing,
  head: () => ({
    meta: [
      { title: "Pricing — Orvio" },
      { name: "description", content: "Flat agency pricing. Starter $97, Growth $297, Pro $497. No per-client fees." },
    ],
  }),
});

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
    features: ["Everything in Growth", "AI report summaries (beta)", "Advanced client health", "Stripe Connect", "More team seats"],
    pop: false,
  },
];

const rows: [string, (string | boolean)[]][] = [
  ["Client accounts", ["3", "10", "25"]],
  ["Branded client portal", [true, true, true]],
  ["Reporting + lead inbox", [true, true, true]],
  ["Monthly reports", [true, true, true]],
  ["Custom domain", [false, true, true]],
  ["Approvals + invoices", [false, true, true]],
  ["Team seats", ["1", "3", "8"]],
  ["AI report summaries", [false, false, "Beta"]],
  ["Stripe Connect", [false, false, true]],
  ["Advanced client health", [false, false, true]],
  ["Support", ["Email", "Priority", "Priority"]],
];

function Pricing() {
  return (
    <MarketingShell>
      <section className="hero-bg pt-32 pb-12">
        <div className="mx-auto max-w-[1180px] px-6 text-center">
          <h1 className="text-[44px] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[56px]">Pricing</h1>
          <p className="mx-auto mt-4 max-w-xl text-[15px] text-muted-foreground">
            Flat monthly pricing per agency. No per-client fees. 14-day trial on every plan.
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-[1180px] px-6">
          <div className="grid gap-5 md:grid-cols-3">
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

      <section className="hairline-t py-20 md:py-24">
        <div className="mx-auto max-w-[1080px] px-6">
          <h2 className="text-[26px] font-semibold tracking-[-0.02em]">Compare plans</h2>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-background">
            <table className="w-full text-[13.5px]">
              <thead className="bg-[var(--surface-2)] text-left text-[12px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-4 font-semibold">Feature</th>
                  {tiers.map(t => <th key={t.name} className="p-4 text-center font-semibold">{t.name}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map(([label, vals]) => (
                  <tr key={label}>
                    <td className="p-4 font-medium">{label}</td>
                    {vals.map((v, i) => (
                      <td key={i} className="p-4 text-center">
                        {typeof v === "boolean"
                          ? (v ? <Check className="mx-auto h-4 w-4 text-[var(--accent)]" /> : <span className="text-muted-foreground">—</span>)
                          : v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
