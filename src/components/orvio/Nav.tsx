import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { num: "01", label: "Product", to: "/" as const },
  { num: "02", label: "Demo", to: "/demo" as const },
  { num: "03", label: "Pricing", to: "/pricing" as const },
  { num: "04", label: "Portal", to: "/portal-preview" as const },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled
          ? "border-b border-border/60 bg-background/80 backdrop-blur-xl opacity-100"
          : "border-b border-transparent bg-transparent opacity-0 pointer-events-none"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6 sm:px-10">
        <Link to="/" className="mono-eyebrow shrink-0 text-foreground">
          <span className="flex items-center gap-2.5">
            <span
              className="grid h-1.5 w-1.5 place-items-center rounded-full bg-[#5EEAD4] live-dot"
              style={{ boxShadow: "0 0 10px rgba(94,234,212,0.85)" }}
            />
            Orvio
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className="mono-eyebrow group flex items-center gap-2 transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              <span className="text-[#5EEAD4]">{l.num}</span>
              <span className="story-link-underline">{l.label}</span>
            </Link>
          ))}
        </nav>

        <div className="hidden items-center md:flex">
          <Link
            to="/signup"
            className="inline-flex h-9 items-center gap-2 rounded-full bg-foreground px-4 text-[12px] font-medium text-background transition-all hover:shadow-[0_8px_24px_-8px_rgba(255,255,255,0.4)]"
          >
            Start free
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
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
        <div className="fixed inset-0 top-16 z-40 flex flex-col gap-1 bg-background/95 px-6 py-8 backdrop-blur-xl md:hidden">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              onClick={() => setOpen(false)}
              className="mono-eyebrow flex items-center gap-3 rounded-lg px-3 py-3 text-foreground"
            >
              <span className="text-[#5EEAD4]">{l.num}</span>
              {l.label}
            </Link>
          ))}
          <Link
            to="/signup"
            onClick={() => setOpen(false)}
            className="mt-4 inline-flex h-11 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background"
          >
            Start free trial
          </Link>
        </div>
      )}
    </header>
  );
}
