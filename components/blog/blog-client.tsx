"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Rss,
  ArrowLeft,
  ArrowUpRight,
  Clock,
  Flame,
  Star,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import type { BlogPost } from "@/lib/blog";
import { FeaturedArticle } from "@/components/blog/featured-article";
import { ArticleRow } from "@/components/blog/article-row";
import { ReadingList } from "@/components/blog/reading-list";

interface BlogClientProps {
  posts: BlogPost[];
  tags: { tag: string; count: number }[];
  featuredPost: BlogPost | undefined;
  viewCounts?: Record<string, number>;
  ratings?: Record<string, { avg: number; count: number }>;
}

type SortId = "latest" | "popular" | "rated";

const SORTS: { id: SortId; label: string; icon: typeof Clock }[] = [
  { id: "latest", label: "Latest", icon: Clock },
  { id: "popular", label: "Popular", icon: Flame },
  { id: "rated", label: "Top Rated", icon: Star },
];

function fmtReads(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

export function BlogClient({
  posts,
  tags,
  featuredPost,
  viewCounts = {},
  ratings = {},
}: BlogClientProps) {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [sort, setSort] = useState<SortId>("latest");
  const [showAllTags, setShowAllTags] = useState(false);
  // Mobile filter is staged: the dropdown sets a pending choice, an Apply
  // button commits it. Kept in sync whenever the active tag changes elsewhere.
  const [pendingTag, setPendingTag] = useState<string | null>(null);

  // Keep the dropdown reflecting the active filter (e.g. after Clear, or when
  // a tag is toggled via the sm+ pill cloud).
  useEffect(() => setPendingTag(activeTag), [activeTag]);

  // Categories are noisy at full length (lots of 1-count tags). Show the most
  // used by default; reveal the rest on demand. Always keep the active tag
  // visible even if it lives in the collapsed tail.
  const TAG_LIMIT = 10;
  const visibleTags = useMemo(() => {
    if (showAllTags) return tags;
    const head = tags.slice(0, TAG_LIMIT);
    if (activeTag && !head.some((t) => t.tag === activeTag)) {
      const active = tags.find((t) => t.tag === activeTag);
      if (active) return [...head, active];
    }
    return head;
  }, [tags, showAllTags, activeTag]);

  // Masthead statistics
  const totalReads = useMemo(
    () => Object.values(viewCounts).reduce((sum, n) => sum + n, 0),
    [viewCounts],
  );

  const isDefaultView = sort === "latest" && !search && !activeTag;

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const result = posts.filter((p) => {
      const matchesTag = !activeTag || p.tags.includes(activeTag);
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      return matchesTag && matchesSearch;
    });

    const sorted = [...result];
    if (sort === "popular") {
      sorted.sort((a, b) => (viewCounts[b.slug] ?? 0) - (viewCounts[a.slug] ?? 0));
    } else if (sort === "rated") {
      sorted.sort((a, b) => {
        const ra = ratings[a.slug]?.avg ?? 0;
        const rb = ratings[b.slug]?.avg ?? 0;
        if (rb !== ra) return rb - ra;
        return (ratings[b.slug]?.count ?? 0) - (ratings[a.slug]?.count ?? 0);
      });
    } else {
      sorted.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    }
    return sorted;
  }, [posts, search, activeTag, sort, viewCounts, ratings]);

  // On the default view the lead story is pulled out into the featured slot.
  const archive =
    isDefaultView && featuredPost
      ? filtered.filter((p) => p.slug !== featuredPost.slug)
      : filtered;

  return (
    <>
      {/* ── Top nav ── */}
      <nav
        className="sticky top-0 z-40 border-b border-white/5 bg-background/80 backdrop-blur-md"
        aria-label="Blog navigation"
      >
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/72 hover:text-white transition-colors text-sm font-mono group"
            aria-label="Back to home"
          >
            <ArrowLeft
              className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
            Pranta Das
          </Link>
          <div className="flex items-center gap-5">
            <ReadingList />
            <Link
              href="/api/rss"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-white/65 hover:text-primary transition-colors text-xs font-mono"
              aria-label="RSS Feed"
            >
              <Rss className="w-3.5 h-3.5" aria-hidden="true" />
              RSS
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6">
        {/* ════════ MASTHEAD ════════ */}
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="pt-16 sm:pt-24 pb-12 sm:pb-16"
        >
          {/* Masthead rule + kicker */}
          <div className="flex items-center gap-4 mb-8">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-primary/70 whitespace-nowrap">
              The Engineering Journal
            </span>
            <span className="h-px flex-1 bg-gradient-to-r from-primary/25 via-white/8 to-transparent" />
          </div>

          {/* Editorial headline — left-aligned, oversized */}
          <h1 className="font-display text-[2.75rem] sm:text-6xl md:text-7xl font-bold text-white leading-[0.98] tracking-tight mb-7 max-w-3xl text-balance">
            Writing that{" "}
            <span className="gradient-text-cyan">matters</span>.
          </h1>

          <p className="text-white/74 text-base md:text-lg max-w-2xl leading-relaxed mb-10">
            Engineering insights, architectural decisions, and hard-won lessons
            from building real-world products — written from Dhaka, Bangladesh
            🇧🇩. No tutorials. No filler. Production experience only.
          </p>

          {/* Dateline statistics */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-xs uppercase tracking-[0.15em] text-white/65">
            <span>
              <span className="text-white/90 text-sm font-semibold normal-case tracking-normal">
                {posts.length}
              </span>{" "}
              Articles
            </span>
            <span className="h-3 w-px bg-white/12" aria-hidden="true" />
            <span>
              <span className="text-white/90 text-sm font-semibold normal-case tracking-normal">
                {tags.length}
              </span>{" "}
              Topics
            </span>
            {totalReads > 0 && (
              <>
                <span className="h-3 w-px bg-white/12" aria-hidden="true" />
                <span>
                  <span className="text-white/90 text-sm font-semibold normal-case tracking-normal">
                    {fmtReads(totalReads)}
                  </span>{" "}
                  Reads
                </span>
              </>
            )}
          </div>
        </motion.header>

        {/* ════════ FEATURED LEAD ════════ */}
        <AnimatePresence mode="wait">
          {isDefaultView && featuredPost && (
            <motion.div
              key="featured"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="mb-16 sm:mb-20"
            >
              <FeaturedArticle
                post={featuredPost}
                viewCount={viewCounts[featuredPost.slug]}
                rating={ratings[featuredPost.slug]}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ════════ DISCOVERY TOOLBAR ════════ */}
        <div className="sticky top-14 z-30 -mx-6 px-6 py-4 bg-background/85 backdrop-blur-md border-y border-white/5 mb-10 space-y-4">
          {/* Row 1 — search + sort */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative flex-1 sm:max-w-sm">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/58"
                aria-hidden="true"
              />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search the journal…"
                aria-label="Search articles"
                className="w-full bg-white/[0.04] border border-white/8 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white/80 placeholder:text-white/62 outline-none focus:border-primary/40 focus:bg-white/[0.06] focus:ring-1 focus:ring-primary/15 transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/62 hover:text-white/70 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort — segmented control */}
            <div
              className="flex shrink-0 p-1 rounded-xl bg-white/[0.04] border border-white/8 sm:ml-auto"
              role="group"
              aria-label="Sort articles"
            >
              {SORTS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setSort(id)}
                  aria-pressed={sort === id}
                  className={`relative inline-flex flex-1 sm:flex-none items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                    sort === id ? "text-background" : "text-white/72 hover:text-white/80"
                  }`}
                >
                  {sort === id && (
                    <motion.span
                      layoutId="sort-pill"
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 rounded-lg bg-primary"
                    />
                  )}
                  <Icon className="relative w-3.5 h-3.5" aria-hidden="true" />
                  <span className="relative">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Row 2 — categories.
              Mobile: a compact dropdown with explicit Apply / Clear so nothing
              overflows the toolbar and filtering is deliberate.
              sm+: the full wrapping pill cloud. */}
          <div className="sm:hidden space-y-2">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <select
                  value={pendingTag ?? ""}
                  onChange={(e) => setPendingTag(e.target.value || null)}
                  aria-label="Choose a topic to filter by"
                  className="w-full appearance-none [color-scheme:dark] bg-white/[0.04] border border-white/8 rounded-xl pl-3.5 pr-10 py-2.5 text-sm font-mono text-white/80 outline-none focus:border-primary/40 focus:bg-white/[0.06] focus:ring-1 focus:ring-primary/15 transition-all"
                >
                  <option value="">All topics · {posts.length}</option>
                  {tags.map(({ tag, count }) => (
                    <option key={tag} value={tag}>
                      {tag} · {count}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/62"
                  aria-hidden="true"
                />
              </div>
              <button
                onClick={() => setActiveTag(pendingTag)}
                disabled={pendingTag === activeTag}
                className="shrink-0 px-4 py-2.5 rounded-xl text-xs font-mono border border-primary/40 bg-primary/10 text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Apply
              </button>
            </div>
            {activeTag && (
              <button
                onClick={() => setActiveTag(null)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono border border-white/8 text-white/74 hover:text-white/85 hover:border-white/25 transition-colors"
              >
                <X className="w-3 h-3" aria-hidden="true" />
                Clear filter · {activeTag}
              </button>
            )}
          </div>

          <div
            className="hidden sm:flex flex-wrap items-center gap-2"
            role="group"
            aria-label="Filter by topic"
          >
            <button
              onClick={() => setActiveTag(null)}
              className={`shrink-0 px-3 py-1 rounded-lg text-xs font-mono transition-colors border ${
                activeTag === null
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-white/8 text-white/72 hover:border-white/25 hover:text-white/80"
              }`}
            >
              All
              <span className={`ml-1.5 ${activeTag === null ? "text-primary/60" : "text-white/62"}`}>
                {posts.length}
              </span>
            </button>
            {visibleTags.map(({ tag, count }) => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                aria-pressed={activeTag === tag}
                className={`shrink-0 px-3 py-1 rounded-lg text-xs font-mono transition-colors border ${
                  activeTag === tag
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-white/8 text-white/72 hover:border-white/25 hover:text-white/80"
                }`}
              >
                {tag}
                <span className={`ml-1.5 ${activeTag === tag ? "text-primary/60" : "text-white/62"}`}>
                  {count}
                </span>
              </button>
            ))}
            {tags.length > TAG_LIMIT && (
              <button
                onClick={() => setShowAllTags((v) => !v)}
                className="shrink-0 px-3 py-1 rounded-lg text-xs font-mono text-primary/70 hover:text-primary transition-colors"
                aria-expanded={showAllTags}
              >
                {showAllTags ? "Show less" : `+${tags.length - TAG_LIMIT} more`}
              </button>
            )}
          </div>
        </div>

        {/* ════════ THE ARCHIVE ════════ */}
        <section aria-label="Articles" className="pb-24">
          {archive.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-white/72 font-mono text-sm mb-2">
                Nothing matches your filters.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setActiveTag(null);
                }}
                className="text-xs font-mono text-primary/70 hover:text-primary transition-colors"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${sort}-${activeTag}-${search}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="divide-y divide-white/[0.07]"
              >
                {archive.map((post, i) => (
                  <motion.div
                    key={post.slug}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.32,
                      delay: Math.min(i * 0.04, 0.4),
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <ArticleRow
                      post={post}
                      index={i + 1}
                      viewCount={viewCounts[post.slug]}
                      rating={ratings[post.slug]}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {/* Footer count */}
          {archive.length > 0 && (
            <div className="mt-12 flex items-center gap-4">
              <span className="h-px flex-1 bg-white/[0.06]" aria-hidden="true" />
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/62">
                {archive.length} {archive.length === 1 ? "Article" : "Articles"}
                {!isDefaultView && activeTag ? ` in ${activeTag}` : ""}
              </span>
              <span className="h-px flex-1 bg-white/[0.06]" aria-hidden="true" />
            </div>
          )}
        </section>
      </div>
    </>
  );
}
