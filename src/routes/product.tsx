import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingShell } from "@/components/shells/MarketingShell";
import { ArrowRight, BarChart3, Inbox, Palette, MessageSquare, CreditCard, Users, Building2, FileText, ShieldCheck, CheckSquare } from "lucide-react";

export const Route = createFileRoute("/product")({
  component: Product,
  head: () => ({ meta: [{ title: "Product — Orvio" }, { name: "description", content: "The Orvio platform: agency portal, client portal, and master admin for agencies running ads for local service businesses." }] }),
});

const surfaces = [
  { name: "Agency portal", body: "Where your team runs every client account.", icon: Building2, to: "/app" },
  { name: "Client portal", body: "The branded portal your clients log into.", icon: Users, to: "/portal" },
  { name: "Master admin", body: "Internal Orvio admin for managing every agency on the platform.", icon: ShieldCheck, to: "/admin" },
];

const modules = [
  { icon: Palette, title: "White-label", body: "Logo, custom domain, colors, and email sender. Your software, not ours." },
  { icon: BarChart3, title: "Ad reporting", body: "Spend, leads, CPL, CTR, and CPM in plain English. Meta Ads and Google Ads." },
  { icon: Inbox, title: "Lead inbox", body: "Form fills, calls, and messages in one place. Status, assign, and follow up." },
  { icon: CheckSquare, title: "Approvals", body: "Clients approve creative in one click. No email threads." },
  { icon: CreditCard, title: "Invoices", body: "Send and track invoices from the same portal. Stripe Connect on Pro." },
  { icon: FileText, title: "Monthly reports", body: "One-click monthly recap written in plain English for the contractor." },
  { icon: MessageSquare, title: "Messages", body: "SMS and email threads attached to each client account." },
  { icon: Users, title: "Onboarding", body: "Invite a client by email. They land in their portal in under 60 seconds." },
];

function Product() {
  return (
    <MarketingShell>
      <section className="pt-32 pb-16">
        <div className="mx-auto max-w-[1100px] px-6 text-center">
          <div className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground">Product</div>
          <h1 className="mt-3 text-[44px] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[56px]">
            One platform, three surfaces.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[15.5px] text-muted-foreground">
            Orvio is structured for how agencies actually work — your team, your clients, and your internal operations.
          </p>
        </div>
      </section>

      <section className="pb-16">
        <div className="mx-auto grid max-w-[1180px] gap-4 px-6 md:grid-cols-3">
          {surfaces.map(s => (
            <Link key={s.name} to={s.to as any} className="group rounded-2xl border border-border bg-background p-6 transition-shadow hover:shadow-soft">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-[var(--surface-2)]"><s.icon className="h-5 w-5 text-[var(--accent)]" /></div>
                <div className="text-[16px] font-semibold tracking-tight">{s.name}</div>
                <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </div>
              <p className="mt-3 text-[14px] text-muted-foreground">{s.body}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="hairline-t py-20">
        <div className="mx-auto max-w-[1180px] px-6">
          <h2 className="text-[28px] font-semibold tracking-tight">What is included</h2>
          <p className="mt-2 text-[14px] text-muted-foreground">Live in every plan. See pricing for limits and Pro-only features.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {modules.map(m => (
              <div key={m.title} className="rounded-2xl border border-border bg-background p-5">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--surface-2)]"><m.icon className="h-4 w-4 text-[var(--accent)]" /></div>
                <div className="mt-3 text-[14px] font-semibold">{m.title}</div>
                <div className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">{m.body}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-dashed border-border bg-background p-6">
            <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Roadmap</div>
            <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-muted-foreground">
              AI-assisted report summaries, brand memory for creative production, and multi-brand white-label are in development. Available to early access customers on request.
            </p>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
