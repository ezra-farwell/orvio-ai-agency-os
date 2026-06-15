import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingShell } from "@/components/shells/MarketingShell";
import { ArrowRight, BarChart3, Inbox, Palette, Sparkles, MessageSquare, CreditCard, Users, Building2, FileText, Settings, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/product")({
  component: Product,
  head: () => ({ meta: [{ title: "Product — Orvio" }, { name: "description", content: "Every Orvio surface — agency portal, client portal, Content Studio, master admin." }] }),
});

const surfaces = [
  { name: "Agency portal", body: "Where your team runs every contractor account.", icon: Building2, to: "/app" },
  { name: "Client portal", body: "Branded portal contractors log into.", icon: Users, to: "/portal" },
  { name: "Content Studio", body: "AI ad copy, social posts, landing pages, emails — grounded in each client's brand.", icon: Sparkles, to: "/app/studio" },
  { name: "Master admin", body: "Internal Orvio admin for managing every agency on the platform.", icon: ShieldCheck, to: "/admin" },
];

const modules = [
  { icon: BarChart3, title: "Ad reporting", body: "Spend, leads, CPL, CTR, CPM. Trends, best/worst campaigns, AI insights." },
  { icon: Inbox, title: "Leads", body: "Form fills, calls, messages — unified inbox with status and assignment." },
  { icon: MessageSquare, title: "Messages", body: "SMS + email threads with each contractor and lead, attached to the account." },
  { icon: Palette, title: "White-label", body: "Logo, domain, colors, email sender — your software, not ours." },
  { icon: CreditCard, title: "Payments", body: "Stripe Connect, subscriptions, financing links, invoice tracking." },
  { icon: FileText, title: "Reports", body: "One-click monthly reports written in plain English for the contractor." },
  { icon: Settings, title: "Brand memory", body: "Per-client memory: services, offers, claims, words to avoid, testimonials." },
  { icon: Users, title: "Onboarding", body: "Invite a client by email. They land in their portal in under 60 seconds." },
];

function Product() {
  return (
    <MarketingShell>
      <section className="hero-bg pt-32 pb-16">
        <div className="mx-auto max-w-[1100px] px-6 text-center">
          <div className="chip">Product</div>
          <h1 className="mt-3 text-[44px] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[56px]">One platform. Four surfaces. Every workflow.</h1>
          <p className="mx-auto mt-4 max-w-2xl text-[15.5px] text-muted-foreground">Orvio is structured for how agencies actually work — your team, your clients, your creative production, and your internal operations.</p>
        </div>
      </section>

      <section className="pb-16">
        <div className="mx-auto grid max-w-[1240px] gap-4 px-6 md:grid-cols-2">
          {surfaces.map(s => (
            <Link key={s.name} to={s.to as any} className="group rounded-2xl border border-border bg-background p-6 transition-shadow hover:shadow-soft">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]"><s.icon className="h-5 w-5" /></div>
                <div className="text-[16px] font-semibold tracking-tight">{s.name}</div>
                <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </div>
              <p className="mt-3 text-[14px] text-muted-foreground">{s.body}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="hairline-t py-20">
        <div className="mx-auto max-w-[1240px] px-6">
          <h2 className="text-[28px] font-semibold tracking-tight">Modules across the platform</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {modules.map(m => (
              <div key={m.title} className="rounded-2xl border border-border bg-background p-5">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--surface-2)]"><m.icon className="h-4.5 w-4.5 text-[var(--accent)]" /></div>
                <div className="mt-3 text-[14px] font-semibold">{m.title}</div>
                <div className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">{m.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
