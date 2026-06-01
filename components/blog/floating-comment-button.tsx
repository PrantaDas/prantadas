"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare } from "lucide-react";

interface FloatingCommentButtonProps {
  commentCount: number;
}

export function FloatingCommentButton({ commentCount }: FloatingCommentButtonProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const check = () => {
      const comments = document.getElementById("comments");
      if (!comments) return;
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const progress = scrollTop / (scrollHeight - clientHeight);
      // Show after 30% scroll, hide once comments section is in view
      const commentsTop = comments.getBoundingClientRect().top;
      setVisible(progress > 0.3 && commentsTop > clientHeight);
    };
    window.addEventListener("scroll", check, { passive: true });
    check();
    return () => window.removeEventListener("scroll", check);
  }, []);

  const scrollToComments = () => {
    document.getElementById("comments")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.7, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 8 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          onClick={scrollToComments}
          aria-label={`Jump to comments (${commentCount})`}
          className="fixed bottom-20 right-6 z-50 flex items-center gap-2 px-3.5 py-2.5 rounded-full border border-primary/25 bg-background/90 backdrop-blur-md text-primary/70 hover:text-primary hover:border-primary/50 hover:bg-primary/10 transition-colors shadow-lg text-xs font-mono"
        >
          <MessageSquare className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
          {commentCount > 0 ? `${commentCount} comment${commentCount !== 1 ? "s" : ""}` : "Comment"}
        </motion.button>
      )}
    </AnimatePresence>
  );
}
