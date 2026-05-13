import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

/* ─── Grid Background ─── */
export function GridBackground({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative w-full", className)}>
      <div
        className="absolute inset-0 -z-10 dark:opacity-20 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)/0.3) 1px, transparent 1px),
                            linear-gradient(90deg, hsl(var(--primary)/0.3) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-transparent to-background" />
      {children}
    </div>
  );
}

/* ─── Dot Background ─── */
export function DotBackground({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative w-full", className)}>
      <div
        className="absolute inset-0 -z-10 dark:opacity-25 opacity-[0.06]"
        style={{
          backgroundImage: `radial-gradient(hsl(var(--primary)/0.6) 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-transparent to-background" />
      {children}
    </div>
  );
}

/* ─── Glass Card ─── */
export function GlassCard({
  children,
  className,
  glow,
}: {
  children: React.ReactNode;
  className?: string;
  glow?: "primary" | "secondary";
}) {
  return (
    <div
      className={cn(
        "relative rounded-2xl glass overflow-hidden",
        glow === "primary" && "shadow-[0_0_60px_-15px_hsl(var(--primary)/0.4)]",
        glow === "secondary" &&
          "shadow-[0_0_60px_-15px_hsl(var(--secondary)/0.4)]",
        className,
      )}
    >
      {/* Top edge gradient */}
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-px",
          glow === "primary"
            ? "bg-gradient-to-r from-transparent via-primary/60 to-transparent"
            : glow === "secondary"
              ? "bg-gradient-to-r from-transparent via-secondary/60 to-transparent"
              : "bg-gradient-to-r from-transparent via-border to-transparent",
        )}
      />
      {children}
    </div>
  );
}

/* ─── Border Beam ─── */
export function BorderBeam({
  className,
  duration = 8,
  colorFrom = "hsl(var(--primary))",
  colorTo = "hsl(var(--secondary))",
}: {
  className?: string;
  duration?: number;
  colorFrom?: string;
  colorTo?: string;
}) {
  return (
    <div
      className={cn(
        "absolute inset-0 rounded-[inherit] overflow-hidden pointer-events-none",
        className,
      )}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `conic-gradient(from 0deg, transparent 0%, ${colorFrom} 10%, ${colorTo} 20%, transparent 30%)`,
          animation: `spin ${duration}s linear infinite`,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          padding: "1px",
          borderRadius: "inherit",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ─── Spotlight ─── */
export function Spotlight({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const parent = el.parentElement;
    if (!parent) return;
    const move = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      el.style.background = `radial-gradient(700px circle at ${x}px ${y}px, hsl(var(--primary)/0.10), transparent 60%)`;
    };
    parent.addEventListener("mousemove", move);
    return () => parent.removeEventListener("mousemove", move);
  }, []);
  return (
    <div
      ref={ref}
      className={cn(
        "absolute inset-0 pointer-events-none transition-all duration-200",
        className,
      )}
    />
  );
}

/* ─── Background Beams ─── */
export function BackgroundBeams({ className }: { className?: string }) {
  const beams = [
    { x: "15%", delay: "0s", dur: "9s" },
    { x: "30%", delay: "1.5s", dur: "11s" },
    { x: "50%", delay: "0.5s", dur: "8s" },
    { x: "65%", delay: "2s", dur: "10s" },
    { x: "80%", delay: "1s", dur: "12s" },
  ];
  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none",
        className,
      )}
    >
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {beams.map((_, i) => (
            <linearGradient
              key={i}
              id={`lb-${i}`}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="transparent" />
              <stop offset="40%" stopColor={`hsl(var(--primary)/0.5)`} />
              <stop offset="60%" stopColor={`hsl(var(--secondary)/0.4)`} />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          ))}
        </defs>
        {beams.map((b, i) => (
          <line
            key={i}
            x1={b.x}
            y1="-10%"
            x2={b.x}
            y2="110%"
            stroke={`url(#lb-${i})`}
            strokeWidth="1"
          >
            <animate
              attributeName="opacity"
              values="0;0.8;0"
              dur={b.dur}
              begin={b.delay}
              repeatCount="indefinite"
            />
            <animate
              attributeName="x1"
              values={`calc(${b.x} - 5%);${b.x};calc(${b.x} + 5%)`}
              dur={b.dur}
              begin={b.delay}
              repeatCount="indefinite"
            />
            <animate
              attributeName="x2"
              values={`calc(${b.x} + 5%);${b.x};calc(${b.x} - 5%)`}
              dur={b.dur}
              begin={b.delay}
              repeatCount="indefinite"
            />
          </line>
        ))}
      </svg>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,transparent,hsl(var(--background)))]" />
    </div>
  );
}

/* ─── Floating Nav ─── */
export function FloatingNav({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <motion.nav
      initial={false}
      animate={scrolled ? { y: 8, scale: 0.98 } : { y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "mx-4 mt-2 rounded-2xl glass shadow-lg shadow-black/10"
          : "border-b border-border bg-background/80 backdrop-blur-xl",
        className,
      )}
    >
      {children}
    </motion.nav>
  );
}

/* ─── Shimmer Button ─── */
export function ShimmerButton({
  children,
  className,
  onClick,
  disabled,
  type = "button",
  colorFrom,
  colorTo,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  colorFrom?: string;
  colorTo?: string;
}) {
  const from = colorFrom ?? "hsl(var(--primary))";
  const to = colorTo ?? "hsl(var(--secondary))";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ background: `linear-gradient(to right, ${from}, ${to})` }}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-all",
        "hover:opacity-90 hover:shadow-[0_0_24px_-4px_hsl(var(--primary)/0.6)] hover:scale-[1.02]",
        "active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
        className,
      )}
    >
      <span className="absolute inset-0 -translate-x-full animate-[shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <style>{`@keyframes shimmer { to { transform: translateX(200%); } }`}</style>
      {children}
    </button>
  );
}

/* ─── Tilt Card ─── */
export function TiltCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(y, { stiffness: 200, damping: 20 });
  const rotateY = useSpring(x, { stiffness: 200, damping: 20 });

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current!.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width - 0.5;
    const cy = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(cx * 12);
    y.set(-cy * 12);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={cn("cursor-default", className)}
    >
      {children}
    </motion.div>
  );
}

/* ─── Animated Number ─── */
export function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(value / 30);
    const t = setInterval(() => {
      start = Math.min(start + step, value);
      setDisplay(start);
      if (start >= value) clearInterval(t);
    }, 30);
    return () => clearInterval(t);
  }, [value]);
  return <>{display}</>;
}

/* ─── Typing Text ─── */
export function TypingText({
  words,
  className,
}: {
  words: string[];
  className?: string;
}) {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[idx % words.length];
    const timeout = setTimeout(
      () => {
        if (!deleting) {
          setText(word.slice(0, text.length + 1));
          if (text.length + 1 === word.length)
            setTimeout(() => setDeleting(true), 1500);
        } else {
          setText(word.slice(0, text.length - 1));
          if (text.length === 0) {
            setDeleting(false);
            setIdx((i) => i + 1);
          }
        }
      },
      deleting ? 40 : 80,
    );
    return () => clearTimeout(timeout);
  }, [text, deleting, idx, words]);

  return (
    <span className={className}>
      {text}
      <span className="animate-pulse text-primary">|</span>
    </span>
  );
}
