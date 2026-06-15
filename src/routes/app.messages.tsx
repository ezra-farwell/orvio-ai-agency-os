import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Card } from "@/components/bits";
import { clients } from "@/mock/data";
import { Send } from "lucide-react";

export const Route = createFileRoute("/app/messages")({
  component: Messages,
  head: () => ({ meta: [{ title: "Messages — Orvio" }] }),
});

const threads = clients.slice(0,5).map((c, i) => ({
  client: c.name,
  initials: c.initials,
  color: c.color,
  last: [
    "Sending the report shortly!",
    "Booked the appointment for Thursday.",
    "Approved the kitchen carousel.",
    "Can we scale Roof Replacement?",
    "Need to talk about budget.",
  ][i],
  time: ["2m","18m","1h","yesterday","2d"][i],
  unread: [2,0,1,0,3][i],
}));

const mockMessages = [
  { from: "client", body: "Hey, how's the campaign performing this week?", time: "Mon 9:14am" },
  { from: "us",     body: "Up 12% on leads, CPL down to $67. I'll send the full report shortly.", time: "Mon 9:21am" },
  { from: "client", body: "Awesome. Also — can we push the new offer to ads?", time: "Mon 9:24am" },
  { from: "us",     body: "Already drafted in the Studio. Sending it for approval now.", time: "Mon 9:28am" },
];

function Messages() {
  const [active, setActive] = useState(0);
  const t = threads[active];
  return (
    <>
      <PageHeader title="Messages" sub="SMS + email threads with each client and lead." />
      <div className="px-6 pb-10">
        <Card className="grid grid-cols-1 overflow-hidden md:grid-cols-[280px_1fr]">
          <div className="border-r border-border">
            <div className="border-b border-border px-3 py-2 text-[11px] uppercase tracking-wider text-muted-foreground">Inbox</div>
            <ul className="divide-y divide-border">
              {threads.map((th,i) => (
                <li key={th.client}>
                  <button onClick={()=>setActive(i)} className={`flex w-full items-start gap-2.5 px-3 py-3 text-left ${active===i?"bg-[var(--surface-2)]":""} hover:bg-[var(--surface-2)]/70`}>
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded text-[11px] font-semibold text-white" style={{ background: th.color }}>{th.initials}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="truncate text-[13px] font-medium">{th.client}</span>
                        <span className="text-[10.5px] text-muted-foreground">{th.time}</span>
                      </div>
                      <div className="truncate text-[12px] text-muted-foreground">{th.last}</div>
                    </div>
                    {th.unread > 0 && <span className="grid h-4 min-w-[16px] place-items-center rounded-full bg-[var(--accent)] px-1 text-[10px] font-semibold text-white">{th.unread}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex min-h-[500px] flex-col">
            <div className="border-b border-border px-5 py-3">
              <div className="text-[14px] font-semibold">{t.client}</div>
              <div className="text-[11.5px] text-muted-foreground">SMS · last active {t.time}</div>
            </div>
            <div className="flex-1 space-y-2 overflow-y-auto p-5">
              {mockMessages.map((m,i) => (
                <div key={i} className={`flex ${m.from==="us"?"justify-end":"justify-start"}`}>
                  <div className={`max-w-[70%] rounded-2xl px-3 py-2 text-[13px] ${m.from==="us"?"bg-foreground text-background":"bg-[var(--surface-2)]"}`}>
                    {m.body}
                    <div className="mt-1 text-[10px] opacity-60">{m.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 border-t border-border p-3">
              <input className="h-10 flex-1 rounded-lg border border-border bg-background px-3 text-[13px] outline-none focus:border-[var(--accent)]" placeholder={`Message ${t.client}…`} />
              <button className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-foreground px-3 text-[13px] font-medium text-background"><Send className="h-3.5 w-3.5" />Send</button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
