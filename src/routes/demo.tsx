import { createFileRoute, Link } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Nav } from "@/components/orvio/Nav";
import { Footer } from "@/components/orvio/Footer";
import { Reveal, SectionHeader, StatusBadge } from "@/components/orvio/primitives";
import { StudioDemo } from "@/components/orvio/StudioDemo";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Try the Studio — Orvio" },
      { name: "description", content: "An interactive walkthrough of Orvio's Creative Studio. Choose a model, generate four ad concepts, approve and push to Meta. No account required." },
      { property: "og:title", content: "Try the Orvio Creative Studio" },
      { property: "og:description", content: "Generate four ad concepts from a campaign brief. Real output structure. No sign-up." },
    ],
  }),
  component: DemoPage,
});

function DemoPage() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="pt-32 pb-20 sm:pt-40">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
          <Reveal>
            <SectionHeader
              eyebrow="Live demo · no account"
              title="Try the Studio."
              subtitle="This is real output structure from the live product. Change the model, click generate, approve creatives."
            />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-12">
              <StudioDemo />
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-12">
              <Tabs defaultValue="structure" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-3 bg-surface">
                  <TabsTrigger value="structure">Structure</TabsTrigger>
                  <TabsTrigger value="landing">Landing</TabsTrigger>
                  <TabsTrigger value="audit">Audit</TabsTrigger>
                </TabsList>

                <TabsContent value="structure" className="mt-6">
                  <div className="surface-elev p-6 sm:p-8">
                    <h3 className="font-display text-xl font-bold">Campaign structure</h3>
                    <p className="mt-1 text-sm text-text-muted">The full skeleton that pushes to Meta.</p>
                    <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                      {[
                        ["Campaign objective", "Lead Generation"],
                        ["Ad sets", "2 (Broad | Interest Stack)"],
                        ["Budget split", "60% Broad / 40% Interest"],
                        ["Placements", "Feed 1:1, Feed 4:5, Story 9:16"],
                        ["Attribution", "7-day click"],
                        ["Bid strategy", "Highest Volume"],
                      ].map(([k, v]) => (
                        <div key={k} className="rounded-lg border border-border bg-background px-4 py-3">
                          <dt className="text-[10px] uppercase tracking-wider text-text-faint">{k}</dt>
                          <dd className="mt-1 font-mono text-sm text-foreground">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </TabsContent>

                <TabsContent value="landing" className="mt-6">
                  <div className="surface-elev p-6 sm:p-8">
                    <div className="text-xs uppercase tracking-wider text-text-muted">Generated landing page</div>
                    <h3 className="mt-2 font-display text-3xl font-extrabold leading-tight sm:text-4xl">
                      Your Roof Survived the Storm. But Did It?
                    </h3>
                    <p className="mt-4 max-w-2xl text-base text-text-muted">
                      Get a free storm damage inspection from Summit Roofing. Know exactly where you stand — no
                      pressure, no guesswork.
                    </p>
                    <button className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-amber px-6 text-sm font-semibold text-white">
                      Book My Free Inspection
                    </button>
                  </div>
                </TabsContent>

                <TabsContent value="audit" className="mt-6">
                  <div className="surface-elev p-6 sm:p-8">
                    <div className="flex items-center gap-4">
                      <div className="grid h-16 w-16 place-items-center rounded-full border-2 border-success/40 bg-success/10 font-mono text-2xl font-semibold text-success">
                        84
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-wider text-text-muted">Overall audit score</div>
                        <h3 className="font-display text-xl font-bold">84 / 100 — Approved with notes</h3>
                      </div>
                    </div>

                    <ul className="mt-6 space-y-3">
                      <li className="flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/5 p-4">
                        <StatusBadge tone="yellow">Structure</StatusBadge>
                        <span className="text-sm text-foreground/90">
                          Two ad sets with 5 total ads — consider consolidating to 3–4 ads per ad set for better delivery.
                        </span>
                      </li>
                      <li className="flex items-start gap-3 rounded-lg border border-success/30 bg-success/5 p-4">
                        <StatusBadge tone="green">Objective</StatusBadge>
                        <span className="text-sm text-foreground/90">
                          Lead generation objective matches the inspection offer.
                        </span>
                      </li>
                      <li className="flex items-start gap-3 rounded-lg border border-success/30 bg-success/5 p-4">
                        <StatusBadge tone="green">Budget</StatusBadge>
                        <span className="text-sm text-foreground/90">
                          Budget is appropriate for the geographic targeting area.
                        </span>
                      </li>
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-16 rounded-2xl border border-indigo/30 bg-gradient-to-br from-indigo/10 to-transparent p-8 text-center sm:p-12">
              <h3 className="font-display text-2xl font-extrabold sm:text-3xl">
                Ready to generate real campaigns for your clients?
              </h3>
              <Link
                to="/signup"
                className="mt-6 inline-flex h-12 items-center gap-2 rounded-lg bg-indigo px-6 text-sm font-semibold text-white shadow-[0_12px_40px_-12px_rgba(99,102,241,0.7)] transition-all hover:brightness-110"
              >
                Start free trial <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </main>
      <Footer />
    </div>
  );
}
