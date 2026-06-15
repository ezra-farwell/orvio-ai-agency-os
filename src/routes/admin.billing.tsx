import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card, KPI } from "@/components/bits";
import { agencies, usd } from "@/mock/data";

export const Route = createFileRoute("/admin/billing")({
  component: Billing,
  head: () => ({ meta: [{ title: "Billing — Orvio admin" }] }),
});

function Billing() {
  const mrr = agencies.reduce((a,x)=>a+x.mrr,0);
  return (
    <>
      <PageHeader title="Billing & MRR" sub="Platform-level revenue and subscription health." />
      <div className="space-y-6 px-6 pb-10">
        <div className="grid gap-3 md:grid-cols-4">
          <KPI label="MRR" value={usd(mrr)} delta={6.4} />
          <KPI label="ARR (est)" value={usd(mrr*12)} />
          <KPI label="Past due" value="2 agencies" />
          <KPI label="Avg revenue per agency" value={usd(mrr/agencies.length)} />
        </div>
        <Card className="p-5">
          <div className="text-[14px] font-semibold">Revenue by plan</div>
          <div className="mt-3 grid gap-2 md:grid-cols-4">
            {["Starter","Growth","Scale","Enterprise"].map(p => {
              const list = agencies.filter(a=>a.plan===p);
              const rev = list.reduce((a,x)=>a+x.mrr,0);
              return (
                <div key={p} className="rounded-lg border border-border bg-[var(--surface-2)] p-3">
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{p}</div>
                  <div className="mt-0.5 text-[18px] font-semibold mono">{usd(rev)}</div>
                  <div className="text-[11.5px] text-muted-foreground">{list.length} agencies</div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </>
  );
}
