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

/** Latest insight of each kind for one client → keyed by kind. */
export async function getClientInsights(clientId: string): Promise<Partial<Record<InsightKind, Insight>>> {
  if (!isSupabaseConfigured || !supabase || !clientId) return {};
  const { data, error } = await supabase.from("ai_latest").select("*").eq("client_id", clientId);
  if (error) throw error;
  const out: Partial<Record<InsightKind, Insight>> = {};
  for (const row of (data as Insight[]) ?? []) out[row.kind] = row;
  return out;
}

/** Latest churn_risk per client across the agency → keyed by client_id (for list badges). */
export async function getChurnMap(): Promise<Record<string, Insight>> {
  if (!isSupabaseConfigured || !supabase) return {};
  const { data, error } = await supabase.from("ai_latest").select("*").eq("kind", "churn_risk");
  if (error) throw error;
  const out: Record<string, Insight> = {};
  for (const row of (data as Insight[]) ?? []) out[row.client_id] = row;
  return out;
}
