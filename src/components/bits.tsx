import { type ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, Info } from "lucide-react";

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
