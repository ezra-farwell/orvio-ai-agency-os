import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader, StatusGroupCard, HeroNumber } from "@/components/bits";
import { trend30d, usd, num, TONE_COLOR } from "@/mock/data";
import { getAgencyDashboard, getClients, getLeads } from "@/lib/data";
import { getChurnMap, getFollowupMap, churnTier, TIER_COLOR } from "@/lib/data/insights";
import { Plus, Sparkles, AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/app/")({
  component: AgencyOverview,
  head: () => ({ meta: [{ title: "Overview — Orvio agency" }] }),
});

function AgencyOverview() {
  const { data: groups = [] } = useQuery({ queryKey: ["agency-dashboard"], queryFn: getAgencyDashboard });
  const { data: clients = [] } = useQuery({ queryKey: ["clients"], queryFn: getClients });
  const { data: allLeads = [] } = useQuery({ queryKey: ["leads"], queryFn: getLeads });
  const { data: churn = {} } = useQuery({ queryKey: ["churn-map"], queryFn: getChurnMap });
  const { data: followups = {} } = useQuery({ queryKey: ["followup-map"], queryFn: getFollowupMap });
  const totalSpend = clients.reduce((a, c) => a + c.monthlySpend, 0);
  const totalLeads = clients.reduce((a, c) => a + c.leads, 0);
  const recentLeads = allLeads.slice(0, 6);

  const analyzed = clients.filter((c) => churn[c.id]).length;
  const totalFollowups = clients.reduce((a, c) => a + (followups[c.id]?.data?.flags?.length ?? 0), 0);
  const attention = clients
    .map((c) => ({ c, ins: churn[c.id], tier: churnTier(churn[c.id]), flags: followups[c.id]?.data?.flags ?? [] }))
    .filter((x) => x.tier === "high" || x.tier === "medium" || x.flags.length > 0)
    .sort((a, b) => Number(b.ins?.score ?? 0) - Number(a.ins?.score ?? 0));

  return (
    <>
      <PageHeader
        title="Overview"
        sub="Performance and account health across every client."
        actions={
          <>
            <select className="h-9 rounded-lg border border-border bg-[var(--surface)] px-3 text-[13px]">
              <option>Last 30 days</option><option>Last 7 days</option><option>This month</option>
            </select>
            <Link to="/app/clients" className="inline-flex h-9 items-center gap-1 rounded-lg bg-foreground px-3 text-[13px] font-medium text-background hover:opacity-90">
              <Plus className="h-3.5 w-3.5" /> Add client
            </Link>
          </>
        }
      />

      <div className="space-y-8 px-6 pb-12">
        {/* Three status-word cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {groups.map((g, i) => <StatusGroupCard key={i} group={g} />)}
        </div>

        {/* Orvio AI — needs attention */}
        {analyzed > 0 && (
          <section className="rounded-2xl border border-border bg-[var(--surface)] p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]"><Sparkles className="h-4 w-4" /></span>
                <div>
                  <div className="text-[15px] font-semibold tracking-tight">Orvio AI</div>
                  <div className="text-[11.5px] text-[var(--text-faint)]">Watching {analyzed} {analyzed === 1 ? "client" : "clients"} · {totalFollowups} open follow-up{totalFollowups === 1 ? "" : "s"}</div>
                </div>
              </div>
              <Link to="/app/clients" className="text-[12.5px] font-medium text-muted-foreground hover:text-foreground">All clients →</Link>
            </div>

            {attention.length === 0 ? (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-dashed border-border bg-[var(--surface-2)]/40 px-4 py-3 text-[13px] text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-[var(--success)]" /> All clear — no clients flagged for churn risk or follow-up right now.
              </div>
            ) : (
              <ul className="mt-4 space-y-2">
                {attention.map(({ c, ins, tier, flags }) => (
                  <li key={c.id}>
                    <Link to="/app/clients/$id" params={{ id: c.id }} className="flex items-center gap-3 rounded-xl border border-border bg-[var(--surface-2)]/40 px-4 py-3 hover:bg-[var(--surface-2)]">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-[10px] font-semibold text-white" style={{ background: c.color }}>{c.initials}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[13.5px] font-medium">{c.name}</span>
                          {ins?.score != null && (
                            <span className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10.5px] font-semibold" style={{ color: TIER_COLOR[tier], background: `color-mix(in oklab, ${TIER_COLOR[tier]} 14%, transparent)` }}>
                              <AlertTriangle className="h-2.5 w-2.5" /> Churn {Math.round(Number(ins.score))}
                            </span>
                          )}
                          {flags.length > 0 && (
                            <span className="text-[10.5px] font-medium text-[var(--warning)]">{flags.length} follow-up{flags.length === 1 ? "" : "s"}</span>
                          )}
                        </div>
                        <div className="truncate text-[11.5px] text-[var(--text-faint)]">{ins?.body ?? flags[0] ?? `${c.category} · ${c.area}`}</div>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-[var(--text-faint)]" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* Hero number + trend */}
        <HeroNumber label="LEADS GENERATED" value={num(totalLeads)} sub={`${usd(totalSpend)} spent · last 30 days`}>
          <div className="mt-6 h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend30d} margin={{ top: 6, right: 12, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="leadsArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34D399" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#34D399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="d" tick={{ fontSize: 11, fill: "var(--text-faint)" }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  cursor={{ stroke: "var(--border)", strokeDasharray: 3 }}
                  contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12, color: "var(--foreground)" }}
                />
                <Area type="monotone" dataKey="leads" stroke="#34D399" strokeWidth={2} fill="url(#leadsArea)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </HeroNumber>

        {/* Clients table — hairline rows, monochrome with one status dot */}
        <section>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--text-faint)]">CLIENTS</div>
              <h2 className="mt-1 text-[18px] font-semibold tracking-tight">Active accounts</h2>
            </div>
            <Link to="/app/clients" className="text-[12.5px] font-medium text-muted-foreground hover:text-foreground">View all →</Link>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border bg-[var(--surface)]">
            <table className="w-full text-[13px]">
              <thead className="text-left text-[11px] uppercase tracking-[0.08em] text-[var(--text-faint)]">
                <tr className="border-b border-border">
                  <th className="px-5 py-3 font-medium">Client</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium">Spend</th>
                  <th className="px-5 py-3 text-right font-medium">Leads</th>
                  <th className="px-5 py-3 text-right font-medium">CPL</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => {
                  const tone = c.status === "at-risk" ? "risk" : c.status === "onboarding" ? "steady" : "good";
                  const word = c.status === "at-risk" ? "At risk" : c.status === "onboarding" ? "Onboarding" : "Active";
                  return (
                    <tr key={c.id} className="border-b border-border last:border-0 hover:bg-[var(--surface-2)]/60">
                      <td className="px-5 py-3.5">
                        <Link to="/app/clients/$id" params={{ id: c.id }} className="flex items-center gap-3">
                          <span className="grid h-7 w-7 place-items-center rounded-md text-[10px] font-semibold text-white" style={{ background: c.color }}>{c.initials}</span>
                          <div>
                            <div className="font-medium">{c.name}</div>
                            <div className="text-[11.5px] text-[var(--text-faint)]">{c.category} · {c.area}</div>
                          </div>
                        </Link>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-2 text-[12.5px] text-muted-foreground">
                          <span className="h-1.5 w-1.5 rounded-full" style={{ background: TONE_COLOR[tone] }} />
                          {word}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 mono tabular-nums text-right">{usd(c.monthlySpend)}</td>
                      <td className="px-5 py-3.5 mono tabular-nums text-right">{c.leads}</td>
                      <td className="px-5 py-3.5 mono tabular-nums text-right text-muted-foreground">${c.cpl.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recent leads — restrained list */}
        <section>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--text-faint)]">ACTIVITY</div>
              <h2 className="mt-1 text-[18px] font-semibold tracking-tight">Recent leads</h2>
            </div>
            <Link to="/app/leads" className="text-[12.5px] font-medium text-muted-foreground hover:text-foreground">View all →</Link>
          </div>
          <div className="rounded-2xl border border-border bg-[var(--surface)]">
            <ul className="divide-y divide-border">
              {recentLeads.map((l) => {
                const tone = l.status === "Won" ? "good" : l.status === "Lost" ? "risk" : l.status === "Booked" ? "steady" : "neutral";
                return (
                  <li key={l.id} className="flex items-center gap-4 px-5 py-3.5">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: TONE_COLOR[tone] }} />
                    <div className="min-w-0 flex-1">
                      <div className="text-[13.5px] font-medium">{l.name}</div>
                      <div className="text-[11.5px] text-[var(--text-faint)]">{l.client} · {l.campaign}</div>
                    </div>
                    <div className="hidden text-[12px] text-muted-foreground md:block">{l.source}</div>
                    <div className="w-24 text-right text-[12.5px] text-muted-foreground">{l.status}</div>
                    <div className="w-20 text-right text-[11.5px] text-[var(--text-faint)]">{l.submitted}</div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}
