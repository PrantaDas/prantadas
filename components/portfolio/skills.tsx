"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronRight } from "lucide-react";
import { skillsData } from "@/data/skills";

// ─── Category metadata ───────────────────────────────────────────────────────
const categoryMeta: Record<
  string,
  {
    text: string;
    border: string;
    bg: string;
    activeBg: string;
    activeBorder: string;
    activeText: string;
    glow: string;
    dot: string;
  }
> = {
  Language: {
    text: "text-yellow-400/70",
    border: "border-yellow-400/20",
    bg: "bg-yellow-400/5",
    activeBg: "bg-yellow-400/15",
    activeBorder: "border-yellow-400/50",
    activeText: "text-yellow-300",
    glow: "0 0 20px rgba(250,204,21,0.25)",
    dot: "bg-yellow-400",
  },
  Frontend: {
    text: "text-blue-400/70",
    border: "border-blue-400/20",
    bg: "bg-blue-400/5",
    activeBg: "bg-blue-400/15",
    activeBorder: "border-blue-400/50",
    activeText: "text-blue-300",
    glow: "0 0 20px rgba(96,165,250,0.25)",
    dot: "bg-blue-400",
  },
  Backend: {
    text: "text-emerald-400/70",
    border: "border-emerald-400/20",
    bg: "bg-emerald-400/5",
    activeBg: "bg-emerald-400/15",
    activeBorder: "border-emerald-400/50",
    activeText: "text-emerald-300",
    glow: "0 0 20px rgba(52,211,153,0.25)",
    dot: "bg-emerald-400",
  },
  API: {
    text: "text-violet-400/70",
    border: "border-violet-400/20",
    bg: "bg-violet-400/5",
    activeBg: "bg-violet-400/15",
    activeBorder: "border-violet-400/50",
    activeText: "text-violet-300",
    glow: "0 0 20px rgba(167,139,250,0.25)",
    dot: "bg-violet-400",
  },
  Blockchain: {
    text: "text-orange-400/70",
    border: "border-orange-400/20",
    bg: "bg-orange-400/5",
    activeBg: "bg-orange-400/15",
    activeBorder: "border-orange-400/50",
    activeText: "text-orange-300",
    glow: "0 0 20px rgba(251,146,60,0.25)",
    dot: "bg-orange-400",
  },
  Database: {
    text: "text-red-400/70",
    border: "border-red-400/20",
    bg: "bg-red-400/5",
    activeBg: "bg-red-400/15",
    activeBorder: "border-red-400/50",
    activeText: "text-red-300",
    glow: "0 0 20px rgba(248,113,113,0.25)",
    dot: "bg-red-400",
  },
  ORM: {
    text: "text-pink-400/70",
    border: "border-pink-400/20",
    bg: "bg-pink-400/5",
    activeBg: "bg-pink-400/15",
    activeBorder: "border-pink-400/50",
    activeText: "text-pink-300",
    glow: "0 0 20px rgba(244,114,182,0.25)",
    dot: "bg-pink-400",
  },
  Bot: {
    text: "text-cyan-400/70",
    border: "border-cyan-400/20",
    bg: "bg-cyan-400/5",
    activeBg: "bg-cyan-400/15",
    activeBorder: "border-cyan-400/50",
    activeText: "text-cyan-300",
    glow: "0 0 20px rgba(34,211,238,0.25)",
    dot: "bg-cyan-400",
  },
  "Message Queue": {
    text: "text-amber-400/70",
    border: "border-amber-400/20",
    bg: "bg-amber-400/5",
    activeBg: "bg-amber-400/15",
    activeBorder: "border-amber-400/50",
    activeText: "text-amber-300",
    glow: "0 0 20px rgba(251,191,36,0.25)",
    dot: "bg-amber-400",
  },
  Realtime: {
    text: "text-teal-400/70",
    border: "border-teal-400/20",
    bg: "bg-teal-400/5",
    activeBg: "bg-teal-400/15",
    activeBorder: "border-teal-400/50",
    activeText: "text-teal-300",
    glow: "0 0 20px rgba(45,212,191,0.25)",
    dot: "bg-teal-400",
  },
  Automation: {
    text: "text-indigo-400/70",
    border: "border-indigo-400/20",
    bg: "bg-indigo-400/5",
    activeBg: "bg-indigo-400/15",
    activeBorder: "border-indigo-400/50",
    activeText: "text-indigo-300",
    glow: "0 0 20px rgba(129,140,248,0.25)",
    dot: "bg-indigo-400",
  },
  Scrapping: {
    text: "text-lime-400/70",
    border: "border-lime-400/20",
    bg: "bg-lime-400/5",
    activeBg: "bg-lime-400/15",
    activeBorder: "border-lime-400/50",
    activeText: "text-lime-300",
    glow: "0 0 20px rgba(163,230,53,0.25)",
    dot: "bg-lime-400",
  },
  Scripting: {
    text: "text-purple-400/70",
    border: "border-purple-400/20",
    bg: "bg-purple-400/5",
    activeBg: "bg-purple-400/15",
    activeBorder: "border-purple-400/50",
    activeText: "text-purple-300",
    glow: "0 0 20px rgba(192,132,252,0.25)",
    dot: "bg-purple-400",
  },
};

