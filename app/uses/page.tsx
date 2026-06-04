import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Laptop,
  Monitor,
  Smartphone,
  Tablet,
  Terminal as TerminalIcon,
  Wrench,
  Code2,
  Gamepad2,
} from "lucide-react";

const BASE_URL = "https://prantadas.dev";

export const metadata: Metadata = {
  title: "Uses — Hardware, Software & Daily Driver Stack",
  description:
    "What I use day-to-day to build software: machines, editors, terminals, browsers, and tools. A living inventory.",
  alternates: { canonical: `${BASE_URL}/uses` },
  openGraph: {
    title: "Uses — Pranta Das",
    description:
      "Hardware, OS, editors, terminals and daily-driver tools I use to build software.",
    url: `${BASE_URL}/uses`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Uses — Pranta Das",
    description: "Hardware, OS, editors, terminals and daily-driver tools.",
  },
};

interface Item {
  name: string;
  detail?: string;
  note?: string;
}

interface Group {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  intro?: string;
  items: Item[];
}

const machines: Group = {
  id: "machines",
  title: "Machines",
  icon: Laptop,
  intro: "One driver per context. Backend work on the Mac, Linux for VMs, Windows for games and Office stuff.",
  items: [
    {
      name: "MacBook Air M3",
      detail: "Primary dev machine",
      note: "Where almost all backend, blog writing and design work happens. Quiet, fast, all-day battery.",
    },
    {
      name: "Lenovo ThinkPad",
      detail: "Linux — secondary dev box",
      note: "Spinning up VMs, running docker compose stacks I don't want eating Mac RAM, kernel-adjacent experiments.",
    },
    {
      name: "Custom PC",
      detail: "Windows",
      note: "Heavier tasks that play nicer on Windows. Also the desk-bound deploy/observability cockpit.",
    },
    {
      name: "iPad 11th gen",
      detail: "Gaming + reading",
      note: "Off-hours device. Casual games, technical PDFs, occasional Figma scrub.",
    },
    {
      name: "Android phone",
      detail: "Daily phone",
      note: "Push notifications, on-call paging, testing mobile flows for whatever I'm shipping.",
    },
  ],
};

const os: Group = {
  id: "os",
  title: "Operating Systems",
  icon: Monitor,
  items: [
    { name: "macOS", detail: "Mac" },
    { name: "Linux", detail: "ThinkPad — daily Linux work" },
    { name: "Windows 11", detail: "Desktop PC" },
    { name: "Android", detail: "Phone" },
    { name: "iPadOS", detail: "iPad" },
  ],
};

const editor: Group = {
  id: "editor",
  title: "Editor & Terminal",
  icon: TerminalIcon,
  intro: "Optimized for short feedback loops. Keyboard-first, mouse only when I have to.",
  items: [
    { name: "VS Code", detail: "Primary editor", note: "TypeScript/Node work. GitHub Copilot + Claude Code." },
    { name: "Neovim", detail: "Quick edits over SSH" },
    { name: "iTerm2 / Warp", detail: "Mac terminals" },
    { name: "Zsh", detail: "Shell", note: "Plain config — fast prompt, fzf, zoxide. No Oh-My-Zsh bloat." },
    { name: "tmux", detail: "Session manager on remote boxes" },
  ],
};

const tools: Group = {
  id: "tools",
  title: "Tools I Use Daily",
  icon: Wrench,
  items: [
    { name: "Docker", detail: "Local stacks, every project" },
    { name: "Postman / Bruno", detail: "API design + manual testing" },
    { name: "TablePlus", detail: "Postgres + Mongo browsing" },
    { name: "Linear", detail: "Personal + team task tracking" },
    { name: "Notion", detail: "Long-form notes + RFCs" },
    { name: "Figma", detail: "When I have to touch design" },
    { name: "Excalidraw", detail: "System diagrams" },
    { name: "GitHub", detail: "Code home" },
    { name: "Vercel", detail: "This site lives here" },
  ],
};

