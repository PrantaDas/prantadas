import Link from "next/link";
import { getAllCommentsAdmin, getAllPostsAdmin, getAnalytics } from "@/app/actions/admin";
import { MessageSquare, PenLine, Star, FileText, Users, Eye, TrendingUp, BarChart2 } from "lucide-react";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [comments, posts, analytics] = await Promise.all([
    getAllCommentsAdmin().catch(() => []),
    getAllPostsAdmin().catch(() => []),
    getAnalytics("week").catch(() => null),
  ]);

  const published = posts.filter((p) => p.status === "published").length;
  const avgRating =
    comments.length > 0
      ? (comments.reduce((s, c) => s + c.rating, 0) / comments.length).toFixed(1)
      : "—";

  const stats = [
    { label: "Published Posts", value: published, icon: FileText, color: "text-primary", bg: "border-primary/20 bg-primary/5" },
    { label: "Comments", value: comments.length, icon: MessageSquare, color: "text-violet-400", bg: "border-violet-500/20 bg-violet-500/5" },
    { label: "Avg. Rating", value: avgRating, icon: Star, color: "text-yellow-400", bg: "border-yellow-500/20 bg-yellow-500/5" },
    { label: "Today's Views", value: analytics?.todayViews ?? 0, icon: Eye, color: "text-emerald-400", bg: "border-emerald-500/20 bg-emerald-500/5" },
    { label: "Weekly Views", value: analytics?.totalViews ?? 0, icon: TrendingUp, color: "text-cyan-400", bg: "border-cyan-500/20 bg-cyan-500/5" },
    { label: "Unique Visitors", value: analytics?.uniqueVisitors ?? 0, icon: Users, color: "text-orange-400", bg: "border-orange-500/20 bg-orange-500/5" },
  ];

  const recent = comments.slice(0, 5);

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-sm text-white/35 font-mono">
          Welcome back, Pranta — {format(new Date(), "MMMM d, yyyy")}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={`p-5 rounded-xl border ${bg}`}>
            <div className={`w-8 h-8 rounded-lg border flex items-center justify-center mb-3 ${bg}`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <div className="font-display text-2xl font-bold text-white mb-0.5">{value}</div>
            <div className="text-xs text-white/35 font-mono">{label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-xs font-mono text-white/30 uppercase tracking-widest mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { href: "/admin/dashboard/blog", icon: PenLine, label: "New Post", sub: "MDX editor" },
            { href: "/admin/dashboard/blog/manage", icon: FileText, label: "Manage Posts", sub: `${published} published` },
            { href: "/admin/dashboard/comments", icon: MessageSquare, label: "Comments", sub: `${comments.length} total` },
            { href: "/admin/dashboard/analytics", icon: BarChart2, label: "Analytics", sub: "Visitor insights" },
            { href: "/admin/dashboard/blog/migrate", icon: TrendingUp, label: "Migrate Posts", sub: "MDX → MongoDB" },
          ].map(({ href, icon: Icon, label, sub }) => (
            <Link key={href} href={href}
              className="flex items-center gap-3 p-4 rounded-xl border border-white/6 bg-white/2 hover:border-primary/20 hover:bg-primary/3 transition-all group">
              <Icon className="w-4 h-4 text-white/30 group-hover:text-primary transition-colors flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-sm font-semibold text-white/65 group-hover:text-white transition-colors">{label}</div>
                <div className="text-xs text-white/25 font-mono">{sub}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent comments */}
      <div>
        <h2 className="text-xs font-mono text-white/30 uppercase tracking-widest mb-3">Recent Comments</h2>
        {recent.length === 0 ? (
          <div className="flex items-center gap-3 p-4 rounded-xl border border-white/5 bg-white/2 text-white/25">
            <MessageSquare className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm font-mono">No comments yet — they'll appear here once readers engage.</span>
          </div>
        ) : (
          <div className="space-y-2">
            {recent.map((c) => (
              <div key={c.id} className="flex items-start gap-3 p-3.5 rounded-xl border border-white/5 bg-white/2">
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/15 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-white/70">{c.name}</span>
                    <span className="text-xs text-white/25 font-mono">on /{c.slug}</span>
                    <span className="text-xs text-white/20 font-mono ml-auto">
                      {format(new Date(c.createdAt), "MMM d")}
                    </span>
                  </div>
                  <p className="text-xs text-white/40 line-clamp-1">{c.message}</p>
                </div>
                <div className="flex items-center gap-0.5 flex-shrink-0">
                  {Array.from({ length: c.rating }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
