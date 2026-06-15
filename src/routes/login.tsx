import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: Login,
  head: () => ({ meta: [{ title: "Login — Orvio" }] }),
});

function Login() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-[1240px] flex-col px-6">
        <div className="flex h-16 items-center">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-foreground"><span className="h-1.5 w-1.5 rounded-full bg-background" /></span>
            <span className="text-[15px] font-semibold">Orvio</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center pb-24">
          <div className="w-full max-w-sm">
            <h1 className="text-[26px] font-semibold tracking-tight">Welcome back.</h1>
            <p className="mt-1 text-[13.5px] text-muted-foreground">Sign in to your Orvio agency workspace.</p>
            <form className="mt-6 space-y-3" onSubmit={e => e.preventDefault()}>
              <label className="block">
                <div className="text-[12px] font-medium text-muted-foreground">Work email</div>
                <input type="email" placeholder="you@youragency.com" className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-[13.5px] outline-none focus:border-[var(--accent)]" />
              </label>
              <label className="block">
                <div className="text-[12px] font-medium text-muted-foreground">Password</div>
                <input type="password" placeholder="••••••••" className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-[13.5px] outline-none focus:border-[var(--accent)]" />
              </label>
              <Link to="/app" className="mt-2 flex h-10 w-full items-center justify-center gap-1 rounded-lg bg-foreground text-[14px] font-medium text-background hover:bg-foreground/90">Sign in <ArrowRight className="h-4 w-4" /></Link>
            </form>
            <div className="mt-6 flex items-center gap-3 text-[12px] text-muted-foreground">
              <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
            </div>
            <Link to="/portal" className="mt-3 flex h-10 w-full items-center justify-center rounded-lg border border-border bg-background text-[13.5px] hover:bg-[var(--surface-2)]">I'm a client</Link>
            <p className="mt-6 text-center text-[12.5px] text-muted-foreground">Don't have an account? <Link to="/book-demo" className="font-medium text-foreground hover:underline">Book a demo</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
