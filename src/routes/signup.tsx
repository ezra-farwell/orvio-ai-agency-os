import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Nav } from "@/components/orvio/Nav";
import { Footer } from "@/components/orvio/Footer";
import { Wordmark } from "@/components/orvio/primitives";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your agency account — Orvio" },
      { name: "description", content: "Create your Orvio account. White-label portal ready in 20 minutes. First AI report in under 30 seconds. No credit card required." },
      { property: "og:title", content: "Start your Orvio trial" },
      { property: "og:description", content: "14-day free trial. No credit card. White-label portal ready in 20 minutes." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    agency: "",
    clients: "",
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="pt-24">
        <div className="mx-auto grid max-w-[1200px] gap-0 px-0 md:grid-cols-[2fr_3fr] md:px-8">
          {/* LEFT */}
          <aside className="relative hidden overflow-hidden border-r border-border bg-surface/60 p-10 md:flex md:flex-col md:justify-between">
            <div>
              <Wordmark />
              <h2 className="mt-16 font-display text-3xl font-extrabold leading-tight">
                Join agencies generating real results for their clients.
              </h2>
              <ul className="mt-10 space-y-4 text-sm">
                {[
                  "White-label portal ready in 20 minutes",
                  "First AI report in under 30 seconds",
                  "No credit card required",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3 text-foreground/90">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-indigo" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-xs text-text-faint">
              "Setup took 22 minutes. First report went out the same day."
              <div className="mt-1 text-text-muted">— Early access agency</div>
            </div>
          </aside>

          {/* RIGHT */}
          <section className="p-6 sm:p-10 lg:p-14">
            <div className="md:hidden">
              <Wordmark />
            </div>
            <h1 className="mt-6 font-display text-3xl font-extrabold sm:text-4xl">
              Create your agency account
            </h1>
            <p className="mt-2 text-sm text-text-muted">
              14 days free. No credit card required.
            </p>

            {submitted ? (
              <div className="mt-10 rounded-xl border border-success/30 bg-success/10 p-6">
                <div className="flex items-center gap-3 text-success">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-medium">Account created (demo)</span>
                </div>
                <p className="mt-3 text-sm text-foreground/90">
                  This is a UI preview — Orvio doesn't keep your details. Head to the demo or pricing
                  page to keep exploring.
                </p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Link to="/demo" className="inline-flex h-11 items-center justify-center rounded-lg bg-indigo px-5 text-sm font-semibold text-white">
                    Try the Studio
                  </Link>
                  <Link to="/portal-preview" className="inline-flex h-11 items-center justify-center rounded-lg border border-border px-5 text-sm font-medium">
                    See the client portal
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="mt-8 space-y-4">
                <Field label="Full name">
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Alex Chen"
                    className="orvio-input"
                  />
                </Field>
                <Field label="Work email">
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="alex@youragency.com"
                    className="orvio-input"
                  />
                </Field>
                <Field label="Password">
                  <input
                    required
                    type="password"
                    minLength={8}
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    placeholder="At least 8 characters"
                    className="orvio-input"
                  />
                </Field>
                <Field label="Agency name">
                  <input
                    required
                    value={form.agency}
                    onChange={(e) => setForm((f) => ({ ...f, agency: e.target.value }))}
                    placeholder="GrowthDesk"
                    className="orvio-input"
                  />
                </Field>
                <Field label="How many clients do you currently have?">
                  <select
                    required
                    value={form.clients}
                    onChange={(e) => setForm((f) => ({ ...f, clients: e.target.value }))}
                    className="orvio-input"
                  >
                    <option value="" disabled>Select an option</option>
                    <option>1–3</option>
                    <option>4–10</option>
                    <option>11–20</option>
                    <option>20+</option>
                  </select>
                </Field>

                <button
                  type="submit"
                  className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-lg bg-indigo text-sm font-semibold text-white shadow-[0_12px_40px_-12px_rgba(99,102,241,0.7)] transition-all hover:brightness-110"
                >
                  Create account →
                </button>

                <p className="text-sm text-text-muted">
                  Already have an account? <Link to="/signup" className="text-indigo hover:underline">Sign in →</Link>
                </p>
                <p className="text-xs text-text-faint">
                  By signing up you agree to our Terms of Service and Privacy Policy.
                </p>
              </form>
            )}
          </section>
        </div>
      </main>
      <Footer />

      <style>{`
        .orvio-input {
          width: 100%;
          height: 44px;
          padding: 0 14px;
          background: var(--background);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--foreground);
          font-size: 14px;
          transition: border-color 0.15s;
        }
        .orvio-input:focus {
          outline: none;
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
        }
        select.orvio-input { appearance: none; background-image: linear-gradient(45deg, transparent 50%, #94A3B8 50%), linear-gradient(135deg, #94A3B8 50%, transparent 50%); background-position: calc(100% - 18px) center, calc(100% - 13px) center; background-size: 5px 5px, 5px 5px; background-repeat: no-repeat; padding-right: 36px; }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-text-muted">{label}</span>
      {children}
    </label>
  );
}
