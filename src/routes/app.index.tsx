import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { PageHeader, StatusGroupCard, HeroNumber } from "@/components/bits";
import { usd, num, TONE_COLOR } from "@/mock/data";
import { getAgencyDashboard, getClients, getLeads, getLeadTrend } from "@/lib/data";
import { getConnections } from "@/lib/integrations";
import {
  ArrowRight,
  Check,
  CreditCard,
  ListTodo,
  LoaderCircle,
  Plug,
  Plus,
  Sparkles,
  UserPlus,
  X,
} from "lucide-react";
import { AIActionLink } from "@/components/orvio/AIActionMenu";
import {
  listOrvioAITaskSuggestions,
  updateOrvioAITaskSuggestionStatus,
} from "@/lib/api/ai.functions";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/app/")({
  component: AgencyOverview,
  head: () => ({ meta: [{ title: "Overview — Orvio agency" }] }),
});

function AgencyOverview() {
  const { data: groups = [], isLoading: dashLoading } = useQuery({ queryKey: ["agency-dashboard"], queryFn: getAgencyDashboard });
  const { data: clients = [], isLoading: clientsLoading } = useQuery({ queryKey: ["clients"], queryFn: getClients });
  const { data: allLeads = [], isLoading: leadsLoading } = useQuery({ queryKey: ["leads"], queryFn: getLeads });
  const { data: leadTrend = [] } = useQuery({ queryKey: ["lead-trend"], queryFn: () => getLeadTrend(30) });
  const { data: connections = [] } = useQuery({ queryKey: ["connections"], queryFn: getConnections });
  const totalSpend = clients.reduce((a, c) => a + c.monthlySpend, 0);
  const totalLeads = clients.reduce((a, c) => a + c.leads, 0);
  const recentLeads = allLeads.slice(0, 6);
  const trendTotal = leadTrend.reduce((a, p) => a + p.leads, 0);
  const hasClients = clients.length > 0;
  const stripeConnected = connections.some((c) => c.provider === "stripe" && c.status === "active");
  const adsConnected = connections.some((c) => (c.provider === "meta" || c.provider === "google") && c.status === "active");
  const showFirstRun = !clientsLoading && !hasClients;

  return (
    <>
      <PageHeader
        title="Overview"
        sub="Performance and account health across every client."
        actions={
          <>
            <AIActionLink
              mode="task_recommendations"
              prompt="Recommend the highest-priority agency tasks for the next seven days."
              context={`Agency overview currently shows ${clients.length} clients, ${totalLeads} leads, and ${usd(totalSpend)} in monthly spend.`}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-[13px] font-medium hover:bg-[var(--surface-2)]"
            >
              <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
              Recommend tasks
            </AIActionLink>
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
        {dashLoading ? (
          <div className="grid gap-4 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-[150px] animate-pulse rounded-2xl border border-border bg-[var(--surface)]" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {groups.map((g, i) => <StatusGroupCard key={i} group={g} />)}
          </div>
        )}

        {showFirstRun && (
          <SetupChecklist stripeConnected={stripeConnected} adsConnected={adsConnected} />
        )}

        <AITaskSuggestionsWidget />

        {!showFirstRun && (
        <>
        {/* Hero number + trend */}
        <HeroNumber label="LEADS GENERATED" value={num(totalLeads)} sub={`${usd(totalSpend)} spent · last 30 days`}>
          {trendTotal === 0 ? (
            <div className="mt-6 grid h-[220px] place-items-center rounded-xl border border-dashed border-border px-6 text-center text-[13px] text-muted-foreground">
              Your lead trend appears here once leads start coming in.
            </div>
          ) : (
          <div className="mt-6 h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={leadTrend} margin={{ top: 6, right: 12, bottom: 0, left: 0 }}>
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
          )}
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
            {clientsLoading ? (
              <div className="space-y-2 p-4">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="h-12 animate-pulse rounded-lg bg-[var(--surface-2)]" />
                ))}
              </div>
            ) : (
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
            )}
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
            {recentLeads.length === 0 ? (
              <div className="px-5 py-8 text-center text-[13px] text-muted-foreground">
                No recent leads yet — they'll appear here as campaigns generate them.
              </div>
            ) : (
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
            )}
          </div>
        </section>
        </>
        )}
      </div>
    </>
  );
}

