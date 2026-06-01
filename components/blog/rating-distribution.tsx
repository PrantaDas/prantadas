"use client";

import { Star } from "lucide-react";

export function RatingDistribution({
  rating,
  distribution,
}: {
  rating: { avg: number; count: number };
  distribution: Record<number, number>;
}) {
  if (!rating || rating.count === 0) return null;

  const total = Object.values(distribution).reduce((sum, n) => sum + n, 0) || 1;

  return (
    <div className="mt-10 p-6 rounded-2xl border border-white/8 bg-white/2">
      <h3 className="font-display text-lg font-semibold text-white/80 mb-6">
        Overall Ratings
      </h3>

      <div className="flex items-center gap-6 sm:gap-8">

        {/* ── Left: score summary ─────────────────── */}
        <div className="flex-shrink-0">
          <div className="text-5xl font-bold text-white leading-none mb-1">
            {rating.avg.toFixed(1)}
          </div>
          <div className="text-sm text-white/50 font-mono mb-1.5">out of 5</div>
          <div className="text-xs text-white/40 font-mono">
            {rating.count} Ratings
          </div>
        </div>

        {/* ── Middle: star staircase ───────────────── */}
        <div className="flex-shrink-0 flex flex-col gap-[7px]">
          {[5, 4, 3, 2, 1].map((level) => (
            <div key={level} className="flex items-center gap-[3px] h-4">
              {[...Array(level)].map((_, i) => (
                <Star
                  key={i}
                  className="w-3.5 h-3.5 fill-primary text-primary"
                  aria-hidden="true"
                />
              ))}
            </div>
          ))}
        </div>

        {/* ── Right: progress bars ────────────────── */}
        <div className="flex-1 flex flex-col gap-[7px]">
          {[5, 4, 3, 2, 1].map((level) => {
            const count   = distribution[level] || 0;
            const fillPct = Math.round((count / total) * 100);

            return (
              <div key={level} className="flex items-center h-4">
                <div className="relative w-full h-[7px] rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${fillPct}%` }}
                    aria-label={`${level} stars: ${count} ratings`}
                  />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
