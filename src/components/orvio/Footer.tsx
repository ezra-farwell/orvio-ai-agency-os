import { Link } from "@tanstack/react-router";

const columns: { label: string; links: { label: string; href?: string; to?: "/" | "/demo" | "/pricing" | "/signup" | "/portal-preview" }[] }[] = [
  {
    label: "Product",
    links: [
      { label: "Overview", to: "/" },
      { label: "Demo", to: "/demo" },
      { label: "Client portal", to: "/portal-preview" },
      { label: "Pricing", to: "/pricing" },
    ],
  },
  {
    label: "Resources",
    links: [
      { label: "Docs", href: "#" },
      { label: "Support", href: "mailto:ezra@scaledsolutions.net" },
      { label: "Changelog", href: "#" },
    ],
  },
  {
    label: "Company",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Contact", href: "mailto:ezra@scaledsolutions.net" },
    ],
  },
  {
    label: "Account",
    links: [
      { label: "Sign in", to: "/signup" },
      { label: "Start free trial", to: "/signup" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative hairline-t bg-background overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-indigo/60 to-transparent" />
      <div className="mx-auto max-w-[1280px] px-6 py-20 sm:px-10">
        <div className="grid gap-12 md:grid-cols-[1.6fr_repeat(4,1fr)]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="relative grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-indigo to-indigo/60">
                <span className="absolute inset-0.5 rounded-[5px] bg-background" />
                <span className="relative h-2 w-2 rounded-full bg-indigo" />
              </span>
              <span className="text-[16px] font-semibold tracking-tight">Orvio</span>
            </div>
            <p className="mt-5 max-w-xs text-[14px] leading-relaxed text-text-muted">
              The agency OS for client delivery and AI campaign production.
            </p>
            <p className="mt-6 mono-eyebrow text-text-faint">© 2026 · Scaled Solutions LLC</p>
          </div>

          {columns.map((col) => (
            <div key={col.label}>
              <div className="text-[12px] font-semibold uppercase tracking-wider text-text-faint">
                {col.label}
              </div>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) =>
                  l.to ? (
                    <li key={l.label}>
                      <Link to={l.to} className="text-[13.5px] text-foreground/75 transition-colors hover:text-foreground">
                        {l.label}
                      </Link>
                    </li>
                  ) : (
                    <li key={l.label}>
                      <a href={l.href} className="text-[13.5px] text-foreground/75 transition-colors hover:text-foreground">
                        {l.label}
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-3 border-t border-border pt-8 md:flex-row md:items-center">
          <p className="mono-eyebrow text-text-faint">Built for agencies serious about scale</p>
          <p className="mono-eyebrow text-text-faint">v1.0 · ezra@scaledsolutions.net</p>
        </div>
      </div>
    </footer>
  );
}
