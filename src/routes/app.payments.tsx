import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { CheckCircle2, AlertTriangle, Loader2, Plus, X } from "lucide-react";
import { PageHeader, Card, KPI, StatusBadge } from "@/components/bits";
import {
  listInvoices,
  createInvoice,
  formatCents,
  type Invoice,
  type InvoiceStatus,
} from "@/lib/data/payments";
import { getClients } from "@/lib/data";
import { getConnections } from "@/lib/integrations";

export const Route = createFileRoute("/app/payments")({
  component: Payments,
  head: () => ({ meta: [{ title: "Payments — Orvio" }] }),
});

const badgeKind = (s: InvoiceStatus) =>
  s === "paid" ? "success" : s === "past_due" ? "danger" : s === "refunded" ? "neutral" : "indigo";

/** Treat an unpaid invoice past its due date as past_due for display. */
function displayStatus(inv: Invoice): InvoiceStatus {
  if (inv.status === "open" && inv.due_date && new Date(inv.due_date) < new Date()) {
    return "past_due";
  }
  return inv.status;
}

function Payments() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const { data: invoices = [], isLoading, error } = useQuery({
    queryKey: ["invoices"],
    queryFn: listInvoices,
  });
  const { data: connections = [] } = useQuery({
    queryKey: ["connections"],
    queryFn: getConnections,
  });

  const stripeConnected =
    connections.find((c) => c.provider === "stripe")?.status === "active";

  const kpis = useMemo(() => {
    const paid = invoices.filter((i) => i.status === "paid");
    const outstanding = invoices.filter(
      (i) => i.status === "open" || i.status === "past_due",
    );
    const grossCents = paid.reduce((sum, i) => sum + i.amount_cents, 0);
    const outstandingCents = outstanding.reduce((sum, i) => sum + i.amount_cents, 0);
    const refundedCents = invoices
      .filter((i) => i.status === "refunded")
      .reduce((sum, i) => sum + i.amount_cents, 0);
    const pastDue = invoices.filter((i) => displayStatus(i) === "past_due").length;
    return {
      gross: formatCents(grossCents),
      paidCount: paid.length,
      total: invoices.length,
      outstanding: formatCents(outstandingCents),
      pastDue,
      refunded: formatCents(refundedCents),
    };
  }, [invoices]);

  return (
    <>
      <PageHeader
        title="Payments"
        sub="Invoices, payouts, and Stripe Connect status."
        actions={
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            disabled={!stripeConnected}
            title={stripeConnected ? "Create a new invoice" : "Connect Stripe first"}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-foreground px-3 text-[13px] font-medium text-background hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-3.5 w-3.5" /> New invoice
          </button>
        }
      />
      <div className="space-y-6 px-6 pb-10">
        <div className="grid gap-3 md:grid-cols-4">
          <KPI label="Gross revenue · paid" value={kpis.gross} />
          <KPI label="Paid invoices" value={`${kpis.paidCount}`} sub={`of ${kpis.total}`} />
          <KPI label="Outstanding" value={kpis.outstanding} sub={`${kpis.pastDue} past due`} />
          <KPI label="Refunded" value={kpis.refunded} />
        </div>

        {/* Stripe Connect status */}
        <Card className="p-4">
          {stripeConnected ? (
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-[var(--success)]" />
              <div>
                <div className="text-[14px] font-semibold">Stripe Connect connected</div>
                <div className="text-[12px] text-muted-foreground">
                  Payments route directly to your Stripe account.
                </div>
              </div>
              <span className="ml-auto chip-success">Healthy</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-[var(--warning)]" />
              <div>
                <div className="text-[14px] font-semibold">Stripe not connected</div>
                <div className="text-[12px] text-muted-foreground">
                  Connect your Stripe account to send invoices and collect payments.
                </div>
              </div>
              <Link
                to="/app/settings/integrations"
                className="ml-auto inline-flex h-9 items-center rounded-lg bg-foreground px-3 text-[13px] font-medium text-background hover:bg-foreground/90"
              >
                Connect Stripe
              </Link>
            </div>
          )}
        </Card>

        {showForm && stripeConnected && (
          <NewInvoiceForm
            onClose={() => setShowForm(false)}
            onCreated={async () => {
              setShowForm(false);
              await queryClient.invalidateQueries({ queryKey: ["invoices"] });
            }}
          />
        )}

        <Card>
          <div className="p-5 pb-2 text-[15px] font-semibold">Invoices</div>
          {isLoading ? (
            <div className="flex items-center gap-2 px-5 py-8 text-[13px] text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading invoices…
            </div>
          ) : error ? (
            <div className="px-5 py-8 text-[13px] text-muted-foreground">
              Invoices could not be loaded. The billing tables may not be set up yet.
            </div>
          ) : invoices.length === 0 ? (
            <div className="px-5 py-8 text-[13px] text-muted-foreground">
              No invoices yet. Create your first invoice to bill a client.
            </div>
          ) : (
            <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-[13px]">
              <thead className="bg-[var(--surface-2)] text-left text-[11.5px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-2">Invoice</th>
                  <th className="px-4 py-2">Client</th>
                  <th className="px-4 py-2">Description</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {invoices.map((inv) => {
                  const s = displayStatus(inv);
                  return (
                    <tr key={inv.id} className="hover:bg-[var(--surface-2)]/60">
                      <td className="px-4 py-2.5 mono">{inv.number}</td>
                      <td className="px-4 py-2.5 font-medium">{inv.clientName ?? "—"}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{inv.description ?? "—"}</td>
                      <td className="px-4 py-2.5 mono">{formatCents(inv.amount_cents, inv.currency)}</td>
                      <td className="px-4 py-2.5">
                        <StatusBadge kind={badgeKind(s)}>
                          {s.replace("_", " ")}
                        </StatusBadge>
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground">
                        {new Date(inv.created_at).toLocaleDateString([], { month: "short", day: "numeric" })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

function NewInvoiceForm({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => Promise<void>;
}) {
  const { data: clients = [] } = useQuery({ queryKey: ["clients"], queryFn: getClients });
  const [clientId, setClientId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>();

  async function submit() {
    setError(undefined);
    const dollars = Number(amount);
    if (!clientId) return setError("Select a client.");
    if (!Number.isFinite(dollars) || dollars <= 0) return setError("Enter a valid amount.");
    setSubmitting(true);
    try {
      await createInvoice({
        clientId,
        amountCents: Math.round(dollars * 100),
        description: description.trim() || undefined,
        dueDate: dueDate || undefined,
      });
      await onCreated();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create the invoice.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div className="text-[15px] font-semibold">New invoice</div>
        <button type="button" onClick={onClose} className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-[var(--surface-2)]">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-[12px] font-medium text-muted-foreground">Client</span>
          <select
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-[13px] outline-none focus:border-[var(--accent)]"
          >
            <option value="">Select a client…</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-[12px] font-medium text-muted-foreground">Amount (USD)</span>
          <input
            type="number" min="0" step="0.01" value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="1200.00"
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-[13px] outline-none focus:border-[var(--accent)]"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-[12px] font-medium text-muted-foreground">Description</span>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="April retainer"
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-[13px] outline-none focus:border-[var(--accent)]"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-[12px] font-medium text-muted-foreground">Due date (optional)</span>
          <input
            type="date" value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-[13px] outline-none focus:border-[var(--accent)]"
          />
        </label>
      </div>
      {error && (
        <div className="mt-3 rounded-lg border border-[var(--danger)]/30 bg-[var(--danger-soft)] px-3 py-2 text-[12.5px] text-[var(--danger)]">
          {error}
        </div>
      )}
      <div className="mt-4 flex justify-end gap-2">
        <button type="button" onClick={onClose} className="inline-flex h-9 items-center rounded-lg border border-border bg-background px-3 text-[13px] font-medium">
          Cancel
        </button>
        <button
          type="button" onClick={submit} disabled={submitting}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-foreground px-3 text-[13px] font-medium text-background hover:bg-foreground/90 disabled:opacity-60"
        >
          {submitting ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Creating…</> : "Create invoice"}
        </button>
      </div>
    </Card>
  );
}
