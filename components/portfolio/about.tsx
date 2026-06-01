"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Phone, Mail, Sparkles } from "lucide-react";
import Image from "next/image";

const stats = [
  { value: "3+", label: "Years Experience" },
  { value: "15+", label: "Projects Built" },
  { value: "2", label: "Companies" },
  { value: "5", label: "Certifications" },
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

export function AboutSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section
      id="about"
      ref={ref}
      className="relative py-24 md:py-32"
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
                {/* Image overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
              </div>

              {/* Floating status card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute -bottom-5 -right-5 glass-card rounded-xl p-4 border border-white/5"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-50" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-white/40">
                      status
                    </div>
                    <div className="text-sm font-semibold text-emerald-400">
                      Available
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating location card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="absolute -top-5 -left-5 glass-card rounded-xl p-3 border border-white/5"
              >
                <div className="flex items-center gap-2">
                  <MapPin
                    className="w-3.5 h-3.5 text-primary"
                    aria-hidden="true"
                  />
                  <span className="text-xs font-mono text-white/60">
                    Dhaka, 🇧🇩 BD
                  </span>
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
              <div className="space-y-4 text-white/55 leading-relaxed">
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
                <blockquote className="border-l-2 border-primary/40 pl-4 my-6 italic text-white/40">
                  "We do this not because it is easy, but because we thought it
                  would be easy"
                </blockquote>
              </div>
            </motion.div>

            {/* Contact info */}
            <motion.div variants={itemVariants} className="flex flex-col gap-3">
              {[
                { icon: MapPin, text: "Dhanmondi 32, Dhaka-1210, Bangladesh" },
                {
                  icon: Phone,
                  text: "+8801708088432",
                  href: "tel:+8801708088432",
                },
                {
                  icon: Mail,
                  text: "prantodas043@gmail.com",
                  href: "mailto:prantodas043@gmail.com",
                },
              ].map(({ icon: Icon, text, href }) => (
                <div
                  key={text}
                  className="flex items-center gap-3 text-sm text-white/40"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 text-primary/60" />
                  </div>
                  {href ? (
                    <a
                      href={href}
                      className="hover:text-white/70 transition-colors"
                    >
                      {text}
                    </a>
                  ) : (
                    <span>{text}</span>
                  )}
                </div>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="glass-card rounded-xl p-4 border border-white/5 text-center"
                >
                  <div className="font-display text-2xl font-bold gradient-text-cyan">
                    {stat.value}
                  </div>
                  <div className="text-xs text-white/40 mt-1 leading-tight">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
