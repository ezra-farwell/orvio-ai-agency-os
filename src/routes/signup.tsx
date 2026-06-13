import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Nav } from "@/components/orvio/Nav";
import { Footer } from "@/components/orvio/Footer";
import { Reveal } from "@/components/orvio/primitives";
import { ArrowIcon, GlyphEcho } from "@/components/orvio/lattice";
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
      <main className="grid min-h-screen md:grid-cols-[1.1fr_1fr]">
        {/* Sky panel */}
        <aside
          className="sky-hero relative hidden flex-col justify-between overflow-hidden p-12 md:flex"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/2 cloud-drift"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 30% 80%, rgba(255,220,190,0.55), transparent 60%), radial-gradient(ellipse 60% 50% at 75% 70%, rgba(255,200,210,0.5), transparent 60%)",
              filter: "blur(20px)",
            }}
          />
          <div className="mono-eyebrow flex items-center gap-2.5 text-white/85">
            <span
              className="grid h-1.5 w-1.5 place-items-center rounded-full bg-[#F76B15] live-dot"
              style={{ boxShadow: "0 0 10px rgba(247,107,21,0.85)" }}
            />
            Orvio · Agency Edition
          </div>

          <div className="flex flex-col items-start gap-10">
            <GlyphEcho size={160} />
            <h2
              className="font-display font-extrabold leading-[1.02] tracking-tight text-white"
              style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}
            >
              Join agencies running on infrastructure.
            </h2>
            <ul className="space-y-3">
              {[
                "White-label portal ready in 20 minutes",
                "First AI report in under 30 seconds",
                "No credit card required",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm text-white/90">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#F76B15]" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="mono-eyebrow text-white/65">
            "Setup took 22 minutes. First report went out the same day."
          </div>
        </aside>

        {/* Form panel */}
        <section className="flex items-center justify-center p-6 pt-28 sm:p-12 md:pt-12">
          <div className="w-full max-w-md">
            <div className="mono-eyebrow flex items-center gap-3 text-text-muted">
              <span className="text-[#F76B15]">01</span>
              <span className="text-text-faint">—</span>
              <span>Create account</span>
            </div>
            <h1
              className="mt-6 font-display font-extrabold leading-[1.05] tracking-tight"
              style={{ fontSize: "clamp(2rem, 3.4vw, 2.75rem)" }}
            >
              Start your<br />agency OS.
            </h1>
            <p className="mt-4 text-sm text-text-muted">
              14 days free. No credit card required.
            </p>

            {submitted ? (
              <Reveal>
                <div className="mt-10 hairline-t hairline-b py-8">
                  <div className="flex items-center gap-3 text-[#F76B15]">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-display text-xl font-bold">Account created</span>
                  </div>
                  <p className="mt-4 text-sm text-foreground/90">
                    This is a UI preview — Orvio doesn't keep your details. Head to the demo or portal to
                    keep exploring.
                  </p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Link to="/demo" className="group inline-flex h-11 items-center justify-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background">
                      Try the Studio <ArrowIcon />
                    </Link>
                    <Link to="/portal-preview" className="inline-flex h-11 items-center justify-center rounded-full border border-border px-5 text-sm font-medium">
                      See the client portal
                    </Link>
                  </div>
                </div>
              </Reveal>
            ) : (
              <form onSubmit={onSubmit} className="mt-10 space-y-6">
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
                <Field label="Current client count">
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
                  className="group mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground text-sm font-medium text-background transition-all hover:shadow-[0_14px_36px_-10px_rgba(255,255,255,0.45)]"
                >
                  Create account <ArrowIcon />
                </button>

                <p className="mono-eyebrow text-text-muted">
                  Already have an account?{" "}
                  <Link to="/signup" className="story-link-underline text-foreground">Sign in</Link>
                </p>
                <p className="mono-eyebrow text-text-faint">
                  By signing up you agree to our Terms of Service and Privacy Policy.
                </p>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />

      <style>{`
        .orvio-input {
          width: 100%;
          height: 44px;
          padding: 0 0 8px 0;
          background: transparent;
          border: 0;
          border-bottom: 1px solid var(--border);
          border-radius: 0;
          color: var(--foreground);
          font-size: 15px;
          transition: border-color 0.25s;
        }
        .orvio-input::placeholder { color: var(--text-faint); }
        .orvio-input:focus {
          outline: none;
          border-bottom-color: #F76B15;
        }
        select.orvio-input {
          appearance: none;
          background-image: linear-gradient(45deg, transparent 50%, #A6ADBD 50%), linear-gradient(135deg, #A6ADBD 50%, transparent 50%);
          background-position: calc(100% - 12px) 18px, calc(100% - 7px) 18px;
          background-size: 5px 5px;
          background-repeat: no-repeat;
          padding-right: 28px;
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mono-eyebrow mb-2 block text-text-muted">{label}</span>
      {children}
    </label>
  );
}
