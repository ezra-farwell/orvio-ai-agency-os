import { createClient } from "@supabase/supabase-js";

// Project URL + anon (publishable) key. The anon key is PUBLIC by design — it
// ships in the browser bundle and data is protected by RLS, not by hiding it.
// Env vars override these fallbacks (so a different project can be used without
// a code change), but the fallbacks let the deployed app work out of the box.
const FALLBACK_URL = "https://buvdoplasztgjuhkecze.supabase.co";
const FALLBACK_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1dmRvcGxhc3p0Z2p1aGtlY3plIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1NzY1NDUsImV4cCI6MjA5NzE1MjU0NX0.4Vv0CUcML9QWkEFqhZh0l9mgDoKn_EH4Fw-MMInV4rQ";

const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || FALLBACK_URL;
// Supabase renamed "anon key" → "publishable key"; accept either name.
const anonKey =
  ((import.meta.env.VITE_SUPABASE_ANON_KEY ??
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY) as string | undefined) || FALLBACK_ANON_KEY;

// Lets the app boot on mock data before Supabase is wired. The data layer
// checks this to decide whether to hit Supabase or fall back to mock.
export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = isSupabaseConfigured
  ? createClient(url!, anonKey!, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null;
