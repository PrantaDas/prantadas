"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Briefcase, GraduationCap, MapPin, Sparkles } from "lucide-react";

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
  },
  {
    role: "Senior Software Engineer",
    company: "Root Devs",
    location: "Asad Avenue, Mohammadpur, Dhaka",
    period: "July 2025 — December 2025",
    description:
      "Designed and built high-performance backend services and APIs. Contributed to system architecture decisions and code quality standards.",
    type: "work",
  },
  {
    role: "Software Engineer",
    company: "Root Devs",
    location: "Asad Avenue, Mohammadpur, Dhaka",
    period: "April 2024 — May 2025",
    description:
      "Full-cycle backend development — API design, database schema, deployment pipelines, and microservices.",
    type: "work",
  },
  {
    role: "Junior Developer (MERN)",
    company: "CoreDevs Ltd",
    location: "Mirpur DOHS, Dhaka",
    period: "August 2022 — February 2024",
    description:
      "Frontend and backend development using the MERN stack. Web automation, scripting, and integration work across multiple client projects.",
    type: "work",
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
  },
  {
    role: "Higher Secondary Certificate (Science)",
    company: "Cantonment College, Jashore",
    location: "Jashore",
    period: "April 2016 — March 2018",
    description: "",
    type: "education",
  },
  {
    role: "Secondary School Certificate (Science)",
    company: "Panjia Secondary School, Jashore",
    location: "Jashore",
    period: "January 2014 — February 2016",
    description: "",
    type: "education",
  },
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
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative flex gap-5"
    >
      {/* Timeline line */}
      <div className="flex flex-col items-center">
        <div
          className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center border z-10 ${
            (item as any).current
              ? "border-primary/40 bg-primary/10 glow-cyan"
              : "border-white/10 bg-white/5"
          }`}
        >
          <Icon
            className={`w-4 h-4 ${(item as any).current ? "text-primary" : "text-white/40"}`}
          />
        </div>
        {!isLast && (
          <div className="w-px flex-1 mt-2 bg-gradient-to-b from-white/10 to-transparent min-h-8" />
        )}
      </div>

      {/* Content */}
      <div className="pb-10 flex-1 min-w-0">
        <div className="glass-card rounded-xl border border-white/5 p-5 hover:border-primary/10 transition-colors duration-300">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
            <div>
              <h3 className="font-display font-semibold text-white/90 text-base flex items-center gap-2">
                {item.role}
                {(item as any).current && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 border border-emerald-400/20 bg-emerald-400/5 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Current
                  </span>
                )}
              </h3>
              <p className="text-sm text-primary/70 font-medium mt-0.5">
                {item.company}
              </p>
            </div>
            <div className="text-xs font-mono text-white/35 whitespace-nowrap">
              {item.period}
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-white/30 mb-3">
            <MapPin className="w-3 h-3" />
            {item.location}
          </div>

          {(item as any).description && (
            <p className="text-sm text-white/45 leading-relaxed">
              {(item as any).description}
            </p>
          )}
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <SectionLabel>Career</SectionLabel>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Experience & <span className="gradient-text-cyan">Education</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Work experience */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 mb-8"
            >
              <Briefcase className="w-4 h-4 text-primary/60" />
              <span className="text-sm font-mono text-primary/60 uppercase tracking-widest">
                Work
              </span>
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
              className="flex items-center gap-2 mb-8"
            >
              <GraduationCap className="w-4 h-4 text-secondary/60" />
              <span className="text-sm font-mono text-secondary/60 uppercase tracking-widest">
                Education
              </span>
            </motion.div>
            {education.map((item, i) => (
              <TimelineItem
                key={item.role + item.period}
                item={item}
                index={i}
                isLast={i === education.length - 1}
              />
            ))}

            {/* Highlight box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="glass-card rounded-xl border border-white/5 p-6 mt-2"
            >
              <div className="text-sm font-medium text-white/60 mb-2">
                Professional Highlight
              </div>
              <p className="text-sm text-white/40 leading-relaxed">
                Recognised and praised for outstanding contributions and
                dedication in delivering high-impact solutions, meeting
                deadlines, and showcasing a commitment to excellence in project
                delivery and team collaboration.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
