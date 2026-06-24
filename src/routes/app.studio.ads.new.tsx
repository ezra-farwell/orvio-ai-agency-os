import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader, Card } from "@/components/bits";
import { getClients } from "@/lib/data";
import { AIActionLink } from "@/components/orvio/AIActionMenu";
import { Sparkles, ArrowLeft, Wand2 } from "lucide-react";

export const Route = createFileRoute("/app/studio/ads/new")({
  component: AdBuilder,
  head: () => ({ meta: [{ title: "Ad Builder — Orvio Studio" }] }),
});

function AdBuilder() {
  const { data: clients = [] } = useQuery({ queryKey: ["clients"], queryFn: getClients });
  const [clientId, setClientId] = useState("");
  const [brief, setBrief] = useState({
    platform: "Meta Ads",
    objective: "Lead generation",
    service: "",
    offer: "",
    location: "",
    painPoint: "",
    audience: "",
    tone: "Direct & reassuring",
    cta: "Call now",
  });
  const set = (k: keyof typeof brief) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setBrief((b) => ({ ...b, [k]: e.target.value }));

  const selectedClient = clients.find((c) => c.id === clientId);
  const context = [
    selectedClient ? `Client: ${selectedClient.name}` : "",
    selectedClient?.category ? `Category: ${selectedClient.category}` : "",
    selectedClient?.area ? `Service area: ${selectedClient.area}` : "",
    `Platform: ${brief.platform}`,
    `Objective: ${brief.objective}`,
    brief.service ? `Service promoted: ${brief.service}` : "",
    brief.offer ? `Offer: ${brief.offer}` : "",
    brief.location ? `Target location: ${brief.location}` : "",
    brief.painPoint ? `Pain point: ${brief.painPoint}` : "",
    brief.audience ? `Audience: ${brief.audience}` : "",
    `Tone: ${brief.tone}`,
    `Primary CTA: ${brief.cta}`,
  ].filter(Boolean).join("\n");

  const ready = Boolean(brief.service.trim() || brief.offer.trim());

  return (
    <>
      <PageHeader
        title={<span className="flex items-center gap-2"><Link to="/app/studio" className="text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /></Link>Ad Builder</span>}
        sub="Fill in the brief, then generate ad copy with Orvio AI — grounded in the client's context."
      />

      <div className="grid gap-6 px-6 pb-10 lg:grid-cols-[1fr_360px]">
        <Card className="p-5">
          <div className="text-[14px] font-semibold">Brief</div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <SField label="Client">
              <select value={clientId} onChange={(e) => setClientId(e.target.value)} className="h-9 w-full rounded-lg border border-border bg-background px-3 text-[13px]">
                <option value="">Select a client…</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </SField>
            <SField label="Platform">
              <div className="flex h-9 rounded-lg border border-border bg-background p-0.5">
                {(["Meta Ads", "Google Ads"] as const).map((p) => (
                  <button key={p} type="button" onClick={() => setBrief((b) => ({ ...b, platform: p }))} className={`flex-1 rounded-md text-[12.5px] ${brief.platform === p ? "bg-foreground text-background" : "text-muted-foreground"}`}>{p}</button>
                ))}
              </div>
            </SField>
            <SField label="Campaign objective">
              <select value={brief.objective} onChange={set("objective")} className="h-9 w-full rounded-lg border border-border bg-background px-3 text-[13px]"><option>Lead generation</option><option>Conversions</option><option>Traffic</option><option>Reach</option></select>
            </SField>
            <SField label="Service being promoted"><input value={brief.service} onChange={set("service")} placeholder="Emergency plumbing dispatch" className="h-9 w-full rounded-lg border border-border bg-background px-3 text-[13px]" /></SField>
            <SField label="Offer"><input value={brief.offer} onChange={set("offer")} placeholder="Under 60 minutes, no overtime fees" className="h-9 w-full rounded-lg border border-border bg-background px-3 text-[13px]" /></SField>
            <SField label="Target location"><input value={brief.location} onChange={set("location")} placeholder="Detroit Metro, MI · 25 mi radius" className="h-9 w-full rounded-lg border border-border bg-background px-3 text-[13px]" /></SField>
            <SField label="Pain point"><input value={brief.painPoint} onChange={set("painPoint")} placeholder="Burst pipes, midnight emergencies" className="h-9 w-full rounded-lg border border-border bg-background px-3 text-[13px]" /></SField>
            <SField label="Audience"><input value={brief.audience} onChange={set("audience")} placeholder="Homeowners, 35-65" className="h-9 w-full rounded-lg border border-border bg-background px-3 text-[13px]" /></SField>
            <SField label="Primary CTA"><input value={brief.cta} onChange={set("cta")} placeholder="Call now" className="h-9 w-full rounded-lg border border-border bg-background px-3 text-[13px]" /></SField>
          </div>
        </Card>

        <Card className="sticky top-20 h-fit p-5">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]"><Wand2 className="h-3.5 w-3.5" /></span>
            <div className="text-[14px] font-semibold">Generate</div>
          </div>
          <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">
            Orvio AI turns this brief into primary text, headlines, and descriptions — ready to review and send for client approval.
          </p>
          <AIActionLink
            clientId={clientId || undefined}
            mode="creative_prompt"
            prompt={`Write ${brief.platform} ad copy (primary text, headlines, and descriptions) for this brief. Give several variations.`}
            context={context}
            className={`mt-4 inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-lg px-3 text-[14px] font-medium transition-opacity ${ready ? "bg-foreground text-background hover:opacity-90" : "pointer-events-none bg-foreground/40 text-background/70"}`}
          >
            <Sparkles className="h-3.5 w-3.5" /> Generate with Orvio AI
          </AIActionLink>
          {!ready && <div className="mt-2 text-[11.5px] text-muted-foreground">Add a service or offer to enable generation.</div>}
        </Card>
      </div>
    </>
  );
}

function SField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-[11.5px] font-medium text-muted-foreground">{label}</div>
      <div className="mt-1">{children}</div>
    </label>
  );
}
