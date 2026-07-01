"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Sparkles } from "lucide-react";
import Image from "next/image";

const stats = [
  { value: 4, suffix: "+", label: "Years Experience" },
  { value: 20, suffix: "+", label: "Projects Built" },
  { value: 2, suffix: "", label: "Companies" },
  { value: 5, suffix: "", label: "Certifications" },
];

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

function CountUp({ target, suffix, inView }: { target: number; suffix: string; inView: boolean }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let frame: number;
    const start = performance.now();
    const duration = 1400;
    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, target]);
  return <>{count}{suffix}</>;
}

export function AboutSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.36, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    },
  };

  return (
    <section
      id="about"
      ref={ref}
      className="relative py-16 md:py-24"
      aria-label="About Pranta Das"
    >
      <div className="container max-w-6xl mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          {/* Left: Image */}
          <motion.div variants={itemVariants} className="relative">
            <div className="relative w-full max-w-sm mx-auto lg:mx-0">
              {/* Decorative frame */}
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 blur-sm" />
              <div className="absolute -inset-1 rounded-2xl border border-primary/10" />

              {/* Photo */}
              <div className="relative rounded-2xl overflow-hidden aspect-[4/5] border border-white/5">
                <Image
                  src="/photo.webp"
                  alt="Pranta Das — Backend Developer from Dhaka, Bangladesh"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
              </div>

              {/* Floating status card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
                transition={{ delay: 0.2, duration: 0.32 }}
                className="absolute -bottom-5 -right-5 glass-card rounded-xl p-4 border border-white/5"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-50" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-white/62">status</div>
                    <div className="text-sm font-semibold text-emerald-400">Available</div>
                  </div>
                </div>
              </motion.div>

              {/* Floating location card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
                transition={{ delay: 0.24, duration: 0.32 }}
                className="absolute -top-5 -left-5 glass-card rounded-xl p-3 border border-white/5"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                  <span className="text-xs font-mono text-white/74">Dhaka, 🇧🇩 BD</span>
                </div>
              </motion.div>

              {/* Third floating card — role */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                animate={inView ? { opacity: 1, scale: 1, x: 0 } : {}}
                transition={{ delay: 0.28, duration: 0.32 }}
                className="absolute top-[40%] -right-8 glass-card rounded-xl px-3 py-2.5 border border-primary/10 hidden sm:flex items-center gap-2"
              >
                <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[9px] text-primary">TL</span>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-white/55 leading-none">Current</div>
                  <div className="text-xs font-semibold text-white/70 leading-tight">Team Lead</div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <div className="space-y-8">
            <motion.div variants={itemVariants}>
              <SectionLabel>About Me</SectionLabel>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                Crafting systems that{" "}
                <span className="gradient-text-cyan">scale</span>
              </h2>
              <div className="space-y-4 text-white/72 leading-relaxed">
                <p>
                  I'm a backend developer based in{" "}
                  <span className="text-white/75">Dhaka, Bangladesh</span> with
                  a deep love for building reliable, performant systems. From
                  REST APIs to real-time messaging platforms, I engineer
                  solutions that don't just work — they{" "}
                  <span className="text-white/80">last</span>.
                </p>
                <p>
                  An avid programming enthusiast who thrives on the art of clean
                  architecture. Always chasing perfection in my craft, bringing
                  improvisation and rigour every single day.
                </p>

                {/* Terminal-style blockquote */}
                <div className="rounded-xl border border-white/6 bg-white/[0.02] overflow-hidden">
                  <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/5 bg-white/[0.02]">
                    <div className="w-2 h-2 rounded-full bg-[#ff5f57]" />
                    <div className="w-2 h-2 rounded-full bg-[#febc2e]" />
                    <div className="w-2 h-2 rounded-full bg-[#28c840]" />
                    <span className="ml-2 text-[10px] font-mono text-white/48">quote.ts</span>
                  </div>
                  <div className="px-4 py-3 font-mono text-sm leading-relaxed">
                    <span className="text-white/52">{"// "}</span>
                    <span className="text-white/68 italic">
                      "We do this not because it is easy,
                    </span>
                    <br />
                    <span className="text-white/52">{"//  "}</span>
                    <span className="text-white/68 italic">
                      but because we thought it would be easy"
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact info */}
            <motion.div variants={itemVariants} className="flex flex-col gap-3">
              {[
                { icon: MapPin, text: "Dhaka, Bangladesh", href: undefined as string | undefined },
              ].map(({ icon: Icon, text, href }) => (
                <div key={text} className="flex items-center gap-3 text-sm text-white/62">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 text-primary/60" />
                  </div>
                  {href ? (
                    <a href={href} className="hover:text-white/70 transition-colors">{text}</a>
                  ) : (
                    <span>{text}</span>
                  )}
                </div>
              ))}
            </motion.div>

            {/* Stats — animated count-up */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="glass-card rounded-xl p-4 border border-white/5 hover:border-primary/10 transition-colors text-center"
                >
                  <div className="font-display text-2xl font-bold gradient-text-cyan tabular-nums">
                    <CountUp target={stat.value} suffix={stat.suffix} inView={inView} />
                  </div>
                  <div className="text-xs text-white/62 mt-1 leading-tight">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
