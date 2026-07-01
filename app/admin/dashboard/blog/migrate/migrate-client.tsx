"use client";

import { useState, useTransition } from "react";
import { migrateBlogs, type MigrateResult } from "@/app/actions/admin";
import {
  Database, CheckCircle2, SkipForward, AlertCircle, Loader2, ArrowRight, RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function MigrateClient({ hasNew }: { hasNew: boolean }) {
  const [result, setResult] = useState<MigrateResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const run = () => {
    startTransition(async () => {
      const r = await migrateBlogs();
      setResult(r);
      // Refresh page so the preview counts update
      router.refresh();
    });
  };

  if (result) {
    const total = result.migrated.length + result.skipped.length + result.errors.length;
    return (
      <div className="space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/8 text-center">
            <div className="text-2xl font-bold text-emerald-400">{result.migrated.length}</div>
            <div className="text-xs text-white/68 font-mono mt-0.5">Migrated</div>
          </div>
          <div className="p-4 rounded-xl border border-white/8 bg-white/3 text-center">
            <div className="text-2xl font-bold text-white/74">{result.skipped.length}</div>
            <div className="text-xs text-white/68 font-mono mt-0.5">Skipped</div>
          </div>
          <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/8 text-center">
            <div className="text-2xl font-bold text-red-400">{result.errors.length}</div>
            <div className="text-xs text-white/68 font-mono mt-0.5">Errors</div>
          </div>
        </div>

        {result.migrated.length > 0 && (
          <div className="rounded-xl border border-white/6 bg-white/2 overflow-hidden">
            <div className="px-4 py-2.5 border-b border-white/6 text-xs font-mono text-white/62 uppercase tracking-widest">
              Migrated ({result.migrated.length})
            </div>
            <div className="divide-y divide-white/4">
              {result.migrated.map((slug) => (
                <div key={slug} className="flex items-center gap-2 px-4 py-2.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span className="text-sm font-mono text-white/65">{slug}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {result.skipped.length > 0 && (
          <div className="rounded-xl border border-white/6 bg-white/2 overflow-hidden">
            <div className="px-4 py-2.5 border-b border-white/6 text-xs font-mono text-white/62 uppercase tracking-widest">
              Already in DB — Skipped ({result.skipped.length})
            </div>
            <div className="divide-y divide-white/4">
              {result.skipped.map((slug) => (
                <div key={slug} className="flex items-center gap-2 px-4 py-2.5">
                  <SkipForward className="w-3.5 h-3.5 text-white/55 flex-shrink-0" />
                  <span className="text-sm font-mono text-white/62">{slug}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {result.errors.length > 0 && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 overflow-hidden">
            <div className="px-4 py-2.5 border-b border-red-500/15 text-xs font-mono text-red-400/70 uppercase tracking-widest">
              Errors ({result.errors.length})
            </div>
            <div className="divide-y divide-red-500/10">
              {result.errors.map(({ slug, error }) => (
                <div key={slug} className="flex items-start gap-2 px-4 py-2.5">
                  <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-mono text-white/65">{slug}</div>
                    <div className="text-xs text-red-400/70 font-mono">{error}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          {result.errors.length === 0 ? (
            <p className="text-sm text-emerald-400 font-mono">
              ✓ Migration complete — {result.migrated.length} post{result.migrated.length !== 1 ? "s" : ""} added.
            </p>
          ) : (
            <p className="text-sm text-red-400/80 font-mono">
              Completed with {result.errors.length} error{result.errors.length !== 1 ? "s" : ""}.
            </p>
          )}
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setResult(null); router.refresh(); }}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-white/62 hover:text-white/70 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset
            </button>
            <Link
              href="/blog"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-white/62 hover:text-white/70 transition-colors"
            >
              View Blog <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {total > 0 && result.errors.length === 0 && result.migrated.length === 0 && (
          <p className="text-sm text-white/68 font-mono">All files are already in the database.</p>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={run}
      disabled={isPending || !hasNew}
      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-background font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
      ) : (
        <Database className="w-4 h-4" aria-hidden="true" />
      )}
      {isPending
        ? "Migrating…"
        : hasNew
        ? "Run Migration"
        : "Nothing to migrate"}
    </button>
  );
}
