import Link from "next/link";
import { format } from "date-fns";
import { ArrowRight, Clock, Eye, Star, Calendar } from "lucide-react";
import type { BlogPost } from "@/lib/blog";

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

interface FeaturedArticleProps {
  post: BlogPost;
  viewCount?: number;
  rating?: { avg: number; count: number };
}

/**
 * The lead story. A large asymmetric editorial panel — content on the left,
 * a typographic accent field on the right that works with or without a cover
 * image (most posts have none). Distinct from every other card on the page.
 */
export function FeaturedArticle({ post, viewCount, rating }: FeaturedArticleProps) {
  const date = post.date ? format(new Date(post.date), "MMMM d, yyyy") : "";
  const kicker = post.tags[0] ?? "Essay";

  return (
    <Link
      href={`/blog/${post.slug}`}
      aria-label={post.title}
      className="group relative grid lg:grid-cols-[1.45fr_1fr] rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent overflow-hidden transition-all duration-300 hover:border-primary/30"
    >
      {/* ── Left: editorial content ── */}
      <div className="relative z-10 p-7 sm:p-10 lg:p-12 flex flex-col">
        <div className="flex items-center gap-3 mb-6 sm:mb-7">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/12 border border-primary/30 text-primary text-[11px] font-mono uppercase tracking-[0.15em]">
            ✦ Featured
          </span>
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/65">
            {kicker}
          </span>
        </div>

        <h2 className="font-display text-2xl sm:text-3xl lg:text-[2.6rem] font-bold text-white leading-[1.08] tracking-tight mb-4 sm:mb-5 text-balance">
          {post.title}
        </h2>

        <p className="text-white/74 text-sm sm:text-base leading-relaxed line-clamp-3 mb-8 max-w-xl">
          {post.excerpt}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-mono text-white/72 mb-7">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
            {date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" aria-hidden="true" />
            {post.readingTime}
          </span>
          {viewCount !== undefined && (
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" aria-hidden="true" />
              {fmt(viewCount)}
            </span>
          )}
          {rating && rating.count > 0 && (
            <span className="flex items-center gap-1.5" title={`${rating.avg.toFixed(1)} / 5`}>
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" aria-hidden="true" />
              <span className="text-yellow-400/85">{rating.avg.toFixed(1)}</span>
            </span>
          )}
        </div>

        <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
          Read article
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden="true" />
        </span>
      </div>

      {/* ── Right: typographic accent field ── */}
      <div className="relative hidden lg:block overflow-hidden border-l border-white/[0.06]">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-violet-500/10" />
        <div className="absolute inset-0 dot-pattern opacity-30" />
        {/* Oversized rotated kicker as a watermark */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display font-bold text-white/[0.045] text-[6.5rem] leading-none -rotate-90 whitespace-nowrap select-none transition-transform duration-500 group-hover:scale-105">
            {kicker}
          </span>
        </div>
        {/* Cover image overlay if present */}
        {post.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImage}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-luminosity"
          />
        )}
        {/* Hover glow */}
        <div className="absolute -right-24 -top-24 w-72 h-72 rounded-full bg-primary/15 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </Link>
  );
}
