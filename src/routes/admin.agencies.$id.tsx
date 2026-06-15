import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageHeader, Card, KPI, StatusBadge } from "@/components/bits";
import { agencies, usd } from "@/mock/data";

export const Route = createFileRoute("/admin/agencies/$id")({
  component: AgencyDetail,
  loader: ({ params }) => {
    const a = agencies.find(x => x.id === params.id);
    if (!a) throw notFound();
    return a;
  },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.name} — Orvio admin` }] }),
});

function AgencyDetail() {
  const a = Route.useLoaderData();
  return (
    <>
      <PageHeader title={a.name} sub={`${a.owner} · ${a.plan} plan · ${a.domain}`} actions={<StatusBadge kind={a.status==="Active"?"success":a.status==="Trial"?"indigo":"danger"}>{a.status}</StatusBadge>} />
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
            {[["Meta Ads",a.meta],["Google Ads",a.google],["Stripe Connect",a.stripe]].map(([label,state]) => (
              <div key={label as string} className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
                <div className="text-[13px] font-medium">{label}</div>
                <StatusBadge kind={state==="OK"?"success":state==="Warning"?"warning":"danger"}>{state}</StatusBadge>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <div className="text-[14px] font-semibold">Account actions</div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button className="h-9 rounded-lg border border-border bg-background px-3 text-[13px]">Impersonate owner</button>
            <button className="h-9 rounded-lg border border-border bg-background px-3 text-[13px]">Issue credit</button>
            <button className="h-9 rounded-lg border border-border bg-background px-3 text-[13px]">Change plan</button>
            <button className="h-9 rounded-lg border border-[var(--danger)]/30 bg-[var(--danger-soft)] px-3 text-[13px] text-[var(--danger)]">Suspend account</button>
          </div>
        </Card>
      </div>
    </>
  );
}
