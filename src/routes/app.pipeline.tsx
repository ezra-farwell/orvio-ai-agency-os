import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, GripVertical, Check, X } from "lucide-react";
import { PageHeader } from "@/components/bits";
import { leads as seedLeads } from "@/mock/data";

export const Route = createFileRoute("/app/pipeline")({
  component: Pipeline,
  head: () => ({ meta: [{ title: "Pipeline — Orvio" }] }),
});

type Card = {
  id: string;
  name: string;
  client: string;
  campaign: string;
  source: string;
  submitted: string;
  columnId: string;
};

type Column = { id: string; name: string; tone: string };

const STORAGE_KEY = "orvio.pipeline.v2";

const DEFAULT_COLUMNS: Column[] = [
  { id: "new",       name: "New",           tone: "bg-[var(--accent-soft)] text-[var(--accent)]" },
  { id: "contacted", name: "Contacted",     tone: "bg-[var(--surface-2)] text-foreground" },
  { id: "booked",    name: "Booked",        tone: "bg-[var(--accent-soft)] text-[var(--accent)]" },
  { id: "estimate",  name: "Estimate Sent", tone: "bg-[var(--warning-soft)] text-[#B45309]" },
  { id: "won",       name: "Won",           tone: "bg-[var(--success-soft)] text-[var(--success)]" },
  { id: "lost",      name: "Lost",          tone: "bg-[var(--danger-soft)] text-[var(--danger)]" },
];

const STATUS_TO_COL: Record<string, string> = {
  New: "new", Contacted: "contacted", Booked: "booked",
  "Estimate Sent": "estimate", Won: "won", Lost: "lost",
};

function seedCards(): Card[] {
  return seedLeads.map((l) => ({
    id: l.id, name: l.name, client: l.client, campaign: l.campaign,
    source: l.source, submitted: l.submitted,
    columnId: STATUS_TO_COL[l.status] ?? "new",
  }));
}

