"use client";

import { useState, useEffect } from "react";
import { Link2, Check, Linkedin, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

const BASE_URL = "https://prantadas.vercel.app";

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  const url = `${BASE_URL}/blog/${slug}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  // Detect native share support after mount to avoid hydration mismatch.
  useEffect(() => {
    setCanNativeShare(
      typeof navigator !== "undefined" && typeof navigator.share === "function",
    );
  }, []);

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const nativeShare = async () => {
    try {
      await navigator.share({ title, text: title, url });
    } catch {
      // user cancelled or share failed — no-op
    }
  };

  const btnClass =
    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/8 bg-white/3 text-white/55 hover:text-white/85 hover:border-white/15 hover:bg-white/6 transition-all text-xs font-mono";

  return (
    <div className="flex flex-wrap items-center gap-2 mt-10 pt-6 border-t border-white/6">
      <span className="text-xs font-mono text-white/50 mr-1">Share</span>

      {/* X / Twitter */}
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&via=prantadas`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
        className={btnClass}
      >
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
        </svg>
        X
      </a>

      {/* LinkedIn */}
      <a
        href={`https://linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className={btnClass}
      >
        <Linkedin className="w-3.5 h-3.5" aria-hidden="true" />
        LinkedIn
      </a>

      {/* Hacker News */}
      <a
        href={`https://news.ycombinator.com/submitlink?u=${encodedUrl}&t=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Submit to Hacker News"
        className={btnClass}
      >
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
          <path d="M12.7 13.6v4.4h-1.5v-4.4L7.3 6h1.7l3 5.6L15 6h1.6l-3.9 7.6z" />
        </svg>
        HN
      </a>

      {/* Reddit */}
      <a
        href={`https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Reddit"
        className={btnClass}
      >
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.01 11.07c.02.16.03.32.03.49 0 2.5-2.91 4.53-6.5 4.53s-6.5-2.03-6.5-4.53c0-.17.01-.33.03-.49a1.4 1.4 0 1 1 1.62-2.22 7.9 7.9 0 0 1 4.13-1.3l.78-3.66 2.54.54a1.1 1.1 0 1 1-.16.72l-2.02-.43-.68 3.2c1.5.06 2.87.5 3.92 1.18a1.4 1.4 0 1 1 1.46 2.47zM9.25 12.5a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2zm5.5 0a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2zm-2.75 4.46c-.86 0-1.67-.13-2.36-.36-.16-.05-.33.04-.38.2s.04.33.2.38c.78.26 1.66.4 2.54.4s1.76-.14 2.54-.4c.16-.05.25-.22.2-.38s-.22-.25-.38-.2c-.69.23-1.5.36-2.36.36z" />
        </svg>
        Reddit
      </a>

      {/* Copy link */}
      <button
        onClick={copyLink}
        aria-label="Copy link"
        className={cn(btnClass, copied && "border-emerald-500/30 text-emerald-400 bg-emerald-500/5")}
      >
        {copied ? (
          <Check className="w-3.5 h-3.5" aria-hidden="true" />
        ) : (
          <Link2 className="w-3.5 h-3.5" aria-hidden="true" />
        )}
        {copied ? "Copied!" : "Copy link"}
      </button>

      {/* Native share — mobile / supported browsers only */}
      {canNativeShare && (
        <button onClick={nativeShare} aria-label="More sharing options" className={btnClass}>
          <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
          More
        </button>
      )}
    </div>
  );
}