const fallbackMeta = {
  text: "text-white/40",
  border: "border-white/10",
  bg: "bg-white/5",
  activeBg: "bg-white/10",
  activeBorder: "border-white/30",
  activeText: "text-white/80",
  glow: "0 0 20px rgba(255,255,255,0.1)",
  dot: "bg-white/30",
};

// ─── Skill card ───────────────────────────────────────────────────────────────
function SkillCard({
  skill,
  index,
}: {
  skill: (typeof skillsData)[0];
  index: number;
}) {
  const Icon = skill.logo;
  const c = categoryMeta[skill.category] ?? fallbackMeta;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{
        duration: 0.28,
        delay: Math.min(index * 0.02, 0.4),
        layout: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
      }}
      whileHover={{
        y: -5,
        transition: { duration: 0.18 },
      }}
      style={{ "--card-glow": c.glow } as React.CSSProperties}
      className="group flex flex-col items-center gap-2.5 p-3.5 rounded-2xl border border-white/8 bg-white/3 backdrop-blur-sm cursor-default select-none hover:border-opacity-100 transition-all duration-200 skill-card"
    >
      <div className={`text-2xl sm:text-3xl leading-none ${c.text} group-hover:${c.activeText} transition-colors duration-200`}>
        <Icon />
      </div>
      <span className="text-[10px] sm:text-xs font-medium text-white/50 group-hover:text-white/80 transition-colors duration-200 text-center leading-tight px-1">
        {skill.name}
      </span>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} opacity-50 group-hover:opacity-80 transition-opacity`} />
    </motion.div>
  );
}

// ─── Category filter pill ────────────────────────────────────────────────────
function FilterPill({
  label,
  count,
  isActive,
  onClick,
  meta,
}: {
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
  meta: typeof fallbackMeta;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={isActive}
      className={`
        relative inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono
        border transition-all duration-200 whitespace-nowrap
        ${
          isActive
            ? `${meta.activeBg} ${meta.activeBorder} ${meta.activeText}`
            : "bg-transparent border-white/8 text-white/35 hover:border-white/20 hover:text-white/65"
        }
      `}
    >
      {label !== "All" && (
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${meta.dot} ${isActive ? "opacity-90" : "opacity-50"}`} />
      )}
      {label}
      <span className="opacity-45">({count})</span>
    </button>
  );
}

// ─── Section ─────────────────────────────────────────────────────────────────
export function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState("All");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const allCategories = [...new Set(skillsData.map((s) => s.category))];

  const filteredSkills =
    activeCategory === "All"
      ? skillsData
      : skillsData.filter((s) => s.category === activeCategory);

  const categoryCount = (cat: string) =>
    cat === "All"
      ? skillsData.length
      : skillsData.filter((s) => s.category === cat).length;

  return (
    <section
      id="skills"
      ref={ref}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse,rgba(139,92,246,0.06),transparent_70%)]" />
        <div className="absolute top-0 left-0 w-full h-full dot-pattern opacity-25" />
      </div>

      <div className="container max-w-6xl mx-auto px-6 relative z-10">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65 }}
          className="text-center mb-12"
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

          <p className="text-white/40 max-w-md mx-auto">
            A curated toolkit forged through years of building real-world
            systems at scale.
          </p>
        </motion.div>

        {/* ── Category filters ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.15 }}
          className="mb-10"
        >
          <div className="flex flex-wrap justify-center gap-2">
            <FilterPill
              label="All"
              count={categoryCount("All")}
              isActive={activeCategory === "All"}
              onClick={() => setActiveCategory("All")}
              meta={fallbackMeta}
            />
            {allCategories.map((cat) => (
              <FilterPill
                key={cat}
                label={cat}
                count={categoryCount(cat)}
                isActive={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
                meta={categoryMeta[cat] ?? fallbackMeta}
              />
            ))}
          </div>
        </motion.div>

        {/* ── Skill grid ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <AnimatePresence mode="popLayout">
            <motion.div
              layout
              className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-9 gap-2.5 sm:gap-3"
            >
              {filteredSkills.map((skill, i) => (
                <SkillCard key={skill.name} skill={skill} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* ── Footer ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
        >
          {allCategories.map((cat) => {
            const c = categoryMeta[cat] ?? fallbackMeta;
            return (
              <button
                key={cat}
                onClick={() =>
                  setActiveCategory(activeCategory === cat ? "All" : cat)
                }
                className="group flex items-center gap-1.5 text-[11px] text-white/20 hover:text-white/45 transition-colors"
              >
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot}`} />
                <span className="font-mono">{cat}</span>
                <ChevronRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity -ml-0.5" />
              </button>
            );
          })}
          <span className="text-[11px] font-mono text-white/12 ml-2">
            · {skillsData.length} total
          </span>
        </motion.div>
      </div>
    </section>
  );
}
