import { getMigrationPreview } from "@/app/actions/admin";
import { MigrateClient } from "./migrate-client";
import { FileText, Database } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MigratePage() {
  const preview = await getMigrationPreview();

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-white mb-1">
          Migrate Blog Posts
        </h1>
        <p className="text-sm text-white/72 font-mono">
          Import MDX files from{" "}
          <code className="text-white/70">content/blog/</code> into MongoDB
        </p>
      </div>

      {/* Pre-migration status */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            <span className="text-xs font-mono text-emerald-400/70 uppercase tracking-widest">
              Already in DB
            </span>
          </div>
          <div className="text-3xl font-bold text-emerald-400">{preview.inDb.length}</div>
          <div className="text-xs text-white/62 font-mono mt-0.5">
            post{preview.inDb.length !== 1 ? "s" : ""} already migrated
          </div>
        </div>

        <div className={`p-4 rounded-xl border ${
          preview.newFiles.length > 0
            ? "border-primary/25 bg-primary/6"
            : "border-white/8 bg-white/3"
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <FileText className={`w-4 h-4 ${preview.newFiles.length > 0 ? "text-primary" : "text-white/55"}`} aria-hidden="true" />
            <span className={`text-xs font-mono uppercase tracking-widest ${
              preview.newFiles.length > 0 ? "text-primary/70" : "text-white/55"
            }`}>
              New / Not migrated
            </span>
          </div>
          <div className={`text-3xl font-bold ${preview.newFiles.length > 0 ? "text-primary" : "text-white/62"}`}>
            {preview.newFiles.length}
          </div>
          <div className="text-xs text-white/62 font-mono mt-0.5">
            {preview.newFiles.length > 0
              ? `post${preview.newFiles.length !== 1 ? "s" : ""} ready to import`
              : "everything is up to date"}
          </div>
        </div>
      </div>

      {/* New files list */}
      {preview.newFiles.length > 0 && (
        <div className="rounded-xl border border-primary/15 bg-primary/4 overflow-hidden mb-6">
          <div className="px-4 py-2.5 border-b border-primary/10 text-xs font-mono text-primary/60 uppercase tracking-widest">
            Will be imported ({preview.newFiles.length})
          </div>
          <div className="divide-y divide-white/4 max-h-48 overflow-y-auto">
            {preview.newFiles.map((slug) => (
              <div key={slug} className="flex items-center gap-2 px-4 py-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/50 flex-shrink-0" />
                <span className="text-sm font-mono text-white/65">{slug}</span>
                <span className="ml-auto text-[10px] font-mono text-primary/50 border border-primary/20 rounded px-1.5 py-0.5">NEW</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Already in DB list (collapsed) */}
      {preview.inDb.length > 0 && (
        <details className="mb-6 rounded-xl border border-white/6 bg-white/2 overflow-hidden">
          <summary className="px-4 py-2.5 text-xs font-mono text-white/62 cursor-pointer hover:text-white/74 transition-colors uppercase tracking-widest list-none flex items-center justify-between">
            <span>Already migrated ({preview.inDb.length})</span>
            <span className="text-[10px]">click to expand</span>
          </summary>
          <div className="divide-y divide-white/4 max-h-48 overflow-y-auto border-t border-white/6">
            {preview.inDb.map((slug) => (
              <div key={slug} className="flex items-center gap-2 px-4 py-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/40 flex-shrink-0" />
                <span className="text-sm font-mono text-white/58">{slug}</span>
              </div>
            ))}
          </div>
        </details>
      )}

      <MigrateClient hasNew={preview.newFiles.length > 0} />
    </div>
  );
}
