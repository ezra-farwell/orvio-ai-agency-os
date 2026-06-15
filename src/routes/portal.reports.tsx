import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card } from "@/components/bits";
import { Download } from "lucide-react";

export const Route = createFileRoute("/portal/reports")({
  component: Reports,
  head: () => ({ meta: [{ title: "Reports — Client portal" }] }),
});

const reports = [
  { month: "April 2024", spend: "$4,280", leads: 63, cpl: "$67.94", best: "Emergency Plumbing Leads", note: "Best month yet. Roof Replacement scaled. Booked calls up 38%." },
  { month: "March 2024", spend: "$4,100", leads: 58, cpl: "$70.69", best: "Drain Cleaning Local", note: "Steady growth. CTR up to 2.6%. Two new offers tested." },
  { month: "February 2024", spend: "$3,820", leads: 49, cpl: "$77.96", best: "Drain Cleaning Local", note: "Slower start but improved through the month. New creative refresh." },
];

function Reports() {
  return (
    <>
      <PageHeader title="Monthly reports" sub="Performance summaries from your agency, in plain English." />
      <div className="grid gap-4 px-6 pb-10">
        {reports.map(r => (
          <Card key={r.month} className="p-5">
            <div className="flex items-center justify-between">
              <div className="text-[15px] font-semibold">{r.month}</div>
              <button className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-[12.5px]"><Download className="h-3.5 w-3.5" />Download PDF</button>
            </div>
            <div className="mt-4 grid gap-2 md:grid-cols-4">
              {[["Spend",r.spend],["Leads",String(r.leads)],["CPL",r.cpl],["Best campaign",r.best]].map(([l,v]) => (
                <div key={l} className="rounded-lg border border-border bg-[var(--surface-2)]/60 p-3"><div className="text-[10.5px] uppercase tracking-wider text-muted-foreground">{l}</div><div className="mt-0.5 text-[14px] font-semibold">{v}</div></div>
              ))}
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">{r.note}</p>
          </Card>
        ))}
      </div>
    </>
  );
}
