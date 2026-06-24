// Client content approvals. The portal reads the client's content_assets (RLS-scoped)
// and reviews them through the rpc_client_review_asset RPC (writes are gated server-side).
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

export type AssetReviewStatus = "pending" | "approved" | "changes";

export type ReviewAsset = {
  id: string;
  title: string;
  kind: string;
  platform: string | null;
  status: string;
  thumb: string | null;
  approvalNote: string | null;
  reviewStatus: AssetReviewStatus;
};

function deriveReviewStatus(status: string, note: string | null): AssetReviewStatus {
  if (status === "Approved") return "approved";
  if (note && note.trim()) return "changes";
  return "pending";
}

/** The signed-in client's creative assets, with a derived review status. */
export async function getClientAssets(): Promise<ReviewAsset[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  const { data, error } = await supabase
    .from("content_assets")
    .select("id, title, kind, platform, status, thumb, approval_note")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return ((data ?? []) as Array<{
    id: string; title: string; kind: string; platform: string | null;
    status: string; thumb: string | null; approval_note: string | null;
  }>).map((r) => ({
    id: r.id,
    title: r.title,
    kind: r.kind,
    platform: r.platform,
    status: r.status,
    thumb: r.thumb,
    approvalNote: r.approval_note,
    reviewStatus: deriveReviewStatus(r.status, r.approval_note),
  }));
}

/** Approve an asset, or send a change request (approve=false + note). */
export async function reviewAsset(assetId: string, approve: boolean, note?: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) throw new Error("Supabase not configured.");
  const { error } = await supabase.rpc("rpc_client_review_asset", {
    p_asset_id: assetId,
    p_approve: approve,
    p_note: note ?? null,
  });
  if (error) throw error;
}
