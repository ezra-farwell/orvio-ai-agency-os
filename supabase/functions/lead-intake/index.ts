// Public lead intake webhook. A contractor's form/funnel POSTs here with
// ?token=<client.intake_token>; we map it to the client, store the lead, and
// fire a best-effort push so the agency (and contractor) get pinged instantly.
//
// No app auth — the per-client token is the credential. Service role does the write.
import { cors, json, serviceClient } from "../_shared/util.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "POST only" }, 405);

  const token = new URL(req.url).searchParams.get("token");
  if (!token) return json({ error: "missing token" }, 400);

  const body = await req.json().catch(() => ({}));
  if (!body.name && !body.phone && !body.email) {
    return json({ error: "need at least a name, phone, or email" }, 400);
  }

  const sb = serviceClient();
  const { data: client } = await sb
    .from("clients")
    .select("id, agency_id, name")
    .eq("intake_token", token)
    .maybeSingle();
  if (!client) return json({ error: "invalid token" }, 404);

  // leads.source is the ad_platform enum; default form leads to Meta unless told otherwise.
  const source = body.source === "Google Ads" ? "Google Ads" : "Meta Ads";

  const { data: lead, error } = await sb
    .from("leads")
    .insert({
      client_id: client.id,
      name: body.name ?? "New lead",
      phone: body.phone ?? null,
      email: body.email ?? null,
      job_type: body.job_type ?? null,
      budget: body.budget ?? null,
      timeline: body.timeline ?? null,
      notes: body.notes ?? null,
      source,
      status: "New",
    })
    .select("id")
    .single();
  if (error) return json({ error: "could not save lead", detail: error.message }, 500);

  // Best-effort push — never block the intake response on it.
  try {
    await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-push`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
      },
      body: JSON.stringify({
        client_id: client.id,
        title: "New lead",
        body: `${body.name ?? "A new lead"} for ${client.name} — tap to call`,
        url: "/app/leads",
      }),
    });
  } catch {
    // push is best-effort
  }

  return json({ ok: true, lead_id: lead.id });
});
