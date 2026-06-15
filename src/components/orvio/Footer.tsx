import { Link } from "@tanstack/react-router";

const columns: { label: string; links: { label: string; href?: string; to?: "/" | "/demo" | "/pricing" | "/login" | "/portal-preview" }[] }[] = [
  {
    label: "Platform",
    links: [
      { label: "Overview", to: "/" },
      { label: "Client OS", to: "/" },
      { label: "Creative Studio", to: "/" },
      { label: "Admin", to: "/" },
    ],
  },
  {
    label: "Product",
    links: [
      { label: "Pricing", to: "/pricing" },
      { label: "Client portal", to: "/portal-preview" },
      { label: "Product tour", to: "/demo" },
      { label: "Changelog", href: "#" },
    ],
  },
  {
    label: "Resources",
    links: [
      { label: "Docs", href: "#" },
      { label: "Support", href: "mailto:ezra@scaledsolutions.net" },
      { label: "Status", href: "#" },
    ],
  },
  {
    label: "Company",
    links: [
      { label: "Contact", href: "mailto:ezra@scaledsolutions.net" },
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative hairline-t bg-background">
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-indigo/50 to-transparent" />
      <div className="mx-auto max-w-[1280px] px-6 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="relative grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-indigo to-[#4F46E5]">
                <span className="absolute inset-[3px] rounded-[4px] bg-background" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-indigo" />
              </span>
              <span className="text-[15px] font-semibold tracking-tight">Orvio</span>
            </div>
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-text-muted">
              The agency operating system. Client delivery, reporting, billing, and AI creative production in one workspace.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.label}>
              <div className="mono text-[10.5px] font-semibold uppercase tracking-[0.18em] text-text-faint">
                {col.label}
              </div>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) =>
                  l.to ? (
                    <li key={l.label}>
                      <Link to={l.to} className="text-[13px] text-foreground/70 transition-colors hover:text-foreground">
                        {l.label}
                      </Link>
                    </li>
                  ) : (
                    <li key={l.label}>
                      <a href={l.href} className="text-[13px] text-foreground/70 transition-colors hover:text-foreground">
                        {l.label}
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-2 border-t border-border pt-6 md:flex-row md:items-center">
          <p className="mono text-[10.5px] uppercase tracking-[0.18em] text-text-faint">© 2026 Scaled Solutions LLC · v1.0</p>
          <a href="mailto:ezra@scaledsolutions.net" className="mono text-[11px] text-text-muted hover:text-foreground">ezra@scaledsolutions.net</a>
        </div>
      </div>
    </footer>
  );
}
