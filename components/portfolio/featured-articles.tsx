"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { PenLine, ArrowRight, Clock, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ArticleSummary {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  readingTime: string;
}

// ─── Tag colour palette ───────────────────────────────────────────────────────

const TAG_PALETTE: Record<string, { text: string; bg: string; ring: string }> =
  {
    Architecture: {
      text: "text-cyan-400",
      bg: "bg-cyan-400/10",
      ring: "border-cyan-400/20",
    },
    "System Design": {
      text: "text-cyan-400",
      bg: "bg-cyan-400/10",
      ring: "border-cyan-400/20",
    },
    Engineering: {
      text: "text-emerald-400",
      bg: "bg-emerald-400/10",
      ring: "border-emerald-400/20",
    },
    Backend: {
      text: "text-emerald-400",
      bg: "bg-emerald-400/10",
      ring: "border-emerald-400/20",
    },
    Career: {
      text: "text-violet-400",
      bg: "bg-violet-400/10",
      ring: "border-violet-400/20",
    },
    "Team Lead": {
      text: "text-violet-400",
      bg: "bg-violet-400/10",
      ring: "border-violet-400/20",
    },
    Leadership: {
      text: "text-violet-400",
      bg: "bg-violet-400/10",
      ring: "border-violet-400/20",
    },
    AI: {
      text: "text-orange-400",
      bg: "bg-orange-400/10",
      ring: "border-orange-400/20",
    },
    Product: {
      text: "text-orange-400",
      bg: "bg-orange-400/10",
      ring: "border-orange-400/20",
    },
    TypeScript: {
      text: "text-blue-400",
      bg: "bg-blue-400/10",
      ring: "border-blue-400/20",
    },
    "Node.js": {
      text: "text-green-400",
      bg: "bg-green-400/10",
      ring: "border-green-400/20",
    },
    DevOps: {
      text: "text-amber-400",
      bg: "bg-amber-400/10",
      ring: "border-amber-400/20",
    },
  };

const DEFAULT_PALETTE = {
  text: "text-white/40",
  bg: "bg-white/5",
  ring: "border-white/10",
};

function tagPalette(tag: string) {
  return TAG_PALETTE[tag] ?? DEFAULT_PALETTE;
}

// ─── Hero Card (full-width, first curated article) ────────────────────────────

