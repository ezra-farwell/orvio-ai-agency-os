import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { KPI, PageHeader, Card, StatusBadge } from "@/components/bits";
import { getCampaigns, getClients } from "@/lib/data";
import { usd, num, pct, type Campaign } from "@/mock/data";
import { AIActionLink } from "@/components/orvio/AIActionMenu";
import { Sparkles, TrendingUp, TrendingDown, BarChart3, Loader2 } from "lucide-react";
import { ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Bar, BarChart } from "recharts";

export const Route = createFileRoute("/app/reporting")({
  component: Reporting,
  head: () => ({ meta: [{ title: "Ad reporting — Orvio" }] }),
});

function Reporting() {
  const { data: campaigns = [], isLoading } = useQuery({ queryKey: ["campaigns"], queryFn: getCampaigns });
  const { data: clients = [] } = useQuery({ queryKey: ["clients"], queryFn: getClients });
  const [client, setClient] = useState<string>("all");
  const [platform, setPlatform] = useState<"all" | "Meta Ads" | "Google Ads">("all");

  const rows = useMemo(
    () => campaigns.filter((c) => (client === "all" || c.client === client) && (platform === "all" || c.platform === platform)),
    [campaigns, client, platform],
  );
  const t = useMemo(() => agg(rows), [rows]);
  const best = [...rows].sort((a, b) => a.cpl - b.cpl)[0];
  const worst = [...rows].sort((a, b) => b.cpl - a.cpl)[0];
  const chartData = [...rows].sort((a, b) => b.spend - a.spend).slice(0, 8).map((c) => ({ name: c.name, leads: c.leads, spend: Math.round(c.spend) }));

  return (
    <>
      <PageHeader
        title="Ad reporting"
        sub="Meta + Google Ads across every client."
        actions={
          <>
            <select value={client} onChange={(e) => setClient(e.target.value)} className="h-9 rounded-lg border border-border bg-background px-3 text-[13px]">
              <option value="all">All clients</option>
              {clients.map((c) => <option key={c.id}>{c.name}</option>)}
            </select>
            <div className="flex h-9 rounded-lg border border-border bg-background p-0.5 text-[12.5px]">
              {(["all", "Meta Ads", "Google Ads"] as const).map((p) => (
                <button key={p} onClick={() => setPlatform(p)} className={`rounded-md px-3 ${platform === p ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}>{p === "all" ? "All platforms" : p}</button>
              ))}
            </div>
          </>
        }
      />

      <div className="space-y-6 px-6 pb-10">
        {isLoading ? (
          <div className="flex items-center gap-2 py-12 text-[13px] text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading campaign data…
          </div>
        ) : rows.length === 0 ? (
          <div className="grid place-items-center rounded-2xl border border-dashed border-border px-6 py-16 text-center">
            <span className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-[var(--surface)] text-muted-foreground">
              <BarChart3 className="h-5 w-5" />
            </span>
            <div className="mt-3 text-[14px] font-medium">
              {campaigns.length === 0 ? "No campaign data yet" : "No campaigns match these filters"}
            </div>
            <div className="mt-1 max-w-sm text-[12.5px] text-muted-foreground">
              {campaigns.length === 0
                ? "Connect Meta or Google in Integrations and campaign performance will sync here automatically."
                : "Try a different client or platform."}
            </div>
          </div>
        ) : (
          <>
            {/* KPI strip — real aggregates */}
            <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-9">
              <KPI label="Spend" value={usd(t.spend)} />
              <KPI label="Leads" value={num(t.leads)} />
              <KPI label="CPL" value={`$${t.cpl.toFixed(2)}`} />
              <KPI label="CPC" value={`$${t.cpc.toFixed(2)}`} />
              <KPI label="CTR" value={pct(t.ctr)} />
              <KPI label="CPM" value={`$${t.cpm.toFixed(2)}`} />
              <KPI label="Impressions" value={num(Math.round(t.impressions))} />
              <KPI label="Clicks" value={num(Math.round(t.clicks))} />
              <KPI label="Conv. rate" value={pct(t.conv)} />
            </div>

            {/* Real chart + real AI link */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="p-5 md:col-span-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[15px] font-semibold">Leads by campaign</div>
                    <div className="text-[12.5px] text-muted-foreground">Top {chartData.length} by spend</div>
                  </div>
                </div>
                <div className="mt-4 h-[240px]">
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

              <Card className="flex flex-col p-5">
                <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-[var(--accent)]" /><div className="text-[14px] font-semibold">Orvio AI insight</div></div>
                <p className="mt-3 flex-1 text-[12.5px] leading-relaxed text-muted-foreground">
                  Let Orvio AI read this view — blended CPL of ${t.cpl.toFixed(2)} across
                  {" "}{rows.length} campaigns — and recommend what to scale, pause, and refresh.
                </p>
                <AIActionLink
                  mode="report_summary"
                  prompt="Analyze my current ad reporting view and recommend what to scale, pause, and refresh."
                  context={[
                    `Campaigns in view: ${rows.length}`,
                    `Total spend: ${usd(t.spend)}`,
                    `Total leads: ${t.leads}`,
                    `Blended CPL: $${t.cpl.toFixed(2)}`,
                    best ? `Best CPL: ${best.name} (${best.client}) at $${best.cpl.toFixed(2)}` : "",
                    worst ? `Worst CPL: ${worst.name} (${worst.client}) at $${worst.cpl.toFixed(2)}` : "",
                  ].filter(Boolean).join("\n")}
                  className="mt-3 inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-foreground px-3 text-[13px] font-medium text-background hover:opacity-90"
                >
                  <Sparkles className="h-3.5 w-3.5" /> Analyze with Orvio AI
                </AIActionLink>
              </Card>
            </div>

            {/* Best / worst — real */}
            <div className="grid gap-4 md:grid-cols-2">
              <CampaignCard label="Best campaign" tone="success" Icon={TrendingUp} c={best} />
              <CampaignCard label="Needs attention" tone="warning" Icon={TrendingDown} c={worst} />
            </div>

            {/* Comparison table — real */}
            <Card>
              <div className="flex items-center justify-between p-5 pb-3">
                <div>
                  <div className="text-[15px] font-semibold">Campaign comparison</div>
                  <div className="text-[12.5px] text-muted-foreground">{rows.length} campaigns · sorted by spend</div>
                </div>
              </div>
              <table className="w-full text-[13px]">
                <thead className="bg-[var(--surface-2)] text-left text-[11.5px] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2">Campaign</th><th className="px-4 py-2">Client</th><th className="px-4 py-2">Platform</th>
                    <th className="px-4 py-2">Spend</th><th className="px-4 py-2">Leads</th><th className="px-4 py-2">CPL</th>
                    <th className="px-4 py-2">CPC</th><th className="px-4 py-2">CTR</th><th className="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[...rows].sort((a, b) => b.spend - a.spend).map((c) => (
                    <tr key={c.id} className="hover:bg-[var(--surface-2)]/60">
                      <td className="px-4 py-2.5 font-medium">{c.name}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{c.client}</td>
                      <td className="px-4 py-2.5"><span className={c.platform === "Meta Ads" ? "chip-indigo" : "chip"}>{c.platform}</span></td>
                      <td className="px-4 py-2.5 mono">{usd(c.spend)}</td>
                      <td className="px-4 py-2.5">{c.leads}</td>
                      <td className="px-4 py-2.5 mono">${c.cpl.toFixed(2)}</td>
                      <td className="px-4 py-2.5 mono">${c.cpc.toFixed(2)}</td>
                      <td className="px-4 py-2.5 mono">{c.ctr.toFixed(1)}%</td>
                      <td className="px-4 py-2.5">
                        {c.status === "Active" && <StatusBadge kind="success">Active</StatusBadge>}
                        {c.status === "Paused" && <StatusBadge kind="neutral">Paused</StatusBadge>}
                        {c.status === "Learning" && <StatusBadge kind="indigo">Learning</StatusBadge>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </>
        )}
      </div>
    </>
  );
}

function CampaignCard({ label, tone, Icon, c }: { label: string; tone: "success" | "warning"; Icon: typeof TrendingUp; c?: Campaign }) {
  if (!c) return null;
  const color = tone === "success" ? "var(--success)" : "var(--warning)";
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[12.5px] font-medium" style={{ color }}>
          <Icon className="h-3.5 w-3.5" /> {label}
        </div>
        <span className={c.platform === "Meta Ads" ? "chip-indigo" : "chip"}>{c.platform}</span>
      </div>
      <div className="mt-2 text-[17px] font-semibold tracking-tight">{c.name}</div>
      <div className="text-[12.5px] text-muted-foreground">{c.client}</div>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {[["Spend", usd(c.spend)], ["Leads", String(c.leads)], ["CPL", `$${c.cpl.toFixed(2)}`], ["CTR", `${c.ctr.toFixed(1)}%`]].map(([l, v]) => (
          <div key={l} className="rounded-lg bg-[var(--surface-2)] p-2.5">
            <div className="text-[10.5px] text-muted-foreground">{l}</div>
            <div className="mono mt-0.5 text-[13.5px] font-semibold">{v}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function agg(rows: Campaign[]) {
  if (!rows.length) return { spend: 0, leads: 0, cpl: 0, cpc: 0, ctr: 0, cpm: 0, impressions: 0, clicks: 0, conv: 0 };
  const spend = sum(rows, "spend");
  const leads = sum(rows, "leads");
  const impressions = sum(rows, "impressions");
  const clicks = sum(rows, "clicks");
  return {
    spend, leads,
    cpl: leads ? spend / leads : 0,
    cpc: clicks ? spend / clicks : 0,
    ctr: impressions ? (clicks / impressions) * 100 : 0,
    cpm: impressions ? (spend / impressions) * 1000 : 0,
    impressions, clicks,
    conv: avg(rows, "conv"),
  };
}
function sum<T>(arr: T[], k: keyof T) { return arr.reduce((a, r) => a + (r[k] as unknown as number), 0); }
function avg<T>(arr: T[], k: keyof T) { return sum(arr, k) / arr.length; }
