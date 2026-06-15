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
        <Card className="p-5">
          <div className="text-[14px] font-semibold">Plans</div>
          <div className="mt-2 text-[12.5px] text-muted-foreground">Pricing tiers and feature flags. Editing here updates marketing pricing.</div>
        </Card>
        <Card className="p-5">
          <div className="text-[14px] font-semibold">Feature flags</div>
          <div className="mt-2 text-[12.5px] text-muted-foreground">Roll out features to specific agencies before global release.</div>
        </Card>
        <Card className="p-5">
          <div className="text-[14px] font-semibold">Team</div>
          <div className="mt-2 text-[12.5px] text-muted-foreground">Internal Orvio team members and roles.</div>
        </Card>
        <Card className="p-5">
          <div className="text-[14px] font-semibold">Audit log</div>
          <div className="mt-2 text-[12.5px] text-muted-foreground">Every privileged action across the platform.</div>
        </Card>
      </div>
    </>
  );
}
