import { getAllPostsAdmin } from "@/app/actions/admin";
import { format } from "date-fns";
import { ExternalLink, Star, Pencil } from "lucide-react";
import Link from "next/link";
import { ToggleStatusBtn, DeletePostBtn } from "./actions-client";

export const dynamic = "force-dynamic";

export default async function ManagePostsPage() {
  const posts = await getAllPostsAdmin().catch(() => []);
  const published = posts.filter((p) => p.status === "published").length;
  const drafts = posts.filter((p) => p.status === "draft").length;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-white mb-1">
            Manage Posts
          </h1>
          <p className="text-sm text-white/35 font-mono">
            {posts.length} total &middot; {published} published &middot; {drafts}{" "}
            draft{drafts !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/dashboard/blog"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-background text-sm font-bold hover:bg-primary/90 transition-colors"
        >
          + New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-white/25 font-mono text-sm">No posts yet</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/6 overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3 bg-white/2 border-b border-white/6 text-[10px] font-mono text-white/25 uppercase tracking-widest">
            <span>Title</span>
            <span className="text-right">Date</span>
            <span className="text-right">Status</span>
            <span />
          </div>

          <div className="divide-y divide-white/4">
            {posts.map((post) => (
              <div
                key={post.slug}
                className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-5 py-3.5 hover:bg-white/2 transition-colors group"
              >
                {/* Title + meta */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-white/75 truncate">
                      {post.title}
                    </span>
                    {post.featured && (
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono text-white/25">
                      /{post.slug}
                    </span>
                    {post.tags.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-mono text-white/25 px-1.5 py-0.5 rounded bg-white/4 border border-white/5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Date */}
                <span className="text-xs font-mono text-white/30 text-right flex-shrink-0">
                  {format(new Date(post.date), "MMM d, yyyy")}
                </span>

                {/* Status toggle */}
                <div className="flex-shrink-0">
                  <ToggleStatusBtn slug={post.slug} status={post.status} />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <Link
                    href={`/admin/dashboard/blog/${post.slug}/edit`}
                    className="p-1.5 rounded-lg text-white/20 hover:text-primary hover:bg-primary/10 transition-all"
                    aria-label="Edit post"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    className="p-1.5 rounded-lg text-white/20 hover:text-white/60 hover:bg-white/6 transition-all"
                    aria-label="View post"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                  <DeletePostBtn slug={post.slug} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
