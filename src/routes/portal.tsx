import { createFileRoute } from "@tanstack/react-router";
import { ClientShell } from "@/components/shells/ClientShell";

export const Route = createFileRoute("/portal")({
  component: () => <ClientShell />,
  head: () => ({ meta: [{ title: "Orvio — Client portal" }] }),
});
