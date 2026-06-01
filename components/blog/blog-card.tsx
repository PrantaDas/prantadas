import Link from "next/link";
import { Clock, Calendar, ArrowUpRight, Eye } from "lucide-react";
import { format } from "date-fns";
import type { BlogPost } from "@/lib/blog";
import { cn } from "@/lib/utils";

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

function TagPill({ tag }: { tag: string }) {
  return (
    <Link
      href={`/blog/tag/${encodeURIComponent(tag)}`}
      className="relative z-10 pointer-events-auto font-mono text-xs text-white/35 px-2 py-0.5 rounded bg-white/4 border border-white/5 hover:text-primary/70 hover:border-primary/20 hover:bg-primary/5 transition-colors"
    >
      {tag}
    </Link>
  );
}

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
  viewCount?: number;
  className?: string;
}

export function BlogCard({ post, featured = false, viewCount, className }: BlogCardProps) {
  const formattedDate = post.date
    ? format(new Date(post.date), "MMM d, yyyy")
    : "";

  if (featured) {
    return (
      <div
        className={cn(
          "group relative flex flex-col gap-5 p-6 sm:p-8 rounded-2xl border border-white/8 bg-[#0a0c16]/60 hover:border-primary/20 transition-all duration-300 hover:-translate-y-0.5",
          className,
        )}
      >
        {/* Full-card link */}
        <Link
          href={`/blog/${post.slug}`}
          className="absolute inset-0 rounded-2xl z-0"
          aria-label={post.title}
        />

        {/* Hover glow — pointer events off so it never blocks the link */}
        <div className="absolute inset-0 rounded-2xl bg-primary/3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        {/* All content: z-10 to stay visible, pointer-events-none so clicks fall to the link */}
        <div className="flex items-center justify-between relative z-10 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono">
            ★ Featured
          </span>
          <div className="flex items-center gap-3 text-xs font-mono text-white/30">
            {viewCount !== undefined && (
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" aria-hidden="true" />
                {fmt(viewCount)}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock className="w-3 h-3" aria-hidden="true" />
              {post.readingTime}
            </span>
          </div>
        </div>

        <div className="relative z-10 pointer-events-none">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white/90 group-hover:text-white mb-3 leading-snug transition-colors">
            {post.title}
          </h2>
          <p className="text-white/50 text-sm leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
        </div>

        <div className="flex flex-col gap-2 relative z-10 mt-auto pt-4 border-t border-white/6 pointer-events-none">
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <TagPill key={tag} tag={tag} />
            ))}
          </div>
          <span className="flex items-center gap-1.5 text-xs text-white/30">
            <Calendar className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
            {formattedDate}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group relative flex flex-col gap-4 p-5 rounded-xl border border-white/6 bg-[#0a0c16]/40 hover:border-white/12 hover:bg-[#0a0c16]/70 transition-all duration-300",
        className,
      )}
    >
      {/* Full-card link */}
      <Link
        href={`/blog/${post.slug}`}
        className="absolute inset-0 rounded-xl z-0"
        aria-label={post.title}
      />

      <div className="flex items-start justify-between gap-3 relative z-10 pointer-events-none">
        <h3 className="font-display text-base font-semibold text-white/80 group-hover:text-white transition-colors leading-snug line-clamp-2 flex-1">
          {post.title}
        </h3>
        <ArrowUpRight
          className="w-4 h-4 text-white/20 group-hover:text-primary transition-colors flex-shrink-0 mt-0.5"
          aria-hidden="true"
        />
      </div>

      <p className="text-white/45 text-sm leading-relaxed line-clamp-2 relative z-10 pointer-events-none">
        {post.excerpt}
      </p>

      <div className="flex flex-col gap-2 mt-auto relative z-10 pointer-events-none">
        <div className="flex flex-wrap gap-1.5">
          {post.tags.slice(0, 2).map((tag) => (
            <TagPill key={tag} tag={tag} />
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs text-white/30 font-mono">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
            {post.readingTime}
          </span>
          {viewCount !== undefined && (
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
              {fmt(viewCount)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
