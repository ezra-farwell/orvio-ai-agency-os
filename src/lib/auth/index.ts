// Orvio auth — thin wrapper over Supabase Auth.
// Sign-in for everyone (agency owners, agency members, home-service owners).
// The user's role + which agency/client they belong to lives in `profiles`.

import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import type { ProfileRow } from "@/lib/supabase/types";

export type Session = Awaited<ReturnType<NonNullable<typeof supabase>["auth"]["getSession"]>>["data"]["session"];

function requireClient() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
  }
  return supabase;
}

/** Email + password sign-in. */
export async function signIn(email: string, password: string) {
  const sb = requireClient();
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

/** Email + password sign-up. `fullName` is stored in user metadata and copied to the profile. */
export async function signUp(email: string, password: string, fullName?: string) {
  const sb = requireClient();
  const { data, error } = await sb.auth.signUp({
    email,
    password,
    options: { data: fullName ? { full_name: fullName } : undefined },
  });
  if (error) throw error;
  return data;
}

/** Passwordless magic-link (good for inviting home-service owners). */
export async function signInWithMagicLink(email: string, redirectTo?: string) {
  const sb = requireClient();
  const { error } = await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo } });
  if (error) throw error;
}

export async function signOut() {
  const sb = requireClient();
  await sb.auth.signOut();
}

export async function getSession(): Promise<Session> {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

/** The signed-in user's profile (role + agency_id/client_id). Null if signed out. */
export async function getProfile(): Promise<ProfileRow | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;
  const { data, error } = await supabase.from("profiles").select("*").eq("id", auth.user.id).maybeSingle();
  if (error) throw error;
  return (data as ProfileRow) ?? null;
}

/** Subscribe to auth changes (sign in/out). Returns an unsubscribe fn. */
export function onAuthChange(cb: (session: Session) => void): () => void {
  if (!isSupabaseConfigured || !supabase) return () => {};
  const { data } = supabase.auth.onAuthStateChange((_event, session) => cb(session));
  return () => data.subscription.unsubscribe();
}
