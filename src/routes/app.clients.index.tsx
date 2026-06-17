import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader, Card, StatusBadge } from "@/components/bits";
import { getClients } from "@/lib/data";
import { getChurnMap, churnTier, TIER_COLOR } from "@/lib/data/insights";
import { usd } from "@/mock/data";
import { Plus, X, Mail, Phone, Sparkles, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/app/clients/")({
  component: Clients,
  head: () => ({ meta: [{ title: "Clients — Orvio" }] }),
});

function Clients() {
  const [open, setOpen] = useState(false);
  const { data: clients = [] } = useQuery({ queryKey: ["clients"], queryFn: getClients });
  const { data: churn = {} } = useQuery({ queryKey: ["churn-map"], queryFn: getChurnMap });
  return (
    <>
      <PageHeader title="Clients" sub={`${clients.length} accounts · ${clients.filter(c=>c.status==="active").length} active`}
        actions={<button onClick={() => setOpen(true)} className="inline-flex h-9 items-center gap-1 rounded-lg bg-foreground px-3 text-[13px] font-medium text-background hover:bg-foreground/90"><Plus className="h-3.5 w-3.5" /> Add client</button>}
      />
      <div className="space-y-3 px-6 pb-10">
        <div className="flex items-start gap-2 rounded-lg border border-dashed border-border bg-[var(--surface-2)]/40 px-3 py-2.5 text-[12px] text-muted-foreground">
          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">i</span>
          <span><span className="font-semibold text-foreground">Health score</span> combines lead volume (40%), CPL stability (35%) and client engagement (25%). Scores below 70 trigger an at-risk flag.</span>
        </div>
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-[13px]">
              <thead className="bg-[var(--surface-2)] text-left text-[11.5px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5">Client</th>
                  <th className="px-4 py-2.5">Category</th>
                  <th className="px-4 py-2.5">Service area</th>
                  <th className="px-4 py-2.5">Spend</th>
                  <th className="px-4 py-2.5">Leads</th>
                  <th className="px-4 py-2.5">CPL</th>
                  <th className="px-4 py-2.5">Integrations</th>
                  <th className="px-4 py-2.5">Health</th>
                  <th className="px-4 py-2.5">Orvio AI</th>
                  <th className="px-4 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {clients.map(c => {
                  const ins = churn[c.id];
                  const tier = churnTier(ins);
                  const health = ins?.score != null
                    ? Math.max(0, Math.min(100, 100 - Math.round(Number(ins.score))))
                    : c.status === "at-risk" ? 62 : c.status === "onboarding" ? 78 : Math.round(78 + ((c.leads % 17) * 1.2));
                  return (
                  <tr key={c.id} className="hover:bg-[var(--surface-2)]/60">
                    <td className="px-4 py-3">
                      <Link to="/app/clients/$id" params={{ id: c.id }} className="flex items-center gap-2.5">
                        <span className="grid h-7 w-7 place-items-center rounded text-[11px] font-semibold text-white" style={{ background: c.color }}>{c.initials}</span>
                        <div>
                          <div className="font-medium">{c.name}</div>
                          <div className="text-[11.5px] text-muted-foreground">{c.owner}</div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-3">{c.category}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.area}</td>
                    <td className="px-4 py-3 mono">{usd(c.monthlySpend)}</td>
                    <td className="px-4 py-3">{c.leads}</td>
                    <td className="px-4 py-3 mono">${c.cpl.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <IntChip label="M" state={c.meta} title="Meta Ads" />
                        <IntChip label="G" state={c.google} title="Google Ads" />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <HealthBar score={health} />
                    </td>
                    <td className="px-4 py-3">
                      {ins ? (
                        <span title={ins.body ?? ""} className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ color: TIER_COLOR[tier], background: `color-mix(in oklab, ${TIER_COLOR[tier]} 14%, transparent)` }}>
                          {tier === "low" ? <Sparkles className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                          {tier === "low" ? "Healthy" : `Churn ${Math.round(Number(ins.score))}`}
                        </span>
                      ) : (
                        <span className="text-[11.5px] text-[var(--text-faint)]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {c.status === "active" && <StatusBadge kind="success">Active</StatusBadge>}
                      {c.status === "at-risk" && <StatusBadge kind="warning">At risk</StatusBadge>}
                      {c.status === "onboarding" && <StatusBadge kind="indigo">Onboarding</StatusBadge>}
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {open && <AddClientModal onClose={() => setOpen(false)} />}
    </>
  );
}

function HealthBar({ score }: { score: number }) {
  const tone = score >= 80 ? "var(--success)" : score >= 70 ? "var(--accent)" : "var(--warning)";
  return (
    <div title={`Health ${score}/100 — lead volume (40%), CPL stability (35%), engagement (25%)`} className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[var(--surface-2)]">
        <div className="h-full rounded-full" style={{ width: `${score}%`, background: tone }} />
      </div>
      <span className="mono text-[12px] font-semibold" style={{ color: tone }}>{score}</span>
    </div>
  );
}

function IntChip({ label, state, title }: { label: string; state: "connected" | "warning" | "disconnected"; title: string }) {
  const color = state === "connected" ? "var(--success)" : state === "warning" ? "var(--warning)" : "var(--danger)";
  return (
    <span title={`${title} · ${state}`} className="inline-flex h-5 w-5 items-center justify-center rounded text-[10px] font-semibold text-white" style={{ background: color }}>{label}</span>
  );
}

function AddClientModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/30 p-4 backdrop-blur-sm" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-xl rounded-2xl border border-border bg-background shadow-pop">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <div>
            <div className="text-[15px] font-semibold">Add a new client</div>
            <div className="text-[12px] text-muted-foreground">They'll receive a portal invite by email.</div>
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:bg-[var(--surface-2)]"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={e => { e.preventDefault(); onClose(); }} className="space-y-3 p-5">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Business name" placeholder="Hartland Plumbing" />
            <Field label="Owner name" placeholder="Mike Hartland" />
            <Field label="Owner email" placeholder="mike@example.com" />
            <Field label="Phone" placeholder="(248) 555-0142" />
            <Field label="Service category" placeholder="Plumbing" />
            <Field label="Service area" placeholder="Detroit Metro, MI" />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <Select label="Meta ad account" options={["Connect after invite","Connect now"]} />
            <Select label="Google ad account" options={["Connect after invite","Connect now"]} />
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-[var(--surface-2)] px-3 py-2.5">
            <input type="checkbox" defaultChecked id="wl" className="h-4 w-4 accent-[var(--accent)]" />
            <label htmlFor="wl" className="text-[13px]">Enable white-label branding for this client</label>
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="h-9 rounded-lg border border-border bg-background px-4 text-[13px]">Cancel</button>
            <button type="submit" className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-foreground px-4 text-[13px] font-medium text-background"><Mail className="h-3.5 w-3.5" />Send invite</button>
          </div>
        </form>
      </div>
    </div>
  );
}
function Field({ label, placeholder }: { label: string; placeholder?: string }) {
  return (
    <label className="block">
      <div className="text-[12px] font-medium text-muted-foreground">{label}</div>
      <input placeholder={placeholder} className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 text-[13px] outline-none focus:border-[var(--accent)]" />
    </label>
  );
}
function Select({ label, options }: { label: string; options: string[] }) {
  return (
    <label className="block">
      <div className="text-[12px] font-medium text-muted-foreground">{label}</div>
      <select className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 text-[13px]">{options.map(o => <option key={o}>{o}</option>)}</select>
    </label>
  );
}
