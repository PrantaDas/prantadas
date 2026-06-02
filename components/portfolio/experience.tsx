"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Briefcase,
  GraduationCap,
  MapPin,
  Sparkles,
  Calendar,
  Building2,
} from "lucide-react";

const experience = [
  {
    role: "Team Lead (Backend)",
    company: "Root Devs",
    location: "Asad Avenue, Mohammadpur, Dhaka",
    period: "January 2026 — Present",
    current: true,
    description:
      "Leading the backend engineering team. Architecting scalable server-side solutions, mentoring engineers, and driving technical decisions.",
    type: "work",
    tags: [
      "Node.js",
      "TypeScript",
      "MongoDB",
      "Redis",
      "Docker",
      "Microservices",
    ],
  },
  {
    role: "Senior Software Engineer",
    company: "Root Devs",
    location: "Asad Avenue, Mohammadpur, Dhaka",
    period: "July 2025 — December 2025",
    description:
      "Designed and built high-performance backend services and APIs. Contributed to system architecture decisions and code quality standards.",
    type: "work",
    tags: ["Node.js", "PostgreSQL", "REST APIs", "GraphQL", "CI/CD"],
  },
  {
    role: "Software Engineer",
    company: "Root Devs",
    location: "Asad Avenue, Mohammadpur, Dhaka",
    period: "April 2024 — May 2025",
    description:
      "Full-cycle backend development — API design, database schema, deployment pipelines, and microservices.",
    type: "work",
    tags: ["Node.js", "Express", "MongoDB", "Docker", "API Design"],
  },
  {
    role: "Junior Developer (MERN)",
    company: "CoreDevs Ltd",
    location: "Mirpur DOHS, Dhaka",
    period: "August 2022 — February 2024",
    description:
      "Frontend and backend development using the MERN stack. Web automation, scripting, and integration work across multiple client projects.",
    type: "work",
    tags: ["React", "Node.js", "Express", "MongoDB", "Python"],
  },
];

const education = [
  {
    role: "Bachelor of Science (CSE)",
    company: "Daffodil International University",
    location: "Dhaka",
    period: "September 2018 — July 2022",
    description: "",
    type: "education",
    tags: ["Computer Science", "Engineering"],
  },
  {
    role: "Higher Secondary Certificate (Science)",
    company: "Cantonment College, Jashore",
    location: "Jashore",
    period: "April 2016 — March 2018",
    description: "",
    type: "education",
    tags: ["Science"],
  },
  {
    role: "Secondary School Certificate (Science)",
    company: "Panjia Secondary School, Jashore",
    location: "Jashore",
    period: "January 2014 — February 2016",
    description: "",
    type: "education",
    tags: ["Science"],
  },
];

const careerStats = [
  { value: "4+", label: "Years Active" },
  { value: "2", label: "Companies" },
  { value: "20+", label: "Projects" },
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

function TimelineItem({
  item,
  index,
  isLast,
}: {
  item: (typeof experience)[0];
  index: number;
  isLast: boolean;
}) {
  const isWork = item.type === "work";
  const Icon = isWork ? Briefcase : GraduationCap;

  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.1 }}
      className="relative flex gap-5"
    >
      {/* Timeline column */}
      <div className="flex flex-col items-center">
        <div className="relative">
          {/* Outer ring for current */}
          {(item as any).current && (
            <motion.div
              className="absolute -inset-1.5 rounded-xl border border-primary/30"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}
          <div
            className={`relative flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center border z-10 ${
              (item as any).current
                ? "border-primary/40 bg-primary/10 glow-cyan"
                : "border-white/10 bg-white/5"
            }`}
          >
            <Icon
              className={`w-4 h-4 ${(item as any).current ? "text-primary" : "text-white/40"}`}
            />
          </div>
        </div>
        {!isLast && (
          <div className="w-px flex-1 mt-2 bg-gradient-to-b from-white/10 to-transparent min-h-8" />
        )}
      </div>

      {/* Content card */}
      <div className="pb-10 flex-1 min-w-0">
        <div className="glass-card rounded-xl border border-white/5 hover:border-primary/12 transition-colors duration-300 overflow-hidden">
          {/* Card top accent */}
          {(item as any).current && (
            <div className="h-[2px] bg-gradient-to-r from-primary/60 via-primary/20 to-transparent" />
          )}

          <div className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
              <div>
                <h3 className="font-display font-semibold text-white/90 text-base flex items-center gap-2 flex-wrap">
                  {item.role}
                  {(item as any).current && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 border border-emerald-400/20 bg-emerald-400/5 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Current
                    </span>
                  )}
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Building2 className="w-3 h-3 text-primary/50 flex-shrink-0" />
                  <p className="text-sm text-primary/70 font-medium">
                    {item.company}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono text-white/30 whitespace-nowrap bg-white/4 border border-white/6 rounded-lg px-2.5 py-1 self-start">
                <Calendar className="w-3 h-3" />
                {item.period}
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-white/30 mb-3">
              <MapPin className="w-3 h-3" />
              {item.location}
            </div>

            {(item as any).description && (
              <p className="text-sm text-white/45 leading-relaxed mb-4">
                {(item as any).description}
              </p>
            )}

            {/* Tech tags */}
            {(item as any).tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
                {((item as any).tags as string[]).map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-primary/6 border border-primary/12 text-primary/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ExperienceSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="experience" ref={ref} className="relative py-16 md:py-24">
      <div className="container max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <SectionLabel>Career</SectionLabel>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Experience & <span className="gradient-text-cyan">Education</span>
          </h2>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="flex justify-center gap-6 mb-14"
        >
          {careerStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
              className="text-center px-6 py-3 glass-card rounded-xl border border-white/5"
            >
              <div className="font-display text-2xl font-bold gradient-text-cyan">
                {stat.value}
              </div>
              <div className="text-xs font-mono text-white/35 mt-0.5">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Work experience */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.25 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Briefcase className="w-3.5 h-3.5 text-primary/70" />
              </div>
              <div>
                <span className="text-sm font-mono text-primary/70 uppercase tracking-widest">
                  Work Experience
                </span>
                <div className="text-xs text-white/25 font-mono">
                  {experience.length} positions
                </div>
              </div>
            </motion.div>
            {experience.map((item, i) => (
              <TimelineItem
                key={item.role + item.period}
                item={item}
                index={i}
                isLast={i === experience.length - 1}
              />
            ))}
          </div>

          {/* Education */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="w-8 h-8 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center justify-center">
                <GraduationCap className="w-3.5 h-3.5 text-secondary/70" />
              </div>
              <div>
                <span className="text-sm font-mono text-secondary uppercase tracking-widest">
                  Education
                </span>
                <div className="text-xs text-white/25 font-mono">
                  {education.length} institutions
                </div>
              </div>
            </motion.div>
            {education.map((item, i) => (
              <TimelineItem
                key={item.role + item.period}
                item={item}
                index={i}
                isLast={i === education.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
