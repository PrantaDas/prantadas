"use client";

import Link from "next/link";
import { Github, Linkedin, Rss, ArrowUp } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "/", external: false },
  { label: "All Articles", href: "/blog", external: false },
  { label: "Now", href: "/now", external: false },
  { label: "Uses", href: "/uses", external: false },
  { label: "Contact", href: "/#contact", external: false },
  { label: "RSS", href: "/api/rss", external: true },
];

const SOCIAL = [
  { label: "GitHub", href: "https://github.com/Prantadas", Icon: Github },
  { label: "LinkedIn", href: "https://linkedin.com/in/pranta-das7", Icon: Linkedin },
];

/**
 * Editorial "colophon" footer for the journal surfaces. Deliberately lighter
 * than the homepage SiteFooter — a sign-off, a few quiet links, and a baseline
 * row — so it closes the reading experience without competing with it.
 *
 * `widthClass` keeps the footer aligned with each page's content column
 * (max-w-6xl on the listing, max-w-5xl on a post).
 */
export function BlogFooter({ widthClass = "max-w-5xl" }: { widthClass?: string }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/[0.06] mt-8">
      <div className={`${widthClass} mx-auto px-6 py-14 sm:py-16`}>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-10">
          {/* Colophon */}
          <div className="max-w-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-primary/70 whitespace-nowrap">
                The Engineering Journal
              </span>
              <span className="h-px flex-1 bg-gradient-to-r from-primary/25 to-transparent" />
            </div>
            <p className="font-display text-lg font-semibold text-white/90">
              Pranta Das
            </p>
            <p className="text-sm text-white/55 leading-relaxed mt-1.5">
              Backend engineer &amp; team lead writing about systems,
              architecture, and the craft — from Dhaka, Bangladesh 🇧🇩.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-5 sm:items-end">
            <nav
              className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs"
              aria-label="Footer navigation"
            >
              {NAV_LINKS.map(({ label, href, external }) => (
                <Link
                  key={label}
                  href={href}
                  {...(external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="inline-flex items-center gap-1.5 text-white/55 hover:text-primary transition-colors"
                >
                  {label === "RSS" && (
                    <Rss className="w-3 h-3" aria-hidden="true" />
                  )}
                  {label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-4">
              {SOCIAL.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  {...(href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  aria-label={label}
                  className="text-white/50 hover:text-white/85 transition-colors"
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Baseline */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 text-xs font-mono text-white/45">
          <span>© {year} Pranta Das. All rights reserved.</span>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-1.5 hover:text-primary transition-colors"
          >
            Back to top
            <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
}
