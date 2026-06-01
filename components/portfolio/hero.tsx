"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowDown, Github, Linkedin, Mail, Sparkles } from "lucide-react";
import Link from "next/link";

const roles = [
  "Backend Developer",
  "Node.js Engineer",
  "API Architect",
  "System Designer",
];

function TypewriterRoles() {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) {
      const t = setTimeout(() => setPaused(false), 1400);
      return () => clearTimeout(t);
    }

    const current = roles[index];
    if (!deleting) {
      if (displayed.length < current.length) {
        const t = setTimeout(
          () => setDisplayed(current.slice(0, displayed.length + 1)),
          60,
        );
        return () => clearTimeout(t);
      } else {
        setPaused(true);
        setDeleting(true);
      }
    } else {
      if (displayed.length > 0) {
        const t = setTimeout(
          () => setDisplayed(current.slice(0, displayed.length - 1)),
          35,
        );
        return () => clearTimeout(t);
      } else {
        setDeleting(false);
        setIndex((i) => (i + 1) % roles.length);
      }
    }
  }, [displayed, deleting, index, paused]);

  return (
    <span className="gradient-text-cyan font-display">
      {displayed}
      <span className="terminal-cursor text-primary">|</span>
    </span>
  );
}

function FloatingOrb({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
      style={style}
    />
  );
}

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 30 });

  const orb1X = useTransform(springX, [-1, 1], [-30, 30]);
  const orb1Y = useTransform(springY, [-1, 1], [-20, 20]);
  const orb2X = useTransform(springX, [-1, 1], [20, -20]);
  const orb2Y = useTransform(springY, [-1, 1], [30, -30]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mouseX.set(x);
    mouseY.set(y);
  };

  const scrollDown = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      aria-label="Hero — Pranta Das, Backend Developer"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden grid-pattern"
    >
      {/* Background orbs */}
      <motion.div
        style={{ x: orb1X, y: orb1Y }}
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
        animate={{ opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-full h-full rounded-full blur-[120px] bg-primary/20" />
      </motion.div>

      <motion.div
        style={{ x: orb2X, y: orb2Y }}
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        animate={{ opacity: [0.1, 0.2, 0.1] }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      >
        <div className="w-full h-full rounded-full blur-[100px] bg-secondary/20" />
      </motion.div>

      {/* Grid fade edges */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background pointer-events-none" />

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 container max-w-5xl mx-auto px-6 text-center pb-24"
      >
        {/* Status badge */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center mb-8"
        >
          {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-sm font-mono text-primary/80 backdrop-blur-sm">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            Available for new opportunities
          </div> */}
        </motion.div>

        {/* Main heading */}
        <motion.h1
          variants={itemVariants}
          className="font-display font-bold leading-[0.95] mb-6"
          style={{ fontSize: "clamp(3rem, 10vw, 8rem)" }}
        >
          <span className="block text-white">Pranta</span>
          <span className="block gradient-text-main">Das</span>
        </motion.h1>

        {/* Role typewriter */}
        <motion.div
          variants={itemVariants}
          className="text-xl md:text-2xl font-mono mb-8 h-8 flex items-center justify-center"
        >
          <TypewriterRoles />
        </motion.div>

        {/* Bio */}
        <motion.p
          variants={itemVariants}
          className="text-white/50 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Team Lead & Backend Engineer from{" "}
          <span className="text-white/75 font-medium">
            Dhaka, Bangladesh 🇧🇩
          </span>
          . Building scalable systems, intelligent bots, and high-performance
          APIs that power real products.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-4 mb-14"
        >
          <MagneticButton
            onClick={() =>
              document
                .getElementById("projects")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-7 py-3.5 rounded-xl bg-primary text-background font-semibold text-sm hover:bg-primary/90 transition-all duration-200 glow-cyan"
          >
            View Projects
          </MagneticButton>

          <MagneticButton
            onClick={() =>
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-7 py-3.5 rounded-xl border border-white/10 bg-white/5 text-white font-semibold text-sm hover:bg-white/10 hover:border-white/20 transition-all duration-200"
          >
            Get in Touch
          </MagneticButton>
        </motion.div>

        {/* Social links */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-6"
        >
          <Link
            href="https://github.com/Prantadas"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Pranta Das on GitHub"
            className="flex items-center gap-2 text-white/40 hover:text-white/80 transition-colors text-sm"
          >
            <Github className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">GitHub</span>
          </Link>
          <div className="w-px h-4 bg-white/10" aria-hidden="true" />
          <Link
            href="https://linkedin.com/in/pranta-das7"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Pranta Das on LinkedIn"
            className="flex items-center gap-2 text-white/40 hover:text-white/80 transition-colors text-sm"
          >
            <Linkedin className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">LinkedIn</span>
          </Link>
          <div className="w-px h-4 bg-white/10" aria-hidden="true" />
          <Link
            href="mailto:prantodas043@gmail.com"
            aria-label="Email Pranta Das"
            className="flex items-center gap-2 text-white/40 hover:text-white/80 transition-colors text-sm"
          >
            <Mail className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Email</span>
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        onClick={scrollDown}
        aria-label="Scroll to About section"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 hover:text-white/60 transition-colors group"
      >
        <span className="text-xs font-mono tracking-widest uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="w-4 h-4" />
        </motion.div>
      </motion.button>

      {/* Corner decorations */}
      <div className="absolute top-24 right-8 md:right-16 text-primary/20 font-mono text-xs text-right leading-relaxed hidden md:block select-none">
        <div>// backend_developer.ts</div>
        <div>
          const <span className="text-primary/40">pranta</span> = {"{"}
        </div>
        <div>
          &nbsp;&nbsp;role: <span className="text-white/30">"engineer"</span>,
        </div>
        <div>
          &nbsp;&nbsp;location:{" "}
          <span className="text-white/30">"Dhaka, BD 🇧🇩"</span>,
        </div>
        <div>
          &nbsp;&nbsp;status:{" "}
          <span className="text-primary/50">"available"</span>
        </div>
        <div>{"}"}</div>
      </div>
    </section>
  );
}

function MagneticButton({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    x.set(dx * 0.3);
    y.set(dy * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.button>
  );
}
