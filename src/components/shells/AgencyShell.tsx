import { Link, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import { type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  LayoutDashboard, Users, BarChart3, Inbox, Kanban, MessageSquare,
  CreditCard, Sparkles, FileText, Settings, Search, Bell, Plug, LogOut,
} from "lucide-react";
import { getAgencies } from "@/lib/data";
import { getProfile, signOut } from "@/lib/auth";
import { MobileTabBar } from "./MobileTabBar";

const nav = [
  { to: "/app", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/app/ai", label: "Orvio AI", icon: Sparkles },
  { to: "/app/clients", label: "Clients", icon: Users },
  { to: "/app/reporting", label: "Ad Reporting", icon: BarChart3 },
  { to: "/app/leads", label: "Leads", icon: Inbox },
  { to: "/app/pipeline", label: "Pipeline", icon: Kanban },
  { to: "/app/messages", label: "Messages", icon: MessageSquare },
  { to: "/app/payments", label: "Payments", icon: CreditCard },
  { to: "/app/studio", label: "Content Studio", icon: Sparkles },
  { to: "/app/reports", label: "Reports", icon: FileText },
  { to: "/app/settings/integrations", label: "Integrations", icon: Plug },
  { to: "/app/settings/white-label", label: "Settings", icon: Settings },
] as const;

export function AgencyShell({ children }: { children?: ReactNode }) {
  const pathname = useRouterState({ select: s => s.location.pathname });
  const navigate = useNavigate();
  const { data: agencies = [] } = useQuery({ queryKey: ["agencies"], queryFn: getAgencies });
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: getProfile });
  const agency = agencies[0];
  const agencyName = agency?.name ?? "Your agency";
  const ownerName = profile?.full_name ?? agency?.owner ?? "Account";
  const initials = (s: string) => s.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");

  async function handleSignOut() {
    await signOut();
    navigate({ to: "/login" });
  }

  return (
    <div data-theme="dark" className="flex min-h-screen bg-[var(--background)] text-foreground">
      <aside className="hidden w-[244px] shrink-0 flex-col border-r border-border bg-background md:flex">
        <div className="flex h-14 items-center gap-2.5 border-b border-border px-4">
          <span className="grid h-6 w-6 place-items-center rounded bg-foreground">
            <span className="h-1 w-1 rounded-full bg-background" />
          </span>
          <span className="text-[14px] font-semibold tracking-tight">Orvio</span>
          <span className="ml-auto chip">Agency</span>
        </div>

        <div className="px-3 py-3">
          <div className="flex w-full items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-left text-[13px]">
            <span className="flex min-w-0 items-center gap-2">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded text-[10px] font-semibold text-white" style={{ background: agency?.brandColor ?? "var(--accent)" }}>{agencyName.charAt(0).toUpperCase()}</span>
              <span className="truncate font-medium">{agencyName}</span>
            </span>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 pb-4">
          {nav.map((n) => {
            const active = ("exact" in n && n.exact) ? pathname === n.to : pathname === n.to || pathname.startsWith(n.to + "/");
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`group flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] transition-colors ${active ? "bg-[var(--surface-2)] font-medium text-foreground" : "text-muted-foreground hover:bg-[var(--surface-2)] hover:text-foreground"}`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-[var(--accent)]" : "text-muted-foreground"}`} />
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-3">
          <div className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-[var(--surface-2)] text-[11px] font-semibold">{initials(ownerName)}</div>
            <div className="min-w-0 flex-1 text-[12px]">
              <div className="truncate font-medium">{ownerName}</div>
              <div className="truncate text-muted-foreground">{profile?.role === "agency_owner" ? "Owner" : "Member"}</div>
            </div>
            <button onClick={handleSignOut} title="Sign out" className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-[var(--surface-2)] hover:text-foreground">
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/85 px-5 backdrop-blur">
          <form
            onSubmit={(e) => { e.preventDefault(); navigate({ to: "/app/clients" }); }}
            className="relative w-full max-w-md"
          >
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search clients…"
              className="h-9 w-full rounded-lg border border-border bg-[var(--surface-2)] pl-9 pr-3 text-[13px] outline-none placeholder:text-muted-foreground focus:border-[var(--accent)]"
            />
          </form>
          <div className="ml-auto flex items-center gap-2">
            <details className="group relative">
              <summary className="grid h-9 w-9 cursor-pointer list-none place-items-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground [&::-webkit-details-marker]:hidden">
                <Bell className="h-4 w-4" />
              </summary>
              <div className="absolute right-0 z-30 mt-2 w-64 rounded-xl border border-border bg-[var(--surface)] p-4 text-center shadow-pop">
                <div className="text-[12.5px] font-medium">You're all caught up</div>
                <div className="mt-1 text-[11.5px] text-muted-foreground">New leads, approvals, and messages will show up here.</div>
              </div>
            </details>
            <Link to="/portal" className="hidden h-9 items-center rounded-lg border border-border bg-background px-3 text-[12.5px] text-muted-foreground hover:text-foreground md:inline-flex">
              View as client →
            </Link>
            <div className="grid h-8 w-8 place-items-center rounded-full bg-foreground text-[11px] font-semibold text-background">{initials(ownerName) || "·"}</div>
          </div>
        </header>
        <div className="min-h-0 flex-1 pb-16 md:pb-0">{children ?? <Outlet />}</div>
      </div>

      <MobileTabBar
        primary={[
          { to: "/app", label: "Home", icon: LayoutDashboard, exact: true },
          { to: "/app/clients", label: "Clients", icon: Users },
          { to: "/app/leads", label: "Leads", icon: Inbox },
          { to: "/app/ai", label: "Orvio AI", icon: Sparkles },
        ]}
        more={[
          { to: "/app/reporting", label: "Reporting", icon: BarChart3 },
          { to: "/app/pipeline", label: "Pipeline", icon: Kanban },
          { to: "/app/messages", label: "Messages", icon: MessageSquare },
          { to: "/app/payments", label: "Payments", icon: CreditCard },
          { to: "/app/studio", label: "Studio", icon: Sparkles },
          { to: "/app/reports", label: "Reports", icon: FileText },
          { to: "/app/settings/integrations", label: "Integrations", icon: Plug },
          { to: "/app/settings/white-label", label: "Settings", icon: Settings },
        ]}
      />
    </div>
  );
}
