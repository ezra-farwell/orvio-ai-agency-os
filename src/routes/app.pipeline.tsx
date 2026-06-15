import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card } from "@/components/bits";
import { leads, type Lead } from "@/mock/data";

export const Route = createFileRoute("/app/pipeline")({
  component: Pipeline,
  head: () => ({ meta: [{ title: "Pipeline — Orvio" }] }),
});

const COLS: Lead["status"][] = ["New","Contacted","Booked","Estimate Sent","Won","Lost"];
const TONE: Record<Lead["status"], string> = {
  New: "bg-[var(--accent-soft)] text-[var(--accent)]",
  Contacted: "bg-[var(--surface-2)] text-foreground",
  Booked: "bg-[var(--accent-soft)] text-[var(--accent)]",
  "Estimate Sent": "bg-[var(--warning-soft)] text-[#B45309]",
  Won: "bg-[var(--success-soft)] text-[var(--success)]",
  Lost: "bg-[var(--danger-soft)] text-[var(--danger)]",
};

function Pipeline() {
  return (
    <>
      <PageHeader title="Pipeline" sub="Lead stages across every client." />
      <div className="px-6 pb-10">
        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          {COLS.map(s => {
            const items = leads.filter(l => l.status === s);
            return (
              <div key={s} className="flex min-h-[400px] flex-col rounded-2xl border border-border bg-[var(--surface-2)]/50 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11.5px] font-semibold ${TONE[s]}`}>
                    {s} <span className="opacity-60">{items.length}</span>
                  </span>
                </div>
                <div className="flex-1 space-y-2 overflow-y-auto">
                  {items.map(l => (
                    <div key={l.id} className="rounded-lg border border-border bg-background p-3">
                      <div className="text-[13px] font-semibold">{l.name}</div>
                      <div className="mt-0.5 text-[11.5px] text-muted-foreground">{l.client}</div>
                      <div className="mt-2 text-[11px] text-muted-foreground">{l.campaign}</div>
                      <div className="mt-2 flex items-center justify-between text-[10.5px] text-muted-foreground">
                        <span>{l.source}</span><span>{l.submitted}</span>
                      </div>
                    </div>
                  ))}
                  {items.length === 0 && <div className="rounded-lg border border-dashed border-border p-4 text-center text-[12px] text-muted-foreground">No leads</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
