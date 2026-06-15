import { createFileRoute } from "@tanstack/react-router";
import { AgencyShell } from "@/components/shells/AgencyShell";

export const Route = createFileRoute("/app")({
  component: () => <AgencyShell />,
  head: () => ({ meta: [{ title: "Orvio — Agency portal" }] }),
});
