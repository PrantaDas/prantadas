"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Bookmark, X, ArrowUpRight, BookOpen } from "lucide-react";
import {
  getBookmarks,
  removeBookmark,
  BOOKMARKS_EVENT,
  type Bookmark as BookmarkItem,
} from "@/lib/bookmarks";

function relativeDate(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const days = Math.floor((Date.now() - then) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export function ReadingList() {
  const [items, setItems] = useState<BookmarkItem[]>([]);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const refresh = () => setItems(getBookmarks());
    refresh();
    window.addEventListener(BOOKMARKS_EVENT, refresh);
    return () => window.removeEventListener(BOOKMARKS_EVENT, refresh);
  }, []);

  // Lock background scroll while the panel is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Avoid hydration mismatch — counts only exist client-side.
  if (!mounted) return null;

  const sorted = [...items].sort(
    (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime(),
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-white/45 hover:text-amber-400 transition-colors text-xs font-mono"
        aria-label={`Reading list, ${items.length} saved`}
      >
        <Bookmark className="w-3.5 h-3.5" aria-hidden="true" />
        Saved
        {items.length > 0 && (
          <span className="inline-flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-amber-400/15 text-amber-400 text-[10px] leading-none">
            {items.length}
          </span>
        )}
      </button>

      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[9980] h-[100dvh] flex items-end sm:items-center justify-center p-0 sm:p-4"
              onClick={() => setOpen(false)}
            >
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 40, scale: 0.97 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 flex w-full max-w-md max-h-[85dvh] flex-col glass-card rounded-t-2xl sm:rounded-2xl border border-white/10 overflow-hidden pb-[env(safe-area-inset-bottom)] sm:pb-0"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="h-[2px] bg-gradient-to-r from-amber-400/60 via-amber-400/30 to-transparent" />

                {/* Pinned header — close button always reachable */}
                <div className="flex items-center gap-3 p-5 border-b border-white/8">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center flex-shrink-0">
                    <Bookmark className="w-5 h-5 text-amber-400/70" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-white/85">Reading list</h3>
                    <p className="text-xs font-mono text-white/35">
                      {items.length === 0
                        ? "Nothing saved yet"
                        : `${items.length} saved article${items.length === 1 ? "" : "s"}`}
                    </p>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="shrink-0 p-1.5 -mr-1 rounded-md text-white/30 hover:text-white/70 hover:bg-white/5 transition-colors"
                    aria-label="Close reading list"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto no-scrollbar p-5">
                  {sorted.length === 0 ? (
                    <div className="py-8 text-center">
                      <BookOpen className="w-7 h-7 text-white/15 mx-auto mb-3" aria-hidden="true" />
                      <p className="text-sm text-white/45 leading-relaxed">
                        Tap{" "}
                        <span className="inline-flex items-center gap-1 align-middle text-white/70">
                          <Bookmark className="w-3.5 h-3.5" aria-hidden="true" />
                          Save
                        </span>{" "}
                        on any article to keep it here for later.
                      </p>
                    </div>
                  ) : (
                    <ul className="-mx-2">
                      {sorted.map((b) => (
                        <li key={b.slug} className="group flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-white/[0.04] transition-colors">
                          <Link
                            href={`/blog/${b.slug}`}
                            onClick={() => setOpen(false)}
                            className="flex-1 min-w-0"
                          >
                            <span className="flex items-center gap-1.5 text-sm text-white/80 group-hover:text-white transition-colors line-clamp-2">
                              {b.title}
                              <ArrowUpRight className="w-3.5 h-3.5 shrink-0 text-white/30 group-hover:text-amber-400 transition-colors" aria-hidden="true" />
                            </span>
                            <span className="text-[11px] font-mono text-white/30">
                              Saved {relativeDate(b.savedAt)}
                            </span>
                          </Link>
                          <button
                            onClick={() => removeBookmark(b.slug)}
                            aria-label={`Remove ${b.title} from reading list`}
                            className="shrink-0 p-1.5 rounded-md text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
