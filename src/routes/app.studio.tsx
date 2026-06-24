import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader, Card, StatusBadge } from "@/components/bits";
import { BrandLogo } from "@/components/BrandLogo";
import { getAssets, getClients } from "@/lib/data";
import { type ContentAsset } from "@/mock/data";
import { AIActionLink } from "@/components/orvio/AIActionMenu";
import { Wand2, Plus, FileText, Mail, BarChart3, Image as ImageIcon, Layout, Palette, Loader2 } from "lucide-react";

export const Route = createFileRoute("/app/studio")({
  component: StudioLayout,
  head: () => ({ meta: [{ title: "Content Studio — Orvio" }] }),
});

function StudioLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname !== "/app/studio") return <Outlet />;
  return <StudioHome />;
}

const TABS: { k: ContentAsset["kind"] | "All"; label: string }[] = [
  { k: "All", label: "All assets" },
  { k: "Ad", label: "Ads" },
  { k: "Social", label: "Social Posts" },
  { k: "Landing", label: "Landing Pages" },
  { k: "Email", label: "Emails" },
  { k: "Report", label: "Reports" },
  { k: "Brand", label: "Brand Assets" },
];
const STATUSES: ContentAsset["status"][] = ["Draft", "In Review", "Approved", "Scheduled", "Published"];

const QUICK_ACTIONS: { label: string; prompt: string }[] = [
  { label: "Generate ad", prompt: "Generate three high-converting paid-ad concepts (primary text + headline) for this client." },
  { label: "Rewrite headline", prompt: "Rewrite this ad headline into five punchier variations, no jargon." },
  { label: "Suggest CTA", prompt: "Suggest five strong calls-to-action for a local home-services ad." },
  { label: "New email", prompt: "Draft a short promotional email for this client's current offer." },
];

