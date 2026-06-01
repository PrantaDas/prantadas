"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Github,
  ExternalLink,
  Star,
  GitFork,
  Eye,
  Lock,
  Sparkles,
  Globe,
  Layers,
} from "lucide-react";
import Link from "next/link";
import { professionalProject } from "@/data/projects";

interface Repository {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  language: string;
  topics: string[];
  created_at: string;
  updated_at: string;
  category: string;
  priority: number;
}

interface ProfessionalProject {
  name: string;
  category: string;
  description: string;
  details: string;
  is_private: boolean;
  website?: string;
}

interface ProjectsProps {
  repositories: Repository[];
}

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

const languageColors: Record<string, string> = {
  TypeScript: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  JavaScript: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  Python: "text-green-400 bg-green-400/10 border-green-400/20",
  Go: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
};

const categories = ["All", "SDK", "Backend", "Bot", "Tool", "Scraper"];

function RepoCard({ repo, index }: { repo: Repository; index: number }) {
  const [hovered, setHovered] = useState(false);
  const langClass =
    languageColors[repo.language] ?? "text-white/40 bg-white/5 border-white/10";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group relative glass-card rounded-xl border border-white/5 hover:border-primary/15 transition-all duration-300 overflow-hidden flex flex-col"
    >
      {/* Hover glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/3 rounded-xl"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative z-10 p-5 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Layers className="w-3 h-3 text-primary/60" />
            </div>
            <h3 className="font-display font-semibold text-white/90 text-sm truncate">
              {repo.name}
            </h3>
          </div>
          <span
            className={`flex-shrink-0 text-[10px] font-mono px-2 py-0.5 rounded border ${langClass}`}
          >
            {repo.language}
          </span>
        </div>

        {/* Description */}
        <p className="text-white/40 text-xs leading-relaxed line-clamp-2 flex-1 mb-4">
          {repo.description}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-white/30 text-xs">
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3" />
              {repo.stargazers_count}
            </span>
            <span className="flex items-center gap-1">
              <GitFork className="w-3 h-3" />
              {repo.forks_count}
            </span>
          </div>
          <Link
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-primary/60 hover:text-primary transition-colors font-mono"
          >
            <Github className="w-3 h-3" />
            Code
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function ProfessionalCard({
  project,
  index,
}: {
  project: ProfessionalProject;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group relative glass-card rounded-2xl border border-white/5 hover:border-primary/15 transition-all duration-300 overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/4 via-transparent to-secondary/3"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono text-primary/60 uppercase tracking-wider border border-primary/15 rounded px-2 py-0.5">
                {project.category}
              </span>
              {project.is_private && (
                <span className="text-[10px] font-mono text-white/30 border border-white/10 rounded px-2 py-0.5 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> Private
                </span>
              )}
            </div>
            <h3 className="font-display text-xl font-bold text-white/90">
              {project.name}
            </h3>
          </div>
          {project.website && (
            <Link
              href={project.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 p-2 rounded-lg border border-white/8 hover:border-primary/30 hover:bg-primary/5 transition-all"
            >
              <ExternalLink className="w-4 h-4 text-white/40 hover:text-primary transition-colors" />
            </Link>
          )}
        </div>

        <p className="text-white/50 text-sm mb-3">{project.description}</p>
        <p className="text-white/35 text-xs leading-relaxed">
          {project.details}
        </p>

        {project.website && (
          <div className="mt-4 flex items-center gap-2 text-xs font-mono text-primary/40">
            <Globe className="w-3 h-3" />
            {project.website.replace("https://", "")}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function ProjectsSection({ repositories }: ProjectsProps) {
  const [activeTab, setActiveTab] = useState<"github" | "professional">(
    "github",
  );
  const [activeCategory, setActiveCategory] = useState("All");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const filtered =
    activeCategory === "All"
      ? repositories
      : repositories.filter((r) => r.category === activeCategory);

  return (
    <section id="projects" ref={ref} className="relative py-16 md:py-24">
      <div className="container max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <SectionLabel>Work</SectionLabel>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Featured <span className="gradient-text-cyan">Projects</span>
          </h2>
          <p className="text-white/40 max-w-lg mx-auto">
            Open source tools, bots, and professional systems I've engineered
          </p>
        </motion.div>

        {/* Tab switcher */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex justify-center mb-10"
        >
          <div className="inline-flex p-1 rounded-xl bg-white/5 border border-white/8">
            {(["github", "professional"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 capitalize ${
                  activeTab === tab
                    ? "text-background"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="tab-bg"
                    className="absolute inset-0 rounded-lg bg-primary"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className="relative z-10">
                  {tab === "github" ? "Open Source" : "Professional"}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === "github" ? (
            <motion.div
              key="github"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Category filter */}
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 border ${
                      activeCategory === cat
                        ? "bg-primary/15 border-primary/30 text-primary"
                        : "border-white/8 text-white/40 hover:border-white/20 hover:text-white/60"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((repo, i) => (
                  <RepoCard key={repo.id} repo={repo} index={i} />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="professional"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              {professionalProject.map((project, i) => (
                <ProfessionalCard
                  key={project.name}
                  project={project}
                  index={i}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
