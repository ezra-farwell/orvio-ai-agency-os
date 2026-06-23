import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { PageHeader, Card, StatusBadge } from "@/components/bits";
import {
  listClientInvoices,
  payInvoice,
  formatCents,
  type Invoice,
  type InvoiceStatus,
} from "@/lib/data/payments";

export const Route = createFileRoute("/portal/payments")({
  validateSearch: z.object({
    paid: z.string().optional().catch(undefined),
    canceled: z.string().optional().catch(undefined),
  }),
  component: PortalPay,
  head: () => ({ meta: [{ title: "Payments — Client portal" }] }),
});

const badgeKind = (s: InvoiceStatus) =>
  s === "paid" ? "success" : s === "past_due" ? "danger" : "neutral";

function displayStatus(inv: Invoice): InvoiceStatus {
  if (inv.status === "open" && inv.due_date && new Date(inv.due_date) < new Date()) {
    return "past_due";
  }
  return inv.status;
}

function PortalPay() {
  const search = Route.useSearch();
  const { data: invoices = [], isLoading, error } = useQuery({
    queryKey: ["client-invoices"],
    queryFn: listClientInvoices,
  });
  const [payingId, setPayingId] = useState<string>();
  const [payError, setPayError] = useState<string>();

  const nextDue = invoices.find((i) => displayStatus(i) !== "paid");

  async function pay(invoiceId: string) {
    setPayError(undefined);
    setPayingId(invoiceId);
    try {
      const url = await payInvoice(invoiceId);
      window.location.href = url; // redirect to Stripe Checkout
    } catch (e) {
      setPayError(e instanceof Error ? e.message : "Could not start payment.");
      setPayingId(undefined);
    }
  }

  return (
    <>
      <PageHeader title="Payments" sub="Invoices from your agency. Pay securely in one click." />
      <div className="space-y-6 px-6 pb-10">
        {search.paid && (
          <div className="flex items-center gap-2 rounded-lg border border-[var(--success)]/30 bg-[var(--success-soft)] px-3 py-2.5 text-[13px] text-[var(--success)]">
            <CheckCircle2 className="h-4 w-4" /> Payment received — thank you! It may take a moment to show as paid.
          </div>
        )}
        {search.canceled && (
          <div className="rounded-lg border border-border bg-[var(--surface-2)] px-3 py-2.5 text-[13px] text-muted-foreground">
            Payment canceled. You can pay any time below.
          </div>
        )}
        {payError && (
          <div className="rounded-lg border border-[var(--danger)]/30 bg-[var(--danger-soft)] px-3 py-2.5 text-[13px] text-[var(--danger)]">
            {payError}
          </div>
        )}

        {nextDue && (
          <Card className="flex flex-wrap items-center justify-between gap-4 p-5">
            <div>
              <div className="text-[12px] text-muted-foreground">Next invoice</div>
              <div className="text-[20px] font-semibold tracking-tight">
                {formatCents(nextDue.amount_cents, nextDue.currency)}
                {nextDue.due_date && ` due ${new Date(nextDue.due_date).toLocaleDateString([], { month: "short", day: "numeric" })}`}
              </div>
              <div className="text-[12.5px] text-muted-foreground">
                {nextDue.description ?? nextDue.number}
              </div>
            </div>
            <button
              type="button"
              onClick={() => pay(nextDue.id)}
              disabled={Boolean(payingId)}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-foreground px-4 text-[13px] font-medium text-background hover:bg-foreground/90 disabled:opacity-60"
            >
              {payingId === nextDue.id ? <><Loader2 className="h-4 w-4 animate-spin" /> Redirecting…</> : "Pay now"}
            </button>
          </Card>
        )}

        <Card>
          <div className="p-5 pb-2 text-[15px] font-semibold">Invoice history</div>
          {isLoading ? (
            <div className="flex items-center gap-2 px-5 py-8 text-[13px] text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading…
            </div>
          ) : error ? (
            <div className="px-5 py-8 text-[13px] text-muted-foreground">
              Invoices could not be loaded right now.
            </div>
          ) : invoices.length === 0 ? (
            <div className="px-5 py-8 text-[13px] text-muted-foreground">
              No invoices yet. Anything your agency sends you will appear here.
            </div>
          ) : (
            <table className="w-full text-[13px]">
              <thead className="bg-[var(--surface-2)] text-left text-[11.5px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-2">Invoice</th>
                  <th className="px-4 py-2">Description</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {invoices.map((inv) => {
                  const s = displayStatus(inv);
                  return (
                    <tr key={inv.id}>
                      <td className="px-4 py-2.5 mono">{inv.number}</td>
                      <td className="px-4 py-2.5 font-medium">{inv.description ?? "—"}</td>
                      <td className="px-4 py-2.5 mono">{formatCents(inv.amount_cents, inv.currency)}</td>
                      <td className="px-4 py-2.5">
                        <StatusBadge kind={badgeKind(s)}>{s.replace("_", " ")}</StatusBadge>
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground">
                        {new Date(inv.created_at).toLocaleDateString([], { month: "short", day: "numeric" })}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        {s !== "paid" && s !== "void" && s !== "refunded" && (
                          <button
                            type="button"
                            onClick={() => pay(inv.id)}
                            disabled={Boolean(payingId)}
                            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-foreground px-2.5 text-[12px] font-medium text-background hover:bg-foreground/90 disabled:opacity-60"
                          >
                            {payingId === inv.id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Pay"}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </>
  );
}
