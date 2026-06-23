// Billing data layer. Invoices live in the `invoices` table (RLS-scoped):
// agencies manage their own; client-portal users read their own. Creating an
// invoice and starting a payment go through the `stripe-billing` Edge Function,
// which talks to the agency's connected Stripe account.
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

export type InvoiceStatus =
  | "draft" | "open" | "paid" | "past_due" | "void" | "refunded";

export type Invoice = {
  id: string;
  number: string;
  client_id: string;
  clientName?: string;
  description: string | null;
  amount_cents: number;
  currency: string;
  status: InvoiceStatus;
  due_date: string | null;
  hosted_invoice_url: string | null;
  paid_at: string | null;
  created_at: string;
};

const COLUMNS =
  "id, number, client_id, description, amount_cents, currency, status, due_date, hosted_invoice_url, paid_at, created_at";

function requireClient() {
  if (!isSupabaseConfigured || !supabase) throw new Error("Supabase not configured.");
  return supabase;
}

/** Agency view — every invoice for the caller's agency (RLS), with the client name. */
export async function listInvoices(): Promise<Invoice[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  const { data, error } = await supabase
    .from("invoices")
    .select(`${COLUMNS}, clients(name)`)
    .order("created_at", { ascending: false });
  if (error) throw error;
  // Without the generated Database type, the embedded `clients` join is inferred
  // as an array; at runtime a to-one FK comes back as a single object. Handle both.
  const rows = (data ?? []) as unknown as Array<
    Invoice & { clients?: { name: string } | { name: string }[] | null }
  >;
  return rows.map((r) => {
    const c = Array.isArray(r.clients) ? r.clients[0] : r.clients;
    return { ...r, clientName: c?.name ?? undefined };
  });
}

/** Portal view — the signed-in client's own invoices (RLS). */
export async function listClientInvoices(): Promise<Invoice[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  const { data, error } = await supabase
    .from("invoices")
    .select(COLUMNS)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Invoice[];
}

/** Agency creates an invoice for one of its clients (no charge yet). */
export async function createInvoice(input: {
  clientId: string;
  amountCents: number;
  description?: string;
  dueDate?: string;
}): Promise<Invoice> {
  const sb = requireClient();
  const { data, error } = await sb.functions.invoke("stripe-billing?action=create", {
    method: "POST",
    body: {
      client_id: input.clientId,
      amount_cents: input.amountCents,
      description: input.description,
      due_date: input.dueDate,
    },
  });
  if (error) throw error;
  const payload = data as { invoice?: Invoice; error?: string };
  if (payload?.error) throw new Error(payload.error);
  if (!payload?.invoice) throw new Error("Invoice was not created.");
  return payload.invoice;
}

/** Start payment — returns a Stripe Checkout URL to redirect the payer to. */
export async function payInvoice(invoiceId: string): Promise<string> {
  const sb = requireClient();
  const { data, error } = await sb.functions.invoke("stripe-billing?action=pay", {
    method: "POST",
    body: { invoice_id: invoiceId },
  });
  if (error) throw error;
  const payload = data as { url?: string; error?: string };
  if (payload?.error) throw new Error(payload.error);
  if (!payload?.url) throw new Error("Could not start payment.");
  return payload.url;
}

/** Format integer cents as USD (or the invoice's currency). */
export function formatCents(cents: number, currency = "usd"): string {
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  });
}
