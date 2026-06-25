import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader, Card, KPI, StatusBadge } from "@/components/bits";
import { getProfile } from "@/lib/auth";
import { getClients, getClient, getCampaigns } from "@/lib/data";
import { getClientInsights } from "@/lib/data/insights";
import { usd, num, pct, type Campaign } from "@/mock/data";
import { ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Bar, BarChart } from "recharts";
import { Loader2, BarChart3 } from "lucide-react";

export const Route = createFileRoute("/portal/campaigns")({
  component: CampaignPerf,
  head: () => ({ meta: [{ title: "Campaign performance — Client portal" }] }),
});

function agg(rows: Campaign[]) {
  const spend = rows.reduce((a, c) => a + c.spend, 0);
  const leads = rows.reduce((a, c) => a + c.leads, 0);
  const impressions = rows.reduce((a, c) => a + c.impressions, 0);
  const clicks = rows.reduce((a, c) => a + c.clicks, 0);
  return {
    spend, leads, impressions, clicks,
    cpl: leads ? spend / leads : 0,
    cpc: clicks ? spend / clicks : 0,
    ctr: impressions ? (clicks / impressions) * 100 : 0,
  };
}

function CampaignPerf() {
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: getProfile });
  const { data: clients = [] } = useQuery({ queryKey: ["clients"], queryFn: getClients, enabled: !!profile && !profile.client_id });
  const clientId = profile?.client_id ?? clients[0]?.id;
  const { data: client } = useQuery({ queryKey: ["client", clientId], queryFn: () => getClient(clientId!), enabled: !!clientId });
  const { data: allCampaigns = [], isLoading } = useQuery({ queryKey: ["campaigns"], queryFn: getCampaigns, enabled: !!clientId });
  const { data: insights = {} } = useQuery({ queryKey: ["client-insights", clientId], queryFn: () => getClientInsights(clientId!), enabled: !!clientId });

  const [plat, setPlat] = useState<"all" | "Meta Ads" | "Google Ads">("all");
  const mine = useMemo(
    () => (client ? allCampaigns.filter((c) => c.client === client.name && (plat === "all" || c.platform === plat)) : []),
    [allCampaigns, client, plat],
  );
  const t = useMemo(() => agg(mine), [mine]);
  const chartData = [...mine].sort((a, b) => b.spend - a.spend).slice(0, 8).map((c) => ({ name: c.name, leads: c.leads }));

  return (
    <>
      <PageHeader title="Campaign performance" sub="What your ads did this month, in plain English." />
      <div className="space-y-6 px-6 pb-10">
        <div className="flex h-10 w-fit rounded-lg border border-border bg-background p-0.5 text-[13px]">
          {(["all", "Meta Ads", "Google Ads"] as const).map((p) => (
            <button key={p} onClick={() => setPlat(p)} className={`rounded-md px-4 ${plat === p ? "bg-foreground text-background" : "text-muted-foreground"}`}>{p === "all" ? "All platforms" : p}</button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center gap-2 py-12 text-[13px] text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading your campaigns…
          </div>
        ) : mine.length === 0 ? (
          <div className="grid place-items-center rounded-2xl border border-dashed border-border px-6 py-16 text-center">
            <span className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-[var(--surface)] text-muted-foreground">
              <BarChart3 className="h-5 w-5" />
            </span>
            <div className="mt-3 text-[14px] font-medium">No active campaigns yet</div>
            <div className="mt-1 text-[12.5px] text-muted-foreground">Your agency's campaigns and results will appear here.</div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
              <KPI label="Spend" value={usd(t.spend)} helper="What you paid for ads this month." />
              <KPI label="Leads" value={num(t.leads)} helper="People who filled out a form or called." />
              <KPI label="CPL" value={`$${t.cpl.toFixed(2)}`} helper="What each lead costs you." />
              <KPI label="CPC" value={`$${t.cpc.toFixed(2)}`} helper="What each ad click costs you." />
              <KPI label="CTR" value={pct(t.ctr)} helper="How often people click after seeing your ad." />
              <KPI label="Impressions" value={num(t.impressions)} helper="How many times your ad was shown." />
            </div>

            {insights.analytics_summary?.body && (
              <Card className="p-5">
                <div className="text-[15px] font-semibold">What this means</div>
                <p className="mt-2 whitespace-pre-line text-[13px] leading-relaxed text-muted-foreground">
                  {insights.analytics_summary.body}
                </p>
              </Card>
            )}

            <Card className="p-5">
              <div className="text-[15px] font-semibold">Leads by campaign</div>
              <div className="mt-4 h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 6, right: 8, bottom: 0, left: 0 }}>
                    <CartesianGrid stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "var(--text-faint)" }} axisLine={false} tickLine={false} interval={0} angle={-12} height={48} textAnchor="end" />
                    <YAxis tick={{ fontSize: 11, fill: "var(--text-faint)" }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: "var(--surface-2)" }} contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12, color: "var(--foreground)" }} />
                    <Bar dataKey="leads" fill="var(--accent)" radius={[3, 3, 0, 0]} barSize={22} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card>
              <div className="p-5 pb-2 text-[15px] font-semibold">Active campaigns</div>
              <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-[13px]">
                <thead className="bg-[var(--surface-2)] text-left text-[11.5px] uppercase tracking-wider text-muted-foreground">
                  <tr><th className="px-4 py-2">Campaign</th><th className="px-4 py-2">Spend</th><th className="px-4 py-2">Leads</th><th className="px-4 py-2">CPL</th><th className="px-4 py-2">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mine.map((c) => (
                    <tr key={c.id}><td className="px-4 py-2.5 font-medium">{c.name}</td><td className="px-4 py-2.5 mono">{usd(c.spend)}</td><td className="px-4 py-2.5">{c.leads}</td><td className="px-4 py-2.5 mono">${c.cpl.toFixed(2)}</td><td className="px-4 py-2.5"><StatusBadge kind={c.status === "Active" ? "success" : c.status === "Learning" ? "indigo" : "neutral"}>{c.status}</StatusBadge></td></tr>
                  ))}
                </tbody>
              </table>
              </div>
            </Card>
          </>
        )}
      </div>
    </>
  );
}
