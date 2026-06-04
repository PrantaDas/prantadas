"use client";

import { useEffect } from "react";

export function SmoothScroll() {
  useEffect(() => {
    // Skip on touch — Lenis competes with native momentum scroll on iOS/Android
    // and burns CPU for zero perceived benefit on mobile.
    if (window.matchMedia("(pointer: coarse)").matches) return;
    // Respect prefers-reduced-motion — accessibility + perf win.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let lenis: import("lenis").default | null = null;
    let rafId = 0;
    let destroyed = false;

    // Lazy-load lenis so it isn't in the initial JS bundle.
    import("lenis").then(({ default: Lenis }) => {
      if (destroyed) return;
      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        smoothWheel: true,
      });

      const raf = (time: number) => {
        lenis?.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    });

    return () => {
      destroyed = true;
      cancelAnimationFrame(rafId);
      lenis?.destroy();
    };
  }, []);

  return null;
}
