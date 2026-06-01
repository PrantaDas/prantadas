"use client";

import { useState } from "react";
import { Link2, Check, Linkedin } from "lucide-react";
import { cn } from "@/lib/utils";

const BASE_URL = "https://prantadas.vercel.app";

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const url = `${BASE_URL}/blog/${slug}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const btnClass =
    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/8 bg-white/3 text-white/40 hover:text-white/70 hover:border-white/15 hover:bg-white/6 transition-all text-xs font-mono";

  return (
    <div className="flex flex-wrap items-center gap-2 mt-10 pt-6 border-t border-white/6">
      <span className="text-xs font-mono text-white/25 mr-1">Share</span>

      {/* X / Twitter */}
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&via=prantadas`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
        className={btnClass}
      >
        <svg
          viewBox="0 0 24 24"
          className="w-3.5 h-3.5 fill-current"
          aria-hidden="true"
        >
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
    </div>
  );
}
