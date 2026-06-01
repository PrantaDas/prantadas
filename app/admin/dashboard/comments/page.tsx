import { getAllCommentsAdmin, deleteComment } from "@/app/actions/admin";
import { format } from "date-fns";
import { Star, Trash2, MessageSquare, ExternalLink } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function DeleteButton({ id }: { id: string }) {
  async function handleDelete() {
    "use server";
    await deleteComment(id);
  }
  return (
    <form action={handleDelete}>
      <button
        type="submit"
        aria-label="Delete comment"
        className="p-2 rounded-lg text-white/25 hover:text-red-400 hover:bg-red-500/10 transition-all"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </form>
  );
}

export default async function CommentsPage() {
  const comments = await getAllCommentsAdmin().catch(() => []);

  type C = (typeof comments)[number];
  const grouped = comments.reduce<Record<string, C[]>>((acc, c) => {
    (acc[c.slug] ??= []).push(c);
    return acc;
  }, {});

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-white mb-1">Comments</h1>
          <p className="text-sm text-white/35 font-mono">
            {comments.length} total comment{comments.length !== 1 ? "s" : ""} across {Object.keys(grouped).length} post{Object.keys(grouped).length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {comments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <MessageSquare className="w-10 h-10 text-white/15 mb-3" />
          <p className="text-white/30 font-mono text-sm">No comments yet</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([slug, slugComments]) => (
            <div key={slug}>
              {/* Slug header */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono text-white/30 uppercase tracking-widest">Post</span>
                <Link
                  href={`/blog/${slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-1 text-xs font-mono text-primary/60 hover:text-primary transition-colors"
                >
                  /{slug}
                  <ExternalLink className="w-3 h-3" />
                </Link>
                <span className="ml-auto text-xs text-white/20 font-mono">{slugComments.length} comment{slugComments.length !== 1 ? "s" : ""}</span>
              </div>

              {/* Comments for this slug */}
              <div className="space-y-2">
                {slugComments.map((c) => (
                  <div key={c.id} className="flex items-start gap-3 p-4 rounded-xl border border-white/6 bg-white/2 group">
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/15 flex items-center justify-center text-primary text-sm font-bold flex-shrink-0">
                      {c.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1.5">
                        <span className="text-sm font-semibold text-white/80">{c.name}</span>
                        <span className="text-xs text-white/30 font-mono">{c.email}</span>
                        <span className="text-xs text-white/20 font-mono ml-auto">
                          {format(new Date(c.createdAt), "MMM d, yyyy · HH:mm")}
                        </span>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-0.5 mb-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${s <= c.rating ? "fill-yellow-400 text-yellow-400" : "text-white/10"}`}
                          />
                        ))}
                      </div>

                      <p className="text-sm text-white/55 leading-relaxed">{c.message}</p>
                    </div>

                    {/* Delete */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <DeleteButton id={c.id} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
