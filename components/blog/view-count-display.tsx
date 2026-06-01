"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getPostViews } from "@/app/actions/views";
import { Eye } from "lucide-react";

export function ViewCountDisplay({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount);
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname.startsWith("/blog/")) return;
    const slug = pathname.split("/").pop();
    if (!slug) return;

    let cancelled = false;

    // Wait for TrackVisit to write to DB then fetch fresh count
    const timer = setTimeout(async () => {
      try {
        const fresh = await getPostViews(slug);
        if (!cancelled) setCount(fresh);
      } catch {
        // keep initial count on error
      }
    }, 1200); // 1.2s is enough for the server action write + network round-trip

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [pathname]); // only re-run when navigating to a different post

  return (
    <div className="flex items-center gap-1.5 text-white/40">
      <Eye className="w-4 h-4" aria-hidden="true" />
      <span>{count.toLocaleString()}</span>
      <span>{count === 1 ? "view" : "views"}</span>
    </div>
  );
}
