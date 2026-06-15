import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingShell } from "@/components/shells/MarketingShell";
import { Wrench, Home, Hammer, Wind, Zap, Trees, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/solutions")({
  component: Solutions,
  head: () => ({ meta: [{ title: "Solutions — Orvio" }, { name: "description", content: "Orvio for plumbing, roofing, HVAC, remodeling, electrical, and landscaping agencies." }] }),
});

const verticals = [
  { icon: Wrench, name: "Plumbing", angle: "Emergency dispatch ads, drain campaigns, water heater offers." },
  { icon: Home, name: "Roofing", angle: "Storm-damage funnels, full replacement quotes, financing-led ads." },
  { icon: Hammer, name: "Remodeling", angle: "Before/after carousels, kitchen and bath estimate funnels." },
  { icon: Wind, name: "HVAC", angle: "Seasonal tune-ups, furnace replacement, financing offers." },
  { icon: Zap, name: "Electrical", angle: "Panel upgrades, EV charger installs, generator quotes." },
  { icon: Trees, name: "Landscaping", angle: "Spring quote requests, hardscape projects, recurring maintenance." },
];

function Solutions() {
  return (
    <MarketingShell>
      <section className="hero-bg pt-32 pb-16">
        <div className="mx-auto max-w-[1000px] px-6 text-center">
          <div className="chip">Solutions</div>
          <h1 className="mt-3 text-[44px] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[56px]">Built for agencies that serve local service businesses.</h1>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] text-muted-foreground">Orvio is the operating system for agencies running Meta and Google Ads for the trades. Every metric, lead workflow, and creative format is tuned for how home-services work.</p>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto grid max-w-[1240px] gap-4 px-6 md:grid-cols-3">
          {verticals.map(v => (
            <div key={v.name} className="rounded-2xl border border-border bg-background p-6">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]"><v.icon className="h-5 w-5" /></div>
              <div className="mt-4 text-[16px] font-semibold">{v.name}</div>
              <div className="mt-1 text-[13.5px] text-muted-foreground">{v.angle}</div>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-10 max-w-[1240px] px-6 text-center">
          <Link to="/book-demo" className="inline-flex h-11 items-center gap-1.5 rounded-lg bg-foreground px-5 text-[14px] font-medium text-background hover:bg-foreground/90">
            Book a demo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </MarketingShell>
  );
}
