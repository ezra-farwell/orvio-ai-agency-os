// Read AI insights produced by the local worker (orvio-ai/worker.py).
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

export type InsightKind =
  | "churn_risk" | "analytics_summary" | "followup_flag" | "client_report" | "next_actions";

export type Insight = {
  id: string;
  client_id: string;
  kind: InsightKind;
  severity: string | null;
  score: number | null;
  title: string | null;
  body: string | null;
  data: { actions?: string[]; flags?: string[]; [k: string]: unknown } | null;
  model: string | null;
  created_at: string;
};

/**
 * Models sometimes return list items as objects (e.g. {action, impact, description})
 * instead of plain strings. Coerce anything to a clean string so the UI never renders
 * a raw object (React error #31) — defends against insights written by older workers.
 */
function asText(v: unknown): string {
  if (typeof v === "string") return v;
  if (v && typeof v === "object") {
    const o = v as Record<string, unknown>;
    const pick = o.action ?? o.text ?? o.description ?? o.title ?? o.flag;
    if (typeof pick === "string") return pick;
    return Object.values(o).filter((x) => typeof x === "string").join(" — ");
  }
  return String(v ?? "");
}

/** Normalize an insight row so data.actions / data.flags are always string[]. */
function clean(row: Insight): Insight {
  const data = row.data ?? {};
  return {
    ...row,
    data: {
      ...data,
      ...(Array.isArray(data.actions) ? { actions: data.actions.map(asText) } : {}),
      ...(Array.isArray(data.flags) ? { flags: data.flags.map(asText) } : {}),
    },
  };
}

/** Latest insight of each kind for one client → keyed by kind. */
export async function getClientInsights(clientId: string): Promise<Partial<Record<InsightKind, Insight>>> {
  if (!isSupabaseConfigured || !supabase || !clientId) return {};
  const { data, error } = await supabase.from("ai_latest").select("*").eq("client_id", clientId);
  if (error) throw error;
  const out: Partial<Record<InsightKind, Insight>> = {};
  for (const row of (data as Insight[]) ?? []) out[row.kind] = clean(row);
  return out;
}

/** Latest insight of one kind across the agency → keyed by client_id. */
async function mapByKind(kind: InsightKind): Promise<Record<string, Insight>> {
  if (!isSupabaseConfigured || !supabase) return {};
  const { data, error } = await supabase.from("ai_latest").select("*").eq("kind", kind);
  if (error) throw error;
  const out: Record<string, Insight> = {};
  for (const row of (data as Insight[]) ?? []) out[row.client_id] = clean(row);
  return out;
}

/** Latest churn_risk per client across the agency → keyed by client_id (for list badges). */
export function getChurnMap(): Promise<Record<string, Insight>> {
  return mapByKind("churn_risk");
}

/** Latest follow-up flags per client across the agency → keyed by client_id. */
export function getFollowupMap(): Promise<Record<string, Insight>> {
  return mapByKind("followup_flag");
}

export type ChurnTier = "high" | "medium" | "low" | "none";

/** Severity → tier, falling back to score thresholds when the model omits severity. */
export function churnTier(ins?: Insight): ChurnTier {
  if (!ins) return "none";
  const sev = ins.severity?.toLowerCase();
  if (sev === "high" || sev === "medium" || sev === "low") return sev;
  const s = Number(ins.score ?? 0);
  return s >= 67 ? "high" : s >= 40 ? "medium" : "low";
}

export const TIER_COLOR: Record<ChurnTier, string> = {
  high: "var(--danger)",
  medium: "var(--warning)",
  low: "var(--success)",
  none: "var(--text-faint)",
};
