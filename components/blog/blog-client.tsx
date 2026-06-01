"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Rss, PenLine, ArrowUpRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { BlogPost } from "@/lib/blog";
import { BlogCard } from "@/components/blog/blog-card";

interface BlogClientProps {
  posts: BlogPost[];
  tags: { tag: string; count: number }[];
  featuredPost: BlogPost | undefined;
}

export function BlogClient({ posts, tags, featuredPost }: BlogClientProps) {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchesTag = !activeTag || p.tags.includes(activeTag);
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      return matchesTag && matchesSearch;
    });
  }, [posts, search, activeTag]);

  const nonFeatured = filtered.filter(
    (p) => !featuredPost || p.slug !== featuredPost.slug,
  );

  return (
    <>
      {/* ── Minimal top nav ── */}
      <nav
        className="sticky top-0 z-40 border-b border-white/5 bg-background/80 backdrop-blur-md"
        aria-label="Blog navigation"
      >
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/45 hover:text-white/80 transition-colors text-sm font-mono group"
            aria-label="Back to home"
          >
            <ArrowLeft
              className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
            Pranta Das
          </Link>
          <span className="text-white/20 text-xs font-mono tracking-widest uppercase">
            Blog
          </span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        {/* ── Publication Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mb-14"
        >
          {/* Top meta row */}
          <div className="flex items-start justify-between gap-6 mb-8">
            <div className="flex-1 min-w-0">
              {/* Label */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-5">
                <PenLine
                  className="w-3 h-3 text-primary/60"
                  aria-hidden="true"
                />
                <span className="text-xs font-mono text-primary/70 uppercase tracking-widest">
                  Engineering Blog
                </span>
              </div>

              {/* Headline */}
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-4">
                Writing that <span className="gradient-text-cyan">matters</span>
              </h1>

              {/* Description */}
              <p className="text-white/50 text-base md:text-lg max-w-2xl leading-relaxed mb-6">
                Engineering insights, architectural decisions, and lessons
                learned building real-world products — from a Backend Engineer
                in <span className="text-white/70">Dhaka, Bangladesh 🇧🇩</span>.
                No tutorials. No filler. Production experience only.
              </p>

              {/* Stats row */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-white/30">
                <span>
                  <span className="text-white/60 font-semibold">
                    {posts.length}
                  </span>{" "}
                  articles
                </span>
                <span className="w-px h-3 bg-white/10" aria-hidden="true" />
                <span>TypeScript · Node.js · System Design · Career</span>
                <span className="w-px h-3 bg-white/10" aria-hidden="true" />
                <Link
                  href="/api/rss"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="RSS Feed"
                  className="inline-flex items-center gap-1.5 text-white/30 hover:text-primary transition-colors"
                >
                  <Rss className="w-3 h-3" aria-hidden="true" />
                  RSS Feed
                  <ArrowUpRight className="w-2.5 h-2.5" aria-hidden="true" />
                </Link>
              </div>
            </div>

            {/* Decorative accent — hidden on small screens */}
            <div className="hidden lg:flex flex-col items-end gap-1.5 text-right shrink-0 select-none">
              <div className="font-mono text-xs text-primary/20 leading-relaxed">
                <div>// engineer.blog.ts</div>
                <div>
                  <span className="text-primary/35">export const</span> topics =
                  [
                </div>
                <div>
                  &nbsp;&nbsp;
                  <span className="text-white/20">"architecture"</span>,
                </div>
                <div>
                  &nbsp;&nbsp;<span className="text-white/20">"systems"</span>,
                </div>
                <div>
                  &nbsp;&nbsp;<span className="text-white/20">"career"</span>,
                </div>
                <div>];</div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-primary/20 via-white/5 to-transparent mb-8" />

          {/* Search */}
          <div className="relative mb-4">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25"
              aria-hidden="true"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles..."
              aria-label="Search articles"
              className="w-full bg-white/4 border border-white/8 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white/70 placeholder:text-white/25 outline-none focus:border-primary/30 focus:ring-1 focus:ring-primary/10 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Tag filters */}
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Filter by tag"
          >
            <button
              onClick={() => setActiveTag(null)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors border ${
                activeTag === null
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-white/8 text-white/35 hover:border-white/15 hover:text-white/55"
              }`}
            >
              All
            </button>
            {tags.map(({ tag, count }) => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                aria-pressed={activeTag === tag}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors border ${
                  activeTag === tag
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-white/8 text-white/35 hover:border-white/15 hover:text-white/55"
                }`}
              >
                {tag}
                <span className="ml-1.5 text-white/20">{count}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Featured post */}
        {featuredPost && !activeTag && !search && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-10"
          >
            <BlogCard post={featuredPost} featured />
          </motion.div>
        )}

        {/* Articles grid */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-16 text-center text-white/30 font-mono text-sm"
            >
              No articles match your search.
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid sm:grid-cols-2 gap-4"
            >
              {(activeTag || search ? filtered : nonFeatured).map((post, i) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                >
                  <BlogCard post={post} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Post count */}
        {filtered.length > 0 && (
          <p className="mt-8 text-center text-xs font-mono text-white/20">
            {filtered.length} article{filtered.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>
    </>
  );
}
