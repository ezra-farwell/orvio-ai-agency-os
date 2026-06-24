import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader, Card } from "@/components/bits";
import { getAgencies, getClients, updateAgency } from "@/lib/data";
import { Check, Loader2 } from "lucide-react";

export const Route = createFileRoute("/app/settings/white-label")({
  component: WhiteLabel,
  head: () => ({ meta: [{ title: "White-label — Orvio" }] }),
});

function WhiteLabel() {
  const { data: agencies = [], isLoading } = useQuery({ queryKey: ["agencies"], queryFn: getAgencies });
  const { data: clients = [] } = useQuery({ queryKey: ["clients"], queryFn: getClients });
  const agency = agencies[0];

  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [color, setColor] = useState("#4F46E5");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (agency) {
      setName(agency.name);
      setDomain(agency.domain ?? "");
      setColor(agency.brandColor || "#4F46E5");
    }
  }, [agency]);

  async function save() {
    if (!agency) return;
    setSaving(true);
    setSaved(false);
    setError(undefined);
    try {
      await updateAgency(agency.id, { name: name.trim(), domain: domain.trim() || null, brand_color: color });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("Could not save. Only the agency owner can change branding.");
    } finally {
      setSaving(false);
    }
  }

  const previewClient = clients[0]?.name ?? "Your client";

  return (
    <>
      <PageHeader
        title="White-label"
        sub="Your brand. Your domain. Your software."
        actions={
          <button onClick={save} disabled={saving || isLoading || !agency} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-foreground px-3 text-[13px] font-medium text-background hover:opacity-90 disabled:opacity-60">
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : saved ? <Check className="h-3.5 w-3.5" /> : null}
            {saving ? "Saving…" : saved ? "Saved" : "Save"}
          </button>
        }
      />
      <div className="grid gap-4 px-6 pb-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {error && (
            <div className="rounded-lg border border-[var(--danger)]/30 bg-[var(--danger-soft)] px-3 py-2.5 text-[12.5px] text-[var(--danger)]">{error}</div>
          )}
          <Card className="p-5">
            <div className="text-[14px] font-semibold">Brand</div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <label className="block">
                <div className="text-[11.5px] font-medium text-muted-foreground">Agency name</div>
                <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 text-[13px]" />
              </label>
              <label className="block">
                <div className="text-[11.5px] font-medium text-muted-foreground">Brand color</div>
                <div className="mt-1 flex items-center gap-2 rounded-lg border border-border bg-background px-3">
                  <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-7 w-7 cursor-pointer rounded border-0 bg-transparent p-0" />
                  <input value={color} onChange={(e) => setColor(e.target.value)} className="mono h-9 flex-1 bg-transparent text-[13px] outline-none" />
                </div>
              </label>
            </div>
          </Card>
          <Card className="p-5">
            <div className="text-[14px] font-semibold">Custom domain</div>
            <div className="mt-1 text-[12.5px] text-muted-foreground">Clients log in at this URL. Add a CNAME record pointing to <code className="mono">portals.orvio.app</code>.</div>
            <div className="mt-3 flex items-center gap-2">
              <input value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="clients.youragency.com" className="mono h-10 flex-1 rounded-lg border border-border bg-background px-3 text-[13.5px]" />
              {domain ? <span className="chip-success"><Check className="h-3 w-3" />Set</span> : <span className="chip">Not set</span>}
            </div>
          </Card>
        </div>

        {/* Live preview — uses the real agency brand */}
        <Card className="h-fit p-5">
          <div className="text-[12px] uppercase tracking-wider text-muted-foreground">Live preview</div>
          <div className="mt-3 overflow-hidden rounded-xl border border-border bg-background">
            <div className="flex items-center gap-2 border-b border-border px-3 py-2">
              <span className="grid h-6 w-6 place-items-center rounded text-[10px] font-semibold text-white" style={{ background: color }}>{(name || "A").charAt(0).toUpperCase()}</span>
              <div className="text-[12px] font-semibold">{name || "Your agency"}</div>
            </div>
            <div className="p-4">
              <div className="text-[10.5px] text-muted-foreground">Powered by {name || "your agency"}</div>
              <div className="text-[14px] font-semibold">{previewClient} — Client Portal</div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {["Spend", "Leads", "CPL", "Booked"].map((l) => (
                  <div key={l} className="rounded-md border border-border p-2 text-[11px]"><div className="text-muted-foreground">{l}</div><div className="font-semibold text-muted-foreground">—</div></div>
                ))}
              </div>
              <div className="mt-3 rounded-md py-1.5 text-center text-[11px] font-medium text-white" style={{ background: color }}>View report</div>
            </div>
          </div>
          <p className="mt-3 text-[11.5px] leading-relaxed text-muted-foreground">
            This is exactly what your clients see when they log in — your name, your color, your domain.
          </p>
        </Card>
      </div>
    </>
  );
}
