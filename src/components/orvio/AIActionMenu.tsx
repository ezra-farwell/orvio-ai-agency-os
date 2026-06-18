import { Link } from "@tanstack/react-router";
import { ChevronDown, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

export type OrvioAIActionMode =
  | "general"
  | "campaign_ideas"
  | "lead_followup"
  | "creative_prompt"
  | "competitor_summary"
  | "report_summary"
  | "task_recommendations";

export type OrvioAIAction = {
  label: string;
  mode: OrvioAIActionMode;
  prompt: string;
  context?: string;
};

export function AIActionMenu({
  actions,
  clientId,
  label = "Ask Orvio AI",
}: {
  actions: OrvioAIAction[];
  clientId?: string;
  label?: string;
}) {
  return (
    <details className="group relative">
      <summary className="inline-flex h-9 cursor-pointer list-none items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-[13px] font-medium transition-colors hover:bg-[var(--surface-2)] [&::-webkit-details-marker]:hidden">
        <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
        {label}
        <ChevronDown className="h-3 w-3 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>
      <div className="absolute right-0 z-30 mt-2 w-64 overflow-hidden rounded-xl border border-border bg-[var(--surface)] p-1.5 shadow-pop">
        {actions.map((action) => (
          <Link
            key={`${action.mode}-${action.label}`}
            to="/app/ai"
            search={{
              clientId,
              mode: action.mode,
              prompt: action.prompt,
              context: action.context,
            }}
            className="block rounded-lg px-3 py-2.5 text-[12.5px] text-muted-foreground transition-colors hover:bg-[var(--surface-2)]"
          >
            <span className="block font-medium text-foreground">{action.label}</span>
            <span className="mt-0.5 block text-[11px]">Open a prefilled Orvio AI chat</span>
          </Link>
        ))}
      </div>
    </details>
  );
}

export function AIActionLink({
  mode,
  prompt,
  context,
  clientId,
  children,
  className = "",
}: {
  mode: OrvioAIActionMode;
  prompt: string;
  context?: string;
  clientId?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      to="/app/ai"
      search={{ clientId, mode, prompt, context }}
      className={className}
    >
      {children}
    </Link>
  );
}
