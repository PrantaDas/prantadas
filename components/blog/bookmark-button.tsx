"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  addBookmark,
  removeBookmark,
  isBookmarked,
  BOOKMARKS_EVENT,
} from "@/lib/bookmarks";

interface BookmarkButtonProps {
  slug: string;
  title: string;
}

export function BookmarkButton({ slug, title }: BookmarkButtonProps) {
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setSaved(isBookmarked(slug));
    // Stay in sync if the reading list removes this post elsewhere.
    const sync = () => setSaved(isBookmarked(slug));
    window.addEventListener(BOOKMARKS_EVENT, sync);
    return () => window.removeEventListener(BOOKMARKS_EVENT, sync);
  }, [slug]);

  const toggle = () => {
    if (saved) {
      removeBookmark(slug);
      setSaved(false);
      toast("Bookmark removed", { icon: "🗑️", duration: 2000 });
    } else {
      addBookmark(slug, title);
      setSaved(true);
      toast.success("Bookmarked!", {
        description: "Saved to your reading list",
        duration: 2500,
      });
    }
  };

  if (!mounted) return null;

  return (
    // Mirror the like/dislike control's chrome (p-1 rounded-xl shell) so the two
    // sit side by side as a matched pair, same height and corner radius.
    <div className="inline-flex items-center p-1 rounded-xl border border-white/8 bg-white/3">
      <motion.button
        onClick={toggle}
        whileTap={{ scale: 0.88 }}
        aria-label={saved ? "Remove bookmark" : "Bookmark this post"}
        aria-pressed={saved}
        className={cn(
          "inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-mono transition-all duration-200",
          saved
            ? "bg-amber-400/15 text-amber-400 border border-amber-400/25"
            : "text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent",
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          {saved ? (
            <motion.span
              key="saved"
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.5 }}
              transition={{ duration: 0.18, type: "spring", stiffness: 400 }}
            >
              <BookmarkCheck className="w-4 h-4" aria-hidden="true" />
            </motion.span>
          ) : (
            <motion.span
              key="unsaved"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              transition={{ duration: 0.15 }}
            >
              <Bookmark className="w-4 h-4" aria-hidden="true" />
            </motion.span>
          )}
        </AnimatePresence>
        {saved ? "Saved" : "Save"}
      </motion.button>
    </div>
  );
}
