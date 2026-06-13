import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Check, X, ChevronDown } from "lucide-react";

const strategyModels = [
  { name: "Gemini 2.5 Flash", tier: "Free", credits: 5 },
  { name: "Gemini 2.5 Pro", tier: "Standard", credits: 20 },
  { name: "Command R+", tier: "Standard", credits: 25 },
  { name: "Mistral Large", tier: "Standard", credits: 30 },
  { name: "Claude Opus 4.8", tier: "Premium", credits: 60 },
  { name: "GPT-5.5", tier: "Maximum", credits: 75 },
] as const;

const imageModels = [
  { name: "Nano Banana Pro", credits: 15 },
  { name: "Premium Image Model", credits: 35 },
] as const;

type Creative = {
  hook: string;
  headline: string;
  body: string;
  cta: string;
  placement: string;
  score: number;
};

const baseCreatives: Creative[] = [
  {
    hook: "Trust First",
    headline: "Roof checked in 48 hours",
    body: "Summit Roofing helps Grand Rapids homeowners get a clear picture of storm damage. Free inspection, no pressure, no guesswork.",
    cta: "Book Now",
    placement: "1:1 Feed",
    score: 84,
  },
  {
    hook: "Problem-Aware",
    headline: "Storm damage can hide",
    body: "Most homeowners don't see the damage until it becomes a $15,000 repair. Get a free inspection before it gets worse.",
    cta: "Schedule Free",
    placement: "4:5 Feed",
    score: 87,
  },
  {
    hook: "Social Proof",
    headline: "Trusted by local homeowners",
    body: "Summit Roofing has helped 200+ Grand Rapids families with storm claims. 4.9 stars. No pressure — just honest answers.",
    cta: "Get Quote",
    placement: "1:1 Feed",
    score: 79,
  },
  {
    hook: "Contrast Frame",
    headline: "See what we fix",
    body: "Before and after from real Grand Rapids roofs. Storm damage isn't always obvious — let us show you what to look for.",
    cta: "Book Now",
    placement: "9:16 Story",
    score: 91,
  },
];

type DropdownProps<T> = {
  label: string;
  value: T;
  options: readonly T[];
  render: (o: T) => string;
  badge?: (o: T) => string;
  meta: (o: T) => string;
  onChange: (o: T) => void;
};

