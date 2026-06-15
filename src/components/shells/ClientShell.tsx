import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { type ReactNode } from "react";
import {
  LayoutDashboard, BarChart3, Inbox, MessageSquare, CheckSquare,
  CreditCard, FileText, Settings, Bell,
} from "lucide-react";
import { currentAgency, currentClient } from "@/mock/data";

const nav = [
  { to: "/portal", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/portal/campaigns", label: "Campaign Performance", icon: BarChart3 },
  { to: "/portal/leads", label: "Leads", icon: Inbox },
  { to: "/portal/messages", label: "Messages", icon: MessageSquare },
  { to: "/portal/approvals", label: "Content Approvals", icon: CheckSquare },
  { to: "/portal/payments", label: "Payments", icon: CreditCard },
  { to: "/portal/reports", label: "Reports", icon: FileText },
] as const;

export function ClientShell({ children }: { children?: ReactNode }) {
  const pathname = useRouterState({ select: s => s.location.pathname });
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden w-[240px] shrink-0 flex-col border-r border-border bg-background md:flex">
        <div className="flex h-14 items-center gap-2.5 border-b border-border px-4">
          <span
            className="grid h-7 w-7 place-items-center rounded-md text-[11px] font-semibold text-white"
            style={{ background: currentAgency.brandColor }}
          >
            N
          </span>
          <span className="text-[14px] font-semibold tracking-tight">{currentAgency.name}</span>
        </div>

        <div className="px-3 py-3">
          <div className="rounded-lg border border-border bg-[var(--surface-2)] px-3 py-2.5">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Your business</div>
            <div className="mt-0.5 text-[13.5px] font-semibold">{currentClient.name}</div>
            <div className="text-[12px] text-muted-foreground">{currentClient.area}</div>
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
                className={`flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] transition-colors ${active ? "bg-[var(--surface-2)] font-medium text-foreground" : "text-muted-foreground hover:bg-[var(--surface-2)] hover:text-foreground"}`}
              >
                <Icon className="h-4 w-4" style={active ? { color: currentAgency.brandColor } : undefined} />
                {n.label}
              </Link>
            );
          })}
        </nav>

        <Link to="/portal/settings" className="border-t border-border px-4 py-3 text-[12.5px] text-muted-foreground hover:text-foreground">
          <span className="inline-flex items-center gap-2"><Settings className="h-3.5 w-3.5" /> Settings</span>
        </Link>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/85 px-6 backdrop-blur">
          <div>
            <div className="text-[11px] text-muted-foreground">Powered by {currentAgency.name}</div>
            <div className="text-[14px] font-semibold leading-tight">{currentClient.name} — Client Portal</div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground">
              <Bell className="h-4 w-4" />
            </button>
            <div
              className="grid h-8 w-8 place-items-center rounded-full text-[11px] font-semibold text-white"
              style={{ background: currentClient.color }}
            >
              {currentClient.initials}
            </div>
          </div>
        </header>
        <div className="min-h-0 flex-1">{children ?? <Outlet />}</div>
      </div>
    </div>
  );
}
