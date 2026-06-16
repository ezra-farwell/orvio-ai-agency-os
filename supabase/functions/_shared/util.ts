// Shared helpers for Orvio Edge Functions (Deno).
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

export const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

/** Redirect the browser back to the app after an OAuth round-trip. */
export function redirect(url: string): Response {
  return new Response(null, { status: 302, headers: { Location: url } });
}

/** Service-role client — bypasses RLS to write tokens. Never expose this to the browser. */
export function serviceClient(): SupabaseClient {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );
}

/** Resolve the calling user's agency_id from their JWT (Authorization: Bearer <token>). */
export async function agencyIdFromAuth(req: Request): Promise<string | null> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return null;
  const userClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } }, auth: { persistSession: false } },
  );
  const { data: u } = await userClient.auth.getUser();
  if (!u.user) return null;
  const { data: profile } = await userClient.from("profiles").select("agency_id").eq("id", u.user.id).maybeSingle();
  return (profile?.agency_id as string) ?? null;
}

export const APP_URL = () => Deno.env.get("APP_URL") ?? "http://localhost:8080";
