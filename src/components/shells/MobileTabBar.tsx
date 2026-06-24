import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { MoreHorizontal, X } from "lucide-react";

type Icon = React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
export type TabItem = { to: string; label: string; icon: Icon; exact?: boolean };

/**
 * Mobile bottom navigation — replaces the desktop sidebar on phones. Shows up to
 * four primary destinations plus a "More" sheet for the rest. Hidden at md+.
 * `brand` tints the active tab (the portal passes the agency's white-label color).
 */
export function MobileTabBar({
  primary,
  more = [],
  brand,
}: {
  primary: TabItem[];
  more?: TabItem[];
  brand?: string;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [moreOpen, setMoreOpen] = useState(false);

  const isActive = (t: TabItem) =>
    t.exact ? pathname === t.to : pathname === t.to || pathname.startsWith(t.to + "/");
  const activeColor = brand ?? "var(--accent)";

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-30 flex items-stretch border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        {primary.map((t) => {
          const active = isActive(t);
          const Icon = t.icon;
          return (
            <Link
              key={t.to}
              to={t.to}
              className="flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px]"
              style={{ color: active ? activeColor : "var(--text-faint)" }}
            >
              <Icon className="h-5 w-5" />
              {t.label}
            </Link>
          );
        })}
        {more.length > 0 && (
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className="flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] text-[var(--text-faint)]"
          >
            <MoreHorizontal className="h-5 w-5" />
            More
          </button>
        )}
      </nav>

      {moreOpen && (
        <div className="fixed inset-0 z-40 flex flex-col justify-end md:hidden" onClick={() => setMoreOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative rounded-t-2xl border-t border-border bg-[var(--surface)] p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]"
          >
            <div className="mx-auto mb-3 h-1 w-9 rounded-full bg-[var(--border-strong)]" />
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[13px] font-semibold">More</span>
              <button type="button" onClick={() => setMoreOpen(false)} className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-[var(--surface-2)]">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {more.map((t) => {
                const Icon = t.icon;
                return (
                  <Link
                    key={t.to}
                    to={t.to}
                    onClick={() => setMoreOpen(false)}
                    className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-background px-2 py-3 text-center text-[11.5px] text-muted-foreground hover:text-foreground"
                  >
                    <Icon className="h-5 w-5" />
                    {t.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
