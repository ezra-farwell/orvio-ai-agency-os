import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card, KPI, StatusBadge } from "@/components/bits";
import { usd } from "@/mock/data";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/app/payments")({
  component: Payments,
  head: () => ({ meta: [{ title: "Payments — Orvio" }] }),
});

const invoices = [
  ["INV-2041","Hartland Plumbing","Apr 2024 — Retainer", 1200, "Paid",     "Apr 30"],
  ["INV-2042","Northside Roofing","Apr 2024 — Retainer", 1800, "Paid",     "Apr 30"],
  ["INV-2043","Apex Remodeling","Apr 2024 — Retainer + Ads", 3200, "Paid",     "Apr 30"],
  ["INV-2044","Brighton HVAC","Apr 2024 — Retainer", 1100, "Past Due", "May 5"],
  ["INV-2045","Lakeside Electric","Apr 2024 — Retainer", 900,  "Paid",     "Apr 30"],
  ["INV-2046","Evergreen Landscaping","Apr 2024 — Onboarding", 750,  "Sent",     "May 12"],
] as const;

function Payments() {
  return (
    <>
      <PageHeader title="Payments" sub="Invoices, payouts, and Stripe Connect status." />
      <div className="space-y-6 px-6 pb-10">
        <div className="grid gap-3 md:grid-cols-4">
          <KPI label="Gross revenue · MTD" value="$8,950" delta={6.4} />
          <KPI label="Paid invoices" value="14" sub="of 16" />
          <KPI label="Outstanding" value="$1,850" sub="2 past due" />
          <KPI label="Refunded" value="$0" />
        </div>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-[var(--success)]" />
            <div>
              <div className="text-[14px] font-semibold">Stripe Connect connected</div>
              <div className="text-[12px] text-muted-foreground">acct_1Nh… · Payouts daily · Northstar Growth Co.</div>
            </div>
            <span className="ml-auto chip-success">Healthy</span>
          </div>
        </Card>

        <Card>
          <div className="p-5 pb-2 text-[15px] font-semibold">Invoices</div>
          <table className="w-full text-[13px]">
            <thead className="bg-[var(--surface-2)] text-left text-[11.5px] uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-4 py-2">Invoice</th><th className="px-4 py-2">Client</th><th className="px-4 py-2">Description</th><th className="px-4 py-2">Amount</th><th className="px-4 py-2">Status</th><th className="px-4 py-2">Date</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {invoices.map(([id,c,d,a,s,date]) => (
                <tr key={id as string} className="hover:bg-[var(--surface-2)]/60">
                  <td className="px-4 py-2.5 mono">{id}</td>
                  <td className="px-4 py-2.5 font-medium">{c}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{d}</td>
                  <td className="px-4 py-2.5 mono">{usd(a as number)}</td>
                  <td className="px-4 py-2.5">
                    <StatusBadge kind={s==="Paid"?"success":s==="Past Due"?"danger":"neutral"}>{s as string}</StatusBadge>
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">{date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </>
  );
}
