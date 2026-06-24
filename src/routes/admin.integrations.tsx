import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card } from "@/components/bits";
import { Activity, Clock } from "lucide-react";

export const Route = createFileRoute("/admin/integrations")({
  component: Integrations,
  head: () => ({ meta: [{ title: "Integrations — Orvio admin" }] }),
});

const providers = ["Meta Marketing API", "Google Ads API", "Stripe Connect", "Twilio SMS", "Postmark Email", "CallRail"];

function Integrations() {
  return (
    <>
      <PageHeader title="Integrations" sub="Platform health across third-party providers." />
      <div className="px-6 pb-10">
        <Card className="overflow-hidden">
          <div className="grid place-items-center px-6 py-14 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-2xl border border-border bg-[var(--surface)] text-[var(--accent)]">
              <Activity className="h-5 w-5" />
            </span>
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-[var(--surface-2)] px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
              <Clock className="h-3 w-3" /> Coming soon
            </div>
            <h2 className="mt-3 text-[20px] font-semibold tracking-tight">Live provider health</h2>
            <p className="mx-auto mt-1.5 max-w-md text-[13px] leading-relaxed text-muted-foreground">
              Real-time uptime and sync status for every provider Orvio depends on will live here. Until the monitoring pipeline is wired, we're not showing placeholder numbers.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {providers.map((p) => (
                <span key={p} className="rounded-full border border-border bg-background px-2.5 py-1 text-[11.5px] text-muted-foreground">{p}</span>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
