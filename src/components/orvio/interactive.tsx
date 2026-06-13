import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode, type MouseEvent, type CSSProperties } from "react";

/* ---------------- Orvio Glyph — animated stroke-draw "O" ---------------- */
export function OrvioGlyph({ size = 220 }: { size?: number }) {
  return (
    <div
      className="relative mx-auto"
      style={{ width: size, height: size }}
      aria-hidden
    >
      {/* outer halo */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.35), rgba(139,92,246,0.18) 40%, transparent 70%)",
          filter: "blur(20px)",
        }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: [0, 1, 0.85], scale: [0.6, 1.05, 1] }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], times: [0, 0.7, 1] }}
      />
      {/* rotating amber glow */}
      <motion.div
        className="absolute inset-6 rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0%, rgba(217,119,6,0.55) 25%, transparent 50%, rgba(99,102,241,0.6) 75%, transparent 100%)",
          filter: "blur(14px)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 14, ease: "linear", repeat: Infinity }}
      />
      <svg viewBox="0 0 200 200" className="relative h-full w-full">
        <defs>
          <linearGradient id="og-stroke" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#6366F1" />
            <stop offset="0.55" stopColor="#8B5CF6" />
            <stop offset="1" stopColor="#D97706" />
          </linearGradient>
          <filter id="og-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* faint inner ring */}
        <circle cx="100" cy="100" r="62" stroke="rgba(255,255,255,0.06)" strokeWidth="1" fill="none" />
        {/* draw-on rings */}
        <motion.circle
          cx="100" cy="100" r="78"
          fill="none"
          stroke="url(#og-stroke)"
          strokeWidth="2.5"
          strokeLinecap="round"
          filter="url(#og-glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.circle
          cx="100" cy="100" r="66"
          fill="none"
          stroke="url(#og-stroke)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity={0.55}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* center diamond */}
        <motion.path
          d="M100 78 L120 100 L100 122 L80 100 Z"
          fill="url(#og-stroke)"
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "100px 100px" }}
        />
      </svg>
    </div>
  );
}

/* ---------------- MouseGlow — radial gradient follows mouse in a region ---------------- */
export function MouseGlow({
  children,
  className = "",
  color = "rgba(99,102,241,0.18)",
  size = 600,
}: {
  children: ReactNode;
  className?: string;
  color?: string;
  size?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    ref.current!.style.setProperty("--gx", `${e.clientX - r.left}px`);
    ref.current!.style.setProperty("--gy", `${e.clientY - r.top}px`);
  };
  return (
    <div ref={ref} onMouseMove={onMove} className={`relative ${className}`}>
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-80 transition-opacity"
        style={{
          background: `radial-gradient(${size}px circle at var(--gx, 50%) var(--gy, 50%), ${color}, transparent 65%)`,
        }}
      />
      {children}
    </div>
  );
}

