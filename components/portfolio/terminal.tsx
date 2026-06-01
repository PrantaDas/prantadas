"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useDragControls,
  useMotionValue,
} from "framer-motion";
import {
  X,
  Minus,
  Maximize2,
  Minimize2,
  Terminal as TerminalIcon,
} from "lucide-react";

// ============================================================
// Terminal command registry
// ============================================================

const OWNER = "pranta";
const HOST = "portfolio";

interface CommandOutput {
  type: "text" | "table" | "link" | "error" | "success" | "highlight" | "art";
  content:
    | string
    | string[]
    | Array<{ label: string; value: string; href?: string }>;
}

function makeText(content: string): CommandOutput {
  return { type: "text", content };
}
function makeSuccess(content: string): CommandOutput {
  return { type: "success", content };
}
function makeError(content: string): CommandOutput {
  return { type: "error", content };
}
function makeHighlight(content: string): CommandOutput {
  return { type: "highlight", content };
}
function makeLinks(
  items: Array<{ label: string; value: string; href?: string }>,
): CommandOutput {
  return { type: "link", content: items };
}
function makeArt(content: string): CommandOutput {
  return { type: "art", content };
}

type CommandResult = CommandOutput[];

const COMMANDS: Record<string, () => CommandResult> = {
  help: () => [
    makeHighlight("━━━ Available Commands ━━━"),
    makeText("  about        → Who am I"),
    makeText("  skills       → Tech stack"),
    makeText("  projects     → Open source & professional work"),
    makeText("  experience   → Career timeline"),
    makeText("  contact      → Get in touch"),
    makeText("  socials      → Social links"),
    makeText("  stack        → Current tech stack"),
    makeText("  now          → What I'm working on"),
    makeText("  certifications → My certifications"),
    makeText("  clear        → Clear terminal"),
    makeText("  whoami       → System identity"),
    makeText("  sudo rm -rf /→ 😈"),
    makeText(""),
    makeText("  Type any command to execute."),
  ],

  about: () => [
    makeArt(
      `  ██████╗ ██████╗  █████╗ ███╗   ██╗████████╗ █████╗ 
  ██╔══██╗██╔══██╗██╔══██╗████╗  ██║╚══██╔══╝██╔══██╗
  ██████╔╝██████╔╝███████║██╔██╗ ██║   ██║   ███████║
  ██╔═══╝ ██╔══██╗██╔══██║██║╚██╗██║   ██║   ██╔══██║
  ██║     ██║  ██║██║  ██║██║ ╚████║   ██║   ██║  ██║
  ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝`,
    ),
    makeHighlight("Pranta Das — Backend Developer"),
    makeText(""),
    makeText("  Location   : Dhanmondi 32, Dhaka-1210, Bangladesh"),
    makeText("  Role       : Team Lead (Backend) @ Root Devs"),
    makeText("  Status     : 🟢 Available for opportunities"),
    makeText(""),
    makeText(
      "  An edacious programming enthusiast who loves the art of coding.",
    ),
    makeText(
      "  Always looking for perfection in my craft, but never satisfied",
    ),
    makeText("  with what I have done, so I bring improvisation every day."),
    makeText(""),
    makeHighlight(
      `  "We do this not because it is easy, but because we thought it would be easy"`,
    ),
  ],

  skills: () => [
    makeHighlight("━━━ Tech Stack ━━━"),
    makeText(""),
    makeText("  Languages   : JavaScript · TypeScript"),
    makeText("  Frontend    : React.js"),
    makeText("  Backend     : Node.js · Express.js · Nest.js"),
    makeText("  APIs        : REST · GraphQL · tRPC · Socket.io"),
    makeText("  Databases   : MongoDB · PostgreSQL · Redis"),
    makeText("  ORM         : Mongoose · Prisma"),
    makeText("  Messaging   : RabbitMQ · Kafka"),
    makeText("  Blockchain  : Web3.js · Ethers.js · OpenSea.js"),
    makeText("  Bots        : Telegraf.js · Discord.js"),
    makeText("  Automation  : Selenium · Puppeteer · Beautiful Soup"),
  ],

  projects: () => [
    makeHighlight("━━━ Featured Projects ━━━"),
    makeText(""),
    makeText("  Open Source:"),
    makeText(
      "  ├─ al-quran-sdk     TypeScript SDK for Quran data (verses, audio, translations)",
    ),
    makeText("  ├─ Qbit-Go          Telegram torrent downloader bot (Go)"),
    makeText("  ├─ TelegramBot-Scaffold  Telegraf.js boilerplate starter"),
    makeText("  ├─ SeaDisc          OpenSea → Discord NFT event bot"),
    makeText("  └─ Miintfun-NFT-Buy-Bot  Web3 NFT minting bot (Python)"),
    makeText(""),
    makeText("  Professional:"),
    makeText("  ├─ CNF Sports       Live football streaming platform"),
    makeText(
      "  ├─ CNF Cart         Centralized payment gateway (Stripe + Crypto)",
    ),
    makeText("  ├─ Joltori          Online houseboat booking system"),
    makeText("  ├─ Scrumo           Project management app (ClickUp-inspired)"),
    makeText(
      "  └─ Cross Distance   Teacher-student tutoring + escrow platform",
    ),
    makeText(""),
    makeText("  → github.com/Prantadas"),
  ],

  experience: () => [
    makeHighlight("━━━ Career Timeline ━━━"),
    makeText(""),
    makeSuccess("  ● [Current] Team Lead (Backend)"),
    makeText("    Root Devs · Jan 2026 — Present"),
    makeText(""),
    makeText("  ○ Senior Software Engineer"),
    makeText("    Root Devs · Jul 2025 — Dec 2025"),
    makeText(""),
    makeText("  ○ Software Engineer"),
    makeText("    Root Devs · Apr 2024 — May 2025"),
    makeText(""),
    makeText("  ○ Junior Developer (MERN)"),
    makeText("    CoreDevs Ltd · Aug 2022 — Feb 2024"),
    makeText(""),
    makeHighlight("━━━ Education ━━━"),
    makeText(""),
    makeText("  ○ B.Sc. CSE — Daffodil International University (2018–2022)"),
    makeText("  ○ HSC (Science) — Cantonment College, Jashore (2016–2018)"),
  ],

  contact: () => [
    makeHighlight("━━━ Contact ━━━"),
    makeText(""),
    makeLinks([
      {
        label: "Email",
        value: "prantodas043@gmail.com",
        href: "mailto:prantodas043@gmail.com",
      },
      { label: "Phone", value: "+8801708088432", href: "tel:+8801708088432" },
      {
        label: "GitHub",
        value: "github.com/Prantadas",
        href: "https://github.com/Prantadas",
      },
      {
        label: "LinkedIn",
        value: "linkedin.com/in/pranta-das7",
        href: "https://linkedin.com/in/pranta-das7",
      },
    ]),
    makeText(""),
    makeText("  → Scroll to the Contact section to send a message"),
  ],

  socials: () => [
    makeHighlight("━━━ Social Links ━━━"),
    makeText(""),
    makeLinks([
      {
        label: "GitHub",
        value: "github.com/Prantadas",
        href: "https://github.com/Prantadas",
      },
      {
        label: "LinkedIn",
        value: "linkedin.com/in/pranta-das7",
        href: "https://linkedin.com/in/pranta-das7",
      },
      {
        label: "Email",
        value: "prantodas043@gmail.com",
        href: "mailto:prantodas043@gmail.com",
      },
    ]),
  ],

  stack: () => [
    makeHighlight("━━━ Current Production Stack ━━━"),
    makeText(""),
    makeText("  Runtime    : Node.js 20 LTS"),
    makeText("  Framework  : NestJS + Express"),
    makeText("  Language   : TypeScript (strict mode)"),
    makeText("  Database   : PostgreSQL + Redis"),
    makeText("  ORM        : Prisma"),
    makeText("  Messaging  : RabbitMQ / Kafka"),
    makeText("  API Style  : REST + WebSockets"),
    makeText("  Auth       : JWT + OAuth2"),
    makeText("  Deployment : Docker + CI/CD"),
  ],

  now: () => [
    makeHighlight("━━━ What I'm Up To ━━━"),
    makeText(""),
    makeSuccess("  Currently:"),
    makeText("  · Leading backend engineering at Root Devs"),
    makeText("  · Building high-scale streaming & payment platforms"),
    makeText("  · Exploring distributed systems architecture"),
    makeText(""),
    makeText("  Learning:"),
    makeText("  · Rust (systems programming)"),
    makeText("  · Advanced Kafka patterns"),
    makeText("  · ML-powered API optimizations"),
    makeText(""),
    makeText("  Open to:"),
    makeText("  · Interesting backend challenges"),
    makeText("  · Open source collaborations"),
    makeText("  · Senior / Lead engineering roles"),
  ],

  certifications: () => [
    makeHighlight("━━━ HackerRank Certifications ━━━"),
    makeText(""),
    makeText(
      "  ✓ JavaScript (Basic)      — hackerrank.com/certificates/3649f3f8a63e",
    ),
    makeText(
      "  ✓ JavaScript (Intermediate) — hackerrank.com/certificates/69ffdfb90e03",
    ),
    makeText(
      "  ✓ REST API (Intermediate) — hackerrank.com/certificates/1554873c1801",
    ),
    makeText(
      "  ✓ Node.js (Basic)         — hackerrank.com/certificates/e1ac52a86ead",
    ),
    makeText(
      "  ✓ Node.js (Intermediate)  — hackerrank.com/certificates/ea037f5445a4",
    ),
  ],

  whoami: () => [
    makeText(`${OWNER}@${HOST}`),
    makeText(""),
    makeText(
      "  uid=1337(pranta) gid=1337(backend) groups=1337(backend),42(nodejs),69(typescript)",
    ),
    makeText(""),
    makeSuccess("  Roles: backend_dev, team_lead, open_source_contributor"),
  ],

  "sudo rm -rf /": () => [
    makeError("  sudo: seriously? nice try."),
    makeText("  Your permissions: none. The craft lives on."),
  ],

  sudo: () => [
    makeError("  [sudo] password for visitor: "),
    makeText("  Sorry, try again."),
    makeError("  sudo: 3 incorrect password attempts"),
  ],

  ls: () => [
    makeText("  projects/    skills/    experience/    certifications/"),
    makeText("  about.md     contact.md    README.md"),
  ],

  pwd: () => [makeText("/home/pranta/portfolio")],

  date: () => [makeText(`  ${new Date().toString()}`)],

  uname: () => [
    makeText("  PrantaOS 3.0.0 portfolio-server #1 SMP PREEMPT_DYNAMIC"),
  ],

  echo: () => [
    makeText("  Usage: echo <message> — I can only echo your admiration."),
  ],

  neofetch: () => [
    makeArt(
      `       ██████           pranta@portfolio
      ██░░░░██          ─────────────────
     ██░░░░░░██         OS: PrantaOS 3.0
     ██░░░░░░██         Shell: Portfolio CLI
      ████████           Role: Backend Dev
                         Stack: Node.js + TS
                         Exp: 3+ years
                         Status: Available 🟢`,
    ),
  ],

  matrix: () => [
    makeSuccess("  Initializing matrix..."),
    makeText("  01001000 01100101 01101100 01101100 01101111"),
    makeText("  Wake up, developer. The Matrix has you."),
    makeText("  Follow the white rabbit → github.com/Prantadas"),
  ],
};

