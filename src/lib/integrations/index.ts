// Orvio integrations (client side).
// The agency connects Meta/Google once; the secrets + token exchange happen in
// the Edge Functions. Here we just kick off the OAuth flow, read status, map ad
// accounts to clients, and trigger syncs.

import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

export type Provider = "meta" | "google" | "stripe";

export type Connection = {
  id: string;
  agency_id: string;
  provider: Provider;
  external_user_id: string | null;
  scope: string | null;
  expires_at: string | null;
  status: "active" | "expired" | "revoked" | "error";
  created_at: string;
  updated_at: string;
};

function requireClient() {
  if (!isSupabaseConfigured || !supabase) throw new Error("Supabase not configured.");
  return supabase;
}

/**
 * Begin connecting a provider. Asks the Edge Function for the provider's consent
 * URL, then redirects the browser there. After consent the function stores the
 * token and bounces back to /app/settings/integrations.
 */
export async function startConnect(provider: Provider): Promise<void> {
  const sb = requireClient();
  const fn = provider === "meta" ? "meta-oauth" : provider === "google" ? "google-oauth" : "stripe-connect";
  const { data, error } = await sb.functions.invoke(`${fn}?action=start`, { method: "GET" });
  if (error) throw error;
  if (!data?.url) throw new Error("No consent URL returned");
  window.location.href = data.url as string;
}

/** Token-free connection status for the current agency. */
export async function getConnections(): Promise<Connection[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  const { data, error } = await supabase.from("connection_status_view").select("*");
  if (error) throw error;
  return (data as Connection[]) ?? [];
}

/** Map a provider ad account to a client (after the agency picks one). */
export async function mapAdAccount(input: {
  clientId: string;
  connectionId: string;
  provider: Provider;
  externalId: string;
  name?: string;
  currency?: string;
}): Promise<void> {
  const sb = requireClient();
  const { error } = await sb.from("ad_accounts").insert({
    client_id: input.clientId,
    connection_id: input.connectionId,
    provider: input.provider,
    external_id: input.externalId,
    name: input.name ?? null,
    currency: input.currency ?? "USD",
  });
  if (error) throw error;
}

/** Trigger a metrics sync. Omit clientId to sync everything. */
export async function syncInsights(clientId?: string): Promise<{ accountsSynced: number; clients: string[] }> {
  const sb = requireClient();
  const { data, error } = await sb.functions.invoke("sync-insights", {
    method: "POST",
    body: clientId ? { client_id: clientId } : {},
  });
  if (error) throw error;
  return data as { accountsSynced: number; clients: string[] };
}
