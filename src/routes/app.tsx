import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AgencyShell } from "@/components/shells/AgencyShell";
import { getSession } from "@/lib/auth";

export const Route = createFileRoute("/app")({
  component: AppGuard,
  head: () => ({ meta: [{ title: "Orvio — Agency portal" }] }),
});

// Client-side auth gate: confirm a Supabase session before rendering the portal.
function AppGuard() {
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
  return <AgencyShell />;
}
