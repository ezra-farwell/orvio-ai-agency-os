import { createClient } from "@supabase/supabase-js";

// Reads Vite env vars. Set these in .env once the Supabase project exists:
//   VITE_SUPABASE_URL=https://<ref>.supabase.co
//   VITE_SUPABASE_ANON_KEY=<anon key>
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Lets the app boot on mock data before Supabase is wired. The data layer
// checks this to decide whether to hit Supabase or fall back to mock.
export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = isSupabaseConfigured
  ? createClient(url!, anonKey!, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null;
