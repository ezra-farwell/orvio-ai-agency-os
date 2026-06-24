import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader, Card } from "@/components/bits";
import { getProfile } from "@/lib/auth";
import { getClients, getClient } from "@/lib/data";
import { getClientInsights } from "@/lib/data/insights";
import { usd } from "@/mock/data";
import { FileText, Loader2 } from "lucide-react";

export const Route = createFileRoute("/portal/reports")({
  component: Reports,
  head: () => ({ meta: [{ title: "Reports — Client portal" }] }),
});

const thisMonth = new Date().toLocaleDateString([], { month: "long", year: "numeric" });

function Reports() {
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: getProfile });
  const { data: clients = [] } = useQuery({ queryKey: ["clients"], queryFn: getClients, enabled: !!profile && !profile.client_id });
  const clientId = profile?.client_id ?? clients[0]?.id;
  const { data: client } = useQuery({ queryKey: ["client", clientId], queryFn: () => getClient(clientId!), enabled: !!clientId });
  const { data: insights = {}, isLoading } = useQuery({ queryKey: ["client-insights", clientId], queryFn: () => getClientInsights(clientId!), enabled: !!clientId });

  const report = insights.client_report;
  const summary = insights.analytics_summary;

  return (
    <>
      <PageHeader title="Monthly reports" sub="Performance summaries from your agency, in plain English." />
      <div className="grid gap-4 px-6 pb-10">
        {isLoading ? (
          <div className="flex items-center gap-2 py-12 text-[13px] text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading your reports…
          </div>
        ) : !report && !summary ? (
          <div className="grid place-items-center rounded-2xl border border-dashed border-border px-6 py-16 text-center">
            <span className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-[var(--surface)] text-muted-foreground">
              <FileText className="h-5 w-5" />
            </span>
            <div className="mt-3 text-[14px] font-medium">No reports yet</div>
            <div className="mt-1 max-w-sm text-[12.5px] text-muted-foreground">
              Your first monthly summary will appear here once your agency generates it — written in plain English, no jargon.
            </div>
          </div>
        ) : (
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div className="text-[15px] font-semibold">{thisMonth}</div>
              <span className="chip-indigo">Latest</span>
            </div>
            {client && (
              <div className="mt-4 grid gap-2 md:grid-cols-3">
                {[["Spend", usd(client.monthlySpend)], ["Leads", String(client.leads)], ["CPL", `$${client.cpl.toFixed(2)}`]].map(([l, v]) => (
                  <div key={l} className="rounded-lg border border-border bg-[var(--surface-2)]/60 p-3">
                    <div className="text-[10.5px] uppercase tracking-wider text-muted-foreground">{l}</div>
                    <div className="mt-0.5 text-[14px] font-semibold">{v}</div>
                  </div>
                ))}
              </div>
            )}
            <p className="mt-4 whitespace-pre-line text-[13px] leading-relaxed text-foreground/90">
              {report?.body ?? summary?.body}
            </p>
          </Card>
        )}
      </div>
    </>
  );
}
