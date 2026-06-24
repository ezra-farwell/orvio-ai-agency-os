import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader, Card, StatusBadge } from "@/components/bits";
import { getClients } from "@/lib/data";
import { usd } from "@/mock/data";
import { AIActionLink } from "@/components/orvio/AIActionMenu";
import { Sparkles, Loader2, FileText } from "lucide-react";

export const Route = createFileRoute("/app/reports")({
  component: Reports,
  head: () => ({ meta: [{ title: "Reports — Orvio" }] }),
});

const thisMonth = new Date().toLocaleDateString([], { month: "long", year: "numeric" });

function Reports() {
  const { data: clients = [], isLoading } = useQuery({ queryKey: ["clients"], queryFn: getClients });

  return (
    <>
      <PageHeader
        title="Reports"
        sub="One-click monthly client reports — plain English, written by Orvio AI."
        actions={
          <AIActionLink
            mode="report_summary"
            prompt="Help me build a repeatable monthly client report template."
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-foreground px-3 text-[13px] font-medium text-background hover:opacity-90"
          >
            <Sparkles className="h-3.5 w-3.5" /> Report templates
          </AIActionLink>
        }
      />
      <div className="px-6 pb-10">
        {isLoading ? (
          <div className="flex items-center gap-2 px-1 py-10 text-[13px] text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading clients…
          </div>
        ) : clients.length === 0 ? (
          <div className="grid place-items-center rounded-2xl border border-dashed border-border px-6 py-16 text-center">
            <span className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-[var(--surface)] text-muted-foreground">
              <FileText className="h-5 w-5" />
            </span>
            <div className="mt-3 text-[14px] font-medium">No clients to report on yet</div>
            <div className="mt-1 text-[12.5px] text-muted-foreground">Add a client and reports become available here.</div>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {clients.map((c) => (
              <Card key={c.id} className="p-5">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-8 w-8 place-items-center rounded text-[12px] font-semibold text-white" style={{ background: c.color }}>{c.initials}</span>
                  <div className="flex-1">
                    <div className="text-[14px] font-semibold">{c.name}</div>
                    <div className="text-[11.5px] text-muted-foreground">Monthly performance · {thisMonth}</div>
                  </div>
                  <StatusBadge kind="neutral">Not generated</StatusBadge>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <Stat label="Spend" v={usd(c.monthlySpend)} />
                  <Stat label="Leads" v={String(c.leads)} />
                  <Stat label="CPL" v={`$${c.cpl.toFixed(2)}`} />
                </div>
                <div className="mt-3 rounded-lg border border-border bg-[var(--surface-2)]/60 p-3 text-[12.5px] leading-relaxed text-muted-foreground">
                  Generate a plain-English monthly summary for {c.name} — wins, risks,
                  and what to do next — written from this client's real numbers.
                </div>
                <div className="mt-3 flex justify-end">
                  <AIActionLink
                    clientId={c.id}
                    mode="report_summary"
                    prompt={`Write a clear, client-ready monthly performance report for ${c.name}.`}
                    context={[
                      `Client: ${c.name}`,
                      `Monthly spend: ${usd(c.monthlySpend)}`,
                      `Leads: ${c.leads}`,
                      `CPL: $${c.cpl.toFixed(2)}`,
                      `Status: ${c.status}`,
                    ].join("\n")}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-foreground px-3 text-[13px] font-medium text-background hover:opacity-90"
                  >
                    <Sparkles className="h-3.5 w-3.5" /> Generate with AI
                  </AIActionLink>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function Stat({ label, v }: { label: string; v: string }) {
  return (
    <div className="rounded-lg border border-border bg-background p-2.5">
      <div className="text-[10.5px] text-muted-foreground">{label}</div>
      <div className="mono mt-0.5 text-[15px] font-semibold">{v}</div>
    </div>
  );
}
