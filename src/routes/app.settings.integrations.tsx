import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Check, Loader2, ArrowRight, Clock } from "lucide-react";
import { PageHeader } from "@/components/bits";
import { getConnections, startConnect, type Provider } from "@/lib/integrations";

export const Route = createFileRoute("/app/settings/integrations")({
  component: Integrations,
  head: () => ({ meta: [{ title: "Integrations — Orvio" }] }),
});

const live: { id: Provider; name: string; blurb: string; color: string }[] = [
  { id: "meta", name: "Meta Ads", blurb: "Pull spend, leads, CPL and CTR from Facebook & Instagram campaigns.", color: "#0866FF" },
  { id: "stripe", name: "Stripe", blurb: "Invoices, subscriptions and homeowner payments via Stripe Connect.", color: "#635BFF" },
];

// Ad platforms with public APIs we plan to add next.
const soon = [
  { name: "Google Ads", blurb: "Search, Performance Max and Demand Gen metrics in one place.", color: "#4285F4" },
  { name: "TikTok Ads", blurb: "TikTok Marketing API — spend, leads and creative performance.", color: "#FE2C55" },
  { name: "Reddit Ads", blurb: "Reddit Ads API — community-targeted campaign reporting.", color: "#FF4500" },
  { name: "X Ads", blurb: "X (Twitter) Ads API — promoted post and lead metrics.", color: "#1D9BF0" },
];

function Integrations() {
  const { data: connections = [] } = useQuery({ queryKey: ["connections"], queryFn: getConnections });
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const statusOf = (id: string) => connections.find((c) => c.provider === id)?.status;

  async function connect(id: Provider) {
    setError(null);
    setBusy(id);
    try {
      await startConnect(id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start the connection.");
      setBusy(null);
    }
  }

  return (
    <>
      <PageHeader title="Integrations" sub="Connect the ad platforms and tools that power your client reporting." />
      <div className="space-y-10 px-6 pb-12">
        {error && (
          <div className="rounded-lg border border-[var(--danger)]/30 bg-[var(--danger-soft)] px-3 py-2 text-[12.5px] text-[var(--danger)]">{error}</div>
        )}

        <section>
          <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--text-faint)]">Available now</div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {live.map((p) => {
              const status = statusOf(p.id);
              const connected = status === "active";
              return (
                <div key={p.id} className="flex flex-col rounded-2xl border border-border bg-[var(--surface)] p-5">
                  <div className="flex items-center justify-between">
                    <span className="grid h-9 w-9 place-items-center rounded-lg text-[13px] font-bold text-white" style={{ background: p.color }}>
                      {p.name.charAt(0)}
                    </span>
                    {connected && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[var(--success-soft)] px-2 py-0.5 text-[11px] font-semibold text-[var(--success)]">
                        <Check className="h-3 w-3" /> Connected
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 text-[15px] font-semibold tracking-tight">{p.name}</h3>
                  <p className="mt-1.5 flex-1 text-[12.5px] leading-relaxed text-muted-foreground">{p.blurb}</p>
                  <button
                    onClick={() => connect(p.id)}
                    disabled={busy === p.id}
                    className={`mt-5 inline-flex h-9 items-center justify-center gap-1.5 rounded-lg px-3 text-[13px] font-medium transition-colors ${
                      connected
                        ? "border border-border bg-background text-foreground hover:bg-[var(--surface-2)]"
                        : "bg-foreground text-background hover:bg-foreground/90"
                    } disabled:opacity-60`}
                  >
                    {busy === p.id ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Connecting…</>
                      : connected ? "Manage"
                      : <>Connect <ArrowRight className="h-3.5 w-3.5" /></>}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--text-faint)]">Coming soon</div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {soon.map((p) => (
              <div key={p.name} className="flex flex-col rounded-2xl border border-dashed border-border bg-[var(--surface)]/50 p-5">
                <div className="flex items-center justify-between">
                  <span className="grid h-9 w-9 place-items-center rounded-lg text-[13px] font-bold text-white opacity-70" style={{ background: p.color }}>
                    {p.name.charAt(0)}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                    <Clock className="h-3 w-3" /> Coming soon
                  </span>
                </div>
                <h3 className="mt-4 text-[15px] font-semibold tracking-tight text-foreground/80">{p.name}</h3>
                <p className="mt-1.5 flex-1 text-[12.5px] leading-relaxed text-muted-foreground">{p.blurb}</p>
                <button disabled className="mt-5 inline-flex h-9 cursor-not-allowed items-center justify-center rounded-lg border border-border bg-background px-3 text-[13px] font-medium text-muted-foreground opacity-60">
                  Notify me
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
