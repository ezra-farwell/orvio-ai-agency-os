import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Product", to: "/" as const, hash: "#product" },
  { label: "Use Cases", to: "/" as const, hash: "#use-cases" },
  { label: "Pricing", to: "/pricing" as const },
  { label: "Resources", to: "/demo" as const },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border/80 bg-background/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6 sm:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2.5 text-foreground">
          <span className="relative grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-indigo to-indigo/60 shadow-glow">
            <span className="absolute inset-0.5 rounded-[5px] bg-background" />
            <span className="relative h-2 w-2 rounded-full bg-indigo glow-pulse" />
          </span>
          <span className="text-[16px] font-semibold tracking-tight">Orvio</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              hash={l.hash}
              className="text-[13.5px] text-foreground/70 transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/signup" className="text-[13.5px] text-foreground/70 transition-colors hover:text-foreground">
            Sign in
          </Link>
          <Link
            to="/signup"
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-indigo px-4 text-[13px] font-medium text-white transition-all hover:bg-indigo/90 shadow-[0_6px_24px_-8px_rgba(99,102,241,0.6)]"
          >
            Start free trial
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
              hash={l.hash}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-base text-foreground"
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/signup"
            onClick={() => setOpen(false)}
            className="mt-4 inline-flex h-11 items-center justify-center rounded-lg bg-indigo px-5 text-sm font-medium text-white"
          >
            Start free trial
          </Link>
        </div>
      )}
    </header>
  );
}
