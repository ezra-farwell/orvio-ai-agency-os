import { StatusBadge } from "./primitives";
import { LiveTick, Sparkline } from "./interactive";

export function DashboardMockup({ tilted = true }: { tilted?: boolean }) {
  return (
    <div className="relative mx-auto w-full max-w-[1100px]" style={tilted ? { perspective: "1800px" } : undefined}>
      {/* halo */}
      <div
        className="pointer-events-none absolute -inset-10 -z-10 rounded-[40px] opacity-70 blur-3xl"
        style={{ background: "radial-gradient(60% 50% at 50% 30%, rgba(99,102,241,0.35), transparent 70%)" }}
        aria-hidden
      />
      <div
        className="surface-elev overflow-hidden rounded-2xl shadow-[0_60px_140px_-40px_rgba(99,102,241,0.55)]"
        style={tilted ? { transform: "rotateX(7deg) rotateY(-2deg)", transformStyle: "preserve-3d" } : undefined}
      >
        <div className="flex items-center gap-2 border-b border-border bg-background/60 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
          <div className="ml-4 flex items-center gap-2 rounded-md bg-background px-3 py-1 text-[11px] font-mono text-text-faint">
            <span className="grid h-1.5 w-1.5 rounded-full bg-success live-dot" />
            portal.growthdesk.io
          </div>
          <div className="ml-auto hidden items-center gap-1.5 text-[10px] text-text-faint sm:flex">
            <span className="grid h-1.5 w-1.5 rounded-full bg-success live-dot" />
            Live · syncing Meta + Google
          </div>
        </div>

        <div className="flex items-center justify-between border-b border-border bg-surface px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-sm bg-gradient-to-br from-indigo to-[#8B5CF6]" />
            <span className="font-display text-base font-extrabold tracking-tight">GrowthDesk</span>
          </div>
          <div className="hidden gap-6 text-sm text-text-muted sm:flex">
            <span className="text-foreground">Clients</span>
            <span>Studio</span>
            <span>Settings</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="rounded-md border border-amber/30 bg-amber/10 px-2.5 py-1 font-mono text-amber">
              <LiveTick base={847} jitter={2} interval={3200} /> credits
            </span>
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo to-[#8B5CF6]" />
          </div>
        </div>

        {/* Top metrics with embedded sparkline */}
        <div className="grid grid-cols-1 gap-3 border-b border-border bg-background/40 p-5 md:grid-cols-[1.4fr_1fr]">
          <div className="surface-card relative overflow-hidden p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-text-muted">Aggregate CPL — last 30d</div>
                <div className="mt-1 font-mono text-3xl font-semibold text-foreground">
                  $<LiveTick base={4.82} jitter={0.08} interval={2200} format={(n) => n.toFixed(2)} />
                </div>
                <div className="mt-1 font-mono text-xs text-success">▼ 18.4% vs prev. period</div>
              </div>
              <span className="rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">Healthy</span>
            </div>
            <div className="mt-2">
              <Sparkline color="#6366F1" height={56} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { v: <LiveTick base={4} jitter={0} interval={9999} format={(n) => n.toFixed(0)} />, l: "Active clients" },
              { v: <LiveTick base={43} jitter={1.6} interval={2600} format={(n) => n.toFixed(0)} />, l: "Leads today" },
              { v: <LiveTick base={12} jitter={0.6} interval={3000} format={(n) => n.toFixed(0)} />, l: "Calls booked" },
              { v: "1", l: "At risk" },
            ].map((m) => (
              <div key={m.l} className="surface-card p-3">
                <div className="font-mono text-2xl font-semibold">{m.v}</div>
                <div className="text-[11px] uppercase tracking-wider text-text-muted">{m.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-background/40 p-5">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-medium text-foreground">Clients</h4>
            <span className="text-xs text-text-muted">Sorted by CPL</span>
          </div>
          <div className="surface-card divide-y divide-border overflow-hidden">
            {[
              { name: "Summit Roofing", industry: "Roofing", status: "Healthy", tone: "green", cpl: "$4.82", trend: "▼ 12%" },
              { name: "Metro Movers", industry: "Moving", status: "Watch", tone: "yellow", cpl: "$8.20", trend: "▲ 4%" },
              { name: "Elite HVAC", industry: "HVAC", status: "Healthy", tone: "green", cpl: "$3.91", trend: "▼ 22%" },
              { name: "GrandView Remodeling", industry: "Remodeling", status: "At Risk", tone: "red", cpl: "$12.40", trend: "▲ 31%" },
            ].map((c) => (
              <div key={c.name} className="group grid grid-cols-[1.4fr_1fr_auto_auto_auto] items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-surface">
                <div className="flex items-center gap-2 truncate font-medium text-foreground">
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${c.tone === "green" ? "bg-success live-dot" : c.tone === "yellow" ? "bg-warning" : "bg-danger"}`} />
                  {c.name}
                </div>
                <div className="truncate text-text-muted">{c.industry}</div>
                <StatusBadge tone={c.tone as "green" | "yellow" | "red"}>{c.status}</StatusBadge>
                <div className={`font-mono text-xs ${c.trend.startsWith("▼") ? "text-success" : "text-danger"}`}>{c.trend}</div>
                <div className="font-mono text-foreground">{c.cpl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


export function ReportMockup() {
  return (
    <div className="surface-elev overflow-hidden">
      <div className="border-b border-border bg-surface px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-sm bg-gradient-to-br from-indigo to-[#8B5CF6]" />
          <span className="font-display font-bold">GrowthDesk</span>
          <span className="text-xs text-text-muted">· June 2026 · Summit Roofing Co.</span>
        </div>
      </div>
      <div className="space-y-5 p-6">
        <div>
          <div className="mb-1 text-xs uppercase tracking-wider text-text-muted">Month in Review</div>
          <p className="text-sm leading-relaxed text-foreground/90">
            June was a strong rebound month for Summit Roofing. After a soft mid-May, lead volume recovered
            with a 22% week-over-week lift driven by the storm damage inspection angle, while CPL settled at
            $4.82 — well below the home services benchmark.
          </p>
        </div>
        <div>
          <div className="mb-2 text-xs uppercase tracking-wider text-text-muted">What's working</div>
          <ul className="space-y-1.5 text-sm text-foreground/90">
            <li>• "Trust First" hook outperforming "Urgency" by <span className="font-mono text-success">31%</span> on CPL.</li>
            <li>• 9:16 Story placements drove <span className="font-mono text-success">42%</span> of new conversations.</li>
          </ul>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[
            { v: "$1,247", l: "Spend" },
            { v: "43", l: "Leads" },
            { v: "$4.82", l: "CPL" },
            { v: "12", l: "Calls" },
          ].map((m) => (
            <div key={m.l} className="surface-card p-3">
              <div className="font-mono text-base font-semibold">{m.v}</div>
              <div className="text-[10px] uppercase tracking-wider text-text-muted">{m.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ModelDropdownMockup() {
  const rows = [
    { name: "Gemini 2.5 Flash", tier: "Free", credits: 5, selected: false },
    { name: "Gemini 2.5 Pro", tier: "Standard", credits: 20, selected: false },
    { name: "Command R+", tier: "Standard", credits: 25, selected: false },
    { name: "Mistral Large", tier: "Standard", credits: 30, selected: false },
    { name: "Claude Opus 4.8", tier: "Premium", credits: 60, selected: true },
    { name: "GPT-5.5", tier: "Maximum", credits: 75, selected: false },
  ] as const;
  const tone = (t: string) =>
    t === "Free" ? "text-success border-success/30 bg-success/10"
    : t === "Standard" ? "text-indigo border-indigo/30 bg-indigo/10"
    : t === "Premium" ? "text-[#8B5CF6] border-[#8B5CF6]/30 bg-[#8B5CF6]/10"
    : "text-amber border-amber/30 bg-amber/10";
  return (
    <div className="surface-elev p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium">Strategy Model</span>
        <span className="text-[11px] uppercase tracking-wider text-text-muted">Credits</span>
      </div>
      <div className="divide-y divide-border">
        {rows.map((r) => (
          <div key={r.name} className="flex items-center gap-3 px-1 py-3">
            <span className={`grid h-4 w-4 place-items-center rounded-full border ${r.selected ? "border-indigo" : "border-border"}`}>
              {r.selected && <span className="h-2 w-2 rounded-full bg-indigo" />}
            </span>
            <span className="text-sm text-foreground/90">{r.name}</span>
            <span className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${tone(r.tier)}`}>
              {r.tier}
            </span>
            <span className="ml-auto font-mono text-sm">{r.credits}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PortalMockup() {
  return (
    <div className="surface-elev overflow-hidden">
      <div className="flex items-center justify-between border-b border-border bg-surface px-6 py-3">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-sm bg-gradient-to-br from-indigo to-[#8B5CF6]" />
          <span className="font-display font-bold">GrowthDesk</span>
        </div>
        <div className="hidden gap-5 text-xs text-text-muted sm:flex">
          <span className="text-foreground">Dashboard</span>
          <span>Reports</span>
          <span>Invoices</span>
        </div>
        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-indigo to-[#8B5CF6]" />
      </div>
      <div className="space-y-4 p-6">
        <div>
          <div className="text-xs text-text-muted">Welcome back,</div>
          <h4 className="font-display text-xl font-bold">Summit Roofing Co.</h4>
        </div>
        <div className="rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
          ✓ Your campaigns are healthy
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { v: "$1,247", l: "Spent" },
            { v: "43", l: "Leads" },
            { v: "$4.82", l: "CPL" },
          ].map((m) => (
            <div key={m.l} className="surface-card p-3">
              <div className="font-mono text-base font-semibold">{m.v}</div>
              <div className="text-[10px] uppercase tracking-wider text-text-muted">{m.l}</div>
            </div>
          ))}
        </div>
        <button className="w-full rounded-lg bg-amber px-4 py-2.5 text-sm font-medium text-white">
          Download June Report
        </button>
      </div>
    </div>
  );
}
