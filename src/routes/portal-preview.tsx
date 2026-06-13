import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/orvio/Nav";
import { Footer } from "@/components/orvio/Footer";
import { Reveal } from "@/components/orvio/primitives";
import { Download, ArrowRight } from "lucide-react";

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
      <main className="pt-32 pb-20 sm:pt-40">
        <div className="mx-auto max-w-[1100px] px-5 sm:px-8">
          <Reveal>
            <div className="text-center">
              <div className="inline-flex rounded-full border border-indigo/30 bg-indigo/10 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-indigo">
                Client experience preview
              </div>
              <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight sm:text-5xl">
                What <span className="text-gradient-orvio">your clients see</span>.
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-sm text-text-muted sm:text-base">
                Branded as GrowthDesk in this example. In production, every pixel is your agency.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-12 overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-[0_40px_120px_-40px_rgba(99,102,241,0.4)]">
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
                  <div className="h-6 w-6 rounded-md bg-gradient-to-br from-indigo to-[#8B5CF6]" />
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
              <div className="border-b border-border bg-background/40 px-6 py-8">
                <div className="text-sm text-text-muted">Welcome back,</div>
                <h2 className="mt-1 font-display text-3xl font-extrabold sm:text-4xl">Summit Roofing Co.</h2>
                <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 px-4 py-2 text-sm text-success">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-success/20">✓</span>
                  Your campaigns are healthy this month
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4 border-b border-border p-6 lg:grid-cols-4">
                {[
                  { v: "$1,247.50", l: "Spent this month on ads" },
                  { v: "43 leads", l: "Homeowners who reached out" },
                  { v: "$29.01", l: "Cost per lead" },
                  { v: "12 calls", l: "Booked inspections" },
                ].map((m) => (
                  <div key={m.l} className="surface-card p-5">
                    <div className="font-mono text-2xl font-semibold text-foreground sm:text-3xl">{m.v}</div>
                    <div className="mt-2 text-xs text-text-muted">{m.l}</div>
                  </div>
                ))}
              </div>

              {/* Reports */}
              <div className="border-b border-border p-6">
                <h3 className="font-display text-lg font-bold">Recent reports</h3>
                <div className="mt-4 space-y-2">
                  {[
                    { name: "June 2026 Performance Report", date: "Generated Jun 13, 2026" },
                    { name: "May 2026 Performance Report", date: "Generated May 15, 2026" },
                  ].map((r) => (
                    <div key={r.name} className="flex flex-col gap-3 rounded-lg border border-border bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="text-sm font-medium text-foreground">{r.name}</div>
                        <div className="text-xs text-text-muted">{r.date}</div>
                      </div>
                      <button className="inline-flex items-center gap-2 self-start rounded-lg bg-amber px-4 py-2 text-xs font-semibold text-white sm:self-auto">
                        <Download className="h-3.5 w-3.5" />
                        Download PDF
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Invoices */}
              <div className="p-6">
                <h3 className="font-display text-lg font-bold">Invoices</h3>
                <div className="mt-4 divide-y divide-border overflow-hidden rounded-lg border border-border bg-background">
                  {[
                    { name: "June Retainer", amount: "$1,500", status: "Paid Jun 1" },
                    { name: "May Retainer", amount: "$1,500", status: "Paid May 1" },
                  ].map((i) => (
                    <div key={i.name} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                      <span className="text-foreground">{i.name}</span>
                      <span className="font-mono text-foreground">{i.amount}</span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider text-success">
                        ✓ {i.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-14 text-center">
              <h3 className="font-display text-2xl font-extrabold sm:text-3xl">
                Every pixel shows your agency name.
              </h3>
              <p className="mx-auto mt-3 max-w-xl text-sm text-text-muted">
                Your logo, your colors, your domain. Orvio stays invisible. You get the credit.
              </p>
              <Link
                to="/signup"
                className="mt-7 inline-flex h-12 items-center gap-2 rounded-lg bg-indigo px-6 text-sm font-semibold text-white shadow-[0_12px_40px_-12px_rgba(99,102,241,0.7)] transition-all hover:brightness-110"
              >
                Start your free trial <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="mt-4 text-xs text-text-faint">
                Want to see this with your own branding? Sign up and brand your workspace in under 5 minutes.
              </p>
            </div>
          </Reveal>
        </div>
      </main>
      <Footer />
    </div>
  );
}
