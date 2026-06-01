"use client";

import { useEffect, useState, useTransition, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleReaction, getReactions, type ReactionCounts } from "@/app/actions/reactions";

function getVoterId(): string {
  const key = "portfolio_voter_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

function socialProof(likes: number): string | null {
  if (likes === 0) return null;
  if (likes === 1) return "1 person found this helpful";
  if (likes < 10) return `${likes} people found this helpful`;
  return `${likes.toLocaleString()} people found this helpful`;
}

interface LikeButtonProps {
  slug: string;
}

export function LikeButton({ slug }: LikeButtonProps) {
  const [counts, setCounts] = useState<ReactionCounts>({
    likes: 0,
    dislikes: 0,
    userVote: null,
  });
  const [isPending, startTransition] = useTransition();
  const [burst, setBurst] = useState<"like" | "dislike" | null>(null);
  const voterIdRef = useRef<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    voterIdRef.current = getVoterId();
    setMounted(true);
    getReactions(slug, voterIdRef.current).then(setCounts);
  }, [slug]);

  const handleVote = (type: "like" | "dislike") => {
    if (!voterIdRef.current) return;
    setBurst(type);
    setTimeout(() => setBurst(null), 600);
    startTransition(async () => {
      const updated = await toggleReaction(slug, voterIdRef.current, type);
      setCounts(updated);
    });
  };

  if (!mounted) return null;

  const proof = socialProof(counts.likes);

  return (
    <div className="flex flex-col gap-2">
      <div className="inline-flex items-center gap-1 p-1 rounded-xl border border-white/8 bg-white/3">
        {/* Like */}
        <motion.button
          onClick={() => handleVote("like")}
          disabled={isPending}
          aria-label="Like this post"
          aria-pressed={counts.userVote === "like"}
          whileTap={{ scale: 0.9 }}
          className={cn(
            "relative inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-mono transition-all duration-200 disabled:cursor-not-allowed overflow-hidden",
            counts.userVote === "like"
              ? "bg-primary/15 text-primary border border-primary/25"
              : "text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent",
          )}
        >
          {/* Burst ring on click */}
          <AnimatePresence>
            {burst === "like" && (
              <motion.span
                key="like-burst"
                className="absolute inset-0 rounded-lg border-2 border-primary/60 pointer-events-none"
                initial={{ opacity: 0.8, scale: 0.85 }}
                animate={{ opacity: 0, scale: 1.4 }}
                exit={{}}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            )}
          </AnimatePresence>

          <motion.span
            animate={
              counts.userVote === "like"
                ? { scale: [1, 1.35, 1], rotate: [0, -12, 0] }
                : { scale: 1, rotate: 0 }
            }
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <ThumbsUp
              className={cn("w-4 h-4", isPending && "opacity-50")}
              aria-hidden="true"
            />
          </motion.span>

          <motion.span
            key={counts.likes}
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {counts.likes}
          </motion.span>
        </motion.button>

        <div className="w-px h-5 bg-white/8" aria-hidden="true" />

        {/* Dislike */}
        <motion.button
          onClick={() => handleVote("dislike")}
          disabled={isPending}
          aria-label="Dislike this post"
          aria-pressed={counts.userVote === "dislike"}
          whileTap={{ scale: 0.9 }}
          className={cn(
            "relative inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-mono transition-all duration-200 disabled:cursor-not-allowed overflow-hidden",
            counts.userVote === "dislike"
              ? "bg-red-500/15 text-red-400 border border-red-500/25"
              : "text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent",
          )}
        >
          <AnimatePresence>
            {burst === "dislike" && (
              <motion.span
                key="dislike-burst"
                className="absolute inset-0 rounded-lg border-2 border-red-400/50 pointer-events-none"
                initial={{ opacity: 0.8, scale: 0.85 }}
                animate={{ opacity: 0, scale: 1.4 }}
                exit={{}}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            )}
          </AnimatePresence>

          <motion.span
            animate={
              counts.userVote === "dislike"
                ? { scale: [1, 1.35, 1], rotate: [0, 12, 0] }
                : { scale: 1, rotate: 0 }
            }
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <ThumbsDown
              className={cn("w-4 h-4", isPending && "opacity-50")}
              aria-hidden="true"
            />
          </motion.span>

          <motion.span
            key={counts.dislikes}
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {counts.dislikes}
          </motion.span>
        </motion.button>
      </div>

      {/* Social proof */}
      <AnimatePresence>
        {proof && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-[11px] font-mono text-white/25 pl-1"
          >
            {proof}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