function SetupChecklist({
  stripeConnected,
  adsConnected,
}: {
  stripeConnected: boolean;
  adsConnected: boolean;
}) {
  const steps: Array<{
    done: boolean;
    icon: typeof UserPlus;
    label: string;
    desc: string;
    to: "/app/clients" | "/app/settings/integrations";
    cta: string;
  }> = [
    { done: false, icon: UserPlus, label: "Add your first client", desc: "Create a client to start tracking campaigns, leads, and reports.", to: "/app/clients", cta: "Add client" },
    { done: adsConnected, icon: Plug, label: "Connect an ad account", desc: "Link Meta or Google so spend and leads sync automatically.", to: "/app/settings/integrations", cta: "Connect" },
    { done: stripeConnected, icon: CreditCard, label: "Connect Stripe to get paid", desc: "Send invoices and collect client payments directly to your account.", to: "/app/settings/integrations", cta: "Connect" },
  ];

  return (
    <section className="rounded-2xl border border-border bg-[var(--surface)] p-6">
      <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--text-faint)]">
        <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" /> Get started
      </div>
      <h2 className="mt-1 text-[18px] font-semibold tracking-tight">Set up your agency in 3 steps</h2>
      <p className="mt-1 text-[13px] text-muted-foreground">
        A few minutes now and your dashboard fills with real client data.
      </p>
      <ul className="mt-5 space-y-2.5">
        {steps.map((s) => {
          const Icon = s.icon;
          return (
            <li key={s.label} className="flex items-center gap-3 rounded-xl border border-border bg-background p-3.5">
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${s.done ? "bg-[var(--success-soft)] text-[var(--success)]" : "bg-[var(--accent-soft)] text-[var(--accent)]"}`}>
                {s.done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[13.5px] font-medium">{s.label}</div>
                <div className="text-[12px] text-muted-foreground">{s.desc}</div>
              </div>
              {s.done ? (
                <span className="chip-success shrink-0">Done</span>
              ) : (
                <Link to={s.to} className="inline-flex h-9 shrink-0 items-center gap-1 rounded-lg bg-foreground px-3 text-[12.5px] font-medium text-background hover:opacity-90">
                  {s.cta} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

type DashboardTaskSuggestion = Awaited<
  ReturnType<typeof listOrvioAITaskSuggestions>
>[number];

function AITaskSuggestionsWidget() {
  const queryClient = useQueryClient();
  const [updatingId, setUpdatingId] = useState<string>();
  const [actionError, setActionError] = useState<string>();
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["orvio-ai-dashboard-task-suggestions"],
    queryFn: async () => {
      const [suggested, accepted] = await Promise.all([
        listOrvioAITaskSuggestions({
          data: { status: "suggested", limit: 4 },
        }),
        listOrvioAITaskSuggestions({
          data: { status: "accepted", limit: 4 },
        }),
      ]);

      return [...suggested, ...accepted]
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
        .slice(0, 4);
    },
  });

  async function setTaskStatus(
    task: DashboardTaskSuggestion,
    status: "accepted" | "dismissed" | "completed",
  ) {
    if (updatingId) return;
    setUpdatingId(task.id);
    setActionError(undefined);

    try {
      await updateOrvioAITaskSuggestionStatus({
        data: { taskSuggestionId: task.id, status },
      });
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["orvio-ai-dashboard-task-suggestions"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["orvio-ai-task-suggestions"],
        }),
      ]);
    } catch {
      setActionError("The task suggestion could not be updated.");
    } finally {
      setUpdatingId(undefined);
    }
  }

  return (
    <section className="rounded-2xl border border-border bg-[var(--surface)]">
      <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--text-faint)]">
            <ListTodo className="h-3.5 w-3.5 text-[var(--accent)]" />
            Orvio AI tasks
          </div>
          <h2 className="mt-1 text-[16px] font-semibold tracking-tight">
            Suggested priorities
          </h2>
        </div>
        <Link
          to="/app/ai"
          search={{ mode: "task_recommendations" }}
          className="text-[12px] font-medium text-muted-foreground hover:text-foreground"
        >
          Open Orvio AI →
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 px-5 py-5 text-[12px] text-muted-foreground">
          <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
          Loading suggested priorities…
        </div>
      ) : tasks.length === 0 ? (
        <div className="px-5 py-5 text-[12px] text-muted-foreground">
          No active AI task suggestions.
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex flex-wrap items-center gap-3 px-5 py-3"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[12.5px] font-medium">
                  {task.title}
                </div>
                <div className="mt-0.5 flex items-center gap-1.5 text-[10.5px] text-muted-foreground">
                  <span className="capitalize">
                    {task.priority || "No priority"}
                  </span>
                  <span>·</span>
                  <span className="capitalize">{task.status}</span>
                  {task.clientName && (
                    <>
                      <span>·</span>
                      <span className="truncate">{task.clientName}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {updatingId === task.id ? (
                  <LoaderCircle className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                ) : (
                  <>
                    {task.status === "suggested" && (
                      <DashboardTaskAction
                        title="Accept task"
                        disabled={Boolean(updatingId)}
                        onClick={() => void setTaskStatus(task, "accepted")}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </DashboardTaskAction>
                    )}
                    <DashboardTaskAction
                      title="Complete task"
                      disabled={Boolean(updatingId)}
                      onClick={() => void setTaskStatus(task, "completed")}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </DashboardTaskAction>
                    <DashboardTaskAction
                      title="Dismiss task"
                      disabled={Boolean(updatingId)}
                      onClick={() => void setTaskStatus(task, "dismissed")}
                    >
                      <X className="h-3.5 w-3.5" />
                    </DashboardTaskAction>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {actionError && (
        <div className="border-t border-border px-5 py-2.5 text-[11.5px] text-[var(--danger)]">
          {actionError}
        </div>
      )}
    </section>
  );
}

function DashboardTaskAction(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>,
) {
  return (
    <button
      type="button"
      className="grid h-7 w-7 place-items-center rounded-md border border-border text-muted-foreground hover:bg-[var(--surface-2)] hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
      {...props}
    />
  );
}
