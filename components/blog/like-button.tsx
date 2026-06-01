"use client";

import { useEffect, useState, useTransition, useRef } from "react";
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
  const voterIdRef = useRef<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    voterIdRef.current = getVoterId();
    setMounted(true);
    getReactions(slug, voterIdRef.current).then(setCounts);
  }, [slug]);

  const handleVote = (type: "like" | "dislike") => {
    if (!voterIdRef.current) return;
    startTransition(async () => {
      const updated = await toggleReaction(slug, voterIdRef.current, type);
      setCounts(updated);
    });
  };

  if (!mounted) return null;

  return (
    <div className="inline-flex items-center gap-1 p-1 rounded-xl border border-white/8 bg-white/3">
      {/* Like */}
      <button
        onClick={() => handleVote("like")}
        disabled={isPending}
        aria-label="Like this post"
        aria-pressed={counts.userVote === "like"}
        className={cn(
          "inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-mono transition-all duration-200 disabled:cursor-not-allowed",
          counts.userVote === "like"
            ? "bg-primary/15 text-primary border border-primary/25"
            : "text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent",
        )}
      >
        <ThumbsUp
          className={cn(
            "w-4 h-4 transition-transform",
            counts.userVote === "like" && "scale-110",
            isPending && "opacity-50",
          )}
          aria-hidden="true"
        />
        <span>{counts.likes}</span>
      </button>

      <div className="w-px h-5 bg-white/8" aria-hidden="true" />

      {/* Dislike */}
      <button
        onClick={() => handleVote("dislike")}
        disabled={isPending}
        aria-label="Dislike this post"
        aria-pressed={counts.userVote === "dislike"}
        className={cn(
          "inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-mono transition-all duration-200 disabled:cursor-not-allowed",
          counts.userVote === "dislike"
            ? "bg-red-500/15 text-red-400 border border-red-500/25"
            : "text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent",
        )}
      >
        <ThumbsDown
          className={cn(
            "w-4 h-4 transition-transform",
            counts.userVote === "dislike" && "scale-110",
            isPending && "opacity-50",
          )}
          aria-hidden="true"
        />
        <span>{counts.dislikes}</span>
      </button>
    </div>
  );
}
