import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Wordmark } from "./primitives";

const links = [
  { label: "Product", to: "/" as const, hash: "two-layers" },
  { label: "Features", to: "/" as const, hash: "features" },
  { label: "Pricing", to: "/pricing" as const, hash: undefined },
  { label: "Demo", to: "/demo" as const, hash: undefined },
  { label: "Studio", to: "/demo" as const, hash: undefined },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled
          ? "border-b border-border/60 bg-background/75 backdrop-blur-xl opacity-100"
          : "border-b border-transparent bg-transparent opacity-0 pointer-events-none"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5 sm:px-8">
        <Link to="/" className="shrink-0">
          <Wordmark />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              hash={l.hash}
              className="text-sm text-text-muted transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/signup" className="text-sm text-text-muted transition-colors hover:text-foreground">
            Sign in
          </Link>
          <Link
            to="/signup"
            className="rounded-lg bg-indigo px-4 py-2 text-sm font-medium text-white shadow-[0_8px_24px_-8px_rgba(99,102,241,0.6)] transition-all hover:brightness-110 hover:shadow-[0_12px_32px_-8px_rgba(99,102,241,0.7)]"
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
        <div className="fixed inset-0 top-16 z-40 flex flex-col gap-1 bg-background/95 px-5 py-8 backdrop-blur-xl md:hidden">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              hash={l.hash}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-lg text-foreground hover:bg-surface"
            >
              {l.label}
            </Link>
          ))}
          <div className="mt-4 flex flex-col gap-2">
            <Link
              to="/signup"
              onClick={() => setOpen(false)}
              className="rounded-lg border border-border px-4 py-3 text-center text-sm text-foreground"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              onClick={() => setOpen(false)}
              className="rounded-lg bg-indigo px-4 py-3 text-center text-sm font-medium text-white"
            >
              Start free trial
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
