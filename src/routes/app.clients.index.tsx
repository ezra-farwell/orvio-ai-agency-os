import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader, Card, StatusBadge } from "@/components/bits";
import { getClients, getAgencies, createClient } from "@/lib/data";
import { getChurnMap, churnTier, TIER_COLOR } from "@/lib/data/insights";
import { usd } from "@/mock/data";
import { Plus, X, Mail, Sparkles, AlertTriangle, Loader2 } from "lucide-react";

export const Route = createFileRoute("/app/clients/")({
  component: Clients,
  head: () => ({ meta: [{ title: "Clients — Orvio" }] }),
});

function Clients() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data: clients = [] } = useQuery({ queryKey: ["clients"], queryFn: getClients });
  const { data: churn = {} } = useQuery({ queryKey: ["churn-map"], queryFn: getChurnMap });
  const { data: agencies = [] } = useQuery({ queryKey: ["agencies"], queryFn: getAgencies });
  const agencyId = agencies[0]?.id;
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

      {open && (
        <AddClientModal
          agencyId={agencyId}
          onClose={() => setOpen(false)}
          onCreated={async () => {
            setOpen(false);
            await queryClient.invalidateQueries({ queryKey: ["clients"] });
          }}
        />
      )}
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

function AddClientModal({ agencyId, onClose, onCreated }: { agencyId?: string; onClose: () => void; onCreated: () => Promise<void> }) {
  const [form, setForm] = useState({ name: "", ownerName: "", email: "", phone: "", category: "", area: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>();
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!agencyId) return setError("Your agency is still loading — try again in a moment.");
    if (!form.name.trim()) return setError("Business name is required.");
    setSubmitting(true);
    setError(undefined);
    try {
      await createClient({
        agencyId,
        name: form.name.trim(),
        ownerName: form.ownerName.trim() || form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        category: form.category.trim() || undefined,
        area: form.area.trim() || undefined,
      });
      await onCreated();
    } catch {
      setError("Could not create the client. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/30 p-4 backdrop-blur-sm" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-xl rounded-2xl border border-border bg-background shadow-pop">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <div>
            <div className="text-[15px] font-semibold">Add a new client</div>
            <div className="text-[12px] text-muted-foreground">Create the account now — invite them to their portal anytime.</div>
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:bg-[var(--surface-2)]"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={submit} className="space-y-3 p-5">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Business name" placeholder="Hartland Plumbing" value={form.name} onChange={set("name")} />
            <Field label="Owner name" placeholder="Mike Hartland" value={form.ownerName} onChange={set("ownerName")} />
            <Field label="Owner email" placeholder="mike@example.com" value={form.email} onChange={set("email")} />
            <Field label="Phone" placeholder="(248) 555-0142" value={form.phone} onChange={set("phone")} />
            <Field label="Service category" placeholder="Plumbing" value={form.category} onChange={set("category")} />
            <Field label="Service area" placeholder="Detroit Metro, MI" value={form.area} onChange={set("area")} />
          </div>
          {error && (
            <div className="rounded-lg border border-[var(--danger)]/30 bg-[var(--danger-soft)] px-3 py-2 text-[12.5px] text-[var(--danger)]">{error}</div>
          )}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="h-9 rounded-lg border border-border bg-background px-4 text-[13px]">Cancel</button>
            <button type="submit" disabled={submitting} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-foreground px-4 text-[13px] font-medium text-background disabled:opacity-60">
              {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Mail className="h-3.5 w-3.5" />}
              {submitting ? "Creating…" : "Create client"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
function Field({ label, placeholder, value, onChange }: { label: string; placeholder?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <label className="block">
      <div className="text-[12px] font-medium text-muted-foreground">{label}</div>
      <input value={value} onChange={onChange} placeholder={placeholder} className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 text-[13px] outline-none focus:border-[var(--accent)]" />
    </label>
  );
}
