"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackPageView } from "@/app/actions/analytics";

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
      // Call server action instead of client-side fetch
      trackPageView(pathname, visitorId, document.referrer).catch(() => {});
    } catch {
      // silently ignore
    }
  }, [pathname]);

  return null;
}
