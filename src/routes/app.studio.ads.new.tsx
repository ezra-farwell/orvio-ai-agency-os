import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Card, StatusBadge } from "@/components/bits";
import { clients } from "@/mock/data";
import { Sparkles, ArrowLeft, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/app/studio/ads/new")({
  component: AdBuilder,
  head: () => ({ meta: [{ title: "Ad Builder — Orvio Studio" }] }),
});

function AdBuilder() {
  const [client, setClient] = useState(clients[0].name);
  const [platform, setPlatform] = useState<"Meta Ads" | "Google Ads">("Meta Ads");
  const [generated, setGenerated] = useState(true);

  return (
    <>
      <PageHeader
        title={<span className="flex items-center gap-2"><Link to="/app/studio" className="text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /></Link>Ad Builder</span>}
        sub="Generate ad copy grounded in the client's Brand Memory."
        actions={
          <>
            <span className="chip"><span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-[var(--success)]" />Draft saved</span>
            <button className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-[13px]"><RotateCcw className="h-3.5 w-3.5" />Regenerate</button>
            <button className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-foreground px-3 text-[13px] font-medium text-background"><Sparkles className="h-3.5 w-3.5" />Send for review</button>
          </>
        }
      />

      <div className="grid gap-6 px-6 pb-10 lg:grid-cols-[360px_1fr_360px]">
        {/* Form */}
        <Card className="p-5">
          <div className="text-[14px] font-semibold">Brief</div>
          <div className="mt-3 space-y-3">
            <SField label="Client">
              <select value={client} onChange={e=>setClient(e.target.value)} className="h-9 w-full rounded-lg border border-border bg-background px-3 text-[13px]">
                {clients.map(c => <option key={c.id}>{c.name}</option>)}
              </select>
            </SField>
            <SField label="Platform">
              <div className="flex h-9 rounded-lg border border-border bg-background p-0.5">
                {(["Meta Ads","Google Ads"] as const).map(p => (
                  <button key={p} onClick={()=>setPlatform(p)} className={`flex-1 rounded-md text-[12.5px] ${platform===p?"bg-foreground text-background":"text-muted-foreground"}`}>{p}</button>
                ))}
              </div>
            </SField>
            <SField label="Campaign objective">
              <select className="h-9 w-full rounded-lg border border-border bg-background px-3 text-[13px]"><option>Lead generation</option><option>Conversions</option><option>Traffic</option><option>Reach</option></select>
            </SField>
            <SField label="Service being promoted"><input defaultValue="Emergency plumbing dispatch" className="h-9 w-full rounded-lg border border-border bg-background px-3 text-[13px]" /></SField>
            <SField label="Offer"><input defaultValue="Under 60 minutes, no overtime fees" className="h-9 w-full rounded-lg border border-border bg-background px-3 text-[13px]" /></SField>
            <SField label="Target location"><input defaultValue="Detroit Metro, MI · 25 mi radius" className="h-9 w-full rounded-lg border border-border bg-background px-3 text-[13px]" /></SField>
            <SField label="Pain point"><input defaultValue="Burst pipes, midnight emergencies" className="h-9 w-full rounded-lg border border-border bg-background px-3 text-[13px]" /></SField>
            <SField label="Audience"><input defaultValue="Homeowners, 35-65, Detroit Metro" className="h-9 w-full rounded-lg border border-border bg-background px-3 text-[13px]" /></SField>
            <SField label="Tone">
              <select className="h-9 w-full rounded-lg border border-border bg-background px-3 text-[13px]"><option>Direct &amp; reassuring</option><option>Friendly</option><option>Urgent</option><option>Professional</option></select>
            </SField>
            <SField label="Primary CTA"><input defaultValue="Call now" className="h-9 w-full rounded-lg border border-border bg-background px-3 text-[13px]" /></SField>
          </div>
          <button onClick={()=>setGenerated(true)} className="mt-4 flex h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-foreground text-[14px] font-medium text-background hover:bg-foreground/90">
            <Sparkles className="h-3.5 w-3.5" />Generate
          </button>
        </Card>

        {/* Generated copy */}
        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div className="text-[14px] font-semibold">Generated copy</div>
              <span className="chip-indigo"><Sparkles className="h-3 w-3" />v3 · grounded in Brand Memory</span>
            </div>
            <div className="mt-4 space-y-4">
              <Section label="Primary text — 4 variations">
                {[
                  "Burst pipe at 11pm? Hartland Plumbing dispatches a licensed plumber to Detroit Metro homes in under 60 minutes — no overtime fees.",
                  "Water everywhere? Don't wait until morning. Our licensed plumbers reach Detroit Metro homes in under 60 minutes, 24/7.",
                  "Hartland Plumbing answers the phone at 2am — and shows up under an hour. Detroit's most-booked emergency team.",
                  "Plumbing emergency? Call once, talk to a licensed plumber in 90 seconds, on-site in under an hour. Detroit Metro only.",
                ].map((t,i) => <Variant key={i} text={t} />)}
              </Section>
              <Section label="Headlines — 5 variations">
                {["60-minute emergency plumbing","Detroit's #1 emergency plumber","Burst pipe? We're 60 min away","Licensed plumbers, 24/7","No overtime fees, ever"].map((t,i)=><Variant key={i} text={t} />)}
              </Section>
              <Section label="Descriptions — 3 variations">
                {["Licensed, insured, 60-minute dispatch across Detroit Metro.","Burst pipes, leaks, water damage — we handle all of it, 24/7.","No overtime fees. No surprise charges. Just a licensed plumber, fast."].map((t,i)=><Variant key={i} text={t} />)}
              </Section>
              <div className="rounded-lg border border-[var(--warning)]/30 bg-[var(--warning-soft)]/60 px-3 py-2 text-[12.5px] text-[#B45309]">
                <strong>Compliance note:</strong> "guaranteed" claims removed — Brand Memory marks them as unapproved.
              </div>
            </div>
          </Card>
        </div>

        {/* Previews */}
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <div className="border-b border-border bg-[var(--surface-2)] px-4 py-2 text-[11.5px] uppercase tracking-wider text-muted-foreground">Meta feed preview</div>
            <div className="bg-white p-4">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-[var(--accent)] text-[11px] font-semibold text-white">HP</div>
                <div>
                  <div className="text-[12.5px] font-semibold">Hartland Plumbing</div>
                  <div className="text-[10.5px] text-muted-foreground">Sponsored · Detroit, MI</div>
                </div>
              </div>
              <p className="mt-2 text-[12.5px] leading-snug">Burst pipe at 11pm? Hartland Plumbing dispatches a licensed plumber to Detroit Metro homes in under 60 minutes — no overtime fees.</p>
              <div className="mt-2 grid aspect-[1.91/1] place-items-center rounded-lg bg-gradient-to-br from-[#4F46E5] to-[#8B5CF6] text-white">
                <div className="text-center">
                  <div className="text-[10px] uppercase tracking-wider opacity-80">Emergency dispatch</div>
                  <div className="text-[20px] font-semibold">60 minutes or less</div>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
                <div><div className="text-[10.5px] uppercase text-muted-foreground">hartlandplumbing.com</div><div className="text-[12px] font-semibold">60-minute emergency plumbing</div></div>
                <button className="rounded-md bg-[var(--surface-2)] px-3 py-1 text-[11px] font-medium">Call now</button>
              </div>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="border-b border-border bg-[var(--surface-2)] px-4 py-2 text-[11.5px] uppercase tracking-wider text-muted-foreground">Google search ad preview</div>
            <div className="bg-white p-4 text-[13px]">
              <div className="flex items-center gap-1 text-[10.5px]">
                <span className="rounded-sm border border-foreground/20 px-1 font-semibold">Sponsored</span>
                <span className="text-muted-foreground">hartlandplumbing.com</span>
              </div>
              <div className="mt-1 text-[15px] font-medium leading-snug text-[#1a0dab]">60-Minute Emergency Plumbing | Licensed &amp; Insured | Detroit</div>
              <div className="mt-1 text-[12px] text-muted-foreground leading-snug">Burst pipe? Leak? Our licensed plumbers reach Detroit Metro homes in under 60 minutes. No overtime fees. Call now.</div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-0.5 text-[11.5px] text-[#1a0dab]">
                <span>Emergency dispatch</span><span>Water heater repair</span><span>Drain cleaning</span><span>Get a quote</span>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="text-[13px] font-semibold">Suggested landing page angle</div>
            <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">Lead with a phone-first hero: "Call now, plumber at your door in 60 minutes." Trust strip with licensed + insured badges. Single CTA above the fold.</p>
            <div className="mt-3 flex items-center gap-2"><StatusBadge kind="indigo">Brand-safe</StatusBadge><span className="text-[11.5px] text-muted-foreground">Approved claims only</span></div>
          </Card>
        </div>
      </div>
    </>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 space-y-2">{children}</div>
    </div>
  );
}
function Variant({ text }: { text: string }) {
  return (
    <div className="group flex items-start gap-2 rounded-lg border border-border bg-background px-3 py-2.5 text-[13px] hover:bg-[var(--surface-2)]/40">
      <div className="flex-1 leading-relaxed">{text}</div>
      <button className="opacity-0 transition-opacity group-hover:opacity-100 text-[11px] text-muted-foreground hover:text-foreground">Copy</button>
    </div>
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
