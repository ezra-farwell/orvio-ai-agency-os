import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { clients, campaigns, leads, usd } from "@/mock/data";
import { PageHeader, Card, KPI, StatusBadge } from "@/components/bits";
import { Sparkles, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/app/clients/$id")({
  component: ClientDetail,
  loader: ({ params }) => {
    const c = clients.find(x => x.id === params.id);
    if (!c) throw notFound();
    return c;
  },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.name ?? "Client"} — Orvio` }] }),
});

function ClientDetail() {
  const c = Route.useLoaderData();
  const myCampaigns = campaigns.filter(x => x.client === c.name);
  const myLeads = leads.filter(l => l.client === c.name);
  return (
    <>
      <PageHeader
        title={
          <span className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded text-[12px] font-semibold text-white" style={{ background: c.color }}>{c.initials}</span>
            {c.name}
          </span>
        }
        sub={`${c.category} · ${c.area} · ${c.owner}`}
        actions={
          <>
            <Link to="/portal" className="inline-flex h-9 items-center rounded-lg border border-border bg-background px-3 text-[13px] hover:bg-[var(--surface-2)]">View client portal →</Link>
            <Link to="/app/studio/brand/$id" params={{ id: c.id }} className="inline-flex h-9 items-center rounded-lg bg-foreground px-3 text-[13px] font-medium text-background">Open brand memory</Link>
          </>
        }
      />
      <div className="space-y-6 px-6 pb-10">
        <div className="grid gap-3 md:grid-cols-4">
          <KPI label="Spend" value={usd(c.monthlySpend)} delta={6.4} />
          <KPI label="Leads" value={c.leads} delta={9.1} />
          <KPI label="CPL" value={`$${c.cpl.toFixed(2)}`} delta={-3.4} />
          <KPI label="Status" value={c.status === "active" ? "Active" : c.status === "at-risk" ? "At risk" : "Onboarding"} />
        </div>

        <Card className="p-5">
          <div className="text-[15px] font-semibold">Campaigns</div>
          <div className="mt-3 overflow-hidden rounded-lg border border-border">
            <table className="w-full text-[13px]">
              <thead className="bg-[var(--surface-2)] text-left text-[11.5px] uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-3 py-2">Campaign</th><th className="px-3 py-2">Platform</th><th className="px-3 py-2">Spend</th><th className="px-3 py-2">Leads</th><th className="px-3 py-2">CPL</th><th className="px-3 py-2">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {myCampaigns.map(cm => (
                  <tr key={cm.id}><td className="px-3 py-2.5 font-medium">{cm.name}</td><td className="px-3 py-2.5"><span className={cm.platform==="Meta Ads"?"chip-indigo":"chip"}>{cm.platform}</span></td><td className="px-3 py-2.5 mono">{usd(cm.spend)}</td><td className="px-3 py-2.5">{cm.leads}</td><td className="px-3 py-2.5 mono">${cm.cpl.toFixed(2)}</td><td className="px-3 py-2.5"><StatusBadge kind={cm.status==="Active"?"success":cm.status==="Learning"?"indigo":"neutral"}>{cm.status}</StatusBadge></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div className="text-[15px] font-semibold">Recent leads</div>
              <Link to="/app/leads" className="text-[12px] text-[var(--accent)] hover:underline">View all →</Link>
            </div>
            <ul className="mt-3 divide-y divide-border">
              {myLeads.slice(0,5).map(l => (
                <li key={l.id} className="flex items-center justify-between py-2.5 text-[13px]">
                  <div><div className="font-medium">{l.name}</div><div className="text-[11.5px] text-muted-foreground">{l.campaign}</div></div>
                  <StatusBadge kind={l.status==="Won"?"success":l.status==="Lost"?"danger":l.status==="Booked"?"indigo":"neutral"}>{l.status}</StatusBadge>
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-[var(--accent)]" /><div className="text-[15px] font-semibold">Account insight</div></div>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              {c.name} is {c.status === "at-risk" ? "trending toward churn — engagement down 32% this week" : "performing in the top quartile of accounts"}. Recommended next move: refresh ad creative from Brand Memory and schedule a monthly check-in.
            </p>
            <Link to="/app/studio" className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-medium text-[var(--accent)] hover:underline">Generate new creative <ArrowRight className="h-3 w-3" /></Link>
          </Card>
        </div>
      </div>
    </>
  );
}
