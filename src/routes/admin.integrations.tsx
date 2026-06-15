import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card, StatusBadge } from "@/components/bits";

export const Route = createFileRoute("/admin/integrations")({
  component: Integrations,
  head: () => ({ meta: [{ title: "Integrations — Orvio admin" }] }),
});

const ints = [
  ["Meta Marketing API","Healthy","Last sync 2m ago","success"],
  ["Google Ads API","Healthy","Last sync 4m ago","success"],
  ["Stripe Connect","Healthy","All payouts cleared","success"],
  ["Twilio SMS","Degraded","Elevated latency on US-East","warning"],
  ["Postmark Email","Healthy","99.98% delivery 24h","success"],
  ["CallRail","Down","API returning 503 since 11:02 UTC","danger"],
] as const;

function Integrations() {
  return (
    <>
      <PageHeader title="Integrations" sub="Platform health across third-party providers." />
      <div className="grid gap-3 px-6 pb-10 md:grid-cols-2">
        {ints.map(([name,state,note,kind]) => (
          <Card key={name as string} className="p-5">
            <div className="flex items-center justify-between">
              <div className="text-[14px] font-semibold">{name}</div>
              <StatusBadge kind={kind as any}>{state}</StatusBadge>
            </div>
            <div className="mt-1 text-[12.5px] text-muted-foreground">{note}</div>
          </Card>
        ))}
      </div>
    </>
  );
}
