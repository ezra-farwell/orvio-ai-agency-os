import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card } from "@/components/bits";

export const Route = createFileRoute("/admin/settings")({
  component: Settings,
  head: () => ({ meta: [{ title: "Settings — Orvio admin" }] }),
});

function Settings() {
  return (
    <>
      <PageHeader title="Settings" sub="Platform-level configuration." />
      <div className="grid gap-4 px-6 pb-10 md:grid-cols-2">
        {[
          ["Plans", "Pricing tiers and feature flags. Editing here updates marketing pricing."],
          ["Feature flags", "Roll out features to specific agencies before global release."],
          ["Team", "Internal Orvio team members and roles."],
          ["Audit log", "Every privileged action across the platform."],
        ].map(([title, desc]) => (
          <Card key={title} className="p-5">
            <div className="flex items-center justify-between gap-2">
              <div className="text-[14px] font-semibold">{title}</div>
              <span className="chip">Coming soon</span>
            </div>
            <div className="mt-2 text-[12.5px] text-muted-foreground">{desc}</div>
          </Card>
        ))}
      </div>
    </>
  );
}
