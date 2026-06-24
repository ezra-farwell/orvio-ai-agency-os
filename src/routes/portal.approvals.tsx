import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader, Card, StatusBadge } from "@/components/bits";
import { getClientAssets, reviewAsset, type ReviewAsset } from "@/lib/data/approvals";
import { Check, X, MessageCircle, Loader2, CheckCheck } from "lucide-react";

export const Route = createFileRoute("/portal/approvals")({
  component: Approvals,
  head: () => ({ meta: [{ title: "Content approvals — Client portal" }] }),
});

function Approvals() {
  const queryClient = useQueryClient();
  const { data: assets = [], isLoading } = useQuery({ queryKey: ["client-assets"], queryFn: getClientAssets });
  const [busyId, setBusyId] = useState<string>();
  const [changingId, setChangingId] = useState<string>();
  const [note, setNote] = useState("");
  const [error, setError] = useState<string>();

  const groups = {
    pending: assets.filter((a) => a.reviewStatus === "pending"),
    approved: assets.filter((a) => a.reviewStatus === "approved"),
    changes: assets.filter((a) => a.reviewStatus === "changes"),
  };

  async function act(asset: ReviewAsset, approve: boolean, changeNote?: string) {
    setBusyId(asset.id);
    setError(undefined);
    try {
      await reviewAsset(asset.id, approve, changeNote);
      setChangingId(undefined);
      setNote("");
      await queryClient.invalidateQueries({ queryKey: ["client-assets"] });
    } catch {
      setError("That didn't go through. Please try again.");
    } finally {
      setBusyId(undefined);
    }
  }

  if (isLoading) {
    return (
      <>
        <PageHeader title="Content approvals" sub="Review and approve creative from your agency." />
        <div className="flex items-center gap-2 px-6 py-12 text-[13px] text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading creative…
        </div>
      </>
    );
  }

  if (assets.length === 0) {
    return (
      <>
        <PageHeader title="Content approvals" sub="Review and approve creative from your agency." />
        <div className="px-6 pb-10">
          <div className="grid place-items-center rounded-2xl border border-dashed border-border px-6 py-16 text-center">
            <span className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-[var(--surface)] text-muted-foreground">
              <CheckCheck className="h-5 w-5" />
            </span>
            <div className="mt-3 text-[14px] font-medium">Nothing to review right now</div>
            <div className="mt-1 max-w-sm text-[12.5px] text-muted-foreground">
              When your agency shares new ads or creative for sign-off, they'll show up here.
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Content approvals"
        sub={`${groups.pending.length} waiting for you · ${groups.approved.length} approved · ${groups.changes.length} need changes`}
      />
      {error && (
        <div className="mx-6 mb-3 rounded-lg border border-[var(--danger)]/30 bg-[var(--danger-soft)] px-3 py-2.5 text-[12.5px] text-[var(--danger)]">{error}</div>
      )}
      <div className="grid gap-4 px-6 pb-10 lg:grid-cols-3">
        <Column title="Pending your approval" count={groups.pending.length} tone="indigo">
          {groups.pending.map((a) => (
            <Card key={a.id} className="p-4">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{a.kind}{a.platform ? ` · ${a.platform}` : ""}</div>
              <div className="mt-1 text-[14px] font-semibold">{a.title}</div>
              {a.thumb && <img src={a.thumb} alt="" className="mt-3 max-h-44 w-full rounded-lg border border-border object-cover" />}
              {changingId === a.id ? (
                <div className="mt-3">
                  <textarea
                    rows={2}
                    autoFocus
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="What needs to change?"
                    className="w-full rounded-md border border-border bg-background p-2 text-[12.5px] outline-none focus:border-[var(--accent)]"
                  />
                  <div className="mt-2 flex gap-2">
                    <button disabled={busyId === a.id} onClick={() => act(a, false, note)} className="inline-flex h-8 items-center gap-1.5 rounded-md bg-foreground px-2.5 text-[12px] font-medium text-background disabled:opacity-60">
                      {busyId === a.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <MessageCircle className="h-3 w-3" />} Send feedback
                    </button>
                    <button onClick={() => { setChangingId(undefined); setNote(""); }} className="inline-flex h-8 items-center rounded-md border border-border bg-background px-2.5 text-[12px]">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="mt-3 flex gap-2">
                  <button disabled={busyId === a.id} onClick={() => act(a, true)} className="inline-flex h-9 flex-1 items-center justify-center gap-1 rounded-lg bg-[var(--success)] text-[13px] font-medium text-white disabled:opacity-60">
                    {busyId === a.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />} Approve
                  </button>
                  <button onClick={() => { setChangingId(a.id); setNote(""); }} className="inline-flex h-9 flex-1 items-center justify-center gap-1 rounded-lg border border-border bg-background text-[13px] font-medium">
                    <MessageCircle className="h-3.5 w-3.5" /> Request changes
                  </button>
                </div>
              )}
            </Card>
          ))}
          {groups.pending.length === 0 && <Empty>Nothing to review.</Empty>}
        </Column>

        <Column title="Approved" count={groups.approved.length} tone="success">
          {groups.approved.map((a) => (
            <Card key={a.id} className="p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="text-[14px] font-semibold">{a.title}</div>
                <StatusBadge kind="success"><Check className="h-3 w-3" />Approved</StatusBadge>
              </div>
              <div className="mt-1 text-[11.5px] text-muted-foreground">{a.kind} · ready for your agency to publish</div>
            </Card>
          ))}
          {groups.approved.length === 0 && <Empty>Approve something to see it here.</Empty>}
        </Column>

        <Column title="Requested changes" count={groups.changes.length} tone="warning">
          {groups.changes.map((a) => (
            <Card key={a.id} className="p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="text-[14px] font-semibold">{a.title}</div>
                <StatusBadge kind="warning"><X className="h-3 w-3" />Changes</StatusBadge>
              </div>
              {a.approvalNote && (
                <div className="mt-2 rounded-md border border-border bg-[var(--surface-2)]/70 p-2.5 text-[12px] leading-relaxed text-muted-foreground">
                  "{a.approvalNote}"
                </div>
              )}
              <button disabled={busyId === a.id} onClick={() => act(a, true)} className="mt-3 inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-2.5 text-[12px] font-medium disabled:opacity-60">
                {busyId === a.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />} Approve instead
              </button>
            </Card>
          ))}
          {groups.changes.length === 0 && <Empty>No pending change requests.</Empty>}
        </Column>
      </div>
    </>
  );
}

function Column({ title, count, tone, children }: { title: string; count: number; tone: "indigo" | "success" | "warning"; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="text-[13px] font-semibold">{title}</div>
        <StatusBadge kind={tone}>{count}</StatusBadge>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
function Empty({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-dashed border-border bg-background p-6 text-center text-[12.5px] text-muted-foreground">{children}</div>;
}
