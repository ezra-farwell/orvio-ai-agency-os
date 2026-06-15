import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Reveal } from "./primitives";

/* ----------------- MonoEyebrow ----------------- */
export function MonoEyebrow({
  children,
  className = "",
  dot,
}: {
  children: ReactNode;
  className?: string;
  dot?: "cyan" | "amber" | "live";
}) {
  return (
    <div className={`mono-eyebrow flex items-center gap-2.5 ${className}`}>
      {dot && (
        <span
          className={`grid h-1.5 w-1.5 place-items-center rounded-full ${
            dot === "amber" ? "bg-amber" : "bg-[#171717]"
          } ${dot === "live" ? "live-dot bg-[#171717]" : ""}`}
          style={{
            boxShadow:
              dot === "amber"
                ? "0 0 10px rgba(23,23,23,0.8)"
                : "0 0 10px rgba(23,23,23,0.85)",
          }}
        />
      )}
      <span>{children}</span>
    </div>
  );
}

/* ----------------- SectionHead — index + display heading ----------------- */
export function SectionHead({
  index,
  eyebrow,
  title,
  lede,
  align = "left",
}: {
  index?: string;
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: "left" | "center";
}) {
  const wrap = align === "center" ? "mx-auto text-center max-w-3xl" : "max-w-4xl";
  return (
    <div className={wrap}>
      <div
        className={`mono-eyebrow flex items-center gap-3 ${
          align === "center" ? "justify-center" : ""
        }`}
      >
        {index && (
          <span className="text-[#171717]">{index}</span>
        )}
        {index && eyebrow && <span className="text-text-faint">—</span>}
        {eyebrow && <span>{eyebrow}</span>}
      </div>
      <h2
        className="mt-6 font-display font-extrabold leading-[1.02] tracking-tight"
        style={{ fontSize: "clamp(2.25rem, 5.6vw, 4.5rem)" }}
      >
        {title}
      </h2>
      {lede && (
        <p
          className={`mt-5 text-text-muted ${align === "center" ? "mx-auto" : ""} max-w-2xl`}
          style={{ fontSize: "clamp(1rem, 1.2vw, 1.125rem)" }}
        >
          {lede}
        </p>
      )}
    </div>
  );
}

/* ----------------- SkyBand — atmospheric gradient section wrapper ----------------- */
export function SkyBand({
  children,
  className = "",
  variant = "soft",
}: {
  children: ReactNode;
  className?: string;
  variant?: "soft" | "full";
}) {
  return (
    <section className={`relative isolate overflow-hidden ${className}`}>
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            variant === "full"
              ? "var(--gradient-sky)"
              : "radial-gradient(ellipse 90% 70% at 50% 100%, rgba(255,220,190,0.18), transparent 60%), radial-gradient(ellipse 60% 50% at 50% 0%, rgba(23,23,23,0.18), transparent 65%)",
        }}
      />
      {variant === "full" && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/2 cloud-drift"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 30% 80%, rgba(255,220,190,0.55), transparent 60%), radial-gradient(ellipse 60% 50% at 75% 70%, rgba(255,200,210,0.5), transparent 60%)",
            filter: "blur(20px)",
          }}
        />
      )}
      {children}
    </section>
  );
}

/* ----------------- PillCTA — universal glass-pill button ----------------- */
type PillCTAProps = {
  to?: "/" | "/demo" | "/pricing" | "/login" | "/portal-preview";
  href?: string;
  children: ReactNode;
  tone?: "primary" | "ghost" | "amber";
  icon?: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
};

export function PillCTA({
  to,
  href,
  children,
  tone = "primary",
  icon,
  className = "",
  onClick,
  type,
}: PillCTAProps) {
  const styles =
    tone === "primary"
      ? "bg-foreground text-background hover:shadow-[0_14px_36px_-10px_rgba(255,255,255,0.45)]"
      : tone === "amber"
      ? "bg-amber text-background hover:shadow-[0_14px_36px_-10px_rgba(23,23,23,0.6)]"
      : "border border-border bg-surface/50 text-foreground hover:bg-surface backdrop-blur";

  const cls = `group inline-flex h-11 items-center gap-2 rounded-full px-5 text-[13px] font-medium transition-all ${styles} ${className}`;

  const inner = (
    <>
      {icon}
      <span>{children}</span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={cls}>
        {inner}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <button type={type ?? "button"} onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}

/* ----------------- Hairline — full-width divider with optional label ----------------- */
export function Hairline({ label, className = "" }: { label?: string; className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="h-px flex-1 bg-border" />
      {label && <span className="mono-eyebrow shrink-0">{label}</span>}
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

/* ----------------- ArrowIcon — used as universal CTA glyph ----------------- */
export function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-transform duration-300 group-hover:translate-x-1 ${className}`}
      aria-hidden
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/* ----------------- RevealHead — quick wrap that combines Reveal + SectionHead ----------------- */
export function RevealSectionHead(props: Parameters<typeof SectionHead>[0]) {
  return (
    <Reveal>
      <SectionHead {...props} />
    </Reveal>
  );
}

/* ----------------- BigGlyph — small echo of the hero "O" ----------------- */
export function GlyphEcho({ size = 84 }: { size?: number }) {
  return (
    <motion.svg
      width={size}
      height={size * 1.28}
      viewBox="0 0 360 460"
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden
    >
      <defs>
        <linearGradient id="ge-stroke" x1="0" y1="0" x2="0" y2="460">
          <stop offset="0" stopColor="#404040" />
          <stop offset="1" stopColor="#171717" />
        </linearGradient>
      </defs>
      <ellipse cx="180" cy="230" rx="150" ry="200" fill="none" stroke="url(#ge-stroke)" strokeWidth="2" />
      <ellipse cx="180" cy="230" rx="92" ry="142" fill="none" stroke="url(#ge-stroke)" strokeWidth="1.4" opacity="0.7" />
    </motion.svg>
  );
}
