import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader, Card, StatusBadge } from "@/components/bits";
import { getProfile } from "@/lib/auth";
import { getClients, getClient, getLeads } from "@/lib/data";
import { Phone, MessageSquare, Loader2, Inbox } from "lucide-react";

export const Route = createFileRoute("/portal/leads")({
  component: PortalLeads,
  head: () => ({ meta: [{ title: "Leads — Client portal" }] }),
});

function PortalLeads() {
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: getProfile });
  const { data: clients = [] } = useQuery({ queryKey: ["clients"], queryFn: getClients, enabled: !!profile && !profile.client_id });
  const clientId = profile?.client_id ?? clients[0]?.id;
  const { data: client } = useQuery({ queryKey: ["client", clientId], queryFn: () => getClient(clientId!), enabled: !!clientId });
  const { data: allLeads = [], isLoading } = useQuery({ queryKey: ["leads"], queryFn: getLeads, enabled: !!clientId });

  const mine = client ? allLeads.filter((l) => l.client === client.name) : [];

  return (
    <>
      <PageHeader title="Your leads" sub={isLoading ? "Loading…" : `${mine.length} leads from your ads — last 30 days`} />
      <div className="px-6 pb-10">
        <Card>
          {isLoading ? (
            <div className="flex items-center gap-2 px-5 py-10 text-[13px] text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading your leads…
            </div>
          ) : mine.length === 0 ? (
            <div className="grid place-items-center px-6 py-14 text-center">
              <span className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-[var(--surface)] text-muted-foreground">
                <Inbox className="h-5 w-5" />
              </span>
              <div className="mt-3 text-[14px] font-medium">No leads yet this month</div>
              <div className="mt-1 text-[12.5px] text-muted-foreground">New leads from your ads will appear here the moment they come in.</div>
            </div>
          ) : (
            <table className="w-full text-[13px]">
              <thead className="bg-[var(--surface-2)] text-left text-[11.5px] uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-4 py-2">Name</th><th className="px-4 py-2">Phone</th><th className="px-4 py-2">From</th><th className="px-4 py-2">Submitted</th><th className="px-4 py-2">Status</th><th className="px-4 py-2"></th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mine.map((l) => (
                  <tr key={l.id} className="hover:bg-[var(--surface-2)]/60">
                    <td className="px-4 py-3"><div className="font-medium">{l.name}</div>{l.notes && <div className="text-[11.5px] text-muted-foreground">{l.notes}</div>}</td>
                    <td className="px-4 py-3 mono">{l.phone}</td>
                    <td className="px-4 py-3 text-muted-foreground">{l.campaign}</td>
                    <td className="px-4 py-3 text-muted-foreground">{l.submitted}</td>
                    <td className="px-4 py-3"><StatusBadge kind={l.status === "Won" ? "success" : l.status === "Lost" ? "danger" : l.status === "Booked" ? "indigo" : "neutral"}>{l.status}</StatusBadge></td>
                    <td className="px-4 py-3"><div className="flex justify-end gap-1.5">
                      {l.phone && <a href={`tel:${l.phone}`} className="grid h-8 w-8 place-items-center rounded-md border border-border bg-background text-muted-foreground hover:text-foreground"><Phone className="h-3.5 w-3.5" /></a>}
                      {l.phone && <a href={`sms:${l.phone}`} className="grid h-8 w-8 place-items-center rounded-md border border-border bg-background text-muted-foreground hover:text-foreground"><MessageSquare className="h-3.5 w-3.5" /></a>}
                    </div></td>
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
