"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Github, Linkedin, Mail, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const roles = ["Backend Developer", "Node.js Engineer", "API Architect", "System Designer"];

function LocalTimeBadge() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Dhaka",
        }),
      );
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);
  if (!time) return null;
  return (
    <div className="flex items-center gap-1.5 text-xs font-mono text-white/30">
      <Clock className="w-3 h-3" aria-hidden="true" />
      {time} · Dhaka
    </div>
  );
}


const stack = [
  { name: "Node.js", color: "#68a063" },
  { name: "TypeScript", color: "#3178c6" },
  { name: "NestJS", color: "#e0234e" },
  { name: "PostgreSQL", color: "#336791" },
  { name: "Redis", color: "#dc382d" },
  { name: "Docker", color: "#2496ed" },
  { name: "RabbitMQ", color: "#ff6600" },
  { name: "Web3", color: "#a855f7" },
];

function TypewriterRoles() {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [del, setDel] = useState(false);
  const [pause, setPause] = useState(false);

  useEffect(() => {
    if (pause) { const t = setTimeout(() => setPause(false), 1600); return () => clearTimeout(t); }
    const cur = roles[idx];
    if (!del) {
      if (text.length < cur.length) {
        const t = setTimeout(() => setText(cur.slice(0, text.length + 1)), 65);
        return () => clearTimeout(t);
      } else { setPause(true); setDel(true); }
    } else {
      if (text.length > 0) {
        const t = setTimeout(() => setText(cur.slice(0, text.length - 1)), 38);
        return () => clearTimeout(t);
      } else { setDel(false); setIdx(i => (i + 1) % roles.length); }
    }
  }, [text, del, idx, pause]);

  return (
    <span className="text-primary font-mono">
      {text}<span className="terminal-cursor">|</span>
    </span>
  );
}

function MagneticButton({ children, onClick, className, href }: {
  children: React.ReactNode; onClick?: () => void; className?: string; href?: string;
}) {
  const ref = useRef<HTMLButtonElement & HTMLAnchorElement>(null);
  const x = useMotionValue(0); const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 15 });
  const sy = useSpring(y, { stiffness: 150, damping: 15 });
  const move = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set((e.clientX - (r.left + r.width / 2)) * 0.3);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.3);
  };
  const reset = () => { x.set(0); y.set(0); };
  if (href) return (
    <motion.a ref={ref as React.Ref<HTMLAnchorElement>} href={href} download onMouseMove={move} onMouseLeave={reset} style={{ x: sx, y: sy }} className={className}>{children}</motion.a>
  );
  return (
    <motion.button ref={ref as React.Ref<HTMLButtonElement>} onClick={onClick} onMouseMove={move} onMouseLeave={reset} style={{ x: sx, y: sy }} className={className}>{children}</motion.button>
  );
}