// ============================================================
// History line type
// ============================================================

interface HistoryLine {
  id: number;
  command?: string;
  output: CommandOutput[];
}

// ============================================================
// Terminal component
// ============================================================

interface TerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Terminal({ isOpen, onClose }: TerminalProps) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryLine[]>([
    {
      id: 0,
      output: [
        makeArt("  Welcome to Pranta Das's Portfolio Terminal"),
        makeText("  Type 'help' for available commands. Have fun exploring!"),
        makeText(""),
      ],
    },
  ]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [size, setSize] = useState({ width: 680, height: 480 });

  // Drag motion values — separate from framer-motion's animate/initial y
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  const dragControls = useDragControls();
  const savedPosition = useRef({ x: 0, y: 0 });
  const resizeState = useRef({
    active: false,
    startX: 0,
    startY: 0,
    startW: 0,
    startH: 0,
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(1);

  // Reset state when terminal closes
  useEffect(() => {
    if (!isOpen) {
      dragX.set(0);
      dragY.set(0);
      setIsFullscreen(false);
      setIsMinimized(false);
    }
  }, [isOpen, dragX, dragY]);

  // Focus input when opened / restored
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  // Auto-scroll to bottom on new output
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  // Escape exits fullscreen first; if not fullscreen, portfolio-client closes it
  useEffect(() => {
    if (!isFullscreen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        dragX.set(savedPosition.current.x);
        dragY.set(savedPosition.current.y);
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [isFullscreen, dragX, dragY]);

  const handleToggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => {
      if (prev) {
        dragX.set(savedPosition.current.x);
        dragY.set(savedPosition.current.y);
        return false;
      } else {
        savedPosition.current = { x: dragX.get(), y: dragY.get() };
        dragX.set(0);
        dragY.set(0);
        setIsMinimized(false);
        return true;
      }
    });
  }, [dragX, dragY]);

  const startResize = useCallback(
    (e: React.MouseEvent) => {
      if (isFullscreen) return;
      e.preventDefault();
      e.stopPropagation();
      resizeState.current = {
        active: true,
        startX: e.clientX,
        startY: e.clientY,
        startW: size.width,
        startH: size.height,
      };
      const onMove = (ev: MouseEvent) => {
        if (!resizeState.current.active) return;
        setSize({
          width: Math.max(
            400,
            resizeState.current.startW +
              ev.clientX -
              resizeState.current.startX,
          ),
          height: Math.max(
            300,
            resizeState.current.startH +
              ev.clientY -
              resizeState.current.startY,
          ),
        });
      };
      const onUp = () => {
        resizeState.current.active = false;
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [isFullscreen, size],
  );

  const runCommand = useCallback((raw: string) => {
    const trimmed = raw.trim().toLowerCase();
    if (!trimmed) return;

    const output: CommandOutput[] = [];

    if (trimmed === "clear") {
      setHistory([]);
      setCmdHistory((prev) => [raw, ...prev]);
      setHistoryIndex(-1);
      setInput("");
      return;
    }

    const handler = COMMANDS[trimmed];
    if (handler) {
      output.push(...handler());
    } else {
      output.push(makeError(`  command not found: ${trimmed}`));
      output.push(makeText("  Type 'help' to see available commands."));
    }

    setHistory((prev) => [
      ...prev,
      { id: idRef.current++, command: raw, output },
    ]);
    setCmdHistory((prev) => [raw, ...prev]);
    setHistoryIndex(-1);
    setInput("");
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      runCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(historyIndex + 1, cmdHistory.length - 1);
      setHistoryIndex(next);
      setInput(cmdHistory[next] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(historyIndex - 1, -1);
      setHistoryIndex(next);
      setInput(next === -1 ? "" : (cmdHistory[next] ?? ""));
    } else if (e.key === "Tab") {
      e.preventDefault();
      const cmds = Object.keys(COMMANDS);
      const match = cmds.find((c) => c.startsWith(input.toLowerCase()));
      if (match) setInput(match);
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setHistory([]);
    }
  };

  const windowedStyle = {
    bottom: 24,
    right: 24,
    width: size.width,
    height: isMinimized ? 44 : size.height,
    maxWidth: "calc(100vw - 48px)",
    maxHeight: "calc(100vh - 48px)",
    borderRadius: "0.75rem",
  } as const;

  const fullscreenStyle = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    borderRadius: 0,
  } as const;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          drag={!isFullscreen && !isMinimized}
          dragControls={dragControls}
          dragListener={false}
          dragMomentum={false}
          dragElastic={0}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ type: "spring", damping: 28, stiffness: 320 }}
          className="fixed z-[9990] flex flex-col border border-white/10 shadow-2xl overflow-hidden"
          style={{
            x: dragX,
            y: dragY,
            background: "rgba(6, 8, 14, 0.93)",
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            ...(isFullscreen ? fullscreenStyle : windowedStyle),
          }}
        >
          {/* ── Title bar ── */}
          <div
            className="relative flex-shrink-0 flex items-center px-4 h-11 border-b border-white/[0.06] select-none"
            style={{ cursor: isFullscreen || isMinimized ? "default" : "grab" }}
            onPointerDown={
              !isFullscreen && !isMinimized
                ? (e) => dragControls.start(e)
                : undefined
            }
          >
            {/* macOS traffic lights */}
            <div className="flex items-center gap-1.5 group/tl relative z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                title="Close"
                className="w-3 h-3 rounded-full bg-[#ff5f57] flex items-center justify-center hover:brightness-110 transition-all"
              >
                <X className="w-1.5 h-1.5 text-[#820005] opacity-0 group-hover/tl:opacity-100 transition-opacity" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMinimized((v) => !v);
                }}
                title={isMinimized ? "Restore" : "Minimize"}
                className="w-3 h-3 rounded-full bg-[#febc2e] flex items-center justify-center hover:brightness-110 transition-all"
              >
                <Minus className="w-1.5 h-1.5 text-[#6d4e00] opacity-0 group-hover/tl:opacity-100 transition-opacity" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleFullscreen();
                }}
                title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                className="w-3 h-3 rounded-full bg-[#28c840] flex items-center justify-center hover:brightness-110 transition-all"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-1.5 h-1.5 text-[#004d12] opacity-0 group-hover/tl:opacity-100 transition-opacity" />
                ) : (
                  <Maximize2 className="w-1.5 h-1.5 text-[#004d12] opacity-0 group-hover/tl:opacity-100 transition-opacity" />
                )}
              </button>
            </div>

            {/* Center title — pointer-events-none so drag still works */}
            <div className="absolute inset-0 flex items-center justify-center gap-1.5 pointer-events-none">
              <TerminalIcon className="w-3 h-3 text-white/30" />
              <span className="text-xs font-mono text-white/40 tracking-wide">
                {OWNER}@{HOST} — zsh
              </span>
            </div>
          </div>

          {/* ── Body (output + input) ── */}
          {!isMinimized && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Scrollable output — wheel events isolated from page */}
              <div
                className="flex-1 overflow-y-auto overflow-x-hidden font-mono text-xs leading-relaxed p-4 space-y-1 select-text"
                onWheel={(e) => e.stopPropagation()}
                onClick={() => inputRef.current?.focus()}
              >
                {history.map((entry) => (
                  <div key={entry.id}>
                    {entry.command !== undefined && (
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-emerald-400/80 shrink-0">
                          {OWNER}@{HOST}
                        </span>
                        <span className="text-white/25">:</span>
                        <span className="text-blue-400/70">~</span>
                        <span className="text-white/25">$</span>
                        <span className="text-white/85 ml-1 break-all">
                          {entry.command}
                        </span>
                      </div>
                    )}
                    {entry.output.map((line, j) => (
                      <OutputLine key={j} line={line} />
                    ))}
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              {/* Input line */}
              <div className="flex-shrink-0 flex items-center gap-1 px-4 py-2.5 border-t border-white/[0.06] bg-[rgba(6,8,14,0.98)]">
                <span className="text-emerald-400/80 font-mono text-xs shrink-0">
                  {OWNER}@{HOST}
                </span>
                <span className="text-white/25 font-mono text-xs">:</span>
                <span className="text-blue-400/70 font-mono text-xs">~</span>
                <span className="text-white/25 font-mono text-xs">$</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 ml-2 bg-transparent border-0 border-none outline-none ring-0 focus:ring-0 focus:outline-none focus:border-none text-white/90 caret-primary font-mono text-xs"
                  spellCheck={false}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                />
              </div>
            </div>
          )}

          {/* ── SE resize grip ── */}
          {!isFullscreen && !isMinimized && (
            <div
              className="absolute bottom-0 right-0 w-5 h-5 z-20 cursor-se-resize flex items-end justify-end p-1"
              onMouseDown={startResize}
            >
              <svg
                width="8"
                height="8"
                viewBox="0 0 8 8"
                className="text-white/20 pointer-events-none"
              >
                <path
                  d="M7 1L1 7M7 4L4 7"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function OutputLine({ line }: { line: CommandOutput }) {
  if (line.type === "error") {
    return <div className="text-red-400/80">{line.content as string}</div>;
  }
  if (line.type === "success") {
    return <div className="text-emerald-400/80">{line.content as string}</div>;
  }
  if (line.type === "highlight") {
    return (
      <div className="text-primary/80 font-semibold">
        {line.content as string}
      </div>
    );
  }
  if (line.type === "art") {
    return (
      <pre className="text-primary/40 text-[9px] leading-[1.4] whitespace-pre overflow-x-auto">
        {line.content as string}
      </pre>
    );
  }
  if (line.type === "link" && Array.isArray(line.content)) {
    const items = line.content as Array<{
      label: string;
      value: string;
      href?: string;
    }>;
    return (
      <div className="space-y-1">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <span className="text-white/30 w-12 flex-shrink-0">
              {item.label}
            </span>
            {item.href ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary/80 hover:text-primary transition-colors underline underline-offset-2"
              >
                {item.value}
              </a>
            ) : (
              <span className="text-white/60">{item.value}</span>
            )}
          </div>
        ))}
      </div>
    );
  }
  return <div className="text-white/50">{line.content as string}</div>;
}
