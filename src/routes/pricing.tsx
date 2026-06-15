import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingShell } from "@/components/shells/MarketingShell";
import { Check, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  component: Pricing,
  head: () => ({
    meta: [
      { title: "Pricing — Orvio" },
      { name: "description", content: "Flat agency pricing. Starter $97, Growth $297, Scale $697. No per-client fees." },
    ],
  }),
});

const tiers = [
  { name: "Starter", price: 97, sub: "Solo agencies, 1-3 clients", pop: false, features: ["1 agency seat","Up to 3 client accounts","Meta + Google reporting","Branded client portals","Lead inbox","Stripe payments","Email support"] },
  { name: "Growth", price: 297, sub: "The plan most agencies start on", pop: true, features: ["5 agency seats","Up to 25 client accounts","Content Studio (AI ads, social, email)","White-label domain","Brand memory per client","Pipeline & approvals","Priority support"] },
  { name: "Scale", price: 697, sub: "Multi-team, multi-brand agencies", pop: false, features: ["Unlimited agency seats","Unlimited client accounts","Multi-brand white-label","Custom AI tuning","API access","SSO","Dedicated CSM"] },
];

const rows: [string, (string | boolean)[]][] = [
  ["Client accounts", ["3", "25", "Unlimited"]],
  ["Agency seats", ["1", "5", "Unlimited"]],
  ["White-label domain", [false, true, true]],
  ["Content Studio (AI)", [false, true, true]],
  ["Brand memory", [false, true, true]],
  ["Multi-brand white-label", [false, false, true]],
  ["Stripe Connect payments", [true, true, true]],
  ["Custom contracts", [false, false, true]],
  ["API access", [false, false, true]],
  ["SSO / SAML", [false, false, true]],
  ["Support", ["Email", "Priority", "Dedicated CSM"]],
];

function Pricing() {
  return (
    <MarketingShell>
      <section className="hero-bg pt-32 pb-12">
        <div className="mx-auto max-w-[1240px] px-6 text-center">
          <div className="chip">Pricing</div>
          <h1 className="mt-3 text-[44px] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[56px]">Simple agency pricing.</h1>
          <p className="mx-auto mt-3 max-w-xl text-[15px] text-muted-foreground">Flat monthly pricing per agency. No per-client fees. 14-day trial on every plan.</p>
        </div>
      </section>

      <section className="pb-16">
        <div className="mx-auto max-w-[1240px] px-6">
          <div className="grid gap-4 md:grid-cols-3">
            {tiers.map(t => (
              <div key={t.name} className={`rounded-2xl border bg-background p-6 ${t.pop ? "border-foreground shadow-pop" : "border-border"}`}>
                {t.pop && <div className="mb-3 inline-flex chip-indigo">Most popular</div>}
                <div className="text-[13px] font-medium text-muted-foreground">{t.name}</div>
                <div className="mt-2 flex items-baseline gap-1"><span className="text-[40px] font-semibold tracking-tight">${t.price}</span><span className="text-[13px] text-muted-foreground">/mo</span></div>
                <div className="mt-1 text-[12.5px] text-muted-foreground">{t.sub}</div>
                <Link to="/book-demo" className={`mt-5 flex h-10 items-center justify-center rounded-lg text-[13.5px] font-medium ${t.pop ? "bg-foreground text-background hover:bg-foreground/90" : "border border-border bg-background hover:bg-[var(--surface-2)]"}`}>Start 14-day trial</Link>
                <ul className="mt-5 space-y-2">
                  {t.features.map(f => <li key={f} className="flex items-start gap-2 text-[13px]"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--success)]" /><span>{f}</span></li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="hairline-t py-16">
        <div className="mx-auto max-w-[1100px] px-6">
          <h2 className="text-[24px] font-semibold tracking-tight">Compare plans</h2>
          <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-background">
            <table className="w-full text-[13.5px]">
              <thead className="bg-[var(--surface-2)] text-left text-[12px] uppercase tracking-wider text-muted-foreground">
                <tr><th className="p-4 font-semibold">Feature</th>{tiers.map(t => <th key={t.name} className="p-4 text-center font-semibold">{t.name}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map(([label, vals]) => (
                  <tr key={label}>
                    <td className="p-4 font-medium">{label}</td>
                    {vals.map((v, i) => (
                      <td key={i} className="p-4 text-center">
                        {typeof v === "boolean" ? (v ? <Check className="mx-auto h-4 w-4 text-[var(--success)]" /> : <span className="text-muted-foreground">—</span>) : v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed border-border bg-background p-5">
            <div>
              <div className="text-[14px] font-semibold">Enterprise</div>
              <div className="text-[12.5px] text-muted-foreground">50+ clients, SSO, custom contracts, dedicated infrastructure.</div>
            </div>
            <Link to="/book-demo" className="inline-flex h-10 items-center rounded-lg border border-border bg-background px-4 text-[13px] font-medium hover:bg-[var(--surface-2)]">Talk to sales <ArrowRight className="ml-1.5 h-3.5 w-3.5" /></Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
