import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Card, KPI, StatusBadge } from "@/components/bits";
import { campaigns, currentClient, usd } from "@/mock/data";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

export const Route = createFileRoute("/portal/campaigns")({
  component: CampaignPerf,
  head: () => ({ meta: [{ title: "Campaign performance — Client portal" }] }),
});

const trend = [
  { d: "Apr 1", spend: 110 }, { d: "Apr 8", spend: 140 }, { d: "Apr 15", spend: 160 }, { d: "Apr 22", spend: 180 }, { d: "Apr 29", spend: 200 },
];

function CampaignPerf() {
  const [plat, setPlat] = useState<"Meta Ads" | "Google Ads">("Meta Ads");
  const mine = campaigns.filter(c => c.client === currentClient.name);
  return (
    <>
      <PageHeader
        title="Campaign performance"
        sub="What your ads did this month, in plain English."
      />
      <div className="px-6 pb-10 space-y-6">
        <div className="flex h-10 rounded-lg border border-border bg-background p-0.5 text-[13px] w-fit">
          {(["Meta Ads","Google Ads"] as const).map(p => (
            <button key={p} onClick={()=>setPlat(p)} className={`rounded-md px-4 ${plat===p?"bg-foreground text-background":"text-muted-foreground"}`}>{p}</button>
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          <KPI label="Spend" value={usd(4280)} helper="What you paid Meta for ads this month." />
          <KPI label="Leads" value={63} helper="People who filled out a form or called." />
          <KPI label="CPL" value="$67.94" helper="What each lead costs you." />
          <KPI label="CPC" value="$3.21" helper="What each ad click costs you." />
          <KPI label="CTR" value="2.8%" helper="How often people click after seeing your ad." />
          <KPI label="Impressions" value="148,200" helper="How many times your ad was shown." />
        </div>

        <Card className="p-5">
          <div className="text-[15px] font-semibold">What this means</div>
          <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
            Your ads were shown to <span className="font-medium text-foreground">148,200</span> people in {currentClient.area}. <span className="font-medium text-foreground">4,150</span> of them clicked through, and <span className="font-medium text-foreground">63</span> turned into leads — a number your agency is happy with. Cost per lead dropped 4% versus last month.
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div className="text-[15px] font-semibold">Daily spend</div>
            <div className="text-[12.5px] text-muted-foreground">April 2024</div>
          </div>
          <div className="mt-4 h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend}>
                <defs><linearGradient id="gp" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4F46E5" stopOpacity={0.3}/><stop offset="100%" stopColor="#4F46E5" stopOpacity={0}/></linearGradient></defs>
                <XAxis dataKey="d" tick={{ fontSize: 11, fill: "#52525B" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E7E7EA", fontSize: 12 }} />
                <Area type="monotone" dataKey="spend" stroke="#4F46E5" strokeWidth={2} fill="url(#gp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="p-5 pb-2 text-[15px] font-semibold">Active campaigns</div>
          <table className="w-full text-[13px]">
            <thead className="bg-[var(--surface-2)] text-left text-[11.5px] uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-4 py-2">Campaign</th><th className="px-4 py-2">Spend</th><th className="px-4 py-2">Leads</th><th className="px-4 py-2">CPL</th><th className="px-4 py-2">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mine.map(c => (
                <tr key={c.id}><td className="px-4 py-2.5 font-medium">{c.name}</td><td className="px-4 py-2.5 mono">{usd(c.spend)}</td><td className="px-4 py-2.5">{c.leads}</td><td className="px-4 py-2.5 mono">${c.cpl.toFixed(2)}</td><td className="px-4 py-2.5"><StatusBadge kind={c.status==="Active"?"success":c.status==="Learning"?"indigo":"neutral"}>{c.status}</StatusBadge></td></tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </>
  );
}
