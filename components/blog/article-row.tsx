import Link from "next/link";
import { format } from "date-fns";
import { ArrowUpRight, Clock, Eye, Star } from "lucide-react";
import type { BlogPost } from "@/lib/blog";

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

interface ArticleRowProps {
  post: BlogPost;
  index: number;
  viewCount?: number;
  rating?: { avg: number; count: number };
}

/**
 * An archive entry styled like a publication's table of contents rather than
 * a boxy card: a numbered left rail, the title + dek in the centre, and meta
 * on the right. Hairline-separated, whitespace-led, and unmistakably editorial.
 * The whole row is a single link (tags render as plain text to keep the markup
 * valid — category filtering lives in the toolbar).
 */
export function ArticleRow({ post, index, viewCount, rating }: ArticleRowProps) {
  const date = post.date ? format(new Date(post.date), "MMM d, yyyy") : "";

  return (
    <Link
      href={`/blog/${post.slug}`}
      aria-label={post.title}
      className="group relative block"
    >
      {/* Hover wash — bleeds slightly past the content for a lifted feel */}
      <div className="absolute inset-x-[-1.25rem] inset-y-0 rounded-2xl bg-white/[0.025] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />

      <div className="relative grid sm:grid-cols-[5rem_1fr_auto] gap-x-7 gap-y-3 py-7">
        {/* Left rail: index + date */}
        <div className="flex sm:flex-col items-baseline sm:items-start gap-3 sm:gap-1.5">
          <span className="font-mono text-xs text-white/55 group-hover:text-primary/80 transition-colors tabular-nums">
            {String(index).padStart(3, "0")}
          </span>
          <span className="font-mono text-xs text-white/65">{date}</span>
        </div>

        {/* Main: title, dek, tags */}
        <div className="min-w-0">
          <h3 className="font-display text-lg sm:text-xl font-semibold text-white/85 group-hover:text-white transition-colors leading-snug mb-2 text-balance">
            {post.title}
          </h3>
          <p className="text-white/72 text-sm leading-relaxed line-clamp-2 mb-3 max-w-2xl">
            {post.excerpt}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="font-mono text-[11px] text-white/65 px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Right: meta + affordance */}
        <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-2.5 text-xs font-mono text-white/68 sm:text-right">
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
          <ArrowUpRight
            className="hidden sm:block w-4 h-4 text-white/55 group-hover:text-primary transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </div>
      </div>
    </Link>
  );
}
