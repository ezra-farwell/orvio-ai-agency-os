import { Link } from "@tanstack/react-router";
import { Wordmark } from "./primitives";
import { Hairline } from "./lattice";

const cols: { num: string; label: string; links: { label: string; to: "/" | "/demo" | "/pricing" | "/signup" | "/portal-preview"; href?: undefined }[] }[] = [
  {
    num: "01",
    label: "Product",
    links: [
      { label: "Overview", to: "/" },
      { label: "Interactive demo", to: "/demo" },
      { label: "Client portal", to: "/portal-preview" },
    ],
  },
  {
    num: "02",
    label: "Plans",
    links: [
      { label: "Pricing", to: "/pricing" },
      { label: "Start free", to: "/signup" },
    ],
  },
];

const colsExternal: { num: string; label: string; links: { label: string; href: string }[] }[] = [
  {
    num: "03",
    label: "Company",
    links: [
      { label: "ezra@scaledsolutions.net", href: "mailto:ezra@scaledsolutions.net" },
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="hairline-t bg-background">
      <div className="mx-auto max-w-[1280px] px-6 py-20 sm:px-10">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Wordmark />
            <p
              className="mt-6 max-w-xs font-display font-extrabold leading-[1.1] text-foreground"
              style={{ fontSize: "clamp(1.5rem, 2.2vw, 2rem)" }}
            >
              The agency OS with AI built in.
            </p>
            <p className="mt-6 mono-eyebrow text-text-faint">© 2026 · Scaled Solutions LLC</p>
          </div>

          {cols.map((col) => (
            <div key={col.label}>
              <div className="mono-eyebrow flex items-center gap-2 text-text-muted">
                <span className="text-[#F76B15]">{col.num}</span>
                {col.label}
              </div>
              <ul className="mt-6 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="story-link-underline text-sm text-foreground/85 hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {colsExternal.map((col) => (
            <div key={col.label}>
              <div className="mono-eyebrow flex items-center gap-2 text-text-muted">
                <span className="text-[#F76B15]">{col.num}</span>
                {col.label}
              </div>
              <ul className="mt-6 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="story-link-underline text-sm text-foreground/85 hover:text-foreground"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <Hairline label="Built for agencies serious about scale" />
        </div>
      </div>
    </footer>
  );
}
