import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

const links = [
  { label: "Pricing", to: "/pricing" as const, dropdown: true },
  { label: "Demo", to: "/demo" as const },
  { label: "Portal", to: "/portal-preview" as const },
  { label: "Careers", to: "/" as const },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "border-b border-border bg-background/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between px-6 sm:px-8">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-2 text-foreground">
          <span className="grid h-6 w-6 place-items-center rounded-[6px] bg-foreground">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
              <rect x="2" y="2" width="12" height="12" rx="2" stroke="#FAFAF7" strokeWidth="1.5" />
              <rect x="5" y="8" width="6" height="3" rx="0.5" fill="#FAFAF7" />
            </svg>
          </span>
          <span className="font-display text-[17px] font-bold tracking-tight">Orvio</span>
        </Link>

        {/* Center links */}
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className="inline-flex items-center gap-1 text-[14px] text-foreground/75 transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {l.label}
              {l.dropdown && <ChevronDown className="h-3.5 w-3.5 opacity-60" />}
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/signup"
            className="text-[14px] text-foreground/75 transition-colors hover:text-foreground"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="inline-flex h-9 items-center gap-2 rounded-full bg-foreground px-4 text-[13px] font-medium text-background transition-all hover:opacity-90"
          >
            Sign up
          </Link>
        </div>

        <button
          aria-label="Menu"
          className="rounded-md p-2 text-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 top-16 z-40 flex flex-col gap-1 bg-background/98 px-6 py-8 backdrop-blur-xl md:hidden">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-base text-foreground"
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/signup"
            onClick={() => setOpen(false)}
            className="mt-4 inline-flex h-11 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background"
          >
            Sign up
          </Link>
        </div>
      )}
    </header>
  );
}
