import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader, Card, StatusBadge } from "@/components/bits";
import { getLeads, getClients } from "@/lib/data";
import { type Lead } from "@/mock/data";
import { Phone, Mail, X, Loader2, Inbox } from "lucide-react";
import { AIActionLink } from "@/components/orvio/AIActionMenu";

export const Route = createFileRoute("/app/leads")({
  component: Leads,
  head: () => ({ meta: [{ title: "Leads — Orvio" }] }),
});

const STATUSES: Lead["status"][] = ["New", "Contacted", "Booked", "Estimate Sent", "Won", "Lost"];

function Leads() {
  const { data: leads = [], isLoading } = useQuery({ queryKey: ["leads"], queryFn: getLeads });
  const { data: clients = [] } = useQuery({ queryKey: ["clients"], queryFn: getClients });
  const [status, setStatus] = useState<string>("all");
  const [client, setClient] = useState("all");
  const [sel, setSel] = useState<Lead | null>(null);

  const rows = useMemo(
    () =>
      leads.filter(
        (l) =>
          (status === "all" || l.status === status) &&
          (client === "all" || l.client === client),
      ),
    [leads, status, client],
  );
  const selectedClient = sel ? clients.find((c) => c.name === sel.client) : undefined;

  return (
    <>
      <PageHeader
        title="Leads"
        sub={isLoading ? "Loading…" : `${rows.length} of ${leads.length} matching · last 30 days`}
        actions={
          <>
            <select className="h-9 rounded-lg border border-border bg-background px-3 text-[13px]" value={client} onChange={(e) => setClient(e.target.value)}>
              <option value="all">All clients</option>
              {clients.map((c) => <option key={c.id}>{c.name}</option>)}
            </select>
            <select className="h-9 rounded-lg border border-border bg-background px-3 text-[13px]" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all">Any status</option>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </>
        }
      />
      <div className="px-6 pb-10">
        <Card>
          {isLoading ? (
            <div className="flex items-center gap-2 px-5 py-10 text-[13px] text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading leads…
            </div>
          ) : rows.length === 0 ? (
            <div className="grid place-items-center px-6 py-14 text-center">
              <span className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-[var(--surface)] text-muted-foreground">
                <Inbox className="h-5 w-5" />
              </span>
              <div className="mt-3 text-[14px] font-medium">
                {leads.length === 0 ? "No leads yet" : "No leads match these filters"}
              </div>
              <div className="mt-1 text-[12.5px] text-muted-foreground">
                {leads.length === 0
                  ? "Leads from your connected ad campaigns will land here automatically."
                  : "Try a different client or status."}
              </div>
            </div>
          ) : (
            <table className="w-full text-[13px]">
              <thead className="bg-[var(--surface-2)] text-left text-[11.5px] uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-4 py-2.5">Lead</th><th className="px-4 py-2.5">Client</th><th className="px-4 py-2.5">Campaign</th><th className="px-4 py-2.5">Source</th><th className="px-4 py-2.5">Status</th><th className="px-4 py-2.5">Submitted</th><th></th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((l) => (
                  <tr key={l.id} onClick={() => setSel(l)} className="cursor-pointer hover:bg-[var(--surface-2)]/60">
                    <td className="px-4 py-3">
                      <div className="font-medium">{l.name}</div>
                      <div className="text-[11.5px] text-muted-foreground">{l.phone}</div>
                    </td>
                    <td className="px-4 py-3">{l.client}</td>
                    <td className="px-4 py-3 text-muted-foreground">{l.campaign}</td>
                    <td className="px-4 py-3"><span className={l.source === "Meta Ads" ? "chip-indigo" : "chip"}>{l.source}</span></td>
                    <td className="px-4 py-3"><StatusBadge kind={l.status === "Won" ? "success" : l.status === "Lost" ? "danger" : l.status === "Booked" ? "indigo" : "neutral"}>{l.status}</StatusBadge></td>
                    <td className="px-4 py-3 text-muted-foreground">{l.submitted}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">→</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
      {sel && (
        <aside className="fixed inset-y-0 right-0 z-40 w-full max-w-md border-l border-border bg-background shadow-pop">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <div className="text-[14px] font-semibold">Lead details</div>
            <button onClick={() => setSel(null)} className="rounded-md p-1 text-muted-foreground hover:bg-[var(--surface-2)]"><X className="h-4 w-4" /></button>
          </div>
          <div className="space-y-5 p-5">
            <div>
              <div className="text-[20px] font-semibold tracking-tight">{sel.name}</div>
              <div className="mt-1 flex flex-wrap gap-2 text-[12.5px] text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" />{sel.phone}</span>
                <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" />{sel.email}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[["Client", sel.client], ["Campaign", sel.campaign], ["Source", sel.source], ["Status", sel.status], ["Submitted", sel.submitted]].map(([l, v]) => (
                <div key={l}><div className="text-[11px] text-muted-foreground">{l}</div><div className="text-[13px]">{v}</div></div>
              ))}
            </div>
            {sel.notes && (
              <div>
                <div className="text-[11px] text-muted-foreground">Notes</div>
                <div className="mt-1 rounded-lg border border-border bg-[var(--surface-2)] p-3 text-[13px]">{sel.notes}</div>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              <AIActionLink
                clientId={selectedClient?.id}
                mode="lead_followup"
                prompt={`Draft a practical follow-up message and next-step plan for ${sel.name}.`}
                context={[
                  `Lead: ${sel.name}`,
                  `Client: ${sel.client}`,
                  `Campaign: ${sel.campaign}`,
                  `Source: ${sel.source}`,
                  `Status: ${sel.status}`,
                  `Submitted: ${sel.submitted}`,
                  `Visible notes: ${sel.notes || "None"}`,
                ].join("\n")}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[var(--accent)]/30 bg-[var(--accent-soft)] px-3 text-[13px] font-medium text-[var(--accent)]"
              >
                Draft follow-up with AI
              </AIActionLink>
              {sel.phone && (
                <a href={`tel:${sel.phone}`} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-foreground px-3 text-[13px] font-medium text-background hover:opacity-90">
                  <Phone className="h-3.5 w-3.5" /> Call
                </a>
              )}
              {sel.email && (
                <a href={`mailto:${sel.email}`} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-[13px]">
                  <Mail className="h-3.5 w-3.5" /> Email
                </a>
              )}
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
