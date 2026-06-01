"use client";

import { useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Legend,
} from "recharts";
import { Users, Eye, TrendingUp, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AnalyticsData, AnalyticsPeriod } from "@/app/actions/admin";

const PERIODS: { id: AnalyticsPeriod; label: string }[] = [
  { id: "week", label: "7 Days" },
  { id: "month", label: "30 Days" },
  { id: "year", label: "12 Months" },
];

function StatCard({ label, value, icon: Icon, sub, color }: {
  label: string; value: number | string; icon: React.ElementType; sub?: string; color: string;
}) {
  return (
    <div className={`p-5 rounded-2xl border bg-white/2 ${color}`}>
      <div className={`w-9 h-9 rounded-xl border flex items-center justify-center mb-3 ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="font-display text-3xl font-bold text-white mb-0.5">{value}</div>
      <div className="text-xs font-mono text-white/40">{label}</div>
      {sub && <div className="text-[10px] font-mono text-white/25 mt-0.5">{sub}</div>}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-[#0d1117] p-3 text-xs font-mono shadow-xl">
      <div className="text-white/50 mb-2">{label}</div>
      {payload.map((p: { name: string; value: number; color: string }, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-white/60">{p.name}:</span>
          <span className="text-white">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsDashboard({
  week, month, year,
}: {
  week: AnalyticsData;
  month: AnalyticsData;
  year: AnalyticsData;
}) {
  const [period, setPeriod] = useState<AnalyticsPeriod>("week");

  const data = { week, month, year }[period];

  return (
    <div className="p-8 space-y-8">
      {/* Header + period selector */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white mb-1">Analytics</h1>
          <p className="text-sm text-white/35 font-mono">Real visitor data from your portfolio</p>
        </div>
        <div className="flex gap-1 p-1 rounded-xl bg-white/4 border border-white/6">
          {PERIODS.map(({ id, label }) => (
            <button key={id} onClick={() => setPeriod(id)}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all",
                period === id ? "bg-white/10 text-white/85" : "text-white/30 hover:text-white/60",
              )}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Views" value={data.totalViews} icon={Eye}
          sub={`in selected period`} color="border-primary/20 text-primary" />
        <StatCard label="Unique Visitors" value={data.uniqueVisitors} icon={Users}
          sub="distinct visitor IDs" color="border-violet-500/20 text-violet-400" />
        <StatCard label="Today's Views" value={year.todayViews} icon={Calendar}
          color="border-emerald-500/20 text-emerald-400" />
        <StatCard label="Top Page Views" value={data.topPages[0]?.views ?? 0} icon={TrendingUp}
          sub={data.topPages[0]?.path ?? "—"} color="border-yellow-500/20 text-yellow-400" />
      </div>

      {/* Area chart */}
      <div className="p-5 rounded-2xl border border-white/6 bg-white/2">
        <h2 className="text-sm font-mono text-white/40 uppercase tracking-widest mb-5">
          Views &amp; Visitors
        </h2>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data.chart} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gVisitors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="label" tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 11, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 11, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11, fontFamily: "monospace", color: "rgba(255,255,255,0.4)" }} />
            <Area type="monotone" dataKey="views" name="Views" stroke="#00d4ff" strokeWidth={2} fill="url(#gViews)" dot={false} activeDot={{ r: 4, fill: "#00d4ff" }} />
            <Area type="monotone" dataKey="visitors" name="Visitors" stroke="#a855f7" strokeWidth={2} fill="url(#gVisitors)" dot={false} activeDot={{ r: 4, fill: "#a855f7" }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom row: bar chart + top pages */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Bar chart for year comparison */}
        <div className="p-5 rounded-2xl border border-white/6 bg-white/2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-mono text-white/40 uppercase tracking-widest">
              Monthly Breakdown
            </h2>
            <span className="text-[10px] font-mono text-white/20 border border-white/8 rounded px-2 py-0.5">Last 12 months</span>
          </div>
          {year.chart.every((p) => p.views === 0) ? (
            <div className="flex flex-col items-center justify-center h-[200px] gap-3">
              <div className="w-10 h-10 rounded-xl border border-white/8 bg-white/3 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white/20" />
              </div>
              <p className="text-xs font-mono text-white/25 text-center">No visits recorded yet<br />Data will appear as visitors arrive</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={year.chart} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="label" tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="views" name="Views" fill="#00d4ff" fillOpacity={0.7} radius={[3, 3, 0, 0]} />
                <Bar dataKey="visitors" name="Visitors" fill="#a855f7" fillOpacity={0.6} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top pages */}
        <div className="p-5 rounded-2xl border border-white/6 bg-white/2">
          <h2 className="text-sm font-mono text-white/40 uppercase tracking-widest mb-4">
            Top Pages
          </h2>
          {data.topPages.length === 0 ? (
            <p className="text-white/25 font-mono text-sm text-center py-8">No data yet</p>
          ) : (
            <div className="space-y-2.5">
              {data.topPages.map(({ path, views }, i) => {
                const max = data.topPages[0]?.views ?? 1;
                const pct = Math.round((views / max) * 100);
                return (
                  <div key={path}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono text-white/55 truncate max-w-[200px]">
                        {i + 1}. {path}
                      </span>
                      <span className="text-xs font-mono text-white/40 flex-shrink-0 ml-2">{views}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full bg-primary/60" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
