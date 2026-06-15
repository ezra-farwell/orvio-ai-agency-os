import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Menu, X, ArrowRight } from "lucide-react";

const nav = [
  { label: "Product", to: "/product" as const },
  { label: "Solutions", to: "/solutions" as const },
  { label: "Pricing", to: "/pricing" as const },
  { label: "Demo", to: "/demo" as const },
];

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 8);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all ${scrolled ? "border-b border-border/80 bg-background/85 backdrop-blur-xl" : "bg-transparent"}`}>
      <div className="mx-auto flex h-[64px] max-w-[1240px] items-center justify-between gap-6 px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-background" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-foreground">Orvio</span>
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {nav.map((l) => (
            <Link key={l.label} to={l.to} className="text-[13.5px] text-muted-foreground transition-colors hover:text-foreground">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Link to="/login" className="text-[13.5px] text-muted-foreground hover:text-foreground">Login</Link>
          <Link to="/book-demo" className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-foreground px-3.5 text-[13px] font-medium text-background hover:bg-foreground/90">
            Book a demo <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <button aria-label="menu" className="md:hidden" onClick={() => setOpen(v => !v)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border bg-background px-6 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            {nav.map(l => <Link key={l.label} to={l.to} onClick={() => setOpen(false)} className="rounded-md px-2 py-2 text-sm text-foreground">{l.label}</Link>)}
            <Link to="/login" onClick={() => setOpen(false)} className="rounded-md px-2 py-2 text-sm text-foreground">Login</Link>
            <Link to="/book-demo" onClick={() => setOpen(false)} className="mt-1 inline-flex h-10 items-center justify-center rounded-md bg-foreground text-sm font-medium text-background">Book a demo</Link>
          </div>
        </div>
      )}
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="hairline-t bg-background">
      <div className="mx-auto max-w-[1240px] px-6 py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="grid h-7 w-7 place-items-center rounded-md bg-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-background" />
              </span>
              <span className="text-[15px] font-semibold">Orvio</span>
            </div>
            <p className="mt-3 max-w-sm text-[13.5px] text-muted-foreground">
              The white-label operating system for agencies that run paid ads for local service businesses.
            </p>
          </div>
          <FooterCol title="Product" links={[["Overview","/product"],["Pricing","/pricing"],["Demo","/demo"],["Login","/login"]]} />
          <FooterCol title="Surfaces" links={[["Agency portal","/app"],["Client portal","/portal"],["Master admin","/admin"]]} />
          <FooterCol title="Company" links={[["Solutions","/solutions"],["Book a demo","/book-demo"]]} />
        </div>
        <div className="hairline-t mt-12 flex flex-col items-start justify-between gap-3 pt-6 text-[12px] text-muted-foreground md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} Orvio, Inc.</span>
          <span>Built for agencies who actually ship.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="text-[12px] font-semibold uppercase tracking-wider text-foreground">{title}</h4>
      <ul className="mt-3 space-y-2">
        {links.map(([label, href]) => (
          <li key={href}>
            <Link to={href as any} className="text-[13px] text-muted-foreground hover:text-foreground">{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <MarketingNav />
      <main>{children}</main>
      <MarketingFooter />
    </div>
  );
}
