"use client";

import { useEffect, useState, useTransition, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, ThumbsDown, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleReaction, getReactions, type ReactionCounts } from "@/app/actions/reactions";

const VOTER_KEY = "portfolio_voter_id";

function getVoterId(): string {
  let id = localStorage.getItem(VOTER_KEY);
  if (!id) { id = crypto.randomUUID(); localStorage.setItem(VOTER_KEY, id); }
  return id;
}

function socialProof(likes: number): string | null {
  if (likes === 0) return null;
  if (likes === 1) return "1 person found this helpful";
  if (likes < 10) return `${likes} people found this helpful`;
  return `${likes.toLocaleString()} people found this helpful`;
}

// Particle burst — 6 dots that radiate outward
function LikeParticles({ active }: { active: boolean }) {
  const particles = [0, 60, 120, 180, 240, 300];
  return (
    <AnimatePresence>
      {active && particles.map((deg) => (
        <motion.span
          key={deg}
          className="absolute w-1.5 h-1.5 rounded-full bg-primary pointer-events-none"
          style={{ top: "50%", left: "50%", translateX: "-50%", translateY: "-50%" }}
          initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
          animate={{
            scale: [0, 1, 0],
            opacity: [1, 1, 0],
            x: Math.cos((deg * Math.PI) / 180) * 22,
            y: Math.sin((deg * Math.PI) / 180) * 22,
          }}
          exit={{}}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      ))}
    </AnimatePresence>
  );
}

interface LikeButtonProps {
  slug: string;
}

export function LikeButton({ slug }: LikeButtonProps) {
  const [counts, setCounts] = useState<ReactionCounts>({ likes: 0, dislikes: 0, userVote: null });
  const [, startTransition] = useTransition();
  const [likeBurst, setLikeBurst] = useState(false);
  const [dislikeBurst, setDislikeBurst] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const voterIdRef = useRef<string>("");
  const [mounted, setMounted] = useState(false);
  const thankYouTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    voterIdRef.current = getVoterId();
    setMounted(true);
    getReactions(slug, voterIdRef.current).then(setCounts);
    return () => { if (thankYouTimer.current) clearTimeout(thankYouTimer.current); };
  }, [slug]);

  const handleVote = (type: "like" | "dislike") => {
    if (!voterIdRef.current) return;

    const prev = counts;
    const wasLiked    = prev.userVote === "like";
    const wasDisliked = prev.userVote === "dislike";

    // ── Optimistic update ─────────────────────────────────────────────────────
    const next: ReactionCounts = { ...prev };
    if (type === "like") {
      if (wasLiked)    { next.likes -= 1; next.userVote = null; }
      else             { next.likes += 1; if (wasDisliked) next.dislikes -= 1; next.userVote = "like"; }
    } else {
      if (wasDisliked) { next.dislikes -= 1; next.userVote = null; }
      else             { next.dislikes += 1; if (wasLiked) next.likes -= 1; next.userVote = "dislike"; }
    }
    setCounts(next);

    // ── Animations ────────────────────────────────────────────────────────────
    if (type === "like")    { setLikeBurst(true);    setTimeout(() => setLikeBurst(false), 600); }
    if (type === "dislike") { setDislikeBurst(true); setTimeout(() => setDislikeBurst(false), 600); }

    // ── Thank-you badge (only when newly liking) ──────────────────────────────
    if (type === "like" && !wasLiked) {
      setShowThankYou(true);
      if (thankYouTimer.current) clearTimeout(thankYouTimer.current);
      thankYouTimer.current = setTimeout(() => setShowThankYou(false), 3500);
    }

    // ── Background sync ───────────────────────────────────────────────────────
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

        {/* ── Like ── */}
        <motion.button
          onClick={() => handleVote("like")}
          aria-label="Like this post"
          aria-pressed={counts.userVote === "like"}
          whileTap={{ scale: 0.85 }}
          className={cn(
            "relative inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-mono transition-all duration-150 overflow-visible",
            counts.userVote === "like"
              ? "bg-primary/15 text-primary border border-primary/25"
              : "text-white/62 hover:text-white/70 hover:bg-white/5 border border-transparent",
          )}
        >
          {/* Particles */}
          <LikeParticles active={likeBurst && counts.userVote === "like"} />

          {/* Burst ring */}
          <AnimatePresence>
            {likeBurst && counts.userVote === "like" && (
              <motion.span
                key="like-ring"
                className="absolute inset-0 rounded-lg border-2 border-primary/60 pointer-events-none"
                initial={{ opacity: 0.9, scale: 0.8 }}
                animate={{ opacity: 0, scale: 1.5 }}
                exit={{}}
                transition={{ duration: 0.45, ease: "easeOut" }}
              />
            )}
          </AnimatePresence>

          {/* Icon — YouTube-style jump */}
          <motion.span
            animate={counts.userVote === "like"
              ? { y: [0, -6, 2, -3, 0], scale: [1, 1.3, 0.95, 1.1, 1], rotate: [0, -15, 5, -5, 0] }
              : { y: 0, scale: 1, rotate: 0 }
            }
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <ThumbsUp className="w-4 h-4" aria-hidden="true" />
          </motion.span>

          {/* Count flips up */}
          <motion.span
            key={counts.likes}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.18 }}
          >
            {counts.likes}
          </motion.span>
        </motion.button>

        <div className="w-px h-5 bg-white/8" aria-hidden="true" />

        {/* ── Dislike ── */}
        <motion.button
          onClick={() => handleVote("dislike")}
          aria-label="Dislike this post"
          aria-pressed={counts.userVote === "dislike"}
          whileTap={{ scale: 0.85 }}
          className={cn(
            "relative inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-mono transition-all duration-150 overflow-hidden",
            counts.userVote === "dislike"
              ? "bg-red-500/15 text-red-400 border border-red-500/25"
              : "text-white/62 hover:text-white/70 hover:bg-white/5 border border-transparent",
          )}
        >
          <AnimatePresence>
            {dislikeBurst && (
              <motion.span
                key="dislike-ring"
                className="absolute inset-0 rounded-lg border-2 border-red-400/50 pointer-events-none"
                initial={{ opacity: 0.9, scale: 0.8 }}
                animate={{ opacity: 0, scale: 1.5 }}
                exit={{}}
                transition={{ duration: 0.45, ease: "easeOut" }}
              />
            )}
          </AnimatePresence>

          <motion.span
            animate={counts.userVote === "dislike"
              ? { y: [0, 6, -2, 3, 0], scale: [1, 1.25, 0.95, 1.1, 1] }
              : { y: 0, scale: 1 }
            }
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <ThumbsDown className="w-4 h-4" aria-hidden="true" />
          </motion.span>

          <motion.span
            key={counts.dislikes}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.18 }}
          >
            {counts.dislikes}
          </motion.span>
        </motion.button>
      </div>

      {/* Thank-you acknowledgement */}
      <AnimatePresence>
        {showThankYou && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-primary/20 bg-primary/8 text-xs font-mono text-primary/80 self-start"
          >
            <Heart className="w-3.5 h-3.5 fill-primary text-primary" aria-hidden="true" />
            Thanks for the love!
          </motion.div>
        )}
        {!showThankYou && proof && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-[11px] font-mono text-white/52 pl-1"
          >
            {proof}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
