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
  { name: "Starter", price: 97, sub: "Up to 3 clients", pop: false, credits: "200 credits / mo", features: ["1 agency seat","Branded client portal","Meta + Google reporting (CSV + API beta)","Lead inbox + Stripe invoicing","Email support"] },
  { name: "Growth", price: 297, sub: "Up to 10 clients", pop: false, credits: "1,000 credits / mo", features: ["3 agency seats","Custom subdomain + email sender","Content approvals","AI report summaries (beta)"] },
  { name: "Pro", price: 497, sub: "Up to 25 clients", pop: true, credits: "5,000 credits / mo", features: ["8 agency seats","AI Content Studio (beta)","Per-client brand memory (beta)","Stripe Connect payments"] },
  { name: "Scale", price: 997, sub: "Unlimited clients", pop: false, credits: "20,000 credits / mo", features: ["20 agency seats","Multi-brand white-label (roadmap)","Custom domain + email","Public API (beta)"] },
];

const rows: [string, (string | boolean)[]][] = [
  ["Client accounts", ["3", "10", "25", "Unlimited"]],
  ["Agency seats", ["1", "3", "8", "20"]],
  ["White-label portal", [true, true, true, true]],
  ["Custom domain", [false, true, true, true]],
  ["Lead inbox", [false, true, true, true]],
  ["Content approvals", [false, true, true, true]],
  ["AI Content Studio", [false, false, "Beta", true]],
  ["Brand memory", [false, false, true, true]],
  ["Advanced white-label", [false, false, false, true]],
  ["Stripe payments", [false, false, true, true]],
  ["API access", [false, false, false, true]],
  ["SSO / SAML", [false, false, false, false]],
  ["Support", ["Email", "Email", "Priority", "Priority"]],
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tiers.map(t => (
              <div key={t.name} className={`flex flex-col rounded-2xl border bg-background p-6 ${t.pop ? "border-foreground shadow-pop" : "border-border"}`}>
                {t.pop ? <div className="mb-3 inline-flex w-fit chip-indigo">Most popular</div> : <div className="mb-3 h-[22px]" />}
                <div className="text-[13px] font-medium text-muted-foreground">{t.name}</div>
                <div className="mt-2 flex items-baseline gap-1"><span className="text-[34px] font-semibold tracking-tight md:text-[38px]">${t.price}</span><span className="text-[13px] text-muted-foreground">/mo</span></div>
                <div className="mt-1 text-[12.5px] text-muted-foreground">{t.sub}</div>
                <Link to="/book-demo" className={`mt-5 flex h-10 items-center justify-center rounded-lg text-[13px] font-medium ${t.pop ? "bg-foreground text-background hover:bg-foreground/90" : "border border-border bg-background hover:bg-[var(--surface-2)]"}`}>Start 14-day trial</Link>
                <ul className="mt-5 space-y-2">
                  {t.features.map(f => <li key={f} className="flex items-start gap-2 text-[12.5px]"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--success)]" /><span>{f}</span></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-dashed border-border bg-background p-5">
            <div>
              <div className="text-[14px] font-semibold">Enterprise · custom</div>
              <div className="text-[12.5px] text-muted-foreground">50+ clients, SSO, custom contracts, multi-brand white-label, dedicated infrastructure.</div>
            </div>
            <Link to="/book-demo" className="inline-flex h-10 items-center rounded-lg border border-border bg-background px-4 text-[13px] font-medium hover:bg-[var(--surface-2)]">Talk to sales <ArrowRight className="ml-1.5 h-3.5 w-3.5" /></Link>
          </div>
        </div>
      </section>

      <section className="hairline-t py-16">
        <div className="mx-auto max-w-[1100px] px-6">
          <h2 className="text-[24px] font-semibold tracking-tight">Compare plans</h2>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-background">
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
