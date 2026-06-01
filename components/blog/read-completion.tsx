"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

interface ReadCompletionProps {
  slug: string;
  title: string;
}

export function ReadCompletion({ slug, title }: ReadCompletionProps) {
  const firedRef  = useRef(false);
  const seenTopRef = useRef(false); // user must scroll near-top before we start tracking

  useEffect(() => {
    // Reset both guards whenever the post changes
    firedRef.current   = false;
    seenTopRef.current = false;

    const key = `read_done_${slug}`;
    const alreadyToasted = !!localStorage.getItem(key);

    const check = () => {
      if (firedRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const progress = scrollTop / (scrollHeight - clientHeight);

      // Mark that the reader reached the top of THIS page (< 15% = near top)
      if (progress < 0.15) {
        seenTopRef.current = true;
      }

      // Only fire if: the user was at the top first AND now reached 88%
      if (seenTopRef.current && progress >= 0.88) {
        firedRef.current = true;
        window.removeEventListener("scroll", check);

        if (!alreadyToasted) {
          localStorage.setItem(key, "1");
          toast.success("Article completed", {
            description: `You finished reading "${title}"`,
            duration: 4000,
            icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
          });
        }
      }
    };

    // Delay attaching the listener by 600ms so Next.js scroll restoration
    // completes before we start observing — prevents false positives on navigation
    const timer = setTimeout(() => {
      window.addEventListener("scroll", check, { passive: true });
    }, 600);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", check);
    };
  }, [slug, title]);

  return null;
}
