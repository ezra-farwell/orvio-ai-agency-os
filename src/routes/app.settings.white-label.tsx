import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card } from "@/components/bits";
import { currentAgency } from "@/mock/data";
import { Check } from "lucide-react";

export const Route = createFileRoute("/app/settings/white-label")({
  component: WhiteLabel,
  head: () => ({ meta: [{ title: "White-label — Orvio" }] }),
});

function WhiteLabel() {
  return (
    <>
      <PageHeader title="White-label" sub="Your brand. Your domain. Your software." actions={<button className="inline-flex h-9 items-center rounded-lg bg-foreground px-3 text-[13px] font-medium text-background">Save</button>} />
      <div className="grid gap-4 px-6 pb-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <Card className="p-5">
            <div className="text-[14px] font-semibold">Brand</div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Field label="Agency name" value={currentAgency.name} />
              <Field label="From-name (emails)" value={currentAgency.name} />
              <Field label="Support email" value="hello@northstar.io" />
              <Field label="Reply-to" value="avery@northstar.io" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Color label="Primary" value="#4F46E5" />
              <Color label="Accent" value="#8B5CF6" />
            </div>
          </Card>
          <Card className="p-5">
            <div className="text-[14px] font-semibold">Domain</div>
            <div className="mt-1 text-[12.5px] text-muted-foreground">Clients log in at this URL. Add a CNAME record pointing to <code className="mono">portals.orvio.app</code>.</div>
            <div className="mt-3 flex items-center gap-2">
              <input defaultValue={currentAgency.domain} className="h-10 flex-1 rounded-lg border border-border bg-background px-3 text-[13.5px] mono" />
              <span className="chip-success"><Check className="h-3 w-3" />Verified</span>
            </div>
          </Card>
          <Card className="p-5">
            <div className="text-[14px] font-semibold">Logo</div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <UploadTile label="Light mark" />
              <UploadTile label="Dark mark" />
            </div>
          </Card>
        </div>

        <Card className="h-fit p-5">
          <div className="text-[12px] uppercase tracking-wider text-muted-foreground">Preview</div>
          <div className="mt-3 overflow-hidden rounded-xl border border-border bg-background">
            <div className="flex items-center gap-2 border-b border-border px-3 py-2">
              <span className="grid h-6 w-6 place-items-center rounded text-[10px] font-semibold text-white" style={{background:"#4F46E5"}}>N</span>
              <div className="text-[12px] font-semibold">{currentAgency.name}</div>
            </div>
            <div className="p-4">
              <div className="text-[10.5px] text-muted-foreground">Powered by {currentAgency.name}</div>
              <div className="text-[14px] font-semibold">Hartland Plumbing — Client Portal</div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {[["Spend","$4,280"],["Leads","63"],["CPL","$67"],["Booked","18"]].map(([l,v]) => (
                  <div key={l} className="rounded-md border border-border p-2 text-[11px]"><div className="text-muted-foreground">{l}</div><div className="font-semibold">{v}</div></div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
function Field({ label, value }: { label: string; value: string }) {
  return <label className="block"><div className="text-[11.5px] font-medium text-muted-foreground">{label}</div><input defaultValue={value} className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 text-[13px]" /></label>;
}
function Color({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <div className="text-[11.5px] font-medium text-muted-foreground">{label}</div>
      <div className="mt-1 flex items-center gap-2 rounded-lg border border-border bg-background px-3">
        <span className="inline-block h-4 w-4 rounded-sm" style={{ background: value }} />
        <input defaultValue={value} className="h-9 flex-1 bg-transparent text-[13px] mono outline-none" />
      </div>
    </label>
  );
}
function UploadTile({ label }: { label: string }) {
  return (
    <div className="grid aspect-[2/1] place-items-center rounded-lg border border-dashed border-border bg-[var(--surface-2)] text-[12px] text-muted-foreground">
      Drop {label.toLowerCase()}
    </div>
  );
}
