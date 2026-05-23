"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Sparkles, Cpu } from "lucide-react";
import { skillsData } from "@/data/skills";

// ─── Color map per category ──────────────────────────────────────────────────
const categoryMeta: Record<
  string,
  { text: string; border: string; bg: string; dot: string; glow: string }
> = {
  Language: {
    text: "text-yellow-300",
    border: "border-yellow-400/30",
    bg: "bg-yellow-400/8",
    dot: "bg-yellow-400",
    glow: "rgba(250,204,21,0.22)",
  },
  Frontend: {
    text: "text-blue-300",
    border: "border-blue-400/30",
    bg: "bg-blue-400/8",
    dot: "bg-blue-400",
    glow: "rgba(96,165,250,0.22)",
  },
  Backend: {
    text: "text-emerald-300",
    border: "border-emerald-400/30",
    bg: "bg-emerald-400/8",
    dot: "bg-emerald-400",
    glow: "rgba(52,211,153,0.22)",
  },
  API: {
    text: "text-violet-300",
    border: "border-violet-400/30",
    bg: "bg-violet-400/8",
    dot: "bg-violet-400",
    glow: "rgba(167,139,250,0.22)",
  },
  Blockchain: {
    text: "text-orange-300",
    border: "border-orange-400/30",
    bg: "bg-orange-400/8",
    dot: "bg-orange-400",
    glow: "rgba(251,146,60,0.22)",
  },
  Database: {
    text: "text-red-300",
    border: "border-red-400/30",
    bg: "bg-red-400/8",
    dot: "bg-red-400",
    glow: "rgba(248,113,113,0.22)",
  },
  ORM: {
    text: "text-pink-300",
    border: "border-pink-400/30",
    bg: "bg-pink-400/8",
    dot: "bg-pink-400",
    glow: "rgba(244,114,182,0.22)",
  },
  Bot: {
    text: "text-cyan-300",
    border: "border-cyan-400/30",
    bg: "bg-cyan-400/8",
    dot: "bg-cyan-400",
    glow: "rgba(34,211,238,0.22)",
  },
  "Message Queue": {
    text: "text-amber-300",
    border: "border-amber-400/30",
    bg: "bg-amber-400/8",
    dot: "bg-amber-400",
    glow: "rgba(251,191,36,0.22)",
  },
  Realtime: {
    text: "text-teal-300",
    border: "border-teal-400/30",
    bg: "bg-teal-400/8",
    dot: "bg-teal-400",
    glow: "rgba(45,212,191,0.22)",
  },
  Automation: {
    text: "text-indigo-300",
    border: "border-indigo-400/30",
    bg: "bg-indigo-400/8",
    dot: "bg-indigo-400",
    glow: "rgba(129,140,248,0.22)",
  },
  Scrapping: {
    text: "text-lime-300",
    border: "border-lime-400/30",
    bg: "bg-lime-400/8",
    dot: "bg-lime-400",
    glow: "rgba(163,230,53,0.22)",
  },
  Scripting: {
    text: "text-purple-300",
    border: "border-purple-400/30",
    bg: "bg-purple-400/8",
    dot: "bg-purple-400",
    glow: "rgba(192,132,252,0.22)",
  },
};

const fallbackMeta = {
  text: "text-white/50",
  border: "border-white/10",
  bg: "bg-white/5",
  dot: "bg-white/30",
  glow: "rgba(255,255,255,0.1)",
};

// ─── Distribute skills across 5 rows (mix categories) ───────────────────────
const ROW_COUNT = 5;
function buildMarqueeRows() {
  const rows: (typeof skillsData)[] = Array.from(
    { length: ROW_COUNT },
    () => [],
  );
  skillsData.forEach((skill, i) => rows[i % ROW_COUNT].push(skill));
  // Quadruple each row so -50% keyframe loops over 2 copies — always fills wide screens
  return rows.map((row) => [...row, ...row, ...row, ...row]);
}
const marqueeRows = buildMarqueeRows();

