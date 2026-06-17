// Stripe Connect (Standard OAuth). The agency connects its own Stripe account so
// it can invoice clients and collect homeowner payments under its brand.
// Flow mirrors meta/google: app opens the Stripe consent URL → Stripe redirects
// here with ?code&state → exchange code for the connected account id → store it.
//
// Required secrets: STRIPE_SECRET_KEY, STRIPE_CONNECT_CLIENT_ID, APP_URL.
import { cors, json, redirect, serviceClient, agencyIdFromAuth, APP_URL } from "../_shared/util.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const url = new URL(req.url);
  const action = url.searchParams.get("action");

  // 1) START — return the Stripe Connect consent URL.
  if (action === "start") {
    const agencyId = await agencyIdFromAuth(req);
    if (!agencyId) return json({ error: "unauthorized" }, 401);
    const consent = new URL("https://connect.stripe.com/oauth/authorize");
    consent.searchParams.set("response_type", "code");
    consent.searchParams.set("client_id", Deno.env.get("STRIPE_CONNECT_CLIENT_ID")!);
    consent.searchParams.set("scope", "read_write");
    consent.searchParams.set("state", agencyId);
    return json({ url: consent.toString() });
  }

  // 2) CALLBACK — Stripe redirects here with ?code&state(agencyId).
  const code = url.searchParams.get("code");
  const agencyId = url.searchParams.get("state");
  if (!code || !agencyId) return json({ error: "missing code/state" }, 400);

  const res = await fetch("https://connect.stripe.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_secret: Deno.env.get("STRIPE_SECRET_KEY")!,
      code,
      grant_type: "authorization_code",
    }),
  });
  const tok = await res.json();
  if (!tok.stripe_user_id) return json({ error: "stripe connect failed", detail: tok }, 400);

  const sb = serviceClient();
  const { error } = await sb.from("oauth_connections").upsert({
    agency_id: agencyId,
    provider: "stripe",
    external_user_id: tok.stripe_user_id, // the connected account, acct_...
    access_token: tok.access_token ?? null,
    refresh_token: tok.refresh_token ?? null,
    scope: "read_write",
    status: "active",
    updated_at: new Date().toISOString(),
  }, { onConflict: "agency_id,provider" });
  if (error) return json({ error: "store failed", detail: error.message }, 500);

  return redirect(`${APP_URL()}/app/settings/integrations?connected=stripe`);
});
