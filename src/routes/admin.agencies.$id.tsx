import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader, Card, KPI, StatusBadge } from "@/components/bits";
import { getAgencies } from "@/lib/data";
import { usd } from "@/mock/data";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/agencies/$id")({
  component: AgencyDetail,
  head: () => ({ meta: [{ title: "Agency — Orvio admin" }] }),
});

function AgencyDetail() {
  const { id } = Route.useParams();
  const { data: agencies = [], isLoading } = useQuery({ queryKey: ["agencies"], queryFn: getAgencies });
  const a = agencies.find((x) => x.id === id);

  if (isLoading) {
    return (
      <>
        <PageHeader title="Agency" sub="Loading…" />
        <div className="flex items-center gap-2 px-6 py-12 text-[13px] text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading agency…
        </div>
      </>
    );
  }

  if (!a) {
    return (
      <>
        <PageHeader title="Agency not found" sub="This agency may have been removed." />
        <div className="px-6 py-10 text-[13px] text-muted-foreground">No agency matches this link.</div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={a.name}
        sub={`${a.owner} · ${a.plan} plan${a.domain ? ` · ${a.domain}` : ""}`}
        actions={<StatusBadge kind={a.status === "Active" ? "success" : a.status === "Trial" ? "indigo" : "danger"}>{a.status}</StatusBadge>}
      />
      <div className="space-y-6 px-6 pb-10">
        <div className="grid gap-3 md:grid-cols-4">
          <KPI label="Clients" value={a.clients} />
          <KPI label="MRR" value={usd(a.mrr)} />
          <KPI label="Spend tracked" value={usd(a.spend)} sub="last 30 days" />
          <KPI label="Plan" value={a.plan} />
        </div>
        <Card className="p-5">
          <div className="text-[14px] font-semibold">Integrations</div>
          <div className="mt-3 grid gap-2 md:grid-cols-3">
            {[["Meta Ads", a.meta], ["Google Ads", a.google], ["Stripe Connect", a.stripe]].map(([label, state]) => (
              <div key={label as string} className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
                <div className="text-[13px] font-medium">{label}</div>
                <StatusBadge kind={state === "OK" ? "success" : state === "Warning" ? "warning" : state === "Off" ? "neutral" : "danger"}>{state}</StatusBadge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
