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

/** A Supabase client scoped to the caller's JWT — queries run under their RLS. */
export function userClient(req: Request): SupabaseClient | null {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return null;
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } }, auth: { persistSession: false } },
  );
}

/** Resolve the calling user's agency_id from their JWT (Authorization: Bearer <token>). */
export async function agencyIdFromAuth(req: Request): Promise<string | null> {
  const sb = userClient(req);
  if (!sb) return null;
  const { data: u } = await sb.auth.getUser();
  if (!u.user) return null;
  const { data: profile } = await sb.from("profiles").select("agency_id").eq("id", u.user.id).maybeSingle();
  return (profile?.agency_id as string) ?? null;
}

export const APP_URL = () => Deno.env.get("APP_URL") ?? "http://localhost:8080";

// --- OAuth `state` signing (CSRF protection) --------------------------------
// The OAuth callbacks are unauthenticated by nature, so we can't trust a raw
// agency id in `state`. Instead we sign `agencyId.timestamp` with an HMAC the
// attacker can't forge, and verify + freshness-check it on the way back.
const STATE_TTL_MS = 15 * 60 * 1000; // 15 minutes
const enc = new TextEncoder();

function b64url(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(payload: string): Promise<string> {
  const secret = Deno.env.get("OAUTH_STATE_SECRET") ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return b64url(new Uint8Array(sig));
}

/** Build a tamper-proof `state` value carrying the agency id. */
export async function signState(agencyId: string): Promise<string> {
  const payload = `${agencyId}.${Date.now()}`;
  return `${payload}.${await hmac(payload)}`;
}

/** Verify a `state` value and return the agency id, or null if forged/expired. */
export async function verifyState(state: string | null): Promise<string | null> {
  if (!state) return null;
  const parts = state.split(".");
  if (parts.length !== 3) return null;
  const [agencyId, tsStr, sig] = parts;
  const payload = `${agencyId}.${tsStr}`;
  const expected = await hmac(payload);
  // constant-time-ish comparison
  if (sig.length !== expected.length) return null;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  if (diff !== 0) return null;
  const ts = Number(tsStr);
  if (!Number.isFinite(ts) || Date.now() - ts > STATE_TTL_MS) return null;
  return agencyId;
}
