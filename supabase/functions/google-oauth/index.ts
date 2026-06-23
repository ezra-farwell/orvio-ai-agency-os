// Google Ads API OAuth.
// Same shape as meta-oauth: app opens consent URL → Google redirects here with
// ?code&state → exchange for access + refresh tokens → store → bounce to app.
//
// Required secrets:
//   GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, APP_URL, SUPABASE_SERVICE_ROLE_KEY (auto)
// Note: pulling Google Ads metrics also needs GOOGLE_ADS_DEVELOPER_TOKEN (see sync-insights).
import { cors, json, redirect, serviceClient, agencyIdFromAuth, signState, verifyState, APP_URL } from "../_shared/util.ts";

const SCOPE = "https://www.googleapis.com/auth/adwords";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const url = new URL(req.url);
  const action = url.searchParams.get("action");
  const redirectUri = `${url.origin}${url.pathname}`;

  // 1) START
  if (action === "start") {
    const agencyId = await agencyIdFromAuth(req);
    if (!agencyId) return json({ error: "unauthorized" }, 401);
    const consent = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    consent.searchParams.set("client_id", Deno.env.get("GOOGLE_CLIENT_ID")!);
    consent.searchParams.set("redirect_uri", redirectUri);
    consent.searchParams.set("response_type", "code");
    consent.searchParams.set("scope", SCOPE);
    consent.searchParams.set("access_type", "offline"); // get a refresh token
    consent.searchParams.set("prompt", "consent");
    consent.searchParams.set("state", await signState(agencyId));
    return json({ url: consent.toString() });
  }

  // 2) CALLBACK — Google redirects here with ?code&state(signed agencyId).
  const code = url.searchParams.get("code");
  const agencyId = await verifyState(url.searchParams.get("state"));
  if (!code || !agencyId) return json({ error: "missing code or invalid state" }, 400);

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: Deno.env.get("GOOGLE_CLIENT_ID")!,
      client_secret: Deno.env.get("GOOGLE_CLIENT_SECRET")!,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });
  const tok = await tokenRes.json();
  if (!tok.access_token) return json({ error: "token exchange failed", detail: tok }, 400);

  const sb = serviceClient();
  const { data: conn, error } = await sb
    .from("oauth_connections")
    .upsert({
      agency_id: agencyId,
      provider: "google",
      access_token: tok.access_token,
      refresh_token: tok.refresh_token ?? null,
      scope: SCOPE,
      expires_at: new Date(Date.now() + (tok.expires_in ?? 3600) * 1000).toISOString(),
      status: "active",
      updated_at: new Date().toISOString(),
    }, { onConflict: "agency_id,provider" })
    .select("id")
    .single();
  if (error) return json({ error: "store failed", detail: error.message }, 500);

  return redirect(`${APP_URL()}/app/settings/integrations?connected=google&conn=${conn!.id}`);
});
