import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { type ReactNode } from "react";
import {
  LayoutDashboard, Building2, CreditCard, Plug, Settings, Search,
} from "lucide-react";

const nav = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/agencies", label: "Agencies", icon: Building2 },
  { to: "/admin/billing", label: "Billing & MRR", icon: CreditCard },
  { to: "/admin/integrations", label: "Integrations", icon: Plug },
  { to: "/admin/settings", label: "Settings", icon: Settings },
] as const;

export function AdminShell({ children }: { children?: ReactNode }) {
  const pathname = useRouterState({ select: s => s.location.pathname });
  return (
    <div data-theme="dark" className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden w-[224px] shrink-0 flex-col border-r border-border bg-background md:flex">
        <div className="flex h-14 items-center gap-2.5 border-b border-border px-4">
          <span className="grid h-6 w-6 place-items-center rounded bg-foreground">
            <span className="h-1 w-1 rounded-full bg-background" />
          </span>
          <span className="text-[14px] font-semibold tracking-tight">Orvio</span>
          <span className="ml-auto chip-indigo">Admin</span>
        </div>
        <nav className="flex-1 space-y-0.5 px-2 pt-3">
          {nav.map(n => {
            const active = ("exact" in n && n.exact) ? pathname === n.to : pathname === n.to || pathname.startsWith(n.to + "/");
            const Icon = n.icon;
            return (
              <Link key={n.to} to={n.to}
                className={`flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] transition-colors ${active ? "bg-[var(--surface-2)] font-medium text-foreground" : "text-muted-foreground hover:bg-[var(--surface-2)] hover:text-foreground"}`}>
                <Icon className={`h-4 w-4 ${active ? "text-[var(--accent)]" : ""}`} /> {n.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background px-5">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input placeholder="Search agencies, accounts…" className="h-9 w-full rounded-lg border border-border bg-[var(--surface-2)] pl-9 pr-3 text-[13px] outline-none focus:border-[var(--accent)]" />
          </div>
          <div className="ml-auto flex items-center gap-2 text-[12.5px] text-muted-foreground">Master admin · production</div>
        </header>
        <div className="min-h-0 flex-1">{children ?? <Outlet />}</div>
      </div>
    </div>
  );
}
