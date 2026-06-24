import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card } from "@/components/bits";
import { MessageSquare, Mail, Phone, Clock } from "lucide-react";

export const Route = createFileRoute("/app/messages")({
  component: Messages,
  head: () => ({ meta: [{ title: "Messages — Orvio" }] }),
});

const upcoming = [
  { icon: MessageSquare, title: "Two-way SMS", desc: "Text leads and clients from your agency number, with full thread history." },
  { icon: Mail, title: "Email threads", desc: "Unified inbox for client and lead email, tied to the right account." },
  { icon: Phone, title: "Call logging", desc: "Missed-call alerts and follow-up reminders, synced to each lead." },
];

function Messages() {
  return (
    <>
      <PageHeader title="Messages" sub="Unified SMS + email with every client and lead." />
      <div className="px-6 pb-10">
        <Card className="overflow-hidden">
          <div className="grid place-items-center px-6 py-14 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-2xl border border-border bg-[var(--surface)] text-[var(--accent)]">
              <MessageSquare className="h-5 w-5" />
            </span>
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-[var(--surface-2)] px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
              <Clock className="h-3 w-3" /> Coming soon
            </div>
            <h2 className="mt-3 text-[20px] font-semibold tracking-tight">Messaging is on the way</h2>
            <p className="mx-auto mt-1.5 max-w-md text-[13px] leading-relaxed text-muted-foreground">
              Soon you'll handle every client and lead conversation from here — no
              more juggling your phone and five inboxes. Here's what's landing:
            </p>
            <div className="mt-7 grid w-full max-w-2xl gap-3 sm:grid-cols-3">
              {upcoming.map((u) => {
                const Icon = u.icon;
                return (
                  <div key={u.title} className="rounded-xl border border-border bg-background p-4 text-left">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="mt-2.5 text-[13px] font-medium">{u.title}</div>
                    <div className="mt-0.5 text-[11.5px] leading-relaxed text-muted-foreground">{u.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