function Dropdown<T>({ label, value, options, render, badge, meta, onChange }: DropdownProps<T>) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-text-muted">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 rounded-lg border border-border bg-background px-3.5 py-2.5 text-left text-sm transition-colors hover:border-indigo/50"
      >
        <span className="flex items-center gap-2 truncate">
          {render(value)}
          {badge && (
            <span className="rounded-full border border-border bg-surface px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-text-muted">
              {badge(value)}
            </span>
          )}
        </span>
        <span className="flex items-center gap-2 font-mono text-xs text-amber">
          {meta(value)}
          <ChevronDown className={`h-3.5 w-3.5 text-text-muted transition-transform ${open ? "rotate-180" : ""}`} />
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-border bg-surface-elevated shadow-2xl"
          >
            {options.map((o, i) => {
              const isActive = o === value;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    onChange(o);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left text-sm transition-colors ${
                    isActive ? "bg-indigo/10 text-foreground" : "hover:bg-surface"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {render(o)}
                    {badge && (
                      <span className="rounded-full border border-border px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-text-muted">
                        {badge(o)}
                      </span>
                    )}
                  </span>
                  <span className="font-mono text-xs text-amber">{meta(o)}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

type CardState = "idle" | "approved" | "rejected";

export function StudioDemo() {
  const [strategy, setStrategy] = useState(strategyModels[4]);
  const [image, setImage] = useState(imageModels[0]);
  const [phase, setPhase] = useState<"idle" | "generating" | "ready">("idle");
  const [progress, setProgress] = useState(0);
  const [cards, setCards] = useState<CardState[]>(["idle", "idle", "idle", "idle"]);
  const [toast, setToast] = useState<string | null>(null);

  const credits = strategy.credits + image.credits;
  const approvedCount = cards.filter((c) => c === "approved").length;
  const totalDecided = cards.filter((c) => c !== "idle").length;

  const generate = () => {
    if (phase === "generating") return;
    setPhase("generating");
    setProgress(0);
    setCards(["idle", "idle", "idle", "idle"]);
    const start = performance.now();
    const tick = () => {
      const t = Math.min(1, (performance.now() - start) / 2500);
      setProgress(t);
      if (t < 1) requestAnimationFrame(tick);
      else setPhase("ready");
    };
    requestAnimationFrame(tick);
  };

  const decide = (i: number, decision: CardState) => {
    setCards((prev) => {
      const next = [...prev];
      next[i] = decision;
      return next;
    });
    if (decision === "approved") {
      const newCount = cards.filter((c) => c === "approved").length + 1;
      setToast(`${newCount} of 4 approved · Push to Meta when ready →`);
      window.setTimeout(() => setToast(null), 3200);
    }
  };

  const briefFields = useMemo(
    () => [
      ["Business", "Summit Roofing Co."],
      ["Industry", "Roofing"],
      ["Location", "Grand Rapids, MI"],
      ["Offer", "Free storm damage inspection within 48 hours"],
      ["Goal", "Generate qualified inspection leads"],
      ["Budget", "$3,000/month"],
    ],
    [],
  );

  return (
    <div className="surface-elev relative overflow-hidden">
      <div className="h-1 w-full bg-background">
        <motion.div
          className="h-full bg-gradient-to-r from-indigo via-[#8B5CF6] to-amber"
          animate={{ width: `${phase === "ready" ? 100 : progress * 100}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      <div className="grid gap-0 lg:grid-cols-[420px_1fr]">
        <div className="space-y-4 border-b border-border p-6 lg:border-b-0 lg:border-r">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
              New Campaign Brief
            </div>
            <div className="mt-1 text-sm font-medium text-foreground">
              Summit Roofing Co. <span className="text-text-faint">(pre-filled)</span>
            </div>
          </div>

          <div className="space-y-2.5">
            {briefFields.map(([k, v]) => (
              <div key={k} className="rounded-lg border border-border bg-background px-3 py-2">
                <div className="text-[10px] uppercase tracking-wider text-text-faint">{k}</div>
                <div className="text-sm text-foreground/90">{v}</div>
              </div>
            ))}
          </div>

          <Dropdown
            label="Strategy model"
            value={strategy}
            options={strategyModels}
            render={(o) => o.name}
            badge={(o) => o.tier}
            meta={(o) => `${o.credits} cr`}
            onChange={setStrategy}
          />

          <Dropdown
            label="Image model"
            value={image}
            options={imageModels}
            render={(o) => o.name}
            meta={(o) => `${o.credits} cr`}
            onChange={setImage}
          />

          <div className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2.5">
            <span className="text-xs text-text-muted">Credit estimate</span>
            <span className="font-mono text-base font-semibold text-amber">{credits} credits</span>
          </div>

          <button
            onClick={generate}
            disabled={phase === "generating"}
            className={`flex w-full items-center justify-center gap-2 rounded-lg bg-amber px-4 py-3 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-80 ${
              phase === "idle" ? "pulse-amber" : ""
            }`}
          >
            <Sparkles className="h-4 w-4" />
            {phase === "generating"
              ? `Generating 4 creatives with ${strategy.name}...`
              : phase === "ready"
              ? "Regenerate Campaign"
              : "Generate Campaign"}
          </button>
        </div>

        <div className="relative p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
              Generated Creatives
            </div>
            <div className="font-mono text-xs text-text-muted">
              {phase === "ready" ? `${approvedCount}/4 approved · ${totalDecided}/4 reviewed` : "Awaiting generation"}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {baseCreatives.map((c, i) => (
              <CreativeCard
                key={i}
                creative={c}
                state={cards[i]}
                visible={phase === "ready"}
                delay={i * 0.12}
                onApprove={() => decide(i, "approved")}
                onReject={() => decide(i, "rejected")}
              />
            ))}
          </div>

          {phase === "idle" && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-surface-elevated/40 backdrop-blur-[2px]">
              <div className="text-center">
                <div className="text-sm font-medium text-text-muted">
                  Press <span className="text-amber">Generate Campaign</span> to see real output structure.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="pointer-events-none fixed bottom-6 right-6 z-40 rounded-lg border border-success/40 bg-success/10 px-4 py-2.5 text-sm text-success backdrop-blur"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CreativeCard({
  creative,
  state,
  visible,
  delay,
  onApprove,
  onReject,
}: {
  creative: Creative;
  state: CardState;
  visible: boolean;
  delay: number;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, delay }}
      className={`relative overflow-hidden rounded-xl border border-border bg-background p-5 transition-all ${
        state === "rejected" ? "opacity-50" : ""
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="rounded-full border border-amber/30 bg-amber/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-amber">
          {creative.hook}
        </span>
        <span
          className={`grid h-9 w-9 place-items-center rounded-full border font-mono text-sm font-semibold ${
            creative.score >= 85
              ? "border-success/40 bg-success/10 text-success"
              : "border-warning/40 bg-warning/10 text-warning"
          }`}
        >
          {creative.score}
        </span>
      </div>

      <h5 className="font-display text-lg font-bold leading-tight">{creative.headline}</h5>
      <p className="mt-2 text-sm leading-relaxed text-foreground/80">{creative.body}</p>

      <div className="mt-3 flex items-center gap-2 text-[11px] text-text-muted">
        <span className="rounded-md border border-border px-1.5 py-0.5">{creative.cta}</span>
        <span>·</span>
        <span className="font-mono">{creative.placement}</span>
      </div>

      <ul className="mt-3 space-y-1 text-[11px] text-text-muted">
        <li className="text-success">✓ Offer visible in first scan</li>
        <li className="text-success">✓ CTA matches objective</li>
        <li className="text-success">✓ No prohibited claim language</li>
      </ul>

      <div className="mt-4 flex gap-2">
        <button
          onClick={onReject}
          disabled={state !== "idle"}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-danger/40 px-3 py-2 text-xs font-medium text-danger transition-colors hover:bg-danger/10 disabled:opacity-60"
        >
          <X className="h-3.5 w-3.5" /> Reject
        </button>
        <button
          onClick={onApprove}
          disabled={state !== "idle"}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-indigo px-3 py-2 text-xs font-medium text-white transition-all hover:brightness-110 disabled:opacity-60"
        >
          <Check className="h-3.5 w-3.5" /> Approve
        </button>
      </div>

      <AnimatePresence>
        {state === "approved" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center bg-success/15 backdrop-blur-[2px]"
          >
            <span className="rounded-full border border-success/40 bg-background px-4 py-1.5 text-sm font-medium text-success">
              ✓ Approved
            </span>
          </motion.div>
        )}
        {state === "rejected" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <span className="rounded-full border border-danger/40 bg-background px-4 py-1.5 text-sm font-medium text-danger">
              ✕ Rejected
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
