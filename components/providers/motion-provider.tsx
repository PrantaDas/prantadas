"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Makes every Framer Motion animation in the tree honour the user's
 * `prefers-reduced-motion` setting. `reducedMotion="user"` disables
 * transform/layout animations for those users while keeping opacity
 * transitions, matching the CSS reduced-motion block in globals.css.
 *
 * Wrapping {children} here does NOT turn the tree into client components —
 * server components passed as children remain server-rendered.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
