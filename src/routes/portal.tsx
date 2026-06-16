import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ClientShell } from "@/components/shells/ClientShell";
import { getSession } from "@/lib/auth";

export const Route = createFileRoute("/portal")({
  component: PortalGuard,
  head: () => ({ meta: [{ title: "Orvio — Client portal" }] }),
});

function PortalGuard() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    getSession().then((session) => {
      if (!session) navigate({ to: "/login" });
      else setChecked(true);
    });
  }, [navigate]);

  if (!checked) {
    return (
      <div className="grid min-h-screen place-items-center bg-background text-[13px] text-muted-foreground">
        Loading…
      </div>
    );
  }
  return <ClientShell />;
}
