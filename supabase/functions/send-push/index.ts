// Internal push sender (FCM HTTP v1). Called by other functions with the service
// role key. Resolves the agency + portal users for a client, looks up their device
// tokens, and sends a notification to each.
//
// Required secrets to actually deliver: FCM_PROJECT_ID and FCM_SERVICE_ACCOUNT
// (the Firebase service-account JSON, as a single env string). Without them it
// no-ops gracefully so the caller never fails.
import { cors, json, serviceClient } from "../_shared/util.ts";

function b64url(buf: Uint8Array): string {
  return btoa(String.fromCharCode(...buf)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function mintAccessToken(sa: { client_email: string; private_key: string }): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const enc = new TextEncoder();
  const header = b64url(enc.encode(JSON.stringify({ alg: "RS256", typ: "JWT" })));
  const claim = b64url(enc.encode(JSON.stringify({
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/firebase.messaging",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  })));
  const signingInput = `${header}.${claim}`;

  const pem = sa.private_key
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s+/g, "");
  const der = Uint8Array.from(atob(pem), (c) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey(
    "pkcs8", der, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"],
  );
  const sig = new Uint8Array(await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, enc.encode(signingInput)));
  const jwt = `${signingInput}.${b64url(sig)}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  const tok = await res.json();
  if (!tok.access_token) throw new Error("FCM auth failed");
  return tok.access_token as string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  // Internal only.
  const auth = req.headers.get("Authorization") ?? "";
  if (auth !== `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`) {
    return json({ error: "unauthorized" }, 401);
  }

  const { client_id, title, body, url } = await req.json().catch(() => ({}));
  const saRaw = Deno.env.get("FCM_SERVICE_ACCOUNT");
  const projectId = Deno.env.get("FCM_PROJECT_ID");
  if (!saRaw || !projectId) return json({ skipped: "FCM not configured" });

  const sb = serviceClient();
  const { data: client } = await sb.from("clients").select("agency_id").eq("id", client_id).maybeSingle();
  if (!client) return json({ error: "client not found" }, 404);

  // Recipients: every agency user of this client's agency + the client's portal users.
  const { data: profiles } = await sb
    .from("profiles")
    .select("id")
    .or(`agency_id.eq.${client.agency_id},client_id.eq.${client_id}`);
  const userIds = (profiles ?? []).map((p: { id: string }) => p.id);
  if (userIds.length === 0) return json({ sent: 0 });

  const { data: tokens } = await sb.from("device_tokens").select("token").in("user_id", userIds);
  const list = (tokens ?? []).map((t: { token: string }) => t.token);
  if (list.length === 0) return json({ sent: 0 });

  const accessToken = await mintAccessToken(JSON.parse(saRaw));
  let sent = 0;
  for (const token of list) {
    const r = await fetch(`https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        message: {
          token,
          notification: { title: title ?? "Orvio", body: body ?? "" },
          data: url ? { url } : {},
        },
      }),
    });
    if (r.ok) sent++;
  }
  return json({ sent });
});
