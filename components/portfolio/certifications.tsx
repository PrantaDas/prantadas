"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ExternalLink, ShieldCheck, Sparkles, BadgeCheck } from "lucide-react";
import Link from "next/link";
import { certifications } from "@/data/certification";

const levelMap: Record<string, { label: string; ring: string; badge: string; bar: string; pct: number }> = {
  Basic:        { label: "Basic",        ring: "border-emerald-500/25", badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25", bar: "bg-emerald-400", pct: 40 },
  Intermediate: { label: "Intermediate", ring: "border-blue-500/25",    badge: "bg-blue-500/10 text-blue-400 border-blue-500/25",           bar: "bg-blue-400",    pct: 70 },
  Advanced:     { label: "Advanced",     ring: "border-purple-500/25",  badge: "bg-purple-500/10 text-purple-400 border-purple-500/25",     bar: "bg-purple-400",  pct: 95 },
};

function getLevel(name: string) {
  if (name.includes("Intermediate")) return levelMap.Intermediate;
  if (name.includes("Advanced")) return levelMap.Advanced;
  if (name.includes("Basic")) return levelMap.Basic;
  return { label: "Certified", ring: "border-white/10", badge: "bg-white/5 text-white/50 border-white/15", bar: "bg-primary", pct: 60 };
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/15 bg-primary/5 mb-6">
      <Sparkles className="w-3 h-3 text-primary" />
      <span className="text-xs font-mono text-primary/70 uppercase tracking-widest">{children}</span>
    </div>
  );
}

export function CertificationsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="certifications" ref={ref} className="relative py-16 md:py-24">
      {/* Subtle background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/3 to-transparent pointer-events-none" />

      <div className="container max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <SectionLabel>Certifications</SectionLabel>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Verified <span className="gradient-text-purple">Skills</span>
          </h2>
          <p className="text-white/40 max-w-lg mx-auto">
            Industry-recognised certifications from HackerRank — proof of production-level proficiency
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {certifications.map((cert, i) => {
            const level = getLevel(cert.name);
            return (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                className="group relative"
              >
                <div className={`relative rounded-2xl border ${level.ring} bg-gradient-to-br from-white/[0.04] to-transparent p-5 hover:from-white/[0.07] transition-all duration-300 overflow-hidden`}>
                  {/* Decorative corner pattern */}
                  <div className="absolute top-0 right-0 w-24 h-24 opacity-[0.04] pointer-events-none"
                    style={{ background: "radial-gradient(circle at top right, #fff 0%, transparent 70%)" }} />

                  {/* Header row */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#1e1e2e] border border-white/8 flex items-center justify-center flex-shrink-0">
                      {/* HackerRank-style icon */}
                      <svg viewBox="0 0 32 32" className="w-5 h-5" fill="none">
                        <rect width="32" height="32" rx="6" fill="#2ec866" fillOpacity="0.15" />
                        <path d="M16 6L8 10v12l8 4 8-4V10L16 6z" stroke="#2ec866" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
                        <path d="M12 16h8M16 12v8" stroke="#2ec866" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </div>
                    <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full border ${level.badge} flex-shrink-0`}>
                      {level.label}
                    </span>
                  </div>

                  {/* Name */}
                  <h3 className="font-display font-semibold text-white/85 text-sm mb-1 leading-snug">
                    {cert.name}
                  </h3>
                  <p className="text-xs font-mono text-white/30 mb-4">HackerRank · 2024</p>

                  {/* Proficiency bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono text-white/25">Proficiency</span>
                      <span className="text-[10px] font-mono text-white/35">{level.pct}%</span>
                    </div>
                    <div className="h-1 rounded-full bg-white/6 overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${level.bar}`}
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${level.pct}%` } : {}}
                        transition={{ duration: 0.8, delay: 0.3 + i * 0.09, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  {/* Badges row */}
                  <div className="flex items-center gap-3 mb-4 text-[10px] text-white/30 font-mono">
                    <span className="flex items-center gap-1">
                      <BadgeCheck className="w-3 h-3 text-emerald-400" />
                      Verified
                    </span>
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-blue-400/60" />
                      Industry Standard
                    </span>
                  </div>

                  {/* CTA */}
                  <Link
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-white/8 text-xs font-mono text-white/40 hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all duration-200"
                  >
                    <ExternalLink className="w-3 h-3" />
                    View Certificate
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
