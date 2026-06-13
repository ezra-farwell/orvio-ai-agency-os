import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  y = 32,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function CountUp({
  to,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1.6,
  className,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(eased * to);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {val.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

export function StatusBadge({
  tone,
  children,
}: {
  tone: "green" | "yellow" | "red" | "indigo" | "amber" | "purple";
  children: ReactNode;
}) {
  const tones: Record<string, string> = {
    green: "bg-success/10 text-success border-success/30",
    yellow: "bg-warning/10 text-warning border-warning/30",
    red: "bg-danger/10 text-danger border-danger/30",
    indigo: "bg-indigo/10 text-indigo border-indigo/30",
    amber: "bg-amber/10 text-amber border-amber/30",
    purple: "bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/30",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function MetricCard({
  value,
  label,
  delta,
  mono = true,
}: {
  value: ReactNode;
  label: string;
  delta?: { value: string; positive?: boolean };
  mono?: boolean;
}) {
  return (
    <div className="surface-card p-4 sm:p-5">
      <div className={`text-2xl sm:text-3xl font-semibold ${mono ? "font-mono" : ""} text-foreground`}>
        {value}
      </div>
      <div className="mt-1 text-xs sm:text-sm text-text-muted">{label}</div>
      {delta && (
        <div className={`mt-2 text-xs font-mono ${delta.positive ? "text-success" : "text-danger"}`}>
          {delta.positive ? "▲" : "▼"} {delta.value}
        </div>
      )}
    </div>
  );
}

export function Diamond({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="og-diamond" x1="0" y1="0" x2="24" y2="24">
          <stop offset="0" stopColor="#5EEAD4" />
          <stop offset="0.55" stopColor="#7C8CFF" />
          <stop offset="1" stopColor="#FBBF24" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="9" stroke="url(#og-diamond)" strokeWidth="1.5" fill="none" />
      <circle cx="12" cy="12" r="5" stroke="url(#og-diamond)" strokeWidth="1.2" fill="none" opacity="0.7" />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Diamond className="h-5 w-5" />
      <span className="font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-foreground">
        Orvio
      </span>
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  center = true,
  index,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  center?: boolean;
  index?: string;
}) {
  return (
    <div className={`max-w-3xl ${center ? "mx-auto text-center" : ""}`}>
      {(eyebrow || index) && (
        <div
          className={`mono-eyebrow mb-6 flex items-center gap-3 ${
            center ? "justify-center" : ""
          }`}
        >
          {index && <span className="text-[#5EEAD4]">{index}</span>}
          {index && eyebrow && <span className="text-text-faint">—</span>}
          {eyebrow && <span>{eyebrow}</span>}
        </div>
      )}
      <h2
        className="font-display font-extrabold leading-[1.02] tracking-tight"
        style={{ fontSize: "clamp(2rem, 4.8vw, 4rem)" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-5 text-base text-text-muted sm:text-lg ${center ? "mx-auto max-w-2xl" : "max-w-2xl"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
