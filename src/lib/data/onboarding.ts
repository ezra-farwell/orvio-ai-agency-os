// Onboarding actions (call the security-definer RPCs).
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

function requireClient() {
  if (!isSupabaseConfigured || !supabase) throw new Error("Supabase not configured.");
  return supabase;
}

/** Agency-owner onboarding: create the agency and become its owner. Returns agency id. */
export async function createAgency(input: { name: string; domain?: string; brandColor?: string }): Promise<string> {
  const sb = requireClient();
  const { data, error } = await sb.rpc("rpc_create_agency", {
    p_name: input.name,
    p_domain: input.domain ?? null,
    p_brand_color: input.brandColor ?? "#4F46E5",
  });
  if (error) throw error;
  return data as string;
}

/** Invite a home-service business owner to their client portal. Returns the invite token. */
export async function inviteClient(clientId: string, email: string): Promise<string> {
  const sb = requireClient();
  const { data, error } = await sb.rpc("rpc_invite_client", { p_client_id: clientId, p_email: email });
  if (error) throw error;
  return data as string;
}

/** Build the shareable invite link the agency sends to the business owner. */
export function inviteLink(token: string, origin = window.location.origin): string {
  return `${origin}/onboarding?invite=${token}`;
}

/** The home-service owner accepts their invite after signing in. Returns their client id. */
export async function acceptInvite(token: string): Promise<string> {
  const sb = requireClient();
  const { data, error } = await sb.rpc("rpc_accept_invite", { p_token: token });
  if (error) throw error;
  return data as string;
}