function Pipeline() {
  const [columns, setColumns] = useState<Column[]>(DEFAULT_COLUMNS);
  const [cards, setCards] = useState<Card[]>(seedCards());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [dragId, setDragId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.columns) setColumns(parsed.columns);
        if (parsed.cards) setCards(parsed.cards);
      }
    } catch {}
    setLoaded(true);
  }, []);

  // Persist
  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ columns, cards }));
  }, [columns, cards, loaded]);

  function startEdit(c: Column) {
    setEditingId(c.id);
    setEditName(c.name);
  }
  function commitEdit() {
    if (!editingId) return;
    const n = editName.trim();
    if (n) setColumns((cols) => cols.map((c) => (c.id === editingId ? { ...c, name: n } : c)));
    setEditingId(null);
  }
  function addColumn() {
    const id = `col_${Date.now()}`;
    setColumns((cols) => [...cols, { id, name: "New stage", tone: "bg-[var(--surface-2)] text-foreground" }]);
    setEditingId(id);
    setEditName("New stage");
  }
  function deleteColumn(id: string) {
    if (columns.length <= 1) return;
    const fallback = columns.find((c) => c.id !== id)!.id;
    setCards((cs) => cs.map((c) => (c.columnId === id ? { ...c, columnId: fallback } : c)));
    setColumns((cs) => cs.filter((c) => c.id !== id));
  }
  function resetBoard() {
    setColumns(DEFAULT_COLUMNS);
    setCards(seedCards());
  }

  function onDrop(columnId: string) {
    if (!dragId) return;
    setCards((cs) => cs.map((c) => (c.id === dragId ? { ...c, columnId } : c)));
    setDragId(null);
    setDropTarget(null);
  }

  return (
    <>
      <PageHeader
        title="Pipeline"
        sub="Drag prospects across stages. Rename columns to match your sales process."
        actions={
          <>
            <button
              onClick={addColumn}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-[13px] hover:bg-[var(--surface-2)]"
            >
              <Plus className="h-3.5 w-3.5" /> Add column
            </button>
            <button
              onClick={resetBoard}
              className="inline-flex h-9 items-center rounded-lg border border-border bg-background px-3 text-[13px] text-muted-foreground hover:text-foreground"
            >
              Reset
            </button>
          </>
        }
      />
      <div className="px-6 pb-10">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {columns.map((col) => {
            const items = cards.filter((c) => c.columnId === col.id);
            const active = dropTarget === col.id;
            return (
              <div
                key={col.id}
                onDragOver={(e) => { e.preventDefault(); setDropTarget(col.id); }}
                onDragLeave={() => setDropTarget((t) => (t === col.id ? null : t))}
                onDrop={() => onDrop(col.id)}
                className={`flex min-h-[440px] w-[280px] flex-shrink-0 flex-col rounded-2xl border bg-[var(--surface-2)]/50 p-3 transition-colors ${
                  active ? "border-[var(--accent)] bg-[var(--accent-soft)]/40" : "border-border"
                }`}
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  {editingId === col.id ? (
                    <div className="flex flex-1 items-center gap-1">
                      <input
                        autoFocus
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") commitEdit();
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        className="h-7 flex-1 rounded-md border border-border bg-background px-2 text-[12.5px] outline-none focus:ring-1 focus:ring-[var(--accent)]"
                      />
                      <button onClick={commitEdit} className="grid h-7 w-7 place-items-center rounded-md hover:bg-[var(--surface-2)]"><Check className="h-3.5 w-3.5" /></button>
                      <button onClick={() => setEditingId(null)} className="grid h-7 w-7 place-items-center rounded-md hover:bg-[var(--surface-2)]"><X className="h-3.5 w-3.5" /></button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(col)}
                        className={`group inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11.5px] font-semibold ${col.tone}`}
                      >
                        {col.name} <span className="opacity-60">{items.length}</span>
                        <Pencil className="h-2.5 w-2.5 opacity-0 transition-opacity group-hover:opacity-70" />
                      </button>
                      <button
                        onClick={() => deleteColumn(col.id)}
                        disabled={columns.length <= 1}
                        title="Delete column"
                        className="grid h-6 w-6 place-items-center rounded-md text-muted-foreground hover:bg-[var(--surface-2)] hover:text-[var(--danger)] disabled:opacity-30"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </>
                  )}
                </div>

                <div className="flex-1 space-y-2 overflow-y-auto">
                  {items.map((l) => (
                    <div
                      key={l.id}
                      draggable
                      onDragStart={() => setDragId(l.id)}
                      onDragEnd={() => { setDragId(null); setDropTarget(null); }}
                      className={`group cursor-grab rounded-lg border border-border bg-background p-3 active:cursor-grabbing ${
                        dragId === l.id ? "opacity-40" : "hover:border-foreground/30"
                      }`}
                    >
                      <div className="flex items-start gap-1.5">
                        <GripVertical className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/40 group-hover:text-muted-foreground" />
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-[13px] font-semibold">{l.name}</div>
                          <div className="mt-0.5 truncate text-[11.5px] text-muted-foreground">{l.client}</div>
                          <div className="mt-2 truncate text-[11px] text-muted-foreground">{l.campaign}</div>
                          <div className="mt-2 flex items-center justify-between text-[10.5px] text-muted-foreground">
                            <span>{l.source}</span><span>{l.submitted}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {items.length === 0 && (
                    <div className="rounded-lg border border-dashed border-border p-4 text-center text-[12px] text-muted-foreground">
                      Drop leads here
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <button
            onClick={addColumn}
            className="flex min-h-[440px] w-[200px] flex-shrink-0 items-center justify-center gap-1.5 rounded-2xl border border-dashed border-border text-[13px] text-muted-foreground hover:border-foreground/40 hover:text-foreground"
          >
            <Plus className="h-4 w-4" /> Add column
          </button>
        </div>
      </div>
    </>
  );
}
