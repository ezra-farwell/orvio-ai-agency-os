import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, StatusGroupCard, HeroNumber } from "@/components/bits";
import { currentClient, leads, clientDashboard, TONE_COLOR, num } from "@/mock/data";
import { Phone, MessageSquare } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/portal/")({
  component: ClientOverview,
  head: () => ({ meta: [{ title: "Your dashboard — Client portal" }] }),
});

const trend = [
  { d: "Wk 1", leads: 12 }, { d: "Wk 2", leads: 14 },
  { d: "Wk 3", leads: 17 }, { d: "Wk 4", leads: 20 },
];

function ClientOverview() {
  const groups = clientDashboard(currentClient);
  const myLeads = leads.filter(l => l.client === currentClient.name).slice(0, 4);

  return (
    <>
      <PageHeader
        title={`Welcome back, ${currentClient.owner.split(" ")[0]}`}
        sub="A simple view of how your ads are doing this month."
      />
      <div className="space-y-8 px-6 pb-12">
        <div className="grid gap-4 md:grid-cols-3">
          {groups.map((g, i) => <StatusGroupCard key={i} group={g} />)}
        </div>

        <HeroNumber label="LEADS THIS MONTH" value={num(currentClient.leads)} sub="from your active ad campaigns">
          <div className="mt-6 h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ top: 6, right: 12, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="cleads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34D399" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#34D399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="d" tick={{ fontSize: 11, fill: "var(--text-faint)" }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip cursor={{ stroke: "var(--border)", strokeDasharray: 3 }}
                  contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12, color: "var(--foreground)" }} />
                <Area type="monotone" dataKey="leads" stroke="#34D399" strokeWidth={2} fill="url(#cleads)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </HeroNumber>

        <section>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--text-faint)]">ACTIVITY</div>
              <h2 className="mt-1 text-[18px] font-semibold tracking-tight">Recent leads</h2>
            </div>
            <Link to="/portal/leads" className="text-[12.5px] font-medium text-muted-foreground hover:text-foreground">See all →</Link>
          </div>
          <div className="rounded-2xl border border-border bg-[var(--surface)]">
            <ul className="divide-y divide-border">
              {myLeads.map(l => {
                const tone = l.status === "Won" ? "good" : l.status === "Lost" ? "risk" : l.status === "Booked" ? "steady" : "neutral";
                return (
                  <li key={l.id} className="flex items-center gap-4 px-5 py-4">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: TONE_COLOR[tone] }} />
                    <div className="min-w-0 flex-1">
                      <div className="text-[14px] font-medium">{l.name}</div>
                      <div className="text-[11.5px] text-[var(--text-faint)]">{l.campaign} · {l.submitted}</div>
                    </div>
                    <div className="w-20 text-right text-[12.5px] text-muted-foreground">{l.status}</div>
                    <div className="flex gap-1">
                      <button className="grid h-8 w-8 place-items-center rounded-md border border-border bg-[var(--surface)] text-muted-foreground hover:text-foreground" title="Call"><Phone className="h-3.5 w-3.5" /></button>
                      <button className="grid h-8 w-8 place-items-center rounded-md border border-border bg-[var(--surface)] text-muted-foreground hover:text-foreground" title="Message"><MessageSquare className="h-3.5 w-3.5" /></button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <div className="rounded-2xl border border-border bg-[var(--surface)] p-6">
          <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--text-faint)]">LATEST FROM YOUR AGENCY</div>
          <p className="mt-3 text-[14px] leading-relaxed text-foreground/90">
            Your Roof Replacement campaign is converting <span className="font-semibold">1.6× better</span> than average. We're scaling daily budget by 20% and refreshing three creatives. Approvals coming Thursday.
          </p>
          <div className="mt-3 text-[11.5px] text-[var(--text-faint)]">From Avery at Northstar · 3h ago</div>
        </div>
      </div>
    </>
  );
}
