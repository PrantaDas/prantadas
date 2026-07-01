"use client";

import Link from "next/link";
import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log to error reporting service if available
    console.error("[GlobalError]", error.digest ?? "No digest");
  }, [error]);

  return (
    <div className="relative min-h-screen bg-[#070b12] flex flex-col items-center justify-center overflow-hidden px-6">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.05),transparent_70%)] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-lg">
        {/* Icon */}
        <div className="mx-auto mb-6 w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/15 flex items-center justify-center">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-purple-400"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        {/* Divider */}
        <div className="mx-auto mb-6 w-16 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

        <h1 className="text-xl md:text-2xl font-display font-semibold text-white/80 mb-3">
          Something went wrong
        </h1>
        <p className="text-white/62 text-sm md:text-base leading-relaxed mb-10">
          An unexpected error occurred. This has been noted. You can try again
          or return to the homepage.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-mono hover:bg-purple-500/15 hover:border-purple-500/35 transition-all duration-200"
          >
            ↺ Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/8 text-white/68 text-sm font-mono hover:border-white/15 hover:text-white/75 transition-all duration-200"
          >
            ← Return Home
          </Link>
        </div>

        <p className="mt-12 font-mono text-xs text-white/45 select-none">
          // Unexpected error — no details exposed
        </p>
      </div>
    </div>
  );
}
