// Pull spend/leads from connected ad accounts into metric_snapshots, then roll
// up onto clients.leads / monthly_spend / cpl. Run on demand or on a schedule
// (Supabase cron). Uses the service role to bypass RLS.
//
// Body: { client_id?: string }  — omit to sync every client in every agency.
// Required secrets: SUPABASE_SERVICE_ROLE_KEY (auto). Google Ads also needs
//   GOOGLE_ADS_DEVELOPER_TOKEN (and a refresh-token flow) to query metrics.
import { cors, json, serviceClient } from "../_shared/util.ts";

const GRAPH = "https://graph.facebook.com/v19.0";
const today = () => new Date().toISOString().slice(0, 10);

// ---- Meta: last-30-day insights for one ad account ----
async function syncMeta(token: string, externalId: string) {
  const acct = externalId.startsWith("act_") ? externalId : `act_${externalId}`;
  const u = new URL(`${GRAPH}/${acct}/insights`);
  u.searchParams.set("fields", "spend,impressions,clicks,actions");
  u.searchParams.set("date_preset", "last_30d");
  u.searchParams.set("access_token", token);
  const res = await fetch(u);
  const data = await res.json();
  const row = data?.data?.[0];
  if (!row) return null;
  // count lead actions if present
  const leads = (row.actions ?? []).find((a: { action_type: string; value: string }) =>
    a.action_type === "lead" || a.action_type === "offsite_conversion.fb_pixel_lead"
  );
  return {
    spend: Number(row.spend ?? 0),
    impressions: Number(row.impressions ?? 0),
    clicks: Number(row.clicks ?? 0),
    leads: leads ? Number(leads.value) : 0,
  };
}

// ---- Google Ads: scaffold. Requires GOOGLE_ADS_DEVELOPER_TOKEN + a fresh access
// token (refresh the stored refresh_token first), then POST a GAQL query to
// https://googleads.googleapis.com/v17/customers/<id>/googleAds:searchStream.
async function syncGoogle(_refreshToken: string, _customerId: string) {
  // TODO: refresh access token, then run a GAQL query for metrics.cost_micros,
  // metrics.clicks, metrics.impressions, metrics.conversions over LAST_30_DAYS.
  // Returns null until GOOGLE_ADS_DEVELOPER_TOKEN is provisioned + app approved.
  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const sb = serviceClient();
  const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
  const onlyClient: string | undefined = body.client_id;

  // ad accounts to sync, joined to their agency connection (for the token)
  let q = sb.from("ad_accounts").select("id, client_id, provider, external_id, connection_id");
  if (onlyClient) q = q.eq("client_id", onlyClient);
  const { data: accounts, error } = await q;
  if (error) return json({ error: error.message }, 500);

  let synced = 0;
  const touchedClients = new Set<string>();

  for (const a of accounts ?? []) {
    const { data: conn } = await sb
      .from("oauth_connections")
      .select("access_token, refresh_token, status")
      .eq("id", a.connection_id)
      .single();
    if (!conn || conn.status !== "active" || !conn.access_token) continue;

    const metrics =
      a.provider === "meta"
        ? await syncMeta(conn.access_token, a.external_id)
        : await syncGoogle(conn.refresh_token ?? "", a.external_id);
    if (!metrics) continue;

    await sb.from("metric_snapshots").upsert(
      { client_id: a.client_id, provider: a.provider, date: today(), ...metrics },
      { onConflict: "client_id,provider,date" },
    );
    synced++;
    touchedClients.add(a.client_id);
  }

  // recompute client rollups
  for (const cid of touchedClients) {
    await sb.rpc("rpc_rollup_client", { p_client_id: cid });
  }

  return json({ ok: true, accountsSynced: synced, clients: [...touchedClients] });
});
