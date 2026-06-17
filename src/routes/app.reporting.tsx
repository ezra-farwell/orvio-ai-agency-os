import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { KPI, PageHeader, Card, StatusBadge } from "@/components/bits";
import { campaigns, clients, trend30d, usd, num, pct, type Campaign } from "@/mock/data";
import { Sparkles, TrendingUp, TrendingDown, Download } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Bar, ComposedChart } from "recharts";

export const Route = createFileRoute("/app/reporting")({
  component: Reporting,
  head: () => ({ meta: [{ title: "Ad reporting — Orvio" }] }),
});

function Reporting() {
  const [client, setClient] = useState<string>("all");
  const [platform, setPlatform] = useState<"all" | "Meta Ads" | "Google Ads">("all");
  const [range, setRange] = useState("Last 30 days");

  const rows = useMemo(() => campaigns.filter(c =>
    (client === "all" || c.client === client) &&
    (platform === "all" || c.platform === platform)
  ), [client, platform]);

  const t = useMemo(() => agg(rows), [rows]);
  const best = [...rows].sort((a,b) => a.cpl - b.cpl)[0];
  const worst = [...rows].sort((a,b) => b.cpl - a.cpl)[0];

  return (
    <>
      <PageHeader
        title="Ad reporting"
        sub="Meta + Google Ads across every client."
        actions={
          <>
            <select value={client} onChange={e=>setClient(e.target.value)} className="h-9 rounded-lg border border-border bg-background px-3 text-[13px]">
              <option value="all">All clients</option>
              {clients.map(c => <option key={c.id}>{c.name}</option>)}
            </select>
            <div className="flex h-9 rounded-lg border border-border bg-background p-0.5 text-[12.5px]">
              {(["all","Meta Ads","Google Ads"] as const).map(p => (
                <button key={p} onClick={()=>setPlatform(p)} className={`rounded-md px-3 ${platform===p?"bg-foreground text-background":"text-muted-foreground hover:text-foreground"}`}>{p==="all"?"All platforms":p}</button>
              ))}
            </div>
            <select value={range} onChange={e=>setRange(e.target.value)} className="h-9 rounded-lg border border-border bg-background px-3 text-[13px]"><option>Last 7 days</option><option>Last 30 days</option><option>This month</option><option>Last quarter</option></select>
            <button className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-[13px]"><Download className="h-3.5 w-3.5" />Export</button>
          </>
        }
      />

      <div className="space-y-6 px-6 pb-10">
        {/* KPI strip */}
        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-9">
          <KPI label="Spend" value={usd(t.spend)} delta={8.2} />
          <KPI label="Leads" value={num(t.leads)} delta={12.4} />
          <KPI label="CPL" value={`$${t.cpl.toFixed(2)}`} delta={-4.1} />
          <KPI label="CPC" value={`$${t.cpc.toFixed(2)}`} delta={-1.4} />
          <KPI label="CTR" value={pct(t.ctr)} delta={0.3} />
          <KPI label="CPM" value={`$${t.cpm.toFixed(2)}`} delta={2.1} />
          <KPI label="Impressions" value={num(Math.round(t.impressions))} delta={6.1} />
          <KPI label="Clicks" value={num(Math.round(t.clicks))} delta={9.4} />
          <KPI label="Conv. rate" value={pct(t.conv)} delta={1.1} />
        </div>

        {/* Trend + insights */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="md:col-span-2 p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[15px] font-semibold">Spend vs leads</div>
                <div className="text-[12.5px] text-muted-foreground">Daily totals · {range.toLowerCase()}</div>
              </div>
              <div className="flex gap-3 text-[12px]">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{background:"#4F46E5"}} /> Spend</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{background:"#10B981"}} /> Leads</span>
              </div>
            </div>
            <div className="mt-4 h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={trend30d}>
                  <defs>
                    <linearGradient id="gs" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4F46E5" stopOpacity={0.25} /><stop offset="100%" stopColor="#4F46E5" stopOpacity={0} /></linearGradient>
                  </defs>
                  <CartesianGrid stroke="#E7E7EA" vertical={false} />
                  <XAxis dataKey="d" tick={{ fontSize: 11, fill: "#52525B" }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="l" tick={{ fontSize: 11, fill: "#52525B" }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="r" orientation="right" tick={{ fontSize: 11, fill: "#52525B" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E7E7EA", fontSize: 12 }} />
                  <Area yAxisId="l" type="monotone" dataKey="spend" stroke="#4F46E5" strokeWidth={2} fill="url(#gs)" />
                  <Bar yAxisId="r" dataKey="leads" fill="#10B981" radius={[3,3,0,0]} barSize={10} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <AIInsightCard best={best} worst={worst} totals={t} />

        </div>

        {/* Best/worst */}
        <div className="grid gap-4 md:grid-cols-2">
          <CampaignCard label="Best campaign" tone="success" Icon={TrendingUp} c={best} />
          <CampaignCard label="Needs attention" tone="warning" Icon={TrendingDown} c={worst} />
        </div>

        {/* Comparison table */}
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
                <th className="px-4 py-2">Campaign</th>
                <th className="px-4 py-2">Client</th>
                <th className="px-4 py-2">Platform</th>
                <th className="px-4 py-2">Spend</th>
                <th className="px-4 py-2">Leads</th>
                <th className="px-4 py-2">CPL</th>
                <th className="px-4 py-2">CPC</th>
                <th className="px-4 py-2">CTR</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[...rows].sort((a,b)=>b.spend-a.spend).map(c => (
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
      </div>
    </>
  );
}

function AIInsightCard({ best, worst, totals }: { best?: Campaign; worst?: Campaign; totals: ReturnType<typeof agg> }) {
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function generate() {
    setLoading(true);
    setRecommendation(null);
    // Local Orvio AI placeholder — produces a deterministic recommendation
    // from the current data. Swap with an Ollama call when wired.
    setTimeout(() => {
      const lines: string[] = [];
      lines.push(`Network spend ${usd(totals.spend)} produced ${num(totals.leads)} leads at a blended $${totals.cpl.toFixed(2)} CPL.`);
      if (best) {
        const targetBudget = Math.round(best.spend * 1.2);
        lines.push(`✓ Scale ${best.name} (${best.client}) daily budget from ${usd(best.spend)} → ${usd(targetBudget)} this week — CPL of $${best.cpl.toFixed(2)} is well below network average.`);
      }
      if (worst) {
        lines.push(`⚠ Pause ${worst.name} (${worst.client}) — $${worst.cpl.toFixed(2)} CPL is dragging the network. Rotate to a Brand Memory–approved creative variant and re-test for 72h.`);
      }
      lines.push(`Next 7-day target: hold blended CPL under $${(totals.cpl * 0.95).toFixed(2)} and grow leads ${num(Math.round(totals.leads * 1.1))}.`);
      setRecommendation(lines.join("\n\n"));
      setLoading(false);
    }, 700);
  }

  return (
    <Card className="p-5">
      <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-[var(--accent)]" /><div className="text-[14px] font-semibold">AI insight summary</div></div>
      <div className="mt-3 text-[12.5px] leading-relaxed text-muted-foreground">
        <p>Spend grew <span className="font-medium text-foreground">+8.2%</span> while CPL dropped <span className="font-medium text-foreground">-4.1%</span> — a healthy trend.</p>
        <p className="mt-2"><span className="font-medium text-foreground">{best?.name}</span> is the strongest performer at ${best?.cpl.toFixed(2)} CPL — 1.6× better than the network average. Recommend scaling daily budget +20%.</p>
        <p className="mt-2"><span className="font-medium text-foreground">{worst?.name}</span> is bleeding spend at ${worst?.cpl.toFixed(2)} CPL. Pause underperforming ad sets and rotate creative from Brand Memory.</p>
      </div>
      {recommendation && (
        <div className="mt-3 whitespace-pre-line rounded-lg border border-[var(--accent)]/30 bg-[var(--accent-soft)]/40 px-3 py-2.5 text-[12.5px] leading-relaxed text-foreground">
          {recommendation}
        </div>
      )}
      <button
        onClick={generate}
        disabled={loading}
        className="mt-3 inline-flex h-8 items-center gap-1.5 rounded-md bg-[var(--accent-soft)] px-2.5 text-[12px] font-medium text-[var(--accent)] hover:bg-[var(--accent-soft)]/70 disabled:opacity-60"
      >
        <Sparkles className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
        {loading ? "Generating…" : recommendation ? "Regenerate recommendation" : "Generate client recommendation"}
      </button>
    </Card>
  );
}

function CampaignCard({ label, tone, Icon, c }: { label: string; tone: "success" | "warning"; Icon: any; c?: Campaign }) {

  const color = tone === "success" ? "var(--success)" : "var(--warning)";
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[12.5px] font-medium" style={{ color }}>
          <Icon className="h-3.5 w-3.5" /> {label}
        </div>
        <span className={c.platform==="Meta Ads"?"chip-indigo":"chip"}>{c.platform}</span>
      </div>
      <div className="mt-2 text-[17px] font-semibold tracking-tight">{c.name}</div>
      <div className="text-[12.5px] text-muted-foreground">{c.client}</div>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {[
          ["Spend", usd(c.spend)],
          ["Leads", String(c.leads)],
          ["CPL", `$${c.cpl.toFixed(2)}`],
          ["CTR", `${c.ctr.toFixed(1)}%`],
        ].map(([l,v]) => (
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
function sum<T>(arr: T[], k: keyof T) { return arr.reduce((a,r) => a + (r[k] as unknown as number), 0); }
function avg<T>(arr: T[], k: keyof T) { return sum(arr, k) / arr.length; }
