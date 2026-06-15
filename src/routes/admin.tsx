import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/shells/AdminShell";

export const Route = createFileRoute("/admin")({
  component: () => <AdminShell />,
  head: () => ({ meta: [{ title: "Orvio — Master admin" }] }),
});
