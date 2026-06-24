import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader, Card, KPI } from "@/components/bits";
import { getAgencies } from "@/lib/data";
import { usd } from "@/mock/data";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/billing")({
  component: Billing,
  head: () => ({ meta: [{ title: "Billing — Orvio admin" }] }),
});

const PLANS = ["Starter", "Growth", "Scale", "Enterprise"] as const;

function Billing() {
  const { data: agencies = [], isLoading } = useQuery({ queryKey: ["agencies"], queryFn: getAgencies });

  const mrr = agencies.reduce((a, x) => a + x.mrr, 0);
  const pastDue = agencies.filter((a) => a.status === "Past Due").length;
  const avg = agencies.length ? mrr / agencies.length : 0;

  return (
    <>
      <PageHeader title="Billing & MRR" sub="Platform-level revenue and subscription health." />
      <div className="space-y-6 px-6 pb-10">
        {isLoading ? (
          <div className="flex items-center gap-2 py-12 text-[13px] text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading billing…
          </div>
        ) : (
          <>
            <div className="grid gap-3 md:grid-cols-4">
              <KPI label="MRR" value={usd(mrr)} />
              <KPI label="ARR (est)" value={usd(mrr * 12)} />
              <KPI label="Past due" value={`${pastDue} ${pastDue === 1 ? "agency" : "agencies"}`} />
              <KPI label="Avg revenue per agency" value={usd(avg)} />
            </div>
            <Card className="p-5">
              <div className="text-[14px] font-semibold">Revenue by plan</div>
              <div className="mt-3 grid gap-2 md:grid-cols-4">
                {PLANS.map((p) => {
                  const list = agencies.filter((a) => a.plan === p);
                  const rev = list.reduce((a, x) => a + x.mrr, 0);
                  return (
                    <div key={p} className="rounded-lg border border-border bg-[var(--surface-2)] p-3">
                      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{p}</div>
                      <div className="mono mt-0.5 text-[18px] font-semibold">{usd(rev)}</div>
                      <div className="text-[11.5px] text-muted-foreground">{list.length} {list.length === 1 ? "agency" : "agencies"}</div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </>
        )}
      </div>
    </>
  );
}
