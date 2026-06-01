import Link from "next/link";
import { adminLogout } from "@/app/actions/admin";
import { LayoutDashboard, MessageSquare, PenLine, LogOut, Shield, Database, List, BarChart2 } from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/dashboard/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/admin/dashboard/comments", label: "Comments", icon: MessageSquare },
  { href: "/admin/dashboard/blog", label: "New Post", icon: PenLine },
  { href: "/admin/dashboard/blog/manage", label: "Manage Posts", icon: List },
  { href: "/admin/dashboard/blog/migrate", label: "Migrate Posts", icon: Database },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#060810] flex">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 border-r border-white/6 bg-[#08090f] flex flex-col">
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/6">
          <div className="w-7 h-7 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center flex-shrink-0">
            <Shield className="w-3.5 h-3.5 text-primary" />
          </div>
          <div>
            <div className="text-xs font-bold text-white/80">Admin Panel</div>
            <div className="text-[10px] text-white/25 font-mono">Pranta Das</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-white/45 hover:text-white/80 hover:bg-white/5 transition-colors font-mono group"
            >
              <Icon className="w-4 h-4 flex-shrink-0 group-hover:text-primary transition-colors" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/6">
          <form action={adminLogout}>
            <button
              type="submit"
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-white/35 hover:text-red-400 hover:bg-red-500/8 transition-colors font-mono"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
