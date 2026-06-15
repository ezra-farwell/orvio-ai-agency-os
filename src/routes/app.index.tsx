import { createFileRoute, Link } from "@tanstack/react-router";
import { KPI, PageHeader, Card, StatusBadge } from "@/components/bits";
import { clients, campaigns, leads, usd, num, pct } from "@/mock/data";
import { ArrowRight, Plus, TrendingUp, TrendingDown, Sparkles } from "lucide-react";

export const Route = createFileRoute("/app/")({
  component: AgencyOverview,
  head: () => ({ meta: [{ title: "Overview — Orvio agency" }] }),
});

function AgencyOverview() {
  const totalSpend = clients.reduce((a,c) => a + c.monthlySpend, 0);
  const totalLeads = clients.reduce((a,c) => a + c.leads, 0);
  const avgCpl = totalSpend / totalLeads;
  const atRisk = clients.filter(c => c.status === "at-risk").length;
  const openLeads = leads.filter(l => l.status === "New" || l.status === "Contacted").length;
  return (
    <>
      <PageHeader
        title="Overview"
        sub="Performance, activity, and account health across every client."
        actions={
          <>
            <select className="h-9 rounded-lg border border-border bg-background px-3 text-[13px]"><option>Last 30 days</option><option>Last 7 days</option><option>This month</option></select>
            <Link to="/app/clients" className="inline-flex h-9 items-center gap-1 rounded-lg bg-foreground px-3 text-[13px] font-medium text-background hover:bg-foreground/90"><Plus className="h-3.5 w-3.5" /> Add client</Link>
          </>
        }
      />
      <div className="space-y-6 px-6 pb-10">
        <div className="grid gap-3 md:grid-cols-4">
          <KPI label="Active clients" value={clients.filter(c=>c.status!=="onboarding").length} sub={`${clients.length} total`} delta={2.4} />
          <KPI label="Total ad spend" value={usd(totalSpend)} sub="Last 30 days" delta={8.2} />
          <KPI label="Leads generated" value={num(totalLeads)} sub="Across all clients" delta={12.4} />
          <KPI label="Avg cost per lead" value={`$${avgCpl.toFixed(2)}`} sub="-4.1% vs prev" delta={-4.1} />
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          <KPI label="Avg CPC" value="$3.21" delta={-1.4} />
          <KPI label="Avg CTR" value={pct(2.8)} delta={0.3} />
          <KPI label="Conversion rate" value={pct(12.6)} delta={1.1} />
          <KPI label="Open leads" value={openLeads} sub="Awaiting follow-up" />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="md:col-span-2 p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[15px] font-semibold">Client snapshot</div>
                <div className="text-[12.5px] text-muted-foreground">Spend, leads, and account status — last 30 days</div>
              </div>
              <Link to="/app/clients" className="text-[12.5px] font-medium text-[var(--accent)] hover:underline">View all →</Link>
            </div>
            <div className="mt-4 overflow-hidden rounded-lg border border-border">
              <table className="w-full text-[13px]">
                <thead className="bg-[var(--surface-2)] text-left text-[11.5px] uppercase tracking-wider text-muted-foreground">
                  <tr><th className="px-3 py-2">Client</th><th className="px-3 py-2">Spend</th><th className="px-3 py-2">Leads</th><th className="px-3 py-2">CPL</th><th className="px-3 py-2">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {clients.map(c => (
                    <tr key={c.id} className="hover:bg-[var(--surface-2)]/60">
                      <td className="px-3 py-2.5">
                        <Link to="/app/clients/$id" params={{ id: c.id }} className="flex items-center gap-2">
                          <span className="grid h-6 w-6 place-items-center rounded text-[10px] font-semibold text-white" style={{ background: c.color }}>{c.initials}</span>
                          <span className="font-medium">{c.name}</span>
                        </Link>
                      </td>
                      <td className="px-3 py-2.5 mono">{usd(c.monthlySpend)}</td>
                      <td className="px-3 py-2.5">{c.leads}</td>
                      <td className="px-3 py-2.5 mono">${c.cpl.toFixed(2)}</td>
                      <td className="px-3 py-2.5">
                        {c.status === "active" && <StatusBadge kind="success">Active</StatusBadge>}
                        {c.status === "at-risk" && <StatusBadge kind="warning">At risk</StatusBadge>}
                        {c.status === "onboarding" && <StatusBadge kind="indigo">Onboarding</StatusBadge>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="p-5">
            <div className="text-[15px] font-semibold">Recent activity</div>
            <ul className="mt-3 space-y-3 text-[13px]">
              {[
                ["New lead","Brian Connors → Hartland Plumbing","2m ago"],
                ["Approval","Carlos Reyes approved kitchen carousel","18m ago"],
                ["Payment","$1,200 invoice paid by Lakeside Electric","1h ago"],
                ["Risk signal","Brighton HVAC engagement down 32%","3h ago"],
                ["Campaign","Roof Replacement scaled +20%","yesterday"],
              ].map(([k,b,t],i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                  <div className="min-w-0 flex-1">
                    <div className="text-[12px] font-medium text-muted-foreground">{k}</div>
                    <div className="truncate">{b}</div>
                  </div>
                  <div className="text-[11px] text-muted-foreground">{t}</div>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <Card className="p-5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[var(--accent)]" />
            <div className="text-[15px] font-semibold">Insights this week</div>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {([
              { t: "Scale opportunity", b: "Roof Replacement is converting 1.6× the network average. Increase daily budget by 20%.", Icon: TrendingUp, c: "var(--success)" },
              { t: "Watchlist", b: "Brighton HVAC engagement is down 32% week over week. Schedule a check-in.", Icon: TrendingDown, c: "var(--warning)" },
              { t: "Creative refresh", b: "Apex Remodeling has 4 ads in fatigue. Generate 6 new variations from Brand Memory.", Icon: Sparkles, c: "var(--accent)" },
            ]).map(({ t, b, Icon, c }, i) => (
              <div key={i} className="rounded-lg border border-border bg-[var(--surface-2)]/60 p-3">
                <div className="flex items-center gap-2 text-[12.5px] font-medium" style={{ color: c }}>
                  <Icon className="h-3.5 w-3.5" /> {t}
                </div>
                <div className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">{b}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