// ── Terminal code card ────────────────────────────────────────────────────────
function TerminalCard() {
  const lines = [
    { indent: 0, parts: [{ t: "const", c: "#569cd6" }, { t: " developer", c: "#9cdcfe" }, { t: " = {", c: "#d4d4d4" }] },
    { indent: 1, parts: [{ t: "name", c: "#9cdcfe" }, { t: ": ", c: "#d4d4d4" }, { t: '"Pranta Das"', c: "#ce9178" }, { t: ",", c: "#d4d4d4" }] },
    { indent: 1, parts: [{ t: "role", c: "#9cdcfe" }, { t: ": ", c: "#d4d4d4" }, { t: '"Backend Dev & Team Lead"', c: "#ce9178" }, { t: ",", c: "#d4d4d4" }] },
    { indent: 1, parts: [{ t: "location", c: "#9cdcfe" }, { t: ": ", c: "#d4d4d4" }, { t: '"Dhaka, Bangladesh 🇧🇩"', c: "#ce9178" }, { t: ",", c: "#d4d4d4" }] },
    { indent: 1, parts: [{ t: "experience", c: "#9cdcfe" }, { t: ": ", c: "#d4d4d4" }, { t: '"3+ years"', c: "#ce9178" }, { t: ",", c: "#d4d4d4" }] },
    { indent: 1, parts: [{ t: "stack", c: "#9cdcfe" }, { t: ": [", c: "#d4d4d4" }, { t: '"Node"', c: "#ce9178" }, { t: ", ", c: "#d4d4d4" }, { t: '"TS"', c: "#ce9178" }, { t: ", ", c: "#d4d4d4" }, { t: '"NestJS"', c: "#ce9178" }, { t: ", ...]", c: "#d4d4d4" }] },
    { indent: 1, parts: [{ t: "available", c: "#9cdcfe" }, { t: ": ", c: "#d4d4d4" }, { t: "true", c: "#569cd6" }, { t: ",", c: "#d4d4d4" }] },
    { indent: 0, parts: [{ t: "}", c: "#d4d4d4" }] },
    { indent: 0, parts: [] },
    { indent: 0, parts: [{ t: "export default", c: "#c586c0" }, { t: " developer", c: "#9cdcfe" }] },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full max-w-sm"
      style={{ perspective: 1000 }}
    >
      {/* Glow behind the card */}
      <div className="absolute -inset-4 rounded-2xl bg-primary/10 blur-2xl pointer-events-none" />

      <div className="relative rounded-2xl border border-white/8 bg-[#1e1e1e] overflow-hidden shadow-2xl">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[#2d2d2d] border-b border-white/6">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="ml-2 text-xs text-white/30 font-mono">pranta.config.ts</span>
        </div>

        {/* Code */}
        <div className="p-5 font-mono text-[13px] leading-7">
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.07, duration: 0.4 }}
              className="flex"
            >
              <span className="w-6 text-white/15 select-none mr-4 text-right flex-shrink-0">{i + 1}</span>
              <span style={{ paddingLeft: `${line.indent * 16}px` }}>
                {line.parts.map((p, j) => (
                  <span key={j} style={{ color: p.c }}>{p.t}</span>
                ))}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#007acc] text-white text-[11px] font-mono">
          <span>TypeScript</span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#28c840] inline-block" />
            available
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const ox = useSpring(useMotionValue(0), { stiffness: 40, damping: 25 });
  const oy = useSpring(useMotionValue(0), { stiffness: 40, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = heroRef.current?.getBoundingClientRect();
    if (!r) return;
    const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
    const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
    mouseX.set(nx); mouseY.set(ny);
    ox.set(nx * -25); oy.set(ny * -25);
  };

  const item = {
    hidden: { opacity: 0, y: 28 },
    visible: (i: number) => ({
      opacity: 1, y: 0,
      transition: { delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    }),
  };

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      aria-label="Hero — Pranta Das, Backend Developer"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background/60 pointer-events-none" />

      {/* Orbs */}
      <motion.div style={{ x: ox, y: oy }} className="absolute top-1/3 left-1/3 w-[700px] h-[700px] rounded-full blur-[140px] bg-primary/12 pointer-events-none" />
      <motion.div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px] bg-secondary/10 pointer-events-none"
        animate={{ opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 8, repeat: Infinity }} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <div className="flex flex-col lg:flex-row lg:items-center gap-12 lg:gap-8 xl:gap-16">

          {/* ── Left ─────────────────────────────────────────────── */}
          <div className="flex-1 max-w-2xl">

            {/* Greeting + badge row */}
            <motion.div custom={0} variants={item} initial="hidden" animate="visible"
              className="flex flex-wrap items-center gap-3 mb-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-xs font-mono text-primary/80">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                </span>
                Open to opportunities
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono text-white/30">
                <span>📍</span> Dhaka, Bangladesh
              </div>
              <LocalTimeBadge />
            </motion.div>

            {/* Name */}
            <motion.div custom={1} variants={item} initial="hidden" animate="visible">
              <p className="text-sm font-mono text-white/35 mb-2 tracking-wider">Hi, I&apos;m</p>
              <h1 className="font-display font-black text-white leading-[0.88] mb-4"
                style={{ fontSize: "clamp(3.5rem, 9vw, 7.5rem)" }}>
                Pranta<br />
                <span className="gradient-text-main">Das.</span>
              </h1>
            </motion.div>

            {/* Role */}
            <motion.div custom={2} variants={item} initial="hidden" animate="visible"
              className="flex items-center gap-3 mb-6 font-mono text-lg">
              <span className="text-white/30">&gt;</span>
              <TypewriterRoles />
            </motion.div>

            {/* Bio */}
            <motion.p custom={3} variants={item} initial="hidden" animate="visible"
              className="text-white/50 text-base md:text-[17px] leading-relaxed mb-8 max-w-lg">
              Team Lead building{" "}
              <span className="text-white/80">scalable backends</span>,{" "}
              <span className="text-white/80">intelligent bots</span>, and{" "}
              <span className="text-white/80">high-performance APIs</span>{" "}
              that power real products at scale.
            </motion.p>

            {/* Tech stack */}
            <motion.div custom={4} variants={item} initial="hidden" animate="visible"
              className="flex flex-wrap gap-2 mb-9">
              {stack.map(({ name, color }) => (
                <span key={name}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-white/6 bg-white/3 text-xs font-mono text-white/50 hover:text-white/80 hover:border-white/15 transition-colors cursor-default">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
                  {name}
                </span>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div custom={5} variants={item} initial="hidden" animate="visible"
              className="flex flex-wrap items-center gap-3 mb-8">
              <MagneticButton
                onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-background font-bold text-sm hover:bg-primary/90 transition-all glow-cyan"
              >
                View Projects <ArrowRight className="w-4 h-4" />
              </MagneticButton>
              <MagneticButton
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="px-6 py-3 rounded-xl border border-white/10 bg-white/4 text-white/80 font-semibold text-sm hover:bg-white/8 hover:border-white/20 transition-all"
              >
                Get in Touch
              </MagneticButton>
            </motion.div>

            {/* Socials */}
            <motion.div custom={6} variants={item} initial="hidden" animate="visible"
              className="flex items-center gap-5">
              {[
                { href: "https://github.com/Prantadas", icon: Github, label: "GitHub" },
                { href: "https://linkedin.com/in/pranta-das7", icon: Linkedin, label: "LinkedIn" },
                { href: "mailto:prantodas043@gmail.com", icon: Mail, label: "Email" },
              ].map(({ href, icon: Icon, label }, i) => (
                <span key={label}>
                  {i > 0 && <span className="sr-only">,</span>}
                  <Link href={href} target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    aria-label={label}
                    className="flex items-center gap-1.5 text-white/35 hover:text-white/80 transition-colors text-sm">
                    <Icon className="w-4 h-4" /><span className="hidden sm:inline">{label}</span>
                  </Link>
                </span>
              ))}
            </motion.div>
          </div>

          {/* ── Right ────────────────────────────────────────────── */}
          <div className="flex flex-col items-center lg:items-end gap-6 lg:flex-shrink-0">

            {/* Photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <motion.div
                className="absolute -inset-[3px] rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                style={{ background: "conic-gradient(from 0deg, #00d4ff 0%, transparent 40%, #a855f7 60%, transparent 80%, #00d4ff 100%)" }}
              />
              <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-background">
                <Image src="/photo.webp" alt="Pranta Das" fill className="object-cover" priority />
              </div>
              {/* Ping badge */}
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ delay: 1.2, type: "spring", stiffness: 260 }}
                className="absolute -bottom-1 -right-1 flex items-center gap-1 px-2.5 py-1 rounded-full bg-background border border-emerald-500/30 text-emerald-400 text-[11px] font-mono shadow-lg"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                available
              </motion.div>
            </motion.div>

            {/* Terminal card */}
            <TerminalCard />
          </div>

        </div>
      </div>

      {/* Scroll cue — mouse-scroll icon */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
        aria-label="Scroll down"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 text-white/25 hover:text-white/50 transition-colors group"
      >
        <span className="text-[10px] font-mono tracking-widest uppercase">scroll</span>
        {/* Mouse outline */}
        <div className="relative w-5 h-8 rounded-full border border-current flex items-start justify-center pt-1.5">
          {/* Scrolling dot */}
          <motion.div
            className="w-1 h-1.5 rounded-full bg-current"
            animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.button>
    </section>
  );
}
