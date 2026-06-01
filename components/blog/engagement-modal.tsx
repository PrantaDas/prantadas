"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageSquare, ThumbsUp, BookOpen } from "lucide-react";

interface EngagementModalProps {
  slug: string;
  title: string;
}

const storageKey = (slug: string) => `engagement_shown_${slug}`;
// Show after 5 minutes of reading, or when cursor exits window top
const TRIGGER_DELAY_MS = 5 * 60 * 1000;

export function EngagementModal({ slug, title }: EngagementModalProps) {
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shownRef = useRef(false);

  const trigger = () => {
    if (shownRef.current) return;
    const key = storageKey(slug);
    // Don't show again for 24 h on the same post
    const last = localStorage.getItem(key);
    if (last && Date.now() - Number(last) < 7 * 24 * 60 * 60 * 1000) return;
    shownRef.current = true;
    localStorage.setItem(key, String(Date.now()));
    setOpen(true);
  };

  useEffect(() => {
    // Timer trigger — 2 minutes
    timerRef.current = setTimeout(trigger, TRIGGER_DELAY_MS);

    // Intent-to-leave — cursor exits viewport from the top
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) trigger();
    };
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const scrollToComments = () => {
    setOpen(false);
    setTimeout(() => {
      document.getElementById("comments")?.scrollIntoView({ behavior: "smooth" });
      // Also open the form toggle if it's closed
      const formToggle = document.querySelector<HTMLButtonElement>("[data-comment-toggle]");
      formToggle?.click();
    }, 300);
  };

  const handleLike = () => {
    setOpen(false);
    // Click the like button if it exists on the page
    const likeBtn = document.querySelector<HTMLButtonElement>("[aria-label='Like this post']");
    likeBtn?.click();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9980] flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0"
          onClick={() => setOpen(false)}
        >
          {/* Soft backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-md glass-card rounded-2xl border border-white/10 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top accent */}
            <div className="h-[2px] bg-gradient-to-r from-primary/60 via-violet-400/40 to-transparent" />

            <div className="p-6">
              {/* Dismiss */}
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 text-white/25 hover:text-white/60 transition-colors"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-primary/70" />
                </div>
                <div>
                  <p className="text-xs font-mono text-white/35 mb-0.5">You&apos;ve been reading</p>
                  <h3 className="text-sm font-semibold text-white/85 line-clamp-1">{title}</h3>
                </div>
              </div>

              <p className="text-sm text-white/55 leading-relaxed mb-6">
                What do you think? Your feedback helps me write better content.
              </p>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <motion.button
                  onClick={handleLike}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-primary/20 bg-primary/6 hover:bg-primary/12 hover:border-primary/35 transition-all group"
                >
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <ThumbsUp className="w-4 h-4 text-primary/70 group-hover:text-primary transition-colors" />
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-white/75">Liked it!</div>
                    <div className="text-[11px] font-mono text-white/35">Hit the like button</div>
                  </div>
                </motion.button>

                <motion.button
                  onClick={scrollToComments}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-violet-400/20 bg-violet-400/5 hover:bg-violet-400/10 hover:border-violet-400/30 transition-all group"
                >
                  <div className="w-9 h-9 rounded-xl bg-violet-400/10 flex items-center justify-center group-hover:bg-violet-400/20 transition-colors">
                    <MessageSquare className="w-4 h-4 text-violet-400/70 group-hover:text-violet-400 transition-colors" />
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-white/75">Leave a comment</div>
                    <div className="text-[11px] font-mono text-white/35">Share your thoughts</div>
                  </div>
                </motion.button>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="w-full text-xs font-mono text-white/25 hover:text-white/45 transition-colors py-1"
              >
                Maybe later
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
