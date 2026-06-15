import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageHeader, Card } from "@/components/bits";
import { clients } from "@/mock/data";

export const Route = createFileRoute("/app/studio/brand/$id")({
  component: BrandMemory,
  loader: ({ params }) => {
    const c = clients.find(x => x.id === params.id);
    if (!c) throw notFound();
    return c;
  },
  head: ({ loaderData }) => ({ meta: [{ title: `Brand memory — ${loaderData?.name}` }] }),
});

function BrandMemory() {
  const c = Route.useLoaderData();
  return (
    <>
      <PageHeader
        title={<>Brand memory · <span className="text-muted-foreground">{c.name}</span></>}
        sub="The Studio uses this to generate copy that sounds like the brand."
        actions={<button className="inline-flex h-9 items-center rounded-lg bg-foreground px-3 text-[13px] font-medium text-background">Save changes</button>}
      />
      <div className="grid gap-4 px-6 pb-10 lg:grid-cols-2">
        <BField label="Business description" value={`${c.name} is a ${c.category.toLowerCase()} company serving homeowners in ${c.area}. Family-owned, licensed, with 12 years of local reputation.`} />
        <BField label="Services" chips={["Emergency dispatch","Drain cleaning","Water heater repair","Sump pump install","Pipe replacement"]} />
        <BField label="Service areas" chips={["Detroit Metro","Royal Oak","Birmingham","Bloomfield Hills","Troy"]} />
        <BField label="Current offers" chips={["$0 dispatch fee on emergency calls","Free water heater quote","Senior 10% discount"]} />
        <BField label="Brand tone" value="Direct, reassuring, blue-collar. Avoid corporate language. Sound like a real plumber, not a marketer." />
        <BField label="Testimonials" value={`"Showed up at 1am during a flood. Saved our basement." — Karen R., Royal Oak\n\n"Honest pricing, fast work. We don't call anyone else." — Devon P., Troy`} />
        <BField label="Common objections" chips={["Too expensive","I want a second opinion","Can you come this weekend?","Do you do financing?"]} />
        <BField label="Approved claims" chips={["Licensed & insured","60-minute dispatch","No overtime fees","Family-owned since 2011"]} />
        <BField label="Words to avoid" chips={["Guaranteed","Best in town","Cheapest","#1 in Detroit"]} tone="danger" />
        <BField label="Competitors" chips={["Roto-Rooter","Mr. Rooter","Benjamin Franklin"]} />
        <BField label="Notes from the agency" value="They had a bad experience with broad 'plumber Detroit' ads. Lean into emergency + dispatch time. The owner is responsive — turnaround on approvals is 24h max." />
      </div>
    </>
  );
}

function BField({ label, value, chips, tone }: { label: string; value?: string; chips?: string[]; tone?: "danger" }) {
  return (
    <Card className="p-5">
      <div className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      {chips ? (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {chips.map(ch => <span key={ch} className={tone === "danger" ? "chip-danger" : "chip"}>{ch}</span>)}
          <button className="chip border-dashed text-muted-foreground">+ Add</button>
        </div>
      ) : (
        <textarea defaultValue={value} className="mt-2 w-full resize-y rounded-lg border border-border bg-background p-3 text-[13px] leading-relaxed outline-none focus:border-[var(--accent)]" rows={4} />
      )}
    </Card>
  );
}
