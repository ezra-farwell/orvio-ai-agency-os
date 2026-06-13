import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/orvio/Nav";
import { Footer } from "@/components/orvio/Footer";
import { Reveal } from "@/components/orvio/primitives";
import { ArrowIcon, GlyphEcho, SkyBand } from "@/components/orvio/lattice";
import { Download } from "lucide-react";

export const Route = createFileRoute("/portal-preview")({
  head: () => ({
    meta: [
      { title: "What your clients see — Orvio portal preview" },
      { name: "description", content: "A walkthrough of the white-label client portal your agency's clients log into. Branded as your product, on your domain." },
      { property: "og:title", content: "The Orvio white-label client portal" },
      { property: "og:description", content: "Branded as your agency. Your logo, your colors, your domain. Orvio stays invisible." },
    ],
  }),
  component: PortalPage,
});

function PortalPage() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />

      <SkyBand variant="full" className="pt-32 pb-28 sm:pt-40 sm:pb-36">
        <div className="mx-auto max-w-[1280px] px-6 text-center sm:px-10">
          <Reveal>
            <div className="flex justify-center">
              <GlyphEcho size={96} />
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="mono-eyebrow mt-8 flex items-center justify-center gap-3 text-white/85">
              <span className="text-[#171717]">01</span>
              <span>—</span>
              <span>Client experience preview</span>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1
              className="mt-6 font-display font-extrabold leading-[1.02] tracking-tight text-white"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
            >
              What <span className="italic">your clients</span><br />actually see.
            </h1>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mx-auto mt-6 max-w-xl text-base text-white/85 sm:text-lg">
              Branded as GrowthDesk in this preview. In production, every pixel is your agency.
            </p>
          </Reveal>
        </div>
      </SkyBand>

      <main>
        <section className="mx-auto -mt-20 max-w-[1200px] px-6 pb-32 sm:px-10">
          <Reveal>
            <div className="overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-[0_60px_140px_-40px_rgba(20,30,80,0.7)]">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 border-b border-border bg-background/40 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
                <div className="ml-4 rounded-md bg-background px-3 py-1 text-[11px] font-mono text-text-faint">
                  portal.growthdesk.io/summit-roofing
                </div>
              </div>

              {/* Portal header */}
              <div className="flex items-center justify-between border-b border-border bg-surface px-6 py-4">
                <div className="flex items-center gap-2.5">
                  <div className="h-6 w-6 rounded-md bg-gradient-to-br from-[#171717] to-[#171717]" />
                  <span className="font-display text-lg font-extrabold tracking-tight">GrowthDesk</span>
                </div>
                <div className="hidden gap-6 text-sm sm:flex">
                  <span className="text-foreground">Dashboard</span>
                  <span className="text-text-muted">Reports</span>
                  <span className="text-text-muted">Invoices</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="hidden text-xs text-text-muted sm:inline">Summit Roofing Co.</span>
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber to-[#FB923C]" />
                </div>
              </div>

              {/* Welcome */}
              <div className="border-b border-border bg-background/40 px-6 py-10">
                <div className="mono-eyebrow text-text-muted">Welcome back,</div>
                <h2
                  className="mt-3 font-display font-extrabold leading-tight"
                  style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}
                >
                  Summit Roofing Co.
                </h2>
                <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-4 py-2 text-sm text-success">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-success/20">✓</span>
                  Your campaigns are healthy this month
                </div>
              </div>

              {/* Metrics */}
              <div className="grid divide-y divide-border border-b border-border md:grid-cols-2 md:divide-x md:divide-y-0 lg:grid-cols-4">
                {[
                  { v: "$1,247.50", l: "Spent this month on ads" },
                  { v: "43", l: "Leads (homeowners reached out)" },
                  { v: "$29.01", l: "Cost per lead" },
                  { v: "12", l: "Calls (booked inspections)" },
                ].map((m) => (
                  <div key={m.l} className="p-7">
                    <div className="font-mono text-3xl font-semibold text-foreground sm:text-4xl">{m.v}</div>
                    <div className="mono-eyebrow mt-3 text-text-muted">{m.l}</div>
                  </div>
                ))}
              </div>

              {/* Reports */}
              <div className="border-b border-border p-7">
                <div className="mono-eyebrow flex items-center gap-3 text-text-muted">
                  <span className="text-[#171717]">02</span>
                  <span>—</span>
                  Recent reports
                </div>
                <div className="mt-6 divide-y divide-border border-y border-border">
                  {[
                    { name: "June 2026 Performance Report", date: "Generated Jun 13, 2026" },
                    { name: "May 2026 Performance Report", date: "Generated May 15, 2026" },
                  ].map((r) => (
                    <div key={r.name} className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="font-display text-base font-bold text-foreground">{r.name}</div>
                        <div className="mono-eyebrow mt-1 text-text-muted">{r.date}</div>
                      </div>
                      <button className="group inline-flex h-10 items-center gap-2 self-start rounded-full bg-amber px-5 text-xs font-medium text-background sm:self-auto">
                        <Download className="h-3.5 w-3.5" />
                        Download PDF
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Invoices */}
              <div className="p-7">
                <div className="mono-eyebrow flex items-center gap-3 text-text-muted">
                  <span className="text-[#171717]">03</span>
                  <span>—</span>
                  Invoices
                </div>
                <div className="mt-6 divide-y divide-border border-y border-border">
                  {[
                    { name: "June Retainer", amount: "$1,500", status: "Paid Jun 1" },
                    { name: "May Retainer", amount: "$1,500", status: "Paid May 1" },
                  ].map((i) => (
                    <div key={i.name} className="flex items-center justify-between gap-4 py-4 text-sm">
                      <span className="font-display text-base font-bold text-foreground">{i.name}</span>
                      <span className="font-mono text-base text-foreground">{i.amount}</span>
                      <span className="mono-eyebrow text-success">✓ {i.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        <SkyBand variant="full" className="py-32">
          <div className="mx-auto max-w-3xl px-6 text-center sm:px-10">
            <Reveal>
              <h3
                className="font-display font-extrabold leading-tight text-white"
                style={{ fontSize: "clamp(2rem, 4.6vw, 3.5rem)" }}
              >
                Every pixel<br />shows your agency.
              </h3>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mx-auto mt-6 max-w-xl text-base text-white/85">
                Your logo, your colors, your domain. Orvio stays invisible. You get the credit.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <Link
                to="/signup"
                className="group mt-10 inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 text-sm font-medium text-[#1B2552] shadow-[0_14px_36px_-10px_rgba(255,255,255,0.6)]"
              >
                Brand your workspace <ArrowIcon />
              </Link>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-6 mono-eyebrow text-white/70">
                Setup in under 5 minutes
              </p>
            </Reveal>
          </div>
        </SkyBand>
      </main>
      <Footer />
    </div>
  );
}
