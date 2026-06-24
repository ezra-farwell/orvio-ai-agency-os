import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card } from "@/components/bits";
import { MessageSquare, Clock } from "lucide-react";

export const Route = createFileRoute("/portal/messages")({
  component: PortalMessages,
  head: () => ({ meta: [{ title: "Messages — Client portal" }] }),
});

function PortalMessages() {
  return (
    <>
      <PageHeader title="Messages" sub="Talk to your agency directly." />
      <div className="px-6 pb-10">
        <Card className="overflow-hidden">
          <div className="grid place-items-center px-6 py-16 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-2xl border border-border bg-[var(--surface)] text-[var(--accent)]">
              <MessageSquare className="h-5 w-5" />
            </span>
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-[var(--surface-2)] px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
              <Clock className="h-3 w-3" /> Coming soon
            </div>
            <h2 className="mt-3 text-[20px] font-semibold tracking-tight">Messaging is on the way</h2>
            <p className="mx-auto mt-1.5 max-w-md text-[13px] leading-relaxed text-muted-foreground">
              Soon you'll be able to message your agency directly here. In the
              meantime, reach out using the contact details they shared with you.
            </p>
          </div>
        </Card>
      </div>
    </>
  );
}
