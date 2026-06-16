import { type ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, Info } from "lucide-react";
import { TONE_COLOR, formatMetric, type MetricGroup } from "@/mock/data";

/**
 * StatusGroupCard — Resend-inspired metric card.
 * Eyebrow label, big status word, then two rows: dot + label + muted value + muted %.
 */
export function StatusGroupCard({ group }: { group: MetricGroup }) {
  const dot = TONE_COLOR[group.statusTone];
  return (
    <div className="rounded-2xl border border-border bg-[var(--surface)] p-6">
      <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--text-faint)]">
        {group.eyebrow}
      </div>
      <div className="mt-2 text-[34px] font-semibold leading-none tracking-tight">
        {group.statusWord}
      </div>
      <div className="mt-6 space-y-3">
        {group.rows.map((r, i) => (
          <div key={i} className="flex items-center gap-3 text-[13px]">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: dot }} />
            <span className="flex-1 text-foreground/90">{r.label}</span>
            <span className="mono tabular-nums text-muted-foreground">{formatMetric(r)}</span>
            {r.secondary && (
              <span className="mono w-14 text-right text-[12px] text-[var(--text-faint)]">{r.secondary}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/** HeroNumber — one big number with eyebrow label and optional chart slot. */
export function HeroNumber({
  label, value, sub, children,
}: { label: string; value: ReactNode; sub?: ReactNode; children?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-[var(--surface)] p-6">
      <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--text-faint)]">{label}</div>
      <div className="mt-2 flex items-baseline gap-3">
        <div className="text-[44px] font-semibold leading-none tracking-tight">{value}</div>
        {sub && <div className="text-[13px] text-muted-foreground">{sub}</div>}
      </div>
      {children}
    </div>
  );
}

export function KPI({
  label, value, sub, delta, helper, icon,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  delta?: number;
  helper?: string;
  icon?: ReactNode;
}) {
  const positive = (delta ?? 0) >= 0;
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="text-[12px] font-medium text-muted-foreground">{label}</div>
        {icon ? <div className="text-muted-foreground">{icon}</div> : null}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <div className="text-[24px] font-semibold tracking-tight">{value}</div>
        {typeof delta === "number" && (
          <span className={`inline-flex items-center gap-0.5 text-[12px] font-medium ${positive ? "text-[var(--success)]" : "text-[var(--danger)]"}`}>
            {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(delta).toFixed(1)}%
          </span>
        )}
      </div>
      {sub ? <div className="mt-1 text-[12px] text-muted-foreground">{sub}</div> : null}
      {helper ? (
        <div className="mt-3 flex items-start gap-1.5 rounded-md bg-[var(--surface-2)] px-2 py-1.5 text-[11.5px] leading-snug text-muted-foreground">
          <Info className="mt-0.5 h-3 w-3 shrink-0" /> {helper}
        </div>
      ) : null}
    </div>
  );
}

export function StatusBadge({ kind, children }: { kind: "success" | "warning" | "danger" | "neutral" | "indigo"; children: ReactNode }) {
  const cls = kind === "success" ? "chip-success" : kind === "warning" ? "chip-warning" : kind === "danger" ? "chip-danger" : kind === "indigo" ? "chip-indigo" : "chip";
  return <span className={cls}>{children}</span>;
}

export function SectionHead({ eyebrow, title, sub, action }: { eyebrow?: string; title: ReactNode; sub?: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        {eyebrow && <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">{eyebrow}</div>}
        <h2 className="mt-1 text-[20px] font-semibold tracking-tight">{title}</h2>
        {sub && <p className="mt-1 text-[13px] text-muted-foreground">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function PageHeader({ title, sub, actions }: { title: ReactNode; sub?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 px-6 pb-4 pt-6">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight">{title}</h1>
        {sub && <p className="mt-1 text-[13px] text-muted-foreground">{sub}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-border bg-background ${className}`}>{children}</div>;
}
