import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader, Card } from "@/components/bits";
import { getClients } from "@/lib/data";
import { Brain, Clock, Loader2 } from "lucide-react";

export const Route = createFileRoute("/app/studio/brand/$id")({
  component: BrandMemory,
  head: () => ({ meta: [{ title: "Brand memory — Orvio Studio" }] }),
});

const FIELDS = [
  "Business description", "Services", "Service areas", "Current offers",
  "Brand tone", "Approved claims", "Words to avoid", "Testimonials",
];

function BrandMemory() {
  const { id } = Route.useParams();
  const { data: clients = [], isLoading } = useQuery({ queryKey: ["clients"], queryFn: getClients });
  const client = clients.find((c) => c.id === id);

  if (isLoading) {
    return (
      <>
        <PageHeader title="Brand memory" sub="Loading…" />
        <div className="flex items-center gap-2 px-6 py-12 text-[13px] text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={<>Brand memory · <span className="text-muted-foreground">{client?.name ?? "Client"}</span></>}
        sub="The knowledge Orvio AI uses to write copy that sounds like the brand."
      />
      <div className="px-6 pb-10">
        <Card className="overflow-hidden">
          <div className="grid place-items-center px-6 py-14 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-2xl border border-border bg-[var(--surface)] text-[var(--accent)]">
              <Brain className="h-5 w-5" />
            </span>
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-[var(--surface-2)] px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
              <Clock className="h-3 w-3" /> Coming soon
            </div>
            <h2 className="mt-3 text-[20px] font-semibold tracking-tight">Brand Memory is on the way</h2>
            <p className="mx-auto mt-1.5 max-w-md text-[13px] leading-relaxed text-muted-foreground">
              You'll capture each client's voice, offers, approved claims, and words to
              avoid — and Orvio AI will ground every piece of copy in it.
              {client?.category ? ` We already know ${client.name} is in ${client.category}${client.area ? ` serving ${client.area}` : ""}.` : ""}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {FIELDS.map((f) => (
                <span key={f} className="rounded-full border border-border bg-background px-2.5 py-1 text-[11.5px] text-muted-foreground">{f}</span>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
