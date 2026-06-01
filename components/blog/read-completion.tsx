"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

interface ReadCompletionProps {
  slug: string;
  title: string;
}

export function ReadCompletion({ slug, title }: ReadCompletionProps) {
  const firedRef = useRef(false);

  useEffect(() => {
    const key = `read_done_${slug}`;
    // Already completed in a previous session — still track silently, just don't toast again
    const alreadyToasted = !!localStorage.getItem(key);

    const check = () => {
      if (firedRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      const progress = scrollTop / (scrollHeight - clientHeight);
      if (progress >= 0.88) {
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

    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, [slug, title]);

  return null;
}
