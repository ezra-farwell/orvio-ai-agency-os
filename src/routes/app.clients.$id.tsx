import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { usd } from "@/mock/data";
import { getClient, getCampaigns, getLeads } from "@/lib/data";
import { getClientInsights } from "@/lib/data/insights";
import { PageHeader, Card, KPI, StatusBadge } from "@/components/bits";
import { Sparkles, ArrowRight, AlertTriangle, ListChecks } from "lucide-react";
import { AIActionMenu } from "@/components/orvio/AIActionMenu";

const churnTone = (sev?: string | null) =>
  sev === "high" ? "var(--danger)" : sev === "medium" ? "var(--warning)" : "var(--success)";

export const Route = createFileRoute("/app/clients/$id")({
  component: ClientDetail,
  loader: ({ params }) => ({ id: params.id }),
  head: () => ({ meta: [{ title: "Client — Orvio" }] }),
});

function ClientDetail() {
  const { id } = Route.useLoaderData();
  const { data: client } = useQuery({ queryKey: ["client", id], queryFn: () => getClient(id) });
  const { data: allCampaigns = [] } = useQuery({ queryKey: ["campaigns"], queryFn: getCampaigns });
  const { data: allLeads = [] } = useQuery({ queryKey: ["leads"], queryFn: getLeads });
  const { data: ai = {} } = useQuery({
    queryKey: ["client-insights", id], queryFn: () => getClientInsights(id),
  });
  const c = client;
  const myCampaigns = c ? allCampaigns.filter(x => x.client === c.name) : [];
  const myLeads = c ? allLeads.filter(l => l.client === c.name) : [];
  const churn = ai.churn_risk;
  const actions = ai.next_actions?.data?.actions ?? [];
  const flags = ai.followup_flag?.data?.flags ?? [];
  const clientContext = c ? [
    `Client: ${c.name}`,
    `Category: ${c.category || "Not provided"}`,
    `Service area: ${c.area || "Not provided"}`,
    `Status: ${c.status}`,
    `Monthly spend: ${usd(c.monthlySpend)}`,
    `Leads: ${c.leads}`,
    `CPL: $${c.cpl.toFixed(2)}`,
    `Campaigns shown: ${myCampaigns.length}`,
    `Recent leads shown: ${myLeads.length}`,
    churn?.body ? `Existing churn insight: ${churn.body}` : "",
  ].filter(Boolean).join("\n") : "";
  if (!c) return <div className="px-6 py-10 text-[13px] text-muted-foreground">Loading client…</div>;
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
            <AIActionMenu
              clientId={c.id}
              actions={[
                { label: "Summarize this client", mode: "general", prompt: `Summarize ${c.name}'s current account health and identify the most important next steps.`, context: clientContext },
                { label: "Generate campaign ideas", mode: "campaign_ideas", prompt: `Generate practical paid-ad campaign ideas for ${c.name}.`, context: clientContext },
                { label: "Write lead follow-up plan", mode: "lead_followup", prompt: `Create a lead follow-up plan for ${c.name}.`, context: clientContext },
                { label: "Explain churn risk", mode: "general", prompt: `Explain ${c.name}'s churn risk or client health in practical agency terms.`, context: clientContext },
                { label: "Create report summary", mode: "report_summary", prompt: `Draft a clear client-ready performance summary for ${c.name}.`, context: clientContext },
              ]}
            />
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-[var(--accent)]" /><div className="text-[15px] font-semibold">Orvio AI insight</div></div>
              {churn?.score != null && (
                <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ color: churnTone(churn.severity), background: `color-mix(in oklab, ${churnTone(churn.severity)} 14%, transparent)` }}>
                  <AlertTriangle className="h-3 w-3" /> Churn {Math.round(Number(churn.score))}
                </span>
              )}
            </div>

            {!ai.churn_risk && !ai.next_actions && (
              <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">No AI insight yet — runs after the local Orvio AI worker analyzes this client.</p>
            )}

            {churn?.body && (
              <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">{churn.body}</p>
            )}

            {flags.length > 0 && (
              <div className="mt-4">
                <div className="text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--text-faint)]">Follow-ups</div>
                <ul className="mt-2 space-y-1.5">
                  {flags.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-[12.5px] text-foreground/85">
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--warning)]" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {actions.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--text-faint)]"><ListChecks className="h-3.5 w-3.5" /> Recommended next actions</div>
                <ul className="mt-2 space-y-1.5">
                  {actions.map((a, i) => (
                    <li key={i} className="flex items-start gap-2 text-[12.5px] text-foreground/85">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" /> {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Link to="/app/studio" className="mt-4 inline-flex items-center gap-1 text-[12.5px] font-medium text-[var(--accent)] hover:underline">Generate new creative <ArrowRight className="h-3 w-3" /></Link>
          </Card>
        </div>
      </div>
    </>
  );
}
