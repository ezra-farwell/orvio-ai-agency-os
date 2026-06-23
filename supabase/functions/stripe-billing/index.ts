// Orvio billing — create invoices and collect payment via the agency's connected
// Stripe account (Stripe Connect direct charges). Three actions:
//
//   ?action=create   (agency auth)  -> insert an invoice row for one of the agency's clients
//   ?action=pay      (agency or that client's portal user) -> create a Stripe Checkout
//                       Session on the agency's connected account, return the hosted URL
//   ?action=webhook  (Stripe, signed) -> mark the invoice paid / refunded
//
// Money lands in the AGENCY's Stripe balance (direct charge). Orvio never holds funds.
//
// Required secrets:
//   STRIPE_SECRET_KEY            (platform secret key, sk_...)
//   STRIPE_WEBHOOK_SECRET        (the Connect webhook signing secret, whsec_...)
//   APP_URL, SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY (auto)
import Stripe from "https://esm.sh/stripe@17.7.0?target=deno";
import { cors, json, serviceClient, agencyIdFromAuth, userClient, APP_URL } from "../_shared/util.ts";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
  httpClient: Stripe.createFetchHttpClient(),
  apiVersion: "2025-03-31.basil",
});

/** The agency's connected Stripe account id (acct_...), or null if not connected. */
async function connectedAccount(agencyId: string): Promise<string | null> {
  const sb = serviceClient();
  const { data } = await sb
    .from("oauth_connections")
    .select("external_user_id, status")
    .eq("agency_id", agencyId)
    .eq("provider", "stripe")
    .maybeSingle();
  if (!data || data.status !== "active" || !data.external_user_id) return null;
  return data.external_user_id as string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const action = new URL(req.url).searchParams.get("action");

  // ---- Stripe webhook: flip invoice status (no CORS / no app auth; verified by signature) ----
  if (action === "webhook") {
    const sig = req.headers.get("stripe-signature");
    if (!sig) return new Response("missing signature", { status: 400 });
    const body = await req.text();
    let event: Stripe.Event;
    try {
      event = await stripe.webhooks.constructEventAsync(
        body,
        sig,
        Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? "",
        undefined,
        Stripe.createSubtleCryptoProvider(),
      );
    } catch (e) {
      return new Response(`bad signature: ${e instanceof Error ? e.message : e}`, { status: 400 });
    }

    const sb = serviceClient();
    if (event.type === "checkout.session.completed") {
      const s = event.data.object as Stripe.Checkout.Session;
      const invoiceId = s.metadata?.invoice_id;
      if (invoiceId && s.payment_status === "paid") {
        await sb.from("invoices").update({
          status: "paid",
          paid_at: new Date().toISOString(),
          stripe_payment_intent_id: typeof s.payment_intent === "string" ? s.payment_intent : null,
        }).eq("id", invoiceId);
      }
    } else if (event.type === "charge.refunded") {
      const c = event.data.object as Stripe.Charge;
      const pi = typeof c.payment_intent === "string" ? c.payment_intent : null;
      if (pi) {
        await sb.from("invoices").update({ status: "refunded" })
          .eq("stripe_payment_intent_id", pi);
      }
    }
    return json({ received: true });
  }

  // ---- Create an invoice (agency only) ----
  if (action === "create") {
    const agencyId = await agencyIdFromAuth(req);
    if (!agencyId) return json({ error: "unauthorized" }, 401);

    const b = await req.json().catch(() => ({}));
    const clientId: string | undefined = b.client_id;
    const amountCents = Math.round(Number(b.amount_cents));
    const description: string | null = b.description ?? null;
    const dueDate: string | null = b.due_date ?? null;
    if (!clientId || !Number.isFinite(amountCents) || amountCents <= 0) {
      return json({ error: "client_id and a positive amount_cents are required" }, 400);
    }

    const sb = serviceClient();
    // Validate the client belongs to this agency before writing.
    const { data: client } = await sb.from("clients")
      .select("id, agency_id").eq("id", clientId).maybeSingle();
    if (!client || client.agency_id !== agencyId) {
      return json({ error: "client not in your agency" }, 403);
    }

    const { data: invoice, error } = await sb.from("invoices").insert({
      agency_id: agencyId,
      client_id: clientId,
      description,
      amount_cents: amountCents,
      currency: (b.currency ?? "usd").toLowerCase(),
      due_date: dueDate,
      status: "open",
    }).select("*").single();
    if (error) return json({ error: "could not create invoice", detail: error.message }, 500);

    return json({ invoice });
  }

  // ---- Create a Checkout Session for an invoice (agency OR that client's portal user) ----
  if (action === "pay") {
    const b = await req.json().catch(() => ({}));
    const invoiceId: string | undefined = b.invoice_id;
    if (!invoiceId) return json({ error: "invoice_id required" }, 400);

    // RLS does the authorization: the caller can only SELECT invoices they own
    // (their agency's, or their own client's). If the row comes back, they're allowed.
    const scoped = userClient(req);
    if (!scoped) return json({ error: "unauthorized" }, 401);
    const { data: invoice } = await scoped.from("invoices").select("*").eq("id", invoiceId).maybeSingle();
    if (!invoice) return json({ error: "invoice not found" }, 404);
    if (invoice.status === "paid") return json({ error: "invoice already paid" }, 409);

    const acct = await connectedAccount(invoice.agency_id);
    if (!acct) return json({ error: "the agency has not connected Stripe yet" }, 409);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{
        quantity: 1,
        price_data: {
          currency: invoice.currency,
          unit_amount: invoice.amount_cents,
          product_data: { name: invoice.description || `Invoice ${invoice.number}` },
        },
      }],
      success_url: `${APP_URL()}/portal/payments?paid=${invoice.id}`,
      cancel_url: `${APP_URL()}/portal/payments?canceled=${invoice.id}`,
      metadata: { invoice_id: invoice.id },
      payment_intent_data: { metadata: { invoice_id: invoice.id } },
    }, { stripeAccount: acct });

    // Stash the session so the webhook and UI can reference it.
    await serviceClient().from("invoices").update({
      stripe_checkout_session_id: session.id,
      hosted_invoice_url: session.url,
    }).eq("id", invoice.id);

    return json({ url: session.url });
  }

  return json({ error: "unknown action" }, 400);
});
