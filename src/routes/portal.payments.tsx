import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card, StatusBadge } from "@/components/bits";

export const Route = createFileRoute("/portal/payments")({
  component: PortalPay,
  head: () => ({ meta: [{ title: "Payments — Client portal" }] }),
});

const inv = [
  ["INV-2041","April retainer", 1200, "Paid",     "Apr 30"],
  ["INV-2046","Onboarding setup",    750,  "Sent",     "May 12"],
  ["INV-2031","March retainer",1200, "Paid",     "Mar 31"],
  ["INV-2018","February retainer",1200, "Paid",   "Feb 28"],
] as const;

function PortalPay() {
  return (
    <>
      <PageHeader title="Payments" sub="Invoices from your agency. Pay or schedule in one click." />
      <div className="space-y-6 px-6 pb-10">
        <Card className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div>
            <div className="text-[12px] text-muted-foreground">Next invoice</div>
            <div className="text-[20px] font-semibold tracking-tight">$1,200 due May 31</div>
            <div className="text-[12.5px] text-muted-foreground">May retainer — Northstar Growth Co.</div>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex h-10 items-center rounded-lg border border-border bg-background px-3 text-[13px]">Update card</button>
            <button className="inline-flex h-10 items-center rounded-lg bg-foreground px-3 text-[13px] font-medium text-background">Pay now</button>
          </div>
        </Card>
        <Card>
          <div className="p-5 pb-2 text-[15px] font-semibold">Invoice history</div>
          <table className="w-full text-[13px]">
            <thead className="bg-[var(--surface-2)] text-left text-[11.5px] uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-4 py-2">Invoice</th><th className="px-4 py-2">Description</th><th className="px-4 py-2">Amount</th><th className="px-4 py-2">Status</th><th className="px-4 py-2">Date</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {inv.map(([id,d,a,s,date]) => (
                <tr key={id as string}><td className="px-4 py-2.5 mono">{id}</td><td className="px-4 py-2.5 font-medium">{d}</td><td className="px-4 py-2.5 mono">${(a as number).toLocaleString()}</td><td className="px-4 py-2.5"><StatusBadge kind={s==="Paid"?"success":"neutral"}>{s as string}</StatusBadge></td><td className="px-4 py-2.5 text-muted-foreground">{date}</td></tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </>
  );
}
