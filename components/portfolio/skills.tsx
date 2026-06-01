"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronRight, LayoutGrid, Radar } from "lucide-react";
import { skillsData } from "@/data/skills";
import {
  RadarChart, Radar as ReRadar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, ResponsiveContainer, Tooltip,
} from "recharts";

const radarData = [
  { subject: "Backend Dev",  score: 95 },
  { subject: "API Design",   score: 90 },
  { subject: "Databases",    score: 85 },
  { subject: "Realtime",     score: 80 },
  { subject: "Web3",         score: 75 },
  { subject: "DevOps",       score: 70 },
  { subject: "Automation",   score: 65 },
  { subject: "Frontend",     score: 55 },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function RadarTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-[#0d1117] px-3 py-2 text-xs font-mono shadow-xl">
      <span className="text-white/50">{payload[0]?.payload?.subject}: </span>
      <span className="text-primary font-bold">{payload[0]?.value}%</span>
    </div>
  );
}

function TechRadar() {
  return (
    <div className="flex flex-col lg:flex-row items-center gap-10">
      {/* Chart */}
      <div className="w-full max-w-sm flex-shrink-0">
        <ResponsiveContainer width="100%" height={360}>
          <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
            <PolarGrid stroke="rgba(255,255,255,0.06)" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11, fontFamily: "monospace" }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 9, fontFamily: "monospace" }}
              tickCount={5}
              stroke="rgba(255,255,255,0.04)"
            />
            <ReRadar
              dataKey="score"
              stroke="#00d4ff"
              strokeWidth={2}
              fill="#00d4ff"
              fillOpacity={0.12}
              dot={{ fill: "#00d4ff", r: 4 }}
            />
            <Tooltip content={<RadarTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Bar list */}
      <div className="flex-1 w-full space-y-3">
        {[...radarData].sort((a, b) => b.score - a.score).map(({ subject, score }) => (
          <div key={subject}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm text-white/65 font-mono">{subject}</span>
              <span className="text-xs text-primary/70 font-mono font-bold">{score}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: `hsl(${190 + (score / 100) * 60}, 80%, 55%)` }}
                initial={{ width: 0 }}
                whileInView={{ width: `${score}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
              />
            </div>
          </div>
        ))}
        <p className="text-xs text-white/20 font-mono pt-2">
          * Based on real-world production experience
        </p>
      </div>
    </div>
  );
}

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
      <div
        className={`text-2xl sm:text-3xl leading-none ${c.text} group-hover:${c.activeText} transition-colors duration-200`}
      >
        <Icon />
      </div>
      <span className="text-[10px] sm:text-xs font-medium text-white/50 group-hover:text-white/80 transition-colors duration-200 text-center leading-tight px-1">
        {skill.name}
      </span>
      <span
        className={`w-1.5 h-1.5 rounded-full ${c.dot} opacity-50 group-hover:opacity-80 transition-opacity`}
      />
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
        <span
          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${meta.dot} ${isActive ? "opacity-90" : "opacity-50"}`}
        />
      )}
      {label}
      <span className="opacity-45">({count})</span>
    </button>
  );
}

// ─── Section ─────────────────────────────────────────────────────────────────
export function SkillsSection() {
  const [view, setView] = useState<"grid" | "radar">("grid");
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
      className="relative py-16 md:py-24 overflow-hidden"
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

          <p className="text-white/40 max-w-md mx-auto mb-6">
            A curated toolkit forged through years of building real-world
            systems at scale.
          </p>

          {/* View toggle */}
          <div className="flex justify-center">
            <div className="inline-flex gap-1 p-1 rounded-xl bg-white/4 border border-white/8">
              <button
                onClick={() => setView("grid")}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition-all ${
                  view === "grid" ? "bg-white/10 text-white/85" : "text-white/35 hover:text-white/60"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" /> Skill Grid
              </button>
              <button
                onClick={() => setView("radar")}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition-all ${
                  view === "radar" ? "bg-white/10 text-white/85" : "text-white/35 hover:text-white/60"
                }`}
              >
                <Radar className="w-3.5 h-3.5" /> Tech Radar
              </button>
            </div>
          </div>
        </motion.div>

        {view === "grid" ? (
          <>
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

            {/* ── Footer legend ── */}
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
          </>
        ) : (
          /* ── Tech Radar ── */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-4"
          >
            <TechRadar />
          </motion.div>
        )}
      </div>
    </section>
  );
}