function HeroCard({
  article,
  inView,
}: {
  article: ArticleSummary;
  inView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/blog/${article.slug}`}
        className="group block glass-card rounded-2xl p-7 md:p-9 hover:border-primary/25 transition-all duration-300 relative overflow-hidden"
        aria-label={`Read article: ${article.title}`}
      >
        {/* Hover glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="relative z-10">
          {/* Top metadata row */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono">
                <PenLine className="w-3 h-3" aria-hidden="true" />
                Featured
              </span>
              {article.tags.slice(0, 3).map((tag) => {
                const c = tagPalette(tag);
                return (
                  <span
                    key={tag}
                    className={`px-2.5 py-1 rounded-full text-xs font-mono border ${c.text} ${c.bg} ${c.ring}`}
                  >
                    {tag}
                  </span>
                );
              })}
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-white/30">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3 h-3" aria-hidden="true" />
                {article.readingTime}
              </span>
              <time dateTime={article.date}>
                {format(new Date(article.date), "MMM d, yyyy")}
              </time>
            </div>
          </div>

          {/* Body */}
          <div className="mt-5 flex items-start justify-between gap-6">
            <div className="flex-1 min-w-0">
              <h3 className="text-2xl md:text-[1.75rem] font-display font-bold text-white/85 group-hover:text-white transition-colors leading-snug mb-3">
                {article.title}
              </h3>
              <p className="text-white/45 leading-relaxed max-w-2xl">
                {article.description}
              </p>
            </div>
            <div className="flex-shrink-0 mt-1 hidden sm:block">
              <div className="w-10 h-10 rounded-full border border-white/10 group-hover:border-primary/40 flex items-center justify-center transition-all duration-300 group-hover:bg-primary/10">
                <ArrowUpRight
                  className="w-4 h-4 text-white/30 group-hover:text-primary transition-colors"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Article Card (grid items) ────────────────────────────────────────────────

function ArticleCard({
  article,
  index,
  inView,
}: {
  article: ArticleSummary;
  index: number;
  inView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.5,
        delay: 0.35 + index * 0.09,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="h-full"
    >
      <Link
        href={`/blog/${article.slug}`}
        className="group flex flex-col h-full glass-card rounded-xl p-5 hover:border-white/15 transition-all duration-300 relative overflow-hidden"
        aria-label={`Read article: ${article.title}`}
      >
        {/* Subtle hover fill */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full">
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {article.tags.slice(0, 2).map((tag) => {
              const c = tagPalette(tag);
              return (
                <span
                  key={tag}
                  className={`px-2 py-0.5 rounded-full text-[11px] font-mono border ${c.text} ${c.bg} ${c.ring}`}
                >
                  {tag}
                </span>
              );
            })}
          </div>

          {/* Title */}
          <h3 className="text-[15px] md:text-base font-display font-semibold text-white/80 group-hover:text-white/95 transition-colors leading-snug mb-2 flex-1">
            {article.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-white/35 leading-relaxed line-clamp-2 mb-4">
            {article.description}
          </p>

          {/* Footer */}
          <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/[0.06]">
            <div className="flex items-center gap-3 text-[11px] font-mono text-white/25">
              <span className="flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" aria-hidden="true" />
                {article.readingTime}
              </span>
              <time dateTime={article.date}>
                {format(new Date(article.date), "MMM yyyy")}
              </time>
            </div>
            <ArrowRight
              className="w-3.5 h-3.5 text-white/20 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200"
              aria-hidden="true"
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

interface FeaturedArticlesProps {
  articles: ArticleSummary[];
}

export function FeaturedArticlesSection({ articles }: FeaturedArticlesProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  if (articles.length === 0) return null;

  const [hero, ...rest] = articles;

  return (
    <section
      id="writing"
      ref={ref}
      aria-labelledby="writing-heading"
      className="py-16 md:py-24"
    >
      <div className="container max-w-6xl mx-auto px-6">
        {/* ── Section header ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 md:mb-14"
        >
          {/* Label pill */}
          <div className="flex items-center gap-2 mb-4">
            <PenLine className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
            <span className="text-xs font-mono text-primary tracking-widest uppercase">
              Writing
            </span>
          </div>

          {/* Title + "View all" row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2
                id="writing-heading"
                className="text-3xl md:text-4xl lg:text-5xl font-display font-bold"
              >
                <span className="text-white/90">Selected</span>{" "}
                <span className="gradient-text-cyan">Articles</span>
              </h2>
              <p className="mt-3 text-white/40 max-w-xl leading-relaxed">
                Engineering insights, architectural decisions, and lessons from
                building production systems — written from real experience.
              </p>
            </div>

            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/8 text-sm font-mono text-white/40 hover:text-white hover:border-white/20 transition-all duration-200 group flex-shrink-0 self-start md:self-auto"
              aria-label="View all blog articles"
            >
              View all articles
              <ArrowRight
                className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
                aria-hidden="true"
              />
            </Link>
          </div>

          {/* Gradient divider */}
          <div className="mt-8 h-px bg-gradient-to-r from-primary/20 via-white/5 to-transparent" />
        </motion.div>

        {/* ── Hero card ──────────────────────────────────────────────── */}
        {hero && <HeroCard article={hero} inView={inView} />}

        {/* ── 4-column grid ─────────────────────────────────────────── */}
        {rest.length > 0 && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {rest.map((article, i) => (
              <ArticleCard
                key={article.slug}
                article={article}
                index={i}
                inView={inView}
              />
            ))}
          </div>
        )}

        {/* ── Bottom CTA ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.72 }}
          className="mt-10 flex justify-center"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-primary/5 border border-primary/15 text-primary text-sm font-mono hover:bg-primary/10 hover:border-primary/30 transition-all duration-200 group"
            aria-label="Browse all blog articles"
          >
            <PenLine className="w-3.5 h-3.5" aria-hidden="true" />
            Browse the full archive
            <ArrowRight
              className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
              aria-hidden="true"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
