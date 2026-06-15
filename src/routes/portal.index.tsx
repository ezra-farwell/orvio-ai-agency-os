import { createFileRoute, Link } from "@tanstack/react-router";
import { KPI, PageHeader, Card, StatusBadge } from "@/components/bits";
import { currentClient, leads, usd } from "@/mock/data";
import { ArrowRight, Sparkles, Phone, MessageSquare } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/portal/")({
  component: ClientOverview,
  head: () => ({ meta: [{ title: "Your dashboard — Client portal" }] }),
});

const miniTrend = [
  { d: "W1", leads: 12 }, { d: "W2", leads: 14 }, { d: "W3", leads: 17 }, { d: "W4", leads: 20 },
];

function ClientOverview() {
  const myLeads = leads.filter(l => l.client === currentClient.name);
  const recent = myLeads.slice(0, 4);
  return (
    <>
      <PageHeader
        title={`Welcome back, ${currentClient.owner.split(" ")[0]}`}
        sub="Here's how your ads are performing this month."
        actions={
          <span className="chip-success"><span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-[var(--success)]" />Campaigns active</span>
        }
      />
      <div className="space-y-6 px-6 pb-12">
        {/* KPI grid */}
        <div className="grid gap-3 md:grid-cols-3">
          <KPI label="This month's ad spend" value={usd(currentClient.monthlySpend)} sub="what you invested in ads" helper="What you paid Meta and Google for ads — does not include our retainer." />
          <KPI label="Leads generated" value={currentClient.leads} sub="new potential customers" delta={12.4} helper="People who filled out your form, called, or messaged after seeing an ad." />
          <KPI label="Cost per lead" value={`$${currentClient.cpl.toFixed(2)}`} delta={-4.1} helper="What each new lead costs you. Lower is better." />
          <KPI label="Booked appointments" value={18} sub="calls on the calendar" helper="Leads that turned into real appointments on your schedule." />
          <KPI label="Calls & messages" value={31} sub="this month" helper="Inbound calls and form messages from your ads." />
          <KPI label="Click-through rate" value="2.8%" delta={0.3} helper="How often people clicked your ad after seeing it." />
          <KPI label="Campaign status" value={<span className="text-[var(--success)]">All running</span>} sub="3 active campaigns" />
          <KPI label="Pending content approvals" value={2} sub="needs your eyes" helper="New ads and posts your agency needs you to approve before they go live." />
          <KPI label="Latest agency update" value={<span className="text-[16px] font-medium leading-snug">Scaling Roof Replacement +20%</span>} sub="3 hours ago" />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Trend */}
          <Card className="lg:col-span-2 p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[15px] font-semibold">Leads over the last 4 weeks</div>
                <div className="text-[12.5px] text-muted-foreground">Every form fill, call, and message your ads generated</div>
              </div>
              <Link to="/portal/campaigns" className="text-[12.5px] font-medium text-[var(--accent)] hover:underline">View full performance →</Link>
            </div>
            <div className="mt-4 h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={miniTrend}>
                  <defs><linearGradient id="ga" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4F46E5" stopOpacity={0.3}/><stop offset="100%" stopColor="#4F46E5" stopOpacity={0}/></linearGradient></defs>
                  <XAxis dataKey="d" tick={{ fontSize: 11, fill: "#52525B" }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E7E7EA", fontSize: 12 }} />
                  <Area type="monotone" dataKey="leads" stroke="#4F46E5" strokeWidth={2} fill="url(#ga)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Agency update */}
          <Card className="p-5">
            <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-[var(--accent)]" /><div className="text-[14px] font-semibold">Latest agency recommendation</div></div>
            <p className="mt-3 text-[13px] leading-relaxed text-foreground/85">
              Your Roof Replacement campaign is converting <span className="font-semibold">1.6× better</span> than average. We're scaling the daily budget by 20% and refreshing three creatives in the Studio. Approvals coming Thursday.
            </p>
            <div className="mt-3 text-[11px] text-muted-foreground">From Avery at Northstar · 3h ago</div>
            <Link to="/portal/messages" className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-medium text-[var(--accent)] hover:underline">Reply <ArrowRight className="h-3 w-3" /></Link>
          </Card>
        </div>

        {/* Recent leads */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div><div className="text-[15px] font-semibold">Recent leads</div><div className="text-[12.5px] text-muted-foreground">From your ads · last 7 days</div></div>
            <Link to="/portal/leads" className="text-[12.5px] font-medium text-[var(--accent)] hover:underline">See all →</Link>
          </div>
          <ul className="mt-4 divide-y divide-border">
            {recent.map(l => (
              <li key={l.id} className="flex items-center gap-3 py-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-[var(--surface-2)] text-[11px] font-semibold">{l.name.split(" ").map(n => n[0]).join("")}</div>
                <div className="flex-1">
                  <div className="text-[14px] font-medium">{l.name}</div>
                  <div className="text-[11.5px] text-muted-foreground">{l.campaign} · {l.submitted}</div>
                </div>
                <StatusBadge kind={l.status==="Won"?"success":l.status==="Lost"?"danger":l.status==="Booked"?"indigo":"neutral"}>{l.status}</StatusBadge>
                <div className="flex gap-1">
                  <button className="grid h-8 w-8 place-items-center rounded-md border border-border bg-background text-muted-foreground hover:text-foreground" title="Call"><Phone className="h-3.5 w-3.5" /></button>
                  <button className="grid h-8 w-8 place-items-center rounded-md border border-border bg-background text-muted-foreground hover:text-foreground" title="Message"><MessageSquare className="h-3.5 w-3.5" /></button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
