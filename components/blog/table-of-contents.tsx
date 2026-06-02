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

export function TableOfContents({
  content,
  commentCount,
}: {
  content: string;
  commentCount?: number;
}) {
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
    <nav aria-label="Table of contents" className="flex flex-col min-h-0 flex-1">
      {/* Fixed label — never scrolls */}
      <p className="text-xs font-mono text-white/50 uppercase tracking-widest mb-3 flex-shrink-0">
        On this page
      </p>

      {/* Scrollable links */}
      <div className="flex-1 overflow-y-auto overscroll-contain space-y-0.5 pr-1 toc-scroll">
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
                : "text-white/55 hover:text-white/90",
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
      </div>

      {/* Fixed footer — never scrolls */}
      <div className="pt-4 mt-4 border-t border-white/6 flex-shrink-0">
        <a
          href="#comments"
          className="flex items-center gap-2 text-sm text-white/55 hover:text-primary transition-colors py-0.5"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("comments")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          {commentCount != null
            ? `${commentCount} comment${commentCount !== 1 ? "s" : ""}`
            : "Comments"}
        </a>
      </div>
    </nav>
  );
}
