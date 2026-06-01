import Link from "next/link";
import { Clock, Calendar, ArrowUpRight } from "lucide-react";
import { format } from "date-fns";
import type { BlogPost } from "@/lib/blog";
import { cn } from "@/lib/utils";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
  className?: string;
}

export function BlogCard({ post, featured = false, className }: BlogCardProps) {
  const formattedDate = post.date
    ? format(new Date(post.date), "MMM d, yyyy")
    : "";

  if (featured) {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className={cn(
          "group relative flex flex-col gap-5 p-6 sm:p-8 rounded-2xl border border-white/8 bg-[#0a0c16]/60 hover:border-primary/20 transition-all duration-300 hover:-translate-y-0.5",
          className,
        )}
      >
        {/* Featured glow */}
        <div className="absolute inset-0 rounded-2xl bg-primary/3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        <div className="flex items-center justify-between relative z-10">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono">
            ★ Featured
          </span>
          <span className="text-xs font-mono text-white/30 flex items-center gap-1.5">
            <Clock className="w-3 h-3" aria-hidden="true" />
            {post.readingTime}
          </span>
        </div>

        <div className="relative z-10">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white/90 group-hover:text-white mb-3 leading-snug transition-colors">
            {post.title}
          </h2>
          <p className="text-white/50 text-sm leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
        </div>

        <div className="flex items-center justify-between relative z-10 mt-auto pt-4 border-t border-white/6">
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs font-mono text-white/35 px-2 py-0.5 rounded bg-white/5 border border-white/6"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-white/30">
            <Calendar className="w-3 h-3" aria-hidden="true" />
            {formattedDate}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        "group flex flex-col gap-4 p-5 rounded-xl border border-white/6 bg-[#0a0c16]/40 hover:border-white/12 hover:bg-[#0a0c16]/70 transition-all duration-300",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-base font-semibold text-white/80 group-hover:text-white transition-colors leading-snug line-clamp-2 flex-1">
          {post.title}
        </h3>
        <ArrowUpRight
          className="w-4 h-4 text-white/20 group-hover:text-primary transition-colors flex-shrink-0 mt-0.5"
          aria-hidden="true"
        />
      </div>

      <p className="text-white/45 text-sm leading-relaxed line-clamp-2">
        {post.excerpt}
      </p>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex flex-wrap gap-1.5">
          {post.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-xs font-mono text-white/30 px-2 py-0.5 rounded bg-white/4 border border-white/5"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs text-white/30 font-mono">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" aria-hidden="true" />
            {post.readingTime}
          </span>
        </div>
      </div>
    </Link>
  );
}
