import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Card, KPI, StatusBadge } from "@/components/bits";
import { agencies, usd } from "@/mock/data";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
  head: () => ({ meta: [{ title: "Admin overview — Orvio" }] }),
});

function AdminOverview() {
  const totals = agencies.reduce((a,x)=>({clients:a.clients+x.clients, mrr:a.mrr+x.mrr, spend:a.spend+x.spend}),{clients:0,mrr:0,spend:0});
  return (
    <>
      <PageHeader title="Master admin" sub="Every agency on Orvio." />
      <div className="space-y-6 px-6 pb-10">
        <div className="grid gap-3 md:grid-cols-4">
          <KPI label="Agencies" value={agencies.length} sub={`${agencies.filter(a=>a.status==="Active").length} active`} />
          <KPI label="Total client accounts" value={totals.clients} />
          <KPI label="Monthly recurring revenue" value={usd(totals.mrr)} delta={6.4} />
          <KPI label="Client ad spend tracked" value={usd(totals.spend)} sub="last 30 days" />
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          <KPI label="Churn risk" value={agencies.filter(a=>a.status==="Churn Risk").length} sub="agencies flagged" />
          <KPI label="Past due" value={agencies.filter(a=>a.status==="Past Due").length} />
          <KPI label="Trial accounts" value={agencies.filter(a=>a.status==="Trial").length} />
          <KPI label="Avg CPL across platform" value="$74.20" delta={-2.1} />
        </div>
        <Card>
          <div className="flex items-center justify-between p-5 pb-3">
            <div className="text-[15px] font-semibold">Recent agency activity</div>
            <Link to="/admin/agencies" className="text-[12.5px] font-medium text-[var(--accent)] hover:underline">All agencies →</Link>
          </div>
          <table className="w-full text-[13px]">
            <thead className="bg-[var(--surface-2)] text-left text-[11.5px] uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-4 py-2">Agency</th><th className="px-4 py-2">Plan</th><th className="px-4 py-2">Clients</th><th className="px-4 py-2">MRR</th><th className="px-4 py-2">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {agencies.map(a => (
                <tr key={a.id} className="hover:bg-[var(--surface-2)]/60">
                  <td className="px-4 py-2.5"><Link to="/admin/agencies/$id" params={{ id: a.id }} className="font-medium hover:underline">{a.name}</Link><div className="text-[11px] text-muted-foreground">{a.owner}</div></td>
                  <td className="px-4 py-2.5">{a.plan}</td>
                  <td className="px-4 py-2.5">{a.clients}</td>
                  <td className="px-4 py-2.5 mono">{usd(a.mrr)}</td>
                  <td className="px-4 py-2.5"><StatusBadge kind={a.status==="Active"?"success":a.status==="Trial"?"indigo":a.status==="Past Due"||a.status==="Churn Risk"?"danger":"neutral"}>{a.status}</StatusBadge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </>
  );
}
