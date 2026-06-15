import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, ArrowLeft, Check, Building2, Palette, Globe, Users,
  Sparkles, Upload, Plus, X, BarChart3, ShieldCheck,
} from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
  head: () => ({ meta: [{ title: "Get started — Orvio" }] }),
});

const steps = [
  { id: "workspace", label: "Workspace", icon: Building2 },
  { id: "brand",     label: "Branding",  icon: Palette },
  { id: "domain",    label: "Domain",    icon: Globe },
  { id: "connect",   label: "Connect",   icon: BarChart3 },
  { id: "client",    label: "First client", icon: Users },
  { id: "done",      label: "Done",      icon: Check },
] as const;

type StepId = (typeof steps)[number]["id"];

const swatches = ["#4F46E5", "#0EA5E9", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#111111"];

function Onboarding() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    agency: "Northstar Growth",
    teamSize: "2–5",
    color: "#4F46E5",
    logoUploaded: false,
    domain: "portal.northstargrowth.com",
    meta: false,
    google: false,
    stripe: false,
    clientName: "Hartland Plumbing",
    clientCity: "Detroit, MI",
    clientService: "Plumbing",
  });
  const current = steps[step].id as StepId;
  const pct = Math.round(((step) / (steps.length - 1)) * 100);

  const next = () => setStep(s => Math.min(s + 1, steps.length - 1));
  const back = () => setStep(s => Math.max(s - 1, 0));

  return (
    <div className="min-h-screen bg-[var(--surface-2)]/40">
      {/* Top bar */}
      <div className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1100px] items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-foreground"><span className="h-1.5 w-1.5 rounded-full bg-background" /></span>
            <span className="text-[15px] font-semibold tracking-tight">Orvio</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-[12px] text-muted-foreground sm:inline">Setup · {pct}% complete</span>
            <Link to="/app" className="text-[12.5px] text-muted-foreground hover:text-foreground">Skip for now</Link>
          </div>
        </div>
        <div className="h-0.5 w-full bg-border">
          <motion.div
            className="h-full bg-[var(--accent)]"
            initial={false}
            animate={{ width: `${pct}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 22 }}
          />
        </div>
      </div>

      <div className="mx-auto grid max-w-[1100px] gap-8 px-6 py-10 md:grid-cols-[240px_1fr]">
        {/* Stepper */}
        <aside className="md:sticky md:top-24 md:self-start">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Get started</div>
          <h2 className="mt-1 text-[18px] font-semibold tracking-tight">Set up your agency</h2>
          <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">A few minutes now and your white-label portal is live.</p>
          <ol className="mt-5 space-y-1">
            {steps.map((s, i) => {
              const active = i === step;
              const done = i < step;
              return (
                <li key={s.id}>
                  <button
                    onClick={() => i <= step && setStep(i)}
                    disabled={i > step}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors ${
                      active ? "bg-background shadow-soft" : done ? "text-foreground hover:bg-background/60" : "text-muted-foreground"
                    }`}
                  >
                    <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-semibold ${
                      done ? "bg-[var(--success)] text-white" : active ? "bg-foreground text-background" : "bg-border text-muted-foreground"
                    }`}>
                      {done ? <Check className="h-3 w-3" /> : i + 1}
                    </span>
                    <span className="flex-1 truncate">{s.label}</span>
                    {active && <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />}
                  </button>
                </li>
              );
            })}
          </ol>
        </aside>

        {/* Card */}
        <main>
          <div className="rounded-2xl border border-border bg-background shadow-soft">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22 }}
                className="p-6 md:p-8"
              >
                {current === "workspace" && <WorkspaceStep data={data} setData={setData} />}
                {current === "brand" && <BrandStep data={data} setData={setData} />}
                {current === "domain" && <DomainStep data={data} setData={setData} />}
                {current === "connect" && <ConnectStep data={data} setData={setData} />}
                {current === "client" && <ClientStep data={data} setData={setData} />}
                {current === "done" && <DoneStep data={data} />}
              </motion.div>
            </AnimatePresence>

            {current !== "done" && (
              <div className="flex items-center justify-between gap-3 border-t border-border px-6 py-4 md:px-8">
                <button
                  onClick={back}
                  disabled={step === 0}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-[13px] font-medium text-foreground disabled:opacity-40"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back
                </button>
                <div className="text-[12px] text-muted-foreground">Step {step + 1} of {steps.length}</div>
                <button
                  onClick={next}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-foreground px-3.5 text-[13px] font-medium text-background hover:bg-foreground/90"
                >
                  Continue <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center gap-2 text-[11.5px] text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" /> Your data is encrypted at rest and in transit.
          </div>
        </main>
      </div>
    </div>
  );
}

/* ---------- Step components ---------- */

type DataT = {
  agency: string; teamSize: string; color: string; logoUploaded: boolean;
  domain: string; meta: boolean; google: boolean; stripe: boolean;
  clientName: string; clientCity: string; clientService: string;
};

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-[12px] font-medium text-foreground">{label}</div>
      {hint && <div className="text-[11.5px] text-muted-foreground">{hint}</div>}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function StepHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub: string }) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">{eyebrow}</div>
      <h1 className="mt-1.5 text-[24px] font-semibold leading-tight tracking-tight md:text-[26px]">{title}</h1>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">{sub}</p>
    </div>
  );
}

function WorkspaceStep({ data, setData }: { data: DataT; setData: (d: DataT) => void }) {
  return (
    <div className="space-y-6">
      <StepHead
        eyebrow="Step 1"
        title="Name your agency workspace"
        sub="This is the workspace your team logs into. Your clients won't see this name — they'll see your brand on their portal."
      />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Agency name">
          <input
            value={data.agency}
            onChange={e => setData({ ...data, agency: e.target.value })}
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-[13.5px] outline-none focus:border-[var(--accent)]"
          />
        </Field>
        <Field label="Team size">
          <select
            value={data.teamSize}
            onChange={e => setData({ ...data, teamSize: e.target.value })}
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-[13.5px] outline-none focus:border-[var(--accent)]"
          >
            <option>Just me</option>
            <option>2–5</option>
            <option>6–15</option>
            <option>16+</option>
          </select>
        </Field>
      </div>
      <Field label="What kind of clients do you mostly serve?" hint="We'll tailor templates and benchmarks to your verticals.">
        <div className="flex flex-wrap gap-2">
          {["Plumbing","HVAC","Roofing","Remodeling","Electrical","Landscaping","Other"].map(v => (
            <button key={v} type="button" className="rounded-full border border-border bg-background px-3 py-1.5 text-[12.5px] hover:border-foreground/40 hover:bg-[var(--surface-2)]">
              {v}
            </button>
          ))}
        </div>
      </Field>
    </div>
  );
}

function BrandStep({ data, setData }: { data: DataT; setData: (d: DataT) => void }) {
  return (
    <div className="space-y-6">
      <StepHead
        eyebrow="Step 2"
        title="Make the portal feel like yours"
        sub="Drop in your logo and pick an accent color. Your client portal updates live as you go."
      />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <Field label="Logo" hint="SVG or PNG. Transparent background works best.">
            <button
              type="button"
              onClick={() => setData({ ...data, logoUploaded: !data.logoUploaded })}
              className={`flex h-24 w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed text-[12.5px] transition-colors ${
                data.logoUploaded ? "border-[var(--success)]/40 bg-[var(--success-soft)]/40 text-[var(--success)]" : "border-border bg-[var(--surface-2)]/40 text-muted-foreground hover:border-foreground/30"
              }`}
            >
              {data.logoUploaded ? (
                <><Check className="h-4 w-4" /> logo.svg uploaded</>
              ) : (
                <><Upload className="h-4 w-4" /> Drag a file or click to upload</>
              )}
            </button>
          </Field>

          <Field label="Accent color">
            <div className="flex flex-wrap gap-2">
              {swatches.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setData({ ...data, color: c })}
                  className={`h-8 w-8 rounded-full border-2 transition-transform ${data.color === c ? "scale-110 border-foreground" : "border-transparent"}`}
                  style={{ background: c }}
                  aria-label={c}
                />
              ))}
            </div>
          </Field>
        </div>

        {/* Live preview */}
        <div>
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Live preview</div>
          <div className="mt-2 overflow-hidden rounded-xl border border-border bg-background shadow-soft">
            <div className="flex items-center justify-between border-b border-border px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="grid h-5 w-5 place-items-center rounded text-white" style={{ background: data.color }}>
                  <span className="text-[10px] font-bold">{data.agency[0]}</span>
                </span>
                <span className="text-[12px] font-semibold">{data.agency || "Your agency"}</span>
              </div>
              <span className="text-[10px] text-muted-foreground">portal preview</span>
            </div>
            <div className="space-y-2 p-3">
              <div className="rounded-md bg-[var(--surface-2)] p-2.5">
                <div className="text-[10px] text-muted-foreground">This month's leads</div>
                <div className="mt-0.5 text-[18px] font-semibold">63</div>
              </div>
              <button
                type="button"
                className="flex h-8 w-full items-center justify-center rounded-md text-[12px] font-medium text-white"
                style={{ background: data.color }}
              >
                View report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DomainStep({ data, setData }: { data: DataT; setData: (d: DataT) => void }) {
  return (
    <div className="space-y-6">
      <StepHead
        eyebrow="Step 3"
        title="Point a domain at your portal"
        sub="Your clients log into a domain that's yours. You can use a subdomain like portal.youragency.com, or use ours for now."
      />
      <Field label="Portal domain" hint="We'll generate the DNS records to add to your registrar.">
        <div className="flex items-center overflow-hidden rounded-lg border border-border bg-background focus-within:border-[var(--accent)]">
          <span className="select-none border-r border-border bg-[var(--surface-2)] px-3 py-2.5 text-[12.5px] text-muted-foreground">https://</span>
          <input
            value={data.domain}
            onChange={e => setData({ ...data, domain: e.target.value })}
            className="h-10 w-full flex-1 bg-transparent px-3 text-[13.5px] outline-none"
          />
        </div>
      </Field>

      <div className="rounded-lg border border-border bg-[var(--surface-2)]/50 p-4">
        <div className="text-[12px] font-semibold">DNS records to add</div>
        <div className="mt-2.5 space-y-1.5 font-mono text-[11.5px]">
          {[
            ["CNAME", "portal", "cname.orvio.app"],
            ["TXT", "_orvio-verify", "ov-verify-9c8b1e2a"],
          ].map(([t,h,v]) => (
            <div key={h} className="grid grid-cols-[60px_140px_1fr] gap-3 rounded-md border border-border bg-background px-2.5 py-2">
              <span className="text-muted-foreground">{t}</span>
              <span>{h}</span>
              <span className="truncate">{v}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11.5px] leading-relaxed text-muted-foreground">
          Don't have a domain ready? Skip — your portal is live at <span className="font-medium text-foreground">{data.agency.toLowerCase().replace(/\s+/g, "")}.orvio.app</span> in the meantime.
        </p>
      </div>
    </div>
  );
}

function ConnectStep({ data, setData }: { data: DataT; setData: (d: DataT) => void }) {
  const items = [
    { key: "meta" as const,   name: "Meta Ads",   sub: "Pull spend, leads, and creative for every ad account.", on: data.meta },
    { key: "google" as const, name: "Google Ads", sub: "Search, PMax, and Demand Gen reporting in real time.", on: data.google },
    { key: "stripe" as const, name: "Stripe Connect", sub: "Bill clients and route payments through your account.", on: data.stripe },
  ];
  return (
    <div className="space-y-6">
      <StepHead
        eyebrow="Step 4"
        title="Connect your ad accounts"
        sub="You can connect now or later. None of your clients see these screens — only your team does."
      />
      <div className="space-y-2.5">
        {items.map(it => (
          <div key={it.key} className="flex items-center gap-3 rounded-xl border border-border bg-background p-4">
            <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${it.on ? "bg-[var(--success-soft)] text-[var(--success)]" : "bg-[var(--surface-2)] text-muted-foreground"}`}>
              {it.on ? <Check className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[13.5px] font-semibold">{it.name}</div>
              <div className="text-[12px] text-muted-foreground">{it.sub}</div>
            </div>
            <button
              type="button"
              onClick={() => setData({ ...data, [it.key]: !it.on } as DataT)}
              className={`inline-flex h-9 shrink-0 items-center rounded-lg px-3 text-[12.5px] font-medium ${
                it.on ? "border border-[var(--success)]/30 bg-[var(--success-soft)]/50 text-[var(--success)]" : "bg-foreground text-background hover:bg-foreground/90"
              }`}
            >
              {it.on ? "Connected" : "Connect"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClientStep({ data, setData }: { data: DataT; setData: (d: DataT) => void }) {
  return (
    <div className="space-y-6">
      <StepHead
        eyebrow="Step 5"
        title="Add your first client"
        sub="Just one for now — you can bulk-import after setup. They'll get a branded invite email."
      />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Client name">
          <input value={data.clientName} onChange={e=>setData({ ...data, clientName: e.target.value })}
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-[13.5px] outline-none focus:border-[var(--accent)]" />
        </Field>
        <Field label="Service area">
          <input value={data.clientCity} onChange={e=>setData({ ...data, clientCity: e.target.value })}
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-[13.5px] outline-none focus:border-[var(--accent)]" />
        </Field>
        <Field label="Vertical">
          <select value={data.clientService} onChange={e=>setData({ ...data, clientService: e.target.value })}
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-[13.5px] outline-none focus:border-[var(--accent)]">
            <option>Plumbing</option><option>HVAC</option><option>Roofing</option><option>Remodeling</option><option>Electrical</option><option>Landscaping</option>
          </select>
        </Field>
        <Field label="Monthly ad budget" hint="Used for benchmarks only.">
          <input defaultValue="$4,500" className="h-10 w-full rounded-lg border border-border bg-background px-3 text-[13.5px] outline-none focus:border-[var(--accent)]" />
        </Field>
      </div>

      <div className="rounded-xl border border-dashed border-border bg-[var(--surface-2)]/40 p-4">
        <div className="flex items-center gap-2 text-[12.5px] font-semibold"><Plus className="h-3.5 w-3.5" /> Invite client contacts</div>
        <div className="mt-2.5 space-y-1.5">
          {[
            ["Carlos Reyes", "carlos@hartlandplumbing.com", "Owner"],
            ["Mia Tran", "mia@hartlandplumbing.com", "Office manager"],
          ].map(([n,e,r]) => (
            <div key={e} className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-[12.5px]">
              <div>
                <div className="font-medium">{n}</div>
                <div className="text-[11.5px] text-muted-foreground">{e} · {r}</div>
              </div>
              <button className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-[var(--surface-2)]"><X className="h-3.5 w-3.5" /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DoneStep({ data }: { data: DataT }) {
  return (
    <div className="space-y-6 py-2 text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 14 }}
        className="mx-auto grid h-14 w-14 place-items-center rounded-full"
        style={{ background: `${data.color}1A`, color: data.color }}
      >
        <Check className="h-6 w-6" />
      </motion.div>
      <div>
        <h1 className="text-[26px] font-semibold tracking-tight">You're live, {data.agency}.</h1>
        <p className="mx-auto mt-1.5 max-w-md text-[13.5px] leading-relaxed text-muted-foreground">
          Your white-label portal is ready. Hop into the agency workspace to invite your team and start reporting.
        </p>
      </div>
      <div className="mx-auto grid max-w-md gap-2 text-left">
        {[
          ["Workspace created", data.agency],
          ["Portal domain", data.domain],
          ["First client added", data.clientName],
          ["Integrations", [data.meta && "Meta", data.google && "Google", data.stripe && "Stripe"].filter(Boolean).join(" · ") || "None yet"],
        ].map(([k,v]) => (
          <div key={k as string} className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-[12.5px]">
            <span className="text-muted-foreground">{k}</span>
            <span className="font-medium">{v}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
        <Link to="/app" className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-foreground px-4 text-[13.5px] font-medium text-background hover:bg-foreground/90">
          Open agency portal <ArrowRight className="h-4 w-4" />
        </Link>
        <Link to="/portal" className="inline-flex h-10 items-center rounded-lg border border-border bg-background px-4 text-[13.5px] font-medium hover:bg-[var(--surface-2)]">
          Preview client view
        </Link>
      </div>
    </div>
  );
}
