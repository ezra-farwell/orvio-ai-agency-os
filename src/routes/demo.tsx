import { createFileRoute, Link } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Nav } from "@/components/orvio/Nav";
import { Footer } from "@/components/orvio/Footer";
import { Reveal, SectionHeader, StatusBadge } from "@/components/orvio/primitives";
import { StudioDemo } from "@/components/orvio/StudioDemo";
import { ArrowIcon, GlyphEcho, SkyBand } from "@/components/orvio/lattice";

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

      {/* Hero band */}
      <SkyBand variant="full" className="pt-32 pb-24 sm:pt-40 sm:pb-32">
        <div className="mx-auto max-w-[1280px] px-6 text-center sm:px-10">
          <Reveal>
            <div className="flex justify-center">
              <GlyphEcho size={96} />
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="mono-eyebrow mt-8 flex items-center justify-center gap-3 text-white/85">
              <span className="grid h-1.5 w-1.5 place-items-center rounded-full bg-[#F76B15] live-dot" style={{ boxShadow: "0 0 10px rgba(247,107,21,0.85)" }} />
              Live demo · No account required
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1
              className="mt-6 font-display font-extrabold leading-[1.02] tracking-tight text-white"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
            >
              Try the <span className="italic">Studio.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mx-auto mt-6 max-w-2xl text-base text-white/85 sm:text-lg">
              Real output structure from the live product. Choose a model, click generate, approve creatives.
            </p>
          </Reveal>
        </div>
      </SkyBand>

      <main className="pb-24">
        <section className="mx-auto max-w-[1280px] px-6 sm:px-10">
          <Reveal>
            <div className="-mt-16">
              <StudioDemo />
            </div>
          </Reveal>
        </section>

        <section className="mx-auto mt-32 max-w-[1280px] px-6 sm:px-10">
          <Reveal>
            <SectionHeader
              center={false}
              index="02"
              eyebrow="Inside the campaign"
              title={<>What gets pushed to Meta.</>}
              subtitle="Structure, landing, and audit — generated alongside every creative set."
            />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-14">
              <Tabs defaultValue="structure" className="w-full">
                <TabsList className="inline-flex h-11 gap-1 rounded-full border border-border bg-surface/50 p-1 backdrop-blur">
                  <TabsTrigger value="structure" className="rounded-full px-5 data-[state=active]:bg-foreground data-[state=active]:text-background">Structure</TabsTrigger>
                  <TabsTrigger value="landing" className="rounded-full px-5 data-[state=active]:bg-foreground data-[state=active]:text-background">Landing</TabsTrigger>
                  <TabsTrigger value="audit" className="rounded-full px-5 data-[state=active]:bg-foreground data-[state=active]:text-background">Audit</TabsTrigger>
                </TabsList>

                <TabsContent value="structure" className="mt-8">
                  <div className="hairline-t hairline-b py-10">
                    <h3 className="font-display text-2xl font-bold">Campaign structure</h3>
                    <p className="mt-2 text-sm text-text-muted">The full skeleton that pushes to Meta.</p>
                    <dl className="mt-8 grid divide-y divide-border border-y border-border sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-3">
                      {[
                        ["Campaign objective", "Lead Generation"],
                        ["Ad sets", "2 (Broad | Interest Stack)"],
                        ["Budget split", "60% Broad / 40% Interest"],
                        ["Placements", "Feed 1:1, 4:5, Story 9:16"],
                        ["Attribution", "7-day click"],
                        ["Bid strategy", "Highest Volume"],
                      ].map(([k, v]) => (
                        <div key={k} className="px-6 py-5">
                          <dt className="mono-eyebrow text-text-muted">{k}</dt>
                          <dd className="mt-2 font-mono text-base text-foreground">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </TabsContent>

                <TabsContent value="landing" className="mt-8">
                  <div className="hairline-t hairline-b py-10">
                    <div className="mono-eyebrow text-text-muted">Generated landing page</div>
                    <h3
                      className="mt-4 font-display font-extrabold leading-[1.05]"
                      style={{ fontSize: "clamp(2rem, 4.4vw, 3.5rem)" }}
                    >
                      Your Roof Survived the Storm.<br />But Did It?
                    </h3>
                    <p className="mt-6 max-w-2xl text-base text-text-muted sm:text-lg">
                      Get a free storm damage inspection from Summit Roofing. Know exactly where you stand — no
                      pressure, no guesswork.
                    </p>
                    <button className="group mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-amber px-6 text-sm font-semibold text-background">
                      Book My Free Inspection <ArrowIcon />
                    </button>
                  </div>
                </TabsContent>

                <TabsContent value="audit" className="mt-8">
                  <div className="hairline-t hairline-b py-10">
                    <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
                      <div className="grid h-20 w-20 shrink-0 place-items-center rounded-full border-2 border-success/40 bg-success/10 font-mono text-3xl font-semibold text-success">
                        84
                      </div>
                      <div>
                        <div className="mono-eyebrow text-text-muted">Overall audit score</div>
                        <h3 className="mt-2 font-display text-3xl font-extrabold">Approved with notes</h3>
                      </div>
                    </div>

                    <ul className="mt-8 divide-y divide-border border-y border-border">
                      {[
                        { tone: "yellow" as const, label: "Structure", note: "Two ad sets with 5 total ads — consider consolidating to 3–4 ads per ad set for better delivery." },
                        { tone: "green" as const, label: "Objective", note: "Lead generation objective matches the inspection offer." },
                        { tone: "green" as const, label: "Budget", note: "Budget is appropriate for the geographic targeting area." },
                      ].map((row, i) => (
                        <li key={i} className="flex items-start gap-5 py-5">
                          <StatusBadge tone={row.tone}>{row.label}</StatusBadge>
                          <span className="text-sm text-foreground/90">{row.note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </Reveal>
        </section>

        <SkyBand variant="full" className="mt-32 py-24 sm:py-32">
          <div className="mx-auto max-w-3xl px-6 text-center sm:px-10">
            <Reveal>
              <h3
                className="font-display font-extrabold leading-tight text-white"
                style={{ fontSize: "clamp(2rem, 4.4vw, 3.5rem)" }}
              >
                Ready to generate real campaigns<br />for your clients?
              </h3>
            </Reveal>
            <Reveal delay={0.1}>
              <Link
                to="/signup"
                className="group mt-10 inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 text-sm font-medium text-[#1B2552] shadow-[0_14px_36px_-10px_rgba(255,255,255,0.6)]"
              >
                Start free trial <ArrowIcon />
              </Link>
            </Reveal>
          </div>
        </SkyBand>
      </main>
      <Footer />
    </div>
  );
}
