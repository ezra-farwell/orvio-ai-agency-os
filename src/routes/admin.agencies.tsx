import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader, Card, StatusBadge } from "@/components/bits";
import { getAgencies } from "@/lib/data";
import { usd } from "@/mock/data";
import { Loader2, Building2 } from "lucide-react";

export const Route = createFileRoute("/admin/agencies")({
  component: AgenciesList,
  head: () => ({ meta: [{ title: "Agencies — Orvio admin" }] }),
});

function AgenciesList() {
  const { data: agencies = [], isLoading } = useQuery({ queryKey: ["agencies"], queryFn: getAgencies });

  return (
    <>
      <PageHeader title="Agencies" sub={isLoading ? "Loading…" : `${agencies.length} accounts`} />
      <div className="px-6 pb-10">
        <Card>
          {isLoading ? (
            <div className="flex items-center gap-2 px-5 py-10 text-[13px] text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading agencies…
            </div>
          ) : agencies.length === 0 ? (
            <div className="grid place-items-center px-6 py-14 text-center">
              <span className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-[var(--surface)] text-muted-foreground">
                <Building2 className="h-5 w-5" />
              </span>
              <div className="mt-3 text-[14px] font-medium">No agencies yet</div>
              <div className="mt-1 text-[12.5px] text-muted-foreground">Agencies appear here as they sign up.</div>
            </div>
          ) : (
            <table className="w-full text-[13px]">
              <thead className="bg-[var(--surface-2)] text-left text-[11.5px] uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-4 py-2">Agency</th><th className="px-4 py-2">Plan</th><th className="px-4 py-2">Clients</th><th className="px-4 py-2">MRR</th><th className="px-4 py-2">Spend tracked</th><th className="px-4 py-2">Domain</th><th className="px-4 py-2">Integrations</th><th className="px-4 py-2">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {agencies.map((a) => (
                  <tr key={a.id} className="hover:bg-[var(--surface-2)]/60">
                    <td className="px-4 py-3"><Link to="/admin/agencies/$id" params={{ id: a.id }} className="font-medium hover:underline">{a.name}</Link><div className="text-[11px] text-muted-foreground">{a.owner}</div></td>
                    <td className="px-4 py-3">{a.plan}</td>
                    <td className="px-4 py-3">{a.clients}</td>
                    <td className="px-4 py-3 mono">{usd(a.mrr)}</td>
                    <td className="px-4 py-3 mono">{usd(a.spend)}</td>
                    <td className="px-4 py-3 mono text-muted-foreground">{a.domain || "—"}</td>
                    <td className="px-4 py-3"><div className="flex gap-1">
                      <H label="M" state={a.meta} />
                      <H label="G" state={a.google} />
                      <H label="$" state={a.stripe} />
                    </div></td>
                    <td className="px-4 py-3"><StatusBadge kind={a.status === "Active" ? "success" : a.status === "Trial" ? "indigo" : a.status === "Past Due" || a.status === "Churn Risk" ? "danger" : "neutral"}>{a.status}</StatusBadge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </>
  );
}

function H({ label, state }: { label: string; state: "OK" | "Warning" | "Down" | "Off" }) {
  const color = state === "OK" ? "var(--success)" : state === "Warning" ? "var(--warning)" : state === "Off" ? "var(--text-faint)" : "var(--danger)";
  return <span className="inline-flex h-5 w-5 items-center justify-center rounded text-[10px] font-semibold text-white" style={{ background: color }} title={state}>{label}</span>;
}