function StudioHome() {
  const { data: assets = [], isLoading } = useQuery({ queryKey: ["assets"], queryFn: getAssets });
  const { data: clients = [] } = useQuery({ queryKey: ["clients"], queryFn: getClients });
  const [tab, setTab] = useState<ContentAsset["kind"] | "All">("All");
  const [status, setStatus] = useState("All");
  const [client, setClient] = useState("All");

  const rows = useMemo(
    () => assets.filter((a) => (tab === "All" || a.kind === tab) && (status === "All" || a.status === status) && (client === "All" || a.client === client)),
    [assets, tab, status, client],
  );

  return (
    <>
      <PageHeader
        title="Content Studio"
        sub="AI-assisted creative production for every client."
        actions={
          <>
            <select value={client} onChange={(e) => setClient(e.target.value)} className="h-9 rounded-lg border border-border bg-background px-3 text-[13px]">
              <option>All</option>{clients.map((c) => <option key={c.id}>{c.name}</option>)}
            </select>
            <Link to="/app/studio/ads/new" className="inline-flex h-9 items-center gap-1 rounded-lg bg-foreground px-3 text-[13px] font-medium text-background"><Plus className="h-3.5 w-3.5" />Create new</Link>
          </>
        }
      />
      <div className="grid gap-6 px-6 pb-10 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {TABS.map((t) => (
              <button key={t.k} onClick={() => setTab(t.k)} className={`h-8 rounded-md px-3 text-[12.5px] font-medium ${tab === t.k ? "bg-foreground text-background" : "border border-border bg-background text-muted-foreground hover:text-foreground"}`}>{t.label}</button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[12px]">
            <span className="text-muted-foreground">Status:</span>
            {["All", ...STATUSES].map((s) => (
              <button key={s} onClick={() => setStatus(s)} className={`h-7 rounded-md px-2 ${status === s ? "bg-[var(--surface-2)] font-medium text-foreground" : "text-muted-foreground hover:text-foreground"}`}>{s}</button>
            ))}
          </div>
          {isLoading ? (
            <div className="flex items-center gap-2 px-1 py-10 text-[13px] text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading assets…
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {rows.map((a) => <AssetCard key={a.id} a={a} />)}
              {rows.length === 0 && (
                <Card className="p-10 text-center text-[13px] text-muted-foreground md:col-span-2 xl:col-span-3">
                  {assets.length === 0 ? "No creative yet — use the assistant to generate your first asset." : "No assets match those filters."}
                </Card>
              )}
            </div>
          )}
        </div>

        {/* Real AI assistant entry points */}
        <Card className="sticky top-20 h-fit p-4">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]"><Wand2 className="h-3.5 w-3.5" /></span>
            <div className="text-[14px] font-semibold">Studio assistant</div>
          </div>
          <div className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
            Generate ad copy, headlines, emails, and creative prompts with Orvio AI — grounded in each client's context.
          </div>
          <AIActionLink
            mode="creative_prompt"
            prompt="Help me create new ad creative for a client."
            clientId={clients.find((c) => c.name === client)?.id}
            className="mt-3 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-foreground px-3 text-[13px] font-medium text-background hover:opacity-90"
          >
            <Wand2 className="h-3.5 w-3.5" /> Open Studio assistant
          </AIActionLink>
          <div className="mt-3 grid grid-cols-2 gap-1.5">
            {QUICK_ACTIONS.map((a) => (
              <AIActionLink
                key={a.label}
                mode="creative_prompt"
                prompt={a.prompt}
                clientId={clients.find((c) => c.name === client)?.id}
                className="rounded-md border border-border bg-background px-2 py-1.5 text-center text-[11.5px] text-muted-foreground hover:bg-[var(--surface-2)] hover:text-foreground"
              >
                {a.label}
              </AIActionLink>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

const KIND_BG: Record<ContentAsset["kind"], string> = {
  Ad: "from-[#4F46E5] via-[#7C3AED] to-[#A972FF]",
  Social: "from-[#FE2C55] via-[#FF4F8A] to-[#FFB199]",
  Landing: "from-[#10B981] via-[#34D399] to-[#A7F3D0]",
  Email: "from-[#F59E0B] via-[#FBBF24] to-[#FDE68A]",
  Report: "from-[#0EA5E9] via-[#38BDF8] to-[#BAE6FD]",
  Brand: "from-[#1F2937] via-[#374151] to-[#6B7280]",
};
const KIND_ICON: Record<ContentAsset["kind"], typeof FileText> = {
  Ad: ImageIcon, Social: ImageIcon, Landing: Layout,
  Email: Mail, Report: BarChart3, Brand: Palette,
};

function AssetCard({ a }: { a: ContentAsset }) {
  const Icon = KIND_ICON[a.kind];
  return (
    <div className="rounded-2xl border border-border bg-background p-3">
      <div className={`relative grid aspect-[16/9] place-items-center overflow-hidden rounded-lg bg-gradient-to-br ${KIND_BG[a.kind]} text-white`}>
        {a.platform && (
          <div className="absolute right-2 top-2 rounded-md bg-black/30 p-1 backdrop-blur-sm">
            <BrandLogo name={a.platform} size={18} />
          </div>
        )}
        <div className="text-center">
          <Icon className="mx-auto h-8 w-8 opacity-90" />
          <div className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.15em] opacity-80">{a.kind}</div>
          {a.platform && <div className="text-[11.5px] font-semibold">{a.platform}</div>}
        </div>
      </div>
      <div className="mt-3">
        <div className="line-clamp-1 text-[13.5px] font-semibold">{a.title}</div>
        <div className="mt-0.5 text-[11.5px] text-muted-foreground">{a.client} · {a.updated}</div>
        <div className="mt-2 flex items-center justify-between">
          <StatusBadge kind={a.status === "Approved" || a.status === "Published" ? "success" : a.status === "In Review" ? "warning" : a.status === "Scheduled" ? "indigo" : "neutral"}>{a.status}</StatusBadge>
          <Link to="/app/studio/ads/new" className="text-[11.5px] font-medium text-[var(--accent)] hover:underline">Open →</Link>
        </div>
      </div>
    </div>
  );
}
