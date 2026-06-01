"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

function extractToc(content: string): TocItem[] {
  const headingRe = /^(#{1,4})\s+(.+)$/gm;
  const items: TocItem[] = [];
  let match: RegExpExecArray | null;

  while ((match = headingRe.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].replace(/[*_`]/g, "").trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    items.push({ id, text, level });
  }
  return items;
}

export function TableOfContents({ content }: { content: string }) {
  const items = extractToc(content);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const headings = document.querySelectorAll<HTMLElement>(
      "article h1, article h2, article h3, article h4",
    );

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-20% 0% -70% 0%" },
    );

    headings.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  if (items.length < 3) return null;

  return (
    <nav aria-label="Table of contents" className="space-y-1">
      <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-3">
        On this page
      </p>
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={cn(
            "block text-sm leading-snug transition-colors py-0.5",
            item.level === 1 && "pl-0",
            item.level === 2 && "pl-0",
            item.level === 3 && "pl-4",
            item.level === 4 && "pl-7",
            active === item.id
              ? "text-primary"
              : "text-white/40 hover:text-white/70",
          )}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(item.id)?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }}
        >
          {item.text}
        </a>
      ))}
    </nav>
  );
}
