"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";

interface Bookmark {
  slug: string;
  title: string;
  savedAt: string;
}

const KEY = "blog_bookmarks";

function getBookmarks(): Bookmark[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

interface BookmarkButtonProps {
  slug: string;
  title: string;
}

export function BookmarkButton({ slug, title }: BookmarkButtonProps) {
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setSaved(getBookmarks().some((b) => b.slug === slug));
  }, [slug]);

  const toggle = () => {
    const bookmarks = getBookmarks();
    if (saved) {
      localStorage.setItem(KEY, JSON.stringify(bookmarks.filter((b) => b.slug !== slug)));
      setSaved(false);
      toast("Bookmark removed", { icon: "🗑️", duration: 2000 });
    } else {
      bookmarks.push({ slug, title, savedAt: new Date().toISOString() });
      localStorage.setItem(KEY, JSON.stringify(bookmarks));
      setSaved(true);
      toast.success("Bookmarked!", {
        description: "Saved to your reading list",
        duration: 2500,
      });
    }
  };

  if (!mounted) return null;

  return (
    <motion.button
      onClick={toggle}
      whileTap={{ scale: 0.88 }}
      aria-label={saved ? "Remove bookmark" : "Bookmark this post"}
      aria-pressed={saved}
      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border text-sm font-mono transition-all duration-200 ${
        saved
          ? "bg-amber-400/10 border-amber-400/25 text-amber-400"
          : "bg-white/3 border-white/8 text-white/40 hover:text-white/70 hover:border-white/15"
      }`}
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
  );
}
