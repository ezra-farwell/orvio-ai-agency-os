import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card, StatusBadge } from "@/components/bits";
import { clients, usd } from "@/mock/data";
import { Download, Sparkles } from "lucide-react";

export const Route = createFileRoute("/app/reports")({
  component: Reports,
  head: () => ({ meta: [{ title: "Reports — Orvio" }] }),
});

function Reports() {
  return (
    <>
      <PageHeader title="Reports" sub="One-click monthly client reports — plain English." actions={<button className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-foreground px-3 text-[13px] font-medium text-background"><Sparkles className="h-3.5 w-3.5" />Generate all reports</button>} />
      <div className="grid gap-4 px-6 pb-10 lg:grid-cols-2">
        {clients.map(c => (
          <Card key={c.id} className="p-5">
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded text-[12px] font-semibold text-white" style={{ background: c.color }}>{c.initials}</span>
              <div className="flex-1"><div className="text-[14px] font-semibold">{c.name}</div><div className="text-[11.5px] text-muted-foreground">Monthly performance · April 2024</div></div>
              <StatusBadge kind="indigo">Draft</StatusBadge>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <Stat label="Spend" v={usd(c.monthlySpend)} />
              <Stat label="Leads" v={String(c.leads)} />
              <Stat label="CPL" v={`$${c.cpl.toFixed(2)}`} />
            </div>
            <div className="mt-3 rounded-lg border border-border bg-[var(--surface-2)]/60 p-3 text-[12.5px] leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">Best:</span> Emergency Plumbing Leads — 31 leads at $59 CPL. <span className="font-medium text-foreground">Watch:</span> creative fatigue in week 4. <span className="font-medium text-foreground">Next:</span> scale top ad set, refresh hooks.
            </div>
            <div className="mt-3 flex justify-end gap-2">
              <button className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-2.5 text-[12px]"><Download className="h-3 w-3" />Export PDF</button>
              <button className="inline-flex h-8 items-center rounded-md bg-foreground px-2.5 text-[12px] font-medium text-background">Send to client</button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
function Stat({ label, v }: { label: string; v: string }) {
  return (
    <div className="rounded-lg border border-border bg-background p-2.5">
      <div className="text-[10.5px] text-muted-foreground">{label}</div>
      <div className="mono mt-0.5 text-[15px] font-semibold">{v}</div>
    </div>
  );
}
