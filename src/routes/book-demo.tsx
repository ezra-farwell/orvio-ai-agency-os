import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingShell } from "@/components/shells/MarketingShell";
import { useState } from "react";
import { Check } from "lucide-react";

export const Route = createFileRoute("/book-demo")({
  component: BookDemo,
  head: () => ({ meta: [{ title: "Book a demo — Orvio" }, { name: "description", content: "Talk to the Orvio team." }] }),
});

function BookDemo() {
  const [sent, setSent] = useState(false);
  return (
    <MarketingShell>
      <section className="hero-bg pt-32 pb-24">
        <div className="mx-auto grid max-w-[1100px] gap-12 px-6 md:grid-cols-2">
          <div>
            <div className="chip">Book a demo</div>
            <h1 className="mt-3 text-[40px] font-semibold leading-[1.1] tracking-[-0.02em] md:text-[48px]">Let's see if Orvio fits your agency.</h1>
            <p className="mt-3 text-[15px] text-muted-foreground">30-minute walkthrough of the agency portal, client portal, and Content Studio with your actual client list.</p>
            <ul className="mt-6 space-y-2.5 text-[14px]">
              {["Live walkthrough with a real agency strategist","Q&A on white-label setup and migrations","No sales pitch — bring questions"].map(t => <li key={t} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--success)]" />{t}</li>)}
            </ul>
            <div className="mt-8">
              <Link to="/app" className="text-[13.5px] font-medium text-[var(--accent)] hover:underline">Prefer to explore on your own? Open the demo →</Link>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-background p-6 shadow-soft">
            {sent ? (
              <div className="py-10 text-center">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--success-soft)] text-[var(--success)]"><Check className="h-6 w-6" /></div>
                <div className="mt-4 text-[18px] font-semibold">Thanks — we'll be in touch.</div>
                <div className="mt-1 text-[13.5px] text-muted-foreground">Someone from our team will reach out within one business day.</div>
              </div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); setSent(true); }} className="space-y-3">
                {[
                  ["Your name","Avery Sloan"],
                  ["Work email","you@youragency.com"],
                  ["Agency name","Northstar Growth Co."],
                  ["Number of clients","12"],
                ].map(([l,p]) => (
                  <label key={l} className="block">
                    <div className="text-[12px] font-medium text-muted-foreground">{l}</div>
                    <input className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-[13.5px] outline-none focus:border-[var(--accent)]" placeholder={p} />
                  </label>
                ))}
                <label className="block">
                  <div className="text-[12px] font-medium text-muted-foreground">Anything we should know?</div>
                  <textarea rows={3} className="mt-1 w-full rounded-lg border border-border bg-background p-3 text-[13.5px] outline-none focus:border-[var(--accent)]" placeholder="Running ads for plumbers in Detroit — want to white-label." />
                </label>
                <button type="submit" className="mt-2 flex h-10 w-full items-center justify-center rounded-lg bg-foreground text-[14px] font-medium text-background hover:bg-foreground/90">Request demo</button>
              </form>
            )}
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
