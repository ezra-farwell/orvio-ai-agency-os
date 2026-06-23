// Meta (Facebook/Instagram) Marketing API OAuth + ad-account discovery.
// Flow: the app opens the Meta consent URL with redirect_uri = this function.
// Meta redirects here with ?code&state; we exchange the code for a long-lived
// token (using the app secret, server-side), store it, and bounce back to the app.
//
// Required secrets (supabase secrets set ...):
//   META_APP_ID, META_APP_SECRET, APP_URL, SUPABASE_SERVICE_ROLE_KEY (auto)
import { cors, json, redirect, serviceClient, agencyIdFromAuth, signState, verifyState, APP_URL } from "../_shared/util.ts";

const GRAPH = "https://graph.facebook.com/v19.0";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const url = new URL(req.url);
  const action = url.searchParams.get("action");

  // 1) START — return the Meta consent URL for the app to open.
  if (action === "start") {
    const agencyId = await agencyIdFromAuth(req);
    if (!agencyId) return json({ error: "unauthorized" }, 401);
    const redirectUri = `${url.origin}${url.pathname}`; // this function's URL
    const consent = new URL("https://www.facebook.com/v19.0/dialog/oauth");
    consent.searchParams.set("client_id", Deno.env.get("META_APP_ID")!);
    consent.searchParams.set("redirect_uri", redirectUri);
    consent.searchParams.set("state", await signState(agencyId));
    consent.searchParams.set("scope", "ads_read,ads_management,business_management");
    return json({ url: consent.toString() });
  }

  // 2) CALLBACK — Meta redirects here with ?code&state(signed agencyId).
  const code = url.searchParams.get("code");
  const agencyId = await verifyState(url.searchParams.get("state"));
  if (!code || !agencyId) return json({ error: "missing code or invalid state" }, 400);

  const redirectUri = `${url.origin}${url.pathname}`;

  // exchange code → short-lived token
  const exch = new URL(`${GRAPH}/oauth/access_token`);
  exch.searchParams.set("client_id", Deno.env.get("META_APP_ID")!);
  exch.searchParams.set("client_secret", Deno.env.get("META_APP_SECRET")!);
  exch.searchParams.set("redirect_uri", redirectUri);
  exch.searchParams.set("code", code);
  const shortRes = await fetch(exch);
  const short = await shortRes.json();
  if (!short.access_token) return json({ error: "token exchange failed", detail: short }, 400);

  // upgrade to a long-lived token (~60 days)
  const longUrl = new URL(`${GRAPH}/oauth/access_token`);
  longUrl.searchParams.set("grant_type", "fb_exchange_token");
  longUrl.searchParams.set("client_id", Deno.env.get("META_APP_ID")!);
  longUrl.searchParams.set("client_secret", Deno.env.get("META_APP_SECRET")!);
  longUrl.searchParams.set("fb_exchange_token", short.access_token);
  const longRes = await fetch(longUrl);
  const long = await longRes.json();
  const token = long.access_token ?? short.access_token;
  const expiresIn = long.expires_in ?? 5184000;

  const sb = serviceClient();

  // who is this Meta user
  const meRes = await fetch(`${GRAPH}/me?access_token=${token}`);
  const me = await meRes.json();

  const { data: conn, error } = await sb
    .from("oauth_connections")
    .upsert({
      agency_id: agencyId,
      provider: "meta",
      external_user_id: me.id ?? null,
      access_token: token,
      scope: "ads_read,ads_management,business_management",
      expires_at: new Date(Date.now() + expiresIn * 1000).toISOString(),
      status: "active",
      updated_at: new Date().toISOString(),
    }, { onConflict: "agency_id,provider" })
    .select("id")
    .single();
  if (error) return json({ error: "store failed", detail: error.message }, 500);

  // discover ad accounts the agency can use (so they can be mapped to clients later)
  const acctsRes = await fetch(`${GRAPH}/me/adaccounts?fields=account_id,name,currency&access_token=${token}`);
  const accts = await acctsRes.json();
  if (Array.isArray(accts.data)) {
    // stash on the connection's metadata via a lightweight table is overkill here;
    // the app fetches available accounts via a separate call and maps them per client.
  }

  return redirect(`${APP_URL()}/app/settings/integrations?connected=meta&conn=${conn!.id}`);
});