const rowConfig = [
  { duration: 44, reverse: false },
  { duration: 34, reverse: true },
  { duration: 54, reverse: false },
  { duration: 38, reverse: true },
  { duration: 48, reverse: false },
] as const;

// ─── Skill pill ──────────────────────────────────────────────────────────────
function SkillPill({ skill }: { skill: (typeof skillsData)[0] }) {
  const Icon = skill.logo;
  const c = categoryMeta[skill.category] ?? fallbackMeta;
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.1, boxShadow: `0 0 22px 3px ${c.glow}` }}
      transition={{ type: "spring", stiffness: 380, damping: 22 }}
      className={`
        inline-flex items-center gap-2.5 px-4 py-2 rounded-full
        border ${c.border} ${c.bg} backdrop-blur-sm
        cursor-default flex-shrink-0 whitespace-nowrap select-none
        transition-colors duration-200
      `}
    >
      <span className={`text-lg leading-none ${c.text}`}>
        <Icon />
      </span>
      <span
        className={`text-sm font-medium ${c.text} opacity-80 hover:opacity-100`}
      >
        {skill.name}
      </span>
    </motion.div>
  );
}

// ─── Single marquee lane ─────────────────────────────────────────────────────
function MarqueeLane({
  skills,
  duration,
  reverse,
}: {
  skills: typeof skillsData;
  duration: number;
  reverse: boolean;
}) {
  return (
    <div
      className="group flex overflow-hidden py-1.5"
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)",
      }}
    >
      <div
        className="flex gap-3 flex-nowrap group-hover:[animation-play-state:paused]"
        style={{
          animation: `marquee ${duration}s linear infinite${reverse ? " reverse" : ""}`,
          willChange: "transform",
        }}
      >
        {skills.map((skill, i) => (
          <SkillPill key={`${skill.name}-${i}`} skill={skill} />
        ))}
      </div>
    </div>
  );
}

// ─── Section ─────────────────────────────────────────────────────────────────
export function SkillsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const allCategories = [...new Set(skillsData.map((s) => s.category))];
  const totalSkills = skillsData.length;

  return (
    <section
      id="skills"
      ref={ref}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[radial-gradient(ellipse,rgba(139,92,246,0.08),transparent_70%)]" />
        <div className="absolute top-0 left-0 w-full h-full dot-pattern opacity-30" />
      </div>

      {/* ── Header ── */}
      <div className="container max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/15 bg-primary/5 mb-6">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-xs font-mono text-primary/70 uppercase tracking-widest">
              Tech Stack
            </span>
          </div>

          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Skills &amp;{" "}
            <span className="gradient-text-purple">Technologies</span>
          </h2>

          <p className="text-white/40 max-w-md mx-auto mb-8">
            A curated toolkit forged through years of building real-world
            systems at scale.
          </p>

          {/* Category legend */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex flex-wrap justify-center gap-x-4 gap-y-2"
          >
            {allCategories.map((cat) => {
              const c = categoryMeta[cat] ?? fallbackMeta;
              return (
                <span
                  key={cat}
                  className="inline-flex items-center gap-1.5 text-xs text-white/40"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                  {cat}
                </span>
              );
            })}
          </motion.div>
        </motion.div>
      </div>

      {/* ── Marquee streams (full-width) ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative z-10 space-y-2 mt-4"
      >
        {rowConfig.map((cfg, rowIdx) => (
          <MarqueeLane
            key={rowIdx}
            skills={marqueeRows[rowIdx]}
            duration={cfg.duration}
            reverse={cfg.reverse}
          />
        ))}
      </motion.div>

      {/* ── Footer count ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="container max-w-6xl mx-auto px-6 relative z-10 mt-10"
      >
        <div className="flex items-center justify-center gap-3 text-white/20 text-xs font-mono">
          <Cpu className="w-3.5 h-3.5" />
          <span>{totalSkills} technologies</span>
          <span className="w-1 h-1 rounded-full bg-white/10" />
          <span>hover a row to pause</span>
        </div>
      </motion.div>
    </section>
  );
}
