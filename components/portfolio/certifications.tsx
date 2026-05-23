"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Award, ExternalLink, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { certifications } from "@/data/certification";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/15 bg-primary/5 mb-6">
      <Sparkles className="w-3 h-3 text-primary" />
      <span className="text-xs font-mono text-primary/70 uppercase tracking-widest">
        {children}
      </span>
    </div>
  );
}

function getLevel(name: string) {
  if (name.includes("Basic"))
    return {
      label: "Basic",
      color: "text-emerald-400 border-emerald-400/20 bg-emerald-400/8",
    };
  if (name.includes("Intermediate"))
    return {
      label: "Intermediate",
      color: "text-blue-400 border-blue-400/20 bg-blue-400/8",
    };
  if (name.includes("Advanced"))
    return {
      label: "Advanced",
      color: "text-purple-400 border-purple-400/20 bg-purple-400/8",
    };
  return {
    label: "Certified",
    color: "text-white/50 border-white/10 bg-white/5",
  };
}

export function CertificationsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="certifications" ref={ref} className="relative py-24 md:py-32">
      <div className="container max-w-6xl mx-auto px-6">
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
            Industry-recognised certifications from HackerRank
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {certifications.map((cert, i) => {
            const { label, color } = getLevel(cert.name);
            return (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="group glass-card rounded-xl border border-white/5 hover:border-primary/15 transition-all duration-300 p-5 flex flex-col gap-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors">
                    <Award className="w-5 h-5 text-primary/60" />
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border ${color}`}
                  >
                    {label}
                  </span>
                </div>

                <div>
                  <h3 className="font-display font-semibold text-white/85 text-sm mb-1">
                    {cert.name}
                  </h3>
                  <p className="text-xs font-mono text-white/30">HackerRank</p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[10px] text-white/30">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Verified Certificate
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-white/30">
                    <ShieldCheck className="w-3 h-3 text-blue-400/60" />
                    Industry Recognised
                  </div>
                </div>

                <Link
                  href={cert.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto flex items-center justify-center gap-2 py-2.5 rounded-lg border border-white/8 text-xs font-mono text-white/40 hover:border-primary/30 hover:text-primary transition-all duration-200"
                >
                  <ExternalLink className="w-3 h-3" />
                  View on HackerRank
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
