import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Product", to: "/" as const },
  { label: "Demo", to: "/demo" as const },
  { label: "Pricing", to: "/pricing" as const },
  { label: "Portal", to: "/portal-preview" as const },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled
          ? "border-b border-white/[0.06] bg-black/70 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-[1320px] items-center justify-between px-6 sm:px-10">
        <Link to="/" className="flex shrink-0 items-center gap-2.5 text-white">
          <span
            className="grid h-2 w-2 place-items-center rounded-full bg-[#F76B15] live-dot"
            style={{ boxShadow: "0 0 14px rgba(247,107,21,0.9)" }}
          />
          <span className="font-display text-2xl leading-none">Orvio</span>
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className="text-[13px] tracking-tight text-white/70 transition-colors hover:text-white"
              activeProps={{ className: "text-white" }}
            >
              <span className="story-link-underline">{l.label}</span>
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-5 md:flex">
          <Link
            to="/signup"
            className="text-[13px] text-white/70 transition-colors hover:text-white"
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-5 text-[13px] font-medium text-black transition-all hover:shadow-[0_8px_24px_-8px_rgba(255,255,255,0.6)]"
          >
            See a demo
          </Link>
        </div>

        <button
          aria-label="Menu"
          className="rounded-md p-2 text-white md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 top-20 z-40 flex flex-col gap-1 bg-black/95 px-6 py-8 backdrop-blur-xl md:hidden">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-lg text-white"
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/signup"
            onClick={() => setOpen(false)}
            className="mt-4 inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-medium text-black"
          >
            See a demo
          </Link>
        </div>
      )}
    </header>
  );
}