/* ---------------- SpotlightCard — per-card cursor highlight + tilt ---------------- */
export function SpotlightCard({
  children,
  className = "",
  tilt = false,
  glow = "rgba(99,102,241,0.22)",
}: {
  children: ReactNode;
  className?: string;
  tilt?: boolean;
  glow?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(0, { stiffness: 200, damping: 18 });
  const ry = useSpring(0, { stiffness: 200, damping: 18 });
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    ref.current!.style.setProperty("--sx", `${x}px`);
    ref.current!.style.setProperty("--sy", `${y}px`);
    if (tilt) {
      ry.set(((x / r.width) - 0.5) * 6);
      rx.set(-((y / r.height) - 0.5) * 6);
    }
  };
  const onLeave = () => {
    if (tilt) { rx.set(0); ry.set(0); }
  };
  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={tilt ? { rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" } as CSSProperties : undefined}
      className={`group/spot surface-card relative overflow-hidden transition-colors hover:border-indigo/40 ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{
          background: `radial-gradient(420px circle at var(--sx, 50%) var(--sy, 50%), ${glow}, transparent 55%)`,
        }}
      />
      <div className="relative">{children}</div>
    </motion.div>
  );
}

/* ---------------- MagneticButton — subtle pull toward cursor ---------------- */
export function MagneticButton({
  children,
  className = "",
  as: As = "button",
  strength = 0.25,
  ...props
}: React.ComponentProps<"button"> & { as?: React.ElementType; strength?: number; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const x = useSpring(0, { stiffness: 300, damping: 20 });
  const y = useSpring(0, { stiffness: 300, damping: 20 });
  const onMove = (e: MouseEvent<HTMLElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const onLeave = () => { x.set(0); y.set(0); };
  return (
    <motion.span style={{ display: "inline-flex", x, y }}>
      <As ref={ref as never} onMouseMove={onMove} onMouseLeave={onLeave} className={className} {...props}>
        {children}
      </As>
    </motion.span>
  );
}

/* ---------------- LiveTick — number that drifts subtly on a timer ---------------- */
export function LiveTick({
  base, jitter = 1, format = (n: number) => n.toFixed(0), interval = 2400, prefix = "", suffix = "",
}: {
  base: number; jitter?: number; format?: (n: number) => string; interval?: number; prefix?: string; suffix?: string;
}) {
  const [v, setV] = useState(base);
  useEffect(() => {
    const id = setInterval(() => {
      setV((prev) => {
        const drift = (Math.random() - 0.45) * jitter;
        const next = Math.max(0, prev + drift);
        return next;
      });
    }, interval);
    return () => clearInterval(id);
  }, [jitter, interval]);
  return (
    <motion.span
      key={Math.floor(v * 10)}
      initial={{ opacity: 0.55, y: -2 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="inline-block font-mono"
    >
      {prefix}{format(v)}{suffix}
    </motion.span>
  );
}

/* ---------------- Sparkline — animated SVG line that re-draws periodically ---------------- */
export function Sparkline({ color = "#6366F1", height = 48 }: { color?: string; height?: number }) {
  const [points, setPoints] = useState(() => seed(24));
  useEffect(() => {
    const id = setInterval(() => {
      setPoints((p) => {
        const next = [...p.slice(1), clampDrift(p[p.length - 1])];
        return next;
      });
    }, 1800);
    return () => clearInterval(id);
  }, []);
  const w = 240;
  const h = height;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = Math.max(1, max - min);
  const d = points.map((p, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - ((p - min) / range) * (h - 6) - 3;
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");
  const area = `${d} L${w} ${h} L0 ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id="spark-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.25" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path d={area} fill="url(#spark-fill)" initial={false} animate={{ d: area }} transition={{ duration: 0.8, ease: "easeOut" }} />
      <motion.path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" initial={false} animate={{ d }} transition={{ duration: 0.8, ease: "easeOut" }} />
    </svg>
  );
}
function seed(n: number) {
  let v = 50;
  return Array.from({ length: n }, () => (v = clampDrift(v)));
}
function clampDrift(v: number) {
  const next = v + (Math.random() - 0.5) * 10;
  return Math.max(20, Math.min(90, next));
}

/* ---------------- ParallaxY — translates child on scroll ---------------- */
export function ParallaxY({ children, range = 60, className = "" }: { children: ReactNode; range?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [range, -range]);
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

/* ---------------- TypeRotate — cycles through phrases for the hero ---------------- */
export function TypeRotate({ words, className = "" }: { words: string[]; className?: string }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % words.length), 2400);
    return () => clearInterval(id);
  }, [words.length]);
  return (
    <span className={`relative inline-block align-baseline ${className}`}>
      <span className="invisible">{words.reduce((a, b) => (b.length > a.length ? b : a), "")}</span>
      <motion.span
        key={words[i]}
        initial={{ y: 18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -18, opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 whitespace-nowrap text-gradient-orvio"
      >
        {words[i]}
      </motion.span>
    </span>
  );
}
