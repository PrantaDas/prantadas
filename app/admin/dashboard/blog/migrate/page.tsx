"use client";

import { useState, useTransition } from "react";
import { migrateBlogs, type MigrateResult } from "@/app/actions/admin";
import { Database, CheckCircle2, SkipForward, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function MigratePage() {
  const [result, setResult] = useState<MigrateResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const run = () => {
    startTransition(async () => {
      const r = await migrateBlogs();
      setResult(r);
    });
  };

  const total = result
    ? result.migrated.length + result.skipped.length + result.errors.length
    : 0;

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-white mb-1">
          Migrate Blog Posts
        </h1>
        <p className="text-sm text-white/35 font-mono">
          Import all MDX files from <span className="text-white/55">content/blog/</span> into MongoDB
        </p>
      </div>

      {/* Info box */}
      <div className="p-4 rounded-xl border border-primary/15 bg-primary/5 mb-6 text-sm text-white/55 leading-relaxed">
        <p className="font-semibold text-white/70 mb-1">What this does</p>
        <ul className="space-y-1 list-disc list-inside text-white/45 text-xs font-mono">
          <li>Reads every <code>.mdx</code> file from the filesystem</li>
          <li>Parses frontmatter (title, date, tags, excerpt, etc.)</li>
          <li>Saves each post to MongoDB — skips already-migrated slugs</li>
          <li>Safe to run multiple times — duplicate slugs are skipped</li>
        </ul>
      </div>

      {!result ? (
        <button
          onClick={run}
          disabled={isPending}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-background font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Database className="w-4 h-4" />
          )}
          {isPending ? "Migrating…" : "Run Migration"}
        </button>
      ) : (
        <div className="space-y-4">
          {/* Summary bar */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/8 text-center">
              <div className="text-2xl font-bold text-emerald-400">{result.migrated.length}</div>
              <div className="text-xs text-white/35 font-mono mt-0.5">Migrated</div>
            </div>
            <div className="p-4 rounded-xl border border-white/8 bg-white/3 text-center">
              <div className="text-2xl font-bold text-white/50">{result.skipped.length}</div>
              <div className="text-xs text-white/35 font-mono mt-0.5">Skipped</div>
            </div>
            <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/8 text-center">
              <div className="text-2xl font-bold text-red-400">{result.errors.length}</div>
              <div className="text-xs text-white/35 font-mono mt-0.5">Errors</div>
            </div>
          </div>

          {/* Migrated list */}
          {result.migrated.length > 0 && (
            <div className="rounded-xl border border-white/6 bg-white/2 overflow-hidden">
              <div className="px-4 py-2.5 border-b border-white/6 text-xs font-mono text-white/30 uppercase tracking-widest">
                Migrated ({result.migrated.length})
              </div>
              <div className="divide-y divide-white/4">
                {result.migrated.map((slug) => (
                  <div key={slug} className="flex items-center gap-2 px-4 py-2.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span className="text-sm font-mono text-white/60">{slug}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skipped list */}
          {result.skipped.length > 0 && (
            <div className="rounded-xl border border-white/6 bg-white/2 overflow-hidden">
              <div className="px-4 py-2.5 border-b border-white/6 text-xs font-mono text-white/30 uppercase tracking-widest">
                Already in DB — Skipped ({result.skipped.length})
              </div>
              <div className="divide-y divide-white/4">
                {result.skipped.map((slug) => (
                  <div key={slug} className="flex items-center gap-2 px-4 py-2.5">
                    <SkipForward className="w-3.5 h-3.5 text-white/25 flex-shrink-0" />
                    <span className="text-sm font-mono text-white/35">{slug}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Errors */}
          {result.errors.length > 0 && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 overflow-hidden">
              <div className="px-4 py-2.5 border-b border-red-500/15 text-xs font-mono text-red-400/60 uppercase tracking-widest">
                Errors ({result.errors.length})
              </div>
              <div className="divide-y divide-red-500/10">
                {result.errors.map(({ slug, error }) => (
                  <div key={slug} className="flex items-start gap-2 px-4 py-2.5">
                    <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-mono text-white/60">{slug}</div>
                      <div className="text-xs text-red-400/70 font-mono">{error}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Done message */}
          {total > 0 && result.errors.length === 0 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-emerald-400 font-mono">
                Migration complete — {result.migrated.length} post{result.migrated.length !== 1 ? "s" : ""} added to MongoDB.
              </p>
              <Link
                href="/blog"
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-white/35 hover:text-white/60 transition-colors"
              >
                View Blog <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
