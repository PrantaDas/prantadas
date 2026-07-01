"use client";

import { useState, useEffect } from "react";
import { Link2, Check, Linkedin, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

const BASE_URL = "https://prantadas.dev";

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

  // Mobile: fixed icon-only squares. sm+: icon + label pills sized to content.
  const chip =
    "inline-flex items-center justify-center gap-1.5 h-10 w-10 sm:h-auto sm:w-auto sm:px-3 sm:py-1.5 rounded-lg border border-white/8 bg-white/3 text-white/74 hover:text-white/90 hover:border-white/15 hover:bg-white/6 transition-all text-xs font-mono";

  return (
    <div className="mt-10 pt-6 border-t border-white/6">
      <span className="block sm:inline text-xs font-mono text-white/68 mb-3 sm:mb-0 sm:mr-3 sm:align-middle">
        Share this article
      </span>

      <div className="flex flex-wrap items-center gap-2 sm:inline-flex sm:align-middle">
        {/* X / Twitter */}
        <a
          href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&via=PrantaD62436311`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on X"
          className={chip}
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-3.5 sm:h-3.5 fill-current" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
          </svg>
          <span className="hidden sm:inline">X</span>
        </a>

        {/* Facebook */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Facebook"
          className={chip}
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-3.5 sm:h-3.5 fill-current" aria-hidden="true">
            <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
          </svg>
          <span className="hidden sm:inline">Facebook</span>
        </a>

        {/* LinkedIn */}
        <a
          href={`https://linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on LinkedIn"
          className={chip}
        >
          <Linkedin className="w-4 h-4 sm:w-3.5 sm:h-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">LinkedIn</span>
        </a>

        {/* Hacker News */}
        <a
          href={`https://news.ycombinator.com/submitlink?u=${encodedUrl}&t=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Submit to Hacker News"
          className={chip}
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-3.5 sm:h-3.5 fill-current" aria-hidden="true">
            <path d="M12.7 13.6v4.4h-1.5v-4.4L7.3 6h1.7l3 5.6L15 6h1.6l-3.9 7.6z" />
          </svg>
          <span className="hidden sm:inline">HN</span>
        </a>

        {/* Reddit */}
        <a
          href={`https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Reddit"
          className={chip}
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-3.5 sm:h-3.5 fill-current" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.01 11.07c.02.16.03.32.03.49 0 2.5-2.91 4.53-6.5 4.53s-6.5-2.03-6.5-4.53c0-.17.01-.33.03-.49a1.4 1.4 0 1 1 1.62-2.22 7.9 7.9 0 0 1 4.13-1.3l.78-3.66 2.54.54a1.1 1.1 0 1 1-.16.72l-2.02-.43-.68 3.2c1.5.06 2.87.5 3.92 1.18a1.4 1.4 0 1 1 1.46 2.47zM9.25 12.5a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2zm5.5 0a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2zm-2.75 4.46c-.86 0-1.67-.13-2.36-.36-.16-.05-.33.04-.38.2s.04.33.2.38c.78.26 1.66.4 2.54.4s1.76-.14 2.54-.4c.16-.05.25-.22.2-.38s-.22-.25-.38-.2c-.69.23-1.5.36-2.36.36z" />
          </svg>
          <span className="hidden sm:inline">Reddit</span>
        </a>

        {/* Copy link */}
        <button
          onClick={copyLink}
          aria-label={copied ? "Link copied" : "Copy link"}
          className={cn(chip, copied && "border-emerald-500/30 text-emerald-400 bg-emerald-500/5 hover:text-emerald-400")}
        >
          {copied ? (
            <Check className="w-4 h-4 sm:w-3.5 sm:h-3.5" aria-hidden="true" />
          ) : (
            <Link2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" aria-hidden="true" />
          )}
          <span className="hidden sm:inline">{copied ? "Copied!" : "Copy link"}</span>
        </button>

        {/* Native share — mobile / supported browsers only */}
        {canNativeShare && (
          <button onClick={nativeShare} aria-label="More sharing options" className={chip}>
            <Share2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">More</span>
          </button>
        )}
      </div>
    </div>
  );
}
