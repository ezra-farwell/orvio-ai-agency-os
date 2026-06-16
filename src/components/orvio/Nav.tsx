import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Platform", to: "/" as const, hash: "#platform" },
  { label: "Client OS", to: "/" as const, hash: "#client-os" },
  { label: "Creative Studio", to: "/" as const, hash: "#studio" },
  { label: "Pricing", to: "/pricing" as const },
  { label: "Resources", to: "/demo" as const },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border/70 bg-background/70 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[68px] max-w-[1280px] items-center justify-between gap-6 px-6 sm:px-8">
        <div className="flex shrink-0 items-center gap-3">
          <Link to="/" className="flex items-center gap-2 text-foreground">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-background" />
            </span>
            <span className="text-[15px] font-semibold tracking-tight">Orvio</span>
          </Link>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              hash={l.hash}
              className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link to="/login" className="text-[13px] text-muted-foreground transition-colors hover:text-foreground px-3">
            Log in
          </Link>
          <Link
            to="/book-demo"
            className="inline-flex h-9 items-center rounded-full bg-foreground px-4 text-[13px] font-medium text-background hover:bg-foreground/90 transition-colors"
          >
            Get started
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
        <div className="fixed inset-0 top-[72px] z-40 flex flex-col gap-1 bg-background/98 px-6 py-8 backdrop-blur-xl md:hidden">
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
            to="/login"
            onClick={() => setOpen(false)}
            className="mt-2 inline-flex h-11 items-center justify-center rounded-lg border border-border px-5 text-sm font-medium text-foreground"
          >
            Sign in
          </Link>
          <Link
            to="/login"
            onClick={() => setOpen(false)}
            className="mt-2 inline-flex h-11 items-center justify-center rounded-lg bg-indigo px-5 text-sm font-medium text-white"
          >
            Start free trial
          </Link>
        </div>
      )}
    </header>
  );
}