const stack: Group = {
  id: "stack",
  title: "Languages & Runtimes",
  icon: Code2,
  intro: "What I reach for first depends on the problem. Listed by how much keyboard time each gets.",
  items: [
    { name: "TypeScript", detail: "Daily. Node + occasional React." },
    { name: "Node.js", detail: "Runtime of choice for services + scripts." },
    { name: "NestJS / Express / Fastify", detail: "Depending on team conventions." },
    { name: "Go", detail: "Currently learning — see /now." },
    { name: "Python", detail: "Bots, scrapers, glue scripts." },
    { name: "MongoDB / PostgreSQL / Redis", detail: "Data layer rotation." },
    { name: "RabbitMQ / Kafka", detail: "Async messaging." },
  ],
};

const offHours: Group = {
  id: "off-hours",
  title: "Off Hours",
  icon: Gamepad2,
  items: [
    { name: "iPad gaming", detail: "Casual sessions — quick rounds between work blocks" },
    { name: "Tech books + RFCs", detail: "Mostly distributed systems + database internals" },
  ],
};

const groups = [machines, os, editor, tools, stack, offHours];

function SectionHeader({ group }: { group: Group }) {
  const Icon = group.icon;
  return (
    <div className="mb-5">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-lg bg-primary/8 border border-primary/15 flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary/80" aria-hidden />
        </div>
        <h2 className="font-display text-xl sm:text-2xl font-bold text-white/90">
          {group.title}
        </h2>
      </div>
      {group.intro && (
        <p className="text-sm text-white/45 leading-relaxed pl-12">
          {group.intro}
        </p>
      )}
    </div>
  );
}

function ItemRow({ item }: { item: Item }) {
  return (
    <li className="group flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 py-3 border-b border-white/[0.04] last:border-b-0">
      <div className="flex items-baseline gap-3 min-w-0 sm:min-w-[220px]">
        <span className="w-1 h-1 rounded-full bg-primary/40 flex-shrink-0 translate-y-[-3px]" aria-hidden />
        <span className="font-display font-semibold text-white/85 text-[15px]">
          {item.name}
        </span>
      </div>
      {item.detail && (
        <span className="text-xs font-mono text-primary/55 sm:flex-shrink-0">
          {item.detail}
        </span>
      )}
      {item.note && (
        <span className="text-sm text-white/45 leading-relaxed sm:flex-1">
          {item.note}
        </span>
      )}
    </li>
  );
}

export default function UsesPage() {
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
            Uses
          </span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
        {/* Header */}
        <header className="mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/8 border border-primary/15 text-primary text-xs font-mono mb-5 uppercase tracking-widest">
            Inventory
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
            What I <span className="gradient-text-cyan">Use</span>
          </h1>
          <p className="text-white/50 text-base md:text-lg max-w-2xl leading-relaxed">
            The hardware, software and daily-driver tools I reach for when
            building things. A living inventory — when something changes here,
            it changed because the old thing wasn&apos;t working.
          </p>
          <p className="text-xs font-mono text-white/30 mt-4">
            Last reviewed {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
        </header>

        {/* Groups */}
        <div className="space-y-14">
          {groups.map((group) => (
            <section key={group.id} id={group.id} aria-label={group.title}>
              <SectionHeader group={group} />
              <ul className="pl-12">
                {group.items.map((item) => (
                  <ItemRow key={item.name} item={item} />
                ))}
              </ul>
            </section>
          ))}
        </div>

        {/* Footer link */}
        <div className="mt-20 pt-10 border-t border-white/[0.06] flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <p className="text-sm text-white/40">
            Curious what I&apos;m working on this month?
          </p>
          <Link
            href="/now"
            className="inline-flex items-center gap-2 text-sm font-mono text-primary/80 hover:text-primary transition-colors group"
          >
            Read /now
            <span className="transition-transform group-hover:translate-x-0.5" aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
