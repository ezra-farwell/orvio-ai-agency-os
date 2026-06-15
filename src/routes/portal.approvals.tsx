import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Card, StatusBadge } from "@/components/bits";
import { Check, X, MessageCircle, Sparkles } from "lucide-react";

export const Route = createFileRoute("/portal/approvals")({
  component: Approvals,
  head: () => ({ meta: [{ title: "Content approvals — Client portal" }] }),
});

type Asset = { id: string; title: string; kind: string; platform?: string; preview: string };
const initial: Asset[] = [
  { id: "a1", title: "Emergency dispatch — primary text v3", kind: "Meta ad", platform: "Meta Ads", preview: "Burst pipe at 11pm? Hartland Plumbing dispatches a licensed plumber to Detroit Metro homes in under 60 minutes — no overtime fees." },
  { id: "a2", title: "Drain cleaning — Google search ad", kind: "Google ad", platform: "Google Ads", preview: "Same-day drain cleaning. Licensed Detroit plumbers. No overtime fees, ever." },
  { id: "a3", title: "Spring email — water heater check", kind: "Email", preview: "Subject: Free water heater check (April only) — Hartland Plumbing has 14 free inspection slots open this month." },
];

function Approvals() {
  const [items, setItems] = useState<(Asset & { state: "pending"|"approved"|"changes" })[]>(
    initial.map(a => ({ ...a, state: "pending" as const }))
  );
  const groups = {
    pending: items.filter(i=>i.state==="pending"),
    approved: items.filter(i=>i.state==="approved"),
    changes: items.filter(i=>i.state==="changes"),
  };
  return (
    <>
      <PageHeader title="Content approvals" sub={`${groups.pending.length} waiting for you · ${groups.approved.length} approved · ${groups.changes.length} need changes`} />
      <div className="grid gap-4 px-6 pb-10 lg:grid-cols-3">
        <Column title="Pending your approval" count={groups.pending.length} tone="indigo">
          {groups.pending.map(a => (
            <Card key={a.id} className="p-4">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{a.kind}</div>
              <div className="mt-1 text-[14px] font-semibold">{a.title}</div>
              <div className="mt-3 rounded-lg border border-border bg-[var(--surface-2)]/70 p-3 text-[12.5px] leading-relaxed">{a.preview}</div>
              <div className="mt-3 flex gap-2">
                <button onClick={()=>setItems(s=>s.map(x=>x.id===a.id?{...x,state:"approved"}:x))} className="inline-flex h-9 flex-1 items-center justify-center gap-1 rounded-lg bg-[var(--success)] text-[13px] font-medium text-white"><Check className="h-3.5 w-3.5" />Approve</button>
                <button onClick={()=>setItems(s=>s.map(x=>x.id===a.id?{...x,state:"changes"}:x))} className="inline-flex h-9 flex-1 items-center justify-center gap-1 rounded-lg border border-border bg-background text-[13px] font-medium"><MessageCircle className="h-3.5 w-3.5" />Request changes</button>
              </div>
            </Card>
          ))}
          {groups.pending.length===0 && <Empty>Nothing to review.</Empty>}
        </Column>

        <Column title="Approved" count={groups.approved.length} tone="success">
          {groups.approved.map(a => (
            <Card key={a.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-[14px] font-semibold">{a.title}</div>
                <StatusBadge kind="success"><Check className="h-3 w-3" />Approved</StatusBadge>
              </div>
              <div className="mt-1 text-[11.5px] text-muted-foreground">{a.kind} · pushed live by your agency</div>
            </Card>
          ))}
          {groups.approved.length===0 && <Empty>Approve something to see it here.</Empty>}
        </Column>

        <Column title="Requested changes" count={groups.changes.length} tone="warning">
          {groups.changes.map(a => (
            <Card key={a.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-[14px] font-semibold">{a.title}</div>
                <StatusBadge kind="warning"><X className="h-3 w-3" />Changes</StatusBadge>
              </div>
              <textarea rows={2} placeholder="What needs to change?" className="mt-3 w-full rounded-md border border-border bg-background p-2 text-[12.5px] outline-none focus:border-[var(--accent)]" />
              <button className="mt-2 inline-flex h-8 items-center gap-1.5 rounded-md bg-foreground px-2.5 text-[12px] font-medium text-background"><Sparkles className="h-3 w-3" />Send feedback</button>
            </Card>
          ))}
          {groups.changes.length===0 && <Empty>No pending change requests.</Empty>}
        </Column>
      </div>
    </>
  );
}

function Column({ title, count, tone, children }: { title: string; count: number; tone: "indigo"|"success"|"warning"; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="text-[13px] font-semibold">{title}</div>
        <StatusBadge kind={tone}>{count}</StatusBadge>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
function Empty({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-dashed border-border bg-background p-6 text-center text-[12.5px] text-muted-foreground">{children}</div>;
}
