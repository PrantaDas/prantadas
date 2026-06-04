import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  Code2,
  BookOpen,
  Compass,
  Coffee,
} from "lucide-react";

const BASE_URL = "https://prantadas.dev";

// Update this when reality changes. Page-level lastModified flows into SEO.
const LAST_UPDATED = "2026-06-04";

export const metadata: Metadata = {
  title: "Now — What I'm Working On",
  description:
    "What I'm currently building, learning, and reading. Updated regularly. Inspired by Derek Sivers' /now movement.",
  alternates: { canonical: `${BASE_URL}/now` },
  openGraph: {
    title: "Now — Pranta Das",
    description: "What I'm currently building, learning, and reading.",
    url: `${BASE_URL}/now`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Now — Pranta Das",
    description: "What I'm currently building, learning, and reading.",
  },
};

function PanelHeader({
  icon: Icon,
  label,
  title,
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  label: string;
  title: string;
}) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="w-9 h-9 rounded-lg bg-primary/8 border border-primary/15 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-primary/80" aria-hidden />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-primary/60 mb-1">
          {label}
        </div>
        <h2 className="font-display text-lg sm:text-xl font-bold text-white/90 leading-tight">
          {title}
        </h2>
      </div>
    </div>
  );
}

export default function NowPage() {
  const formattedDate = new Date(LAST_UPDATED).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main className="min-h-screen bg-background noise-overlay">
      {/* Top nav */}
      <nav
        className="sticky top-0 z-40 border-b border-white/5 bg-background/80 backdrop-blur-md"
        aria-label="Page navigation"
      >
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/45 hover:text-white/80 transition-colors text-sm font-mono group"
            aria-label="Back to home"
          >
            <ArrowLeft
              className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5"
              aria-hidden
            />
            Home
          </Link>
          <span className="text-white/20 text-xs font-mono tracking-widest uppercase">
            Now
          </span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
        {/* Header */}
        <header className="mb-14 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/8 border border-primary/15 text-primary text-xs font-mono mb-5 uppercase tracking-widest">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
            </span>
            Live snapshot
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
            What I&apos;m doing <span className="gradient-text-cyan">now</span>
          </h1>
          <p className="text-white/50 text-base md:text-lg leading-relaxed">
            A snapshot of the work, learning and side-quests filling my days
            right now. This page exists so anyone curious can see the current
            state — not what I&apos;m proud of historically, but what&apos;s
            actually on my desk this week.
          </p>
          <p className="text-xs font-mono text-white/30 mt-4">
            Last updated {formattedDate}
          </p>
        </header>

        {/* Panels */}
        <div className="grid md:grid-cols-2 gap-5">
          {/* Building */}
          <section
            aria-label="Currently building"
            className="md:col-span-2 glass-card rounded-2xl border border-white/5 p-6 sm:p-7"
          >
            <PanelHeader
              icon={Sparkles}
              label="Building"
              title="StampEzee — multi-vendor digital loyalty platform"
            />
            <div className="pl-12 space-y-4 text-white/55 leading-relaxed text-[15px]">
              <p>
                Designing and shipping <span className="text-white/85">StampEzee</span>,
                a digital loyalty program that multiple vendors can plug into
                from a single platform. Customers collect stamps across
                participating merchants; merchants get a configurable program
                without rebuilding the loyalty layer themselves.
              </p>
              <p>
                Current focus: vendor onboarding flow, stamp issuance/redemption
                APIs, and the analytics surface merchants need to understand
                which campaigns actually move customers.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {[
                  "Node.js",
                  "TypeScript",
                  "PostgreSQL",
                  "Redis",
                  "Multi-tenant",
                  "REST API",
                ].map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center px-2.5 py-1 rounded-md bg-white/4 border border-white/8 text-[11px] font-mono text-white/55"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Learning */}
          <section
            aria-label="Currently learning"
            className="glass-card rounded-2xl border border-white/5 p-6 sm:p-7"
          >
            <PanelHeader
              icon={Code2}
              label="Learning"
              title="Go"
            />
            <div className="pl-12 space-y-3 text-white/55 leading-relaxed text-[15px]">
              <p>
                Picking up Go to extend my backend toolbox beyond Node. Drawn in
                by its concurrency model, predictable runtime cost, and the way
                idiomatic Go forces simpler service designs.
              </p>
              <p className="text-white/45 text-sm">
                Working through the std library, building small services from
                scratch instead of frameworks, and porting bits of older Node
                utilities to see the contrast first-hand.
              </p>
            </div>
          </section>

          {/* Reading / writing */}
          <section
            aria-label="Reading and writing"
            className="glass-card rounded-2xl border border-white/5 p-6 sm:p-7"
          >
            <PanelHeader
              icon={BookOpen}
              label="Reading & writing"
              title="Distributed systems + engineering essays"
            />
            <div className="pl-12 space-y-3 text-white/55 leading-relaxed text-[15px]">
              <p>
                Reading deep on distributed systems patterns and database
                internals — material that pays back for years, not weeks.
              </p>
              <p className="text-white/45 text-sm">
                Writing on{" "}
                <Link href="/blog" className="text-primary/80 hover:text-primary underline underline-offset-2">
                  the blog
                </Link>{" "}
                when something clarifies in my head and feels worth a write-up.
              </p>
            </div>
          </section>

          {/* Direction */}
          <section
            aria-label="Direction"
            className="glass-card rounded-2xl border border-white/5 p-6 sm:p-7"
          >
            <PanelHeader
              icon={Compass}
              label="Direction"
              title="Deeper, not wider"
            />
            <div className="pl-12 space-y-3 text-white/55 leading-relaxed text-[15px]">
              <p>
                Saying no to surface-level project hopping. Compounding on the
                stack I already know well — Node, TypeScript, Postgres, queues
                — while adding Go as a deliberate second lens.
              </p>
              <p className="text-white/45 text-sm">
                Lead the backend team at Root Devs by day, ship side work like
                StampEzee on the side, treat the blog as the long-form
                portfolio.
              </p>
            </div>
          </section>

          {/* Off hours */}
          <section
            aria-label="Off hours"
            className="glass-card rounded-2xl border border-white/5 p-6 sm:p-7"
          >
            <PanelHeader
              icon={Coffee}
              label="Off hours"
              title="Decompression"
            />
            <div className="pl-12 space-y-3 text-white/55 leading-relaxed text-[15px]">
              <p>
                Casual gaming on the iPad to flush the work tabs out of my
                head, the occasional long coffee, and time off-screen so the
                next morning starts sharp.
              </p>
            </div>
          </section>
        </div>

        {/* Inspiration footer */}
        <div className="mt-16 pt-10 border-t border-white/[0.06] flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <p className="text-xs font-mono text-white/35">
            /now-style page —{" "}
            <a
              href="https://nownownow.com/about"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary/70 hover:text-primary underline underline-offset-2"
            >
              what is this?
            </a>
          </p>
          <Link
            href="/uses"
            className="inline-flex items-center gap-2 text-sm font-mono text-primary/80 hover:text-primary transition-colors group"
          >
            See my stack at /uses
            <span className="transition-transform group-hover:translate-x-0.5" aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
