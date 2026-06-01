"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function getVisitorId(): string {
  const key = "portfolio_vid";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

export function TrackVisit() {
  const pathname = usePathname();

  useEffect(() => {
    // Skip admin routes
    if (pathname.startsWith("/admin")) return;

    try {
      const visitorId = getVisitorId();
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: pathname,
          visitorId,
          referrer: document.referrer,
        }),
      }).catch(() => {});
    } catch {
      // silently ignore
    }
  }, [pathname]);

  return null;
}
