import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card, StatusBadge } from "@/components/bits";
import { leads, currentClient } from "@/mock/data";
import { Phone, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/portal/leads")({
  component: PortalLeads,
  head: () => ({ meta: [{ title: "Leads — Client portal" }] }),
});

function PortalLeads() {
  const mine = leads.filter(l => l.client === currentClient.name);
  return (
    <>
      <PageHeader title="Your leads" sub={`${mine.length} leads from your ads — last 30 days`} />
      <div className="px-6 pb-10">
        <Card>
          <table className="w-full text-[13px]">
            <thead className="bg-[var(--surface-2)] text-left text-[11.5px] uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-4 py-2">Name</th><th className="px-4 py-2">Phone</th><th className="px-4 py-2">From</th><th className="px-4 py-2">Submitted</th><th className="px-4 py-2">Status</th><th className="px-4 py-2"></th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mine.map(l => (
                <tr key={l.id} className="hover:bg-[var(--surface-2)]/60">
                  <td className="px-4 py-3"><div className="font-medium">{l.name}</div><div className="text-[11.5px] text-muted-foreground">{l.notes}</div></td>
                  <td className="px-4 py-3 mono">{l.phone}</td>
                  <td className="px-4 py-3 text-muted-foreground">{l.campaign}</td>
                  <td className="px-4 py-3 text-muted-foreground">{l.submitted}</td>
                  <td className="px-4 py-3"><StatusBadge kind={l.status==="Won"?"success":l.status==="Lost"?"danger":l.status==="Booked"?"indigo":"neutral"}>{l.status}</StatusBadge></td>
                  <td className="px-4 py-3"><div className="flex justify-end gap-1.5">
                    <a href={`tel:${l.phone}`} className="grid h-8 w-8 place-items-center rounded-md border border-border bg-background text-muted-foreground hover:text-foreground"><Phone className="h-3.5 w-3.5" /></a>
                    <a href={`sms:${l.phone}`} className="grid h-8 w-8 place-items-center rounded-md border border-border bg-background text-muted-foreground hover:text-foreground"><MessageSquare className="h-3.5 w-3.5" /></a>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </>
  );
}
