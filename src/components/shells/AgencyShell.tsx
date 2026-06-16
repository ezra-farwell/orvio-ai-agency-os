import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { type ReactNode } from "react";
import {
  LayoutDashboard, Users, BarChart3, Inbox, Kanban, MessageSquare,
  CreditCard, Sparkles, FileText, Settings, Search, Bell, ChevronDown, Plug,
} from "lucide-react";
import { currentAgency } from "@/mock/data";

const nav = [
  { to: "/app", label: "Overview", icon: LayoutDashboard, exact: true },
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
          <button className="flex w-full items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-left text-[13px] hover:bg-[var(--surface-2)]">
            <span className="flex items-center gap-2">
              <span className="grid h-5 w-5 place-items-center rounded bg-[var(--accent)] text-[10px] font-semibold text-white">N</span>
              <span className="font-medium">{currentAgency.name}</span>
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
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
            <div className="grid h-8 w-8 place-items-center rounded-full bg-[var(--surface-2)] text-[11px] font-semibold">AS</div>
            <div className="min-w-0 text-[12px]">
              <div className="truncate font-medium">{currentAgency.owner}</div>
              <div className="truncate text-muted-foreground">Owner</div>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/85 px-5 backdrop-blur">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search clients, campaigns, leads…"
              className="h-9 w-full rounded-lg border border-border bg-[var(--surface-2)] pl-9 pr-3 text-[13px] outline-none placeholder:text-muted-foreground focus:border-[var(--accent)]"
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground">
              <Bell className="h-4 w-4" />
            </button>
            <Link to="/portal" className="hidden h-9 items-center rounded-lg border border-border bg-background px-3 text-[12.5px] text-muted-foreground hover:text-foreground md:inline-flex">
              View as client →
            </Link>
            <div className="grid h-8 w-8 place-items-center rounded-full bg-foreground text-[11px] font-semibold text-background">AS</div>
          </div>
        </header>
        <div className="min-h-0 flex-1">{children ?? <Outlet />}</div>
      </div>
    </div>
  );
}
