import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingShell } from "@/components/shells/MarketingShell";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/demo")({
  component: Demo,
  head: () => ({ meta: [{ title: "Live demo — Orvio" }, { name: "description", content: "Explore the live Orvio demo." }] }),
});

const tiles = [
  { to: "/app", label: "Agency portal", body: "Run every client account, ad reporting, leads, pipeline, payments, and Content Studio." },
  { to: "/portal", label: "Client portal", body: "How a contractor sees their campaigns, leads, and approvals in plain English." },
  { to: "/app/studio", label: "Content Studio", body: "Generate ads with live Meta and Google previews, per-client brand memory." },
  { to: "/admin", label: "Master admin", body: "How Orvio's internal team manages every agency on the platform." },
];

function Demo() {
  return (
    <MarketingShell>
      <section className="hero-bg pt-32 pb-16">
        <div className="mx-auto max-w-[1100px] px-6 text-center">
          <div className="chip-indigo">Live demo</div>
          <h1 className="mt-3 text-[44px] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[56px]">Click around the product.</h1>
          <p className="mx-auto mt-4 max-w-xl text-[15.5px] text-muted-foreground">All four surfaces are wired up with realistic agency data. No login, no setup — just open whatever you want to see.</p>
        </div>
      </section>
      <section className="pb-24">
        <div className="mx-auto grid max-w-[1100px] gap-4 px-6 md:grid-cols-2">
          {tiles.map(t => (
            <Link key={t.to} to={t.to as any} className="group rounded-2xl border border-border bg-background p-6 transition-shadow hover:shadow-soft">
              <div className="flex items-center justify-between">
                <div className="text-[18px] font-semibold tracking-tight">{t.label}</div>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </div>
              <p className="mt-2 text-[13.5px] text-muted-foreground">{t.body}</p>
            </Link>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
