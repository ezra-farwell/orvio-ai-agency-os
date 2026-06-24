// Device-token registration for push notifications. The native (Capacitor) layer
// obtains an FCM/APNs token and calls registerDevice(); see orvio-ai/proxy/MOBILE.md
// for the native wiring snippet. Web push (VAPID) can call the same function later.
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

export type DevicePlatform = "ios" | "android" | "web";

/** Save (or refresh) this device's push token for the signed-in user. */
export async function registerDevice(token: string, platform: DevicePlatform): Promise<void> {
  if (!isSupabaseConfigured || !supabase || !token) return;
  const { data } = await supabase.auth.getUser();
  if (!data.user) return;
  await supabase.from("device_tokens").upsert(
    { user_id: data.user.id, token, platform, updated_at: new Date().toISOString() },
    { onConflict: "token" },
  );
}
