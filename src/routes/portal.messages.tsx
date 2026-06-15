import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card } from "@/components/bits";
import { Send } from "lucide-react";

export const Route = createFileRoute("/portal/messages")({
  component: PortalMessages,
  head: () => ({ meta: [{ title: "Messages — Client portal" }] }),
});

const conv = [
  { from: "agency", body: "Hey Mike — sending over the April report shortly. Quick highlight: CPL dropped 4% this month.", time: "Mon 9:14am" },
  { from: "you",    body: "Awesome. Are you still planning to scale Roof Replacement?", time: "Mon 9:24am" },
  { from: "agency", body: "Yep — scaling +20% this week and refreshing creative. I'll drop new ads in your Approvals tab Thursday.", time: "Mon 9:28am" },
  { from: "agency", body: "By the way — last week we hit 18 booked calls. Best week so far this year.", time: "Tue 8:02am" },
];

function PortalMessages() {
  return (
    <>
      <PageHeader title="Messages" sub="Talk to your agency directly." />
      <div className="px-6 pb-10">
        <Card className="overflow-hidden">
          <div className="border-b border-border px-5 py-3"><div className="text-[14px] font-semibold">Northstar Growth Co.</div><div className="text-[11.5px] text-muted-foreground">Avery Sloan · Account lead</div></div>
          <div className="space-y-2 p-5">
            {conv.map((m,i) => (
              <div key={i} className={`flex ${m.from==="you"?"justify-end":"justify-start"}`}>
                <div className={`max-w-[70%] rounded-2xl px-3 py-2 text-[13px] ${m.from==="you"?"bg-foreground text-background":"bg-[var(--surface-2)]"}`}>
                  {m.body}<div className="mt-1 text-[10px] opacity-60">{m.time}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 border-t border-border p-3">
            <input className="h-10 flex-1 rounded-lg border border-border bg-background px-3 text-[13px] outline-none focus:border-[var(--accent)]" placeholder="Reply to your agency…" />
            <button className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-foreground px-3 text-[13px] font-medium text-background"><Send className="h-3.5 w-3.5" />Send</button>
          </div>
        </Card>
      </div>
    </>
  );
}
